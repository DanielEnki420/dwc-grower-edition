#!/usr/bin/env node
// Belegpflicht fuer brands.js
//
// Hintergrund: Bis zum 17.9.2026 sah jede Zahl in brands.js aus wie eine
// Herstellerangabe. Beim ersten echten Abgleich stellte sich heraus, dass
// Plagron Green Sensation mit einem Zehntel der Herstellerdosis drinstand
// und ein Produkt "Glucose" gefuehrt wurde, das es bei Plagron nicht gibt.
// Die vorherige Pruefung hatte nur zwei Kopien miteinander verglichen -
// sie waren einig und beide falsch.
//
// Dieser Test haelt fest, wie viele Produkte noch UNBELEGT sind. Die Zahl
// darf nur sinken. Damit kann kein neues Produkt ohne Beleg hereinrutschen,
// und jeder erledigte Rechercheschritt macht sich sichtbar.

const fs = require('fs'), path = require('path');
const DATEI = path.join(__dirname, '..', 'brands.js');

// Stand 17.9.2026: 12. Seit der Nachrecherche vom 24.9.2026: 0.
// Nicht wieder anheben - ein neues Produkt kommt nur mit Beleg herein.
const OFFEN_MAX = 0;

const STATUS = ['belegt', 'fraglich', 'eingestellt', 'ungeeignet', 'ungeprueft'];

const src = fs.readFileSync(DATEI, 'utf8');
const a = src.indexOf('const MARKEN'), b = src.indexOf('// ── Adapter');
if (a < 0 || b < 0) { console.error('FEHLER: MARKEN-Block in brands.js nicht gefunden'); process.exit(1); }
const MARKEN = eval('(' + src.slice(a, b).replace(/^const MARKEN\s*=\s*/, '').trim().replace(/;$/, '') + ')');

let offen = 0, belegt = 0, fehler = [];
const zaehler = {};
for (const [mk, m] of Object.entries(MARKEN)) {
    for (const [pk, p] of Object.entries(m.produkte)) {
        const q = p.quelle;
        if (!q || !q.status) { fehler.push(`${m.name} / ${p.name}: kein Feld quelle.status`); offen++; continue; }
        if (!STATUS.includes(q.status)) fehler.push(`${m.name} / ${p.name}: unbekannter status "${q.status}"`);
        zaehler[q.status] = (zaehler[q.status] || 0) + 1;
        if (q.status === 'ungeprueft') offen++;
        if (q.status === 'belegt') {
            belegt++;
            if (!q.beleg) fehler.push(`${m.name} / ${p.name}: status "belegt" ohne Feld beleg`);
        }
        if (q.status === 'fraglich' && !q.hinweis)
            fehler.push(`${m.name} / ${p.name}: status "fraglich" ohne Begruendung im Feld hinweis`);
        if (q.status === 'ungeeignet' && !q.beleg)
            fehler.push(`${m.name} / ${p.name}: status "ungeeignet" ohne Beleg`);
        // Ungeeignet heisst: der Rechner dosiert es nicht. Bis 24.9.2026 lief
        // Cyco XL als "Bluete-Booster", obwohl Cyco es fuer DWC nicht vorsieht.
        if (q.status === 'ungeeignet')
            for (const ph of ['wuchs', 'bluete'])
                if (m.dosis && m.dosis[ph] && m.dosis[ph][pk] && Object.keys(m.dosis[ph][pk]).length)
                    fehler.push(`${m.name} / ${p.name}: status "ungeeignet", wird aber in ${ph} dosiert`);
    }
}

// Eine Marke, bei der kein Produkt fuer DWC taugt, darf in keinem der beiden
// Rechner waehlbar sein (BioBizz seit 24.9.2026).
const fn = src.match(/function markeWaehlbar\([\s\S]*?\n}/);
if (!fn) fehler.push('markeWaehlbar() fehlt in brands.js');
else {
    const markeWaehlbar = new Function(fn[0] + '; return markeWaehlbar;')();
    for (const [mk, m] of Object.entries(MARKEN)) {
        const alleUngeeignet = Object.values(m.produkte).every(p => p.quelle && p.quelle.status === 'ungeeignet');
        if (markeWaehlbar(m) === alleUngeeignet)
            fehler.push(`${m.name}: markeWaehlbar() liefert ${markeWaehlbar(m)}, alle Produkte ungeeignet = ${alleUngeeignet}`);
        if (alleUngeeignet && !m.nichtFuerDWC)
            fehler.push(`${m.name}: nicht waehlbar, aber ohne Begruendung im Feld nichtFuerDWC`);
    }
    for (const seite of ['index.html', 'dwc_grower_edition.html', 'nutrients_library.html']) {
        const html = fs.readFileSync(path.join(__dirname, '..', seite), 'utf8');
        if ((html.match(/markeWaehlbar\(/g) || []).length < 2)
            fehler.push(`${seite}: prueft die Waehlbarkeit nicht (Auswahl UND Wiederherstellung)`);
    }
}

// ── Seit 24.9.2026: Obergrenzen, Einheiten, Bluetenplan, EC ─────────────
for (const [mk, m] of Object.entries(MARKEN)) {
    for (const [pk, p] of Object.entries(m.produkte)) {
        // Wo der Hersteller einen Hoechstwert nennt, liegt keine Dosis darueber.
        // Eine Untergrenze wird bewusst NICHT geprueft (Hausregel: zu wenig
        // aergert, zu viel verbrennt).
        const hw = p.quelle && p.quelle.hoechstwert;
        if (hw !== undefined) {
            if (typeof hw !== 'number') fehler.push(`${m.name} / ${p.name}: hoechstwert ist keine Zahl`);
            for (const ph of ['wuchs', 'bluete'])
                for (const [w, v] of Object.entries(((m.dosis || {})[ph] || {})[pk] || {}))
                    if (v > hw + 1e-9) fehler.push(`${m.name} / ${p.name}: ${ph} Woche ${w} = ${v}, Hersteller-Hoechstwert ${hw}`);
        }
        if (p.einheit !== undefined && !['g', 'ml'].includes(p.einheit))
            fehler.push(`${m.name} / ${p.name}: unbekannte einheit "${p.einheit}"`);
    }
    // Bluetenplan nach Herstellerschema: Naehrstoffwochen + Spuelen
    const plan = m.wochen && m.wochen.bluete;
    if (plan) {
        if (!(plan.naehrstoff >= 1 && plan.naehrstoff <= plan.gesamt && plan.gesamt <= 12))
            fehler.push(`${m.name}: wochen.bluete unplausibel (${JSON.stringify(plan)})`);
        for (const [pk, d] of Object.entries((m.dosis || {}).bluete || {}))
            for (const w of Object.keys(d))
                if (+w > plan.naehrstoff) fehler.push(`${m.name} / ${pk}: dosiert in Bluetewoche ${w}, das ist eine Spuelwoche`);
    }
    // Fuer ALLE Marken (seit 24.9.2026): EC-Wochenziele liegen im Warnbereich.
    // Sonst meldet das Dashboard "EC zu hoch", obwohl genau nach Plan gemischt
    // wurde - so war es bei 9 Marken, auch bei Hesi.
    for (const ph of ['wuchs', 'bluete']) {
        const ziele = Object.values((m.ec || {})[ph] || {}).filter(v => v !== null && v !== undefined);
        const r = m.ecRange && m.ecRange[ph];
        if (ziele.length && !r) fehler.push(`${m.name}: EC-Ziele in ${ph}, aber kein ecRange`);
        if (r) for (const v of ziele)
            if (v < r[0] - 1e-9 || v > r[1] + 1e-9) fehler.push(`${m.name}: EC-Ziel ${v} (${ph}) ausserhalb ecRange ${JSON.stringify(r)}`);
    }
}

// ── Stichwerte (24.9.2026; Aptus, GHE, Hesi-Wochen, Athena CaMg, CalMag seit 25.9.) ─
// Faengt Umrechnungsfehler (Gallone/Liter, je Komponente/zusammen) und
// versehentliches Zuruecksetzen. undefined = in dieser Woche NICHT dosiert.
const GOLD = [
    ['cyco',   'wuchs',  'cycoGrowA',  3, 2.5],  ['cyco',  'bluete', 'cycoBloomA', 1, 2.5],
    ['cyco',   'bluete', 'silica',     5, 1],    ['cyco',  'bluete', 'swell',      4, undefined],
    ['house',  'wuchs',  'aquaA',      1, 1.19], ['house', 'bluete', 'aquaA',      4, 2.38],
    ['house',  'bluete', 'topShooter', 7, 1.06], ['house', 'bluete', 'shooting',   6, undefined],
    ['remo',   'wuchs',  'rGrow',      4, 2.11], ['remo',  'bluete', 'rMicro',     5, 2.64],
    ['remo',   'bluete', 'candy',      8, undefined],
    ['mills',  'wuchs',  'startR',     2, 0.7],  ['mills', 'bluete', 'basisA',     4, 1.5],
    ['ghe',    'bluete', 'koolbloom',  5, 0.26], ['ghe',   'bluete', 'koolbloom',  6, 0.48],
    ['ghe',    'wuchs',  'floraMicro', 4, 1.24], ['ghe',   'bluete', 'ripen',      8, 1.32],
    ['ghe',    'bluete', 'floraBlend', 3, undefined], ['aptus', 'bluete', 'pBoost',     1, undefined],
    ['aptus',  'bluete', 'allInOne',   3, 2],    ['aptus', 'bluete', 'breakout',   5, 1],
    ['athena', 'bluete', 'fade',       7, 3.2],  ['athena','bluete', 'proCore',    7, undefined],
    ['athenaBlended', 'bluete', 'bloomA', 7, undefined],
    ['hesi',   'bluete', 'boost',      2, undefined], ['hesi',  'bluete', 'boost',      4, 2],
    ['hesi',   'bluete', 'hydroblte',  8, undefined], ['hesi',  'bluete', 'wurzel',     2, undefined],
    ['athenaBlended', 'bluete', 'camg', 7, 0.5],    ['athena', 'bluete', 'camg',      7, undefined],
    ['athenaBlended', 'wuchs',  'camg', 1, 0.5],    ['athena', 'bluete', 'pk',        5, undefined],
    ['athena',  'wuchs',  'camg',       1, undefined],
    ['canna',  'wuchs',  'calmag',     1, undefined], ['remo',  'wuchs',  'magnifical', 1, undefined],
];
// ── Sichtbare Texte ohne ae/oe/ue/ss-Ersatz (25.9.2026) ─────────────────
// planHinweis, Tipps, Wochenhinweise, Spuelwoche und Produktnotizen erscheinen
// so im Dashboard. Gefunden waren u. a. "Fuer", "Bluetewoche", "schliesst".
const ERSATZ = /(?<![A-Za-zÄÖÜäöüß])(fuer|ueber|Bluete\w*|Duenger\w*|spuel\w*|Zusaetz\w*|ausdruecklich|geprueft|hoeher\w*|Staerke|haelt|naehr\w*|waehrend|koenn\w*|muess\w*|pruef\w*|Giess\w*|giess\w*|schliesst|heisst)(?![A-Za-zÄÖÜäöüß])/i;
// Plantexte sind seit 25.9.2026 Objekte {de, en, it, fr, es, pt}: vorher
// erschienen sie nur auf Deutsch in allen sechs Sprachen. Die Umlautpruefung
// gilt dem deutschen Text; jede Sprache muss vorhanden und nicht leer sein.
const PLAN_SPRACHEN = ['de', 'en', 'it', 'fr', 'es', 'pt'];
const deutsch = (x, wo) => {
    if (x === undefined || x === null || x === '') return x;
    if (typeof x === 'string') { fehler.push(`${wo}: nur deutsch, Uebersetzungen fehlen`); return x; }
    for (const l of PLAN_SPRACHEN) if (typeof x[l] !== 'string' || !x[l].trim()) fehler.push(`${wo}: Sprache ${l} fehlt`);
    return x.de;
};
for (const [mk, m] of Object.entries(MARKEN)) {
    const texte = [deutsch(m.planHinweis, `${mk} planHinweis`), ...(m.tips || []).map(t => t.text)];
    for (const ph of ['wuchs', 'bluete']) {
        for (const [w, h] of Object.entries((m.hinweis || {})[ph] || {})) texte.push(deutsch(h, `${mk} Hinweis ${ph} ${w}`));
        const wb = (m.wochen || {})[ph]; if (wb) texte.push(deutsch(wb.spuelen, `${mk} Spueltext`));
    }
    for (const p of Object.values(m.produkte)) texte.push(p.name, p.note);
    for (const t of texte.filter(x => typeof x === 'string')) {
        const x = ERSATZ.exec(t);
        if (x) fehler.push(`${m.name}: sichtbarer Text mit "${x[0]}" statt Umlaut`);
    }
}

for (const [mk, ph, pk, w, soll] of GOLD) {
    const ist = (((MARKEN[mk] || {}).dosis || {})[ph] || {})[pk];
    const v = ist ? ist[w] : undefined;
    if (v !== soll) fehler.push(`Stichwert ${mk}/${ph}/${pk} Woche ${w}: ${v}, erwartet ${soll}`);
}

// Grower Edition: Single-File-Seiten tragen brands.js eingebettet. Jede Seite
// muss GENAU den Stand der Quelle enthalten (node tools/brands-einbetten.js).
for (const seite of ['index.html', 'dwc_grower_edition.html', 'nutrients_library.html']) {
    const html = fs.readFileSync(path.join(__dirname, '..', seite), 'utf8');
    if (!html.includes(src.trimEnd())) fehler.push(`${seite}: eingebettete Daten weichen von brands.js ab - node tools/brands-einbetten.js`);
}

console.log('brands.js — Belegstand');
for (const s of STATUS) console.log(`  ${s.padEnd(12)} ${zaehler[s] || 0}`);
console.log(`  ${'-'.repeat(20)}`);
console.log(`  unbelegt ${offen}, erlaubt sind hoechstens ${OFFEN_MAX}`);

if (fehler.length) {
    console.error('\nFEHLER:');
    for (const f of fehler) console.error('  - ' + f);
}
if (offen > OFFEN_MAX) {
    console.error(`\nFEHLGESCHLAGEN: ${offen} unbelegte Produkte, erlaubt sind ${OFFEN_MAX}.`);
    console.error('Ein neues Produkt braucht ein Feld quelle mit Herstellerbeleg.');
    process.exit(1);
}
if (fehler.length) process.exit(1);
if (offen < OFFEN_MAX)
    console.log(`\nGut: ${OFFEN_MAX - offen} Produkte weniger unbelegt als festgehalten.`);
console.log(`\nOK — ${belegt} Produkte gegen die Herstellerangabe geprueft.`);
