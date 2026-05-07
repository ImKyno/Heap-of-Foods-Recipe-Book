const fs = require("fs");

const files = [
  "data/recipes_cookpot.json",
  "data/recipes_cookpot_warly.json",
  "data/recipes_cookpot_seasonal.json",
  "data/recipes_cookpot_jar.json",
  "data/recipes_cookpot_keg.json",
];

function extractNames(json) {
  if (Array.isArray(json)) {
    return json.map(r => r.name).filter(Boolean);
  }

  return Object.values(json)
    .map(r => r.name)
    .filter(Boolean);
}

function convertFile(file) {
  const raw = fs.readFileSync(file, "utf-8");
  const json = JSON.parse(raw);

  const names = extractNames(json);

  const seen = new Set();
  const list = [];

  for (const name of names) {
    if (!seen.has(name)) {
      seen.add(name);
      list.push(name);
    }
  }

  let out = "-- Auto-generated from " + file + "\n";
  out += "return {\n";

  for (const name of list) {
    out += `    "${name}",\n`;
  }

  out += "}\n";

  const outFile = file.replace(".json", ".lua");
  fs.writeFileSync(outFile, out);

  console.log(`✔ Converted ${file} -> ${outFile}`);
}

for (const file of files) {
  convertFile(file);
}