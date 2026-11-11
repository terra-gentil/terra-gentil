// TG Vigia, laco de 2K da galeria (logica, sem DOM: tudo que toca a pagina vem em "amb", por isso da para
// testar). TG.rodarLaco2k({a, b, passo}, amb) baixa em 2K as posicoes a..b (0 = mais nova) e devolve o estado
// {a, b, i, ok, falhas, seguidas, fim, parou, log}. Travas (cada uma nasceu de um erro ou do aviso de robo):
// faixa maxima de 38 posicoes e 20 downloads por rodada; try/catch por posicao; esperas sorteadas, nunca fixas;
// teto de downloads por minuto; PARA na primeira falha de 2K, no primeiro "Limite do Flow" e no primeiro aviso
// de atividade incomum (nunca insiste, nunca tenta de novo sozinho).
(() => {
  const TG = globalThis.TG || (globalThis.TG = {});
  TG.DOWNLOADS_POR_MINUTO = 3;
  TG.MAX_DOWNLOADS = 20;

  TG.rodarLaco2k = async ({ a, b, passo = 2 }, amb) => {
    const rnd = amb.rnd || Math.random;
    const pausa = (min, max) => amb.esperar(TG.jitter(min, max, rnd));
    const est = { a, b, i: a, ok: 0, falhas: 0, seguidas: 0, fim: false, parou: "", log: [] };
    const parada = () => (amb.cancelado() ? "cancelado" : TG.sinalDeParada(amb.texto()));
    const limitador = TG.criarLimitador(TG.DOWNLOADS_POR_MINUTO, amb.agora);

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
        if (falta > 0) await amb.esperar(falta + TG.jitter(500, 4000, rnd));
        const img = amb.imagens()[i];
        if (!img) { est.log.push(i + ":sem imagem"); continue; }
        limitador.registrar();
        amb.rolar(img); await pausa(1500, 3200);
        amb.menu(img); await pausa(900, 1900);
        const dl = amb.acha("Fazer o download");
        if (!dl) { est.log.push(i + ":sem menu"); amb.fechar(); await pausa(1500, 3500); continue; }
        amb.passar(dl); await pausa(350, 900);
        amb.clicar(dl); await pausa(900, 1900);
        const k2 = amb.acha("2K");
        if (!k2) { est.log.push(i + ":sem 2K"); amb.fechar(); await pausa(1500, 3500); continue; }
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
          await pausa(4000, 9000);
          if (rnd() < 0.15) await pausa(20000, 45000); // de vez em quando, uma pausa de quem olhou outra coisa
        }
      } catch (e) {
        est.log.push(i + ":erro " + e);
        try { amb.fechar(); } catch (e2) { /* segue */ }
      }
    }
    est.fim = true; amb.relatar(est);
    return est;
  };
})();
