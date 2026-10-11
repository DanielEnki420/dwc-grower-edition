#!/usr/bin/env node
// Wechselwasser-Zaehler rechnet in Kalendertagen (11.10.2026)
//
// Vorher zaehlte er 24-Stunden-Bloecke ab dem Klick auf "Wechsel
// durchgefuehrt". Wechsel am 5.10. um 21:31, Intervall 7: am 11.10. um 20:27
// stand "noch 2 Tage" da, darunter "Naechster: 12.10." - und Daniel plante den
// Wechsel einen Tag zu spaet. Geprueft wird kalenderTageZwischen() direkt aus
// beiden Seiten, in deutscher Zeit (inkl. Zeitumstellung am 25.10.2026).
process.env.TZ = 'Europe/Berlin';
const fs = require('fs'), path = require('path');
const fehler = [];
for (const seite of ['index.html', 'dwc_grower_edition.html']) {
const html = fs.readFileSync(path.join(__dirname, '..', seite), 'utf8');

const fn = html.match(/function kalenderTageZwischen\([\s\S]*?\n}/);
if (!fn) { fehler.push(seite + ': kalenderTageZwischen() fehlt'); continue; }
const kalenderTageZwischen = new Function(fn[0] + '; return kalenderTageZwischen;')();

const FAELLE = [
    ['2026-10-05T21:31', '2026-10-11T20:27', 6, 'Daniels Fall: am Vorabend 6 Tage her -> noch 1 Tag'],
    ['2026-10-05T21:31', '2026-10-11T23:59', 6, 'kurz vor Mitternacht'],
    ['2026-10-05T21:31', '2026-10-12T00:01', 7, 'nach Mitternacht faellig'],
    ['2026-10-05T21:31', '2026-10-05T23:00', 0, 'am selben Abend 0'],
    ['2026-10-24T12:00', '2026-10-26T00:30', 2, 'ueber die Zeitumstellung (25.10., 25 Stunden)'],
    ['2026-03-28T12:00', '2026-03-30T00:30', 2, 'ueber die Zeitumstellung (29.3., 23 Stunden)'],
];
for (const [von, bis, soll, name] of FAELLE) {
    const ist = kalenderTageZwischen(new Date(von), new Date(bis));
    if (ist !== soll) fehler.push(`${seite} ${name}: ${ist}, erwartet ${soll}`);
}

const ww = html.match(/function updateWaterDisplay\(\)[\s\S]*?\n}/);
if (!ww) fehler.push('updateWaterDisplay() fehlt');
else {
    if (!ww[0].includes('kalenderTageZwischen(last, now)')) fehler.push('updateWaterDisplay() zaehlt nicht ueber kalenderTageZwischen()');
    if (/86400000/.test(ww[0])) fehler.push('updateWaterDisplay() rechnet wieder in 24-Stunden-Bloecken');
    if (!ww[0].includes('tageText(')) fehler.push('updateWaterDisplay() schreibt "1 Tage" statt "1 Tag"');
}
if ((html.match(/^\s+day_unit:/gm) || []).length !== 6) fehler.push('day_unit fehlt in einer der sechs Sprachen');

}

if (fehler.length) {
    console.error('FEHLER:');
    for (const f of fehler) console.error('  - ' + f);
    process.exit(1);
}
console.log('OK — Wechselwasser in Kalendertagen, beide Seiten.');
