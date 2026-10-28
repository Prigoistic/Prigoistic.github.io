import {writeFileSync} from 'node:fs';
import {lifeWidth, lifeHeight, seedLife} from '../assets/essay-models.js';

const cells=seedLife(),size=20,width=lifeWidth*size,height=lifeHeight*size;
const rects=[`<rect width="${width}" height="${height}" fill="#f3eddf"/>`];
for(let y=0;y<lifeHeight;y++)for(let x=0;x<lifeWidth;x++) {
  rects.push(`<rect x="${x*size+1}" y="${y*size+1}" width="18" height="18" rx="1" fill="${cells[y*lifeWidth+x]?'#29332f':'#e5dfd1'}"/>`);
}
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="A mixed starting field of live cells in Conway's Game of Life. Each cell follows the same rule based on its eight neighbours.">${rects.join('')}</svg>\n`;
writeFileSync(new URL('../assets/essays/intelligence-between-things/local-rules.svg',import.meta.url),svg);
console.log('Rendered the Game of Life fallback from the current starting field.');
