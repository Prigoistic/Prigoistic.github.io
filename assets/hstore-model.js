// A small fictional event store. The demo uses an incidence index, not an HStore server.
export const memoryFields = {
  animal: ['Dog', 'Cat', 'Bird'],
  action: ['Barked', 'Slept', 'Played', 'Chirped'],
  person: ['Alice', 'Bob', 'Carol'],
  place: ['Hall', 'Garden', 'Kitchen']
};
export const actionsForAnimal = animal => animal === 'Dog' ? ['Barked', 'Slept', 'Played'] : animal === 'Cat' ? ['Slept', 'Played'] : ['Chirped', 'Slept'];
const rows = [
  ['Dog','Barked','Alice','Hall'], ['Dog','Barked','Alice','Hall'],
  ['Dog','Barked','Bob','Hall'], ['Dog','Slept','Alice','Hall'],
  ['Cat','Played','Alice','Hall'], ['Cat','Slept','Bob','Hall'],
  ['Dog','Played','Carol','Hall'], ['Bird','Chirped','Carol','Hall'],
  ['Dog','Barked','Alice','Garden'], ['Dog','Barked','Bob','Garden'],
  ['Dog','Played','Alice','Garden'], ['Dog','Slept','Carol','Garden'],
  ['Cat','Played','Bob','Garden'], ['Cat','Slept','Alice','Garden'],
  ['Bird','Chirped','Carol','Garden'], ['Bird','Slept','Bob','Garden'],
  ['Dog','Barked','Bob','Kitchen'], ['Dog','Barked','Carol','Kitchen'],
  ['Dog','Slept','Alice','Kitchen'], ['Dog','Played','Bob','Kitchen'],
  ['Cat','Played','Alice','Kitchen'], ['Cat','Slept','Carol','Kitchen'],
  ['Bird','Chirped','Alice','Kitchen'], ['Bird','Slept','Carol','Kitchen']
];
export function createMemoryStore() {
  return rows.map(([animal, action, person, place], i) => ({id:i+1,animal,action,person,place,time:`Day ${1+i%3} · ${8+Math.floor(i/6)}:${String(i*7%60).padStart(2,'0')}`}));
}
export function createMemory(id, fields, time = 'Just added') {
  if (!Number.isSafeInteger(id) || id < 1) throw new Error('Invalid memory ID');
  for (const field of Object.keys(memoryFields)) {
    if (!memoryFields[field].includes(fields[field])) throw new Error(`Unknown ${field}`);
  }
  if (!actionsForAnimal(fields.animal).includes(fields.action)) throw new Error('Choose an action for this animal');
  return {id,...Object.fromEntries(Object.keys(memoryFields).map(field=>[field,fields[field]])),time};
}
export function buildMemoryIndex(records) {
  const index = new Map();
  for (const record of records) for (const field of Object.keys(memoryFields)) {
    const key = `${field}:${record[field]}`;
    if (!index.has(key)) index.set(key,new Set());
    index.get(key).add(record.id);
  }
  return index;
}
export function retrieveMemories(records, cues, index = buildMemoryIndex(records)) {
  const sets = Object.entries(cues).filter(([,value])=>value).map(([field,value])=>index.get(`${field}:${value}`) || new Set());
  if (!sets.length) return [...records];
  sets.sort((a,b)=>a.size-b.size);
  const ids = new Set([...sets[0]].filter(id=>sets.every(set=>set.has(id))));
  return records.filter(record=>ids.has(record.id));
}
export function backgroundMemories(startId, count = 12) {
  return Array.from({length:count},(_,i)=>createMemory(startId+i,{
    animal:i%2?'Bird':'Cat', action:i%2?'Chirped':'Slept',
    person:i%2?'Carol':'Bob',place:memoryFields.place[i%3]
  },'Background event'));
}
export const memorySentence = record => `The ${record.animal.toLowerCase()} ${record.action.toLowerCase()} in the ${record.place.toLowerCase()}; ${record.person} was there.`;
