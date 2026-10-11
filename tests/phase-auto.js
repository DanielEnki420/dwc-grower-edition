#!/usr/bin/env node
// Phase und Woche aus den Grow-Daten (DWC-Dashboard, Modus "Auto", 11.10.2026)
//
// Geprueft wird phaseAusDaten() direkt aus index.html - dieselbe
// Funktion, mit der die Seite rechnet. Woche 1 = Tag 0-6 ab Startdatum, wie
// die Anzeige "Bluete Tag 17" oben auf der Seite zaehlt.

const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const fn = html.match(/function phaseAusDaten\([\s\S]*?\n}/);
if (!fn) { console.error('FEHLER: phaseAusDaten() fehlt in web/dwc/index.html'); process.exit(1); }
const phaseAusDaten = new Function(fn[0] + '; return phaseAusDaten;')();

const fehler = [];
// [Tage seit Keimung, seit Umzug, seit Bluetestart] -> erwartet
const FAELLE = [
    // Daniels Grow am 11.10.2026: Keimung 24.8., Umzug 7.9., Bluete 24.9.
    [[48, 34, 17], { phase: 'bluete', week: 3 }, 'Bluete Tag 17 = Woche 3'],
    [[50, 36, 19], { phase: 'bluete', week: 3 }, 'Wasserwechsel 13.10. (Tag 19) noch Woche 3'],
    [[52, 38, 21], { phase: 'bluete', week: 4 }, 'Tag 21 = erster Tag Woche 4 (Boost + PK)'],
    [[31, 17, 0], { phase: 'bluete', week: 1 }, 'Tag des Bluetestarts = Woche 1'],
    [[30, 16, -1], { phase: 'wuchs', week: 3 }, 'Bluetestart morgen: noch Wuchs, Woche ab Umzug'],
    [[14, 0, null], { phase: 'wuchs', week: 1 }, 'Umzugstag = Wuchs Woche 1'],
    [[10, null, null], { phase: 'wuchs', week: 2 }, 'ohne Umzug: ab Keimung'],
    [[10, -3, null], { phase: 'wuchs', week: 2 }, 'Umzug geplant: bis dahin ab Keimung'],
    [[200, 180, 120], { phase: 'bluete', week: 12 }, 'nie ueber Woche 12 (Ende der Auswahl)'],
    [[null, null, null], null, 'ohne Daten: kein Auto'],
    [[-2, null, null], null, 'Keimung in der Zukunft: kein Auto'],
];
for (const [[k, s, b], soll, name] of FAELLE) {
    const r = phaseAusDaten(k, s, b);
    const ist = r && { phase: r.phase, week: r.week };
    if (JSON.stringify(ist) !== JSON.stringify(soll))
        fehler.push(`${name}: ${JSON.stringify(ist)}, erwartet ${JSON.stringify(soll)}`);
}

// Die Seite muss die Funktion auch benutzen, und jeder neue Text muss in
// allen sechs Sprachen da sein.
if (!/function update\(\) \{\s*phaseAutoAnwenden\(\);/.test(html))
    fehler.push('update() ruft phaseAutoAnwenden() nicht als Erstes auf');
for (const k of ['modus_auto', 'modus_manuell', 'grow_dwc_label', 'grow_bloom_label', 'phase_auto', 'phase_auto_keine']) {
    const n = (html.match(new RegExp('^\\s+' + k + ':', 'gm')) || []).length;
    if (n !== 6) fehler.push(`Text ${k}: in ${n} statt 6 Sprachen`);
}

if (fehler.length) {
    console.error('FEHLER:');
    for (const f of fehler) console.error('  - ' + f);
    process.exit(1);
}
console.log(`OK — Phase/Woche aus Daten: ${FAELLE.length} Faelle, sechs Sprachen.`);
