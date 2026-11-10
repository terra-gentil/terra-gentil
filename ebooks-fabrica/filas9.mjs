// Filas de fotos do Flow da leva 9 (TG 101 a 114): Gentileza sem oculos, 2 por fila, lugar dito na cena.
// Acrescentar o livro novo em LIVROS quando o roteiro dele fechar. Uso: node filas9.mjs
import { writeFileSync } from 'node:fs';
const REPO = 'C:/Gitlab_hz/terra-gentil-site/terra-gentil/insta-terra-gentil/gama-ebooks';
const ESTILO = 'Documentary photo, soft natural daylight, Brazilian home garden, realistic colors, sharp focus, no text, no logos';
const M = 'the small mascot figurine';
const H = "Close-up of a man's hands";
// [id, especie, cena, mascote]; gesto = elenco 9:16, sintoma 9:16, var 3:4
const LIVROS = {
  '101': [
    ['slv-gesto-1', 'garden soil', `${H} rubbing a pinch of garden soil between the fingers to feel if it is sandy`, false],
    ['slv-gesto-2', 'garden soil', `${H} bending a rolled sausage of moist soil into a ring`, false],
    ['slv-gesto-3', 'sandy soil bed', `${H} spreading a 10 cm layer of cured manure over sandy soil in a garden bed; ${M} sits on the wooden edge of the bed`, true],
    ['slv-sintoma-1', 'compacted soil', 'Rainwater pooling on hard cracked bare garden soil after a storm, with a pale sandy crust', false],
    ['slv-var-grumos', 'crumbly soil', 'Dark crumbly garden soil made of small round clumps in a bed', false],
    ['slv-var-minhoca', 'earthworms', 'Earthworms wriggling in a handful of dark moist soil', false],
    ['slv-var-cobertura', 'mulched plant', `Straw mulch around a vegetable plant with a small gap around the stem; ${M} stands on the straw next to it`, true],
    ['slv-var-barranco', 'jute net slope', 'A slope covered with jute netting and small plants growing through the holes', false],
  ],
  '102': [
    ['cvv-gesto-1', 'hedge planting strip', `${H} stretching a string between two bamboo stakes along a strip of bare soil`, false],
    ['cvv-gesto-2', 'hedge seedling', `${H} planting a small hedge seedling in the soil beside the string; ${M} sits on the edge of the strip`, true],
    ['cvv-gesto-3', 'young tree', `${H} tying a young tree to two wooden stakes with a soft tie`, false],
    ['cvv-sintoma-1', 'wind-burned plant', 'Low twisted shrub with scorched brown leaf edges in a windy exposed spot', false],
    ['cvv-var-hibisco', 'hibiscus hedge', 'Red hibiscus hedge in bloom with large flowers along a garden wall', false],
    ['cvv-var-escova', 'bottlebrush', `Bottlebrush with red brush-shaped flowers in a dense row; ${M} stands on the ground in front of it`, true],
    ['cvv-var-tupinambo', 'jerusalem artichoke', 'Tall Jerusalem artichoke with yellow flowers growing as a windbreak at the edge of a vegetable garden', false],
    ['cvv-var-rosa-canina', 'dog rose', 'Dog rose with simple pink flowers in a country hedge', false],
  ],
  '103': [
    ['mte-gesto-1', 'dandelion', `${H} pushing a garden fork under the root of a dandelion in a garden bed`, false],
    ['mte-gesto-2', 'curled dock', `${H} pulling the top half of a long curled dock root out of a dug hole`, false],
    ['mte-gesto-3', 'garlic mustard', `${H} pulling a garlic mustard weed out of a flower bed; ${M} sits on a stone at the edge of the bed`, true],
    ['mte-sintoma-1', 'weedy bed', 'Garden bed with weed shoots sprouting from white rhizomes in loose soil', false],
    ['mte-var-dente-de-leao', 'dandelion', 'Dandelion with a flat rosette of leaves and a yellow flower at the edge of a lawn', false],
    ['mte-var-lingua-de-vaca', 'curled dock', 'Curled dock with broad leaves and tall reddish seed stalks beside a path', false],
    ['mte-var-corda-de-viola', 'bindweed', `Field bindweed with white flowers twining on a garden fence; ${M} stands on the ground at the foot of the fence`, true],
    ['mte-var-capim-colonicao', 'guinea grass', 'Tall dense clump of guinea grass in an abandoned lot', false],
  ],
  '104': [
    ['pcn-gesto-1', 'basil and tomato', `${H} planting a basil seedling next to a tomato plant in a vegetable bed`, false],
    ['pcn-gesto-2', 'dill seeds', `${H} sowing dill seeds directly in the soil of a vegetable bed; ${M} sits on the wooden edge of the bed`, true],
    ['pcn-gesto-3', 'mint in clay pot', `${H} burying a terracotta pot with mint up to its rim in a garden bed`, false],
    ['pcn-sintoma-1', 'mint overgrown', 'Mint spreading over a vegetable bed and hiding the other plants', false],
    ['pcn-var-borragem', 'borage', 'Borage with blue hanging flowers and a bee on one of them', false],
    ['pcn-var-calendula', 'calendula', `Orange calendula flowers among vegetables in a garden bed; ${M} stands on the soil next to them`, true],
    ['pcn-var-endro', 'dill', 'Dill with feathery leaves and yellow umbrella flowers in a vegetable garden', false],
    ['pcn-var-hortela', 'flowering mint', 'Flowering mint with lilac flowers and a butterfly on it', false],
  ],
  '105': [
    ['hbi-gesto-1', 'bug hotel', `${H} assembling the frame of a bug hotel from wooden pallets`, false],
    ['hbi-gesto-2', 'bug hotel', `${H} filling a bug hotel with hollow bamboo, bark and roof tiles`, false],
    ['hbi-gesto-3', 'dead hedge', `${H} stacking pruned branches into a low dead hedge; ${M} sits on the ground beside the pile`, true],
    ['hbi-sintoma-1', 'aphids on rose', 'Rose shoot covered with aphids in a very tidy bare garden bed with no fallen leaves', false],
    ['hbi-var-cenoura', 'flowering carrot', 'Carrot gone to flower with white flower umbels and small insects on them', false],
    ['hbi-var-salsinha', 'flowering parsley', 'Parsley in flower with small insects on the yellow-green flowers', false],
    ['hbi-var-alisso', 'sweet alyssum', `White sweet alyssum forming a carpet with small insects on the flowers; ${M} stands among the flowers`, true],
    ['hbi-var-girassol', 'sunflower', 'Open sunflower with a bee on the flower', false],
  ],
  '106': [
    ['mic-gesto-1', 'seedling', `${H} placing a cut plastic bottle over a young seedling like a small bell cover`, false],
    ['mic-gesto-2', 'garden corner', `${H} pouring gravel into a hole at the lowest corner of a waterlogged garden; ${M} sits on the grass nearby`, true],
    ['mic-gesto-3', 'new plant', `${H} taking the plastic sleeve off a newly bought potted plant`, false],
    ['mic-sintoma-1', 'bolting lettuce', 'Lettuce that has bolted with a tall stem and small flowers under strong sun', false],
    ['mic-var-muro-branco', 'white wall garden', 'White wall around a vegetable garden reflecting light onto healthy plants', false],
    ['mic-var-canto-umido', 'shady damp corner', `Damp shaded corner of a backyard with lush green leafy plants; ${M} stands among the leaves`, true],
    ['mic-var-cerca-vazada', 'slatted fence', 'Slatted wooden fence with garden plants behind it, filtering the wind', false],
    ['mic-var-pet', 'bottle cloche', 'Young seedling protected by a cut plastic bottle placed over it in a garden bed', false],
  ],
  '107': [
    ['sem-gesto-1', 'paper pot', `${H} rolling a strip of newspaper around a soda can to make a seedling pot`, false],
    ['sem-gesto-2', 'seed pot', `${H} sowing seeds into a yogurt cup with a drainage hole filled with seed-starting mix; ${M} sits on the work table next to the cup`, true],
    ['sem-gesto-3', 'seedling transplant', `${H} holding a tiny seedling by its leaf with a teaspoon underneath to transplant it`, false],
    ['sem-sintoma-1', 'tangled seedlings', 'Seedlings tangled together in a single seed tray without cells, hard to separate', false],
    ['sem-var-girassol', 'sunflower seedlings', 'Sunflower seedlings with first leaves in small pots on a windowsill', false],
    ['sem-var-rabanete', 'radish seedlings', 'Radish seedlings in a straight row sown directly in a garden bed', false],
    ['sem-var-pimenta', 'chili seedlings', `Chili pepper seedlings in a small pot on a warm sunny windowsill; ${M} sits on the windowsill next to the pot`, true],
    ['sem-var-capuchinha', 'nasturtium seedlings', 'Nasturtium seedlings with round leaves in a small pot', false],
  ],
  '108': [
    ['hss-gesto-1', 'garden light', `${H} holding a phone to photograph the same corner of a backyard garden`, false],
    ['hss-gesto-2', 'sun map', `${H} marking on a sheet of paper which corners of the garden get full sun and which stay shaded; ${M} sits on the paper's corner`, true],
    ['hss-gesto-3', 'lettuce pot', `${H} moving a pot of lettuce into a shady corner of a patio`, false],
    ['hss-sintoma-1', 'bolting spinach', 'Spinach that has bolted with a tall flower stalk under strong sun', false],
    ['hss-var-alface', 'shade lettuce', 'Soft green lettuce growing in the shade of a vegetable garden', false],
    ['hss-var-hortela', 'shade mint', 'Lush mint in partial shade in a damp garden bed', false],
    ['hss-var-hosta', 'hosta', `Hosta with broad leaves in a shady bed with curled shoots; ${M} stands among the leaves`, true],
    ['hss-var-gengibre', 'ginger', 'Ginger plant with long leaves in a pot in partial shade', false],
  ],
  '109': [
    ['fho-gesto-1', 'kale', `${H} picking the outer leaves of a kale plant and leaving the center leaves growing`, false],
    ['fho-gesto-2', 'lettuce thinning', `${H} pulling tiny lettuce seedlings out of a crowded row to eat them as baby greens; ${M} sits on the edge of the bed`, true],
    ['fho-gesto-3', 'cabbage seedling', `${H} placing a round cardboard collar around a young cabbage seedling`, false],
    ['fho-sintoma-1', 'kale with holes', 'Kale leaf full of tiny shot holes made by flea beetles', false],
    ['fho-var-couve', 'kale', 'Kale with large dark green leaves in a vegetable bed', false],
    ['fho-var-alface', 'romaine lettuce', `Romaine lettuce with long leaves in a garden bed; ${M} stands on the soil next to it`, true],
    ['fho-var-rucula', 'arugula', 'Arugula with lobed leaves ready to cut in a garden bed', false],
    ['fho-var-brocolis', 'broccoli', 'Broccoli plant with a formed head and tightly closed buds', false],
  ],
  '110': [
    ['rae-gesto-1', 'rose rootstock', `${H} making a T-shaped cut in the bark of a rose rootstock stem with a sharp budding knife`, false],
    ['rae-gesto-2', 'rose budding', `${H} sliding a single bud under the bark flaps of a rose rootstock and wrapping it with grafting tape; ${M} sits on a wooden crate beside the work`, true],
    ['rae-gesto-3', 'rose graft', `${H} cutting a rose rootstock just above a new green bud and removing the tape`, false],
    ['rae-sintoma-1', 'black spot rose', 'Rose leaves with round black spots of black spot disease', false],
    ['rae-var-centifolia', 'centifolia rose', 'Very double pale pink centifolia rose in bloom on a shrub', false],
    ['rae-var-musgo', 'moss rose', 'Moss rose with hard mossy hairs on the bud and stem', false],
    ['rae-var-bourbon', 'bourbon rose', `Full fragrant Bourbon rose on a shrub in a garden; ${M} stands on the ground in front of it`, true],
    ['rae-var-banksia', 'banksia rose', 'Yellow banksia rose in clusters climbing a sunny wall', false],
  ],
  '111': [
    ['pul-gesto-1', 'aphids on rose', `${H} squashing aphids between the fingers on a rose shoot`, false],
    ['pul-gesto-2', 'aphids on stem', `${H} running sticky tape, sticky side out, along a stem covered with black aphids`, false],
    ['pul-gesto-3', 'kale seedlings', `${H} covering young kale seedlings with fine mesh raised away from the leaves; ${M} sits on the soil at the edge of the bed`, true],
    ['pul-sintoma-1', 'mealybugs on roots', 'Roots of a potted succulent covered with white cotton-like mealybugs', false],
    ['pul-var-farinhenta', 'mealybugs on fern', 'White waxy mealybugs clustered on a fern frond', false],
    ['pul-var-escama', 'scale insects', 'Small brown wax plaques of scale insects stuck on a plant stem', false],
    ['pul-var-pulgao-preto', 'black aphids on fava', `Black aphids gathered at the tip of a fava bean plant; ${M} stands on the soil beside the plant`, true],
    ['pul-var-sirfidea', 'hoverfly', 'Hoverfly resembling a wasp resting on a flower', false],
  ],
  '112': [
    ['otc-gesto-1', 'stanhopea orchid', `${H} bending a cluster of new pseudobulbs of a Stanhopea orchid at a right angle to split the clump`, false],
    ['otc-gesto-2', 'clay pot', `${H} drilling an extra hole in a terracotta orchid pot with a masonry drill bit, the pot soaked in a bucket nearby`, false],
    ['otc-gesto-3', 'orchid shade slats', `${H} nailing thin wooden slats with narrow gaps to build a homemade shade frame over orchids; ${M} sits on a stone wall beside the work`, true],
    ['otc-sintoma-1', 'orchid leaf tip', 'Orchid leaf with a dry brown tip and a row of small beige dots at the border between dead and living tissue', false],
    ['otc-var-laelia', 'rupicolous laelia', 'Small rupicolous Laelia orchid in bloom growing on a sunny rock', false],
    ['otc-var-bifrenaria', 'bifrenaria harrisoniae', `Bifrenaria harrisoniae orchid in bloom growing on a rock in full sun; ${M} stands on the rock beside it`, true],
    ['otc-var-cattleya', 'cattleya orchid', 'Cattleya orchid in bloom lying on a thick tree branch', false],
    ['otc-var-phalaenopsis', 'phalaenopsis orchid', 'White Phalaenopsis orchid on a shaded mossy tree trunk', false],
  ],
};
for (const [n, lista] of Object.entries(LIVROS)) {
  const fotos = lista.map(([id, especie, cena, mascote]) => ({
    id, especie, proporcao: id.includes('-var-') ? '3:4' : '9:16', elenco: id.includes('-gesto-'), cena, mascote,
  }));
  writeFileSync(`${REPO}/fila-fotos-tg${n}.json`, JSON.stringify({ livro: `TG ${n}`, estilo: ESTILO, fotos }, null, 2) + '\n');
  console.log(`tg${n}: ${fotos.length} fotos, ${fotos.filter((f) => f.mascote).length} com mascote`);
}
