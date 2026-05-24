const sectionDurations = {
  listening: 25 * 60,
  reading: 45 * 60,
  writing: 30 * 60,
  speaking: 16 * 60
};

const state = {
  currentView: "dashboard",
  currentSection: "listening",
  reviewMode: false,
  timerSeconds: sectionDurations.listening,
  timerRunning: false,
  timerId: null,
  selectedWritingPrompt: 0,
  recorder: null,
  recordedChunks: [],
  test: null,
  latestResult: null,
  lastVersionIndex: -1
};

const examVersions = [
  { name: "Mock Exam 1", theme: "Stadt, Verkehr und Behörden" },
  { name: "Mock Exam 2", theme: "Arbeit, Ausbildung und Versicherung" },
  { name: "Mock Exam 3", theme: "Familie, Schule und Wohnen" },
  { name: "Mock Exam 4", theme: "Gesundheit, Termine und Alltag" },
  { name: "Mock Exam 5", theme: "Freizeit, Einkaufen und Dienstleistungen" },
  { name: "Mock Exam 6", theme: "Reisen, Nachbarschaft und Kommunikation" }
];

const listeningAnnouncements = [
  {
    audio: "Achtung am Gleis drei. Der Regionalzug nach Köln fährt heute nicht um neun Uhr zehn, sondern erst um neun Uhr fünfundzwanzig. Grund dafür sind Bauarbeiten auf der Strecke. Bitte achten Sie auf weitere Durchsagen.",
    question: "Was ist richtig?",
    options: ["Der Zug fährt später ab.", "Der Zug fährt von Gleis neun.", "Der Zug fällt heute komplett aus."],
    correct: 0
  },
  {
    audio: "Liebe Kundinnen und Kunden, wegen einer technischen Störung ist der Aufzug im Einkaufszentrum heute außer Betrieb. Bitte benutzen Sie die Treppe oder den Aufzug im Parkhaus. Wir bitten um Ihr Verständnis.",
    question: "Was sollen die Kunden benutzen?",
    options: ["Den Aufzug im Einkaufszentrum", "Die Treppe oder den Parkhaus-Aufzug", "Nur den Eingang neben der Apotheke"],
    correct: 1
  },
  {
    audio: "Achtung, eine Durchsage für Fluggäste nach Wien. Der Flug LH zweihundertachtzehn startet heute von Ausgang B zwölf. Das Einsteigen beginnt in zehn Minuten. Bitte halten Sie Ihre Bordkarte bereit.",
    question: "Wohin sollen die Fluggäste gehen?",
    options: ["Zum Ausgang B zwölf", "Zum Informationsschalter", "Zur Gepäckausgabe"],
    correct: 0
  },
  {
    audio: "Sehr geehrte Besucherinnen und Besucher, das Bürgerbüro schließt heute wegen einer Mitarbeiterversammlung bereits um zwölf Uhr. Ab morgen sind wir wieder zu den normalen Öffnungszeiten für Sie da.",
    question: "Was passiert heute?",
    options: ["Das Bürgerbüro öffnet später.", "Das Bürgerbüro schließt früher.", "Das Bürgerbüro bleibt den ganzen Tag geschlossen."],
    correct: 1
  },
  {
    audio: "Achtung im Schwimmbad. Das Kinderbecken ist heute wegen Reinigungsarbeiten geschlossen. Das Sportbecken und die Sauna können Sie wie gewohnt benutzen.",
    question: "Was ist heute geschlossen?",
    options: ["Das Kinderbecken", "Die Sauna", "Das ganze Schwimmbad"],
    correct: 0
  },
  {
    audio: "Liebe Fahrgäste, die Buslinie sechs fährt heute wegen einer Baustelle nicht über den Marktplatz. Bitte steigen Sie an der Haltestelle Rathaus aus.",
    question: "Was sollen Fahrgäste tun?",
    options: ["Am Marktplatz aussteigen", "Die Haltestelle Rathaus benutzen", "Den Zug nehmen"],
    correct: 1
  },
  {
    audio: "Willkommen im Rathaus. Die Ausgabe neuer Ausweise befindet sich heute im Raum zweihundertvier im zweiten Stock. Bitte ziehen Sie vorher eine Nummer.",
    question: "Wo bekommt man heute neue Ausweise?",
    options: ["Im zweiten Stock", "Am Haupteingang", "Im Bürgercafe"],
    correct: 0
  },
  {
    audio: "Sehr geehrte Kundinnen und Kunden, unser Supermarkt schließt heute wegen Inventur bereits um achtzehn Uhr. Morgen öffnen wir wieder um sieben Uhr.",
    question: "Wann schließt der Supermarkt heute?",
    options: ["Um sieben Uhr", "Um achtzehn Uhr", "Um zwanzig Uhr"],
    correct: 1
  }
];

const listeningRadio = [
  {
    audio: "Und nun das Wetter. Am Vormittag bleibt es meist trocken, aber am Nachmittag ziehen von Westen Regenwolken auf. Die Temperaturen liegen zwischen zwölf und fünfzehn Grad. Am Abend wird es windig.",
    question: "Wie wird das Wetter am Nachmittag?",
    options: ["Es regnet wahrscheinlich.", "Es bleibt sonnig und warm.", "Es schneit stark."],
    correct: 0
  },
  {
    audio: "Verkehrsmeldung. Auf der A drei Richtung Frankfurt gibt es zwischen Leverkusen und Köln einen Unfall. Es staut sich auf acht Kilometern. Autofahrer sollten über die B acht ausweichen.",
    question: "Warum gibt es Stau?",
    options: ["Wegen einer Baustelle", "Wegen eines Unfalls", "Wegen schlechten Wetters"],
    correct: 1
  },
  {
    audio: "Kurznachrichten. Die Stadtbibliothek bietet ab nächster Woche kostenlose Computerkurse für Erwachsene an. Die Anmeldung ist ab heute online oder direkt in der Bibliothek möglich.",
    question: "Was bietet die Bibliothek an?",
    options: ["Kostenlose Computerkurse", "Neue Bücher für Kinder", "Eine Ausstellung über die Stadt"],
    correct: 0
  },
  {
    audio: "Sport am Morgen. Der lokale Fußballverein hat gestern drei zu eins gewonnen. Das nächste Spiel findet am Samstag um fünfzehn Uhr im Stadtstadion statt. Karten gibt es noch an der Tageskasse.",
    question: "Wann ist das nächste Spiel?",
    options: ["Heute Abend", "Am Samstag um fünfzehn Uhr", "Am Sonntagvormittag"],
    correct: 1
  },
  {
    audio: "Kulturhinweis. Im Stadtpark beginnt heute das Sommerfest. Es gibt Musik, Essen aus verschiedenen Ländern und ein Programm für Kinder. Der Eintritt ist frei.",
    question: "Was kostet der Eintritt?",
    options: ["Fünf Euro", "Zehn Euro", "Nichts"],
    correct: 2
  },
  {
    audio: "Heute in der Verbraucherberatung: Viele Menschen zahlen zu viel für Strom. Wer den Anbieter wechseln möchte, sollte zuerst den Jahresverbrauch prüfen und dann mehrere Angebote vergleichen.",
    question: "Was sollte man zuerst prüfen?",
    options: ["Den Jahresverbrauch", "Die Bankverbindung", "Die Telefonnummer des Vermieters"],
    correct: 0
  },
  {
    audio: "Aus der Region. Die Volkshochschule bietet im Herbst neue Abendkurse an. Besonders gefragt sind Deutsch, Computer und Erste Hilfe. Anmelden kann man sich ab Montag.",
    question: "Wann beginnt die Anmeldung?",
    options: ["Heute", "Ab Montag", "Erst im Winter"],
    correct: 1
  },
  {
    audio: "Der Wetterdienst warnt vor Glätte in den frühen Morgenstunden. Autofahrer sollten langsam fahren und mehr Zeit einplanen. Ab Mittag steigen die Temperaturen.",
    question: "Wovor wird gewarnt?",
    options: ["Vor Hitze", "Vor Glätte", "Vor starkem Regen am Mittag"],
    correct: 1
  },
  {
    audio: "Kurznachrichten. Das neue Familienzentrum in der Nordstraße ist eröffnet. Dort gibt es Beratung, Spielgruppen und Hausaufgabenhilfe für Kinder.",
    question: "Was gibt es im Familienzentrum?",
    options: ["Nur Sportkurse", "Beratung und Angebote für Kinder", "Eine neue Polizeistation"],
    correct: 1
  },
  {
    audio: "Verkehr. Wegen eines Demonstrationszuges fahren die Straßenbahnen in der Innenstadt heute nur bis zum Hauptbahnhof. Ersatzbusse stehen bereit.",
    question: "Warum fahren die Straßenbahnen anders?",
    options: ["Wegen einer Demonstration", "Wegen Schnee", "Wegen eines Streiks"],
    correct: 0
  }
];

const listeningConversations = [
  {
    title: "Kollegen planen eine Dienstreise",
    audio: "Frau: Hast du schon die Fahrkarten für die Schulung in Hamburg gekauft? Mann: Ja, aber ich habe den früheren Zug genommen. Dann sind wir schon um zehn Uhr dort. Frau: Gut, dann können wir vor dem Seminar noch einen Kaffee trinken. Mann: Genau. Das Hotel ist auch direkt neben dem Bahnhof.",
    tasks: [
      { mode: "trueFalse", statement: "Die Kollegen fahren zu einer Schulung nach Hamburg.", correct: 0 },
      { mode: "multiple", question: "Warum nehmen sie den früheren Zug?", options: ["Sie möchten vorher Zeit haben.", "Der spätere Zug ist ausgebucht.", "Das Seminar beginnt erst abends."], correct: 0 }
    ]
  },
  {
    title: "Freunde sprechen über eine Wohnung",
    audio: "Mann: Wie findest du die neue Wohnung? Frau: Sie ist hell und die Küche ist groß. Aber die Miete ist ziemlich hoch. Mann: Stimmt. Dafür ist die Straßenbahn gleich vor der Tür. Frau: Das ist praktisch, weil ich kein Auto habe.",
    tasks: [
      { mode: "trueFalse", statement: "Die Frau findet die Miete günstig.", correct: 1 },
      { mode: "multiple", question: "Was gefällt der Frau?", options: ["Die Nähe zur Straßenbahn", "Der große Balkon", "Der ruhige Garten"], correct: 0 }
    ]
  },
  {
    title: "Eltern organisieren einen Kindergeburtstag",
    audio: "Frau: Sollen wir den Geburtstag im Park feiern? Mann: Lieber nicht. Für Samstag ist Regen gemeldet. Frau: Dann machen wir es zu Hause. Ich backe einen Kuchen und du kaufst Getränke. Mann: Einverstanden. Ich besorge auch kleine Preise für die Spiele.",
    tasks: [
      { mode: "trueFalse", statement: "Die Feier soll wegen des Wetters zu Hause stattfinden.", correct: 0 },
      { mode: "multiple", question: "Was kauft der Mann?", options: ["Getränke und kleine Preise", "Einen Kuchen und Kerzen", "Ein Geschenk für die Nachbarn"], correct: 0 }
    ]
  },
  {
    title: "Nachbarn sprechen über Hausordnung",
    audio: "Mann: Guten Abend, Frau Yilmaz. Ich wollte kurz fragen, ob Sie morgen das Treppenhaus putzen können. Frau: Morgen schaffe ich es leider nicht. Meine Tochter ist krank. Mann: Kein Problem. Dann tauschen wir einfach. Ich mache morgen und Sie nächste Woche. Frau: Vielen Dank, das hilft mir sehr.",
    tasks: [
      { mode: "trueFalse", statement: "Frau Yilmaz kann morgen nicht putzen.", correct: 0 },
      { mode: "multiple", question: "Was schlagen die Nachbarn vor?", options: ["Sie tauschen die Woche.", "Sie bezahlen eine Firma.", "Sie sprechen mit dem Vermieter."], correct: 0 }
    ]
  },
  {
    title: "Freunde kaufen ein Geschenk",
    audio: "Frau: Was schenken wir Lina zum Abschluss? Mann: Vielleicht einen Gutschein für Bücher. Sie liest doch gern. Frau: Gute Idee, aber sie hat auch gesagt, dass sie einen Rucksack braucht. Mann: Dann kaufen wir einen Rucksack und legen eine Karte dazu.",
    tasks: [
      { mode: "trueFalse", statement: "Lina braucht einen Rucksack.", correct: 0 },
      { mode: "multiple", question: "Was wollen die Freunde kaufen?", options: ["Einen Rucksack", "Nur Blumen", "Eine Eintrittskarte"], correct: 0 }
    ]
  },
  {
    title: "Ehepaar spricht über einen Arzttermin",
    audio: "Mann: Ich habe morgen um halb zehn einen Termin beim Orthopäden. Kannst du mich fahren? Frau: Morgen früh muss ich arbeiten. Aber um neun Uhr fährt der Bus direkt vor der Praxis ab. Mann: Dann nehme ich den Bus. Zurück kann ich laufen.",
    tasks: [
      { mode: "trueFalse", statement: "Der Mann fährt morgen mit dem Bus zum Arzt.", correct: 0 },
      { mode: "multiple", question: "Warum kann die Frau ihn nicht fahren?", options: ["Sie muss arbeiten", "Das Auto ist kaputt", "Sie hat selbst einen Termin"], correct: 0 }
    ]
  },
  {
    title: "Kollegen planen die Mittagspause",
    audio: "Mann: Gehen wir heute in die Kantine? Frau: Lieber nicht, dort ist es freitags immer sehr voll. Mann: Dann holen wir etwas beim Bäcker und essen im Pausenraum. Frau: Einverstanden. Ich bringe noch Obst mit.",
    tasks: [
      { mode: "trueFalse", statement: "Die Kollegen möchten nicht in die Kantine gehen.", correct: 0 },
      { mode: "multiple", question: "Wo wollen sie essen?", options: ["Im Pausenraum", "Im Restaurant", "Im Park"], correct: 0 }
    ]
  },
  {
    title: "Familie organisiert einen Ausflug",
    audio: "Frau: Am Sonntag soll es sonnig werden. Wollen wir zum See fahren? Mann: Ja, aber wir sollten früh los, sonst finden wir keinen Parkplatz. Frau: Ich mache Sandwiches und du packst die Decke ein. Mann: Gut, ich nehme auch Sonnencreme mit.",
    tasks: [
      { mode: "trueFalse", statement: "Die Familie möchte am Sonntag zum See fahren.", correct: 0 },
      { mode: "multiple", question: "Warum wollen sie früh losfahren?", options: ["Wegen der Parkplätze", "Weil der See früh schließt", "Weil sie arbeiten müssen"], correct: 0 }
    ]
  }
];

const listeningOpinionSets = [
  {
    topic: "Leben in der Stadt oder auf dem Land",
    options: [
      "A: Die Person mag kurze Wege und viele Angebote.",
      "B: Die Person braucht Ruhe und mehr Platz.",
      "C: Die Person findet die Mieten in der Stadt zu teuer.",
      "D: Die Person möchte ohne Auto leben.",
      "E: Die Person denkt vor allem an gute Schulen.",
      "F: Die Person möchte näher bei der Familie wohnen."
    ],
    speakers: [
      { audio: "Person eins: Ich wohne gern in der Stadt. Ich kann mit der Bahn zur Arbeit fahren, zum Arzt laufen und abends ins Kino gehen. Ein Auto brauche ich hier wirklich nicht.", correct: 3 },
      { audio: "Person zwei: Früher habe ich mitten in der Stadt gewohnt. Jetzt lebe ich in einem kleinen Ort. Dort ist es ruhiger, meine Kinder können draußen spielen und wir haben einen Garten.", correct: 1 },
      { audio: "Person drei: Ich würde gern in der Stadt bleiben, aber die Wohnungen sind viel zu teuer geworden. Deshalb suche ich jetzt etwas außerhalb.", correct: 2 }
    ]
  },
  {
    topic: "Deutsch lernen im Alltag",
    options: [
      "A: Die Person lernt gern mit Filmen.",
      "B: Die Person braucht Grammatikübungen.",
      "C: Die Person spricht viel mit Nachbarn.",
      "D: Die Person hat wenig Zeit wegen der Arbeit.",
      "E: Die Person liest jeden Tag Zeitung.",
      "F: Die Person findet Online-Kurse schwierig."
    ],
    speakers: [
      { audio: "Person eins: Ich arbeite den ganzen Tag und bin abends oft müde. Deshalb lerne ich meistens nur am Wochenende Deutsch.", correct: 3 },
      { audio: "Person zwei: Mir hilft es sehr, wenn ich mit meiner Nachbarin spreche. Sie korrigiert mich freundlich und ich lerne neue Wörter.", correct: 2 },
      { audio: "Person drei: Ich sehe deutsche Serien mit Untertiteln. So höre ich die Aussprache und verstehe Alltagssprache besser.", correct: 0 }
    ]
  },
  {
    topic: "Einkaufen im Internet",
    options: [
      "A: Die Person vergleicht immer Preise.",
      "B: Die Person kauft lieber im Geschäft.",
      "C: Die Person achtet auf Rücksendungen.",
      "D: Die Person bestellt Lebensmittel online.",
      "E: Die Person hat schlechte Erfahrungen mit Lieferzeiten.",
      "F: Die Person bezahlt nie mit Karte."
    ],
    speakers: [
      { audio: "Person eins: Ich bestelle Kleidung online, aber nur wenn ich sie kostenlos zurückschicken kann. Die Größe passt ja nicht immer.", correct: 2 },
      { audio: "Person zwei: Ich schaue im Internet nach Angeboten und vergleiche die Preise. So spare ich oft Geld.", correct: 0 },
      { audio: "Person drei: Mir ist das zu unsicher. Ich gehe lieber ins Geschäft, sehe die Ware direkt und kann jemanden fragen.", correct: 1 }
    ]
  }
];

const readingShortTexts = [
  {
    text: "Sie suchen auf der Internetseite Ihrer Stadt nach Informationen.",
    question: "Sie möchten wissen, wann der nächste Bus zum Flughafen fährt.",
    options: ["Download", "Verkehr", "anderer Menüpunkt"],
    correct: 1
  },
  {
    text: "Sie suchen auf der Internetseite Ihrer Stadt nach Informationen.",
    question: "Sie möchten Gemüse auf einem kleinen Grundstück anpflanzen.",
    options: ["Gesundheit", "Kultur & Freizeit", "Wohnen & Bauen"],
    correct: 2
  },
  {
    text: "Sie suchen auf der Internetseite Ihrer Stadt nach Informationen.",
    question: "Ihre Freundin möchte Krankenpflegerin werden.",
    options: ["Download", "Gesundheit", "Wirtschaft & Arbeit"],
    correct: 2
  },
  {
    text: "Sie suchen auf der Internetseite Ihrer Stadt nach Informationen.",
    question: "Sie möchten ein Büro oder Geschäft mieten.",
    options: ["Kultur & Freizeit", "Wirtschaft & Arbeit", "Wohnen & Bauen"],
    correct: 1
  },
  {
    text: "Sie suchen auf der Internetseite Ihrer Stadt nach Informationen.",
    question: "Ihr Kind soll in der Schule einen Vortrag über die Geschichte der Stadt halten.",
    options: ["Download", "Kultur & Freizeit", "Wohnen & Bauen"],
    correct: 1
  },
  {
    text: "Sie suchen auf der Internetseite Ihrer Stadt nach Informationen.",
    question: "Sie brauchen ein Formular für die Anmeldung Ihrer neuen Wohnung.",
    options: ["Download", "Gesundheit", "Kultur & Freizeit"],
    correct: 0
  },
  {
    text: "Sie suchen auf der Internetseite Ihrer Stadt nach Informationen.",
    question: "Sie suchen eine günstige Parkmöglichkeit in der Innenstadt.",
    options: ["Verkehr", "Wohnen & Bauen", "Wirtschaft & Arbeit"],
    correct: 0
  },
  {
    text: "Sie suchen auf der Internetseite Ihrer Stadt nach Informationen.",
    question: "Sie möchten wissen, welche Apotheken nachts geöffnet haben.",
    options: ["Gesundheit", "Download", "anderer Menüpunkt"],
    correct: 0
  },
  {
    text: "Sie suchen auf der Internetseite Ihrer Stadt nach Informationen.",
    question: "Sie suchen eine Ausbildung in einem Betrieb in der Stadt.",
    options: ["Kultur & Freizeit", "Wirtschaft & Arbeit", "Verkehr"],
    correct: 1
  },
  {
    text: "Sie suchen auf der Internetseite Ihrer Stadt nach Informationen.",
    question: "Sie möchten einen Stadtplan herunterladen.",
    options: ["Download", "Wohnen & Bauen", "Gesundheit"],
    correct: 0
  }
];

const readingCityMenu = [
  {
    title: "Gesundheit",
    items: ["Arztsuche", "Notrufnummern", "Krankenhaus-Notaufnahmen", "Nacht- und Notdienst-Apotheken", "Gesunde Ernährung", "Reisemedizin"]
  },
  {
    title: "Verkehr",
    items: ["Fahrpläne des öffentlichen Verkehrs", "Kurzparkzonen", "Parkhäuser", "Fahrschulen", "Prüfstellen für Fahrzeuge"]
  },
  {
    title: "Kultur & Freizeit",
    items: ["Tourismusbüro", "Kinos", "Musik- und Theaterbühnen", "Museen", "Stadtgeschichte", "Stadtbibliothek", "Einkaufen von A-Z"]
  },
  {
    title: "Wirtschaft & Arbeit",
    items: ["Betriebe und Unternehmen", "Freie Geschäfts- und Büroräume", "Stellenangebote", "Ausbildung", "Weiterbildung", "Gesundheitsberufe"]
  },
  {
    title: "Wohnen & Bauen",
    items: ["Mietwohnungen", "Wohnungssuche", "Meldeservice", "Kleingärten", "Baubehörden", "Baufinanzierung"]
  },
  {
    title: "Download",
    items: ["Stadtpläne", "Formulare", "Parkkarte für Bewohner", "Monatskarten für Bus und Straßenbahn", "Schülerkarten"]
  }
];

const readingAdBank = [
  "A: Presseportal SicherPlus - Unsere Versicherung hat eine neue Geschäftsleitung. Informationen über Unternehmensentwicklung und Standorte.",
  "B: Ausbildung bei DeltaCare - Wir bilden Kaufleute im Gesundheitswesen aus. Unterricht in der Berufsschule, interne Seminare und gute Übernahmechancen.",
  "C: JobStart Personal - Sachbearbeiter/in für Kfz-Versicherungen gesucht. Sie bearbeiten Verträge und Kundenanfragen. Kaufmännische Ausbildung erforderlich.",
  "D: Kfz-Schutz Direkt - Haftpflicht, Teilkasko oder Vollkasko für Ihr Auto. Auch für Personen ohne Automobilclub. Online-Angebot in wenigen Minuten.",
  "E: AutoClub Mobil - Mitglieder erhalten Rabatte bei Autoversicherungen und günstige Zusatzleistungen. Nur für Club-Mitglieder.",
  "F: StudierendenKasse - Informationen zur gesetzlichen Krankenversicherung für Studierende, Mitversicherung, Pflichtversicherung und freiwillige Versicherung.",
  "G: ReiseSicher - Reiseversicherung für Urlaub und Auslandsaufenthalte: Haftpflicht, Unfall, Gepäck, Storno und Schutz bei Krankheit.",
  "H: CampusUnfall - Private Unfallversicherung für Studierende, Schutz bei Studienfahrten, Praktikum und Freizeit. Schneller Online-Abschluss."
];

const readingAdSituations = [
  {
    text: "Sie brauchen eine Autoversicherung. Sie sind bei keinem Automobilclub.",
    correct: 3
  },
  {
    text: "Ihre Familie plant einen Urlaub. Sie möchte sich dafür versichern lassen.",
    correct: 6
  },
  {
    text: "Markus studiert. Er möchte sich gegen Unfälle versichern lassen.",
    correct: 7
  },
  {
    text: "Sie möchten eine private Rentenversicherung abschließen.",
    correct: 8
  },
  {
    text: "Ihr Sohn sucht eine neue Stelle bei einer Versicherung.",
    correct: 2
  },
  {
    text: "Ihre Tochter möchte eine Ausbildung bei einer Versicherung beginnen.",
    correct: 1
  },
  {
    text: "Sie studieren und suchen Informationen zur Krankenversicherung.",
    correct: 5
  },
  {
    text: "Sie sind Mitglied in einem Autoclub und möchten Rabatte für eine Kfz-Versicherung nutzen.",
    correct: 4
  },
  {
    text: "Sie möchten wissen, wer neuer Direktor einer Versicherung geworden ist.",
    correct: 0
  },
  {
    text: "Sie suchen eine Versicherung speziell für ein Haustier.",
    correct: 8
  }
];

const readingMessages = [
  {
    title: "Nachricht vom Vermieter",
    text: "Sehr geehrte Mieterinnen und Mieter, am Montag wird im Haus von 8 bis 12 Uhr das Wasser abgestellt. Grund ist eine Reparatur im Keller. Bitte planen Sie entsprechend. Bei Fragen erreichen Sie die Hausverwaltung telefonisch.",
    tasks: [
      { mode: "trueFalse", statement: "Am Montag gibt es vormittags kein Wasser im Haus.", correct: 0 },
      { mode: "multiple", question: "Warum wird das Wasser abgestellt?", options: ["Wegen einer Reparatur", "Wegen einer Kontrolle der Miete", "Wegen Reinigungsarbeiten im Hof"], correct: 0 }
    ]
  },
  {
    title: "E-Mail aus der Schule",
    text: "Liebe Eltern, der Ausflug der Klasse 4a findet nicht morgen, sondern erst nächste Woche Mittwoch statt. Bitte geben Sie Ihrem Kind dann ein Getränk, eine Regenjacke und 3 Euro für die Fahrt mit.",
    tasks: [
      { mode: "trueFalse", statement: "Der Ausflug ist auf nächste Woche verschoben.", correct: 0 },
      { mode: "multiple", question: "Was sollen die Kinder mitbringen?", options: ["Sportschuhe und Badezeug", "Ein Getränk, Regenjacke und Geld", "Nur das unterschriebene Zeugnis"], correct: 1 }
    ]
  },
  {
    title: "SMS vom Deutschkurs",
    text: "Hallo zusammen, morgen fällt der Unterricht wegen Krankheit aus. Bitte wiederholen Sie Kapitel 6 und schreiben Sie zehn Sätze im Perfekt. Am Donnerstag machen wir normal weiter.",
    tasks: [
      { mode: "trueFalse", statement: "Der Unterricht findet morgen wie gewohnt statt.", correct: 1 },
      { mode: "multiple", question: "Was sollen die Teilnehmenden machen?", options: ["Kapitel 6 wiederholen", "Eine Prüfung anmelden", "Den Kursraum wechseln"], correct: 0 }
    ]
  },
  {
    title: "Hinweis der Bahn",
    text: "Liebe Anwohnerinnen und Anwohner, in der kommenden Woche werden nachts Wartungsarbeiten an der Bahnstrecke durchgeführt. Die Arbeiten dauern von 20 Uhr bis 5 Uhr. Dadurch kann es lauter werden. Wir bitten um Verständnis.",
    tasks: [
      { mode: "trueFalse", statement: "Die Arbeiten finden nachts statt.", correct: 0 },
      { mode: "multiple", question: "Was kann durch die Arbeiten passieren?", options: ["Es kann lauter werden", "Alle Züge fallen einen Monat aus", "Die Straße wird gesperrt"], correct: 0 }
    ]
  },
  {
    title: "Brief vom Energieversorger",
    text: "Sehr geehrte Familie Sousa, am 12. Juni möchten wir in Ihrem Wohnhaus den Stromzähler ablesen. Wenn der Termin nicht passt, können Sie den Zähler auch selbst online eintragen. Bei Problemen helfen wir telefonisch weiter.",
    tasks: [
      { mode: "trueFalse", statement: "Der Stromzähler soll am 12. Juni abgelesen werden.", correct: 0 },
      { mode: "multiple", question: "Was kann man tun, wenn der Termin nicht passt?", options: ["Den Zähler online selbst eintragen", "Die Wohnung kündigen", "Eine neue Rechnung verlangen"], correct: 0 }
    ]
  },
  {
    title: "Nachricht vom Sportverein",
    text: "Hallo Mitglieder, das Training am Dienstag findet wegen Reparaturen nicht in der Sporthalle statt. Wir treffen uns um 18 Uhr auf dem Sportplatz. Bitte bringt wetterfeste Kleidung mit.",
    tasks: [
      { mode: "trueFalse", statement: "Das Training ist am Dienstag in der Sporthalle.", correct: 1 },
      { mode: "multiple", question: "Was sollen die Mitglieder mitbringen?", options: ["Wetterfeste Kleidung", "Einen Ausweis", "Eine Bewerbung"], correct: 0 }
    ]
  }
];

const readingInfoTexts = [
  {
    title: "Schnell-Reiniger für Kaffeemaschinen",
    text: "Warum reinigen? Wenn sich Rückstände in Kaffeemaschinen oder Wasserkochern sammeln, braucht das Gerät mehr Energie und die Getränke schmecken oft schlechter. Unser Schnell-Reiniger entfernt Kalk und andere Ablagerungen zuverlässig. Er ist für Wasserkocher, Töpfe, Trinkgläser und viele Filterkaffeemaschinen geeignet. Für vollautomatische Espresso-Maschinen empfehlen wir jedoch ein Spezialprodukt. Anwendung: Das Mittel mit Wasser mischen, in das Gerät füllen und etwa dreißig Minuten einwirken lassen. Danach gründlich mit kaltem Wasser ausspülen. Sicherheit: Das Mittel darf nicht in die Hände von Kindern gelangen und darf nicht mit anderen Reinigungsprodukten gemischt werden.",
    statements: [
      { statement: "Der Reiniger kann helfen, den Energieverbrauch zu senken.", correct: 0 },
      { statement: "Das Mittel ist besonders für vollautomatische Espresso-Maschinen empfohlen.", correct: 1 },
      { statement: "Nach der Anwendung soll man das Gerät gründlich ausspülen.", correct: 0 }
    ]
  },
  {
    title: "Information zum Stadtteilbus",
    text: "Der neue Stadtteilbus verbindet ab Montag die Wohngebiete im Norden mit dem Bahnhof und dem Einkaufszentrum. Der Bus fährt montags bis freitags alle dreißig Minuten. Samstags fährt er nur bis 18 Uhr. Fahrräder können aus Platzgründen nicht mitgenommen werden. Fahrkarten gibt es am Automaten, in der App oder direkt beim Fahrer. Kinder unter sechs Jahren fahren kostenlos.",
    statements: [
      { statement: "Der Stadtteilbus fährt zum Bahnhof.", correct: 0 },
      { statement: "Samstags fährt der Bus die ganze Nacht.", correct: 1 },
      { statement: "Kleine Kinder unter sechs Jahren brauchen keine Fahrkarte.", correct: 0 }
    ]
  },
  {
    title: "Hinweise zur Sperrmüllabholung",
    text: "Sperrmüll wird nur nach Anmeldung abgeholt. Dazu gehören alte Möbel, Matratzen und große Teppiche. Elektrogeräte, Farbeimer und Bauschutt dürfen nicht dazugestellt werden. Bitte stellen Sie den Sperrmüll frühestens am Abend vor dem Termin an die Straße. Wer den Termin nicht einhält, muss die Sachen wieder entfernen.",
    statements: [
      { statement: "Man muss die Sperrmüllabholung vorher anmelden.", correct: 0 },
      { statement: "Alte Farbeimer dürfen zum Sperrmüll gestellt werden.", correct: 1 },
      { statement: "Der Sperrmüll darf frühestens am Vorabend rausgestellt werden.", correct: 0 }
    ]
  }
];

const readingClozes = [
  {
    title: "Sprachbausteine: Zahlungserinnerung",
    text: "Frau\nElena Markovic\nHafenstraße 18\n28195 Bremen\n\nBremen, den 12. November\n\nZAHLUNGSERINNERUNG\n\nSehr ___(1)___ Frau Markovic,\nleider haben wir zu der ___(2)___ genannten Rechnung noch keine Zahlung erhalten. Vielleicht haben Sie die Überweisung nur vergessen. Mit diesem Schreiben schicken wir ___(3)___ eine Kopie der Rechnung.\nBitte überweisen Sie den offenen Betrag bis ___(4)___ 25. November auf unser Konto. ___(5)___ Sie den Betrag inzwischen bezahlt haben, betrachten Sie dieses Schreiben bitte als gegenstandslos.\nBei Fragen können Sie uns ___(6)___ anrufen.\n\nMit freundlichen Grüßen\nService GmbH",
    blanks: [
      { question: "Lücke 1", options: ["geehrte", "gute", "liebe"], correct: 0 },
      { question: "Lücke 2", options: ["oben", "unten", "höher"], correct: 0 },
      { question: "Lücke 3", options: ["Ihnen", "dir", "uns"], correct: 0 },
      { question: "Lücke 4", options: ["spätestens", "schnellstens", "frühestens"], correct: 0 },
      { question: "Lücke 5", options: ["Wenn", "Weil", "Damit"], correct: 0 },
      { question: "Lücke 6", options: ["gerne", "manchmal", "oft"], correct: 0 }
    ]
  },
  {
    title: "Sprachbausteine: Kursanmeldung",
    text: "Sehr geehrte Damen und Herren,\nich interessiere mich ___(1)___ Ihren Computerkurs am Abend. Auf Ihrer Internetseite habe ich gelesen, ___(2)___ der Kurs im September beginnt. Bitte teilen Sie mir mit, ___(3)___ noch Plätze frei sind. Ich arbeite tagsüber, deshalb kann ich nur ___(4)___ 18 Uhr teilnehmen. Außerdem möchte ich wissen, ___(5)___ ich die Kursgebühr vor Beginn bezahlen muss. Über eine kurze Antwort würde ich mich sehr ___(6)___.\nMit freundlichen Grüßen\nSamir Haddad",
    blanks: [
      { question: "Lücke 1", options: ["für", "bei", "an"], correct: 0 },
      { question: "Lücke 2", options: ["dass", "weil", "ob"], correct: 0 },
      { question: "Lücke 3", options: ["ob", "wenn", "als"], correct: 0 },
      { question: "Lücke 4", options: ["nach", "seit", "bis"], correct: 0 },
      { question: "Lücke 5", options: ["wann", "ob", "wer"], correct: 1 },
      { question: "Lücke 6", options: ["freuen", "freut", "freute"], correct: 0 }
    ]
  }
];

const writingPrompts = [
  {
    title: "Aufgabe A: Termin verschieben",
    situation: "Sie haben einen Termin bei Ihrer Wohnungsverwaltung, können aber nicht kommen.",
    points: ["Erklären Sie, warum Sie nicht kommen können.", "Bitten Sie um einen neuen Termin.", "Nennen Sie zwei mögliche Zeiten.", "Fragen Sie, welche Unterlagen Sie mitbringen sollen."]
  },
  {
    title: "Aufgabe B: Kursleitung informieren",
    situation: "Sie besuchen einen Deutschkurs. Nächste Woche können Sie an zwei Tagen nicht teilnehmen.",
    points: ["Entschuldigen Sie sich.", "Erklären Sie den Grund.", "Fragen Sie nach den Hausaufgaben.", "Bitten Sie um Informationen zum nächsten Test."]
  },
  {
    title: "Aufgabe A: Beschwerde über Lieferung",
    situation: "Sie haben online einen Tisch bestellt. Der Tisch ist beschädigt angekommen.",
    points: ["Beschreiben Sie das Problem.", "Sagen Sie, wann die Lieferung kam.", "Bitten Sie um Ersatz oder Reparatur.", "Fragen Sie nach dem weiteren Ablauf."]
  },
  {
    title: "Aufgabe B: Elternabend",
    situation: "Sie können nicht zum Elternabend in der Schule Ihres Kindes gehen.",
    points: ["Entschuldigen Sie sich.", "Erklären Sie den Grund.", "Fragen Sie nach wichtigen Informationen.", "Bitten Sie um einen Gesprächstermin."]
  }
];

const speakingSets = [
  {
    title: "Teil 1: Sich vorstellen",
    points: ["Name, Herkunft und Wohnort", "Familie oder Freunde", "Beruf, Ausbildung oder Kurs", "Sprachen und Lernziele"]
  },
  {
    title: "Teil 2: Bild beschreiben",
    points: ["Was sehen Sie auf dem Bild?", "Wo sind die Personen?", "Was machen die Personen?", "Welche Situation oder welches Problem könnte es geben?"]
  },
  {
    title: "Teil 3: Gemeinsam etwas planen",
    points: ["Sie möchten mit Ihrer Kursgruppe ein Picknick organisieren.", "Wann und wo treffen Sie sich?", "Wer bringt Essen und Getränke mit?", "Was machen Sie bei schlechtem Wetter?"]
  }
];

const picturePrompts = [
  {
    scene: "Beim Arzt",
    topic: "Arztbesuch und Gesundheit",
    setting: "Wartezimmer in einer Arztpraxis",
    people: "Eine Frau sitzt mit einem Formular, ein Mann spricht mit der Rezeptionistin.",
    observations: ["An der Wand hängt ein Informationsblatt.", "Auf dem Tisch liegen Formulare und eine Versicherungskarte.", "Die Personen warten ruhig, aber vielleicht schon länger."],
    usefulWords: ["Termin", "Versicherungskarte", "Wartezeit", "Rezeption", "Gesundheit"],
    opinionQuestion: "Was finden Sie bei einem Arzttermin in Deutschland einfach oder schwierig?",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1000&q=80"
  },
  {
    scene: "In der Schule",
    topic: "Schule und Kinder",
    setting: "Klassenzimmer bei einem Elternabend",
    people: "Eine Lehrerin zeigt etwas an der Tafel, mehrere Eltern sitzen an Tischen.",
    observations: ["Auf der Tafel stehen Termine und Notizen.", "Ein Elternteil macht sich Notizen.", "Es geht wahrscheinlich um Hausaufgaben oder einen Ausflug."],
    usefulWords: ["Elternabend", "Hausaufgaben", "Lehrerin", "Notizen", "Ausflug"],
    opinionQuestion: "Warum sind Gespräche zwischen Eltern und Schule wichtig?",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80"
  },
  {
    scene: "Auf dem Markt",
    topic: "Einkaufen und Lebensmittel",
    setting: "Obst- und Gemüsestand auf einem Wochenmarkt",
    people: "Ein Verkäufer wiegt Äpfel, eine Kundin bezahlt und ein Kind wartet daneben.",
    observations: ["Es gibt Körbe mit Obst und Gemüse.", "Preisschilder stehen vor den Waren.", "Die Kundin benutzt vielleicht Bargeld oder eine Karte."],
    usefulWords: ["Einkaufen", "Preise", "frische Lebensmittel", "bezahlen", "Kasse"],
    opinionQuestion: "Kaufen Sie lieber auf dem Markt oder im Supermarkt? Warum?",
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1000&q=80"
  },
  {
    scene: "Im Büro",
    topic: "Arbeit und Beratung",
    setting: "Beratungsgespräch im Jobcenter",
    people: "Zwei Personen sitzen an einem Schreibtisch und schauen auf Unterlagen.",
    observations: ["Auf dem Tisch liegen Dokumente und ein Lebenslauf.", "Eine Person erklärt etwas am Computer.", "Vielleicht geht es um eine Bewerbung oder Weiterbildung."],
    usefulWords: ["Bewerbung", "Termin", "Dokumente", "Beratung", "Arbeit"],
    opinionQuestion: "Welche Hilfe braucht man, wenn man eine Arbeit sucht?",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=80"
  },
  {
    scene: "Familie zu Hause",
    topic: "Familie und Alltag",
    setting: "Küche in einer Wohnung",
    people: "Ein Vater kocht, ein Kind deckt den Tisch und eine ältere Frau sitzt am Fenster.",
    observations: ["Auf dem Tisch stehen Teller, Brot und Getränke.", "Die Familie bereitet wahrscheinlich das Abendessen vor.", "Die Stimmung wirkt freundlich und ruhig."],
    usefulWords: ["Familie", "Küche", "Abendessen", "helfen", "zusammen"],
    opinionQuestion: "Welche Aufgaben teilen sich Familienmitglieder bei Ihnen zu Hause?",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1000&q=80"
  },
  {
    scene: "Im Park",
    topic: "Freizeit und Erholung",
    setting: "Park an einem sonnigen Nachmittag",
    people: "Zwei Erwachsene sitzen auf einer Bank, Kinder spielen mit einem Ball.",
    observations: ["Im Hintergrund sieht man Bäume und einen Weg.", "Eine Person liest eine Zeitung.", "Vielleicht machen die Familien eine Pause nach der Arbeit oder Schule."],
    usefulWords: ["Freizeit", "spielen", "Bank", "spazieren gehen", "erholen"],
    opinionQuestion: "Was machen Sie gern in Ihrer Freizeit?",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80"
  },
  {
    scene: "Im Restaurant",
    topic: "Essen und Trinken",
    setting: "Kleines Restaurant oder Cafe",
    people: "Eine Kellnerin bringt Getränke, zwei Gäste lesen die Speisekarte.",
    observations: ["Auf dem Tisch stehen Gläser und Teller.", "Die Gäste überlegen, was sie bestellen möchten.", "Es könnte ein Treffen mit Freunden sein."],
    usefulWords: ["Speisekarte", "bestellen", "Getränke", "bezahlen", "Trinkgeld"],
    opinionQuestion: "Gehen Sie gern essen oder kochen Sie lieber zu Hause?",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
  },
  {
    scene: "An der Bushaltestelle",
    topic: "Verkehr und Wege",
    setting: "Bushaltestelle in der Stadt",
    people: "Mehrere Personen warten, eine Person schaut auf den Fahrplan.",
    observations: ["Ein Bus kommt vielleicht gleich an.", "Eine Frau trägt Einkaufstaschen.", "Das Wetter sieht kühl aus, einige tragen Jacken."],
    usefulWords: ["Bus", "Fahrplan", "Haltestelle", "warten", "verspätet"],
    opinionQuestion: "Welche Verkehrsmittel benutzen Sie am häufigsten?",
    image: "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&w=1000&q=80"
  }
];

const writingRubricItems = [
  "All four content points are answered.",
  "The text has greeting and closing.",
  "The message is polite and situation-appropriate.",
  "Sentences are connected with weil, deshalb, aber, oder dann.",
  "Verb position and cases are mostly correct.",
  "Vocabulary fits the topic."
];

const speakingRubricItems = [
  "I answered the task without long pauses.",
  "My partner/examiner would understand the main message.",
  "I asked at least one useful question.",
  "I reacted to the other person.",
  "My pronunciation was clear enough.",
  "I used B1 connectors or reasons."
];

const dom = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheDom();
  bindEvents();
  loadPreferences();
  generateMockTest();
  renderHistory();
  updateDashboard();
  updateTimerDisplay();
});

function cacheDom() {
  const ids = [
    "view-title", "new-test", "dashboard-start", "dashboard-practice", "theme-toggle",
    "listening-tasks", "reading-tasks", "writing-prompts", "speaking-tasks",
    "timer", "timer-label", "timer-toggle", "timer-reset", "play-all-listening",
    "writing-answer", "word-count", "writing-rubric", "speaking-rubric",
    "record-toggle", "recording-status", "recording-playback", "score-test",
    "reveal-review", "results-empty", "results-content", "overall-result",
    "overall-explanation", "score-hl", "level-hl", "score-writing",
    "level-writing", "score-speaking", "level-speaking", "review-list",
    "history-list", "clear-history", "results-start", "latest-hl",
    "latest-writing", "latest-speaking", "attempt-count", "exam-version-label"
  ];

  ids.forEach((id) => {
    dom[id] = document.getElementById(id);
  });
}

function bindEvents() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });

  document.querySelectorAll(".segment").forEach((button) => {
    button.addEventListener("click", () => switchSection(button.dataset.section));
  });

  dom["new-test"].addEventListener("click", () => {
    generateMockTest();
    switchView("exam");
  });
  dom["dashboard-start"].addEventListener("click", () => {
    generateMockTest();
    switchView("exam");
  });
  dom["dashboard-practice"].addEventListener("click", () => switchView("exam"));
  dom["results-start"].addEventListener("click", () => switchView("exam"));
  dom["theme-toggle"].addEventListener("click", toggleTheme);
  dom["timer-toggle"].addEventListener("click", toggleTimer);
  dom["timer-reset"].addEventListener("click", resetTimer);
  dom["play-all-listening"].addEventListener("click", playCurrentListening);
  dom["writing-answer"].addEventListener("input", updateWordCount);
  dom["score-test"].addEventListener("click", calculateResult);
  dom["reveal-review"].addEventListener("click", toggleReviewMode);
  dom["record-toggle"].addEventListener("click", toggleRecording);
  dom["clear-history"].addEventListener("click", clearHistory);
}

function loadPreferences() {
  if (localStorage.getItem("dtz-theme") === "dark") {
    document.body.classList.add("dark");
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("dtz-theme", document.body.classList.contains("dark") ? "dark" : "light");
}

function switchView(view) {
  state.currentView = view;
  document.querySelectorAll(".view").forEach((panel) => panel.classList.remove("active"));
  document.getElementById(`${view}-view`).classList.add("active");
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });

  const titles = {
    dashboard: "Exam Dashboard",
    exam: "Mock Exam",
    results: "Result Profile",
    history: "Attempt History"
  };
  dom["view-title"].textContent = titles[view];
}

function switchSection(section) {
  state.currentSection = section;
  document.querySelectorAll(".segment").forEach((button) => {
    button.classList.toggle("active", button.dataset.section === section);
  });
  document.querySelectorAll(".section-panel").forEach((panel) => panel.classList.remove("active"));
  document.getElementById(`${section}-section`).classList.add("active");
  state.timerSeconds = sectionDurations[section];
  stopTimer();
  updateTimerDisplay();
}

function generateMockTest() {
  const version = new Date().toISOString();
  const versionIndex = (state.lastVersionIndex + 1) % examVersions.length;
  const examVersion = examVersions[versionIndex];
  state.lastVersionIndex = versionIndex;
  state.test = {
    id: version,
    versionIndex,
    versionName: examVersion.name,
    theme: examVersion.theme,
    listening: buildListening(versionIndex),
    reading: buildReading(versionIndex),
    writing: rotateSelect(writingPrompts, 2, versionIndex),
    speaking: buildSpeaking(examVersion.theme, versionIndex)
  };
  state.latestResult = null;
  state.selectedWritingPrompt = 0;
  dom["writing-answer"].value = "";
  document.body.classList.remove("review-mode");
  state.reviewMode = false;
  renderTest();
  resetTimer();
  switchSection("listening");
  updateWordCount();
}

function buildListening(versionIndex = 0) {
  const tasks = [];

  rotateSelect(listeningAnnouncements, 4, versionIndex).forEach((seed, index) => {
    tasks.push({
      ...seed,
      id: `h-${index + 1}`,
      number: index + 1,
      part: 1,
      type: "Teil 1: Kurze Ansagen",
      instruction: "Hören Sie vier kurze öffentliche Ansagen. Wählen Sie A, B oder C."
    });
  });

  rotateSelect(listeningRadio, 5, versionIndex).forEach((seed, index) => {
    tasks.push({
      ...seed,
      id: `h-${index + 5}`,
      number: index + 5,
      part: 2,
      type: "Teil 2: Radio",
      instruction: "Hören Sie fünf kurze Radiobeiträge. Wählen Sie A, B oder C."
    });
  });

  let conversationNumber = 10;
  rotateSelect(listeningConversations, 4, versionIndex).forEach((conversation, conversationIndex) => {
    conversation.tasks.forEach((task, taskIndex) => {
      const isTrueFalse = task.mode === "trueFalse";
      tasks.push({
        id: `h-${conversationNumber}`,
        number: conversationNumber,
        part: 3,
        type: "Teil 3: Gespräche",
        instruction: "Hören Sie vier Gespräche. Zu jedem Gespräch gibt es zwei Aufgaben.",
        audioTitle: `Gespräch ${conversationIndex + 1}: ${conversation.title}`,
        audio: conversation.audio,
        question: isTrueFalse ? task.statement : task.question,
        options: isTrueFalse ? ["Richtig", "Falsch"] : task.options,
        correct: task.correct,
        mode: task.mode,
        pairLabel: taskIndex === 0 ? "Aussage prüfen" : "Frage beantworten"
      });
      conversationNumber += 1;
    });
  });

  const listeningOpinionSet = listeningOpinionSets[versionIndex % listeningOpinionSets.length];
  listeningOpinionSet.speakers.forEach((speaker, index) => {
    tasks.push({
      id: `h-${index + 18}`,
      number: index + 18,
      part: 4,
      type: "Teil 4: Meinungen",
      instruction: "Hören Sie drei Personen zu einem Thema. Welche Aussage passt zu welcher Person?",
      audioTitle: `Person ${index + 1}: ${listeningOpinionSet.topic}`,
      audio: speaker.audio,
      question: `Welche Aussage passt zu Person ${index + 1}?`,
      options: listeningOpinionSet.options,
      correct: speaker.correct,
      mode: "matching",
      matchOptions: listeningOpinionSet.options,
      topic: listeningOpinionSet.topic
    });
  });

  return tasks;
}

function buildReading(versionIndex = 0) {
  if (typeof readingPracticeTests !== "undefined" && readingPracticeTests.length) {
    return buildReadingFromPracticeTest(readingPracticeTests[versionIndex % readingPracticeTests.length]);
  }

  const tasks = [];

  rotateSelect(readingShortTexts, 5, versionIndex).forEach((seed, index) => {
    tasks.push({
      ...seed,
      id: `r-${index + 1}`,
      number: index + 1,
      part: 1,
      type: "Teil 1: Internetseite",
      instruction: "Sie suchen auf der Internetseite Ihrer Stadt nach Informationen. Wo finden Sie die passende Information? Wählen Sie A, B oder C."
    });
  });

  rotateSelect(readingAdSituations, 5, versionIndex).forEach((situation, index) => {
    tasks.push({
      id: `r-${index + 6}`,
      number: index + 6,
      part: 2,
      type: "Teil 2: Anzeigen",
      instruction: "Lesen Sie die Situationen und die Anzeigen. Welche Anzeige passt? Wählen Sie A-H oder X.",
      text: situation.text,
      question: "Welche Anzeige passt?",
      options: [...readingAdBank, "X: Keine Anzeige passt."],
      correct: situation.correct,
      mode: "matching"
    });
  });

  let messageNumber = 11;
  rotateSelect(readingMessages, 3, versionIndex).forEach((message, messageIndex) => {
    message.tasks.forEach((task, taskIndex) => {
      const isTrueFalse = task.mode === "trueFalse";
      tasks.push({
        id: `r-${messageNumber}`,
        number: messageNumber,
        part: 3,
        type: "Teil 3: Nachrichten",
        instruction: "Lesen Sie drei kurze Nachrichten. Zu jeder Nachricht gibt es zwei Aufgaben.",
        textTitle: `Nachricht ${messageIndex + 1}: ${message.title}`,
        text: message.text,
        question: isTrueFalse ? task.statement : task.question,
        options: isTrueFalse ? ["Richtig", "Falsch"] : task.options,
        correct: task.correct,
        mode: task.mode,
        pairLabel: taskIndex === 0 ? "Aussage prüfen" : "Frage beantworten"
      });
      messageNumber += 1;
    });
  });

  const readingInfoText = readingInfoTexts[versionIndex % readingInfoTexts.length];
  readingInfoText.statements.forEach((item, index) => {
    tasks.push({
      id: `r-${index + 17}`,
      number: index + 17,
      part: 4,
      type: "Teil 4: Informationstext",
      instruction: "Lesen Sie den Informationstext. Sind die Aussagen richtig oder falsch?",
      textTitle: readingInfoText.title,
      text: readingInfoText.text,
      question: item.statement,
      options: ["Richtig", "Falsch"],
      correct: item.correct,
      mode: "trueFalse"
    });
  });

  const readingCloze = readingClozes[versionIndex % readingClozes.length];
  readingCloze.blanks.forEach((blank, index) => {
    tasks.push({
      id: `r-${index + 20}`,
      number: index + 20,
      part: 5,
      type: "Teil 5: Sprachbausteine",
      instruction: "Lesen Sie den Text mit Lücken. Wählen Sie die passende Lösung A, B oder C.",
      textTitle: readingCloze.title,
      text: readingCloze.text,
      question: blank.question,
      options: blank.options,
      correct: blank.correct,
      mode: "cloze"
    });
  });

  return tasks;
}

function buildReadingFromPracticeTest(test) {
  const tasks = [];

  test.part1.tasks.forEach((seed, index) => {
    tasks.push({
      id: `r-${index + 1}`,
      number: index + 1,
      part: 1,
      type: "Teil 1: Internetseite",
      instruction: "Sie suchen auf der Internetseite nach Informationen. Wo finden Sie die passende Information? Wählen Sie A, B oder C.",
      site: test.part1.site,
      menu: test.part1.menu,
      text: seed.text,
      question: seed.question,
      options: seed.options,
      correct: seed.correct
    });
  });

  test.part2.situations.forEach((situation, index) => {
    tasks.push({
      id: `r-${index + 6}`,
      number: index + 6,
      part: 2,
      type: "Teil 2: Anzeigen",
      instruction: "Lesen Sie die Situationen und die Anzeigen. Welche Anzeige passt? Wählen Sie A-H oder X.",
      text: situation.text,
      question: "Welche Anzeige passt?",
      options: [...test.part2.ads, "X: Keine Anzeige passt."],
      adBank: test.part2.ads,
      correct: situation.correct,
      mode: "matching"
    });
  });

  let messageNumber = 11;
  test.part3.forEach((message, messageIndex) => {
    message.tasks.forEach((task, taskIndex) => {
      tasks.push({
        id: `r-${messageNumber}`,
        number: messageNumber,
        part: 3,
        type: "Teil 3: Nachrichten",
        instruction: "Lesen Sie drei kurze Nachrichten. Zu jeder Nachricht gibt es zwei Aufgaben.",
        textTitle: `Text ${messageIndex + 1}: ${message.title}`,
        text: message.text,
        question: task.question,
        options: task.options,
        correct: task.correct,
        mode: task.mode,
        pairLabel: taskIndex === 0 ? "Aussage prüfen" : "Frage beantworten"
      });
      messageNumber += 1;
    });
  });

  test.part4.statements.forEach((item, index) => {
    tasks.push({
      id: `r-${index + 17}`,
      number: index + 17,
      part: 4,
      type: "Teil 4: Informationstext",
      instruction: "Lesen Sie den Informationstext. Sind die Aussagen richtig oder falsch?",
      textTitle: test.part4.title,
      text: test.part4.text,
      question: item.statement,
      options: ["Richtig", "Falsch"],
      correct: item.correct,
      mode: "trueFalse"
    });
  });

  test.part5.blanks.forEach((blank, index) => {
    tasks.push({
      id: `r-${index + 20}`,
      number: index + 20,
      part: 5,
      type: "Teil 5: Sprachbausteine",
      instruction: "Lesen Sie den Text mit Lücken. Wählen Sie die passende Lösung A, B oder C.",
      textTitle: test.part5.title,
      text: test.part5.text,
      question: blank.question,
      options: blank.options,
      correct: blank.correct,
      mode: "cloze"
    });
  });

  return tasks;
}

function buildSpeaking(theme, versionIndex = 0) {
  const planningOptions = [
    ["Sie möchten mit Ihrer Kursgruppe eine Prüfungsvorbereitung organisieren.", "Wann treffen Sie sich?", "Welche Materialien brauchen Sie?", "Wer bereitet welche Aufgabe vor?"],
    ["Sie planen mit einer Nachbarin ein Hoffest.", "Wann soll das Fest stattfinden?", "Wer lädt die Gäste ein?", "Was brauchen Sie für Essen, Musik und Aufräumen?"],
    ["Sie möchten mit einem Freund ein Geschenk für eine Lehrerin kaufen.", "Was kaufen Sie?", "Wie viel darf es kosten?", "Wann und wo übergeben Sie das Geschenk?"]
  ];
  const picture = picturePrompts[versionIndex % picturePrompts.length];

  return [
    speakingSets[0],
    {
      title: "Teil 2: Bild beschreiben",
      picture,
      points: [
        "Beschreiben Sie zuerst das Bild.",
        "Sagen Sie, was die Personen machen.",
        "Vermuten Sie, was vorher oder danach passiert.",
        "Erzählen Sie kurz von einer ähnlichen Erfahrung."
      ]
    },
    { title: "Teil 3: Gemeinsam etwas planen", points: planningOptions[versionIndex % planningOptions.length], theme }
  ];
}

function renderTest() {
  dom["exam-version-label"].textContent = `${state.test.versionName} · ${state.test.theme}`;
  renderListening();
  renderReading();
  renderWriting();
  renderSpeaking();
  renderRubrics();
  switchView(state.currentView);
}

function renderListening() {
  let lastPart = null;
  dom["listening-tasks"].innerHTML = state.test.listening.map((task) => {
    const divider = task.part !== lastPart ? renderListeningPartDivider(task) : "";
    lastPart = task.part;
    return `
    ${divider}
    <article class="task-card listening-task part-${task.part}" data-task="${task.id}">
      <div class="task-topline">
        <strong>Aufgabe ${task.number}</strong>
        <span class="task-type">${task.pairLabel || task.type}</span>
      </div>
      ${task.audioTitle ? `<p class="audio-title">${task.audioTitle}</p>` : ""}
      <p>${escapeHtml(task.question)}</p>
      <div class="audio-row">
        <button class="secondary-button compact" type="button" data-play="${task.id}">Play Audio</button>
        <span class="task-text">${task.part === 3 ? "Listen to the conversation, then answer both tasks." : "Listen up to two times, then answer."}</span>
      </div>
      <div class="answers">${renderOptions("listening", task)}</div>
      <div class="transcript"><strong>Transcript:</strong> ${task.audio}</div>
    </article>
  `;
  }).join("");

  dom["listening-tasks"].querySelectorAll("[data-play]").forEach((button) => {
    button.addEventListener("click", () => speakTask(button.dataset.play));
  });
  bindAnswerEvents(dom["listening-tasks"]);
}

function renderListeningPartDivider(task) {
  const titles = {
    1: "Teil 1 · Kurze Ansagen · Aufgaben 1-4",
    2: "Teil 2 · Radio · Aufgaben 5-9",
    3: "Teil 3 · Gespräche · Aufgaben 10-17",
    4: "Teil 4 · Meinungen · Aufgaben 18-20"
  };
  const helper = task.part === 4
    ? `<div class="match-bank">${task.options.map((option) => `<span>${escapeHtml(option)}</span>`).join("")}</div>`
    : "";

  return `
    <div class="part-divider">
      <div>
        <span class="task-type">${titles[task.part]}</span>
        <p>${task.instruction}</p>
      </div>
      ${helper}
    </div>
  `;
}

function renderReading() {
  let lastPart = null;
  const repeatedTextKeys = new Set();
  dom["reading-tasks"].innerHTML = state.test.reading.map((task) => {
    const divider = task.part !== lastPart ? renderReadingPartDivider(task) : "";
    const textKey = `${task.part}-${task.textTitle || task.text}`;
    const shouldShowText = !repeatedTextKeys.has(textKey);
    repeatedTextKeys.add(textKey);
    lastPart = task.part;

    return `
    ${divider}
    <article class="task-card reading-task part-${task.part}" data-task="${task.id}">
      <div class="task-topline">
        <strong>Aufgabe ${task.number}</strong>
        <span class="task-type">${task.pairLabel || task.type}</span>
      </div>
      ${task.textTitle && shouldShowText ? `<p class="audio-title">${task.textTitle}</p>` : ""}
      ${shouldShowText ? `<p class="task-text">${escapeHtml(task.text)}</p>` : ""}
      <p>${escapeHtml(task.question)}</p>
      <div class="answers">${renderOptions("reading", task)}</div>
    </article>
  `;
  }).join("");
  bindAnswerEvents(dom["reading-tasks"]);
}

function renderReadingPartDivider(task) {
  const titles = {
    1: "Teil 1 · Internetseite/Menu · Aufgaben 1-5",
    2: "Teil 2 · Anzeigen · Aufgaben 6-10",
    3: "Teil 3 · Nachrichten · Aufgaben 11-16",
    4: "Teil 4 · Informationstext · Aufgaben 17-19",
    5: "Teil 5 · Sprachbausteine · Aufgaben 20-25"
  };
  let helper = "";
  if (task.part === 1) {
    helper = renderCityMenu(task.menu, task.site);
  }
  if (task.part === 2) {
    const adBank = task.adBank || readingAdBank;
    helper = `<div class="match-bank">${adBank.map((option) => `<span>${escapeHtml(option)}</span>`).join("")}<span>X: Keine Anzeige passt.</span></div>`;
  }

  return `
    <div class="part-divider">
      <div>
        <span class="task-type">${titles[task.part]}</span>
        <p>${task.instruction}</p>
      </div>
      ${helper}
    </div>
  `;
}

function renderCityMenu(menu = readingCityMenu, site = "www.meine-stadt-beispiel.de") {
  return `
    <div class="city-menu" aria-label="Example city website menu">
      <strong>${escapeHtml(site)}</strong>
      ${menu.map((section) => `
        <div class="city-menu-row">
          <span>${escapeHtml(section.title)}</span>
          <ul>${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>
      `).join("")}
    </div>
  `;
}

function renderOptions(section, task) {
  return task.options.map((option, index) => `
    <label class="answer-option" data-option="${index}">
      <input type="radio" name="${task.id}" value="${index}" data-section="${section}" data-id="${task.id}" />
      <span>${escapeHtml(option)}</span>
    </label>
  `).join("");
}

function bindAnswerEvents(container) {
  container.querySelectorAll("input[type='radio']").forEach((input) => {
    input.addEventListener("change", () => {
      const collection = state.test[input.dataset.section];
      const task = collection.find((item) => item.id === input.dataset.id);
      task.answer = Number(input.value);
      if (state.reviewMode) markReviewedAnswers();
    });
  });
}

function renderWriting() {
  dom["writing-prompts"].innerHTML = state.test.writing.map((prompt, index) => `
    <article class="prompt-card ${index === state.selectedWritingPrompt ? "selected" : ""}" data-writing-prompt="${index}">
      <div class="task-topline">
        <strong>${prompt.title}</strong>
        <input type="radio" name="writing-prompt" ${index === state.selectedWritingPrompt ? "checked" : ""} aria-label="Choose ${prompt.title}" />
      </div>
      <p class="task-text">${prompt.situation}</p>
      <ul>${prompt.points.map((point) => `<li>${point}</li>`).join("")}</ul>
    </article>
  `).join("");

  dom["writing-prompts"].querySelectorAll("[data-writing-prompt]").forEach((card) => {
    card.addEventListener("click", () => {
      state.selectedWritingPrompt = Number(card.dataset.writingPrompt);
      renderWriting();
    });
  });
}

function renderSpeaking() {
  dom["speaking-tasks"].innerHTML = state.test.speaking.map((task) => `
    <article class="speaking-card">
      <strong>${task.title}</strong>
      ${task.picture ? renderPicturePrompt(task.picture) : ""}
      <ul>${task.points.map((point) => `<li>${point}</li>`).join("")}</ul>
    </article>
  `).join("");
}

function renderPicturePrompt(picture) {
  return `
    <div class="picture-prompt" aria-label="Picture prompt: ${picture.scene}">
      <figure class="photo-frame">
        <img class="picture-photo" src="${picture.image}" alt="Realistisches Übungsbild zum Thema ${picture.topic}" loading="lazy" />
        <figcaption>${picture.scene}</figcaption>
      </figure>
      <div>
        <span class="task-type">${picture.scene}</span>
        <p><strong>Thema:</strong> ${picture.topic}</p>
        <p><strong>Ort/Situation:</strong> ${picture.setting}</p>
        <p>${picture.people}</p>
        <ul class="picture-observations">${picture.observations.map((detail) => `<li>${detail}</li>`).join("")}</ul>
        <p><strong>Meinung/Vermutung:</strong> ${picture.opinionQuestion}</p>
        <p class="picture-tags">${picture.usefulWords.map((detail) => `<span>${detail}</span>`).join("")}</p>
      </div>
    </div>
  `;
}

function renderRubrics() {
  dom["writing-rubric"].innerHTML = writingRubricItems.map((item, index) => `
    <label><input type="checkbox" data-writing-rubric="${index}" /> <span>${item}</span></label>
  `).join("");
  dom["speaking-rubric"].innerHTML = speakingRubricItems.map((item, index) => `
    <label><input type="checkbox" data-speaking-rubric="${index}" /> <span>${item}</span></label>
  `).join("");
}

function playCurrentListening() {
  const firstUnanswered = state.test.listening.find((task) => task.answer === undefined) || state.test.listening[0];
  speakTask(firstUnanswered.id);
}

function speakTask(id) {
  const task = state.test.listening.find((item) => item.id === id);
  if (!task || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(task.audio);
  const voices = window.speechSynthesis.getVoices();
  utterance.voice = voices.find((voice) => voice.lang.toLowerCase().startsWith("de")) || null;
  utterance.lang = "de-DE";
  utterance.rate = 0.92;
  window.speechSynthesis.speak(utterance);
}

function updateWordCount() {
  const text = dom["writing-answer"].value.trim();
  const count = text ? text.split(/\s+/).length : 0;
  dom["word-count"].textContent = `${count} ${count === 1 ? "word" : "words"}`;
}

function toggleTimer() {
  if (state.timerRunning) {
    stopTimer();
    return;
  }
  state.timerRunning = true;
  dom["timer-toggle"].textContent = "Pause";
  state.timerId = window.setInterval(() => {
    state.timerSeconds = Math.max(0, state.timerSeconds - 1);
    updateTimerDisplay();
    if (state.timerSeconds === 0) stopTimer();
  }, 1000);
}

function stopTimer() {
  state.timerRunning = false;
  dom["timer-toggle"].textContent = "Start";
  if (state.timerId) window.clearInterval(state.timerId);
  state.timerId = null;
}

function resetTimer() {
  stopTimer();
  state.timerSeconds = sectionDurations[state.currentSection];
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const minutes = String(Math.floor(state.timerSeconds / 60)).padStart(2, "0");
  const seconds = String(state.timerSeconds % 60).padStart(2, "0");
  dom["timer"].textContent = `${minutes}:${seconds}`;
  dom["timer-label"].textContent = `${capitalize(state.currentSection)} Timer`;
}

function toggleReviewMode() {
  state.reviewMode = !state.reviewMode;
  document.body.classList.toggle("review-mode", state.reviewMode);
  markReviewedAnswers();
}

function markReviewedAnswers() {
  document.querySelectorAll(".answer-option").forEach((label) => {
    label.classList.remove("correct", "incorrect");
  });
  if (!state.reviewMode) return;

  [...state.test.listening, ...state.test.reading].forEach((task) => {
    const card = document.querySelector(`[data-task="${task.id}"]`);
    if (!card) return;
    card.querySelectorAll(".answer-option").forEach((label) => {
      const option = Number(label.dataset.option);
      if (option === task.correct) label.classList.add("correct");
      if (task.answer === option && task.answer !== task.correct) label.classList.add("incorrect");
    });
  });
}

async function toggleRecording() {
  if (state.recorder && state.recorder.state === "recording") {
    state.recorder.stop();
    return;
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    dom["recording-status"].textContent = "Recording is not available in this browser.";
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    state.recordedChunks = [];
    state.recorder = new MediaRecorder(stream);
    state.recorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) state.recordedChunks.push(event.data);
    });
    state.recorder.addEventListener("stop", () => {
      const blob = new Blob(state.recordedChunks, { type: "audio/webm" });
      dom["recording-playback"].src = URL.createObjectURL(blob);
      dom["recording-status"].textContent = "Recording saved for playback.";
      dom["record-toggle"].textContent = "Record Practice";
      stream.getTracks().forEach((track) => track.stop());
    });
    state.recorder.start();
    dom["recording-status"].textContent = "Recording...";
    dom["record-toggle"].textContent = "Stop Recording";
  } catch {
    dom["recording-status"].textContent = "Microphone permission was not granted.";
  }
}

function calculateResult() {
  const listeningScore = state.test.listening.filter((task) => task.answer === task.correct).length;
  const readingScore = state.test.reading.filter((task) => task.answer === task.correct).length;
  const hlScore = listeningScore + readingScore;
  const listeningTotal = state.test.listening.length;
  const readingTotal = state.test.reading.length;
  const hlTotal = listeningTotal + readingTotal;
  const writingChecks = document.querySelectorAll("[data-writing-rubric]:checked").length;
  const speakingChecks = document.querySelectorAll("[data-speaking-rubric]:checked").length;
  const wordCount = dom["writing-answer"].value.trim() ? dom["writing-answer"].value.trim().split(/\s+/).length : 0;
  const writingScore = Math.min(20, (writingChecks * 3) + (wordCount >= 60 ? 2 : wordCount >= 35 ? 1 : 0));
  const speakingScore = Math.min(100, Math.round((speakingChecks / speakingRubricItems.length) * 100));
  const result = {
    date: new Date().toISOString(),
    theme: state.test.theme,
    hlScore,
    hlTotal,
    listeningScore,
    listeningTotal,
    readingScore,
    readingTotal,
    writingScore,
    speakingScore,
    hlLevel: levelHL(hlScore, hlTotal),
    writingLevel: levelWriting(writingScore),
    speakingLevel: levelSpeaking(speakingScore)
  };
  result.overall = result.speakingLevel === "B1" && (result.hlLevel === "B1" || result.writingLevel === "B1") ? "B1 likely" : "More practice needed";
  state.latestResult = result;
  saveAttempt(result);
  renderResults(result);
  updateDashboard();
  renderHistory();
  switchView("results");
}

function levelHL(score, total = 45) {
  const ratio = score / total;
  if (ratio >= 0.73) return "B1";
  if (ratio >= 0.44) return "A2";
  return "Unter A2";
}

function levelWriting(score) {
  if (score >= 15) return "B1";
  if (score >= 7) return "A2";
  return "Unter A2";
}

function levelSpeaking(score) {
  if (score >= 75) return "B1";
  if (score >= 35) return "A2";
  return "Unter A2";
}

function renderResults(result) {
  dom["results-empty"].hidden = true;
  dom["results-content"].hidden = false;
  dom["overall-result"].textContent = result.overall;
  dom["overall-explanation"].textContent = result.overall === "B1 likely"
    ? "Your self-assessment meets the DTZ-style rule: B1 in speaking and B1 in at least one written part."
    : "For a B1-style result, focus on reaching B1 in speaking and B1 in either Hören + Lesen or Schreiben.";
  const hlTotal = result.hlTotal || 45;
  dom["score-hl"].textContent = `${result.hlScore} / ${hlTotal}`;
  dom["level-hl"].textContent = result.hlLevel;
  dom["score-writing"].textContent = `${result.writingScore} / 20`;
  dom["level-writing"].textContent = result.writingLevel;
  dom["score-speaking"].textContent = `${result.speakingScore} / 100`;
  dom["level-speaking"].textContent = result.speakingLevel;
  dom["review-list"].innerHTML = buildReview(result).map((item) => `
    <article class="review-item ${item.kind}">
      <strong>${item.title}</strong>
      <p>${item.text}</p>
    </article>
  `).join("");
}

function buildReview(result) {
  return [
    {
      kind: result.hlLevel === "B1" ? "good" : "watch",
      title: "Hören + Lesen",
      text: `You scored ${result.listeningScore}/${result.listeningTotal || 20} in Hören and ${result.readingScore}/${result.readingTotal || 25} in Lesen. Review mode shows the correct choices and listening transcripts.`
    },
    {
      kind: result.writingLevel === "B1" ? "good" : "watch",
      title: "Schreiben",
      text: "The writing score is estimated from your checklist and word count. For real preparation, ask a teacher or advanced speaker to mark grammar, vocabulary, content, and structure."
    },
    {
      kind: result.speakingLevel === "B1" ? "good" : "watch",
      title: "Sprechen",
      text: "Speaking is self-rated here. Record yourself and check whether you answer directly, ask questions, react naturally, and give reasons."
    }
  ];
}

function saveAttempt(result) {
  const history = getHistory();
  history.unshift(result);
  localStorage.setItem("dtz-history", JSON.stringify(history.slice(0, 12)));
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem("dtz-history") || "[]");
  } catch {
    return [];
  }
}

function renderHistory() {
  const history = getHistory();
  dom["history-list"].innerHTML = history.length ? history.map((item) => `
    <article class="history-item">
      <div>
        <strong>${new Date(item.date).toLocaleString()}</strong>
        <p>${item.theme} · H+L ${item.hlScore}/${item.hlTotal || 45} (${item.hlLevel}) · Schreiben ${item.writingScore}/20 (${item.writingLevel}) · Sprechen ${item.speakingScore}/100 (${item.speakingLevel})</p>
      </div>
      <strong>${item.overall}</strong>
    </article>
  `).join("") : `
    <div class="empty-state">
      <h3>No saved attempts</h3>
      <p>Your calculated mock test results will appear here.</p>
    </div>
  `;
}

function clearHistory() {
  localStorage.removeItem("dtz-history");
  renderHistory();
  updateDashboard();
}

function updateDashboard() {
  const history = getHistory();
  const latest = history[0];
  dom["attempt-count"].textContent = history.length;
  dom["latest-hl"].textContent = latest ? `${latest.hlScore}/${latest.hlTotal || 45} · ${latest.hlLevel}` : "No attempt";
  dom["latest-writing"].textContent = latest ? `${latest.writingScore}/20 · ${latest.writingLevel}` : "No attempt";
  dom["latest-speaking"].textContent = latest ? `${latest.speakingScore}/100 · ${latest.speakingLevel}` : "No attempt";
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function rotateSelect(items, count, offset = 0) {
  return Array.from({ length: count }, (_, index) => items[(offset + index) % items.length]);
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
