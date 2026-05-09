export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  image?: string;
  // ID do video do YouTube relacionado (extraido da URL ?v=XXXX). Quando
  // setado, o template do blog renderiza thumbnail no topo + CTA pro canal.
  youtubeId?: string;
}

export const posts: Post[] = [
  {
    slug: 'casa-que-ia-comecar-de-novo',
    youtubeId: 'T8e8tix56tQ',
    title: 'A casa que ia começar de novo',
    date: '2026-05-09',
    excerpt:
      'A casa ia passar por uma reforma. Antes precisava resolver o jardim, a escada tomada pelo mato e o pé de romã.',
    content: `
      <p>A casa ia passar por uma reforma. O casal tinha planos, tinha projeto. Mas antes de qualquer coisa, havia um jardim inteiro para resolver, uma calçada fechada de mato e uma escada tomada pelo mato que precisavam de atenção.</p>
      <p>E havia o pé de romã.</p>
      <p>Falei sobre ele com uma palavra só: "infelizmente". A árvore era bonita, frondosa, daquele tipo que a gente olha e sente que ela pertence ao lugar. Mas estava exatamente onde a obra precisava passar. Teria que ser derrubada.</p>
      <p>Comecei pelo lado de fora. A roçadeira foi cortando a grama que cresceu por toda a extensão da calçada e do jardim frontal. O ancinho juntou tudo. O soprador deu o acabamento. As escadas foram limpas com cuidado, cada degrau tratado um por um.</p>
      <p>Depois veio a árvore.</p>
      <p>Usei uma serra manual primeiro. Depois a motosserra. O pé de romã foi sendo desmanchado pedaço por pedaço, com respeito e com a consciência de que às vezes a gente precisa abrir mão de algo bonito para construir algo novo.</p>
      <p>Quando o casal apareceu no final para ver o resultado, a reação foi direta e sincera: "Ficou muito boa, parece uma casa nova."</p>
      <p>Fiquei ali um momento, olhando para o espaço limpo, para a reforma que estava prestes a começar, para tudo que aquele terreno ainda ia se tornar. E disse o que sempre digo no final de cada trabalho, não foi cobrado nada.</p>
      <p>Essa é uma das coisas que o Terra Gentil faz que as pessoas mais demoram para entender. Não é um serviço. Não é uma ação de marketing. É uma escolha, repetida toda semana, de aparecer em uma rua, bater em uma porta e oferecer o que tem de melhor — tempo, força e vontade de fazer o bem.</p>
      <p>A casa ia começar de novo. E começou limpa.</p>
    `,
  },
  {
    slug: 'vizinha-que-disse-sim',
    youtubeId: 'kLEMv95GgE8',
    title: 'A vizinha que disse sim',
    date: '2026-05-02',
    excerpt:
      'Bati na porta e ninguém atendeu. Fui até a vizinha, expliquei e ouvi: "Pode. Ela autorizou! Tinha bicho, né, tinha bicho."',
    content: `
      <p>Quando bati na porta, ninguém atendeu.</p>
      <p>A casa estava vazia naquele momento, mas o jardim estava ali, completamente tomado pela grama que cresceu entre os pavers da entrada, ao longo do meio-fio e por toda a calçada. O dono estava fora. Mas a situação estava bem visível.</p>
      <p>Fui até a casa ao lado. Expliquei quem eu era, o que fazia e o que pretendia fazer. A vizinha ouviu, sorriu e disse: "Pode. Ela autorizou! É ótimo, porque tinha bicho, né, tinha bicho."</p>
      <p>A grama alta tinha se tornado um condomínio de insetos. A vizinha já sabia, já sentia, já estava preocupada. O jardim do lado estava afetando a própria casa dela.</p>
      <p>Eu comecei. O trabalho tinha uma dificuldade específica que eu fui logo apontando: a grama tinha crescido dentro dos pavers porque na construção não tinha sido usada a manta correta, aquela camada que impede a raiz de entrar nas brechas. Sem ela, a grama literalmente morou dentro do piso.</p>
      <p>Para tirar, foi trabalho de espátula e paciência. Fui removendo tudo com cuidado, centímetro por centímetro. Em determinado momento, segurei no ar um punhado de raízes e grama entrelaçadas que parecia uma coroa. "Olha o tamanho, pessoal", eu disse, rindo.</p>
      <p>Depois vieram a roçadeira, o ancinho, o soprador. A entrada da casa foi ganhando forma. O meio-fio foi aparecendo debaixo da grama. A calçada voltou a ser calçada.</p>
      <p>Quando terminei, mandei um email imaginário para a dona da casa: o jardim estava limpo, sem bicho, sem mato, sem nada que não devesse estar ali.</p>
      <p>Ela nem estava em casa quando aconteceu. E quando voltou, encontrou uma entrada diferente, um pouco mais bonita do que ela tinha deixado.</p>
      <p>Às vezes gentileza também acontece assim — quando a pessoa está fora, quando ela menos espera, e quando a vizinhança topa junto e abre a porta pelo gesto.</p>
    `,
  },
  {
    slug: '39-sacos-de-uma-mae-so',
    youtubeId: 'hZPHuyr9Hd0',
    title: 'Os 39 sacos de uma mãe só',
    date: '2026-04-25',
    excerpt:
      'Mãe solo, recém demitida, com um filho pequeno e um quintal que virou perigo. Dois dias de trabalho. Trinta e nove sacos de lixo.',
    content: `
      <p>Ela não quis aparecer no vídeo. Pediu para não ser filmada, e eu respeitei sem questionar.</p>
      <p>Mas ela mandou uma mensagem de voz. E essa mensagem ficou no começo do vídeo, como uma porta aberta para quem quisesse entender por que aquele dia importava.</p>
      <p>A voz dela tremia um pouco. Ela agradecia pelo "mimo que não precisava". Dizia que o resultado estava "maravilhoso, bem diferente". E dava para sentir, mesmo pela gravação, o quanto ela estava aliviada.</p>
      <p>A história dela eu contei com cuidado. Ela era mãe solo. O marido tinha ido embora. O pai, que costumava ajudar a cuidar do jardim, tinha falecido um ano antes. Ela teve um problema na perna, foi demitida por causa disso, e ficou com um filho pequeno para criar e um terreno grande para cuidar sem condições nenhuma de fazer qualquer coisa.</p>
      <p>O jardim cresceu. A prefeitura notificou. Os vizinhos jogavam lixo no espaço. Apareceram cobras, aranhas, sinais de coisas que não deveriam estar ali. A criança queria brincar no quintal e a mãe tinha medo de deixar.</p>
      <p>Eu encontrei a casa, bati na porta e propus a limpeza de graça. Ela aceitou e pediu apenas que sua identidade fosse preservada.</p>
      <p>O trabalho durou dois dias. Mais de vinte horas no total, entre a área interna e a externa. Quando tudo ficou pronto, contei os sacos de lixo. Eram trinta e nove sacos de duzentos litros. Trinta e nove.</p>
      <p>No meio do trabalho, uma pedra soltada pela roçadeira quebrou o vidro do carro do vizinho. Eu parei, expliquei o que tinha acontecido, assumi a responsabilidade e continuei. Mais tarde falei sobre isso para a câmera com humor e honestidade, porque erros acontecem, e o importante é encarar.</p>
      <p>Quando fiquei sozinho no quintal já limpo, descrevi o que sentia como "paz". A mesma paz que imaginei que ela ia sentir quando conseguisse deixar o filho brincar ali sem medo.</p>
      <p>Às vezes gentileza não é uma flor ou um cartão. Às vezes é dois dias de sol, trinta e nove sacos de lixo e um quintal que volta a ser um lugar seguro para uma criança crescer.</p>
    `,
  },
  {
    slug: 'passaros-que-trabalharam-junto',
    youtubeId: 'XZKmIw0kCeY',
    title: 'Os pássaros que trabalharam junto',
    date: '2026-04-18',
    excerpt:
      'Avisei que o vídeo teria uma "super participação". A participação especial foram os pássaros.',
    content: `
      <p>Eu avisei no começo do vídeo que teria uma "super participação". Quem esperava um morador emocionado ou um vizinho solidário ficou surpreso. A participação especial foram os pássaros.</p>
      <p>O jardim que fui limpar naquele dia bloqueava a rua. O mato tinha crescido tanto que os moradores da vizinhança não conseguiam passar com facilidade. Três casas sofriam com aquela situação e ninguém conseguia resolver.</p>
      <p>Eu cheguei com a roçadeira nas costas e comecei o trabalho. Em algum momento, os pássaros chegaram também.</p>
      <p>Graúnas, como o vizinho explicou mais tarde. Elas apareceram uma a uma, sem medo, caminhando entre os meus pés enquanto eu trabalhava. Comiam os vermes e insetos que a limpeza ia revelando no chão. Quando eu parei para tomar água, elas ficaram esperando. Quando voltei a cortar, elas voltaram a caminhar atrás.</p>
      <p>Eu coloquei uma tigela de água para elas no meio do trabalho. Fiquei observando as graúnas bebendo, sem pressa.</p>
      <p>Um vizinho que passava parou para ver, ficou alguns minutos assistindo à cena, contou o que sabia sobre esses pássaros, agradeceu pelo trabalho. A rua, que antes era passagem de mato, virou por alguns momentos um lugar de conversa.</p>
      <p>No final, quando olhei para a rua limpa, disse o que eu sentia: "Olha como a rua ganhou vida, como ficou bonito."</p>
      <p>Eu tinha ido limpar um jardim. Mas o que aconteceu ali foi uma coisa maior — um espaço abandonado voltou a ter vida. Vida nas plantas aparadas, vida nas pessoas que pararam para conversar, e vida nos pássaros que souberam antes de todo mundo que aquele chão estava bom de novo.</p>
    `,
  },
  {
    slug: 'chuva-nao-parou-andre-voltou',
    youtubeId: '2b9AdMQKpXA',
    title: 'A chuva não parou, mas André voltou',
    date: '2026-04-11',
    excerpt:
      'Duas multas, jardineiros caros e um morador descrente. Ofereci de graça, ele duvidou. A chuva veio. Eu voltei no dia seguinte.',
    content: `
      <p>O morador tinha recebido duas multas da prefeitura. A segunda chegou enquanto ele ainda tentava resolver a primeira. A grama na calçada cresceu rápido, os jardineiros da região cobravam mais do que ele conseguia pagar, e o tempo foi passando.</p>
      <p>Quando eu apareci na porta e disse que faria a limpeza de graça, ele não acreditou. Não de um jeito rude. De um jeito humano, de quem já ouviu muita promessa e aprendeu a não contar com elas.</p>
      <p>"Ele duvidou até que a gente ia vir no outro dia, por conta que não estávamos cobrando nada por isso."</p>
      <p>Eu voltei. E então a chuva veio.</p>
      <p>No meio do trabalho do primeiro dia, uma chuva forte chegou sem aviso. Parei, gravei um vídeo olhando para o céu com a frustração de quem tinha planejado terminar e não conseguiu. "Esses imprevistos", eu disse. "Começou a cair essa chuva gigantesca, mas a gente não tem controle, né?"</p>
      <p>No dia seguinte, eu estava de volta. Com sol, roçadeira e o mesmo compromisso de sempre.</p>
      <p>O trabalho foi minucioso. A grama foi cortada ao longo de toda a extensão da calçada. Os galhos que avançavam sobre a passagem foram aparados. As rachaduras do cimento foram raspadas e limpas. Tudo recolhido, ensacado, soprado.</p>
      <p>Quando terminei, me sentei na calçada. Literalmente. "Já consigo sentar na calçada!"</p>
      <p>Era uma forma simples de mostrar o que a limpeza tinha devolvido — o uso real do espaço.</p>
      <p>Antes de ir embora, eu disse algo que ficou: "Com sol, com chuva, deixar lindo para você também."</p>
      <p>O morador, aquele que tinha duvidado, não precisou mais de convencimento. A calçada estava limpa. A multa, resolvida. E a promessa, cumprida.</p>
    `,
  },
  {
    slug: 'vizinho-que-ja-conhecia-andre',
    youtubeId: 'NTsomMdAeqc',
    title: 'O vizinho que já conhecia o André',
    date: '2026-04-04',
    excerpt:
      'Havia uma calçada notificada pela prefeitura. No meio do trabalho, um homem se aproximou: "Ficou ótimo lá, hein!" Eu já tinha ajudado ele antes.',
    content: `
      <p>Havia uma lateral de casa que a prefeitura tinha notificado. O mato cresceu alto o suficiente para virar problema oficial, mas nem a prefeitura nem o morador conseguiam resolver a situação. Era uma daquelas situações em que todo mundo sabe do problema e ninguém faz nada.</p>
      <p>Eu estava passando pela rua quando avistei o mato. Conversei com quem morava ali, entendi a situação e me comprometi a fazer a limpeza de graça.</p>
      <p>O trabalho envolvia duas seções de calçada, em frente a casas diferentes. Fui de uma até a outra, cortando, varrendo, soprando, ensacando.</p>
      <p>No meio do trabalho, um homem se aproximou. Olhou para mim, olhou para o trabalho e disse: "Ficou ótimo lá, hein!"</p>
      <p>Era um vizinho que eu já tinha ajudado antes. Ele me reconheceu e parou para agradecer de novo, como se a gentileza anterior ainda estivesse em circulação. Ele explicou para a mulher que estava do lado quem eu era: "Ele faz um trabalho voluntário de limpar. Totalmente de graça. Limpa a calçada do vizinho."</p>
      <p>Mais tarde, quando a segunda seção ficou pronta, uma moradora saiu de casa para ver. Ficou surpresa ao descobrir que o espaço na frente da própria casa tinha sido limpo. Eu apontei para os insetos que tinham saído do mato com a limpeza, e nós dois rimos juntos.</p>
      <p>No final, um pássaro pousou na calçada recém-limpa. Eu olhei para a câmera e disse: "Olha quem mais fica feliz depois que a gente faz..."</p>
      <p>O pássaro ficou ali um momento, bisbilhotando o chão limpo. Depois voou.</p>
      <p>Às vezes a melhor forma de saber que um trabalho foi bem feito não é o antes e o depois. É o pássaro que resolve pousar.</p>
    `,
  },
  {
    slug: 'o-susto-que-virou-obrigado',
    youtubeId: 'OnWxa4NBwig',
    title: 'O susto que virou obrigado',
    date: '2026-03-28',
    excerpt:
      'Avisei no início do vídeo que um vizinho ia me dar um susto. Era verdade. Só que o susto foi de um jeito que ninguém esperava.',
    content: `
      <p>Eu disse no início do vídeo que um vizinho ia me dar um susto. Era verdade, só que o susto foi de um jeito que ninguém esperava.</p>
      <p>O jardim em frente à casa estava abandonado há mais tempo do que alguém conseguia se lembrar. O mato tinha crescido alto demais e a vizinhança estava incomodada. Eu conversei com o morador, ofereci a limpeza de graça e comecei o trabalho.</p>
      <p>Horas se passaram. A roçadeira foi derrubando o mato. O ancinho foi juntando tudo. O soprador foi dando o acabamento. A rua foi tomando uma forma diferente, mais limpa, mais respirável.</p>
      <p>Foi quando um carro parou do lado.</p>
      <p>O motorista desceu. Era um vizinho que ia passando. Ele olhou para a calçada, para mim ainda com o equipamento nas mãos, e disse: "Tá limpinho agora para vocês aí. A vizinhança vai ficar bem melhor."</p>
      <p>Depois agradeceu. Pelo nome, com carinho. "Obrigado, viu querido. Até mais, tchau tchau."</p>
      <p>E foi embora.</p>
      <p>Fiquei ali, com o soprador ainda nas costas, sorrindo para a câmera. Esse era o susto que eu tinha anunciado. Não um susto de medo. Um susto de gentileza inesperada no meio de uma tarde de trabalho.</p>
      <p>Tem dias em que o que mantém a gente em pé não é o resultado final, mas os pequenos momentos que acontecem no caminho. O carro que para. O vizinho que desce. O obrigado que não precisava ter sido dito, mas foi.</p>
      <p>O jardim ficou limpo. A rua ficou mais bonita. E eu segui para a próxima rua.</p>
    `,
  },
  {
    slug: 'jardim-de-quem-comeca-de-novo',
    youtubeId: 'JbvzrBen5Mw',
    title: 'O jardim de quem está começando de novo',
    date: '2026-03-21',
    excerpt:
      'Recém desempregado, ele estava segurando o gasto. O jardim foi pra última posição da lista. Bati na porta e ofereci o serviço sem cobrar.',
    content: `
      <p>Perder o emprego é uma daquelas coisas que mexe com tudo ao mesmo tempo. Com o orçamento, com a rotina, com a cabeça. Quem passa por isso sabe que tem uma lista de prioridades que muda da noite para o dia, e a grama do jardim vai para o final dessa lista.</p>
      <p>Foi o que aconteceu com o morador desta história. Recém desempregado, ele estava "segurando o gasto", como ele mesmo disse, e contratar um jardineiro não estava em cogitação. O jardim foi crescendo. A lateral da casa foi ficando fechada de mato.</p>
      <p>Eu passava pela rua quando vi a situação. Bati na porta. Quando ouvi que ele estava desempregado, não hesitei — ofereci o serviço de graça na mesma hora. Ele ficou sem saber o que dizer. Demorou um pouco para acreditar.</p>
      <p>O trabalho foi cuidadoso. Usei a roçadeira nas costas para cortar a grama que cresceu ao longo do jardim e da lateral, defini as bordas da calçada com precisão, soprei tudo até o chão ficar limpo. Era uma casa comum, de uma pessoa comum, numa situação que qualquer um de nós poderia estar.</p>
      <p>Quando tudo ficou pronto, busquei o morador para ver o resultado. Ele ficou "muito feliz", como eu contei depois. Mas o que ficou mais marcado não foi a reação dele — foi o que eu disse olhando para a câmera ao final.</p>
      <p>"Com fé e esperança ele vai conseguir se recolocar o mais rápido possível."</p>
      <p>O jardim limpo não vai resolver a busca por emprego. Eu sei disso. Mas acredito que começar uma manhã olhando para um espaço cuidado, onde antes havia abandono, pode fazer alguma diferença no que a pessoa sente. E que pequenos gestos às vezes são o começo de uma transformação maior.</p>
    `,
  },
  {
    slug: 'voce-veio-em-boa-hora',
    youtubeId: 'yet7xYFvnBA',
    title: 'Você veio em boa hora',
    date: '2026-03-14',
    excerpt: '"Você veio em boa hora." Quatro palavras que valeram cada gota de suor naquele dia.',
    content: `
      <p>Há frases que cabem em molduras. Há frases que a gente guarda sem saber que ia guardar.</p>
      <p>O morador da esquina me disse uma dessas quando viu o trabalho pronto: "Você veio em boa hora."</p>
      <p>Quatro palavras. Eu disse depois que elas valeram cada gota de suor.</p>
      <p>A esquina estava num estado difícil. A calçada e o jardim lateral tinham crescido para além do que qualquer um conseguiria controlar sozinho. O mato era alto e denso, e a faixa de terra ao longo do meio-fio parecia mais floresta do que calçada urbana. O morador não estava dando conta. Não por falta de vontade, mas porque há situações que simplesmente crescem além da nossa capacidade de resolver.</p>
      <p>Eu cheguei com a roçadeira nas costas e Loli, o papagaio que às vezes acompanha as missões, ao lado. Não precisei de muito convite.</p>
      <p>O trabalho foi extenso. A grama arrancada encheu 14 sacos grandes de lixo. Quatorze. Eu mostrei um por um para o morador, que ficou olhando com uma mistura de surpresa e alívio.</p>
      <p>No meio do trabalho, passou pela calçada um homem chamado Francisco. Ele parou, ficou observando e perguntou se podia tentar. Eu entreguei a roçadeira. Ele foi um pouco torto no começo, depois foi pegando o jeito. Eu ri e falei: "Desse jeito ele vai pegar a minha vaga aqui de jardineiro da Terra Gentil."</p>
      <p>Antes disso, outro passante tinha gritado do outro lado da rua: "Força aí, você vai conseguir!"</p>
      <p>É assim que o Terra Gentil funciona. Eu começo o trabalho, e de alguma forma a rua começa a participar.</p>
      <p>Quando ele me disse "você veio em boa hora", eu não sabia exatamente o que estava por trás daquela frase. Mas senti que era verdade. E às vezes é isso que basta.</p>
    `,
  },
  {
    slug: 'calcada-ninguem-usava',
    youtubeId: 'K3CNNyLP9Oo',
    title: 'A calçada que ninguém conseguia usar',
    date: '2026-03-07',
    excerpt:
      'Encontrei uma senhora tentando andar na própria calçada. O mato avançou tanto que a passagem virou matagal venenoso.',
    content: `
      <p>Eu encontrei uma senhora que tentava andar na própria calçada e não conseguia. O mato tinha crescido tanto que a terra do jardim transbordou para a calçada, e o que era espaço de caminhar virou uma barreira coberta de vegetação densa, difícil e, em alguns pontos, venenosa.</p>
      <p>A planta que cresceu ali era a coroa de cristo. Bonita para quem não sabe. Perigosa para quem sabe demais. Os vizinhos reclamaram para a prefeitura. A prefeitura não resolveu. A calçada foi ficando intransitável.</p>
      <p>Eu estava passando pela rua quando vi a situação. Conversei com a moradora, uma senhora que, com dificuldade, apontava para o espaço que um dia foi calçada e agora era um matagal. Eu não perguntei se ela queria ajuda. Eu ofereci. De graça, como sempre.</p>
      <p>O trabalho foi demorado e exigente. Cortar a coroa de cristo exige cuidado. Retirar a terra que avançou sobre a calçada exige paciência. Usei enxada, ancinho, roçadeira e soprador em sequência, reconstruindo o espaço centímetro por centímetro, devolvendo à calçada o seu propósito mais simples — ser um lugar por onde as pessoas possam passar.</p>
      <p>Em determinado momento, ela se aproximou para ver o que estava acontecendo. Ficou em silêncio por um instante, olhando o espaço que estava sendo recuperado. Depois disse, baixinho: "Já tá melhorando, né?"</p>
      <p>Três palavras. Cheias de alívio.</p>
      <p>Quando tudo ficou pronto, ela olhou para a calçada e disse o que não cansava de repetir: "Agora sim, tem uma calçada para andar aí de novo." Simples assim. Não precisava de mais nada.</p>
      <p>No Brasil, espaços públicos mal cuidados viram paisagem invisível para quem passa rápido. Para quem mora ao lado, são uma batalha diária. O Terra Gentil escolhe ver o que os outros se acostumaram a ignorar, e então faz algo a respeito.</p>
    `,
  },
  {
    slug: 'dona-cristina-marciano-da-gentileza',
    youtubeId: 'h91qQnbYnNM',
    title: 'Dona Cristina e o marciano da gentileza',
    date: '2026-02-28',
    excerpt:
      'A primeira pergunta de Dona Cristina foi séria: "Você me garante que você é da Terra?" Ela já tinha visto muita promessa virar nada.',
    content: `
      <p>A primeira pergunta que Dona Cristina me fez foi séria. Não era curiosidade. Era desconfiança legítima, de quem já viu muita promessa virar nada.</p>
      <p>"Você me garante que você é da Terra?"</p>
      <p>Ela queria saber se eu era mesmo gente daqui, da Terra mesmo, porque o que eu estava oferecendo parecia coisa de outro mundo. Alguém querendo limpar um jardim inteiro sem cobrar nada? Dona Cristina tem 78 anos e nunca tinha visto isso.</p>
      <p>As duas pontas do terreno da casa dela estavam tomadas por mato alto e lixo. Não era descuido dela. Era abandono de quem devia cuidar e não cuidava, de vizinhos que não moravam ali e ignoravam o problema, da prefeitura que notificou em vez de ajudar. O mato alto trouxe dengue, trouxe escorpião, trouxe a possibilidade de multa. E ainda tinha lixo hospitalar jogado ali — agulhas, tubos, ataduras, garrafinhas de soro. "Fiquei com nojo de pegar", ela me contou.</p>
      <p>Quando confirmei que o serviço era mesmo de graça, ela colocou as mãos juntas e exclamou: "Meu Deus, eu não acredito! Vou passar o Natal sem ter os matos dos meus lados." Era dezembro. A limpeza foi o presente de Natal que ela não esperava.</p>
      <p>Eu trabalhei no sol, cortando, varrendo, soprando, recolhendo tudo o que não deveria estar ali. No meio do trabalho, um vizinho parou, observou, foi embora e voltou com uma sacola de revistas. Nenhuma grande cerimônia. Só um gesto de quem ficou tocado pelo que estava vendo.</p>
      <p>Quando o espaço ficou limpo, ela não coube em si. "Parece mentira, mas é real. Inacreditável." Depois me abençoou com as palavras da forma mais simples e mais bonita que existe.</p>
      <p>Ela nunca chegou a confirmar se eu era marciano ou não. Mas uma coisa ficou clara — o tipo de gentileza que eu pratico não é muito comum neste planeta.</p>
    `,
  },
  {
    slug: 'senhor-87-anos-capela',
    youtubeId: 'K1J5I9IcGIw',
    title: 'O senhor de 87 anos que construiu uma capela e perdeu tudo',
    date: '2026-02-21',
    excerpt:
      'Seu Antônio tem 87 anos, viúvo há 4 meses, mal se movimenta desde Guillain-Barré. O quintal virou floresta. Eu bati na porta.',
    content: `
      <p>Seu Antônio tem 87 anos. Há décadas, ele construiu com as próprias mãos boa parte da propriedade onde mora, incluindo uma pequena capela no meio do terreno. Sempre vi nele um homem de trabalho, de terra, de vida ativa.</p>
      <p>Em 2010, tudo mudou quando ele recebeu o diagnóstico de Síndrome de Guillain-Barré. A doença o levou à paralisia completa. Ele passou sete meses na UTI, um ano inteiro internado. A recuperação foi longa, dolorosa e incompleta, porque o braço direito nunca mais funcionou. As pernas obedecem com esforço, e a fisioterapia até hoje faz parte da rotina dele, não por escolha, mas por necessidade.</p>
      <p>Quatro meses antes de eu aparecer, a esposa dele faleceu. Foram sessenta e três anos de casados. Ela partiu por complicações do Alzheimer, depois de uma queda. O terreno, que antes os dois cuidavam, virou uma floresta de mato alto.</p>
      <p>Eu passava pela rua quando vi o jardim. Bati na porta. Ouvi a história toda sem pressa, olhando nos olhos dele, e senti aquela mistura de resignação e dignidade que só quem carrega muita vida no corpo consegue ter. Quando ele me disse "eu não posso pagar", eu respondi que não havia nada a pagar.</p>
      <p>O trabalho durou horas. A roçadeira foi cortando o mato que cresceu durante anos de impossibilidade. Cuidei do jardim da entrada, do entorno da casa, dos arredores da capela que ele mesmo ergueu. Uma parte do terreno precisei deixar de lado porque uma infestação de insetos agressivos impediu a passagem. Levei picadas várias vezes, mas continuei.</p>
      <p>No fim, ele caminhou pelo próprio jardim. Caminhou por um espaço que era dele, mas que, por tanto tempo, ele não conseguia alcançar.</p>
      <p>Eu olhei para a câmera e pedi à comunidade que, se o vídeo chegasse a 200 mil curtidas, eu voltaria com uma equipe completa para limpar o fundo do terreno, onde Seu Antônio costumava pescar. A resposta dele foi imediata: "Quando vocês voltarem, eu cozinho para todo mundo."</p>
      <p>Tem aniversários que a gente celebra com bolo. E tem aniversários que chegam sem aviso, na forma de uma roçadeira ligada, de um jardim limpo e de um homem de 87 anos que, pela primeira vez em muito tempo, caminhou livre no próprio quintal.</p>
    `,
  },
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
