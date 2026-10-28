// Small, explicit models for the essay's illustrations. No external services.
export const lifeWidth = 48, lifeHeight = 28;
export const lifePresets = {
  field: {name: 'Evolving field', description: 'A mixed starting field. Watch clusters form, break apart and sometimes settle into repeating shapes.'},
  five: {name: 'Five-cell seed', description: 'The R-pentomino starts with just five cells. Follow how far their consequences spread.'},
  gliders: {name: 'Crossing gliders', description: 'Four gliders head towards the middle from different directions. Their encounters change what survives.'},
  forms: {name: 'Still & repeating', description: 'The block stays still, the blinker repeats in two steps, and the larger pulsar repeats in three.'}
};
export function lifeRandom(seed = 20261028) {
  return () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
}
export function seedLife(preset = 'field', random = lifeRandom()) {
  const cells = new Uint8Array(lifeWidth * lifeHeight);
  const stamp = (points, x, y) => points.forEach(([dx,dy]) => { cells[(y+dy)*lifeWidth+x+dx] = 1; });
  if (preset === 'field') {
    for (let y = 5; y < 23; y++) for (let x = 8; x < 40; x++) cells[y*lifeWidth+x] = random() < .3 ? 1 : 0;
  } else if (preset === 'five') {
    stamp([[1,0],[2,0],[0,1],[1,1],[1,2]],22,12);
  } else if (preset === 'gliders') {
    const glider = [[1,0],[2,1],[0,2],[1,2],[2,2]];
    stamp(glider,6,5);
    stamp(glider.map(([x,y]) => [2-x,y]),39,5);
    stamp(glider.map(([x,y]) => [x,2-y]),6,20);
    stamp(glider.map(([x,y]) => [2-x,2-y]),39,20);
  } else if (preset === 'forms') {
    stamp([[0,0],[1,0],[0,1],[1,1]],6,7);
    stamp([[0,0],[1,0],[2,0]],15,7);
    stamp([[1,0],[2,0],[3,0],[0,1],[1,1],[2,1]],12,19);
    const pulsar = [];
    for (const edge of [0,5,7,12]) for (const offset of [2,3,4,8,9,10]) pulsar.push([offset,edge],[edge,offset]);
    stamp(pulsar,27,7);
  }
  return cells;
}
export function stepLife(cells, width = lifeWidth, height = lifeHeight) {
  const next = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    let neighbours = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx, ny = y + dy;
      if ((dx || dy) && nx >= 0 && nx < width && ny >= 0 && ny < height) neighbours += cells[ny * width + nx];
    }
    next[y * width + x] = neighbours === 3 || (cells[y * width + x] && neighbours === 2) ? 1 : 0;
  }
  return next;
}
export const energy = x => (x * x - 1) ** 2;
export const descend = x => x - .035 * 4 * x * (x * x - 1);
