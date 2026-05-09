import { z } from 'zod';
import type { Diagnosis, DiagnosisExtras } from '@/types/diagnosis';

// Schema do retorno do backend Railway (POST /v1/diagnostico).
// 21 campos, snake_case PT-BR, persona Doutor Gentileza v3.
// Espelhado em https://github.com/terra-gentil/terra-gentil-app/tree/main/backend.
const backendSchema = z.object({
  eh_planta: z.boolean(),
  especie_identificada: z.string(),
  nome_popular: z.string(),
  confianca: z.number().min(0).max(1),
  estado_saude: z.enum(['saudavel', 'atencao', 'doente', 'critico', 'nao_aplicavel']),
  toxica_para_pets: z.boolean(),
  toxicidade_detalhes: z.string(),
  nivel_luz: z.enum(['sol_pleno', 'meia_sombra', 'indireta_brilhante', 'sombra', 'nao_aplicavel']),
  rega_dias: z.number().int().min(0).max(60),
  rega_condicao: z.string(),
  temperatura_ideal: z.string(),
  nivel_dificuldade: z.enum(['facil', 'medio', 'dificil', 'nao_aplicavel']),
  luz_porcentagem: z.number().int().min(0).max(100),
  luz_veredito: z.string(),
  diagnostico_titulo: z.string(),
  diagnostico_explicacao: z.string(),
  problemas_detectados: z.array(
    z.object({
      descricao: z.string(),
      gravidade: z.string(),
      causa_provavel: z.string(),
    }),
  ),
  plano_tratamento: z.string(),
  plano_timeline: z.array(z.object({ etapa: z.string(), acao: z.string() })),
  precisa_retorno: z.boolean(),
  mensagem_retorno: z.string(),
});

export type BackendDiagnostico = z.infer<typeof backendSchema>;

export function parseBackendResponse(raw: unknown): BackendDiagnostico {
  return backendSchema.parse(raw);
}

const NIVEL_LUZ_LABEL: Record<BackendDiagnostico['nivel_luz'], string> = {
  sol_pleno: 'Sol pleno',
  meia_sombra: 'Meia-sombra',
  indireta_brilhante: 'Luz indireta',
  sombra: 'Sombra',
  nao_aplicavel: 'Nao se aplica',
};

const NIVEL_DIFICULDADE_LABEL: Record<BackendDiagnostico['nivel_dificuldade'], string> = {
  facil: 'Facil',
  medio: 'Medio',
  dificil: 'Dificil',
  nao_aplicavel: 'Nao se aplica',
};

function formatRega(dias: number, condicao: string): string {
  if (dias <= 0) return condicao || 'Sob demanda';
  if (dias === 1) return 'Todo dia';
  if (dias === 7) return '1x por semana';
  if (dias === 14) return 'A cada 2 semanas';
  if (dias === 30) return '1x por mes';
  if (dias < 7) return `A cada ${dias} dias`;
  return `A cada ${dias} dias`;
}

export function mapBackendToExtras(b: BackendDiagnostico): DiagnosisExtras {
  return {
    confidence: b.confianca,
    healthStatus: b.estado_saude,
    lightQuality: { percent: b.luz_porcentagem, verdict: b.luz_veredito },
    detectedProblems: b.problemas_detectados.map((p) => ({
      description: p.descricao,
      severity: p.gravidade,
      cause: p.causa_provavel,
    })),
    treatmentPlan: b.plano_tratamento,
    needsFollowup: { required: b.precisa_retorno, message: b.mensagem_retorno },
  };
}

export function mapBackendToDiagnosis(b: BackendDiagnostico): Diagnosis {
  return {
    plantName: b.nome_popular || b.especie_identificada,
    scientificName: b.especie_identificada,
    welcomeMessage: b.diagnostico_explicacao,
    toxicity: {
      isToxic: b.toxica_para_pets,
      details: b.toxicidade_detalhes,
    },
    diagnosis: {
      problem: b.diagnostico_titulo,
      description: b.diagnostico_explicacao,
    },
    stats: {
      light: NIVEL_LUZ_LABEL[b.nivel_luz],
      watering: formatRega(b.rega_dias, b.rega_condicao),
      temperature: b.temperatura_ideal,
      difficulty: NIVEL_DIFICULDADE_LABEL[b.nivel_dificuldade],
    },
    treatment: b.plano_timeline.map((t) => ({ period: t.etapa, action: t.acao })),
    extras: mapBackendToExtras(b),
  };
}
