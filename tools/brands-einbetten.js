#!/usr/bin/env node
// brands.js in die HTML-Seiten einbetten.
//
// Die Grower Edition bleibt bewusst Single-File: wer nur index.html
// herunterlaedt, soll eine vollstaendige, offline lauffaehige App haben.
// Die Duengerdaten pflegt man trotzdem an EINER Stelle - in brands.js -
// und bettet sie danach mit diesem Skript in alle Seiten ein:
//
//   node tools/brands-einbetten.js          # einbetten
//   node tools/brands-einbetten.js --pruefen  # nur pruefen, Exit 1 bei Abweichung
//
// Beim ersten Lauf ersetzt es die frueher fest eingebauten Bloecke
// (const BRANDS_DATA = {...} bzw. const BRANDS = {...}); danach nur noch den
// Abschnitt zwischen den Markern.
const fs = require('fs'), path = require('path');
const WURZEL = path.join(__dirname, '..');
const SEITEN = ['index.html', 'dwc_grower_edition.html', 'nutrients_library.html'];
const ANFANG = '// ▼▼▼ brands.js – eingebettet von tools/brands-einbetten.js, NICHT hier bearbeiten ▼▼▼';
const ENDE = '// ▲▲▲ Ende brands.js ▲▲▲';
const pruefen = process.argv.includes('--pruefen');

const quelle = fs.readFileSync(path.join(WURZEL, 'brands.js'), 'utf8').trimEnd();
const block = ANFANG + '\n' + quelle + '\n' + ENDE;

// Ende eines Objektliterals finden - Klammern in Zeichenketten und Kommentaren
// zaehlen nicht mit.
function objektEnde(s, start) {
  let tiefe = 0;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (c === '"' || c === "'" || c === '`') {
      for (i++; i < s.length && s[i] !== c; i++) if (s[i] === '\\') i++;
      continue;
    }
    if (c === '/' && s[i + 1] === '/') { i = s.indexOf('\n', i); continue; }
    if (c === '/' && s[i + 1] === '*') { i = s.indexOf('*/', i) + 1; continue; }
    if (c === '{') tiefe++;
    else if (c === '}' && --tiefe === 0) return i;
  }
  throw new Error('Objektende nicht gefunden');
}

let fehler = 0;
for (const seite of SEITEN) {
  const datei = path.join(WURZEL, seite);
  const s = fs.readFileSync(datei, 'utf8');
  let neu;
  const a = s.indexOf(ANFANG), e = s.indexOf(ENDE);
  if (a >= 0 && e > a) {
    neu = s.slice(0, a) + block + s.slice(e + ENDE.length);
  } else {
    const m = s.match(/const (BRANDS_DATA|BRANDS) = \{/);
    if (!m) throw new Error(seite + ': weder Marker noch alter Datenblock gefunden');
    const start = m.index, auf = start + m[0].length - 1;
    let ende = objektEnde(s, auf) + 1;
    if (s[ende] === ';') ende++;
    neu = s.slice(0, start) + block + s.slice(ende);
  }
  if (neu === s) { console.log('  ' + seite + ': aktuell'); continue; }
  if (pruefen) { console.log('  ' + seite + ': WEICHT von brands.js AB'); fehler++; continue; }
  fs.writeFileSync(datei, neu);
  console.log('  ' + seite + ': eingebettet');
}
if (fehler) { console.error('\nbrands.js ist nicht in allen Seiten aktuell: node tools/brands-einbetten.js'); process.exit(1); }
