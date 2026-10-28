import {memoryFields, actionsForAnimal, createMemoryStore, createMemory, buildMemoryIndex, retrieveMemories, backgroundMemories, memorySentence} from './hstore-model.js';

export function initHStorePlayground(root) {
  if (!root) return;
  const $ = selector => root.querySelector(selector);
  const all = selector => [...root.querySelectorAll(selector)];
  const ns = 'http://www.w3.org/2000/svg';
  const node = (tag, attrs={}, text) => {
    const el=document.createElementNS(ns,tag);
    Object.entries(attrs).forEach(([key,value])=>el.setAttribute(key,String(value)));
    if(text!==undefined)el.textContent=text;
    return el;
  };
  const button = (text, action) => {
    const el=document.createElement('button');el.type='button';el.textContent=text;el.addEventListener('click',action);return el;
  };
  let records=createMemoryStore(), index=buildMemoryIndex(records), selected=1, pinned=[];
  const maxRecords=96, narrow=window.matchMedia('(max-width:560px)');
  const filters=all('[data-memory-filter]');
  const cues=()=>Object.fromEntries(filters.map(select=>[select.dataset.memoryFilter,select.value]));
  const memoryNoun=count=>count===1?'memory':'memories';
  const idLabel=id=>`E${String(id).padStart(2,'0')}`;
  const announce = text => {$('[data-playground-status]').textContent=text;};
  function inspect(id) {selected=id;render();}
  function renderMap(matches) {
    const svg=$('[data-memory-map]'), active=new Set(matches.map(record=>record.id));
    const points=new Map(), children=[];
    svg.setAttribute('viewBox',narrow.matches?'0 0 360 420':'0 0 720 320');
    memoryFields.place.forEach((place,group)=>{
      const [cx,cy]=narrow.matches?[[96,110],[264,110],[180,300]][group]:[[128,163],[360,163],[592,163]][group];
      const local=records.filter(record=>record.place===place), size=narrow.matches?76:100;
      children.push(node('circle',{cx,cy,r:size,class:'memory-region'}));
      children.push(node('text',{x:cx,y:cy-size-15,'text-anchor':'middle',class:'memory-region-label'},place));
      local.forEach((record,i)=>{
        const angle=-Math.PI/2+i*2.399963229728653;
        const radius=Math.sqrt((i+.65)/local.length)*(narrow.matches?55:77);
        points.set(record.id,{x:cx+Math.cos(angle)*radius,y:cy+Math.sin(angle)*radius});
      });
      // Edges join observations in the same place which share an animal or person.
      local.forEach((record,i)=>{
        const next=local.slice(i+1).find(other=>other.animal===record.animal || other.person===record.person);
        if(!next)return;
        const a=points.get(record.id), b=points.get(next.id);
        children.push(node('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,class:active.has(record.id)&&active.has(next.id)?'memory-edge is-match':'memory-edge'}));
      });
    });
    records.forEach(record=>{
      const p=points.get(record.id), match=active.has(record.id), isSelected=record.id===selected;
      const g=node('g',{transform:`translate(${p.x} ${p.y})`,class:`memory-point${match?' is-match':''}${isSelected?' is-selected':''}${pinned.includes(record.id)?' is-pinned':''}`,role:'button',tabindex:'0','aria-label':`Memory ${record.id}: ${memorySentence(record)}${match?' Matches the current cues.':' Outside the current cues.'}`,'aria-pressed':String(isSelected)});
      g.append(node('circle',{r:19,class:'memory-hit'}),node('circle',{r:16,class:'memory-selection'}),node('circle',{r:12,class:'memory-dot'}),node('text',{'text-anchor':'middle','dominant-baseline':'central',class:'memory-number'},record.id));
      g.addEventListener('click',()=>inspect(record.id));
      g.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();inspect(record.id);root.querySelector(`[aria-label^="Memory ${record.id}:"]`)?.focus();}});
      children.push(g);
    });
    svg.replaceChildren(...children);
    svg.setAttribute('aria-label',`Event map grouped by place. ${matches.length} of ${records.length} memories ${matches.length===1?'matches':'match'}. Select a numbered memory to inspect it.`);
  }
  function render() {
    const query=cues(), matches=retrieveMemories(records,query,index);
    $('[data-stored-count]').textContent=records.length;
    $('[data-matched-count]').textContent=matches.length;
    $('[data-quiet-count]').textContent=records.length-matches.length;
    $('[data-query-summary]').textContent=Object.values(query).filter(Boolean).join(' + ') || 'Everything in the store';
    $('[data-match-summary]').textContent=`Browse matching memories (${matches.length})`;
    const resultList=$('[data-memory-results]');
    resultList.replaceChildren(...matches.map(record=>{
      const el=button(`${idLabel(record.id)} · ${memorySentence(record)}`,()=>inspect(record.id));
      el.setAttribute('aria-pressed',String(record.id===selected));return el;
    }));
    if(!matches.length){const p=document.createElement('p');p.textContent='No events fit all these cues. Remove a cue or add a memory of your own.';resultList.append(p);}
    const record=records.find(item=>item.id===selected) || records[0];
    $('[data-inspected-id]').textContent=`${idLabel(record.id)} · ${record.time}`;
    $('[data-inspected-text]').textContent=memorySentence(record);
    const missing=Object.entries(query).filter(([field,value])=>value&&record[field]!==value).map(([,value])=>value);
    $('[data-inspected-match]').textContent=missing.length?`Outside this query: does not include ${missing.join(' + ')}.`:'Matches every selected cue.';
    $('[data-pin-memory]').disabled=pinned.includes(record.id)||pinned.length>=4;
    $('[data-pin-memory]').textContent=pinned.includes(record.id)?'In workspace':pinned.length>=4?'Workspace full':'Pin to workspace';
    const workspace=$('[data-pinned-memories]');
    workspace.replaceChildren(...pinned.map(id=>{
      const li=document.createElement('li'), memory=records.find(item=>item.id===id);
      const label=document.createElement('span');label.textContent=`${idLabel(id)} · ${memorySentence(memory)}`;
      const remove=button('×',()=>{pinned=pinned.filter(item=>item!==id);render();announce(`Removed ${idLabel(id)} from the workspace. The stored memory remains.`);});
      remove.setAttribute('aria-label',`Remove memory ${id} from workspace`);li.append(label,remove);return li;
    }));
    $('[data-workspace-empty]').hidden=pinned.length>0;
    $('[data-workspace-count]').textContent=`${pinned.length}/4`;
    $('[data-clear-workspace]').disabled=!pinned.length;
    $('[data-add-background]').disabled=records.length+12>maxRecords;
    $('[data-add-memory]').disabled=records.length>=maxRecords;
    renderMap(matches);
  }
  function changedQuery() {
    const matches=retrieveMemories(records,cues(),index);
    if(matches.length)selected=matches[0].id;
    render();announce(`${matches.length} ${memoryNoun(matches.length)} ${matches.length===1?'matches':'match'}. The store still contains ${records.length} events.`);
  }
  filters.forEach(select=>select.addEventListener('change',changedQuery));
  all('[data-memory-preset]').forEach(el=>el.addEventListener('click',()=>{
    const preset=[{animal:'Dog',action:'Barked',person:'Alice',place:'Hall'},{animal:'Cat',action:'',person:'',place:'Garden'},{animal:'Dog',action:'Chirped',person:'',place:''}][Number(el.dataset.memoryPreset)];
    filters.forEach(select=>{select.value=preset[select.dataset.memoryFilter];});changedQuery();
  }));
  $('[data-clear-cues]').addEventListener('click',()=>{filters.forEach(select=>{select.value='';});changedQuery();});
  $('[data-pin-memory]').addEventListener('click',()=>{if(!pinned.includes(selected)&&pinned.length<4){pinned.push(selected);render();announce(`${idLabel(selected)} pinned. ${pinned.length} ${memoryNoun(pinned.length)} in your workspace.`);}});
  $('[data-clear-workspace]').addEventListener('click',()=>{pinned=[];render();announce(`Workspace cleared. All ${records.length} memories remain in the store.`);});
  $('[data-add-background]').addEventListener('click',()=>{
    if(records.length+12>maxRecords)return;
    records.push(...backgroundMemories(Math.max(...records.map(record=>record.id))+1));index=buildMemoryIndex(records);render();announce('Added twelve background events. Your current query is unchanged.');
  });
  const form=$('[data-memory-form]'), animal=form.elements.namedItem('animal'), action=form.elements.namedItem('action');
  function updateActions(){const choices=actionsForAnimal(animal.value);action.replaceChildren(...choices.map(value=>new Option(value,value)));}
  animal.addEventListener('change',updateActions);updateActions();
  form.addEventListener('submit',event=>{
    event.preventDefault();if(records.length>=maxRecords)return;
    const fields=Object.fromEntries(new FormData(form));
    const record=createMemory(Math.max(...records.map(item=>item.id))+1,fields);
    records.push(record);index=buildMemoryIndex(records);selected=record.id;render();announce(`Stored ${idLabel(record.id)}. ${memorySentence(record)}`);
  });
  $('[data-reset-playground]').addEventListener('click',()=>{
    records=createMemoryStore();index=buildMemoryIndex(records);pinned=[];selected=1;
    filters.forEach(select=>{select.value=select.dataset.memoryFilter==='animal'?'Dog':'';});
    form.reset();updateActions();render();announce('Reset to the original twenty-four memories.');
  });
  narrow.addEventListener('change',()=>render());
  $('[data-playground-fallback]').hidden=true;
  $('[data-playground-ui]').hidden=false;
  render();
}
