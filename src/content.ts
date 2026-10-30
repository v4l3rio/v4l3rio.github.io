export type Language = "en" | "it";
type Localized = Record<Language, string>;

export const links = {
  email: "mailto:diziovalerio@gmail.com",
  github: "https://github.com/v4l3rio",
  linkedin: "https://www.linkedin.com/in/valerio-di-zio-a343b8217",
  cv: {
    it: "/cv/Valerio_Di_Zio_CV_ATS_IT.pdf",
    en: "/cv/Valerio_Di_Zio_CV_ATS_EN.pdf",
  },
};

export const copy = {
  en: {
    skip: "Skip to content", navLabel: "Main navigation", menu: "Menu", close: "Close menu",
    work: "Experience", projects: "Projects", about: "About", contact: "Contact",
    otherLanguage: "Italiano", themeLight: "Switch to light mode", themeDark: "Switch to dark mode",
    profile: [
      "I’m Valerio, a cloud developer. I currently work on Google Cloud projects: I build backend services, mainly in Python but not exclusively, and work directly with clients to understand what they need and how best to approach it.",
      "I graduated with honours in 2025 from the University of Bologna (Cesena campus), with an MSc in Computer Science and Engineering and a thesis on fairness in machine learning. I’m mostly interested in cloud architecture and artificial intelligence.",
      "Outside work, I like cooking, 3D printing, video games and collecting. I try to stay active and spend time with friends."
    ],
    viewWork: "View my projects", download: "Download CV", location: "Cesena, Italy",
    availability: "Remote, hybrid or on-site", focus: "Google Cloud · Python · FastAPI",
    workIntro: "What I do, and where I have worked.", current: "Current role",
    workPrivacy: "Client work is described in general terms to respect confidentiality.",
    skills: "Technologies & skills", skillsIntro: "Technologies used at work and in university and personal projects.",
    projectsIntro: "Selected work from my university studies, with public code to read.", thesis: "MSc thesis",
    repository: "GitHub repository", dataset: "Research dataset", documentation: "Documentation",
    archive: "Earlier university projects", archiveIntro: "Other projects from my studies, kept here as part of my learning history.",
    education: "Education", degree: "MSc in Computer Science and Engineering", university: "University of Bologna, Cesena",
    grade: "Final grade: 110/110 cum laude (highest distinction)", languages: "Languages", languageDetail: "Italian, native. English, B2 (university exam).",
    interests: "Away from the keyboard", interestsDetail: "I enjoy 3D printing, going to the gym, video games and collecting.",
    qualifications: "A little more about me.", credentials: "Certifications & learning", credential: "View credential",
    completion: "Certificate of completion", preparation: "In preparation", target: "Target: late October 2026. Exam not yet booked.",
    contactTitle: "Say hello.", contactCopy: "To discuss a role, a project or something we have in common, you can reach me here.",
    italianCV: "CV in Italian", englishCV: "CV in English", footer: "Valerio Di Zio · Cesena, Italy",
    error: "The interactive page could not load.", errorCopy: "You can still download my CV or contact me by email.", retry: "Reload page",
  },
  it: {
    skip: "Vai al contenuto", navLabel: "Navigazione principale", menu: "Menu", close: "Chiudi menu",
    work: "Esperienza", projects: "Progetti", about: "Chi sono", contact: "Contatti",
    otherLanguage: "English", themeLight: "Passa alla modalità chiara", themeDark: "Passa alla modalità scura",
    profile: [
      "Sono Valerio, sviluppatore cloud. Attualmente mi occupo di progetti su Google Cloud: sviluppo servizi backend, principalmente in Python ma non solo, e lavoro a contatto con i clienti per capire cosa serve loro e come affrontarlo.",
      "Mi sono laureato con lode nel 2025 all’Università di Bologna (campus di Cesena), con la magistrale in Ingegneria e Scienze Informatiche e una tesi sulla fairness nel machine learning. Mi interessano soprattutto l’architettura cloud e l’intelligenza artificiale.",
      "Fuori dal lavoro mi piace cucinare, stampare in 3D, giocare ai videogiochi e collezionare. Cerco di tenermi in movimento e di passare tempo con gli amici."
    ],
    viewWork: "Vedi i miei progetti", download: "Scarica il CV", location: "Cesena, Emilia-Romagna",
    availability: "Remoto, ibrido o in presenza", focus: "Google Cloud · Python · FastAPI",
    workIntro: "Di cosa mi occupo e dove ho lavorato.", current: "Ruolo attuale",
    workPrivacy: "Le attività per i clienti sono descritte in termini generali, nel rispetto della riservatezza.",
    skills: "Tecnologie e competenze", skillsIntro: "Tecnologie utilizzate nel lavoro, nei progetti universitari e personali.",
    projectsIntro: "Una selezione dei progetti universitari, con codice pubblico da consultare.", thesis: "Tesi magistrale",
    repository: "Repository GitHub", dataset: "Dataset di ricerca", documentation: "Documentazione",
    archive: "Altri progetti universitari", archiveIntro: "Altri lavori realizzati durante gli studi, conservati come parte del mio percorso.",
    education: "Formazione", degree: "Laurea magistrale in Ingegneria e Scienze Informatiche", university: "Università di Bologna, Cesena",
    grade: "110/110 e lode", languages: "Lingue", languageDetail: "Italiano, madrelingua. Inglese, B2 (esame universitario).",
    interests: "Fuori dal lavoro", interestsDetail: "Mi piacciono la stampa 3D, la palestra, i videogiochi e il collezionismo.",
    qualifications: "Qualcosa in più su di me.", credentials: "Certificazioni e formazione", credential: "Vedi credenziale",
    completion: "Attestato di completamento", preparation: "In preparazione", target: "Obiettivo: fine ottobre 2026. Esame non ancora prenotato.",
    contactTitle: "Parliamone.", contactCopy: "Per parlare di un’opportunità, di un progetto o di un interesse in comune, puoi scrivermi qui.",
    italianCV: "CV in italiano", englishCV: "CV in inglese", footer: "Valerio Di Zio · Cesena, Italia",
    error: "Non è stato possibile caricare la pagina interattiva.", errorCopy: "Puoi comunque scaricare il CV o contattarmi via email.", retry: "Ricarica la pagina",
  },
} as const;

export const experience: { company: string; role: Localized; date: Localized; details: Record<Language, string[]> }[] = [
  {
    company: "Go Reply", role: { en: "Cloud Developer / IT Consultant", it: "Cloud Developer / IT Consultant" },
    date: { en: "September 2025 – present", it: "Settembre 2025 – oggi" },
    details: {
      en: [
        "I contribute to Google Cloud solution design and development, from gathering client requirements to evaluating POCs and architecture choices.",
        "I build Python and FastAPI services for serverless applications, data processing and cloud integrations.",
        "I develop Google ADK agents integrated with BigQuery and contribute to CI/CD, IAM, monitoring, logging, troubleshooting and technical support.",
      ],
      it: [
        "Contribuisco alla progettazione e allo sviluppo di soluzioni su Google Cloud per i clienti, dalla raccolta dei requisiti alla valutazione di POC e scelte architetturali.",
        "Realizzo servizi Python e FastAPI per applicazioni serverless, elaborazione dati e integrazioni cloud.",
        "Sviluppo agenti con Google ADK integrati con BigQuery e contribuisco a CI/CD, IAM, monitoraggio, logging, troubleshooting e supporto tecnico.",
      ],
    },
  },
  {
    company: "SER.IN.AR", role: { en: "IT Trainer", it: "Formatore informatico" },
    date: { en: "2024 – 2025", it: "2024 – 2025" },
    details: {
      en: ["I delivered four courses to four groups: basic Excel for school staff, LEGO Mindstorms robotics for a middle school class, and Snap programming for two primary school classes."],
      it: ["Ho tenuto quattro corsi per quattro gruppi: Excel base per personale scolastico, robotica LEGO Mindstorms per una classe di scuola media e programmazione Snap per due classi di scuola primaria."],
    },
  },
  {
    company: "Visup", role: { en: "Frontend Developer", it: "Frontend Developer" },
    date: { en: "May – December 2023", it: "Maggio – dicembre 2023" },
    details: {
      en: ["I developed the Angular frontend of an Industry 4.0 data visualisation dashboard, collaborating in an Agile team with Git and CI/CD."],
      it: ["Ho sviluppato il frontend Angular di una dashboard di visualizzazione dei dati per l’Industria 4.0, collaborando in un team Agile con Git e CI/CD."],
    },
  },
];

export const skills: { id: string; label: Localized; value: Localized; wide?: boolean }[] = [
  {
    "id": "languages",
    "label": {
      "en": "Languages",
      "it": "Linguaggi"
    },
    "value": {
      "en": "Python, Kotlin, Scala, Java, TypeScript, JavaScript, SQL.",
      "it": "Python, Kotlin, Scala, Java, TypeScript, JavaScript, SQL."
    }
  },
  {
    "id": "backend",
    "label": {
      "en": "Backend & integrations",
      "it": "Backend e integrazioni"
    },
    "value": {
      "en": "FastAPI, Pydantic, Node.js, Express, gRPC, RabbitMQ, Socket.IO, Akka Typed.",
      "it": "FastAPI, Pydantic, Node.js, Express, gRPC, RabbitMQ, Socket.IO, Akka Typed."
    }
  },
  {
    "id": "frontend",
    "label": {
      "en": "Frontend",
      "it": "Frontend"
    },
    "value": {
      "en": "Angular (previous experience), Vue.js, React, HTML, CSS.",
      "it": "Angular (esperienza precedente), Vue.js, React, HTML, CSS."
    }
  },
  {
    "id": "data",
    "label": {
      "en": "Data",
      "it": "Dati"
    },
    "value": {
      "en": "PostgreSQL, MongoDB, NumPy, pandas, SciPy, Apache Spark / MLlib, Amazon S3.",
      "it": "PostgreSQL, MongoDB, NumPy, pandas, SciPy, Apache Spark / MLlib, Amazon S3."
    }
  },
  {
    "id": "ai",
    "label": {
      "en": "AI & machine learning",
      "it": "AI e machine learning"
    },
    "value": {
      "en": "Google ADK, Datapizza AI, scikit-learn, PyTorch, TensorFlow, Hugging Face Transformers, MidiTok; fairness and reinforcement learning.",
      "it": "Google ADK, Datapizza AI, scikit-learn, PyTorch, TensorFlow, Hugging Face Transformers, MidiTok; fairness e reinforcement learning."
    },
    "wide": true
  },
  {
    "id": "cloud",
    "label": {
      "en": "Google Cloud (GCP)",
      "it": "Google Cloud (GCP)"
    },
    "value": {
      "en": "Cloud Run, Cloud Storage, BigQuery, Firestore, Pub/Sub, Cloud Tasks, Cloud Scheduler, IAM, Secret Manager, Cloud Monitoring, Cloud Logging.",
      "it": "Cloud Run, Cloud Storage, BigQuery, Firestore, Pub/Sub, Cloud Tasks, Cloud Scheduler, IAM, Secret Manager, Cloud Monitoring, Cloud Logging."
    },
    "wide": true
  },
  {
    "id": "devops",
    "label": {
      "en": "DevOps & build",
      "it": "DevOps e build"
    },
    "value": {
      "en": "Git, Docker, Docker Compose, GitHub Actions, Cloud Build, CI/CD, Gradle, sbt, Poetry.",
      "it": "Git, Docker, Docker Compose, GitHub Actions, Cloud Build, CI/CD, Gradle, sbt, Poetry."
    }
  },
  {
    "id": "testing",
    "label": {
      "en": "Testing",
      "it": "Test"
    },
    "value": {
      "en": "pytest, unittest, ScalaTest, Kotest, JUnit, Cucumber (BDD), Playwright.",
      "it": "pytest, unittest, ScalaTest, Kotest, JUnit, Cucumber (BDD), Playwright."
    }
  },
  {
    "id": "architecture",
    "label": {
      "en": "Architecture & methods",
      "it": "Architetture e metodi"
    },
    "value": {
      "en": "Serverless, microservices, hexagonal architecture, event-driven systems, functional programming, DSLs, Agile/Scrum.",
      "it": "Serverless, microservizi, architettura esagonale, sistemi a eventi, programmazione funzionale, DSL, Agile/Scrum."
    },
    "wide": true
  }
];

export const projects = [
  {
    name: "FairLib", tech: "Python · Machine learning fairness",
    category: { en: "Fairness in machine learning", it: "Fairness nel machine learning" },
    description: {
      en: "For my MSc thesis, I worked on a Python library applying fairness techniques in pre-processing and in-processing, integrating and improving the existing implementation.",
      it: "Per la mia tesi magistrale ho lavorato a una libreria Python che applica tecniche di fairness in pre-processing e in-processing, integrando e migliorando l’implementazione esistente.",
    },
    note: {
      en: "The library was used in the European AEQUITAS project. I am listed as a contributor to an AEQUITAS research dataset on Zenodo.",
      it: "La libreria è stata utilizzata nel progetto europeo AEQUITAS. Sono indicato come contributore a un dataset di ricerca del progetto su Zenodo.",
    },
    repo: "https://github.com/pikalab-unibo-students/master-thesis-dizio-ay2324",
    proof: "https://zenodo.org/records/11171863", proofType: "dataset",
  },
  {
    name: "PositionPal", tech: "Kotlin · gRPC · RabbitMQ · PostgreSQL",
    category: { en: "User service", it: "Gestione utenti" },
    description: {
      en: "I worked on the user registration and profile microservice, with hexagonal architecture, automated tests and contributions to the CI/CD pipeline. Part of a group project.",
      it: "Mi sono occupato del microservizio per registrazione e profilo utenti, con architettura esagonale, test automatici e contributi alla pipeline CI/CD, all’interno di un progetto di gruppo.",
    },
    repo: "https://github.com/position-pal/user-service", proof: "https://position-pal.github.io/", proofType: "documentation",
  },
  {
    name: "NesGen", tech: "Python · TensorFlow · PyTorch · MidiTok",
    category: { en: "Generative music", it: "Musica generativa" },
    description: {
      en: "Transformer and GAN approaches for generating NES-style MIDI music, including tokenization and fine-tuning on the NES-MDB dataset.",
      it: "Approcci Transformer e GAN per generare musica MIDI in stile NES, con tokenizzazione e fine-tuning sul dataset NES-MDB.",
    },
    repo: "https://github.com/roostico/NesGen",
  },
  {
    name: "Scooby", tech: "Scala 3 · Akka Typed · DSL",
    category: { en: "Web crawler", it: "Web crawler" },
    description: {
      en: "A crawler and scraper with an internal DSL for navigation, extraction and export. Akka Typed manages concurrent execution.",
      it: "Crawler e scraper con DSL interna per navigazione, estrazione ed export. Akka Typed gestisce l’esecuzione concorrente.",
    },
    repo: "https://github.com/roostico/scooby",
  },
];

export const archive = [
  { name: "Sentiment Analysis", year: "2024", url: "https://github.com/v4l3rio/bigData-project" },
  { name: "Collaborative Whiteboard", year: "2023", url: "https://github.com/v4l3rio/Progetto-ASW-CollaborativeWhiteboard" },
  { name: "Flowers iOS Application", year: "2022" },
  { name: "2121: The Last Man Standing", year: "2020", url: "https://github.com/v4l3rio/OOP20-2121TLMS" },
];

export const credentials = [
  {
    title: "Certified Partner Specialist Gemini Enterprise Deployment", issuer: "Google Cloud",
    date: { en: "September 2026 – March 2027", it: "Settembre 2026 – marzo 2027" },
    url: "https://www.credly.com/badges/c3b2ec06-2f65-411f-9cd0-0eaa7604f031/linked_in_profile",
  },
  {
    title: "Generative AI Leader Certification", issuer: "Google Cloud",
    date: { en: "November 2025 – November 2028", it: "Novembre 2025 – novembre 2028" },
    url: "https://www.credly.com/badges/e2c8dc34-88da-40cd-a4fd-f941b3a077f7/linked_in_profile",
  },
  {
    title: "Claude 101", issuer: "Anthropic",
    date: { en: "April 2026", it: "Aprile 2026" },
  },
];
