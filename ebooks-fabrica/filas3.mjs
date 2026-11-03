// Filas de fotos do Flow do TG 030 ao 039 (Gentileza sem oculos, 2 por fila, lugar dito na cena).
import { writeFileSync } from 'node:fs';
const REPO = 'C:/Gitlab_hz/terra-gentil-site/terra-gentil/insta-terra-gentil/gama-ebooks';
const ESTILO = 'Documentary photo, soft natural daylight, Brazilian home garden, realistic colors, sharp focus, no text, no logos';
const M = 'the small mascot figurine';
// [id, especie, cena, mascote]; gesto = elenco 9:16, sintoma 9:16, var 3:4
const LIVROS = {
  '030': [
    ['rod-gesto-1', 'potted rose bush', `Close-up of a man's hands pulling off a rose leaf covered with round black spots; ${M} sits on the rim of the terracotta pot`, true],
    ['rod-gesto-2', 'potted rose bush', "Close-up of a man's hands picking up fallen yellow spotted rose leaves from the soil of a pot", false],
    ['rod-gesto-3', 'potted rose bush', "Close-up of a man's hand watering the base of a rose bush with a small watering can, keeping the leaves dry", false],
    ['rod-sintoma-1', 'rose leaf', 'Close-up of a rose leaf turning yellow between green veins, interveinal chlorosis', false],
    ['rod-var-pulgao', 'rose bud with aphids', 'Macro of many small green aphids clustered on a young rose bud', false],
    ['rod-var-manchapreta', 'rose leaf', 'Rose leaf with round black spots with fringed edges, yellowing around them', false],
    ['rod-var-oidio', 'rose bud', 'Rose bud and leaves covered with white powdery mildew', false],
    ['rod-var-cochonilha', 'rose stem', `Old rose stem covered with small brown scale insects; ${M} stands at the foot of the stem on the soil`, true],
  ],
  '031': [
    ['por-gesto-1', 'rose bush', `Close-up of a man's hands with pruning shears cutting a dry dead branch from a rose bush; ${M} sits on the edge of the flower bed`, true],
    ['por-gesto-2', 'rose bush', "Close-up of a man's hands cutting a rose cane in half with pruning shears", false],
    ['por-gesto-3', 'rose bush', 'Close-up of pruning shears making a slanted cut just above an outward-facing bud on a rose cane', false],
    ['por-sintoma-1', 'rose cane', 'Rose cane blackened and dying back downward from an old pruning cut', false],
    ['por-var-grande', 'hybrid tea rose', 'Hybrid tea rose bush freshly pruned low, short canes about 35 cm from the ground', false],
    ['por-var-floribunda', 'floribunda rose', 'Floribunda rose bush pruned into a rounded shrub shape', false],
    ['por-var-mini', 'miniature rose', `Miniature rose trimmed by half in a small pot; ${M} sits next to the pot on a balcony table`, true],
    ['por-var-trepadeira', 'climbing rose', 'Climbing rose on a garden wall with only the loose tips trimmed', false],
  ],
  '032': [
    ['mur-gesto-1', 'rose bush', "Close-up of a man's hands cutting a pencil-thick rose stem that has just finished flowering", false],
    ['mur-gesto-2', 'rose cutting', `Close-up of a man's hands holding a 25 cm rose cutting, straight cut at the bottom and slanted cut at the top; ${M} sits on the potting bench`, true],
    ['mur-gesto-3', 'rose cutting', "Close-up of a man's hands pushing rose cuttings halfway into the soil of a pot", false],
    ['mur-sintoma-1', 'rose cutting', 'A dried, blackened rose cutting that failed in a small pot', false],
    ['mur-var-estaca', 'rose cuttings', 'Several rose cuttings with new green leaves rooting in a pot', false],
    ['mur-var-mergulhia', 'rose layering', 'A rose cane bent down to the ground and pinned into the soil with a wire staple', false],
    ['mur-var-alporque', 'rose air layering', `Air layer wrapped in clear plastic with moss on a rose branch, roots visible inside; ${M} sits on a nearby branch fork`, true],
    ['mur-var-semente', 'rose hips', 'Ripe orange rose hips cut open showing the seeds', false],
  ],
  '033': [
    ['ant-gesto-1', 'anthurium', "Close-up of a man's hands mixing bark chips, sphagnum moss and charcoal in a basin", false],
    ['ant-gesto-2', 'anthurium', `Close-up of a man's hands setting a red anthurium in a pot with the crown slightly above the soil; ${M} sits beside the pot on the table`, true],
    ['ant-gesto-3', 'anthurium', "Close-up of a man's hands covering the soil of an anthurium pot with sphagnum moss", false],
    ['ant-sintoma-1', 'anthurium', 'A wilted anthurium in a pot with waterlogged soil, water pooling on top', false],
    ['ant-var-vermelho', 'red anthurium', 'Classic red anthurium in a pot indoors near a bright window', false],
    ['ant-var-enrolado', 'flamingo flower', 'Anthurium scherzerianum with a curly orange spadix in a pot', false],
    ['ant-var-cristal', 'crystal anthurium', 'Anthurium crystallinum with velvety heart-shaped leaves and silver veins', false],
    ['ant-var-rosinha', 'pink anthurium', `Compact pink anthurium full of small flowers; ${M} peeks from behind the pot on a shelf`, true],
  ],
  '034': [
    ['cos-gesto-1', 'monstera', `Close-up of a man's finger pointing at an aerial root on a monstera stem; ${M} sits on the moss pole`, true],
    ['cos-gesto-2', 'monstera', "Close-up of a man's hands cutting a monstera stem tip with one mature leaf", false],
    ['cos-gesto-3', 'monstera', "Close-up of a man's hands planting a monstera cutting in a pot", false],
    ['cos-sintoma-1', 'young monstera', 'Young monstera plant with whole heart-shaped leaves, no splits or holes', false],
    ['cos-var-verde', 'monstera deliciosa', 'Large monstera deliciosa with big split and holed leaves in a living room', false],
    ['cos-var-variegada', 'variegated monstera', 'Variegated monstera with white patches on the leaves', false],
    ['cos-var-furinhos', 'monstera adansonii', `Monstera adansonii with many small holes climbing a pole; ${M} sits at the base of the pole`, true],
    ['cos-var-jardim', 'monstera', 'Monstera covering the ground of a shady tropical garden', false],
  ],
  '035': [
    ['jib-gesto-1', 'pothos', "Close-up of a man's finger pointing at a node on a pothos vine", false],
    ['jib-gesto-2', 'pothos', `Close-up of a man's hands cutting a 10 cm piece of pothos vine with a node; ${M} sits on the shelf beside the pot`, true],
    ['jib-gesto-3', 'pothos', "Close-up of a man's hands planting pothos cuttings in a small pot", false],
    ['jib-sintoma-1', 'philodendron', 'Philodendron with yellow scorched leaves next to a window with strong direct sun', false],
    ['jib-var-jiboia', 'golden pothos', 'Golden pothos with large leaves climbing a moss pole', false],
    ['jib-var-marble', 'marble queen pothos', 'Marble Queen pothos with white and green marbled leaves', false],
    ['jib-var-cordato', 'heartleaf philodendron', `Heartleaf philodendron trailing down from a high shelf; ${M} sits on the shelf next to the pot`, true],
    ['jib-var-singonio', 'syngonium', 'Syngonium with arrow-shaped leaves in a pot', false],
  ],
  '036': [
    ['paz-gesto-1', 'peace lily', "Close-up of a man's hands lifting a peace lily clump out of its pot", false],
    ['paz-gesto-2', 'peace lily', `Close-up of a man's hands dividing a peace lily clump into parts with leaves and roots; ${M} sits on the edge of the potting bench`, true],
    ['paz-gesto-3', 'peace lily', "Close-up of a man's hands replanting a peace lily division in its own pot", false],
    ['paz-sintoma-1', 'peace lily', 'Peace lily with one old flower turned green next to fresh white flowers', false],
    ['paz-var-maunaloa', 'peace lily', 'Peace lily Mauna Loa blooming in a pot', false],
    ['paz-var-sensation', 'giant peace lily', `Giant peace lily Sensation with huge leaves in a living room corner; ${M} sits on the floor beside the pot`, true],
    ['paz-var-copo', 'white calla lily', 'White calla lilies growing at the edge of a small garden pond', false],
    ['paz-var-goddess', 'green goddess calla lily', 'Green Goddess calla lily with green and white flowers', false],
  ],
  '037': [
    ['bro-gesto-1', 'bromeliad', "Close-up of a man's hands cutting a bromeliad pup at the base of the mother plant with a sharp knife", false],
    ['bro-gesto-2', 'bromeliad pup', `A bromeliad pup with its cut drying on a cloth; ${M} sits next to the pup on the table`, true],
    ['bro-gesto-3', 'bromeliad pup', "Close-up of a man's hands planting a bromeliad pup in a pot with a thin support stick", false],
    ['bro-sintoma-1', 'bromeliad', 'Old bromeliad drying after flowering, with green pups at its base', false],
    ['bro-var-guzmania', 'guzmania', 'Guzmania with a red flower bract in a pot', false],
    ['bro-var-neoregelia', 'neoregelia', 'Neoregelia with the center leaves turned red', false],
    ['bro-var-prata', 'aechmea fasciata', `Aechmea fasciata with silver banded leaves and a pink flower; ${M} sits beside the pot on the balcony floor`, true],
    ['bro-var-tilandsia', 'tillandsia', 'Tillandsia air plant mounted on a piece of wood', false],
  ],
  '038': [
    ['sam-gesto-1', 'boston fern', "Close-up of a man's hands removing old dry fronds from a boston fern", false],
    ['sam-gesto-2', 'boston fern', `Close-up of a man's hands dividing a fern clump into two large parts; ${M} sits on the potting bench`, true],
    ['sam-gesto-3', 'boston fern', "Close-up of a man's hands replanting a fern division in a pot with moist soil", false],
    ['sam-sintoma-1', 'fern frond', 'Underside of a fern frond with rows of brown spore dots', false],
    ['sam-var-americana', 'boston fern', 'Full boston fern hanging on a shaded balcony', false],
    ['sam-var-avenca', 'maidenhair fern', 'Maidenhair fern with delicate leaflets on black wiry stems', false],
    ['sam-var-ninho', "bird's nest fern", "Bird's nest fern with wide leaves forming a funnel", false],
    ['sam-var-chifre', 'staghorn fern', `Staghorn fern mounted on a wooden board on a wall; ${M} sits on top of the board`, true],
  ],
  '039': [
    ['mor-gesto-1', 'strawberry plant', "Close-up of a man's hands spacing strawberry seedlings in a long planter", false],
    ['mor-gesto-2', 'strawberry plant', `Close-up of a man's hands planting a strawberry seedling at the same depth it was; ${M} sits on the rim of the planter`, true],
    ['mor-gesto-3', 'strawberry plant', "Close-up of a man's hands spreading dry straw under strawberry leaves", false],
    ['mor-sintoma-1', 'strawberry', 'A rotten strawberry lying on wet soil in a pot', false],
    ['mor-var-comum', 'strawberry', 'Large red strawberries hanging from a pot on a balcony', false],
    ['mor-var-silvestre', 'wild strawberry', 'Wild strawberry with small red fruits among the leaves', false],
    ['mor-var-florrosa', 'pink flowered strawberry', `Strawberry plant with pink flowers in a hanging pot; ${M} sits on the shelf below the pot`, true],
    ['mor-var-branco', 'white wild strawberry', 'Wild strawberry with small white fruits', false],
  ],
};
for (const [n, lista] of Object.entries(LIVROS)) {
  const fotos = lista.map(([id, especie, cena, mascote]) => ({
    id, especie, proporcao: id.includes('-var-') ? '3:4' : '9:16', elenco: id.includes('-gesto-'), cena, mascote,
  }));
  writeFileSync(`${REPO}/fila-fotos-tg${n}.json`, JSON.stringify({ livro: `TG ${n}`, estilo: ESTILO, fotos }, null, 2) + '\n');
  console.log(`tg${n}: ${fotos.length} fotos, ${fotos.filter((f) => f.mascote).length} com mascote`);
}
