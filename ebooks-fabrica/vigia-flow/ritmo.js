// TG Vigia, ritmo humano (funcoes puras, sem DOM). Carregado antes dos outros scripts de conteudo, no mundo
// isolado da extensao: globalThis.TG aqui NAO e visivel para a pagina do Flow. Entrega: TG.jitter (espera
// aleatoria dentro de uma faixa), TG.sinalDeParada (le o texto da tela e diz se o Flow reclamou),
// TG.falha2k (aviso de falha no aumento de resolucao) e TG.criarLimitador (teto de acoes por minuto).
(() => {
  const TG = globalThis.TG || (globalThis.TG = {});

  // Espera em ms dentro de [min, max]. Media de dois sorteios: concentra no meio, como gente, sem valor fixo.
  TG.jitter = (min, max, rnd = Math.random) => Math.round(min + (max - min) * ((rnd() + rnd()) / 2));

  // "incomum" = aviso de atividade incomum; "limite" = Limite do Flow. Qualquer um dos dois: parar na hora.
  TG.sinalDeParada = (texto) => {
    const t = String(texto || "");
    if (/atividade incomum|unusual activity/i.test(t)) return "incomum";
    if (/Limite do Flow/i.test(t)) return "limite";
    return "";
  };

  TG.falha2k = (texto) => /Falha no aumento de resolu/i.test(String(texto || ""));

  // Janela deslizante de 60 s: quantoEsperar() devolve 0 se ainda cabe uma acao, ou os ms que faltam.
  TG.criarLimitador = (porMinuto, agora = Date.now) => {
    const marcas = [];
    return {
      quantoEsperar() {
        const t = agora();
        while (marcas.length && t - marcas[0] >= 60000) marcas.shift();
        return marcas.length < porMinuto ? 0 : 60000 - (t - marcas[0]);
      },
      registrar() { marcas.push(agora()); },
    };
  };
})();
