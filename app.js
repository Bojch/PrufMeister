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
  latestResult: null
};

const themes = [
  "Wohnung und Nachbarschaft",
  "Arbeit und Beruf",
  "Schule und Kinder",
  "Gesundheit und Termine",
  "Behörden und Alltag",
  "Verkehr und Reisen",
  "Einkaufen und Dienstleistungen",
  "Kurs und Weiterbildung"
];

const listeningSeeds = [
  {
    type: "Ansage",
    audio: "Guten Tag. Hier ist die Praxis Dr. Kramer. Ihr Termin am Dienstag muss leider verschoben werden. Bitte kommen Sie am Mittwoch um acht Uhr dreißig. Wenn das nicht passt, rufen Sie uns heute bis siebzehn Uhr an.",
    question: "Was soll die Person tun, wenn der neue Termin nicht passt?",
    options: ["Heute anrufen", "Am Dienstag kommen", "Eine E-Mail schreiben"],
    correct: 0
  },
  {
    type: "Gespräch",
    audio: "Mann: Hast du die Hausordnung gelesen? Frau: Ja, ab zwanzig Uhr soll man die Waschmaschine nicht mehr benutzen. Mann: Dann wasche ich morgen früh. Heute ist es schon zu spät.",
    question: "Warum wäscht der Mann heute nicht?",
    options: ["Die Maschine ist kaputt", "Es ist zu spät", "Er hat kein Waschmittel"],
    correct: 1
  },
  {
    type: "Information",
    audio: "Achtung an Gleis vier. Der Regionalzug nach Bonn fährt heute wegen Bauarbeiten zehn Minuten später ab. Die Wagen der ersten Klasse befinden sich am Ende des Zuges.",
    question: "Was wird mitgeteilt?",
    options: ["Der Zug fällt aus", "Der Zug fährt später", "Der Zug fährt von Gleis zehn"],
    correct: 1
  },
  {
    type: "Meinung",
    audio: "Ich finde den neuen Sprachkurs gut, weil wir viel sprechen. Die Hausaufgaben sind manchmal schwer, aber die Lehrerin erklärt alles ruhig und deutlich.",
    question: "Wie findet die Person den Kurs?",
    options: ["Meistens positiv", "Zu teuer", "Langweilig"],
    correct: 0
  },
  {
    type: "Nachricht",
    audio: "Hallo Samira, ich stehe noch beim Bürgeramt. Es dauert länger als gedacht. Kannst du bitte die Kinder um vier Uhr vom Sport abholen? Danke dir.",
    question: "Worum bittet die Person?",
    options: ["Um Hilfe beim Antrag", "Um Abholung der Kinder", "Um einen Termin im Bürgeramt"],
    correct: 1
  },
  {
    type: "Radio",
    audio: "Am Wochenende bleibt das Schwimmbad wegen Reinigungsarbeiten geschlossen. Ab Montag gelten wieder die normalen Öffnungszeiten von sechs bis zwanzig Uhr.",
    question: "Wann öffnet das Schwimmbad wieder normal?",
    options: ["Am Samstag", "Am Sonntag", "Am Montag"],
    correct: 2
  }
];

const readingSeeds = [
  {
    type: "Anzeige",
    text: "Hausmeisterservice Ali sucht ab sofort eine zuverlässige Reinigungskraft für Treppenhäuser. Arbeitszeit: Montag bis Freitag, jeweils 7 bis 10 Uhr. Erfahrung ist gut, aber nicht notwendig. Bewerbung telefonisch ab 14 Uhr.",
    question: "Wann soll man anrufen?",
    options: ["Vor 10 Uhr", "Ab 14 Uhr", "Nur am Wochenende"],
    correct: 1
  },
  {
    type: "E-Mail",
    text: "Liebe Eltern, am Freitag macht die Klasse 5b einen Ausflug in den Stadtpark. Bitte geben Sie Ihrem Kind ein Getränk, eine Regenjacke und das unterschriebene Formular mit. Der Unterricht endet wie gewohnt um 13 Uhr.",
    question: "Was sollen die Eltern mitgeben?",
    options: ["Eine Fahrkarte", "Ein Formular", "Sportschuhe"],
    correct: 1
  },
  {
    type: "Hinweis",
    text: "Wegen einer Betriebsversammlung bleibt die Stadtbibliothek am Mittwochvormittag geschlossen. Die Rückgabe-Automaten im Eingangsbereich können trotzdem benutzt werden.",
    question: "Was ist am Mittwochvormittag möglich?",
    options: ["Bücher zurückgeben", "Neue Bücher ausleihen", "An einem Kurs teilnehmen"],
    correct: 0
  },
  {
    type: "Brief",
    text: "Sehr geehrte Frau Nguyen, vielen Dank für Ihre Anfrage. Die Reparatur Ihres Kühlschranks ist am Donnerstag zwischen 12 und 15 Uhr möglich. Bitte bestätigen Sie den Termin bis morgen.",
    question: "Was soll Frau Nguyen tun?",
    options: ["Den Kühlschrank bringen", "Den Termin bestätigen", "Die Rechnung bezahlen"],
    correct: 1
  },
  {
    type: "Kurzmeldung",
    text: "Das Jobcenter bietet im Juni kostenlose Workshops zum Thema Bewerbung an. Teilnehmende üben Lebenslauf, Anschreiben und Vorstellungsgespräch. Eine Anmeldung ist online oder persönlich möglich.",
    question: "Was kann man im Workshop üben?",
    options: ["Eine Prüfung schreiben", "Bewerbungsunterlagen erstellen", "Deutsch unterrichten"],
    correct: 1
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
    "latest-writing", "latest-speaking", "attempt-count"
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
  const theme = pick(themes);
  state.test = {
    id: version,
    theme,
    listening: buildListening(),
    reading: buildReading(),
    writing: shuffle(writingPrompts).slice(0, 2),
    speaking: buildSpeaking(theme)
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

function buildListening() {
  const tasks = [];
  for (let i = 0; i < 20; i += 1) {
    const seed = listeningSeeds[i % listeningSeeds.length];
    const variant = Math.floor(i / listeningSeeds.length) + 1;
    tasks.push({
      id: `h-${i}`,
      number: i + 1,
      type: seed.type,
      audio: variantAudio(seed.audio, variant),
      question: seed.question,
      options: seed.options,
      correct: seed.correct
    });
  }
  return shuffle(tasks).map((task, index) => ({ ...task, number: index + 1 }));
}

function variantAudio(text, variant) {
  if (variant === 1) return text;
  const replacements = [
    ["Dienstag", "Donnerstag"],
    ["Mittwoch", "Freitag"],
    ["acht Uhr dreißig", "neun Uhr fünfzehn"],
    ["zwanzig Uhr", "einundzwanzig Uhr"],
    ["Montag", "Dienstag"],
    ["Freitag", "Donnerstag"],
    ["vier Uhr", "fünf Uhr"],
    ["Juni", "Juli"]
  ];
  return replacements.reduce((current, pair, index) => {
    if ((variant + index) % 2 === 0) return current.replace(pair[0], pair[1]);
    return current;
  }, text);
}

function buildReading() {
  const tasks = [];
  for (let i = 0; i < 25; i += 1) {
    const seed = readingSeeds[i % readingSeeds.length];
    const suffix = i >= readingSeeds.length ? `\n\nZusatzhinweis: Bitte beachten Sie die genannten Zeiten und Fristen genau.` : "";
    tasks.push({
      id: `r-${i}`,
      number: i + 1,
      type: `Teil ${(i % 5) + 1}: ${seed.type}`,
      text: seed.text + suffix,
      question: seed.question,
      options: seed.options,
      correct: seed.correct
    });
  }
  return tasks;
}

function buildSpeaking(theme) {
  const planningOptions = [
    ["Sie möchten mit Ihrer Kursgruppe eine Prüfungsvorbereitung organisieren.", "Wann treffen Sie sich?", "Welche Materialien brauchen Sie?", "Wer bereitet welche Aufgabe vor?"],
    ["Sie planen mit einer Nachbarin ein Hoffest.", "Wann soll das Fest stattfinden?", "Wer lädt die Gäste ein?", "Was brauchen Sie für Essen, Musik und Aufräumen?"],
    ["Sie möchten mit einem Freund ein Geschenk für eine Lehrerin kaufen.", "Was kaufen Sie?", "Wie viel darf es kosten?", "Wann und wo übergeben Sie das Geschenk?"]
  ];
  const picture = pick(picturePrompts);

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
    { title: "Teil 3: Gemeinsam etwas planen", points: pick(planningOptions), theme }
  ];
}

function renderTest() {
  renderListening();
  renderReading();
  renderWriting();
  renderSpeaking();
  renderRubrics();
  switchView(state.currentView);
}

function renderListening() {
  dom["listening-tasks"].innerHTML = state.test.listening.map((task) => `
    <article class="task-card" data-task="${task.id}">
      <div class="task-topline">
        <strong>Aufgabe ${task.number}</strong>
        <span class="task-type">${task.type}</span>
      </div>
      <p>${task.question}</p>
      <div class="audio-row">
        <button class="secondary-button compact" type="button" data-play="${task.id}">Play Audio</button>
        <span class="task-text">Listen up to two times, then answer.</span>
      </div>
      <div class="answers">${renderOptions("listening", task)}</div>
      <div class="transcript"><strong>Transcript:</strong> ${task.audio}</div>
    </article>
  `).join("");

  dom["listening-tasks"].querySelectorAll("[data-play]").forEach((button) => {
    button.addEventListener("click", () => speakTask(button.dataset.play));
  });
  bindAnswerEvents(dom["listening-tasks"]);
}

function renderReading() {
  dom["reading-tasks"].innerHTML = state.test.reading.map((task) => `
    <article class="task-card" data-task="${task.id}">
      <div class="task-topline">
        <strong>Aufgabe ${task.number}</strong>
        <span class="task-type">${task.type}</span>
      </div>
      <p class="task-text">${escapeHtml(task.text)}</p>
      <p>${task.question}</p>
      <div class="answers">${renderOptions("reading", task)}</div>
    </article>
  `).join("");
  bindAnswerEvents(dom["reading-tasks"]);
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
  const writingChecks = document.querySelectorAll("[data-writing-rubric]:checked").length;
  const speakingChecks = document.querySelectorAll("[data-speaking-rubric]:checked").length;
  const wordCount = dom["writing-answer"].value.trim() ? dom["writing-answer"].value.trim().split(/\s+/).length : 0;
  const writingScore = Math.min(20, (writingChecks * 3) + (wordCount >= 60 ? 2 : wordCount >= 35 ? 1 : 0));
  const speakingScore = Math.min(100, Math.round((speakingChecks / speakingRubricItems.length) * 100));
  const result = {
    date: new Date().toISOString(),
    theme: state.test.theme,
    hlScore,
    listeningScore,
    readingScore,
    writingScore,
    speakingScore,
    hlLevel: levelHL(hlScore),
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

function levelHL(score) {
  if (score >= 33) return "B1";
  if (score >= 20) return "A2";
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
  dom["score-hl"].textContent = `${result.hlScore} / 45`;
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
      text: `You scored ${result.listeningScore}/20 in Hören and ${result.readingScore}/25 in Lesen. Review mode shows the correct choices and listening transcripts.`
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
        <p>${item.theme} · H+L ${item.hlScore}/45 (${item.hlLevel}) · Schreiben ${item.writingScore}/20 (${item.writingLevel}) · Sprechen ${item.speakingScore}/100 (${item.speakingLevel})</p>
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
  dom["latest-hl"].textContent = latest ? `${latest.hlScore}/45 · ${latest.hlLevel}` : "No attempt";
  dom["latest-writing"].textContent = latest ? `${latest.writingScore}/20 · ${latest.writingLevel}` : "No attempt";
  dom["latest-speaking"].textContent = latest ? `${latest.speakingScore}/100 · ${latest.speakingLevel}` : "No attempt";
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
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
