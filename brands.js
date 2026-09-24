// ============================================================
// MARKEN — die EINE Quelle für beide Rechner
// ============================================================
// Bis zum 16.9.2026 lagen die Herstellerdaten zweimal: BRANDS_DATA im
// Dashboard (ml pro Liter) und BRANDS in der Nutrient Library (ml pro 10 L).
// Sie waren auseinandergelaufen — 143 widersprüchliche Werte in 8 von 14
// Marken, und selbst die Schlüssel wichen ab (ghe/gh, house/hg). Zwei
// Rechner in einer App gaben für dieselbe Marke verschiedene Mengen.
//
// ENTSCHEIDUNGEN bei der Zusammenführung:
//   Hesi     → die HYDRO-Linie des Dashboards (Hydro Wuchs/Blüte, Wurzel,
//              PowerZyme, Hesilicio, SuperVit). Sie ist die für DWC gedachte
//              Reihe und seit Wochen im Einsatz. Die TNT-Zahlen der Library
//              wurden verworfen: sie lagen exakt ein Zehntel darunter und
//              hätten das dort genannte EC-Ziel von 1,0 nie erreicht.
//   Plagron  → beide Datensätze stimmten bereits überein.
//   übrige   → bei Widerspruch gilt die Library (reicher, mit Mischreihen-
//              folge und Flush-Plänen).
//
// ⚠️ "Library gewinnt" galt für WIDERSPRÜCHE, nicht für Streichungen:
//    Produkte, die nur das Dashboard dosierte (Canna Cal-Mag Agent, Aptus
//    All-In-One), wurden übernommen statt verworfen.
//
// Einheit hier: ml pro LITER. Die Library-Ansicht rechnet im Adapter auf
// ml pro 10 L hoch. Wer hier etwas ändert, ändert es für BEIDE Seiten —
// das ist der ganze Zweck.
//
// ⚠️ Diese Datei wurde EINMALIG aus den beiden alten Datensätzen erzeugt. Das
// Erzeugerskript kann nicht erneut laufen — es las `const BRANDS_DATA` aus
// index.html, und genau die gibt es dort nicht mehr. Änderungen gehören ab
// jetzt direkt hier hinein.
//
// Erzeugt und geprüft am 16.9.2026: 1190 Dosierungen beidseitig verglichen,
// 0 Abweichungen; 0 Produkte verloren; Hesi und Plagron Zahl für Zahl
// unverändert gegenüber dem bisherigen Dashboard.
//
// ⚠️ ABER: Diese Prüfung belegte KONSISTENZ, nicht RICHTIGKEIT. Beide alten
// Datensätze stammten aus derselben Quelle — sie stimmten überein UND waren
// an denselben Stellen falsch. Genau Plagron, das als "beide identisch"
// durchging, hatte Green Sensation mit 0,1 statt 1 ml/L (Faktor 10 zu wenig)
// und führte ein Produkt "Glucose", das Plagron gar nicht herstellt.
// Übereinstimmung zweier Kopien ist kein Wahrheitsbeweis.
//
// ── Herstellerabgleich vom 17.9.2026 ──────────────────────────────
// Alle 14 Marken und alle Produkte einmal gegen die Herstellerunterlagen
// gehalten. Jedes Produkt traegt ein Feld `quelle` mit einem `status`:
//   belegt      = gegen die Herstellerangabe geprueft, Beleg steht dabei
//   fraglich    = Herstellerangabe weicht ab, Wert NICHT geaendert (Grund dabei)
//   eingestellt = Produkt gibt es beim Hersteller nicht mehr
//   ungeeignet  = Produkt existiert, ist aber nicht fuer DWC freigegeben
//   ungeprueft  = keine belastbare Herstellerangabe gefunden
//
// Stand 17.9.: 76 belegt · 44 fraglich · 2 eingestellt ·
//              1 ungeeignet · 12 ungeprueft.
// Stand 24.9. mittags: 82 belegt · 39 fraglich · 2 eingestellt ·
//              11 ungeeignet · 0 ungeprueft (Nachrecherche, siehe unten).
// Stand 24.9. abends: 122 belegt · 0 fraglich · 2 eingestellt ·
//              12 ungeeignet · 0 ungeprueft (Angleichung, siehe unten).
//
// 🐞 DABEI GEFUNDEN: Aptus fuehrte All-In-One ZWEIMAL - als Schluessel
// "allInOne" und "allinone". Nur die Gross-/Kleinschreibung unterschied sie,
// deshalb fiel es bei der Zusammenfuehrung durch (ghe/gh und house/hg wurden
// damals erkannt, dieses Paar nicht). Das Dashboard zeigte beide Zeilen und
// dosierte den Basisduenger doppelt: 81,4 statt 40,7 ml auf 37 Liter. Das war
// die einzige UEBERdosierung im ganzen Datensatz - alle anderen Abweichungen
// gingen nach unten. Behoben.
//
// Vollstaendig gegen ein offizielles Schema geprueft: Hesi, Plagron,
// CANNA Aqua, Advanced Nutrients, Athena Blended, Aptus.
//
// ⚠️ Mit belegter Abweichung, aber ABSICHTLICH NICHT GEAENDERT:
//   GHE            Armor Si 0,05 statt 0,66 ml/L, CALiMAGic 0,375 statt 1,32.
//                  Liquid KoolBloom liegt als einziger Wert im Datensatz ueber
//                  der Herstellerangabe (0,5-0,75 statt 0,26-0,48).
//   House & Garden DWC-Chart hoeher, laeuft aber ueber 8 Bluetewochen statt 6.
//   Mills          zwei Linien (HC/Regular), die Flasche verraet nicht welche.
//   Remo           AstroFlower 0,2 statt 2,1 ml/L, VeloKelp 0,1 statt 1,32.
//                  Micro und Grow sind hier ungleich, laut Hersteller gleich.
//   Cyco           eigener DWC-Chart: Basis dreifach, B1 Boost zehnfach hoeher.
//   BioBizz        (17.9.) offizielles Schema gilt fuer ERDE bei pH 6,2-6,5.
//                  → am 24.9. geklaert: fuer DWC ungeeignet, siehe unten.
//
// Der Grund fuers Nichtaendern: Wo die Wochenstruktur des Herstellers nicht zu
// der hier passt, wuerde ein blosses Anheben der Zahl das Mittel in den falschen
// Wochen und in vielfacher Menge ausgeben. Eine Unterdosierung aergert, eine
// Ueberdosierung verbrennt. Die Herstellerzahl steht jeweils in `quelle`, damit
// die Umstellung spaeter nur noch Arbeit und keine Recherche mehr ist.
//
// ── Nachrecherche vom 24.9.2026 ───────────────────────────────────
// Die 12 Ungeprueften vom 17.9. und die offene BioBizz-Frage. Jede Quelle
// steht mit Abrufdatum im Feld `quelle` des Produkts. Ergebnis:
//
//   Belegt, ohne Aenderung: Aptus CaMg-Boost, House & Garden pH Stabiliser
//     (1 ml/L - die Angabe steht auf der australischen Herstellerseite).
//
//   Belegt, mit Korrektur:
//     Aptus Top Booster    Woche 6 stand auf 0,5 ml/L, Hersteller erlaubt
//                          hoechstens 0,4. UEBERdosierung, gesenkt.
//     Athena Fade (beide   Fade ERSETZT am Ende der Bluete etwas: bei Pro
//     Linien)              Core, bei Blended Bloom A/B. Beide liefen in
//                          Woche 7-8 zusaetzlich weiter - Doppeldosierung.
//                          Die Fade-Menge selbst stimmte.
//
//   Zwei Namen, die es beim Hersteller nicht gibt (wie Plagron "Glucose"):
//     Atami "Ataraxia" → Atazyme, "Boosting" → B'cuzz Bloom Stimulator.
//     Die alten Zahlen gehoerten zu keinem echten Produkt; die Werte kommen
//     jetzt aus Atamis Hydro Grow Guide. Die Schluessel (ataraxia, boosting)
//     bleiben, damit gespeicherte Zusaetze weiter passen.
//
//   Remo "Honey Chrome" ENTFERNT: das Produkt ist von Emerald Harvest, nicht
//     von Remo. Die Remo-Linie hat sieben Flaschen.
//
//   Cyco XL → ungeeignet: steht in Cycos DWC-Schema nicht, im Erd-Schema nur
//     in Wuchswoche 3 - hier lief es in der Bluete.
//
//   Fraglich, bewusst NICHT angehoben (Hausregel oben): Aptus P-Boost und
//     K-Boost, Remo Nature's Candy (dort nur die Wuchs-Gaben entfernt, weil
//     Remo es nur in der Bluete vorsieht).
//
//   BioBizz → alle Produkte ungeeignet. BioBizz selbst: Hydro nur, "as long
//     as you don't let the nutrient mix sit for more than one day", und nur
//     mit Root·Juice, Bio·Bloom, Bio·Heaven, Top·Max. Ein DWC-Reservoir steht
//     hier 7-10 Tage. Die Marke bleibt im Datensatz, ist aber in beiden
//     Rechnern nicht waehlbar (siehe markeWaehlbar() am Dateiende) - wer
//     BioBizz besitzt, sieht so, WARUM es fehlt.
//
// Ungeeignete Produkte haben keine Dosierung mehr; tests/brands-belege.js
// prueft das.
//
// ── EC-Warnbereich vom 24.9.2026 ─────────────────────────────────────
// ecRange ist die Grenze, ab der das Dashboard "EC zu hoch/zu niedrig"
// meldet. Bei 9 Marken lag sie UNTER den eigenen Wochenzielen (Hesi Wuchs
// Woche 5: Ziel 1,8, Warnung ab 1,4) - wer genau nach Plan mischte, bekam
// eine Fehlwarnung. Jetzt reicht der Bereich je Phase genau bis zum
// hoechsten Wochenziel, nicht darueber: mehr als der Plan warnt weiter.
// Nur Obergrenzen haben sich bewegt; der Test prueft das fuer alle Marken.
//
// ── Angleichung vom 24.9.2026 (auf Daniels Entscheidung) ─────────────
// Die Hausregel "nicht anheben" oben ist damit aufgehoben: alle 39
// fraglichen Werte folgen jetzt dem Hersteller. Vier Marken lagen nicht
// in einzelnen Zahlen daneben, sondern im ganzen Plan (ein Drittel bis
// ein Zehntel, anderes Wochenraster). Sie laufen jetzt 1:1 nach dem
// DWC-/Hydro-Schema des Herstellers, mit dessen Wochenzahl:
//   Cyco      6 Wuchs + 8 Bluete (+ Spuelen), EC aus dem Schema
//   H&G       4 Wuchs + 8 Bluete (+ 2-5 Tage Spuelen), kein EC vom Hersteller
//   Remo      4 Wuchs + 7 Bluete + 1 Woche Wasser, kein EC vom Hersteller
//   Mills     2 Wuchs + 9 Bluete, HC-Linie/Leitungswasser (Regular ~2,3x)
// Kuerzere Wuchsplaene: das Dashboard haelt die letzte Wuchswoche.
// Spuelwochen stehen in wochen.bluete und zaehlen fuer das Phasenende mit.
// Ohne Hersteller-EC ist ecRange null - das Dashboard sagt das beim Messen.
// GHE und Aptus: einzelne Zusaetze auf die Herstellerwerte in den
// bisherigen Wochen (Aptus an der Untergrenze), zwei Ueberdosierungen
// gesenkt (Liquid KoolBloom, Cyco Swell). CalMag bleibt wasserabhaengig.
// quelle.hoechstwert ist die Obergrenze, die der Test durchsetzt.
// Jede umgebaute Marke traegt einen datierten planHinweis: bei laufendem
// Grow EC nur in Schritten von hoechstens 0,2 anheben.
//
// Seit 24.9.2026 gibt es KEIN ungeprueftes Produkt mehr: tests/brands-belege.js
// nagelt die Zahl auf 0, damit kein neues Produkt unbelegt hereinrutscht.
const MARKEN = {
  "hesi": {
    "name": "Hesi",
    "emoji": "🌿",
    "color": "#3fb950",
    "ecRange": {
      "wuchs": [
        0.8,
        1.8
      ],
      "bluete": [
        1.2,
        2.2
      ]
    },
    "refillProduct": {
      "wuchs": "Hydro Wuchs",
      "bluete": "Hydro Blüte"
    },
    "produkte": {
      "hesilicio": {
        "name": "Hesilicio",
        "type": "silica",
        "note": "",
        "color": "#8b949e",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "0,5 ml/L, einmal pro Woche",
          "beleg": "hesi.nl/de/Hesilicio"
        }
      },
      "hydrowuchs": {
        "name": "Hydro Wuchs",
        "type": "base",
        "note": "",
        "color": "#00d4ff",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "50 ml/10 L = 5 ml/L",
          "beleg": "Hesi Hydro Zuchtschema (Hesi Plantenvoeding BV), DE_Hydro_Duengeschema.pdf"
        }
      },
      "wurzel": {
        "name": "Wurzel",
        "type": "root",
        "note": "",
        "color": "#00ff88",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "50 ml/10 L = 5 ml/L, Starter und bei Stress",
          "beleg": "Hesi Hydro Zuchtschema (Hesi Plantenvoeding BV), DE_Hydro_Duengeschema.pdf"
        }
      },
      "powerzyme": {
        "name": "PowerZyme",
        "type": "enzyme",
        "note": "",
        "color": "#a78bfa",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "20 ml/10 L = 2 ml/L, 1-2x pro Woche",
          "beleg": "Hesi Hydro Zuchtschema (Hesi Plantenvoeding BV), DE_Hydro_Duengeschema.pdf"
        }
      },
      "supervit": {
        "name": "SuperVit",
        "type": "vitamin",
        "note": "",
        "color": "#ef4444",
        "drops": true,
        "dropsPerL": 0.2222222222222222,
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "1 Tropfen auf 4,5 Liter",
          "beleg": "Hesi Hydro Zuchtschema (Hesi Plantenvoeding BV), DE_Hydro_Duengeschema.pdf"
        }
      },
      "hydroblte": {
        "name": "Hydro Blüte",
        "type": "base",
        "note": "",
        "color": "#00d4ff",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "50 ml/10 L = 5 ml/L",
          "beleg": "Hesi Hydro Zuchtschema (Hesi Plantenvoeding BV), DE_Hydro_Duengeschema.pdf"
        }
      },
      "boost": {
        "name": "Boost",
        "type": "bloom",
        "note": "",
        "color": "#f472b6",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "20 ml/10 L = 2 ml/L",
          "beleg": "Hesi Hydro Zuchtschema (Hesi Plantenvoeding BV), DE_Hydro_Duengeschema.pdf + hesi.nl/de/Boost",
          "vorher": 1
        }
      },
      "pk1314": {
        "name": "PK 13/14",
        "type": "pk",
        "note": "",
        "color": "#f97316",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "2,5 / 5,0 / 7,5 / 15 ml/10 L in Bluetewoche 4-7, danach spuelen",
          "beleg": "Hesi Hydro Zuchtschema (Hesi Plantenvoeding BV), DE_Hydro_Duengeschema.pdf (spaltengenau ausgelesen) + hesi.nl/de/PK-13-14 \"2,5-15 ml / 10 L\"",
          "vorher": "{\"5\":0.5,\"6\":0.5}"
        }
      },
      "calmag": {
        "name": "Hesi CalMag",
        "type": "calmag",
        "note": "Optional bei RO-/weichem Wasser — kein Fixwert, bis EC +0.4-0.5 mS/cm dosieren",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "Herstellerangabe: nach Wasserhaerte bzw. Mangelbild dosieren, kein fester Wochenwert",
          "beleg": "Produktangaben des jeweiligen Herstellers",
          "hinweis": "CalMag ist wasserabhaengig: bei Umkehrosmose- oder sehr weichem Wasser noetig, bei hartem Leitungswasser oft gar nicht. Ein Fixwert waere hier falsche Genauigkeit."
        }
      }
    },
    "dosis": {
      "wuchs": {
        "hesilicio": {
          "1": 0.5,
          "2": 0.5,
          "3": 0.5,
          "4": 0.5,
          "5": 0.5,
          "6": 0.5,
          "7": 0.5,
          "8": 0.5
        },
        "hydrowuchs": {
          "1": 5,
          "2": 5,
          "3": 5,
          "4": 5,
          "5": 5,
          "6": 5,
          "7": 5,
          "8": 5
        },
        "wurzel": {
          "1": 5,
          "2": 5,
          "3": 5
        },
        "powerzyme": {
          "1": 2,
          "2": 2,
          "3": 2,
          "4": 2,
          "5": 2,
          "6": 2,
          "7": 2,
          "8": 2
        }
      },
      "bluete": {
        "hesilicio": {
          "1": 0.5,
          "2": 0.5,
          "3": 0.5,
          "4": 0.5,
          "5": 0.5,
          "6": 0.5,
          "7": 0.5,
          "8": 0.5
        },
        "hydroblte": {
          "1": 5,
          "2": 5,
          "3": 5,
          "4": 5,
          "5": 5,
          "6": 5,
          "7": 5,
          "8": 5
        },
        "wurzel": {
          "1": 2.5,
          "2": 2.5
        },
        "powerzyme": {
          "1": 2,
          "2": 2,
          "3": 2,
          "4": 2,
          "5": 2,
          "6": 2,
          "7": 2,
          "8": 2
        },
        "boost": {
          "1": 2,
          "2": 2,
          "3": 2,
          "4": 2,
          "5": 2,
          "6": 2,
          "7": 2,
          "8": 2
        },
        "pk1314": {
          "4": 0.25,
          "5": 0.5,
          "6": 0.75,
          "7": 1.5
        }
      }
    },
    "ec": {
      "wuchs": {
        "1": 1,
        "2": 1.2,
        "3": 1.4,
        "4": 1.6,
        "5": 1.8,
        "6": 1.8,
        "7": 1.8,
        "8": 1.8
      },
      "bluete": {
        "1": 1.6,
        "2": 1.8,
        "3": 2,
        "4": 2,
        "5": 2.2,
        "6": 2.2
      }
    },
    "hinweis": {
      "wuchs": {},
      "bluete": {}
    },
    "addOrder": {
      "grow": [
        "hesilicio",
        "hydrowuchs",
        "wurzel",
        "powerzyme",
        "supervit"
      ],
      "bloom": [
        "hesilicio",
        "hydroblte",
        "wurzel",
        "powerzyme",
        "boost",
        "pk1314",
        "supervit"
      ]
    },
    "tips": [
      {
        "icon": "⚠️",
        "text": "Immer erst Wasser, dann Nährstoffe in Reihenfolge zugeben"
      },
      {
        "icon": "🌡️",
        "text": "Optimale Wassertemperatur: 18–22°C — wärmer = mehr Pythium-Risiko"
      },
      {
        "icon": "📏",
        "text": "pH Ziel DWC: 5.8–6.2 — erst Nährstoffe, dann pH einstellen"
      },
      {
        "icon": "💡",
        "text": "SuperVit: nur 1 ml/10L — nicht überdosieren"
      },
      {
        "icon": "🪨",
        "text": "Hesilicio (Silizium-Booster): 0.5 ml/L = 5 ml/10L, ganzer Run, immer als erstes Produkt zugeben"
      },
      {
        "icon": "💧",
        "text": "Hesi CalMag: nur bei RO-/Umkehrosmosewasser nötig — kein Fixwert, so viel zugeben bis EC um 0.4-0.5 mS/cm steigt (ca. 0.6-0.8 ml/L als Richtwert)"
      },
      {
        "icon": "🧪",
        "text": "PK 13/14 steigt laut Hesi-Schema an: 2,5 / 5,0 / 7,5 / 15 ml auf 10 L in Bluetewoche 4 bis 7. In Woche 8 nur noch mit Wasser spuelen."
      }
    ],
    "quelle": "dashboard (Hydro-Linie)"
  },
  "canna": {
    "name": "Canna Aqua",
    "emoji": "🔴",
    "color": "#f85149",
    "ecRange": {
      "wuchs": [
        1,
        1.6
      ],
      "bluete": [
        1,
        2
      ]
    },
    "refillProduct": {
      "wuchs": "Aqua Vega A+B",
      "bluete": "Aqua Flores A+B"
    },
    "produkte": {
      "vegaA": {
        "name": "Aqua Vega A",
        "type": "base",
        "note": "DWC/Recirculating Basis A",
        "color": "#00d4ff",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "15-35 ml/10 L je nach Phase = 1,5-3,5 ml/L",
          "beleg": "CANNA Aqua Zuchtschema (duengeschema-canna-aqua-de-en.pdf), Werte in ml/10 L"
        }
      },
      "vegaB": {
        "name": "Aqua Vega B",
        "type": "base",
        "note": "DWC/Recirculating Basis B",
        "color": "#38bdf8",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "gleiche Menge wie A",
          "beleg": "CANNA Aqua Zuchtschema (duengeschema-canna-aqua-de-en.pdf), Werte in ml/10 L"
        }
      },
      "floresA": {
        "name": "Aqua Flores A",
        "type": "base",
        "note": "DWC/Recirculating Bloom A",
        "color": "#00d4ff",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "20-40 ml/10 L = 2,0-4,0 ml/L",
          "beleg": "CANNA Aqua Zuchtschema (duengeschema-canna-aqua-de-en.pdf), Werte in ml/10 L"
        }
      },
      "floresB": {
        "name": "Aqua Flores B",
        "type": "base",
        "note": "DWC/Recirculating Bloom B",
        "color": "#38bdf8",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "gleiche Menge wie A",
          "beleg": "CANNA Aqua Zuchtschema (duengeschema-canna-aqua-de-en.pdf), Werte in ml/10 L"
        }
      },
      "rhizotonic": {
        "name": "Rhizotonic",
        "type": "root",
        "note": "Wurzel + Vitamine, Grow Wk 1–4",
        "color": "#00ff88",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "40 ml/10 L beim Start, dann 20 = 2,0 ml/L, in der Bluete 5 = 0,5 ml/L",
          "beleg": "CANNA Aqua Zuchtschema (duengeschema-canna-aqua-de-en.pdf), Werte in ml/10 L"
        }
      },
      "cannazym": {
        "name": "CannaZym",
        "type": "enzyme",
        "note": "Enzyme, ganzer Run",
        "color": "#a78bfa",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "25 ml/10 L = 2,5 ml/L, am Ende bis 50",
          "beleg": "CANNA Aqua Zuchtschema (duengeschema-canna-aqua-de-en.pdf), Werte in ml/10 L"
        }
      },
      "boost": {
        "name": "Cannaboost",
        "type": "carbs",
        "note": "Carbs + Bloom-Booster, Bloom Wk 1–6",
        "color": "#f472b6",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "20-40 ml/10 L = 2,0-4,0 ml/L",
          "beleg": "CANNA Aqua Zuchtschema (duengeschema-canna-aqua-de-en.pdf), Werte in ml/10 L"
        }
      },
      "pk1314": {
        "name": "PK 13/14",
        "type": "pk",
        "note": "Phosphor-Kalium, Bloom Wk 4–6",
        "color": "#f97316",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "15 ml/10 L = 1,5 ml/L, nur in EINER Woche (Generativ II)",
          "beleg": "CANNA Aqua Zuchtschema (duengeschema-canna-aqua-de-en.pdf), Werte in ml/10 L"
        }
      },
      "calmag": {
        "name": "CalMag Agent",
        "type": "calmag",
        "note": "Ca/Mg — bei Mangel oder weiches Wasser",
        "color": "#fbbf24",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "Herstellerangabe: nach Wasserhaerte bzw. Mangelbild dosieren, kein fester Wochenwert",
          "beleg": "Produktangaben des jeweiligen Herstellers",
          "hinweis": "CalMag ist wasserabhaengig: bei Umkehrosmose- oder sehr weichem Wasser noetig, bei hartem Leitungswasser oft gar nicht. Ein Fixwert waere hier falsche Genauigkeit."
        }
      },
      "flush": {
        "name": "CANNA Flush",
        "type": "flush",
        "note": "Reservoir komplett ersetzen, 24-48h vor Ernte",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "1:250 = 40 ml/10 L, Reservoir 24-48 h vor der Ernte ersetzen",
          "beleg": "CANNA Aqua Zuchtschema (duengeschema-canna-aqua-de-en.pdf), Werte in ml/10 L"
        }
      }
    },
    "dosis": {
      "wuchs": {
        "vegaA": {
          "1": 2,
          "2": 2.5,
          "3": 3,
          "4": 3,
          "5": 3.5,
          "6": 3.5,
          "7": 3.5,
          "8": 3.5
        },
        "vegaB": {
          "1": 2,
          "2": 2.5,
          "3": 3,
          "4": 3,
          "5": 3.5,
          "6": 3.5,
          "7": 3.5,
          "8": 3.5
        },
        "rhizotonic": {
          "1": 3,
          "2": 2,
          "3": 2
        },
        "cannazym": {
          "1": 2.5,
          "2": 2.5,
          "3": 2.5,
          "4": 2.5,
          "5": 2.5,
          "6": 2.5,
          "7": 2.5,
          "8": 2.5
        },
        "calmag": {
          "1": 0.4,
          "2": 0.4,
          "3": 0.4,
          "4": 0.4,
          "5": 0.4,
          "6": 0.4,
          "7": 0.4,
          "8": 0.4
        }
      },
      "bluete": {
        "floresA": {
          "1": 3,
          "2": 3.5,
          "3": 3.5,
          "4": 3,
          "5": 2.5,
          "6": 2
        },
        "floresB": {
          "1": 3,
          "2": 3.5,
          "3": 3.5,
          "4": 3,
          "5": 2.5,
          "6": 2
        },
        "rhizotonic": {
          "1": 0.5,
          "2": 0.5
        },
        "boost": {
          "1": 2,
          "2": 2.5,
          "3": 3,
          "4": 3,
          "5": 2.5
        },
        "cannazym": {
          "1": 2.5,
          "2": 2.5,
          "3": 2.5,
          "4": 2.5,
          "5": 2.5,
          "6": 2.5
        },
        "pk1314": {
          "3": 1.5
        }
      }
    },
    "ec": {
      "wuchs": {
        "1": 1,
        "2": 1.2,
        "3": 1.4,
        "4": 1.5,
        "5": 1.6,
        "6": 1.6,
        "7": 1.6,
        "8": 1.6
      },
      "bluete": {
        "1": 1.6,
        "2": 1.8,
        "3": 2,
        "4": 1.8,
        "5": 1.4,
        "6": 1
      }
    },
    "hinweis": {
      "wuchs": {},
      "bluete": {}
    },
    "addOrder": {
      "grow": [
        "cannazym",
        "vegaA",
        "vegaB",
        "rhizotonic",
        "calmag"
      ],
      "bloom": [
        "cannazym",
        "floresA",
        "floresB",
        "boost",
        "pk1314",
        "calmag"
      ]
    },
    "tips": [
      {
        "icon": "🔴",
        "text": "Aqua-Linie ist speziell für DWC/NFT/Recirculating — nicht für Coco oder Soil"
      },
      {
        "icon": "⚖️",
        "text": "Vega/Flores A und B immer im Verhältnis 1:1 — niemals einzeln"
      },
      {
        "icon": "🚿",
        "text": "CANNA Flush: korrigiert — offiziell 1:250 (40 ml/10L), Reservoir 24-48h vor Ernte damit komplett ersetzen, kein normaler Wochen-Zusatz"
      },
      {
        "icon": "📋",
        "text": "Werte korrigiert nach offiziellem CANNA Aqua Grow Schedule (canna.ca): CannaZym, Cannaboost und Rhizotonic waren zuvor ca. 5-10x unterdosiert."
      },
      {
        "icon": "✅",
        "text": "Gegen das offizielle CANNA-Aqua-Zuchtschema geprueft (17.9.2026) - Basis, Rhizotonic, CannaZym, Boost und PK stimmen."
      }
    ],
    "quelle": "library"
  },
  "plagron": {
    "name": "Plagron",
    "emoji": "🟡",
    "color": "#d29922",
    "ecRange": {
      "wuchs": [
        0.8,
        1.6
      ],
      "bluete": [
        1.4,
        2.3
      ]
    },
    "refillProduct": {
      "wuchs": "Hydro A+B",
      "bluete": "Hydro A+B"
    },
    "produkte": {
      "hydroA": {
        "name": "Hydro A",
        "type": "base",
        "note": "Basis A — immer 1:1 mit B",
        "color": "#00d4ff",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "max 2,5 ml/L (1:400), gleiche Menge A und B",
          "beleg": "plagron.com/de/hobby/produkte/hydro-a"
        }
      },
      "hydroB": {
        "name": "Hydro B",
        "type": "base",
        "note": "Basis B — immer 1:1 mit A",
        "color": "#38bdf8",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "max 2,5 ml/L (1:400), gleiche Menge A und B",
          "beleg": "plagron.com/de/hobby/produkte/hydro-b"
        }
      },
      "hydroRoots": {
        "name": "Hydro Roots",
        "type": "root",
        "note": "Hydro-Wurzelbooster, Grow + Blüte Wk 1–3",
        "color": "#00ff88",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "1 ml/L (1:1.000), bis zur dritten/vierten Bluetewoche",
          "beleg": "plagron.com/de/hobby/produkte/hydro-roots"
        }
      },
      "powerBuds": {
        "name": "Power Buds",
        "type": "bloom",
        "note": "Hydro-Blühstimulator, ganze Blüte",
        "color": "#a78bfa",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "1 ml/L (1:1.000), ab Bluetebeginn bis zwei Wochen vor der Ernte",
          "beleg": "plagron.com/de/hobby/produkte/power-buds"
        }
      },
      "green": {
        "name": "Green Sensation",
        "type": "bloom",
        "note": "4-in-1 Bloom-Booster, Bloom Wk 4–6",
        "color": "#f472b6",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "1 ml/L (1:1.000), ab der vierten Bluetewoche bei jedem Giessen",
          "beleg": "plagron.com/de/hobby/produkte/green-sensation",
          "vorher": 0.1
        }
      },
      "pk": {
        "name": "PK 13/14",
        "type": "pk",
        "note": "ALTERNATIVE zu Green Sensation - nicht zusammen geben, beide liefern PK. Max 2 ml/L ab Bluetewoche 4.",
        "color": "#ef4444",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "max 2 ml/L (1:550), ab der vierten Bluetewoche",
          "beleg": "plagron.com/de/hobby/produkte/pk-13-14",
          "vorher": "{\"5\":0.1,\"6\":0.1}",
          "hinweis": "Aus dem Schema genommen: Green Sensation deckt den PK-Bedarf bereits ab. Ueber Eigene Zusaetze weiter waehlbar."
        }
      },
      "leafGreen": {
        "name": "Leaf Green",
        "type": "vitamin",
        "note": "Mg + Fe — bei Mangelerscheinungen",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "eingestellt",
          "beleg": "plagron.com Produktuebersicht, abgerufen 2026-09-17",
          "hinweis": "Steht nicht mehr im Plagron-Sortiment. Naechstliegend: CalMag Pro (Mg) bzw. Vita Race. Wert bleibt fuer alte Flaschen erhalten."
        }
      },
      "bacto": {
        "name": "Bacto",
        "type": "bacteria",
        "note": "Beneficial Bacteria, Wk 1–4",
        "color": "#fbbf24",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "eingestellt",
          "beleg": "plagron.com Produktuebersicht, abgerufen 2026-09-17",
          "hinweis": "Steht nicht mehr im Plagron-Sortiment. Naechstliegend: Pure Zym oder Power Roots. Wert bleibt fuer alte Flaschen erhalten."
        }
      },
      "glucose": {
        "name": "Sugar Royal",
        "type": "carbs",
        "note": "NICHT fuer DWC/NFT/Aeroponik - Plagron schliesst hydroponische Verfahren ausdruecklich aus (biologischen Ursprungs). Nur Erde und Coco.",
        "color": "#fbbf24",
        "quelle": {
          "status": "ungeeignet",
          "herstellerAngabe": "max 1 ml/L, aber nur Torf- und Kokossubstrate",
          "beleg": "plagron.com/de/hobby/produkte/sugar-royal: \"nicht geeignet fuer hydroponische Anbaumethoden wie NFT, DWC und Aeroponik\"",
          "geprueft": "2026-09-17",
          "umbenanntVon": "Glucose",
          "hinweis": "Stand als \"Glucose\" im Schema - ein Produkt dieses Namens fuehrt Plagron nicht. Richtig heisst es Sugar Royal, und es gehoert nicht in ein DWC-Schema."
        }
      },
      "calmagPro": {
        "name": "CalMag Pro",
        "type": "calmag",
        "note": "Optional bei RO-/weichem Wasser",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "Herstellerangabe: nach Wasserhaerte bzw. Mangelbild dosieren, kein fester Wochenwert",
          "beleg": "Produktangaben des jeweiligen Herstellers",
          "hinweis": "CalMag ist wasserabhaengig: bei Umkehrosmose- oder sehr weichem Wasser noetig, bei hartem Leitungswasser oft gar nicht. Ein Fixwert waere hier falsche Genauigkeit."
        }
      }
    },
    "dosis": {
      "wuchs": {
        "hydroA": {
          "1": 1.4,
          "2": 1.4,
          "3": 1.6,
          "4": 1.6,
          "5": 1.6,
          "6": 1.6,
          "7": 1.6,
          "8": 1.6
        },
        "hydroB": {
          "1": 1.4,
          "2": 1.4,
          "3": 1.6,
          "4": 1.6,
          "5": 1.6,
          "6": 1.6,
          "7": 1.6,
          "8": 1.6
        },
        "hydroRoots": {
          "1": 1,
          "2": 1,
          "3": 1,
          "4": 1
        },
        "bacto": {
          "1": 0.05
        }
      },
      "bluete": {
        "hydroA": {
          "1": 1.8,
          "2": 2,
          "3": 2.2,
          "4": 2.5,
          "5": 2.5,
          "6": 2.5
        },
        "hydroB": {
          "1": 1.8,
          "2": 2,
          "3": 2.2,
          "4": 2.5,
          "5": 2.5,
          "6": 2.5
        },
        "hydroRoots": {
          "1": 1,
          "2": 1,
          "3": 1
        },
        "powerBuds": {
          "1": 1,
          "2": 1,
          "3": 1,
          "4": 1,
          "5": 1,
          "6": 1
        },
        "green": {
          "4": 1,
          "5": 1,
          "6": 1
        }
      }
    },
    "ec": {
      "wuchs": {
        "1": 1.4,
        "2": 1.4,
        "3": 1.6,
        "4": 1.6,
        "5": 1.6,
        "6": 1.6,
        "7": 1.6,
        "8": 1.6
      },
      "bluete": {
        "1": 1.8,
        "2": 1.9,
        "3": 2,
        "4": 2.3,
        "5": 2.3,
        "6": 2.3
      }
    },
    "hinweis": {
      "wuchs": {},
      "bluete": {}
    },
    "addOrder": {
      "grow": [
        "bacto",
        "hydroA",
        "hydroB",
        "hydroRoots",
        "leafGreen"
      ],
      "bloom": [
        "hydroA",
        "hydroB",
        "hydroRoots",
        "powerBuds",
        "green",
        "pk"
      ]
    },
    "tips": [
      {
        "icon": "📋",
        "text": "Basis-Werte und Hydro Roots/Power Buds korrigiert nach offiziellem Plagron Hydro-Feedchart — Basis war zuvor deutlich unterdosiert."
      },
      {
        "icon": "⚖️",
        "text": "Hydro A und B immer in gleicher Menge — niemals separat überdosieren"
      },
      {
        "icon": "🧪",
        "text": "Bacto: Lebendkultur — nie mit heißem Wasser mischen, max 25°C"
      },
      {
        "icon": "🌱",
        "text": "Hydro Roots: läuft bis Blüte Wk 3, danach übernimmt Green Sensation. Power Buds: die ganze Blütephase durchgehend."
      },
      {
        "icon": "⚠️",
        "text": "Green Sensation ODER PK 13-14 - nicht beide. Green Sensation bringt das PK schon mit."
      },
      {
        "icon": "🟡",
        "text": "Green Sensation: 1 ml pro LITER (10 ml/10 L) laut Plagron - hier stand lange 1 ml/10 L, ein Zehntel davon."
      },
      {
        "icon": "🚫",
        "text": "Sugar Royal und Pure Zym sind Erde-/Coco-Produkte. Plagron schliesst DWC ausdruecklich aus - sie stehen deshalb nicht im Schema."
      }
    ],
    "quelle": "library"
  },
  "ghe": {
    "name": "GHE Flora Series",
    "emoji": "🟢",
    "color": "#39d353",
    "ecRange": {
      "wuchs": [
        0.8,
        1.8
      ],
      "bluete": [
        1.2,
        2.2
      ]
    },
    "refillProduct": {
      "wuchs": "FloraGro",
      "bluete": "FloraBloom"
    },
    "produkte": {
      "floraMicro": {
        "name": "FloraMicro",
        "type": "base",
        "note": "Basis — immer ZUERST ins Wasser!",
        "color": "#00d4ff",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "0,5-2,0 ml/L je nach Phase (Terra Aquatica TriPart)",
          "beleg": "Terra Aquatica / GHE TriPart Dosierangaben"
        }
      },
      "floraGro": {
        "name": "FloraGro",
        "type": "base",
        "note": "Stickstoff-Schwerpunkt, Grow",
        "color": "#00ff88",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "0,5-2,0 ml/L je nach Phase",
          "beleg": "Terra Aquatica / GHE TriPart Dosierangaben"
        }
      },
      "floraBloom": {
        "name": "FloraBloom",
        "type": "base",
        "note": "PK-Schwerpunkt, Bloom",
        "color": "#f472b6",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "0,5-2,4 ml/L je nach Phase",
          "beleg": "Terra Aquatica / GHE TriPart Dosierangaben"
        }
      },
      "rapidStart": {
        "name": "Rapid Start",
        "type": "root",
        "note": "Wurzelstimulator, Wk 1–3",
        "color": "#00ff88",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "1 ml pro Gallone = 0,26 ml/L, von der Anzucht bis in den fruehen Wuchs",
          "beleg": "General Hydroponics FloraSeries Feed Chart (ml pro Gallone); generalhydroponics.com/products/rapidstart (abgerufen 24.9.2026)",
          "hinweis": "Angeglichen am 24.9.2026, vorher: wuchs {\"1\":0.15,\"2\":0.15}.",
          "hoechstwert": 0.26
        }
      },
      "armorSi": {
        "name": "Armor Si",
        "type": "silica",
        "note": "Silikat – IMMER ZUERST ins Wasser, pH danach",
        "color": "#8b949e",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "2,5 ml pro Gallone = 0,66 ml/L; als Erstes ins Wasser, pH erst danach einstellen",
          "beleg": "General Hydroponics FloraSeries Feed Chart (ml pro Gallone), Stand 17.9.2026 - die Produktseite ist inzwischen offline",
          "hinweis": "Silikat hebt den pH deutlich: zuerst Armor Si, dann die Basis, pH am Schluss. Angeglichen am 24.9.2026, vorher: wuchs {\"1\":0.05,\"2\":0.05,\"3\":0.05,\"4\":0.05,\"5\":0.05}, bluete {\"1\":0.05,\"2\":0.05,\"3\":0.05,\"4\":0.05}.",
          "hoechstwert": 0.66
        }
      },
      "calimagic": {
        "name": "CALiMAGic",
        "type": "calmag",
        "note": "Ca/Mg — bei weichem Wasser",
        "color": "#fbbf24",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "Herstellerangabe: nach Wasserhaerte bzw. Mangelbild dosieren. GH nennt 5 ml pro Gallone (1,32 ml/L), bei starkem Bedarf bis 10 (2,64 ml/L)",
          "beleg": "generalhydroponics.com/products/gh-calimagic",
          "hoechstwert": 2.64,
          "hinweis": "Wie die CalMag-Produkte der anderen Marken: bei Osmose- oder sehr weichem Wasser noetig, bei hartem Leitungswasser oft gar nicht. Der Plan setzt einen niedrigen Startwert; ein Fixwert von 1,32 ml/L auf hartes Wasser braechte viel Calcium und EC."
        }
      },
      "koolbloom": {
        "name": "Liquid KoolBloom",
        "type": "pk",
        "note": "PK-Booster, Bloom Wk 3–6",
        "color": "#f97316",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "Feed Chart: 1,0-1,8 ml pro Gallone = 0,26-0,48 ml/L",
          "beleg": "generalhydroponics.com/products/liquid-koolbloom/",
          "hinweis": "Stand vorher mit 0,5-0,75 ml/L UEBER der Herstellerangabe - auf den Hoechstwert gesenkt. Angeglichen am 24.9.2026, vorher: bluete {\"3\":0.5,\"4\":0.5,\"5\":0.75,\"6\":0.5}.",
          "hoechstwert": 0.48
        }
      },
      "koolbloomD": {
        "name": "Dry KoolBloom",
        "type": "pk",
        "note": "Finisher g/10L, Bloom Wk 5–6",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "1,5 g pro Gallone = 0,40 g/L (Pulver, in den letzten Bluetewochen)",
          "beleg": "generalhydroponics.com/products/koolbloom-dry",
          "hinweis": "Angeglichen am 24.9.2026, vorher: bluete {\"5\":0.14,\"6\":0.14}.",
          "hoechstwert": 0.4
        },
        "einheit": "g"
      },
      "floralicious": {
        "name": "Floralicious+",
        "type": "vitamin",
        "note": "Enzyme + Vitamine + Amino",
        "color": "#a78bfa",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "1 ml pro Gallone = 0,26 ml/L, aggressiv bis 2 ml = 0,53 ml/L",
          "beleg": "generalhydroponics.com/products/floralicious-plus",
          "hinweis": "Angeglichen am 24.9.2026, vorher: wuchs {\"5\":0.125}, bluete {\"1\":0.125,\"2\":0.125}.",
          "hoechstwert": 0.53
        }
      },
      "floraBlend": {
        "name": "FloraBlend",
        "type": "vitamin",
        "note": "Kelp/Amino/Vitamin-Blend, ganzer Run",
        "color": "#ef4444",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "5 ml/Gallone = 1,32 ml/L, aggressiv bis 10 = 2,64 ml/L - die 1,5 hier liegen im Bereich",
          "beleg": "generalhydroponics.com/products/gh-florablend"
        }
      },
      "floraKleen": {
        "name": "FloraKleen",
        "type": "flush",
        "note": "Flush – 5 ml pro LITER (nicht pro 10 L), bei starker Salzlast bis 10 ml/L",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "5 ml/L, bei starker Salzlast bis 10 ml/L",
          "beleg": "generalhydroponics.com/products/gh-florakleen",
          "hinweis": "Der Hinweistext nannte 5 ml/10 L - ein Zehntel der Herstellerangabe. Korrigiert."
        }
      }
    },
    "dosis": {
      "wuchs": {
        "armorSi": {
          "1": 0.66,
          "2": 0.66,
          "3": 0.66,
          "4": 0.66,
          "5": 0.66
        },
        "floraMicro": {
          "1": 0.5,
          "2": 0.75,
          "3": 1,
          "4": 1,
          "5": 1,
          "6": 1,
          "7": 1,
          "8": 1
        },
        "floraGro": {
          "1": 1.25,
          "2": 1.5,
          "3": 1.25,
          "4": 1.25,
          "5": 1.25,
          "6": 1.25,
          "7": 1.25,
          "8": 1.25
        },
        "floraBloom": {
          "1": 0.5,
          "2": 0.5,
          "3": 1,
          "4": 1,
          "5": 1.25,
          "6": 1.25,
          "7": 1.25,
          "8": 1.25
        },
        "rapidStart": {
          "1": 0.26,
          "2": 0.26
        },
        "calimagic": {
          "1": 0.375,
          "2": 0.375,
          "3": 0.375
        },
        "floraBlend": {
          "1": 1.5,
          "2": 1.5,
          "3": 1.5,
          "4": 1.5,
          "5": 1.5,
          "6": 1.5,
          "7": 1.5,
          "8": 1.5
        },
        "floralicious": {
          "5": 0.26
        }
      },
      "bluete": {
        "armorSi": {
          "1": 0.66,
          "2": 0.66,
          "3": 0.66,
          "4": 0.66
        },
        "floraMicro": {
          "1": 1,
          "2": 1,
          "3": 1,
          "4": 1,
          "5": 0.75,
          "6": 0.75
        },
        "floraGro": {
          "1": 0.5,
          "2": 0.5
        },
        "floraBloom": {
          "1": 1.5,
          "2": 1.5,
          "3": 1.5,
          "4": 1.5,
          "5": 1.5,
          "6": 1.25
        },
        "floralicious": {
          "1": 0.26,
          "2": 0.26
        },
        "floraBlend": {
          "1": 1.5,
          "2": 1.5,
          "3": 1.5,
          "4": 1.5,
          "5": 1.5,
          "6": 1.5
        },
        "koolbloom": {
          "3": 0.48,
          "4": 0.48,
          "5": 0.48,
          "6": 0.48
        },
        "koolbloomD": {
          "5": 0.4,
          "6": 0.4
        }
      }
    },
    "ec": {
      "wuchs": {
        "1": 1,
        "2": 1.3,
        "3": 1.6,
        "4": 1.6,
        "5": 1.8,
        "6": 1.8,
        "7": 1.8,
        "8": 1.8
      },
      "bluete": {
        "1": 1.8,
        "2": 1.8,
        "3": 2,
        "4": 2,
        "5": 2.2,
        "6": 2.2
      }
    },
    "hinweis": {
      "wuchs": {},
      "bluete": {}
    },
    "addOrder": {
      "grow": [
        "armorSi",
        "floraMicro",
        "floraGro",
        "floraBloom",
        "rapidStart",
        "calimagic",
        "floraBlend",
        "floralicious"
      ],
      "bloom": [
        "armorSi",
        "floraMicro",
        "floraGro",
        "floraBloom",
        "koolbloom",
        "koolbloomD",
        "floraBlend",
        "floralicious"
      ]
    },
    "tips": [
      {
        "icon": "⚠️",
        "text": "FloraMicro IMMER als erstes Nährstoff ins Wasser — nie direkt mit Bloom mischen!"
      },
      {
        "icon": "🪨",
        "text": "Armor Si (Silica): vor allen anderen zugeben, pH steigt stark danach"
      },
      {
        "icon": "📐",
        "text": "GH 3-Part Prinzip: FloraGro dominiert in Veg, FloraBloom dominiert in Blüte, FloraMicro bleibt relativ konstant — die genauen ml-Verhältnisse variieren je nach Wachstumsstufe, siehe Wochentabelle."
      },
      {
        "icon": "🌿",
        "text": "FloraBlend neu ergänzt — Kelp/Amino/Vitamin-Ergänzung, Teil von GHEs offiziellem 'Performance Pack', ganzer Run 12.5-25 ml/10L."
      },
      {
        "icon": "🔍",
        "text": "Die Basis (FloraMicro/Gro/Bloom) liegt im Herstellerbereich. Die Zusaetze Armor Si, Rapid Start, Floralicious+ und Dry KoolBloom stehen deutlich unter der Herstellerangabe - vor Nutzung nachschlagen."
      }
    ],
    "quelle": "library"
  },
  "advanced": {
    "name": "Advanced Nutrients",
    "emoji": "🔵",
    "color": "#58a6ff",
    "ecRange": {
      "wuchs": [
        1,
        1.8
      ],
      "bluete": [
        1.4,
        2.4
      ]
    },
    "refillProduct": {
      "wuchs": "Sensi Grow A+B",
      "bluete": "Sensi Bloom A+B"
    },
    "produkte": {
      "sensiGrowA": {
        "name": "Sensi Grow A",
        "type": "base",
        "note": "Basis Grow A — pH Perfect",
        "color": "#00d4ff",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "1 ml/L in Woche 1 steigend auf max 4 ml/L",
          "beleg": "advancednutrients.com pH Perfect Sensi Grow/Bloom Produktseite"
        }
      },
      "sensiGrowB": {
        "name": "Sensi Grow B",
        "type": "base",
        "note": "Basis Grow B — pH Perfect",
        "color": "#38bdf8",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "gleiche Menge wie A",
          "beleg": "advancednutrients.com pH Perfect Sensi Grow/Bloom Produktseite"
        }
      },
      "sensiBloomA": {
        "name": "Sensi Bloom A",
        "type": "base",
        "note": "Basis Bloom A — pH Perfect",
        "color": "#00d4ff",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "max 4 ml/L",
          "beleg": "advancednutrients.com pH Perfect Sensi Grow/Bloom Produktseite"
        }
      },
      "sensiBloomB": {
        "name": "Sensi Bloom B",
        "type": "base",
        "note": "Basis Bloom B — pH Perfect",
        "color": "#38bdf8",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "gleiche Menge wie A",
          "beleg": "advancednutrients.com pH Perfect Sensi Grow/Bloom Produktseite"
        }
      },
      "b52": {
        "name": "B-52",
        "type": "vitamin",
        "note": "Vitamin B1+B2 — Stress-Resistenz",
        "color": "#fbbf24",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "max 2 ml/L",
          "beleg": "advancednutrients.com Produktseite, Feeding Chart"
        }
      },
      "voodoo": {
        "name": "Voodoo Juice",
        "type": "bacteria",
        "note": "Root-Tribe: Bakterien, Wk 1–2",
        "color": "#00ff88",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "2 ml/L in Woche 1-2 von Wuchs UND Bluete",
          "beleg": "advancednutrients.com Produktseite, Feeding Chart"
        }
      },
      "piranha": {
        "name": "Piranha",
        "type": "bacteria",
        "note": "Root-Tribe: Pilzkultur, Wk 1–2",
        "color": "#00ff88",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "2 ml/L in Woche 1-2 von Wuchs UND Bluete",
          "beleg": "advancednutrients.com Produktseite, Feeding Chart",
          "hinweis": "Bluetewoche 1-2 ergaenzt: der Hersteller gibt das Root-Tribe in BEIDEN Phasen, Voodoo Juice stand dort bereits."
        }
      },
      "tarantula": {
        "name": "Tarantula",
        "type": "bacteria",
        "note": "Root-Tribe: Bakterien, Wk 1–2",
        "color": "#00ff88",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "2 ml/L in Woche 1-2 von Wuchs UND Bluete, ausdruecklich fuer DWC",
          "beleg": "advancednutrients.com Produktseite, Feeding Chart",
          "hinweis": "Bluetewoche 1-2 ergaenzt: der Hersteller gibt das Root-Tribe in BEIDEN Phasen, Voodoo Juice stand dort bereits."
        }
      },
      "budIgnitor": {
        "name": "Bud Ignitor",
        "type": "bloom",
        "note": "Bloom-Einleitung, Bloom Wk 1–2",
        "color": "#00ff88",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "2 ml/L in Bluetewoche 1-2",
          "beleg": "advancednutrients.com Produktseite, Feeding Chart"
        }
      },
      "bigBud": {
        "name": "Big Bud",
        "type": "bloom",
        "note": "PK + Amino Bloom-Booster, Wk 2–4",
        "color": "#f97316",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "2 ml/L in Bluetewoche 2 bis 5, danach auf Overdrive wechseln",
          "beleg": "advancednutrients.com Produktseite, Feeding Chart",
          "vorher": "{\"2\":2,\"3\":2,\"4\":2}",
          "hinweis": "Woche 5 ergaenzt - der Wert 2 ml/L war schon richtig, nur die letzte Woche fehlte."
        }
      },
      "overdrive": {
        "name": "Overdrive",
        "type": "bloom",
        "note": "Late-Bloom Finisher, letzte Wochen",
        "color": "#bc8cff",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "2 ml/L in Bluetewoche 6-7",
          "beleg": "advancednutrients.com Produktseite, Feeding Chart"
        }
      },
      "budCandy": {
        "name": "Bud Candy",
        "type": "carbs",
        "note": "Carbs + Amino, ganzer Run",
        "color": "#f472b6",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "2 ml/L, Wuchs Woche 1-4 und Bluete Woche 1-7",
          "beleg": "advancednutrients.com Produktseite, Feeding Chart"
        }
      },
      "rhinoSkin": {
        "name": "Rhino Skin",
        "type": "silica",
        "note": "Silica — Zellwand-Festigkeit, ganzer Run",
        "color": "#8b949e",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "2 ml/L in beiden Phasen, nicht in der Spuelwoche",
          "beleg": "advancednutrients.com Produktseite, Feeding Chart"
        }
      },
      "sensizym": {
        "name": "Sensizym",
        "type": "enzyme",
        "note": "Enzyme, ganzer Run",
        "color": "#a78bfa",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "2 ml/L, Wuchs 1-4 und Bluete 1-7, ausdruecklich fuer DWC",
          "beleg": "advancednutrients.com Produktseite, Feeding Chart"
        }
      },
      "calmagXtra": {
        "name": "Sensi Cal-Mag Xtra",
        "type": "calmag",
        "note": "Optional bei RO-/weichem Wasser",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "2 ml/L - fester Wert, auch als Mangelkorrektur",
          "beleg": "advancednutrients.com Produktseite, Feeding Chart"
        }
      },
      "flawless": {
        "name": "Flawless Finish",
        "type": "flush",
        "note": "Flush — letzte 1–2 Wochen",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "2 ml/L waehrend der gesamten Spuelphase",
          "beleg": "advancednutrients.com Produktseite, Feeding Chart"
        }
      }
    },
    "dosis": {
      "wuchs": {
        "sensiGrowA": {
          "1": 1,
          "2": 2,
          "3": 3,
          "4": 4,
          "5": 4,
          "6": 4,
          "7": 4,
          "8": 4
        },
        "sensiGrowB": {
          "1": 1,
          "2": 2,
          "3": 3,
          "4": 4,
          "5": 4,
          "6": 4,
          "7": 4,
          "8": 4
        },
        "voodoo": {
          "1": 2,
          "2": 2
        },
        "piranha": {
          "1": 2,
          "2": 2
        },
        "tarantula": {
          "1": 2,
          "2": 2
        },
        "b52": {
          "1": 2,
          "2": 2,
          "3": 2,
          "4": 2,
          "5": 2,
          "6": 2,
          "7": 2,
          "8": 2
        },
        "rhinoSkin": {
          "1": 2,
          "2": 2,
          "3": 2,
          "4": 2,
          "5": 2,
          "6": 2,
          "7": 2,
          "8": 2
        },
        "sensizym": {
          "1": 2,
          "2": 2,
          "3": 2,
          "4": 2,
          "5": 2,
          "6": 2,
          "7": 2,
          "8": 2
        },
        "budCandy": {
          "1": 2,
          "2": 2,
          "3": 2,
          "4": 2,
          "5": 2,
          "6": 2,
          "7": 2,
          "8": 2
        }
      },
      "bluete": {
        "sensiBloomA": {
          "1": 4,
          "2": 4,
          "3": 4,
          "4": 4,
          "5": 4,
          "6": 4
        },
        "sensiBloomB": {
          "1": 4,
          "2": 4,
          "3": 4,
          "4": 4,
          "5": 4,
          "6": 4
        },
        "voodoo": {
          "1": 2,
          "2": 2
        },
        "budIgnitor": {
          "1": 2,
          "2": 2
        },
        "rhinoSkin": {
          "1": 2,
          "2": 2,
          "3": 2,
          "4": 2,
          "5": 2,
          "6": 2
        },
        "sensizym": {
          "1": 2,
          "2": 2,
          "3": 2,
          "4": 2,
          "5": 2,
          "6": 2
        },
        "budCandy": {
          "1": 2,
          "2": 2,
          "3": 2,
          "4": 2,
          "5": 2,
          "6": 2
        },
        "bigBud": {
          "2": 2,
          "3": 2,
          "4": 2,
          "5": 2
        },
        "b52": {
          "3": 2,
          "4": 2,
          "5": 2,
          "6": 2
        },
        "overdrive": {
          "6": 2
        },
        "piranha": {
          "1": 2,
          "2": 2
        },
        "tarantula": {
          "1": 2,
          "2": 2
        }
      }
    },
    "ec": {
      "wuchs": {
        "1": 1,
        "2": 1.3,
        "3": 1.6,
        "4": 1.8,
        "5": 1.8,
        "6": 1.8,
        "7": 1.8,
        "8": 1.8
      },
      "bluete": {
        "1": 1.8,
        "2": 1.9,
        "3": 2,
        "4": 2,
        "5": 2,
        "6": 2
      }
    },
    "hinweis": {
      "wuchs": {},
      "bluete": {}
    },
    "addOrder": {
      "grow": [
        "rhinoSkin",
        "sensiGrowA",
        "sensiGrowB",
        "voodoo",
        "piranha",
        "tarantula",
        "sensizym",
        "b52",
        "budCandy"
      ],
      "bloom": [
        "tarantula",
        "piranha",
        "rhinoSkin",
        "sensiBloomA",
        "sensiBloomB",
        "budIgnitor",
        "bigBud",
        "overdrive",
        "budCandy",
        "b52",
        "sensizym"
      ]
    },
    "tips": [
      {
        "icon": "📋",
        "text": "Werte korrigiert nach offiziellem AN pH Perfect Feedchart (advancednutrients.com) — Basis war bis zu 4x, alle Additive ca. 10x unterdosiert (mL/L wurde als mL/10L eingetragen)."
      },
      {
        "icon": "🔵",
        "text": "Sensi-Linie: pH Perfect Technologie — weniger pH-Korrekturen nötig, trotzdem messen!"
      },
      {
        "icon": "⚠️",
        "text": "Bud Ignitor + Big Bud + Overdrive nie gleichzeitig — sequentiell einsetzen!"
      },
      {
        "icon": "💊",
        "text": "B-52, Rhino Skin, Sensizym, Bud Candy laufen laut offiziellem Chart durchgehend — nicht nur in Einzelwochen"
      },
      {
        "icon": "🦠",
        "text": "Voodoo Juice, Piranha, Tarantula: das 'Root Tribe' Trio — nur Wk 1-2, dann absetzen"
      },
      {
        "icon": "💧",
        "text": "Sensi Cal-Mag Xtra: nur bei RO-/Umkehrosmosewasser nötig, 20 ml/10L nach Bedarf"
      },
      {
        "icon": "⏱️",
        "text": "Offizieller Bloom-Chart läuft eigentlich 7 aktive Wochen + 1 Flush-Woche — bei längerer Blüte Wk 6 Rate halten, dann flushen."
      },
      {
        "icon": "✅",
        "text": "Alle Zusaetze gegen die Herstellerseiten geprueft (17.9.2026): Advanced Nutrients dosiert praktisch alle Additive mit 2 ml/L. Die Werte hier stimmen."
      }
    ],
    "quelle": "library"
  },
  "biobizz": {
    "name": "BioBizz",
    "emoji": "🌿",
    "color": "#56d364",
    "ecRange": {
      "wuchs": [
        0.6,
        1.5
      ],
      "bluete": [
        1,
        2
      ]
    },
    "refillProduct": {
      "wuchs": "Bio·Grow",
      "bluete": "Bio·Bloom"
    },
    "produkte": {
      "bioGrow": {
        "name": "Bio·Grow",
        "type": "base",
        "note": "NPK Basis — Guanobasis flüssig",
        "color": "#00d4ff",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "ungeeignet",
          "herstellerAngabe": "Laut BioBizz nicht fuer Hydro vorgesehen - geeignet sind dort nur Root·Juice, Bio·Bloom, Bio·Heaven und Top·Max",
          "beleg": "biobizz.com/good-use-and-conservation/ (abgerufen 24.9.2026)",
          "hinweis": "Angemischt haelt die Loesung laut BioBizz \"ein paar Stunden bis einen Tag\". Ein DWC-Reservoir steht hier 7-10 Tage. BioBizz schliesst Hydro nicht generell aus, aber dieses Setup. Die bisherigen Werte wurden entfernt. Vorher vermerkt: Erd-Schema: 2-5 ml/L."
        }
      },
      "bioBloom": {
        "name": "Bio·Bloom",
        "type": "base",
        "note": "Phosphor-Kalium Bloom-Dünger",
        "color": "#00d4ff",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "ungeeignet",
          "herstellerAngabe": "Laut BioBizz in Hydro nur, solange die Mischung hoechstens einen Tag steht (\"as long as you don't let the nutrient mix sit for more than one day\")",
          "beleg": "biobizz.com/good-use-and-conservation/ (abgerufen 24.9.2026)",
          "hinweis": "Angemischt haelt die Loesung laut BioBizz \"ein paar Stunden bis einen Tag\". Ein DWC-Reservoir steht hier 7-10 Tage. BioBizz schliesst Hydro nicht generell aus, aber dieses Setup. Die bisherigen Werte wurden entfernt. Vorher vermerkt: Erd-Schema: 1-4 ml/L."
        }
      },
      "fishMix": {
        "name": "Fish·Mix",
        "type": "vitamin",
        "note": "Fischhydrolysat — Mikroleben + N",
        "color": "#fbbf24",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "ungeeignet",
          "herstellerAngabe": "Laut BioBizz nicht fuer Hydro vorgesehen - geeignet sind dort nur Root·Juice, Bio·Bloom, Bio·Heaven und Top·Max",
          "beleg": "biobizz.com/good-use-and-conservation/ (abgerufen 24.9.2026)",
          "hinweis": "Angemischt haelt die Loesung laut BioBizz \"ein paar Stunden bis einen Tag\". Ein DWC-Reservoir steht hier 7-10 Tage. BioBizz schliesst Hydro nicht generell aus, aber dieses Setup. Die bisherigen Werte wurden entfernt. Vorher vermerkt: Erd-Schema: 1-5 ml/L."
        }
      },
      "topMax": {
        "name": "Top·Max",
        "type": "carbs",
        "note": "Humin + Fulvinsäure + Carbs",
        "color": "#f472b6",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "ungeeignet",
          "herstellerAngabe": "Laut BioBizz in Hydro nur, solange die Mischung hoechstens einen Tag steht (\"as long as you don't let the nutrient mix sit for more than one day\")",
          "beleg": "biobizz.com/good-use-and-conservation/ (abgerufen 24.9.2026)",
          "hinweis": "Angemischt haelt die Loesung laut BioBizz \"ein paar Stunden bis einen Tag\". Ein DWC-Reservoir steht hier 7-10 Tage. BioBizz schliesst Hydro nicht generell aus, aber dieses Setup. Die bisherigen Werte wurden entfernt. Vorher vermerkt: Erd-Schema nennt fuer die Zusaetze 1-5 ml/L."
        }
      },
      "algamic": {
        "name": "Alg·A·Mic",
        "type": "vitamin",
        "note": "Seealgenextrakt + Vitamine — ganzer Run",
        "color": "#a78bfa",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "ungeeignet",
          "herstellerAngabe": "Laut BioBizz nicht fuer Hydro vorgesehen - geeignet sind dort nur Root·Juice, Bio·Bloom, Bio·Heaven und Top·Max",
          "beleg": "biobizz.com/good-use-and-conservation/ (abgerufen 24.9.2026)",
          "hinweis": "Angemischt haelt die Loesung laut BioBizz \"ein paar Stunden bis einen Tag\". Ein DWC-Reservoir steht hier 7-10 Tage. BioBizz schliesst Hydro nicht generell aus, aber dieses Setup. Die bisherigen Werte wurden entfernt. Vorher vermerkt: Erd-Schema: 1 ml/L."
        }
      },
      "rootJuice": {
        "name": "Root·Juice",
        "type": "root",
        "note": "Mykorrhiza + Trichoderma, Wk 1–4",
        "color": "#00ff88",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "ungeeignet",
          "herstellerAngabe": "Laut BioBizz in Hydro nur, solange die Mischung hoechstens einen Tag steht (\"as long as you don't let the nutrient mix sit for more than one day\")",
          "beleg": "biobizz.com/good-use-and-conservation/ (abgerufen 24.9.2026)",
          "hinweis": "Angemischt haelt die Loesung laut BioBizz \"ein paar Stunden bis einen Tag\". Ein DWC-Reservoir steht hier 7-10 Tage. BioBizz schliesst Hydro nicht generell aus, aber dieses Setup. Die bisherigen Werte wurden entfernt. Vorher vermerkt: Erd-Schema nennt fuer die Zusaetze 1-5 ml/L."
        }
      },
      "calmag": {
        "name": "CalMag",
        "type": "calmag",
        "note": "Ca/Mg — bei weichem Wasser",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "ungeeignet",
          "herstellerAngabe": "Laut BioBizz nicht fuer Hydro vorgesehen - geeignet sind dort nur Root·Juice, Bio·Bloom, Bio·Heaven und Top·Max",
          "beleg": "biobizz.com/good-use-and-conservation/ (abgerufen 24.9.2026)",
          "hinweis": "Angemischt haelt die Loesung laut BioBizz \"ein paar Stunden bis einen Tag\". Ein DWC-Reservoir steht hier 7-10 Tage. BioBizz schliesst Hydro nicht generell aus, aber dieses Setup. Die bisherigen Werte wurden entfernt. Vorher vermerkt: Herstellerangabe: nach Wasserhaerte bzw. Mangelbild dosieren, kein fester Wochenwert."
        }
      },
      "bioHeaven": {
        "name": "Bio·Heaven",
        "type": "carbs",
        "note": "Amino-/Carb-Booster, ganzer Run",
        "color": "#fbbf24",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "ungeeignet",
          "herstellerAngabe": "Laut BioBizz in Hydro nur, solange die Mischung hoechstens einen Tag steht (\"as long as you don't let the nutrient mix sit for more than one day\")",
          "beleg": "biobizz.com/good-use-and-conservation/ (abgerufen 24.9.2026)",
          "hinweis": "Angemischt haelt die Loesung laut BioBizz \"ein paar Stunden bis einen Tag\". Ein DWC-Reservoir steht hier 7-10 Tage. BioBizz schliesst Hydro nicht generell aus, aber dieses Setup. Die bisherigen Werte wurden entfernt. Vorher vermerkt: Erd-Schema nennt fuer die Zusaetze 1-5 ml/L."
        }
      },
      "activera": {
        "name": "Acti·Vera",
        "type": "vitamin",
        "note": "Aloe-Vera Immun-/Stoffwechselbooster, ganzer Run",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "ungeeignet",
          "herstellerAngabe": "Laut BioBizz nicht fuer Hydro vorgesehen - geeignet sind dort nur Root·Juice, Bio·Bloom, Bio·Heaven und Top·Max",
          "beleg": "biobizz.com/good-use-and-conservation/ (abgerufen 24.9.2026)",
          "hinweis": "Angemischt haelt die Loesung laut BioBizz \"ein paar Stunden bis einen Tag\". Ein DWC-Reservoir steht hier 7-10 Tage. BioBizz schliesst Hydro nicht generell aus, aber dieses Setup. Die bisherigen Werte wurden entfernt. Vorher vermerkt: Erd-Schema nennt fuer die Zusaetze 1-5 ml/L."
        }
      }
    },
    "dosis": {
      "wuchs": {},
      "bluete": {}
    },
    "ec": {
      "wuchs": {
        "1": 0.7,
        "2": 1,
        "3": 1.3,
        "4": 1.5,
        "5": 1.5,
        "6": 1.5,
        "7": 1.5,
        "8": 1.4
      },
      "bluete": {
        "1": 1.5,
        "2": 1.7,
        "3": 1.8,
        "4": 1.9,
        "5": 2,
        "6": 2
      }
    },
    "hinweis": {
      "wuchs": {},
      "bluete": {}
    },
    "addOrder": {
      "grow": [
        "rootJuice",
        "bioGrow",
        "fishMix",
        "algamic",
        "calmag",
        "bioHeaven"
      ],
      "bloom": [
        "rootJuice",
        "bioGrow",
        "bioBloom",
        "fishMix",
        "topMax",
        "algamic",
        "calmag",
        "bioHeaven"
      ]
    },
    "tips": [
      {
        "icon": "⚠️",
        "text": "WICHTIG für DWC: BioBizz ist primär für Soil/Coco entwickelt. Bio·Bloom, Top·Max, Root·Juice sind laut Hersteller auch für Hydro freigegeben — Bio·Grow und Fish·Mix nicht offiziell. Dicke organische Flüssigkeit kann in stehendem Reservoirwasser Pumpen/Belüfter verstopfen — häufigere Wasserwechsel als bei mineralischen Linien einplanen."
      },
      {
        "icon": "🌿",
        "text": "BioBizz: vollständig organisch — fördert Mikrobenleben im Root-Zone"
      },
      {
        "icon": "⚠️",
        "text": "Bio-Nährstoffe: EC-Werte niedriger als synthetisch — Pflanzen können weniger aufnehmen"
      },
      {
        "icon": "🌊",
        "text": "Flush: 2 Wochen bei BioBizz empfohlen — organische Reste brauchen länger"
      },
      {
        "icon": "🦠",
        "text": "Root·Juice enthält lebende Mikroben — bei <20°C Wassertemperatur zugeben"
      },
      {
        "icon": "🌵",
        "text": "Acti·Vera (Aloe Vera Booster) ergänzt: 5 ml/L (50 ml/10L) als Reservoir-Zusatz nach Bedarf, nicht zwingend jede Woche — verbessert Nährstoffaufnahme und Immunsystem."
      }
    ],
    "quelle": "library",
    "nichtFuerDWC": "Laut BioBizz hält die angemischte Lösung höchstens einen Tag – ein DWC-Reservoir steht 7–10 Tage."
  },
  "aptus": {
    "name": "Aptus",
    "emoji": "⚡",
    "color": "#f0a500",
    "ecRange": {
      "wuchs": [
        0.8,
        1.6
      ],
      "bluete": [
        1.2,
        2.2
      ]
    },
    "refillProduct": {
      "wuchs": "All-In-One",
      "bluete": "All-In-One"
    },
    "produkte": {
      "fasilitor": {
        "name": "Fasilitor",
        "type": "silica",
        "note": "Silika + pH-Puffer (= Regulator) — immer ZUERST!",
        "color": "#8b949e",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "0,15 ml/L in Wuchs und Bluete",
          "beleg": "aptusplanttech / Aptus Feeding Chart"
        }
      },
      "allInOne": {
        "name": "All-in-One Liquid",
        "type": "base",
        "note": "Komplett-Dünger 1-Komponente",
        "quelle": {
          "status": "belegt",
          "herstellerAngabe": "1 ml/L Standard, unter guten Bedingungen bis 2 ml/L",
          "beleg": "aptus-holland.com/products/all-in-one-liquid/",
          "geprueft": "2026-09-17",
          "hinweis": "Bis zum 17.9.2026 stand dieses Produkt ZWEIMAL in der Marke: als Schluessel \"allInOne\" und \"allinone\" - nur die Gross-/Kleinschreibung unterschied sie. Das Dashboard zeigte beide und dosierte damit doppelt (bei 37 L: 81,4 statt 40,7 ml). Dublette entfernt, Werte waren identisch: {\"1\":0.9,\"2\":1.1,\"3\":1.1,\"4\":1.1,\"5\":1.1,\"6\":1.1,\"7\":1.1,\"8\":1.1}"
        }
      },
      "pBoost": {
        "name": "P-Boost",
        "type": "pk",
        "note": "Phosphor-Ergänzung, Bloom Wk 1–4",
        "color": "#f472b6",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "3-5 ml pro 10 L (0,3-0,5 ml/L), von Bluetebeginn bis Bluetewoche 6",
          "beleg": "aptus-holland.com/products/p-boost/ (abgerufen 24.9.2026)",
          "hinweis": "An die Untergrenze des Herstellerbereichs angehoben. Angeglichen am 24.9.2026, vorher: bluete {\"1\":0.1,\"2\":0.2,\"3\":0.2,\"4\":0.1}.",
          "hoechstwert": 0.5
        }
      },
      "kBoost": {
        "name": "K-Boost",
        "type": "pk",
        "note": "Kalium-Ergänzung, Bloom Wk 4–6",
        "color": "#f97316",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "3-5 ml pro 10 L (0,3-0,5 ml/L), Bluetewoche 5-7 oder in den letzten 4 Wochen",
          "beleg": "aptus-holland.com/products/k-boost/ (abgerufen 24.9.2026)",
          "hinweis": "Woche 4 an die Untergrenze angehoben; Woche 4-6 sind die letzten Wochen dieses 6-Wochen-Plans. Angeglichen am 24.9.2026, vorher: bluete {\"4\":0.2,\"5\":0.3,\"6\":0.3}.",
          "hoechstwert": 0.5
        }
      },
      "camgBoost": {
        "name": "CaMg-Boost",
        "type": "calmag",
        "note": "Calcium-Magnesium Ergänzung, ganzer Run",
        "color": "#fbbf24",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "2,5-5 ml pro 10 L (0,25-0,5 ml/L); in Coco/Hydro bei jeder Gabe zusammen mit All-in-One Liquid",
          "beleg": "aptus-holland.com/products/camg-boost/ (abgerufen 24.9.2026)",
          "hoechstwert": 0.5
        }
      },
      "topBooster": {
        "name": "Top Booster",
        "type": "bloom",
        "note": "Bloom-Finisher, Wk 2–6 steigernd",
        "color": "#bc8cff",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "2 ml pro 10 L (0,2 ml/L) ab Bluetewoche 2 bis zur letzten, steigerbar bis 4 ml pro 10 L (0,4 ml/L)",
          "beleg": "aptus-holland.com/products/topbooster/ (abgerufen 24.9.2026)",
          "hinweis": "Woche 6 stand auf 0,5 ml/L - ueber dem Hoechstwert des Herstellers. Auf 0,4 gesenkt.",
          "hoechstwert": 0.4
        }
      },
      "mycorMix": {
        "name": "Mycor Mix",
        "type": "bacteria",
        "note": "Mykorrhiza — EINMALIG bei Umtopfen/Pflanzung, kein Reservoir-Additiv",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "einmalig beim Pflanzen ins Substrat, kein Reservoir-Additiv",
          "beleg": "aptus-holland.com Manual"
        }
      }
    },
    "dosis": {
      "wuchs": {
        "fasilitor": {
          "1": 0.15,
          "2": 0.15,
          "3": 0.15,
          "4": 0.15,
          "5": 0.15,
          "6": 0.15,
          "7": 0.15,
          "8": 0.15
        },
        "allInOne": {
          "1": 0.9,
          "2": 1.1,
          "3": 1.1,
          "4": 1.1,
          "5": 1.1,
          "6": 1.1,
          "7": 1.1,
          "8": 1.1
        },
        "camgBoost": {
          "2": 0.25,
          "3": 0.25,
          "4": 0.25,
          "5": 0.25,
          "6": 0.25,
          "7": 0.25,
          "8": 0.25
        }
      },
      "bluete": {
        "fasilitor": {
          "1": 0.15,
          "2": 0.15,
          "3": 0.15,
          "4": 0.15,
          "5": 0.15,
          "6": 0.15
        },
        "allInOne": {
          "1": 1.3,
          "2": 1.3,
          "3": 1.3,
          "4": 1.6,
          "5": 1.6,
          "6": 1.6
        },
        "pBoost": {
          "1": 0.3,
          "2": 0.3,
          "3": 0.3,
          "4": 0.3
        },
        "camgBoost": {
          "1": 0.5,
          "2": 0.5,
          "3": 0.5,
          "4": 0.5,
          "5": 0.5,
          "6": 0.5
        },
        "topBooster": {
          "2": 0.2,
          "3": 0.3,
          "4": 0.3,
          "5": 0.4,
          "6": 0.4
        },
        "kBoost": {
          "4": 0.3,
          "5": 0.3,
          "6": 0.3
        }
      }
    },
    "ec": {
      "wuchs": {
        "1": 1,
        "2": 1.3,
        "3": 1.5,
        "4": 1.6,
        "5": 1.6,
        "6": 1.6,
        "7": 1.6,
        "8": 1.6
      },
      "bluete": {
        "1": 1.8,
        "2": 1.9,
        "3": 2,
        "4": 2.1,
        "5": 2.2,
        "6": 2.1
      }
    },
    "hinweis": {
      "wuchs": {},
      "bluete": {}
    },
    "addOrder": {
      "grow": [
        "fasilitor",
        "allInOne",
        "camgBoost"
      ],
      "bloom": [
        "fasilitor",
        "allInOne",
        "pBoost",
        "kBoost",
        "topBooster",
        "camgBoost"
      ]
    },
    "tips": [
      {
        "icon": "📋",
        "text": "Werte korrigiert nach offiziellem Aptus 2025 Premium Organo-Mineral Kweekschema (aptus-holland.com)."
      },
      {
        "icon": "🧬",
        "text": "'BioBoost' gibt es bei Aptus nicht (das ist ein CANNA-Produkt) — richtig heißt es Mycor Mix, wird EINMALIG beim Pflanzen/Umtopfen ins Substrat gegeben, nicht wöchentlich ins Reservoir."
      },
      {
        "icon": "⚡",
        "text": "Fasilitor = Regulator (regionale Namen für dasselbe Produkt): immer zuerst ins Wasser — Silika reagiert mit anderen Nährstoffen! Optional auf 3 ml/10L erhöhen in Blüte Wk 1-3 gegen zu starkes Strecken."
      },
      {
        "icon": "🔬",
        "text": "Aptus: Mikrodosierung — sehr konzentriert, genau abmessen!"
      },
      {
        "icon": "📉",
        "text": "All-in-One: schrittweise steigern — überdosierung vermeiden"
      },
      {
        "icon": "🌡️",
        "text": "N-Booster ist laut Aptus nur eine optionale Korrektur bei Stickstoffmangel, kein Standard-Wochenprodukt — deshalb hier nicht im festen Schema."
      },
      {
        "icon": "🐞",
        "text": "All-In-One stand versehentlich zweimal in den Daten und wurde doppelt dosiert. Seit 17.9.2026 behoben."
      }
    ],
    "quelle": "library"
  },
  "house": {
    "name": "House & Garden",
    "emoji": "🟤",
    "color": "#a07040",
    "ecRange": null,
    "refillProduct": {
      "wuchs": "Aqua Flakes A+B",
      "bluete": "Aqua Flakes A+B"
    },
    "produkte": {
      "aquaA": {
        "name": "Aqua Flakes A",
        "type": "base",
        "note": "DWC-spezifisch Basis A",
        "color": "#00d4ff",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "4,5-6 ml/Gallone im Wuchs, 6-9 ml/Gallone in der Bluete, je Komponente (1,19-1,59 bzw. 1,59-2,38 ml/L)",
          "beleg": "House & Garden Deep Water Culture Feed Chart, hydrofarmpubdocs.s3.amazonaws.com/dwc8wkfeedchartfinal.pdf, ml pro US-Gallone, umgerechnet mit 3,785; Mengen je Komponente laut house-garden.us/products/aqua-flakes/ (abgerufen 24.9.2026)",
          "hinweis": "Angeglichen am 24.9.2026, vorher: wuchs {\"1\":0.5,\"2\":0.8,\"3\":1,\"4\":1.2,\"5\":1.2,\"6\":1.2,\"7\":1.2,\"8\":1.2}, bluete {\"1\":1,\"2\":1.2,\"3\":1.2,\"4\":1.2,\"5\":1,\"6\":0.8}.",
          "hoechstwert": 2.38
        }
      },
      "aquaB": {
        "name": "Aqua Flakes B",
        "type": "base",
        "note": "DWC-spezifisch Basis B",
        "color": "#38bdf8",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "gleiche Menge wie A",
          "beleg": "House & Garden Deep Water Culture Feed Chart, hydrofarmpubdocs.s3.amazonaws.com/dwc8wkfeedchartfinal.pdf, ml pro US-Gallone, umgerechnet mit 3,785; Mengen je Komponente laut house-garden.us/products/aqua-flakes/ (abgerufen 24.9.2026)",
          "hinweis": "Angeglichen am 24.9.2026, vorher: wuchs {\"1\":0.5,\"2\":0.8,\"3\":1,\"4\":1.2,\"5\":1.2,\"6\":1.2,\"7\":1.2,\"8\":1.2}, bluete {\"1\":1,\"2\":1.2,\"3\":1.2,\"4\":1.2,\"5\":1,\"6\":0.8}.",
          "hoechstwert": 2.38
        }
      },
      "roots": {
        "name": "Roots Excelurator",
        "type": "root",
        "note": "Premium Wurzelbooster, Grow Wk 1–4",
        "color": "#00ff88",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "Roots Excelurator Silver 0,5 ml/Gallone (0,13 ml/L), Wuchs und Bluetewoche 1-3",
          "beleg": "House & Garden Deep Water Culture Feed Chart, hydrofarmpubdocs.s3.amazonaws.com/dwc8wkfeedchartfinal.pdf, ml pro US-Gallone, umgerechnet mit 3,785; Mengen je Komponente laut house-garden.us/products/aqua-flakes/ (abgerufen 24.9.2026)",
          "hinweis": "Angeglichen am 24.9.2026, vorher: wuchs {\"1\":0.03,\"2\":0.03,\"3\":0.03}.",
          "hoechstwert": 0.13
        }
      },
      "algen": {
        "name": "Algen Extract",
        "type": "vitamin",
        "note": "Kelp — Wachstum + Immunsystem",
        "color": "#fbbf24",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "1-2 ml/Gallone (0,26-0,53 ml/L) - steht nicht im DWC-Schema, Angabe der Produktseite, an der Untergrenze",
          "beleg": "house-garden.us/products/algen-extract/ (abgerufen 24.9.2026)",
          "hinweis": "Angeglichen am 24.9.2026, vorher: wuchs {\"2\":0.1,\"3\":0.1,\"4\":0.1}.",
          "hoechstwert": 0.53
        }
      },
      "amino": {
        "name": "Amino Treatment",
        "type": "vitamin",
        "note": "Aminosäuren, Bloom",
        "color": "#a78bfa",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "1 ml/Gallone (0,26 ml/L), Wuchs und Bluetewoche 1-3",
          "beleg": "House & Garden Deep Water Culture Feed Chart, hydrofarmpubdocs.s3.amazonaws.com/dwc8wkfeedchartfinal.pdf, ml pro US-Gallone, umgerechnet mit 3,785; Mengen je Komponente laut house-garden.us/products/aqua-flakes/ (abgerufen 24.9.2026)",
          "hinweis": "Angeglichen am 24.9.2026, vorher: bluete {\"2\":0.1,\"3\":0.1}.",
          "hoechstwert": 0.26
        }
      },
      "multizyme": {
        "name": "Multi Zen",
        "type": "enzyme",
        "note": "Enzyme, ganzer Run",
        "color": "#a78bfa",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "3,8 ml/Gallone (1,0 ml/L), Wuchs und Bluetewoche 1-3",
          "beleg": "House & Garden Deep Water Culture Feed Chart, hydrofarmpubdocs.s3.amazonaws.com/dwc8wkfeedchartfinal.pdf, ml pro US-Gallone, umgerechnet mit 3,785; Mengen je Komponente laut house-garden.us/products/aqua-flakes/ (abgerufen 24.9.2026)",
          "hinweis": "Heisst bei House & Garden heute Multi Zen (umbenanntVon: Multizyme). Angeglichen am 24.9.2026, vorher: wuchs {\"3\":0.2,\"4\":0.2,\"5\":0.2}, bluete {\"1\":0.2}.",
          "hoechstwert": 1,
          "umbenanntVon": "Multizyme"
        }
      },
      "topBooster": {
        "name": "Top Booster",
        "type": "pk",
        "note": "PK-Booster, Bloom Wk 3–6",
        "color": "#f472b6",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "4 ml/Gallone (1,06 ml/L) in Bluetewoche 5",
          "beleg": "House & Garden Deep Water Culture Feed Chart, hydrofarmpubdocs.s3.amazonaws.com/dwc8wkfeedchartfinal.pdf, ml pro US-Gallone, umgerechnet mit 3,785; Mengen je Komponente laut house-garden.us/products/aqua-flakes/ (abgerufen 24.9.2026)",
          "hinweis": "Angeglichen am 24.9.2026, vorher: bluete {\"3\":0.2,\"4\":0.2}.",
          "hoechstwert": 1.06
        }
      },
      "budXL": {
        "name": "Bud-XL",
        "type": "bloom",
        "note": "Zuckerextraktion aus Blättern, Bloom",
        "color": "#fbbf24",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "3,8 ml/Gallone (1,0 ml/L) in Bluetewoche 4-8",
          "beleg": "House & Garden Deep Water Culture Feed Chart, hydrofarmpubdocs.s3.amazonaws.com/dwc8wkfeedchartfinal.pdf, ml pro US-Gallone, umgerechnet mit 3,785; Mengen je Komponente laut house-garden.us/products/aqua-flakes/ (abgerufen 24.9.2026)",
          "hinweis": "Angeglichen am 24.9.2026, vorher: bluete {\"1\":0.1,\"2\":0.1,\"3\":0.1,\"4\":0.1}.",
          "hoechstwert": 1
        }
      },
      "shooting": {
        "name": "Shooting Powder",
        "type": "bloom",
        "note": "Explosiver Finisher, Bloom Wk 5–6",
        "color": "#f97316",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "65 g auf 100 L in den letzten drei Wochen, 130 g auf 100 L in den letzten ein bis zwei = 0,65 bzw. 1,3 g/L",
          "beleg": "House & Garden Dosierangabe (im Hinweistext dieser Marke belegt)",
          "hinweis": "Seit 24.9.2026 ohne Dosis im Plan: das DWC-Schema fuehrt Shooting Powder und Top Shooter als Alternativen (nie beides); der Plan rechnet mit dem fluessigen Top Shooter. Shooting Powder: 1 Beutel pro 50 Gallonen in Woche 6, pro 25 Gallonen in Woche 7-8. Vorher: bluete {\"5\":0.65,\"6\":1.3}."
        },
        "einheit": "g"
      },
      "dripClean": {
        "name": "Drip Clean",
        "type": "flush",
        "note": "Salzvorbeugung, 0.4 ml/10L ganzer Run",
        "color": "#8b949e",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "0,4 ml/Gallone (0,11 ml/L) in jeder Woche",
          "beleg": "House & Garden Deep Water Culture Feed Chart, hydrofarmpubdocs.s3.amazonaws.com/dwc8wkfeedchartfinal.pdf, ml pro US-Gallone, umgerechnet mit 3,785; Mengen je Komponente laut house-garden.us/products/aqua-flakes/ (abgerufen 24.9.2026)",
          "hinweis": "Angeglichen am 24.9.2026, vorher: wuchs {\"1\":0.04,\"2\":0.04,\"3\":0.04,\"4\":0.04,\"5\":0.04,\"6\":0.04,\"7\":0.04,\"8\":0.04}, bluete {\"1\":0.04,\"2\":0.04,\"3\":0.04,\"4\":0.04,\"5\":0.04,\"6\":0.04}.",
          "hoechstwert": 0.11
        }
      },
      "phStabiliser": {
        "name": "PH Stabiliser",
        "type": "enzyme",
        "note": "pH-Puffer für RO-/weiches Wasser, ganzer Run vor Basis-Dünger",
        "color": "#ef4444",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "1 ml/L, ueber den ganzen Zyklus, vor jedem Basisduenger ins Wasser",
          "beleg": "house-garden.com.au/ph-stabiliser (House & Garden Nutrients Australia) (abgerufen 24.9.2026)"
        }
      },
      "topShooter": {
        "name": "Top Shooter",
        "type": "pk",
        "note": "ALTERNATIVE zu Top Booster + Shooting Powder — nicht kombinieren!",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "2 ml/Gallone in Bluetewoche 6, 4 ml/Gallone in Woche 7-8 (0,53 bzw. 1,06 ml/L) - alternativ zu Shooting Powder",
          "beleg": "House & Garden Deep Water Culture Feed Chart, hydrofarmpubdocs.s3.amazonaws.com/dwc8wkfeedchartfinal.pdf, ml pro US-Gallone, umgerechnet mit 3,785; Mengen je Komponente laut house-garden.us/products/aqua-flakes/ (abgerufen 24.9.2026)",
          "hinweis": "Angeglichen am 24.9.2026, vorher: ohne Dosis.",
          "hoechstwert": 1.06
        }
      },
      "nitrogenBoost": {
        "name": "Nitrogen Boost",
        "type": "vitamin",
        "note": "Stickstoff-Ergänzung, Wuchs und Blütewoche 1-4",
        "color": "#4ade80",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "0,5 ml/Gallone in Wuchswoche 1, sonst 1 ml/Gallone (0,13 bzw. 0,26 ml/L), Wuchs und Bluetewoche 1-4",
          "beleg": "House & Garden Deep Water Culture Feed Chart, hydrofarmpubdocs.s3.amazonaws.com/dwc8wkfeedchartfinal.pdf, ml pro US-Gallone, umgerechnet mit 3,785; Mengen je Komponente laut house-garden.us/products/aqua-flakes/ (abgerufen 24.9.2026)",
          "hinweis": "Neu aufgenommen: steht im DWC-Schema, fehlte im Datensatz. Angeglichen am 24.9.2026, vorher: nicht im Datensatz.",
          "hoechstwert": 0.26
        }
      }
    },
    "dosis": {
      "wuchs": {
        "phStabiliser": {
          "1": 1,
          "2": 1,
          "3": 1,
          "4": 1
        },
        "dripClean": {
          "1": 0.11,
          "2": 0.11,
          "3": 0.11,
          "4": 0.11
        },
        "multizyme": {
          "1": 1,
          "2": 1,
          "3": 1,
          "4": 1
        },
        "roots": {
          "1": 0.13,
          "2": 0.13,
          "3": 0.13,
          "4": 0.13
        },
        "amino": {
          "1": 0.26,
          "2": 0.26,
          "3": 0.26,
          "4": 0.26
        },
        "nitrogenBoost": {
          "1": 0.13,
          "2": 0.26,
          "3": 0.26,
          "4": 0.26
        },
        "aquaA": {
          "1": 1.19,
          "2": 1.32,
          "3": 1.59,
          "4": 1.59
        },
        "aquaB": {
          "1": 1.19,
          "2": 1.32,
          "3": 1.59,
          "4": 1.59
        },
        "algen": {
          "2": 0.26,
          "3": 0.26,
          "4": 0.26
        }
      },
      "bluete": {
        "phStabiliser": {
          "1": 1,
          "2": 1,
          "3": 1,
          "4": 1,
          "5": 1,
          "6": 1,
          "7": 1,
          "8": 1
        },
        "dripClean": {
          "1": 0.11,
          "2": 0.11,
          "3": 0.11,
          "4": 0.11,
          "5": 0.11,
          "6": 0.11,
          "7": 0.11,
          "8": 0.11
        },
        "multizyme": {
          "1": 1,
          "2": 1,
          "3": 1
        },
        "roots": {
          "1": 0.13,
          "2": 0.13,
          "3": 0.13
        },
        "amino": {
          "1": 0.26,
          "2": 0.26,
          "3": 0.26
        },
        "nitrogenBoost": {
          "1": 0.26,
          "2": 0.26,
          "3": 0.26,
          "4": 0.26
        },
        "aquaA": {
          "1": 1.59,
          "2": 1.85,
          "3": 2.11,
          "4": 2.38,
          "5": 2.11,
          "6": 1.85,
          "7": 1.85,
          "8": 1.85
        },
        "aquaB": {
          "1": 1.59,
          "2": 1.85,
          "3": 2.11,
          "4": 2.38,
          "5": 2.11,
          "6": 1.85,
          "7": 1.85,
          "8": 1.85
        },
        "budXL": {
          "4": 1,
          "5": 1,
          "6": 1,
          "7": 1,
          "8": 1
        },
        "topBooster": {
          "5": 1.06
        },
        "topShooter": {
          "6": 0.53,
          "7": 1.06,
          "8": 1.06
        }
      }
    },
    "ec": {
      "wuchs": {},
      "bluete": {}
    },
    "hinweis": {
      "wuchs": {
        "4": "Laut House & Garden dauert die Wuchsphase im DWC selten länger als 3 Wochen."
      },
      "bluete": {
        "6": "Top Shooter ODER Shooting Powder – nie beides. Shooting Powder: 1 Beutel pro 50 Gallonen (189 L) in Woche 6, pro 25 Gallonen (95 L) in Woche 7-8."
      }
    },
    "addOrder": {
      "grow": [
        "phStabiliser",
        "dripClean",
        "multizyme",
        "roots",
        "amino",
        "nitrogenBoost",
        "aquaA",
        "aquaB",
        "algen"
      ],
      "bloom": [
        "phStabiliser",
        "dripClean",
        "multizyme",
        "roots",
        "amino",
        "nitrogenBoost",
        "aquaA",
        "aquaB",
        "budXL",
        "topBooster",
        "topShooter",
        "shooting"
      ]
    },
    "tips": [
      {
        "icon": "📐",
        "text": "Seit 24.9.2026 nach dem DWC-Schema von House & Garden: 4 Wuchs-, 8 Blütewochen, Aqua Flakes A und B jeweils in der angegebenen Menge. House & Garden nennt dafür keinen EC-Zielwert. Vorher lagen die Mengen bei rund einem Drittel. Bei laufendem Grow nicht auf einen Schlag umstellen: EC in Schritten von höchstens 0,2 pro Wasserwechsel anheben."
      },
      {
        "icon": "🏆",
        "text": "Roots Excelurator: laut Community der stärkste Wurzelbooster — sehr wenig reicht!"
      },
      {
        "icon": "💣",
        "text": "Shooting Powder: als Pulver separat in warmem Wasser auflösen vor Zugabe. Korrigiert nach offizieller Dosierung (65g/100L letzte 3 Wochen, 130g/100L letzte 1-2 Wochen) — war zuvor 6-13x unterdosiert."
      },
      {
        "icon": "💧",
        "text": "PH Stabiliser neu ergänzt: puffert RO-/weiches Wasser VOR der Basis-Düngung, 1 ml/L, ganzer Run."
      },
      {
        "icon": "🎯",
        "text": "Top Shooter: dritter PK-/Finisher-Booster von House & Garden — laut Hersteller eine ALTERNATIVE zu Top Booster + Shooting Powder, nicht zusätzlich kombinieren. Hier deshalb nicht ins Standard-Schema aufgenommen."
      },
      {
        "icon": "🧂",
        "text": "Drip Clean: ganzen Run hindurch — verhindert Salzakkumulation an Wurzeln"
      },
      {
        "icon": "🔍",
        "text": "Das offizielle House-&-Garden-DWC-Schema weicht ab (8 Bluetewochen, deutlich hoehere Zusaetze). Vor Nutzung dieser Marke die Werte gegen das Herstellerchart abgleichen."
      }
    ],
    "quelle": "library",
    "wochen": {
      "bluete": {
        "naehrstoff": 8,
        "gesamt": 9,
        "spuelen": "laut House & Garden 2-5 Tage"
      }
    },
    "planHinweis": "Seit 24.9.2026 nach dem DWC-Schema von House & Garden: 4 Wuchs-, 8 Blütewochen, Aqua Flakes A und B jeweils in der angegebenen Menge. House & Garden nennt dafür keinen EC-Zielwert. Vorher lagen die Mengen bei rund einem Drittel. Bei laufendem Grow nicht auf einen Schlag umstellen: EC in Schritten von höchstens 0,2 pro Wasserwechsel anheben."
  },
  "atami": {
    "name": "Atami B'cuzz",
    "emoji": "🌊",
    "color": "#00c8ff",
    "ecRange": {
      "wuchs": [
        0.8,
        1.8
      ],
      "bluete": [
        1.2,
        2.2
      ]
    },
    "refillProduct": {
      "wuchs": "B'cuzz Hydro A+B",
      "bluete": "B'cuzz Hydro A+B"
    },
    "produkte": {
      "hydroA": {
        "name": "B'cuzz Hydro A",
        "type": "base",
        "note": "Basis DWC/Hydro A — immer 1:1 mit B",
        "color": "#00d4ff",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "1,5-2,5 ml/L je nach Phase, A und B gleich",
          "beleg": "Atami B’cuzz Hydro Feedchart / atami.com Produktangaben"
        }
      },
      "hydroB": {
        "name": "B'cuzz Hydro B",
        "type": "base",
        "note": "Basis DWC/Hydro B — immer 1:1 mit A",
        "color": "#38bdf8",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "gleiche Menge wie A",
          "beleg": "Atami B’cuzz Hydro Feedchart / atami.com Produktangaben"
        }
      },
      "rootStim": {
        "name": "Root Stimulator",
        "type": "root",
        "note": "Wurzelstimulator, Grow Wk 1–4",
        "color": "#00ff88",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "0,5-1 ml/L, erste zwei Wochen",
          "beleg": "Atami B’cuzz Hydro Feedchart / atami.com Produktangaben"
        }
      },
      "ataraxia": {
        "name": "Atazyme",
        "type": "enzyme",
        "note": "Enzyme – ab Wuchswoche 2 bis zur Reife",
        "color": "#a78bfa",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "umbenanntVon": "Ataraxia",
          "herstellerAngabe": "1 ml/L ab der zweiten Wachstumsperiode bis zur Reife",
          "beleg": "Atami Grow Guide B’cuzz Hydro, atami.com/wp-content/uploads/2024/12/Atami-Grow-Guide-Bcuzz-Hydro-1.pdf (abgerufen 24.9.2026)",
          "hinweis": "Stand als \"Ataraxia\" mit 0,25 ml/L in Wuchswoche 1-5 und Bluetewoche 1-2 - ein Produkt dieses Namens fuehrt Atami nicht. Das einzige Enzym im Hydro-Schema ist Atazyme. Die alten Zahlen gehoerten zu keinem echten Produkt und hatten damit keine Quelle; sie wurden durch die Herstellerwerte ersetzt."
        }
      },
      "boosting": {
        "name": "B’cuzz Bloom Stimulator",
        "type": "bloom",
        "note": "Blütestimulator, ganze Blüte",
        "color": "#f472b6",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "umbenanntVon": "Boosting",
          "herstellerAngabe": "0,5-1 ml/L ueber die ganze Bluete (Early Bloom bis Ripening)",
          "beleg": "Atami Grow Guide B’cuzz Hydro, atami.com/wp-content/uploads/2024/12/Atami-Grow-Guide-Bcuzz-Hydro-1.pdf (abgerufen 24.9.2026)",
          "hinweis": "Stand als \"Boosting\" mit der Notiz \"Bloom-Stimulator\" - ein Produkt dieses Namens fuehrt Atami nicht. Nach Notiz und Dosisbereich ist der B’cuzz Bloom Stimulator gemeint (Hydro Booster Uni sieht das Schema nur im Wachstum vor). Woche 1-4 lagen mit 0,5-0,8 ml/L im Herstellerbereich; Woche 5-6 mit 0,5 ergaenzt, weil der Hersteller ihn bis zur Reife gibt."
        }
      },
      "bloombastic": {
        "name": "Bloombastic",
        "type": "pk",
        "note": "PK + Carbs Finisher, Bloom Wk 4–6",
        "color": "#f97316",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "0,5 ml/L in den ersten zwei Bluetewochen, 1 ml/L in den letzten zwei",
          "beleg": "Atami B’cuzz Hydro Feedchart / atami.com Produktangaben"
        }
      },
      "calmag": {
        "name": "CalMag",
        "type": "calmag",
        "note": "Ca/Mg — bei weichem Wasser",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "Herstellerangabe: nach Wasserhaerte bzw. Mangelbild dosieren, kein fester Wochenwert",
          "beleg": "Produktangaben des jeweiligen Herstellers",
          "hinweis": "CalMag ist wasserabhaengig: bei Umkehrosmose- oder sehr weichem Wasser noetig, bei hartem Leitungswasser oft gar nicht. Ein Fixwert waere hier falsche Genauigkeit."
        }
      }
    },
    "dosis": {
      "wuchs": {
        "hydroA": {
          "1": 1.5,
          "2": 1.8,
          "3": 2,
          "4": 2.2,
          "5": 2.5,
          "6": 2.5,
          "7": 2.5,
          "8": 2.5
        },
        "hydroB": {
          "1": 1.5,
          "2": 1.8,
          "3": 2,
          "4": 2.2,
          "5": 2.5,
          "6": 2.5,
          "7": 2.5,
          "8": 2.5
        },
        "rootStim": {
          "1": 0.5,
          "2": 0.5,
          "3": 0.5,
          "4": 0.3
        },
        "ataraxia": {
          "2": 1,
          "3": 1,
          "4": 1,
          "5": 1,
          "6": 1,
          "7": 1,
          "8": 1
        }
      },
      "bluete": {
        "hydroA": {
          "1": 2,
          "2": 2,
          "3": 2.2,
          "4": 2.2,
          "5": 2,
          "6": 1.5
        },
        "hydroB": {
          "1": 2,
          "2": 2,
          "3": 2.2,
          "4": 2.2,
          "5": 2,
          "6": 1.5
        },
        "boosting": {
          "1": 0.5,
          "2": 0.8,
          "3": 0.8,
          "4": 0.5,
          "5": 0.5,
          "6": 0.5
        },
        "ataraxia": {
          "1": 1,
          "2": 1,
          "3": 1,
          "4": 1,
          "5": 1,
          "6": 1
        },
        "bloombastic": {
          "4": 0.5,
          "5": 0.8,
          "6": 0.8
        }
      }
    },
    "ec": {
      "wuchs": {
        "1": 0.9,
        "2": 1.2,
        "3": 1.5,
        "4": 1.6,
        "5": 1.8,
        "6": 1.8,
        "7": 1.8,
        "8": 1.8
      },
      "bluete": {
        "1": 1.8,
        "2": 1.9,
        "3": 2,
        "4": 2.1,
        "5": 2.2,
        "6": 2.1
      }
    },
    "hinweis": {
      "wuchs": {},
      "bluete": {}
    },
    "addOrder": {
      "grow": [
        "ataraxia",
        "rootStim",
        "hydroA",
        "hydroB",
        "calmag"
      ],
      "bloom": [
        "ataraxia",
        "hydroA",
        "hydroB",
        "boosting",
        "bloombastic",
        "calmag"
      ]
    },
    "tips": [
      {
        "icon": "🌊",
        "text": "B'cuzz Hydro A+B: 1:1 Verhältnis — niemals separat überdosieren"
      },
      {
        "icon": "💥",
        "text": "Bloombastic: sehr konzentriert — max 8 ml/10L, nicht übersteigern"
      },
      {
        "icon": "🧬",
        "text": "Ataraxia: Enzyme + Amino — schützt vor Salzstress und fördert Aufnahme"
      }
    ],
    "quelle": "library"
  },
  "mills": {
    "name": "Mills Nutrients",
    "emoji": "⚫",
    "color": "#8b949e",
    "ecRange": {
      "wuchs": [
        1.3,
        1.9
      ],
      "bluete": [
        1.8,
        2.8
      ]
    },
    "refillProduct": {
      "wuchs": "Basis A+B",
      "bluete": "Basis A+B"
    },
    "produkte": {
      "basisA": {
        "name": "Basis A",
        "type": "base",
        "note": "Basis-Dünger A",
        "color": "#00d4ff",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "HC, Leitungswasser: 0,2/0,4 ml/L im Wuchs, Bluete 0,9-1,5 ml/L (Woche 9: 0,9)",
          "beleg": "Mills Grow Chart High Concentrated, Leitungswasser (EC 0,7), mills-nutrients.com/wp-content/uploads/2025/10/MILLS_HC_A5-SCHEMA-FLYER_EN-182.pdf, ml pro Liter (abgerufen 24.9.2026)",
          "hinweis": "Regular: Wuchs 1/1, Bluete 2-4 ml/L. Mills fuehrt zwei Linien parallel (HC und Regular, gleiche Produktnamen). Hier stehen die HC-Werte fuer Leitungswasser; Regular braucht etwa das 2,3-fache bei gleichen EC-Zielen (mills-nutrients.com/wp-content/uploads/2025/10/Regular-MILLS_A5-SCHEMA-FLYER_EN-2.pdf). Mit Regular-Flaschen zeigt der EC, dass nachdosiert werden muss - umgekehrt wuerde es verbrennen. Mit Osmosewasser nennt Mills hoehere Mengen. Angeglichen am 24.9.2026, vorher: wuchs {\"1\":0.5,\"2\":0.8,\"3\":1,\"4\":1.2,\"5\":1.2,\"6\":1.2,\"7\":1.2,\"8\":1.2}, bluete {\"1\":1,\"2\":1,\"3\":1,\"4\":1,\"5\":1,\"6\":0.8}.",
          "hoechstwert": 1.5
        }
      },
      "basisB": {
        "name": "Basis B",
        "type": "base",
        "note": "Basis-Dünger B",
        "color": "#38bdf8",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "gleiche Menge wie A",
          "beleg": "Mills Grow Chart High Concentrated, Leitungswasser (EC 0,7), mills-nutrients.com/wp-content/uploads/2025/10/MILLS_HC_A5-SCHEMA-FLYER_EN-182.pdf, ml pro Liter (abgerufen 24.9.2026)",
          "hinweis": " Mills fuehrt zwei Linien parallel (HC und Regular, gleiche Produktnamen). Hier stehen die HC-Werte fuer Leitungswasser; Regular braucht etwa das 2,3-fache bei gleichen EC-Zielen (mills-nutrients.com/wp-content/uploads/2025/10/Regular-MILLS_A5-SCHEMA-FLYER_EN-2.pdf). Mit Regular-Flaschen zeigt der EC, dass nachdosiert werden muss - umgekehrt wuerde es verbrennen. Mit Osmosewasser nennt Mills hoehere Mengen. Angeglichen am 24.9.2026, vorher: wuchs {\"1\":0.5,\"2\":0.8,\"3\":1,\"4\":1.2,\"5\":1.2,\"6\":1.2,\"7\":1.2,\"8\":1.2}, bluete {\"1\":1,\"2\":1,\"3\":1,\"4\":1,\"5\":1,\"6\":0.8}.",
          "hoechstwert": 1.5
        }
      },
      "startR": {
        "name": "Start-R",
        "type": "root",
        "note": "Keimung + Wurzeln, Grow Wk 1–3 + Blüte-Übergang Wk 1–2",
        "color": "#00ff88",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "HC: 0,4/0,7 ml/L im Wuchs, 0,4 ml/L in Bluetewoche 1-2",
          "beleg": "Mills Grow Chart High Concentrated, Leitungswasser (EC 0,7), mills-nutrients.com/wp-content/uploads/2025/10/MILLS_HC_A5-SCHEMA-FLYER_EN-182.pdf, ml pro Liter (abgerufen 24.9.2026)",
          "hinweis": "Regular: 1/2 bzw. 1/1 ml/L. Mills fuehrt zwei Linien parallel (HC und Regular, gleiche Produktnamen). Hier stehen die HC-Werte fuer Leitungswasser; Regular braucht etwa das 2,3-fache bei gleichen EC-Zielen (mills-nutrients.com/wp-content/uploads/2025/10/Regular-MILLS_A5-SCHEMA-FLYER_EN-2.pdf). Mit Regular-Flaschen zeigt der EC, dass nachdosiert werden muss - umgekehrt wuerde es verbrennen. Mit Osmosewasser nennt Mills hoehere Mengen. Angeglichen am 24.9.2026, vorher: wuchs {\"1\":0.1,\"2\":0.1,\"3\":0.1}, bluete {\"1\":0.1,\"2\":0.1}.",
          "hoechstwert": 0.7
        }
      },
      "vitalize": {
        "name": "Vitalize",
        "type": "silica",
        "note": "Silika — Stressresistenz + Struktur",
        "color": "#8b949e",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "HC: 0,2 ml/L bis Bluetewoche 4, 0,1 ml/L in Woche 5-6; immer zuerst ins Wasser",
          "beleg": "Mills Grow Chart High Concentrated, Leitungswasser (EC 0,7), mills-nutrients.com/wp-content/uploads/2025/10/MILLS_HC_A5-SCHEMA-FLYER_EN-182.pdf, ml pro Liter (abgerufen 24.9.2026)",
          "hinweis": "Regular: gleiche Menge. Mills fuehrt zwei Linien parallel (HC und Regular, gleiche Produktnamen). Hier stehen die HC-Werte fuer Leitungswasser; Regular braucht etwa das 2,3-fache bei gleichen EC-Zielen (mills-nutrients.com/wp-content/uploads/2025/10/Regular-MILLS_A5-SCHEMA-FLYER_EN-2.pdf). Mit Regular-Flaschen zeigt der EC, dass nachdosiert werden muss - umgekehrt wuerde es verbrennen. Mit Osmosewasser nennt Mills hoehere Mengen. Angeglichen am 24.9.2026, vorher: wuchs {\"1\":0.03,\"2\":0.03,\"3\":0.03,\"4\":0.03,\"5\":0.03}, bluete {\"1\":0.03,\"2\":0.03}.",
          "hoechstwert": 0.2
        }
      },
      "c4": {
        "name": "C4",
        "type": "carbs",
        "note": "Carbs + Amino, NUR Blüte ab Wk 2",
        "color": "#a78bfa",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "HC: 0,2/0,4/0,4/0,6/0,6 ml/L in Bluetewoche 2-6",
          "beleg": "Mills Grow Chart High Concentrated, Leitungswasser (EC 0,7), mills-nutrients.com/wp-content/uploads/2025/10/MILLS_HC_A5-SCHEMA-FLYER_EN-182.pdf, ml pro Liter (abgerufen 24.9.2026)",
          "hinweis": "Regular: 0,5-1,5 ml/L. Mills fuehrt zwei Linien parallel (HC und Regular, gleiche Produktnamen). Hier stehen die HC-Werte fuer Leitungswasser; Regular braucht etwa das 2,3-fache bei gleichen EC-Zielen (mills-nutrients.com/wp-content/uploads/2025/10/Regular-MILLS_A5-SCHEMA-FLYER_EN-2.pdf). Mit Regular-Flaschen zeigt der EC, dass nachdosiert werden muss - umgekehrt wuerde es verbrennen. Mit Osmosewasser nennt Mills hoehere Mengen. Angeglichen am 24.9.2026, vorher: bluete {\"2\":0.2,\"3\":0.2,\"4\":0.2,\"5\":0.2}.",
          "hoechstwert": 0.6
        }
      },
      "ultimatePK": {
        "name": "Ultimate PK",
        "type": "pk",
        "note": "PK-Booster, ab Blüte Wk 4 langsam steigern",
        "color": "#f97316",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "HC: 1/1/1,5/1,5/1 ml/L in Bluetewoche 5-9",
          "beleg": "Mills Grow Chart High Concentrated, Leitungswasser (EC 0,7), mills-nutrients.com/wp-content/uploads/2025/10/MILLS_HC_A5-SCHEMA-FLYER_EN-182.pdf, ml pro Liter (abgerufen 24.9.2026)",
          "hinweis": "Regular: 2-2,5 ml/L. Mills fuehrt zwei Linien parallel (HC und Regular, gleiche Produktnamen). Hier stehen die HC-Werte fuer Leitungswasser; Regular braucht etwa das 2,3-fache bei gleichen EC-Zielen (mills-nutrients.com/wp-content/uploads/2025/10/Regular-MILLS_A5-SCHEMA-FLYER_EN-2.pdf). Mit Regular-Flaschen zeigt der EC, dass nachdosiert werden muss - umgekehrt wuerde es verbrennen. Mit Osmosewasser nennt Mills hoehere Mengen. Angeglichen am 24.9.2026, vorher: bluete {\"4\":0.2,\"5\":0.3,\"6\":0.4}.",
          "hoechstwert": 1.5
        }
      }
    },
    "dosis": {
      "wuchs": {
        "vitalize": {
          "1": 0.2,
          "2": 0.2
        },
        "basisA": {
          "1": 0.2,
          "2": 0.4
        },
        "basisB": {
          "1": 0.2,
          "2": 0.4
        },
        "startR": {
          "1": 0.4,
          "2": 0.7
        }
      },
      "bluete": {
        "vitalize": {
          "1": 0.2,
          "2": 0.2,
          "3": 0.2,
          "4": 0.2,
          "5": 0.1,
          "6": 0.1
        },
        "basisA": {
          "1": 0.9,
          "2": 0.9,
          "3": 1.4,
          "4": 1.5,
          "5": 1.4,
          "6": 1.4,
          "7": 1.4,
          "8": 1.4,
          "9": 0.9
        },
        "basisB": {
          "1": 0.9,
          "2": 0.9,
          "3": 1.4,
          "4": 1.5,
          "5": 1.4,
          "6": 1.4,
          "7": 1.4,
          "8": 1.4,
          "9": 0.9
        },
        "startR": {
          "1": 0.4,
          "2": 0.4
        },
        "c4": {
          "2": 0.2,
          "3": 0.4,
          "4": 0.4,
          "5": 0.6,
          "6": 0.6
        },
        "ultimatePK": {
          "5": 1,
          "6": 1,
          "7": 1.5,
          "8": 1.5,
          "9": 1
        }
      }
    },
    "ec": {
      "wuchs": {
        "1": 1.4,
        "2": 1.8
      },
      "bluete": {
        "1": 2,
        "2": 2.2,
        "3": 2.4,
        "4": 2.6,
        "5": 2.7,
        "6": 2.7,
        "7": 2.5,
        "8": 2.5,
        "9": 1.9
      }
    },
    "hinweis": {
      "wuchs": {},
      "bluete": {}
    },
    "addOrder": {
      "grow": [
        "vitalize",
        "basisA",
        "basisB",
        "startR"
      ],
      "bloom": [
        "vitalize",
        "basisA",
        "basisB",
        "startR",
        "c4",
        "ultimatePK"
      ]
    },
    "tips": [
      {
        "icon": "📐",
        "text": "Seit 24.9.2026 nach dem Mills-Schema der HC-Linie (High Concentrated), Leitungswasser mit EC 0,7: 2 Wuchs-, 9 Blütewochen. Fuer die Regular-Linie gilt etwa das 2,3-fache bei gleichen EC-Zielen – wer die Linie nicht kennt, mischt nach diesem Plan und dosiert nach EC nach. Bei laufendem Grow nicht auf einen Schlag umstellen: EC in Schritten von höchstens 0,2 pro Wasserwechsel anheben."
      },
      {
        "icon": "⚫",
        "text": "Mills: schlanke Linie — wenige Produkte, aber sehr effektiv und vollständig"
      },
      {
        "icon": "🪨",
        "text": "Vitalize (Silica): immer vor Basis A+B zugeben, pH steigt danach"
      },
      {
        "icon": "📈",
        "text": "Ultimate PK: langsam steigern ab Blüte Wk 4 — offizieller Mills-Chart setzt PK deutlich später und höher an als zuvor hier hinterlegt (Wk 5-9 statt Wk 2-6); die genaue Konzentration hängt davon ab, welche Mills-Produktlinie (Regular/High-Concentrate) du hast — bei Unsicherheit über EC vorsichtig herantasten statt Herstellerwert blind übernehmen."
      },
      {
        "icon": "🔄",
        "text": "C4 ist laut offiziellem Feedchart NUR ein Blüte-Additiv (ab Wk 2) — nicht mehr durchgängig im Grow, wie zuvor hier hinterlegt."
      }
    ],
    "quelle": "library",
    "wochen": {
      "bluete": {
        "naehrstoff": 9,
        "gesamt": 9
      }
    },
    "planHinweis": "Seit 24.9.2026 nach dem Mills-Schema der HC-Linie (High Concentrated), Leitungswasser mit EC 0,7: 2 Wuchs-, 9 Blütewochen. Fuer die Regular-Linie gilt etwa das 2,3-fache bei gleichen EC-Zielen – wer die Linie nicht kennt, mischt nach diesem Plan und dosiert nach EC nach. Bei laufendem Grow nicht auf einen Schlag umstellen: EC in Schritten von höchstens 0,2 pro Wasserwechsel anheben."
  },
  "athena": {
    "name": "Athena Pro",
    "emoji": "🩵",
    "color": "#79c0ff",
    "ecRange": {
      "wuchs": [
        1.3,
        1.7
      ],
      "bluete": [
        1,
        2
      ]
    },
    "refillProduct": {
      "wuchs": "Athena Grow",
      "bluete": "Athena Bloom"
    },
    "produkte": {
      "proCore": {
        "name": "Athena Core",
        "type": "base",
        "note": "Basis — immer mit Grow (Wuchs) oder Bloom (Blüte) kombinieren, Pulver in Gramm",
        "color": "#00d4ff",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "EC-gefuehrt: 0,79 g/L bei Ziel-EC 2,0 (Konzentrat 240 g/L: 3,3 ml/L)",
          "beleg": "Athena Pro Dosage Guidelines (Metric)",
          "hinweis": "Athena Pro ist ein PULVER - die Zahlen hier sind g/L, nicht ml/L. Seit 24.9.2026 zeigen beide Rechner Gramm an (Feld einheit). In Bluetewoche 7-8 uebernimmt Fade (seit 24.9.2026)."
        },
        "einheit": "g"
      },
      "proGrow": {
        "name": "Athena Grow",
        "type": "base",
        "note": "Basis Grow, Pulver in Gramm",
        "color": "#38bdf8",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "EC-gefuehrt, Pulver: Gramm pro Liter, nicht ml",
          "beleg": "Athena Pro Dosage Guidelines (Metric)"
        },
        "einheit": "g"
      },
      "proBloom": {
        "name": "Athena Bloom",
        "type": "base",
        "note": "Basis Bloom, Pulver in Gramm",
        "color": "#38bdf8",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "EC-gefuehrt, Pulver: Gramm pro Liter, nicht ml",
          "beleg": "Athena Pro Dosage Guidelines (Metric)"
        },
        "einheit": "g"
      },
      "camg": {
        "name": "Athena CaMg",
        "type": "calmag",
        "note": "Optional bei RO-/Umkehrosmosewasser",
        "color": "#fbbf24",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "2-3 ml/Gallone = 0,53-0,79 ml/L",
          "beleg": "Athena Feed Schedule (Normal), Athena-Feed-Schedule-English-All.pdf, ml pro Gallone"
        }
      },
      "cleanse": {
        "name": "Athena Cleanse",
        "type": "enzyme",
        "note": "Reservoir-/Wurzelpflege, ganzer Run",
        "color": "#a78bfa",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "2 ml/Gallone = 0,53 ml/L bei jeder Bewaesserung, 10 ml/gal = 2,64 ml/L im Flush",
          "beleg": "Athena Feed Schedule (Normal), Athena-Feed-Schedule-English-All.pdf, ml pro Gallone"
        }
      },
      "pk": {
        "name": "Athena PK",
        "type": "pk",
        "note": "Phosphor-Kalium Bloom-Booster, ab Wk 3",
        "color": "#f97316",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "Normal-Chart: 4/5/9/10/12/10 ml/Gallone in Bluetewoche 3-8 = 1,06 bis 3,17 ml/L",
          "beleg": "Athena Feed Schedule (Normal), Athena-Feed-Schedule-English-All.pdf, ml pro Gallone"
        }
      },
      "fade": {
        "name": "Athena Fade",
        "type": "flush",
        "note": "Optionaler Finisher, letzte 2 Wochen",
        "color": "#ef4444",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "Ersetzt Core in den letzten 2 Bluetewochen, in derselben Dosis wie Core (Konzentrat). Metrisches Schema: 51 ml pro 10 L bei EC 3,0 - auf die EC 2,0 dieses Plans umgerechnet rund 3,3 ml/L",
          "beleg": "athenaag.com/fade (\"Final 2 weeks replacing Core\"); Athena Pro Feed Schedules (Master), metrisch, \"Pro Program with Fade\" (abgerufen 24.9.2026)",
          "hinweis": "Bis 24.9.2026 lief Core in Woche 7-8 zusaetzlich weiter (0,79 bzw. 0,4) - eine Doppeldosierung. Core dort entfernt. Pro Bloom laeuft laut Schema weiter."
        }
      }
    },
    "dosis": {
      "wuchs": {
        "proCore": {
          "1": 0.55,
          "2": 0.55,
          "3": 0.55,
          "4": 0.55
        },
        "proGrow": {
          "1": 0.92,
          "2": 0.92,
          "3": 0.92,
          "4": 0.92
        },
        "camg": {
          "1": 0.65,
          "2": 0.65,
          "3": 0.65,
          "4": 0.65
        },
        "cleanse": {
          "1": 0.5,
          "2": 0.5,
          "3": 0.5,
          "4": 0.5
        }
      },
      "bluete": {
        "proCore": {
          "1": 0.79,
          "2": 0.79,
          "3": 0.79,
          "4": 0.79,
          "5": 0.79,
          "6": 0.79
        },
        "proBloom": {
          "1": 1.32,
          "2": 1.32,
          "3": 1.32,
          "4": 1.32,
          "5": 1.32,
          "6": 1.32,
          "7": 1.32,
          "8": 0.66
        },
        "camg": {
          "1": 0.65,
          "2": 0.65,
          "3": 0.65,
          "4": 0.65,
          "5": 0.65,
          "6": 0.65
        },
        "cleanse": {
          "1": 0.5,
          "2": 0.5,
          "3": 0.5,
          "4": 0.5,
          "5": 0.5,
          "6": 0.5,
          "7": 0.5,
          "8": 0.5
        },
        "pk": {
          "3": 1.1,
          "4": 1.3,
          "5": 2.4,
          "6": 2.6,
          "7": 3.2,
          "8": 2.6
        },
        "fade": {
          "7": 3.2,
          "8": 3.2
        }
      }
    },
    "ec": {
      "wuchs": {
        "1": 1.5,
        "2": 1.5,
        "3": 1.5,
        "4": 1.5
      },
      "bluete": {
        "1": 2,
        "2": 2,
        "3": 2,
        "4": 2,
        "5": 2,
        "6": 2,
        "7": 2,
        "8": 1
      }
    },
    "hinweis": {
      "wuchs": {},
      "bluete": {}
    },
    "addOrder": {
      "grow": [
        "cleanse",
        "camg",
        "proCore",
        "proGrow"
      ],
      "bloom": [
        "cleanse",
        "camg",
        "proCore",
        "proBloom",
        "pk",
        "fade"
      ]
    },
    "tips": [
      {
        "icon": "📋",
        "text": "Offizieller Athena Pro Feedchart (Normal/Metric): Vegetation 4 Wochen fix, danach Wk4-Rate halten. Blüte offiziell 8 Wochen + Flush."
      },
      {
        "icon": "🧪",
        "text": "Balance (pH-Up, Kaliumsilikat): kein festes ml-Schema — tropfenweise bis Ziel-pH 5.4–6.0 zugeben. Athena empfiehlt Balance als allerersten Schritt vor allen anderen Produkten."
      },
      {
        "icon": "🩵",
        "text": "Core: nie pur verwenden — immer zusammen mit Grow (Wuchs) oder Bloom (Blüte) dosieren."
      },
      {
        "icon": "💧",
        "text": "CaMg ist optional — vor allem bei RO-/Umkehrosmosewasser oder in anspruchsvollen Umgebungen sinnvoll."
      },
      {
        "icon": "🌸",
        "text": "PK erst ab Blüte Wk 3 zugeben, danach bis Wk 7 steigern."
      },
      {
        "icon": "🧊",
        "text": "Fade ersetzt/ergänzt Core in den letzten 2 Wochen laut Hersteller — optionaler Finisher, ca. 12 ml/gal (≈32 ml/10L)."
      },
      {
        "icon": "🍃",
        "text": "Stack ist ein reines Blattspray (kein Reservoir-Additiv!): 7 ml/gal (≈18 ml/10L), 2x wöchentlich, Veg ab Wk 2 bis Blüte Wk 3, Licht/Lüfter vorher aus."
      },
      {
        "icon": "💧",
        "text": "Cleanse: normal 5 ml/10L jede Bewässerung, in der finalen Flush-Woche auf 26 ml/10L erhöhen."
      },
      {
        "icon": "⚖️",
        "text": "Athena Pro ist ein Pulver: die Zahlen sind Gramm pro Liter, nicht Milliliter. Der Rechner beschriftet sie trotzdem als ml."
      }
    ],
    "quelle": "library"
  },
  "athenaBlended": {
    "name": "Athena Blended",
    "emoji": "🧊",
    "color": "#38bdf8",
    "ecRange": {
      "wuchs": [
        1,
        1.4
      ],
      "bluete": [
        1,
        2.6
      ]
    },
    "refillProduct": {
      "wuchs": "Athena Grow A+B",
      "bluete": "Athena Bloom A+B"
    },
    "produkte": {
      "growA": {
        "name": "Athena Grow A",
        "type": "base",
        "note": "Basis Grow A — 2-Teil-System",
        "color": "#00d4ff",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "6 ml/Gallone = 1,59 ml/L - Datensatz 1,6",
          "beleg": "Athena Feed Schedule (Normal), mightyhydro.com/Athena-Feed-Schedule-English-All.pdf, ml pro Gallone"
        }
      },
      "growB": {
        "name": "Athena Grow B",
        "type": "base",
        "note": "Basis Grow B — 2-Teil-System",
        "color": "#38bdf8",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "gleiche Menge wie A",
          "beleg": "Athena Feed Schedule (Normal), mightyhydro.com/Athena-Feed-Schedule-English-All.pdf, ml pro Gallone"
        }
      },
      "bloomA": {
        "name": "Athena Bloom A",
        "type": "base",
        "note": "Basis Bloom A — 2-Teil-System",
        "color": "#00d4ff",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "9 ml/Gallone = 2,38 ml/L - Datensatz 2,4",
          "beleg": "Athena Feed Schedule (Normal), mightyhydro.com/Athena-Feed-Schedule-English-All.pdf, ml pro Gallone"
        }
      },
      "bloomB": {
        "name": "Athena Bloom B",
        "type": "base",
        "note": "Basis Bloom B — 2-Teil-System",
        "color": "#38bdf8",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "gleiche Menge wie A",
          "beleg": "Athena Feed Schedule (Normal), mightyhydro.com/Athena-Feed-Schedule-English-All.pdf, ml pro Gallone"
        }
      },
      "camg": {
        "name": "Athena CaMg",
        "type": "calmag",
        "note": "Calcium-Magnesium-Supplement",
        "color": "#fbbf24",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "2-3 ml/Gallone = 0,53-0,79 ml/L",
          "beleg": "Athena Feed Schedule (Normal), Athena-Feed-Schedule-English-All.pdf, ml pro Gallone"
        }
      },
      "cleanse": {
        "name": "Athena Cleanse",
        "type": "enzyme",
        "note": "Reservoir-/Wurzelpflege, ganzer Run",
        "color": "#a78bfa",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "2 ml/Gallone = 0,53 ml/L bei jeder Bewaesserung, 10 ml/gal = 2,64 ml/L im Flush",
          "beleg": "Athena Feed Schedule (Normal), Athena-Feed-Schedule-English-All.pdf, ml pro Gallone"
        }
      },
      "pk": {
        "name": "Athena PK",
        "type": "pk",
        "note": "Phosphor-Kalium Bloom-Booster, ab Wk 3",
        "color": "#f97316",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "Normal-Chart: 4/5/9/10/12/10 ml/Gallone in Bluetewoche 3-8 = 1,06 bis 3,17 ml/L",
          "beleg": "Athena Feed Schedule (Normal), Athena-Feed-Schedule-English-All.pdf, ml pro Gallone"
        }
      },
      "fade": {
        "name": "Athena Fade",
        "type": "flush",
        "note": "Finisher, letzte 2 Wochen (optional)",
        "color": "#ef4444",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "32 ml pro 10 L (3,2 ml/L) in den letzten 2 Bluetewochen; Bloom A/B entfallen dann",
          "beleg": "Athena Blended Feed Schedule (Metric), \"Blended Program with Fade\", support.athenaag.com (abgerufen 24.9.2026)",
          "hinweis": "Bloom A/B liefen in Woche 7-8 bis 24.9.2026 zusaetzlich weiter (1,1 bzw. 0,8 ml/L) - im Herstellerschema entfallen sie, sobald Fade kommt. Entfernt."
        }
      }
    },
    "dosis": {
      "wuchs": {
        "growA": {
          "1": 1.6,
          "2": 1.6,
          "3": 1.6,
          "4": 1.6
        },
        "growB": {
          "1": 1.6,
          "2": 1.6,
          "3": 1.6,
          "4": 1.6
        },
        "camg": {
          "1": 0.65,
          "2": 0.65,
          "3": 0.65,
          "4": 0.65
        },
        "cleanse": {
          "1": 0.5,
          "2": 0.5,
          "3": 0.5,
          "4": 0.5
        }
      },
      "bluete": {
        "bloomA": {
          "1": 2.4,
          "2": 2.4,
          "3": 2.4,
          "4": 2.4,
          "5": 2.4,
          "6": 2.1
        },
        "bloomB": {
          "1": 2.4,
          "2": 2.4,
          "3": 2.4,
          "4": 2.4,
          "5": 2.4,
          "6": 2.1
        },
        "camg": {
          "1": 0.65,
          "2": 0.65,
          "3": 0.65,
          "4": 0.65,
          "5": 0.65,
          "6": 0.65
        },
        "cleanse": {
          "1": 0.5,
          "2": 0.5,
          "3": 0.5,
          "4": 0.5,
          "5": 0.5,
          "6": 0.5,
          "7": 0.5,
          "8": 0.5
        },
        "pk": {
          "3": 1.1,
          "4": 1.3,
          "5": 2.4,
          "6": 2.6,
          "7": 3.2,
          "8": 2.6
        },
        "fade": {
          "7": 3.2,
          "8": 3.2
        }
      }
    },
    "ec": {
      "wuchs": {
        "1": 1.2,
        "2": 1.2,
        "3": 1.2,
        "4": 1.2
      },
      "bluete": {
        "1": 1.8,
        "2": 1.8,
        "3": 2,
        "4": 2.1,
        "5": 2.2,
        "6": 2.1,
        "7": 1.5,
        "8": 1
      }
    },
    "hinweis": {
      "wuchs": {},
      "bluete": {}
    },
    "addOrder": {
      "grow": [
        "cleanse",
        "camg",
        "growA",
        "growB"
      ],
      "bloom": [
        "cleanse",
        "camg",
        "bloomA",
        "bloomB",
        "pk",
        "fade"
      ]
    },
    "tips": [
      {
        "icon": "📋",
        "text": "Offizieller Athena Blended Feedchart (Normal/Metric): Vegetation 4 Wochen fix, danach Wk4-Rate halten. Blüte offiziell 8 Wochen + Flush."
      },
      {
        "icon": "🧪",
        "text": "Balance (pH-Up): kein festes ml-Schema — tropfenweise bis Ziel-pH 5.4–6.0 zugeben. Athena empfiehlt Balance als allerersten Schritt vor allen anderen Produkten."
      },
      {
        "icon": "🌸",
        "text": "PK erst ab Blüte Wk 3 zugeben, danach bis Wk 7 steigern, Wk 8 leicht reduzieren."
      },
      {
        "icon": "🧊",
        "text": "Fade ist im offiziellen Blended-Feedchart nicht enthalten — optionaler Finisher für die letzten 2 Wochen, ca. 12 ml/gal (≈32 ml/10L), ersetzt keine andere Dosierung."
      },
      {
        "icon": "🧼",
        "text": "IPW (Integrated Plant Wash): reines Blattspray zur Schädlingsbekämpfung/Blattreinigung — NICHT ins Reservoir geben! Vorbeugend 60-90 ml/gal, bei Befall 90-120 ml/gal."
      },
      {
        "icon": "💧",
        "text": "Cleanse: normal 5 ml/10L jede Bewässerung, in der finalen Flush-Woche auf 26 ml/10L erhöhen."
      },
      {
        "icon": "✅",
        "text": "Gegen den offiziellen Athena Feed Schedule geprueft (17.9.2026) - Grow 1,59 und Bloom 2,38 ml/L stimmen auf die Stelle."
      }
    ],
    "quelle": "library"
  },
  "remo": {
    "name": "Remo Nutrients",
    "emoji": "🟠",
    "color": "#e3892a",
    "ecRange": null,
    "refillProduct": {
      "wuchs": "Remo Grow",
      "bluete": "Remo Bloom"
    },
    "produkte": {
      "rGrow": {
        "name": "Remo Grow",
        "type": "base",
        "note": "Basis Grow",
        "color": "#38bdf8",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "5/6/7/8 ml pro Gallone in Wuchswoche 1-4 (1,32-2,11 ml/L)",
          "beleg": "Remo Nutrients Feed Chart (Ausdruck des Remo-Rechners, hydrotekhydroponics.com/media/feed-charts/remo/remo-nutrients-feed-charts.pdf), ml pro US-Gallone - die Einheit bestaetigen Remos Produktangaben (VeloKelp 5-10 ml pro Gallone, AstroFlower 210 ml/100 L); umgerechnet mit 3,785 (abgerufen 24.9.2026)",
          "hinweis": "Angeglichen am 24.9.2026, vorher: wuchs {\"1\":0.8,\"2\":1,\"3\":1.2,\"4\":1.2,\"5\":1.2,\"6\":1.2,\"7\":1.2,\"8\":1.2}.",
          "hoechstwert": 2.11
        }
      },
      "rMicro": {
        "name": "Remo Micro",
        "type": "base",
        "note": "Mikronährstoffe — immer zuerst!",
        "color": "#00d4ff",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "5/6/7/8 ml pro Gallone in Wuchswoche 1-4, 8 ml in Bluetewoche 1-4, 10 ml in Woche 5-7 - gleiche Menge wie Grow bzw. Bloom",
          "beleg": "Remo Nutrients Feed Chart (Ausdruck des Remo-Rechners, hydrotekhydroponics.com/media/feed-charts/remo/remo-nutrients-feed-charts.pdf), ml pro US-Gallone - die Einheit bestaetigen Remos Produktangaben (VeloKelp 5-10 ml pro Gallone, AstroFlower 210 ml/100 L); umgerechnet mit 3,785 (abgerufen 24.9.2026)",
          "hinweis": "Angeglichen am 24.9.2026, vorher: wuchs {\"1\":0.4,\"2\":0.5,\"3\":0.6,\"4\":0.6,\"5\":0.6,\"6\":0.6,\"7\":0.6,\"8\":0.6}, bluete {\"1\":0.5,\"2\":0.5,\"3\":0.5,\"4\":0.5,\"5\":0.4,\"6\":0.4}.",
          "hoechstwert": 2.64
        }
      },
      "rBloom": {
        "name": "Remo Bloom",
        "type": "base",
        "note": "Basis Bloom",
        "color": "#38bdf8",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "8 ml pro Gallone in Bluetewoche 1-4, 10 ml in Woche 5-7 (2,11 bzw. 2,64 ml/L)",
          "beleg": "Remo Nutrients Feed Chart (Ausdruck des Remo-Rechners, hydrotekhydroponics.com/media/feed-charts/remo/remo-nutrients-feed-charts.pdf), ml pro US-Gallone - die Einheit bestaetigen Remos Produktangaben (VeloKelp 5-10 ml pro Gallone, AstroFlower 210 ml/100 L); umgerechnet mit 3,785 (abgerufen 24.9.2026)",
          "hinweis": "Angeglichen am 24.9.2026, vorher: bluete {\"1\":1,\"2\":1,\"3\":1,\"4\":1,\"5\":1,\"6\":0.8}.",
          "hoechstwert": 2.64
        }
      },
      "veloKelp": {
        "name": "VeloKelp",
        "type": "vitamin",
        "note": "Kelp-Extrakt — Wachstum + Immunsystem",
        "color": "#00ff88",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "wie Micro: Wuchs 5-8, Bluete 8-10 ml pro Gallone",
          "beleg": "Remo Nutrients Feed Chart (Ausdruck des Remo-Rechners, hydrotekhydroponics.com/media/feed-charts/remo/remo-nutrients-feed-charts.pdf), ml pro US-Gallone - die Einheit bestaetigen Remos Produktangaben (VeloKelp 5-10 ml pro Gallone, AstroFlower 210 ml/100 L); umgerechnet mit 3,785 (abgerufen 24.9.2026)",
          "hinweis": "Angeglichen am 24.9.2026, vorher: wuchs {\"1\":0.1,\"2\":0.1}.",
          "hoechstwert": 2.64
        }
      },
      "magnifical": {
        "name": "Magnifical",
        "type": "calmag",
        "note": "Ca/Mg + Fe Supplement",
        "color": "#fbbf24",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "Herstellerangabe: nach Wasserhaerte bzw. Mangelbild dosieren, kein fester Wochenwert",
          "beleg": "Produktangaben des jeweiligen Herstellers",
          "hinweis": "CalMag ist wasserabhaengig: bei Umkehrosmose- oder sehr weichem Wasser noetig, bei hartem Leitungswasser oft gar nicht. Ein Fixwert waere hier falsche Genauigkeit."
        }
      },
      "candy": {
        "name": "Nature's Candy",
        "type": "carbs",
        "note": "Kohlenhydrate + Terpene, nur Blüte",
        "color": "#a78bfa",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "8 ml pro Gallone in Bluetewoche 1-4, 10 ml in Woche 5-7; nicht in der Wuchsphase",
          "beleg": "Remo Nutrients Feed Chart (Ausdruck des Remo-Rechners, hydrotekhydroponics.com/media/feed-charts/remo/remo-nutrients-feed-charts.pdf), ml pro US-Gallone - die Einheit bestaetigen Remos Produktangaben (VeloKelp 5-10 ml pro Gallone, AstroFlower 210 ml/100 L); umgerechnet mit 3,785 (abgerufen 24.9.2026)",
          "hinweis": "Achtung: Kohlenhydrate im 7-10 Tage stehenden Reservoir fuettern auch Mikroben - ORP und Wurzeln im Blick behalten. Angeglichen am 24.9.2026, vorher: bluete {\"1\":0.1,\"2\":0.1,\"3\":0.1,\"4\":0.1,\"5\":0.1}.",
          "hoechstwert": 2.64
        }
      },
      "astro": {
        "name": "AstroFlower",
        "type": "bloom",
        "note": "Bloom-Booster, Bloom Wk 1–5",
        "color": "#f472b6",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "8 ml pro Gallone in Bluetewoche 1-4, 10 ml in Woche 5-7",
          "beleg": "Remo Nutrients Feed Chart (Ausdruck des Remo-Rechners, hydrotekhydroponics.com/media/feed-charts/remo/remo-nutrients-feed-charts.pdf), ml pro US-Gallone - die Einheit bestaetigen Remos Produktangaben (VeloKelp 5-10 ml pro Gallone, AstroFlower 210 ml/100 L); umgerechnet mit 3,785 (abgerufen 24.9.2026)",
          "hinweis": "Angeglichen am 24.9.2026, vorher: bluete {\"1\":0.2,\"2\":0.2,\"3\":0.2,\"4\":0.2}.",
          "hoechstwert": 2.64
        }
      }
    },
    "dosis": {
      "wuchs": {
        "rMicro": {
          "1": 1.32,
          "2": 1.59,
          "3": 1.85,
          "4": 2.11
        },
        "rGrow": {
          "1": 1.32,
          "2": 1.59,
          "3": 1.85,
          "4": 2.11
        },
        "magnifical": {
          "1": 0.2,
          "2": 0.2,
          "3": 0.2,
          "4": 0.2
        },
        "veloKelp": {
          "1": 1.32,
          "2": 1.59,
          "3": 1.85,
          "4": 2.11
        }
      },
      "bluete": {
        "rMicro": {
          "1": 2.11,
          "2": 2.11,
          "3": 2.11,
          "4": 2.11,
          "5": 2.64,
          "6": 2.64,
          "7": 2.64
        },
        "rBloom": {
          "1": 2.11,
          "2": 2.11,
          "3": 2.11,
          "4": 2.11,
          "5": 2.64,
          "6": 2.64,
          "7": 2.64
        },
        "magnifical": {
          "1": 0.2
        },
        "veloKelp": {
          "1": 2.11,
          "2": 2.11,
          "3": 2.11,
          "4": 2.11,
          "5": 2.64,
          "6": 2.64,
          "7": 2.64
        },
        "astro": {
          "1": 2.11,
          "2": 2.11,
          "3": 2.11,
          "4": 2.11,
          "5": 2.64,
          "6": 2.64,
          "7": 2.64
        },
        "candy": {
          "1": 2.11,
          "2": 2.11,
          "3": 2.11,
          "4": 2.11,
          "5": 2.64,
          "6": 2.64,
          "7": 2.64
        }
      }
    },
    "ec": {
      "wuchs": {},
      "bluete": {}
    },
    "hinweis": {
      "wuchs": {},
      "bluete": {}
    },
    "addOrder": {
      "grow": [
        "rMicro",
        "rGrow",
        "magnifical",
        "veloKelp"
      ],
      "bloom": [
        "rMicro",
        "rBloom",
        "magnifical",
        "veloKelp",
        "astro",
        "candy"
      ]
    },
    "tips": [
      {
        "icon": "📐",
        "text": "Seit 24.9.2026 nach dem Remo-Schema: 4 Wuchs-, 7 Blütewochen, Woche 8 nur Wasser; Micro, Grow bzw. Bloom in gleichen Teilen. Remo nennt keinen EC-Zielwert. Vorher lagen die Mengen bei rund einem Zehntel. Bei laufendem Grow nicht auf einen Schlag umstellen: EC in Schritten von höchstens 0,2 pro Wasserwechsel anheben. Nature's Candy belastet das stehende Reservoir: ORP und Wurzeln beobachten."
      },
      {
        "icon": "🟠",
        "text": "Remo Micro: immer als erster Nährstoff ins Wasser — Reaktionen vermeiden"
      },
      {
        "icon": "🍊",
        "text": "Remo: kanadische Craft-Linie — sehr beliebt für terpenreiche Blüten"
      },
      {
        "icon": "🍯",
        "text": "Honey Chrome: Finisher für mehr Harzproduktion in den letzten 2 Wochen"
      }
    ],
    "quelle": "library",
    "wochen": {
      "bluete": {
        "naehrstoff": 7,
        "gesamt": 8,
        "spuelen": "Woche 8 laut Remo nur Wasser"
      }
    },
    "planHinweis": "Seit 24.9.2026 nach dem Remo-Schema: 4 Wuchs-, 7 Blütewochen, Woche 8 nur Wasser; Micro, Grow bzw. Bloom in gleichen Teilen. Remo nennt keinen EC-Zielwert. Vorher lagen die Mengen bei rund einem Zehntel. Bei laufendem Grow nicht auf einen Schlag umstellen: EC in Schritten von höchstens 0,2 pro Wasserwechsel anheben. Nature's Candy belastet das stehende Reservoir: ORP und Wurzeln beobachten."
  },
  "cyco": {
    "name": "Cyco Nutrients",
    "emoji": "🟣",
    "color": "#bc8cff",
    "ecRange": {
      "wuchs": [
        1.2,
        1.4
      ],
      "bluete": [
        1.4,
        1.8
      ]
    },
    "refillProduct": {
      "wuchs": "Cyco Grow A+B",
      "bluete": "Cyco Bloom A+B"
    },
    "produkte": {
      "cycoGrowA": {
        "name": "Cyco Grow A",
        "type": "base",
        "note": "Basis Grow A",
        "color": "#00d4ff",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "1,5 ml/L in Wuchswoche 1-2, danach 2,5 ml/L",
          "beleg": "Cyco Advanced Deep Water Culture Feed Chart, cycoflower.com/feedcharts/metric/metric-dwc-feedchart.pdf, ml pro Liter, gerechnet fuer Osmosewasser (abgerufen 24.9.2026)",
          "hinweis": "Angeglichen am 24.9.2026, vorher: wuchs {\"1\":0.5,\"2\":0.8,\"3\":1,\"4\":1,\"5\":1,\"6\":1,\"7\":1,\"8\":1}.",
          "hoechstwert": 2.5
        }
      },
      "cycoGrowB": {
        "name": "Cyco Grow B",
        "type": "base",
        "note": "Basis Grow B",
        "color": "#38bdf8",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "gleiche Menge wie A",
          "beleg": "Cyco Advanced Deep Water Culture Feed Chart, cycoflower.com/feedcharts/metric/metric-dwc-feedchart.pdf, ml pro Liter, gerechnet fuer Osmosewasser (abgerufen 24.9.2026)",
          "hinweis": "Angeglichen am 24.9.2026, vorher: wuchs {\"1\":0.5,\"2\":0.8,\"3\":1,\"4\":1,\"5\":1,\"6\":1,\"7\":1,\"8\":1}.",
          "hoechstwert": 2.5
        }
      },
      "cycoBloomA": {
        "name": "Cyco Bloom A",
        "type": "base",
        "note": "Basis Bloom A",
        "color": "#00d4ff",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "2,5 ml/L in Bluetewoche 1-8",
          "beleg": "Cyco Advanced Deep Water Culture Feed Chart, cycoflower.com/feedcharts/metric/metric-dwc-feedchart.pdf, ml pro Liter, gerechnet fuer Osmosewasser (abgerufen 24.9.2026)",
          "hinweis": "Angeglichen am 24.9.2026, vorher: bluete {\"1\":0.8,\"2\":0.8,\"3\":0.8,\"4\":0.8,\"5\":0.8,\"6\":0.6}.",
          "hoechstwert": 2.5
        }
      },
      "cycoBloomB": {
        "name": "Cyco Bloom B",
        "type": "base",
        "note": "Basis Bloom B",
        "color": "#38bdf8",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "gleiche Menge wie A",
          "beleg": "Cyco Advanced Deep Water Culture Feed Chart, cycoflower.com/feedcharts/metric/metric-dwc-feedchart.pdf, ml pro Liter, gerechnet fuer Osmosewasser (abgerufen 24.9.2026)",
          "hinweis": "Angeglichen am 24.9.2026, vorher: bluete {\"1\":0.8,\"2\":0.8,\"3\":0.8,\"4\":0.8,\"5\":0.8,\"6\":0.6}.",
          "hoechstwert": 2.5
        }
      },
      "uptake": {
        "name": "Uptake",
        "type": "silica",
        "note": "Aufnahmehilfe für Mikronährstoffe – nicht im DWC-Schema von Cyco",
        "color": "#8b949e",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "ungeeignet",
          "herstellerAngabe": "Im DWC-Schema von Cyco nicht enthalten. Uptake ist kein Silikat, sondern soll die Aufnahme von Mikronaehrstoffen verbessern",
          "beleg": "Cyco Advanced Deep Water Culture Feed Chart, cycoflower.com/feedcharts/metric/metric-dwc-feedchart.pdf, ml pro Liter, gerechnet fuer Osmosewasser (abgerufen 24.9.2026); cycoflower.com/cyco-uptake/",
          "hinweis": "Stand hier als Silikat (vorher: wuchs {\"1\":0.05,\"2\":0.05,\"3\":0.05,\"4\":0.05}, bluete {\"1\":0.05,\"2\":0.05}). Das Silikat im Schema ist ein eigenes Produkt (Cyco Silica), jetzt neu aufgenommen. Uptake sieht das DWC-Schema nicht vor; Dosierung entfernt. Cyco schliesst DWC damit nicht ausdruecklich aus."
        }
      },
      "b1Boost": {
        "name": "B1 Boost",
        "type": "vitamin",
        "note": "Thiamin B1 — Stressvorbeugung",
        "color": "#a78bfa",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "1 ml/L in jeder Woche, Wuchs wie Bluete",
          "beleg": "Cyco Advanced Deep Water Culture Feed Chart, cycoflower.com/feedcharts/metric/metric-dwc-feedchart.pdf, ml pro Liter, gerechnet fuer Osmosewasser (abgerufen 24.9.2026)",
          "hinweis": "Angeglichen am 24.9.2026, vorher: wuchs {\"1\":0.1,\"2\":0.1,\"3\":0.1}, bluete {\"1\":0.1}.",
          "hoechstwert": 1
        }
      },
      "potash": {
        "name": "Potash Plus",
        "type": "pk",
        "note": "PK-Booster, Bloom Wk 3–6",
        "color": "#f97316",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "1 ml/L in Bluetewoche 1-2, 2 ml/L in Woche 3-4",
          "beleg": "Cyco Advanced Deep Water Culture Feed Chart, cycoflower.com/feedcharts/metric/metric-dwc-feedchart.pdf, ml pro Liter, gerechnet fuer Osmosewasser (abgerufen 24.9.2026)",
          "hinweis": "Angeglichen am 24.9.2026, vorher: bluete {\"3\":0.2,\"4\":0.2,\"5\":0.2}.",
          "hoechstwert": 2
        }
      },
      "xl": {
        "name": "XL",
        "type": "bloom",
        "note": "Wachstumsstimulator – nicht im DWC-Schema von Cyco",
        "color": "#f472b6",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "ungeeignet",
          "herstellerAngabe": "Im offiziellen Cyco-DWC-Schema nicht enthalten. Erd-Schema: nur Wuchswoche 3 mit 0,5 ml/L, mit dem Hinweis \"will significantly increase PPM and lower pH\"",
          "beleg": "cycoflower.com/feedcharts/metric/metric-dwc-feedchart.pdf und metric-soil-feedchart.pdf (abgerufen 24.9.2026)",
          "hinweis": "Stand hier in Bluetewoche 2-4 mit 0,2 ml/L - falsche Phase und in keinem DWC-Schema des Herstellers. Dosierung entfernt. Cyco schliesst DWC nicht ausdruecklich aus, sieht XL dort aber nicht vor."
        }
      },
      "supaStiky": {
        "name": "Supa Stiky",
        "type": "bloom",
        "note": "Harz-Finisher, Bloom Wk 5–6",
        "color": "#bc8cff",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "0,5 ml/L in Bluetewoche 5-8",
          "beleg": "Cyco Advanced Deep Water Culture Feed Chart, cycoflower.com/feedcharts/metric/metric-dwc-feedchart.pdf, ml pro Liter, gerechnet fuer Osmosewasser (abgerufen 24.9.2026)",
          "hinweis": "Angeglichen am 24.9.2026, vorher: bluete {\"5\":0.2,\"6\":0.2}.",
          "hoechstwert": 0.5
        }
      },
      "ryzofuel": {
        "name": "Ryzofuel",
        "type": "root",
        "note": "Kelp-Wurzelstimulator, ganzer Run",
        "color": "#a78bfa",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "0,5 ml/L in Wuchswoche 1-6; in der Bluete sieht das DWC-Schema es nicht vor",
          "beleg": "Cyco Advanced Deep Water Culture Feed Chart, cycoflower.com/feedcharts/metric/metric-dwc-feedchart.pdf, ml pro Liter, gerechnet fuer Osmosewasser (abgerufen 24.9.2026)",
          "hinweis": "Angeglichen am 24.9.2026, vorher: wuchs {\"1\":0.5,\"2\":0.5,\"3\":0.5,\"4\":0.5,\"5\":0.5,\"6\":0.5,\"7\":0.5,\"8\":0.5}, bluete {\"1\":0.5,\"2\":0.5,\"3\":0.5,\"4\":0.5}.",
          "hoechstwert": 0.5
        }
      },
      "cycoZyme": {
        "name": "Cyco Zyme",
        "type": "enzyme",
        "note": "Enzymkomplex, ganzer Run",
        "color": "#fbbf24",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "1 ml/L in Wuchswoche 1-6; in der Bluete sieht das DWC-Schema es nicht vor",
          "beleg": "Cyco Advanced Deep Water Culture Feed Chart, cycoflower.com/feedcharts/metric/metric-dwc-feedchart.pdf, ml pro Liter, gerechnet fuer Osmosewasser (abgerufen 24.9.2026)",
          "hinweis": "Angeglichen am 24.9.2026, vorher: wuchs {\"1\":1,\"2\":1,\"3\":1,\"4\":1,\"5\":1,\"6\":1,\"7\":1,\"8\":1}, bluete {\"1\":1,\"2\":1,\"3\":1,\"4\":1,\"5\":1,\"6\":1}.",
          "hoechstwert": 1
        }
      },
      "swell": {
        "name": "Swell",
        "type": "pk",
        "note": "P/K/Mg Bulking-Additiv, späte Blüte Wk 4–6",
        "color": "#00ff88",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "2 ml/L in Bluetewoche 5-8",
          "beleg": "Cyco Advanced Deep Water Culture Feed Chart, cycoflower.com/feedcharts/metric/metric-dwc-feedchart.pdf, ml pro Liter, gerechnet fuer Osmosewasser (abgerufen 24.9.2026)",
          "hinweis": "Stand vorher mit 2,5 ml/L ueber dem Herstellerwert und eine Woche zu frueh. Angeglichen am 24.9.2026, vorher: bluete {\"4\":2.5,\"5\":2.5,\"6\":2.5}.",
          "hoechstwert": 2
        }
      },
      "sugaRush": {
        "name": "Suga Rush",
        "type": "bloom",
        "note": "Flavor-Finisher, Bloom Wk 5–6",
        "color": "#ef4444",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "1 ml/L in Bluetewoche 1-8",
          "beleg": "Cyco Advanced Deep Water Culture Feed Chart, cycoflower.com/feedcharts/metric/metric-dwc-feedchart.pdf, ml pro Liter, gerechnet fuer Osmosewasser (abgerufen 24.9.2026)",
          "hinweis": "Angeglichen am 24.9.2026, vorher: bluete {\"5\":1,\"6\":1}.",
          "hoechstwert": 1
        }
      },
      "drRepair": {
        "name": "Dr Repair",
        "type": "vitamin",
        "note": "Eisenmangel-Korrektur — nur bei Bedarf, kein Wochenprodukt",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "1 ml/L in jeder Woche",
          "beleg": "Cyco Advanced Deep Water Culture Feed Chart, cycoflower.com/feedcharts/metric/metric-dwc-feedchart.pdf, ml pro Liter, gerechnet fuer Osmosewasser (abgerufen 24.9.2026)",
          "hinweis": "Angeglichen am 24.9.2026, vorher: ohne Dosis.",
          "hoechstwert": 1
        }
      },
      "kleanse": {
        "name": "Kleanse",
        "type": "flush",
        "note": "Zum Spülen – laut Schema zwischen den Wasserwechseln und vor der Ernte",
        "quelle": {
          "geprueft": "2026-09-17",
          "status": "belegt",
          "herstellerAngabe": "im DWC-Chart als woechentlicher Flush ohne ml-Angabe gefuehrt",
          "beleg": "Cyco DWC Feed Chart",
          "hinweis": "Der Hersteller nennt fuer Kleanse im DWC-Chart keine Menge, nur \"FLUSH WITH KLEANSE\" in jeder Woche."
        }
      },
      "silica": {
        "name": "Silica",
        "type": "silica",
        "note": "Kaliumsilikat, Blütewoche 5-8 – zuerst ins Wasser, pH danach",
        "color": "#8b949e",
        "quelle": {
          "geprueft": "2026-09-24",
          "status": "belegt",
          "herstellerAngabe": "1 ml/L in Bluetewoche 5-8",
          "beleg": "Cyco Advanced Deep Water Culture Feed Chart, cycoflower.com/feedcharts/metric/metric-dwc-feedchart.pdf, ml pro Liter, gerechnet fuer Osmosewasser (abgerufen 24.9.2026)",
          "hinweis": "Neu aufgenommen: das Schema fuehrt Silica, im Datensatz stand an dessen Stelle faelschlich Uptake. Angeglichen am 24.9.2026, vorher: nicht im Datensatz.",
          "hoechstwert": 1
        }
      }
    },
    "dosis": {
      "wuchs": {
        "cycoGrowA": {
          "1": 1.5,
          "2": 1.5,
          "3": 2.5,
          "4": 2.5,
          "5": 2.5,
          "6": 2.5
        },
        "cycoGrowB": {
          "1": 1.5,
          "2": 1.5,
          "3": 2.5,
          "4": 2.5,
          "5": 2.5,
          "6": 2.5
        },
        "b1Boost": {
          "1": 1,
          "2": 1,
          "3": 1,
          "4": 1,
          "5": 1,
          "6": 1
        },
        "ryzofuel": {
          "1": 0.5,
          "2": 0.5,
          "3": 0.5,
          "4": 0.5,
          "5": 0.5,
          "6": 0.5
        },
        "cycoZyme": {
          "1": 1,
          "2": 1,
          "3": 1,
          "4": 1,
          "5": 1,
          "6": 1
        },
        "drRepair": {
          "1": 1,
          "2": 1,
          "3": 1,
          "4": 1,
          "5": 1,
          "6": 1
        }
      },
      "bluete": {
        "silica": {
          "5": 1,
          "6": 1,
          "7": 1,
          "8": 1
        },
        "cycoBloomA": {
          "1": 2.5,
          "2": 2.5,
          "3": 2.5,
          "4": 2.5,
          "5": 2.5,
          "6": 2.5,
          "7": 2.5,
          "8": 2.5
        },
        "cycoBloomB": {
          "1": 2.5,
          "2": 2.5,
          "3": 2.5,
          "4": 2.5,
          "5": 2.5,
          "6": 2.5,
          "7": 2.5,
          "8": 2.5
        },
        "b1Boost": {
          "1": 1,
          "2": 1,
          "3": 1,
          "4": 1,
          "5": 1,
          "6": 1,
          "7": 1,
          "8": 1
        },
        "potash": {
          "1": 1,
          "2": 1,
          "3": 2,
          "4": 2
        },
        "swell": {
          "5": 2,
          "6": 2,
          "7": 2,
          "8": 2
        },
        "sugaRush": {
          "1": 1,
          "2": 1,
          "3": 1,
          "4": 1,
          "5": 1,
          "6": 1,
          "7": 1,
          "8": 1
        },
        "supaStiky": {
          "5": 0.5,
          "6": 0.5,
          "7": 0.5,
          "8": 0.5
        },
        "drRepair": {
          "1": 1,
          "2": 1,
          "3": 1,
          "4": 1,
          "5": 1,
          "6": 1,
          "7": 1,
          "8": 1
        }
      }
    },
    "ec": {
      "wuchs": {
        "1": 1.2,
        "2": 1.2,
        "3": 1.4,
        "4": 1.4,
        "5": 1.4,
        "6": 1.4
      },
      "bluete": {
        "1": 1.4,
        "2": 1.4,
        "3": 1.4,
        "4": 1.4,
        "5": 1.8,
        "6": 1.8,
        "7": 1.8,
        "8": 1.8
      }
    },
    "hinweis": {
      "wuchs": {},
      "bluete": {}
    },
    "addOrder": {
      "grow": [
        "cycoGrowA",
        "cycoGrowB",
        "b1Boost",
        "ryzofuel",
        "cycoZyme",
        "drRepair"
      ],
      "bloom": [
        "silica",
        "cycoBloomA",
        "cycoBloomB",
        "b1Boost",
        "potash",
        "swell",
        "sugaRush",
        "supaStiky",
        "drRepair"
      ]
    },
    "tips": [
      {
        "icon": "📐",
        "text": "Seit 24.9.2026 nach dem offiziellen DWC-Schema von Cyco: 6 Wuchs-, 8 Blütewochen, gerechnet für Osmosewasser. Vorher lagen die Basismengen bei rund einem Drittel. Bei laufendem Grow nicht auf einen Schlag umstellen: EC in Schritten von höchstens 0,2 pro Wasserwechsel anheben."
      },
      {
        "icon": "🟣",
        "text": "Cyco: australische Premium-Linie — bekannt für sehr saubere Formeln"
      },
      {
        "icon": "🪨",
        "text": "Uptake (Silica): immer vor Basis A+B — stabilisiert pH-Wert"
      },
      {
        "icon": "📋",
        "text": "Ryzofuel, Cyco Zyme, Swell, Suga Rush neu ergänzt — echte, aktuelle Cyco-Produkte, vorher hier gefehlt."
      },
      {
        "icon": "🩹",
        "text": "Dr Repair: nur bei sichtbarem Eisenmangel (Chlorose) zugeben, 5 ml/L — kein Standard-Wochenprodukt."
      },
      {
        "icon": "🧽",
        "text": "Kleanse: wöchentliches Wurzel-/Salz-Flush-Additiv, Hersteller veröffentlicht keine feste ml-Dosis auf der Produktseite."
      },
      {
        "icon": "💊",
        "text": "B1 Boost: besonders wichtig bei Stressperioden (Training, Transplant)"
      },
      {
        "icon": "🌊",
        "text": "Cyco hat einen eigenen DWC-Feedchart (metric-dwc-feedchart.pdf) - genau fuer dieses System. Er liegt bei Basis und B1 Boost deutlich ueber den Werten hier."
      }
    ],
    "quelle": "library",
    "wochen": {
      "bluete": {
        "naehrstoff": 8,
        "gesamt": 9,
        "spuelen": "mit Kleanse, Dauer laut Cyco nicht festgelegt"
      }
    },
    "planHinweis": "Seit 24.9.2026 nach dem offiziellen DWC-Schema von Cyco: 6 Wuchs-, 8 Blütewochen, gerechnet für Osmosewasser. Vorher lagen die Basismengen bei rund einem Drittel. Bei laufendem Grow nicht auf einen Schlag umstellen: EC in Schritten von höchstens 0,2 pro Wasserwechsel anheben."
  }
};

// ── Adapter: aus dem kanonischen Datensatz die zwei bisherigen Formen ───────
function alsDashboard(MARKEN) {
  const raus = {};
  for (const [k, m] of Object.entries(MARKEN)) {
    const e = { name: m.name, ecRange: m.ecRange, refillProduct: m.refillProduct,
                bluetePlan: (m.wochen && m.wochen.bluete) || null, planHinweis: m.planHinweis || '' };
    for (const ph of ['wuchs', 'bluete']) {
      const liste = [];
      const wochen = Object.values(m.dosis[ph] || {}).flatMap(o => Object.keys(o).map(Number));
      // Spuelwochen zaehlen mit: sonst gilt die letzte Naehrstoffwoche als
      // Phasenende, und das Dashboard dosiert sie in der Spuelwoche weiter
      // (es haelt bei fehlender Woche den letzten Wert).
      if (ph === 'bluete' && e.bluetePlan) wochen.push(e.bluetePlan.gesamt);
      const maxPhase = wochen.length ? Math.max(...wochen) : 0;
      const reihenfolge = (m.addOrder && m.addOrder[ph === 'wuchs' ? 'grow' : 'bloom']) || Object.keys(m.produkte);
      const keys = [...new Set([...reihenfolge, ...Object.keys(m.dosis[ph] || {})])];
      for (const pk of keys) {
        const pr = m.produkte[pk]; if (!pr) continue;
        if (pr.drops) { liste.push({ name: pr.name, drops: true, dropsPerL: pr.dropsPerL, color: pr.color }); continue; }
        const d = (m.dosis[ph] || {})[pk]; if (!d || !Object.keys(d).length) continue;
        const wk = Object.keys(d).map(Number).sort((a, b) => a - b);
        const werte = wk.map(w => d[w]);
        const gleich = werte.every(v => v === werte[0]);
        const eintrag = { name: pr.name, color: pr.color };
        if (pr.einheit) eintrag.unit = pr.einheit;
        // ⚠️ Das Dashboard liest bei fehlender Woche den letzten Wert darunter
        // weiter. Endet ein Produkt frueher, MUSS weekMax gesetzt sein - sonst
        // dosiert der Adapter es stillschweigend bis zum Phasenende weiter.
        if (wk[wk.length - 1] < maxPhase) eintrag.weekMax = wk[wk.length - 1];
        if (wk[0] > 1) eintrag.weekMin = wk[0];
        if (gleich) eintrag.mlL = werte[0];
        else { eintrag.weekMap = {}; for (const w of wk) eintrag.weekMap[w] = d[w]; }
        liste.push(eintrag);
      }
      e[ph] = liste;
    }
    raus[k] = e;
  }
  return raus;
}

function alsLibrary(MARKEN) {
  const raus = {};
  for (const [k, m] of Object.entries(MARKEN)) {
    const produkte = {};
    for (const [pk, pv] of Object.entries(m.produkte)) {
      produkte[pk] = { name: pv.name, type: pv.type, note: pv.note };
      if (pv.einheit) produkte[pk].einheit = pv.einheit;
      // Tropfen durchreichen: die Library zeigte Hesi SuperVit sonst als
      // "nicht diese Woche" - sachlich falsch, es gehoert in jede Woche.
      if (pv.drops) { produkte[pk].drops = true; produkte[pk].dropsPerL = pv.dropsPerL; }
    }
    const schedule = {};
    for (const [phD, phL] of [['wuchs', 'grow'], ['bluete', 'bloom']]) {
      const wochen = new Set(Object.values(m.dosis[phD] || {}).flatMap(o => Object.keys(o).map(Number)));
      for (const w of Object.keys(m.ec[phD] || {})) wochen.add(Number(w));
      const plan = phD === 'bluete' && m.wochen && m.wochen.bluete;
      if (plan) for (let w = plan.naehrstoff + 1; w <= plan.gesamt; w++) wochen.add(w);
      schedule[phL] = [...wochen].sort((a, b) => a - b).map(w => {
        const doses = {};
        for (const [pk, d] of Object.entries(m.dosis[phD] || {})) if (d[w] !== undefined) doses[pk] = +(d[w] * 10).toFixed(3);
        const e = { week: w, doses, ec: (m.ec[phD] || {})[w] };
        const h = (m.hinweis[phD] || {})[w]; if (h) e.note = h;
        if (plan && w > plan.naehrstoff && !e.note) e.note = 'Spülen: nur Wasser' + (plan.spuelen ? ' (' + plan.spuelen + ')' : '');
        return e;
      });
    }
    raus[k] = { name: m.name, emoji: m.emoji, color: m.color, products: produkte, schedule, addOrder: m.addOrder, tips: m.tips, flush: m.flush };
  }
  return raus;
}


// Die beiden bisherigen Formen - damit kein Renderer angefasst werden muss.
const BRANDS_DATA = alsDashboard(MARKEN);   // Dashboard
const BRANDS      = alsLibrary(MARKEN);     // Nutrient Library


// ── Waehlbarkeit ────────────────────────────────────────────────
// Eine Marke ist nur waehlbar, wenn mindestens ein Produkt NICHT als
// ungeeignet gilt. Allgemeine Regel statt Sonderfall: trifft es spaeter eine
// andere Marke, greift sie genauso. Eingefuehrt am 24.9.2026 fuer BioBizz.
function markeWaehlbar(m) {
  return !!m && Object.values(m.produkte || {}).some(p => !(p.quelle && p.quelle.status === 'ungeeignet'));
}
