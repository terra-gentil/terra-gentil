export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  image?: string;
}

export const posts: Post[] = [
  {
    slug: 'alegria-de-transformar',
    title: 'A alegria de transformar não é só nossa — é do bairro inteiro',
    date: '2025-09-15',
    excerpt: 'Uma das maiores recompensas de transformar um espaço esquecido é ver o brilho nos olhos de quem mora por perto.',
    image: '/images/transformacao-2-antes.jpeg',
    content: `
      <p>Uma das maiores recompensas de transformar um espaço esquecido é ver o brilho nos olhos de quem mora por perto. Os vizinhos não apenas reparam — eles se aproximam, conversam, compartilham histórias.</p>
      <p>Sempre que estamos trabalhando, aparece alguém pra contar há quanto tempo aquele terreno estava daquele jeito, como os entulhos voavam com o vento e às vezes sujavam a casa deles, o quanto aquilo incomodava no dia a dia.</p>
      <p>E aí vem o sorriso, a gratidão, os elogios. Alguns até dizem: "Ficou bonito demais, viu? A gente achou que nunca mais iam mexer nisso aqui." Outros já querem saber quando o vídeo vai sair no canal.</p>
      <p>Eles estão curiosos, ansiosos, torcendo. Querem ver o resultado registrado, editado, contado. Dizem que vão mostrar pros filhos, pros amigos, que vai ser bom ver aquele antes e depois virando inspiração pra mais gente.</p>
      <p>Essas conversas no portão, esses acenos durante a gravação, essa gentileza que nasce espontânea… é tudo isso que faz o Terra Gentil ser o que é. Um projeto feito com a terra, mas também com o coração.</p>
      <p>E quando o canal estrear, vai ter muita gente por aqui assistindo com orgulho o vídeo do lugar onde mora — agora transformado em um novo começo.</p>
    `,
  },
  {
    slug: 'camera-caiu-na-gravacao',
    title: 'A câmera caiu no meio da gravação (e eu quase entrei em pânico)',
    date: '2025-07-16',
    excerpt: 'Ainda nem estreamos o Terra Gentil, e os bastidores já renderam momentos de tensão dignos de roteiro.',
    content: `
      <p>Ainda nem estreamos o Terra Gentil, e os bastidores já renderam momentos de tensão dignos de roteiro. Em um dia de testes de gravação, a câmera simplesmente caiu no meio da filmagem.</p>
      <p>Era uma correria para encontrar o melhor enquadramento, ajustar luz, cenário e som. A gravação estava rolando, e eu já pensando em tudo que ainda precisava ser resolvido para o canal finalmente sair do papel — até que veio o susto.</p>
      <p>A câmera caiu com força. A lente ficou completamente torta. Por um momento, eu paralisei. O coração disparou. Aquela sensação de "acabou tudo" tomou conta.</p>
      <p>Foram mais de uma hora tentando ajustar, com muito cuidado e paciência. No final deu certo — a lente voltou ao lugar, o equipamento sobreviveu, e a gravação pôde continuar. Mas ficou a lição: imprevistos acontecem, e a gentileza também se aplica ao jeito que a gente lida com eles.</p>
    `,
  },
  {
    slug: 'caminho-da-estreia-terra-gentil',
    title: 'A Caminho da Estreia: Como Está Sendo Criar o Canal Terra Gentil',
    date: '2025-07-15',
    excerpt: 'Criar o canal Terra Gentil tem sido uma das experiências mais intensas, desafiadoras e empolgantes da minha vida.',
    content: `
      <p>Criar o canal <em>Terra Gentil</em> tem sido uma das experiências mais intensas, desafiadoras e empolgantes da minha vida.</p>
      <p>Tudo começou com uma ideia simples: transformar quintais esquecidos em espaços vivos — e compartilhar esse processo com o mundo. Mas a realidade de fazer isso acontecer é muito mais complexa (e incrível!) do que parece.</p>
      <h3>🎥 Gravar na rua é uma aventura por si só</h3>
      <p>Estar em campo, com sol forte, barulho de motos, cachorro latindo e gente passando, já virou rotina. Às vezes, só consigo gravar um trecho depois de repetir dez vezes por causa de um caminhão que passou, ou por ter que trocar a bateria da câmera no meio do take.</p>
      <p>Mas cada detalhe vale a pena. Cada árvore podada, cada cerca limpa, cada transformação filmada é um presente que quero entregar pra quem assiste.</p>
    `,
  },
];
