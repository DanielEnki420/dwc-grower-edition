#!/usr/bin/env node
// Ernte-Countdown tagesgenau und mit Bluetedauer der Sorte (13.11.2026)
//
// Bluetestart 24.9.2026, Hesi-Plan 8 Wochen (7 + 1 Spuelen). Am 13.11.
// (Bluetetag 50) stand schon "Erntezeit!", obwohl der Plan erst nach Tag 56
// endet und Fruit Spirit eher 8-10 Wochen braucht. Geprueft wird ernteRest()
// aus der Seite mit growTageSeit() aus grow-zeit.js und festgelegtem "heute".
process.env.TZ = 'Europe/Berlin';
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const fehler = [];

const holen = (quelle, name) => {
    const m = quelle.match(new RegExp('function ' + name + '\\([\\s\\S]*?\\n}'));
    if (!m) { fehler.push(name + '() fehlt'); return ''; }
    return m[0];
};
const code = holen(html, 'growTageSeit') + '\n' + holen(html, 'ernteRest');
if (fehler.length) { console.error('FEHLER:\n  - ' + fehler.join('\n  - ')); process.exit(1); }

function mitHeute(tag) {
    const Echt = Date;
    class FesterTag extends Echt {
        constructor(...a) { if (a.length) super(...a); else super(tag + 'T12:00:00'); }
    }
    return new Function('Date', code + '; return ernteRest;')(FesterTag);
}

const BLUETE = '2026-09-24';
const FAELLE = [
    ['2026-11-13', 'bluete', 8, 8, { bloom: BLUETE }, 6, 'Daniels Fall: Tag 50, Planende Tag 56 -> noch 6'],
    ['2026-11-13', 'bluete', 8, 8, { bloom: BLUETE, sorteTage: 63 }, 13, 'mit Sorte 63 Tage -> noch 13'],
    ['2026-11-19', 'bluete', 8, 8, { bloom: BLUETE }, 0, 'Tag 56: Planende erreicht'],
    ['2026-11-19', 'bluete', 8, 8, { bloom: BLUETE, sorteTage: 63 }, 7, 'Tag 56 mit Sorte: noch 7'],
    ['2026-11-13', 'bluete', 8, 8, { bloom: BLUETE, sorteTage: 500 }, 6, 'unsinnige Sorte -> Planende'],
    ['2026-11-13', 'bluete', 8, 8, {}, 0, 'ohne Bluetestart: grob nach Wochen wie bisher'],
    ['2026-09-20', 'wuchs', 3, 8, { bloom: BLUETE, sorteTage: 63 }, 35, 'im Wuchs: Sorte zaehlt nicht'],
];
for (const [heute, phase, woche, gesamt, grow, soll, name] of FAELLE) {
    const ist = mitHeute(heute)(phase, woche, gesamt, grow);
    if (ist !== soll) fehler.push(`${name}: ${ist}, erwartet ${soll}`);
}

const fn = holen(html, 'updateHarvestCountdown');
if (!fn.includes('ernteRest(phase, week, totalWeeks, growDaten())')) fehler.push('updateHarvestCountdown() nutzt ernteRest() nicht');
if (/\(totalWeeks - week\) \* 7;/.test(fn)) fehler.push('updateHarvestCountdown() rechnet wieder in ganzen Wochen');
if (/Erntezeit!|Harvest time!/.test(html)) fehler.push('"Erntezeit!" steht noch in der Seite');
for (const k of ['harvest_now:  \\(w,t\\) => `🔍', 'grow_sorte_label:', 'grow_sorte_ph:'])
    if ((html.match(new RegExp('^\\s+' + k, 'gm')) || []).length !== 6) fehler.push(k.split(':')[0] + ' fehlt in einer der sechs Sprachen');
if (!/id="grow-sorte"[\s\S]{0,200}onchange="saveGrowDates\(\)"/.test(html)) fehler.push('Feld grow-sorte fehlt oder speichert nicht');
if (!holen(html, 'saveGrowDates').includes("'dwc_grow_sorte'")) fehler.push('saveGrowDates() speichert die Sorte nicht');
if (!holen(html, 'growDaten').includes('sorteTage')) fehler.push('growDaten() liefert die Sorte nicht');

if (fehler.length) { console.error('FEHLER:'); for (const f of fehler) console.error('  - ' + f); process.exit(1); }
console.log(`OK — Ernte-Countdown tagesgenau mit Sorte: ${FAELLE.length} Faelle, 6 Sprachen.`);
