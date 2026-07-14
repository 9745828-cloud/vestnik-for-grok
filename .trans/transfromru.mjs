import { chat } from "./translate.mjs";
import fs from "fs";
import esbuild from "esbuild";

const LANGS = { en: "English", zh: "Simplified Chinese", ar: "Arabic" };
const TARGET = 130;

function sys(langName) {
  return `You translate a fragment of a TypeScript source file from Russian into ${langName}.
STRICT RULES:
- Translate ONLY human-readable natural-language text inside double-quoted string literals (titles, descriptions, quotes, sentences, labels, role/title text).
- Do NOT translate or alter: import statements, identifiers, object keys, numbers, booleans, hex colors, oklch(...) values, CSS values such as "center 34%" / "center top", URLs, asset paths starting with "/", domain names (culture.ru, ru.wikipedia.org, piter.tatar, etc.), email addresses, route paths starting with "/", and any "id" or "slug" field values.
- Transliterate proper personal and place names naturally for ${langName} where natural; otherwise keep original spelling.
- Never use a raw double-quote (") inside a translated string; use guillemets «» or single quotes instead. Keep ALL code syntax, quotes, commas, brackets and structure valid and intact. Do not merge or split entries.
- Output ONLY the raw code fragment for these lines, same structure, no markdown fences, no commentary.`;
}
const clean = (s) => s.replace(/^```[a-z]*\n?/i, "").replace(/\n?```\s*$/i, "");

function makeChunks(lines) {
  const chunks = []; let start = 0;
  for (let i = 0; i < lines.length; i++) {
    if (i - start >= TARGET && /^( {0,2})[}\]];?,?$/.test(lines[i])) {
      chunks.push(lines.slice(start, i + 1)); start = i + 1;
    }
  }
  if (start < lines.length) chunks.push(lines.slice(start));
  return chunks;
}
async function valid(code){ try{ await esbuild.transform(code,{loader:"ts"}); return true;}catch(e){ return e.message; } }

async function translateFile(src, lang) {
  const langName = LANGS[lang];
  const lines = fs.readFileSync(src, "utf8").split("\n");
  const chunks = makeChunks(lines);
  const dest = src.replace(/content\.ts$/, `content.${lang}.ts`);
  const cacheDir = `/mnt/documents/transru-cache-${lang}`;
  fs.mkdirSync(cacheDir, { recursive: true });
  const out = new Array(chunks.length);
  for (let i = 0; i < chunks.length; i++) {
    const cf = `${cacheDir}/chunk-${i}.txt`;
    if (fs.existsSync(cf)) { out[i] = fs.readFileSync(cf, "utf8"); continue; }
    let res;
    for (let a = 0; a < 3; a++) {
      res = clean(await chat(sys(langName), chunks[i].join("\n")));
      if ((await valid(res)) === true) break;
    }
    out[i] = res;
    fs.writeFileSync(cf, res);
    console.error(`${lang} chunk ${i + 1}/${chunks.length}`);
  }
  let full = out.join("\n");
  full = full.replace(/^(\s*)\}\n(\s*\{)$/gm, "$1},\n$2");
  const v = await valid(full);
  fs.writeFileSync(dest, full);
  console.error(v === true ? `WROTE ${dest}` : `WROTE (invalid: ${String(v).slice(0,200)}) ${dest}`);
}
await translateFile(process.argv[2], process.argv[3]);