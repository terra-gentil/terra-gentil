import Image from 'next/image';
import type { ReactNode } from 'react';
import type { Bloco, GuiaFoto } from '@/lib/guias';

const CLASSE_CALLOUT = { dica: 'lv-dica', alerta: 'lv-alerta', faca: 'lv-faca', missao: 'lv-missao' } as const;

const tracos = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const };

/** Icones da ficha da planta (os mesmos do livro). Chave: rotulo sem acento e em maiusculas. */
const ICONES: Record<string, ReactNode> = {
  LUZ: (
    <svg width="28" height="28" viewBox="0 0 24 24" {...tracos}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
    </svg>
  ),
  AGUA: (
    <svg width="28" height="28" viewBox="0 0 24 24" {...tracos}>
      <path d="M12 3c3.6 4.4 6 7.7 6 11a6 6 0 0 1-12 0c0-3.3 2.4-6.6 6-11z" />
    </svg>
  ),
  TERRA: (
    <svg width="28" height="28" viewBox="0 0 24 24" {...tracos}>
      <path d="M12 3.5 21 8l-9 4.5L3 8z" />
      <path d="m3 12.2 9 4.5 9-4.5" />
      <path d="m3 16.2 9 4.5 9-4.5" />
    </svg>
  ),
  CLIMA: (
    <svg width="28" height="28" viewBox="0 0 24 24" {...tracos}>
      <path d="M10 14.3V5a2 2 0 0 1 4 0v9.3a4 4 0 1 1-4 0z" />
      <path d="M12 10v7" />
    </svg>
  ),
  DIFICULDADE: (
    <svg width="28" height="28" viewBox="0 0 24 24" {...tracos}>
      <path d="M3.5 18a8.5 8.5 0 0 1 17 0" />
      <path d="M12 18l3.8-4.6" />
      <circle cx="12" cy="18" r="1.2" fill="currentColor" />
    </svg>
  ),
  PET: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="6.5" cy="10.5" r="1.9" />
      <circle cx="10" cy="6.6" r="1.9" />
      <circle cx="14" cy="6.6" r="1.9" />
      <circle cx="17.5" cy="10.5" r="1.9" />
      <path d="M12 11.6c-3 0-5.2 3.4-5.2 5.5 0 1.7 1.5 2.5 3 1.9.9-.4 1.5-.6 2.2-.6s1.3.2 2.2.6c1.5.6 3-.2 3-1.9 0-2.1-2.2-5.5-5.2-5.5z" />
    </svg>
  ),
};

function chaveIcone(rotulo: string): string {
  const k = rotulo.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
  return k.startsWith('PET') ? 'PET' : k;
}

/** As fotos entram dentro do passo a passo quando ha uma foto por passo (padrao dos livros). */
export function fotosNosPassos(blocos: Bloco[], fotos: GuiaFoto[]): boolean {
  return blocos.some((b) => b.tipo === 'passos' && b.itens.length === fotos.length && fotos.length > 0);
}

/** Desenha os blocos do livro. Todo texto aqui e o do livro, sem edicao. */
export function Blocos({ blocos, fotos = [] }: { blocos: Bloco[]; fotos?: GuiaFoto[] }) {
  return (
    <>
      {blocos.map((b, i) => {
        switch (b.tipo) {
          case 'p':
            return <p key={i}>{b.texto}</p>;
          case 'rotulo':
            return (
              <p key={i} className="lv-rotulo">
                {b.texto}
              </p>
            );
          case 'campos':
            return (
              <dl key={i} className="lv-campos">
                {b.itens.map((c) => {
                  const chave = chaveIcone(c.rotulo);
                  const icone = ICONES[chave];
                  const pet = chave === 'PET';
                  const [primeira, ...resto] = c.rotulo.split(' ');
                  return (
                    <div key={c.rotulo} className={`lv-campo${pet ? ' lv-campo--pet' : ''}`}>
                      {icone && (
                        <span className="lv-icone" aria-hidden="true">
                          {icone}
                        </span>
                      )}
                      <div>
                        <dt>
                          {pet ? primeira : c.rotulo}
                          {pet && resto.length > 0 && <span className="lv-pet-selo">{resto.join(' ')}</span>}
                        </dt>
                        <dd>{c.texto}</dd>
                      </div>
                    </div>
                  );
                })}
              </dl>
            );
          case 'passos': {
            const comFoto = b.itens.length === fotos.length && fotos.length > 0;
            return (
              <ol key={i} className="lv-passos">
                {b.itens.map((p, k) => (
                  <li key={p.n} className="lv-passo">
                    {comFoto ? (
                      <div className="lv-passo-foto">
                        <Image src={fotos[k].src} alt={fotos[k].alt} width={fotos[k].largura} height={fotos[k].altura} sizes="104px" />
                        <span className="lv-passo-n" aria-hidden="true">
                          {p.n}
                        </span>
                      </div>
                    ) : (
                      <span className="lv-passo-n" aria-hidden="true">
                        {p.n}
                      </span>
                    )}
                    <div className="lv-passo-texto">
                      <strong>{p.titulo}</strong>
                      <span>{p.texto}</span>
                    </div>
                  </li>
                ))}
              </ol>
            );
          }
          case 'callout':
            return (
              <aside key={i} className={`lv-callout ${CLASSE_CALLOUT[b.variante]}`}>
                <strong className="lv-callout-rotulo">{b.rotulo}</strong>
                {b.linhas.map((l, k) => (
                  <p key={k}>{l}</p>
                ))}
              </aside>
            );
          case 'lista':
            return (
              <div key={i} className="lv-lista-bloco">
                {b.rotulo && <p className="lv-rotulo">{b.rotulo}</p>}
                <ul className="lv-lista">
                  {b.itens.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            );
          case 'tabela':
            return (
              <div key={i} className="lv-tabela-wrap">
                <table className="lv-tabela">
                  <thead>
                    <tr>
                      {b.cabecalho.map((c) => (
                        <th key={c} scope="col">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.linhas.map((l) => (
                      <tr key={l[0]}>
                        {l.map((c, k) =>
                          k === 0 ? (
                            <th key={k} scope="row">
                              {c}
                            </th>
                          ) : (
                            <td key={k}>{c}</td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'destaque':
            return (
              <div key={i} className="lv-destaque">
                <span className="lv-destaque-pre">{b.pre}</span>
                <span className="lv-destaque-grande">{b.grande}</span>
                <span className="lv-destaque-leg">{b.legenda}</span>
              </div>
            );
        }
      })}
    </>
  );
}

/** Fotos do livro em tamanho controlado: 1 foto centralizada, 2 a 3 lado a lado, 4 em grade. */
export function Fotos({ fotos }: { fotos: GuiaFoto[] }) {
  if (!fotos.length) return null;
  return (
    <div className="lv-fotos" data-n={fotos.length}>
      {fotos.map((f) => (
        <figure key={f.src} className="lv-foto">
          <Image src={f.src} alt={f.alt} width={f.largura} height={f.altura} sizes="(max-width: 720px) 90vw, 360px" />
          <figcaption>{f.alt}</figcaption>
        </figure>
      ))}
    </div>
  );
}
