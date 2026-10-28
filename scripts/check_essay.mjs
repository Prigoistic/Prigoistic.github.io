import assert from 'node:assert/strict';
import {lifeWidth, lifeHeight, seedLife, stepLife, energy, descend} from '../assets/essay-models.js';

import {createMemoryStore, buildMemoryIndex, retrieveMemories, createMemory, backgroundMemories} from '../assets/hstore-model.js';

// The canonical glider must translate one cell diagonally every four generations.
const width = 10, height = 10, seed = new Uint8Array(100);
[[2,1],[3,2],[1,3],[2,3],[3,3]].forEach(([x,y]) => { seed[y*width+x] = 1; });
let shifted = seed;
for (let i = 0; i < 4; i++) shifted = stepLife(shifted, width, height);
const expected = new Uint8Array(100);
[[3,2],[4,3],[2,4],[3,4],[4,4]].forEach(([x,y]) => { expected[y*width+x] = 1; });
assert.deepEqual(shifted, expected);

// Still life, synchronous oscillation and a finite edge must retain Conway's rules.
const block = new Uint8Array(100);
[[4,4],[5,4],[4,5],[5,5]].forEach(([x,y])=>{block[y*width+x]=1;});
assert.deepEqual(stepLife(block,width,height),block);
const blinker = new Uint8Array(100), vertical = new Uint8Array(100);
[[3,4],[4,4],[5,4]].forEach(([x,y])=>{blinker[y*width+x]=1;});
[[4,3],[4,4],[4,5]].forEach(([x,y])=>{vertical[y*width+x]=1;});
assert.deepEqual(stepLife(blinker,width,height),vertical);
assert.deepEqual(stepLife(vertical,width,height),blinker);
const edge = new Uint8Array(25);
[[4,0],[4,1],[4,2]].forEach(([x,y])=>{edge[y*5+x]=1;});
assert.equal(stepLife(edge,5,5)[5],0,'The right edge must not wrap around to the left.');
// The centre cell's 512 possible neighbourhoods cover birth, survival and death.
for(let bits=0;bits<512;bits++) {
  const neighbourhood=Uint8Array.from({length:9},(_,i)=>(bits>>i)&1);
  const neighbours=neighbourhood.reduce((sum,value,i)=>sum+(i===4?0:value),0);
  const shouldLive=neighbours===3 || (neighbours===2 && neighbourhood[4]===1);
  assert.equal(stepLife(neighbourhood,3,3)[4],Number(shouldLive));
}
// The examples must demonstrate different behaviours, not four copies of one loop.
const forms=seedLife('forms');
let cycle=forms;
for(let i=0;i<6;i++)cycle=stepLife(cycle);
assert.deepEqual(cycle,forms,'Blinker and pulsar together repeat after six steps.');
assert.notDeepEqual(stepLife(stepLife(forms)),forms,'The pulsar must change across the two-step blinker cycle.');
let expanding=seedLife('five');
assert.equal(expanding.reduce((a,b)=>a+b,0),5);
const unique=new Set();let peak=0;
for(let i=0;i<80;i++) {
  unique.add(expanding.join(''));peak=Math.max(peak,expanding.reduce((a,b)=>a+b,0));
  expanding=stepLife(expanding);
}
assert.equal(unique.size,80,'The five-cell example must keep evolving through the first 80 steps.');
assert.ok(peak>30);
const field=seedLife();
assert.equal(field.length,lifeWidth*lifeHeight);
assert.ok(field.reduce((a,b)=>a+b,0)>100,'The default field should contain a substantial mixed population.');
assert.deepEqual(seedLife(),field,'Reset must reproduce the initial field.');
assert.notDeepEqual(seedLife('field',()=>1),field,'New field accepts a fresh random source.');

// The chosen integration step must descend to either well throughout the slider's range.
for (let start = -1.4; start <= 1.4; start += .1) {
  let x = start;
  for (let i = 0; i < 120; i++) {
    const next = descend(x);
    assert.ok(energy(next) <= energy(x) + 1e-12);
    x = next;
  }
  if (Math.abs(start) > .01) assert.ok(Math.abs(Math.abs(x)-1) < .001);
}
assert.equal(descend(0), 0); // The unstable equilibrium cannot move without a perturbation.
// Combining actual event cues must narrow the right records, not arbitrary dot IDs.
const records = createMemoryStore(), index = buildMemoryIndex(records);
const queries = [
  {animal:'Dog'},
  {animal:'Dog',action:'Barked'},
  {animal:'Dog',action:'Barked',person:'Alice'},
  {animal:'Dog',action:'Barked',person:'Alice',place:'Hall'}
];
const sets = queries.map(cues=>retrieveMemories(records,cues,index));
assert.deepEqual(sets.map(set=>set.length),[13,7,3,2]);
assert.deepEqual(sets[3].map(record=>record.id),[1,2]);
assert.equal(retrieveMemories(records,{}).length,24);
assert.equal(retrieveMemories(records,{animal:'Dog',action:'Chirped'},index).length,0);
sets.slice(1).forEach((set,i)=>assert.ok(set.every(record=>sets[i].includes(record))));
// Other stored events must not pollute the same dog query.
const grown = [...records,...backgroundMemories(25)];
assert.equal(new Set(grown.map(record=>record.id)).size,grown.length);
assert.deepEqual(retrieveMemories(grown,queries[3]).map(record=>record.id),[1,2]);
// A matching new observation must be retrievable immediately after reindexing.
const added = createMemory(37,{animal:'Dog',action:'Barked',person:'Alice',place:'Hall'});
grown.push(added);
assert.deepEqual(retrieveMemories(grown,queries[3]).map(record=>record.id),[1,2,37]);
assert.throws(()=>createMemory(38,{animal:'Bird',action:'Barked',person:'Alice',place:'Hall'}));
assert.equal(records.length,24);
console.log('PASS: Life rules, fixed and repeating patterns, evolving seeds, finite boundaries, glider translation, energy descent, both attractors, cue intersections, store growth, and new-memory retrieval.');
