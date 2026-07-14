import fs from "fs"; import esbuild from "esbuild";
const lang = process.argv[2];
const dir = `/mnt/documents/trans-cache-${lang}`;
const files = fs.readdirSync(dir).filter(f=>f.endsWith(".txt"));
const bad=[];
for(const f of files){
  const code=fs.readFileSync(`${dir}/${f}`,"utf8");
  try{ await esbuild.transform(code,{loader:"ts"}); }
  catch(e){ bad.push(f); }
}
console.log(lang,"chunks:",files.length,"bad:",bad.sort((a,b)=>+a.match(/\d+/)-+b.match(/\d+/)).join(" "));
