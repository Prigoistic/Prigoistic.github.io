import {render} from 'pele';
import fs from 'node:fs';
const dir=new URL('../assets/essays/intelligence-between-things/',import.meta.url);
fs.mkdirSync(dir,{recursive:true});
const diagrams={
 'emergence-path':`A["Recurring bytes"] --> B["Reusable chunks"]\nB --> C["Contextual classes"]\nC --> D["Relations and rules"]`,
 'workspace':`A["Persistent relational store"] -->|"retrieve relevant structure"| B["Workspace in RAM"]\nB -->|"accepted learning changes"| A\nB --> C["Reasoning and response"]`,
 'compilation':`A["Cue"] --> B["Several reasoning steps"]\nB --> C["Answer"]\nA -. "learn a conditional shortcut" .-> C`
};
for(const [name,body] of Object.entries(diagrams)){
 for(const direction of ['LR','TB']){
  let {svg}=render(`flowchart ${direction}\n${body}`);
  const colours='--pele-bg:#f3eddf;--pele-fg:#29332f;--pele-muted:#65655d;--pele-line:#7d8877;--pele-surface:#f8f4eb;--pele-surface-alt:#e8dfca;--pele-border:#b4ad9d;--pele-accent:#aa5038;--pele-font:Arial,sans-serif;--pele-radius:2px;';
  svg=svg.replace('style="','style="'+colours);
  fs.writeFileSync(new URL(`${name}${direction==='TB'?'-mobile':''}.svg`,dir),svg+'\n');
 }
}
console.log('Rendered six responsive SVG diagrams with Pele.');
