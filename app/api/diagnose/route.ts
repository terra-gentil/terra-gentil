import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const apiKey = process.env.GEMINI_API_KEY;

const PROMPT = `Você é o Doutor Terra Gentil, especialista empático em plantas.

Analise a imagem da planta e retorne APENAS um JSON válido (sem markdown, sem backticks, sem explicação fora do JSON) com a estrutura EXATA:

{
  "plantName": "Nome popular da planta em português",
  "scientificName": "Nome científico em latim",
  "welcomeMessage": "Mensagem curta e empática (2 frases) como Doutor Terra Gentil recebendo a pessoa",
  "toxicity": {
    "isToxic": true ou false,
    "details": "Explicação curta sobre toxicidade para pets e crianças"
  },
  "diagnosis": {
    "problem": "Nome curto do problema identificado (ou 'Planta saudável')",
    "description": "Explicação do que está acontecendo em 2-3 frases"
  },
  "stats": {
    "light": "Ex: Meia-sombra",
    "watering": "Ex: 2x por semana",
    "temperature": "Ex: 18-25°C",
    "difficulty": "Ex: Fácil"
  },
  "treatment": [
    { "period": "Hoje", "action": "Primeira ação recomendada" },
    { "period": "Dia 3", "action": "Segunda ação" },
    { "period": "1 semana", "action": "Terceira ação" }
  ]
}

Se a imagem não for de uma planta, retorne:
{ "error": "A imagem não parece ser de uma planta. Tente novamente." }`;

export async function POST(request: Request) {
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key não configurada' },
      { status: 500 }
    );
  }

  try {
    const { image, mimeType } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'Imagem não enviada' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const models = ['gemini-2.5-flash', 'gemini-2.5-flash-lite'];

    let lastError: unknown = null;

    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([
          PROMPT,
          {
            inlineData: {
              data: image,
              mimeType: mimeType || 'image/jpeg',
            },
          },
        ]);

        const response = await result.response;
        let text = response.text().trim();

        text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

        const parsed = JSON.parse(text);

        if (parsed.error) {
          return NextResponse.json({ error: parsed.error }, { status: 400 });
        }

        return NextResponse.json(parsed);
      } catch (err) {
        lastError = err;
        continue;
      }
    }

    console.error('All models failed:', lastError);
    return NextResponse.json(
      { error: 'Não foi possível analisar a imagem. Tente novamente.' },
      { status: 500 }
    );
  } catch (err) {
    console.error('Diagnose API error:', err);
    return NextResponse.json(
      { error: 'Erro no servidor. Tente novamente.' },
      { status: 500 }
    );
  }
}
