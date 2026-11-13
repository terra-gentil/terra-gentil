// TG Vigia, laco de 2K da galeria (logica, sem DOM: tudo que toca a pagina vem em "amb", por isso da para
// testar). TG.rodarLaco2k({a, b, passo}, amb) baixa em 2K as posicoes a..b (0 = mais nova) e devolve o estado
// {a, b, i, ok, falhas, seguidas, fim, parou, descanso, log}. Travas (cada uma nasceu de um erro ou do aviso de robo):
// faixa maxima de 38 posicoes e 4 downloads por rodada; try/catch por posicao; esperas sorteadas, nunca fixas;
// 1 download por minuto; 40 a 110 s entre fotos e descanso de 2 a 5 min a cada 2 fotos (v1.3, depois do aviso de
// atividade incomum de 13/11/2026); esperas longas em fatias que conferem a tela; so age com a aba visivel (gente
// nao clica com o botao direito numa aba escondida); nao rola a pagina se a foto ja esta na tela; para se o menu
// sumir 2 vezes; PARA na primeira falha de 2K, no primeiro "Limite do Flow" e no primeiro aviso de atividade
// incomum (nunca insiste, nunca tenta de novo sozinho).
(() => {
  const TG = globalThis.TG || (globalThis.TG = {});
  TG.DOWNLOADS_POR_MINUTO = 1;
  TG.MAX_DOWNLOADS = 4;
  TG.ENTRE_FOTOS = [40000, 110000];
  TG.DESCANSO = [120000, 300000];
  TG.DESCANSO_A_CADA = 2;
  TG.MAX_SEM_MENU = 2;

  TG.rodarLaco2k = async ({ a, b, passo = 2 }, amb) => {
    const rnd = amb.rnd || Math.random;
    const pausa = (min, max) => amb.esperar(TG.jitter(min, max, rnd));
    const est = { a, b, i: a, ok: 0, falhas: 0, seguidas: 0, fim: false, parou: "", descanso: 0, log: [] };
    const parada = () => (amb.cancelado() ? "cancelado" : TG.sinalDeParada(amb.texto()));
    const limitador = TG.criarLimitador(TG.DOWNLOADS_POR_MINUTO, amb.agora);
    let semMenu = 0;
    // espera longa em fatias de 15 a 30 s: confere aviso e cancelamento e manda sinal de vida ao receptor
    const vigiar = async (ms) => {
      let resta = ms;
      while (resta > 0 && !est.parou) {
        const fatia = Math.min(resta, TG.jitter(15000, 30000, rnd));
        est.descanso = Math.ceil(resta / 1000); amb.relatar(est);
        await amb.esperar(fatia); resta -= fatia;
        est.parou = parada();
      }
      est.descanso = 0;
    };
    const perdeuMenu = (motivo, i) => {
      est.log.push(i + ":" + motivo); amb.fechar();
      if (++semMenu >= TG.MAX_SEM_MENU) est.parou = "menu-sumiu";
    };

    if (!(a >= 0 && b >= a && passo >= 1) || b - a > 38 || Math.floor((b - a) / passo) + 1 > TG.MAX_DOWNLOADS) {
      est.parou = "faixa-invalida";
    }
    // aviso de falha antigo ainda na tela: espera sumir; se nao some, a conta esta no limite do 2K
    for (let t = 0; t < 6 && !est.parou && TG.falha2k(amb.texto()); t++) {
      await pausa(2000, 4000);
      if (t === 5) est.parou = "limite2k";
    }

    for (let i = a; i <= b && !est.parou; i += passo) {
      est.i = i; amb.relatar(est);
      try {
        est.parou = parada(); if (est.parou) break;
        const falta = limitador.quantoEsperar();
        if (falta > 0) { await vigiar(falta + TG.jitter(500, 4000, rnd)); if (est.parou) break; }
        const img = amb.imagens()[i];
        if (!img) { est.log.push(i + ":sem imagem"); continue; }
        if (amb.rolar(img)) await pausa(1500, 3200); // so rola se a foto esta fora da tela
        await pausa(1200, 3500); // olha a foto antes do clique direito
        if (!amb.visivel()) { est.parou = "sem-foco"; break; }
        limitador.registrar();
        amb.menu(img); await pausa(900, 1900);
        const dl = amb.acha("Fazer o download");
        if (!dl) { perdeuMenu("sem menu", i); await pausa(1500, 3500); continue; }
        amb.passar(dl); await pausa(350, 900);
        amb.clicar(dl); await pausa(900, 1900);
        const k2 = amb.acha("2K");
        if (!k2) { perdeuMenu("sem 2K", i); await pausa(1500, 3500); continue; }
        amb.passar(k2); await pausa(300, 900);
        amb.clicar(k2);
        let ruim = false;
        for (let t = 0; t < 8 && !ruim && !est.parou; t++) {
          await pausa(500, 900);
          ruim = TG.falha2k(amb.texto());
          est.parou = parada();
        }
        if (ruim) { est.falhas++; est.seguidas++; est.parou = "limite2k"; est.log.push(i + ":falha2k"); }
        else if (!est.parou) {
          est.ok++; est.seguidas = 0; est.log.push(i + ":ok");
          if (i + passo <= b) {
            const [min, max] = est.ok % TG.DESCANSO_A_CADA === 0 ? TG.DESCANSO : TG.ENTRE_FOTOS;
            await vigiar(TG.jitter(min, max, rnd));
          }
        }
      } catch (e) {
        est.log.push(i + ":erro " + e);
        try { amb.fechar(); } catch (e2) { /* segue */ }
      }
    }
    est.fim = true; est.descanso = 0; amb.relatar(est);
    return est;
  };
})();
