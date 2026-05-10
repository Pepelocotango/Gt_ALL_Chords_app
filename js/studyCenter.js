// Centre d'estudi - Documentació interactiva
// Requereix: chordData.js, chordEngine.js

const DOC_CATEGORIES = ['Tots', 'Acords', 'Màstil', 'Harmonia', 'Flamenc', 'Ritme', 'Fonts'];

const DOCS = [
  {
    title: 'Acords i tensions',
    category: 'Acords',
    kind: 'pdf',
    src: 'documentacio_per _treball/acords i tensions.pdf',
    source: 'acords i tensions.pdf',
    summary: 'Taula de graus per tipus d\'acord: maj, m, dim, setenes, add, 9, 11, 13 i alteracions.',
    tags: ['acords', 'tensions', 'graus', 'extensions'],
    chordTypes: ['', 'm', 'dim', '7', 'm7', 'm7b5', 'maj7', 'sus2', 'sus4', 'aug', '6', 'add9', 'm6', 'madd9', 'dim7', '7sus4', '7b5', '7#5', 'mMaj7', '6/9', 'm6/9', '7b9', '7#9', '9', '9b5', '9#5', 'm9', 'maj9', '11', 'm11', 'maj11', '13', 'm13', 'maj13']
  },
  {
    title: 'Carta completa d\'acords de guitarra',
    category: 'Acords',
    kind: 'image',
    src: 'documentacio_per _treball/Create-The-Music-Guitar-Chord-Chart-ALL.jpg',
    source: 'Create-The-Music-Guitar-Chord-Chart-ALL.jpg',
    summary: 'Làmina gran amb moltes posicions d\'acords. Útil com a referència visual per comparar digitacions.',
    tags: ['acords', 'diagrames', 'posicions']
  },
  {
    title: 'Acords bàsics',
    category: 'Acords',
    kind: 'image',
    src: 'documentacio_per _treball/acords basics.gif',
    source: 'acords basics.gif',
    summary: 'Graella visual d\'acords oberts i formes bàsiques.',
    tags: ['acords', 'bàsics', 'oberts'],
    chordTypes: ['', 'm', '7']
  },
  {
    title: 'Majors i menors bàsics',
    category: 'Acords',
    kind: 'image',
    src: 'documentacio_per _treball/majors-minor acords basics.jpeg',
    source: 'majors-minor acords basics.jpeg',
    summary: 'Referència compacta d\'acords majors i menors de primera posició.',
    tags: ['majors', 'menors', 'bàsics'],
    chordTypes: ['', 'm']
  },
  {
    title: 'Graella d\'acords 2 colors',
    category: 'Acords',
    kind: 'pdf',
    src: 'assets/docs-generated/graella acords 2 colors.pdf',
    source: 'graella acords 2 colors.ods',
    summary: 'Full de càlcul convertit a PDF amb graella d\'acords en dos colors.',
    tags: ['graella', 'acords', 'ods']
  },
  {
    title: 'Graella d\'acords',
    category: 'Acords',
    kind: 'pdf',
    src: 'assets/docs-generated/graella acords.pdf',
    source: 'graella acords.ods',
    summary: 'Versió base de la graella d\'acords convertida a PDF.',
    tags: ['graella', 'acords', 'ods']
  },
  {
    title: 'Jazz shell voicings',
    category: 'Acords',
    kind: 'pdf',
    src: 'documentacio_per _treball/chods jazz shell voices.pdf',
    source: 'chods jazz shell voices.pdf',
    summary: 'Mètode de shell voicings per reduir acords de jazz a nucli de fonamental, tercera i setena.',
    tags: ['jazz', 'shell voicings', 'setenes'],
    chordTypes: ['maj7', 'm7', '7', 'm7b5', 'dim7', 'mMaj7', '9', 'm9', 'maj9', '13']
  },
  {
    title: 'Notes al màstil',
    category: 'Màstil',
    kind: 'image',
    src: 'documentacio_per _treball/notas en la guitarra.png',
    source: 'notas en la guitarra.png',
    summary: 'Mapa de notes al màstil fins als trasts alts.',
    tags: ['màstil', 'notes', 'diapasó'],
    highlightType: 'notes'
  },
  {
    title: 'Graella del màstil',
    category: 'Màstil',
    kind: 'pdf',
    src: 'assets/docs-generated/GRAELLA MASTIL.pdf',
    source: 'GRAELLA MASTIL.ods',
    summary: 'Full de treball del màstil convertit a PDF.',
    tags: ['màstil', 'graella', 'ods'],
    highlightType: 'notes'
  },
  {
    title: 'Funció tonal al màstil',
    category: 'Màstil',
    kind: 'pdf',
    src: 'documentacio_per _treball/esquema guit funcio tonal OK.pdf',
    source: 'esquema guit funcio tonal OK.pdf',
    summary: 'Esquema de funcions i graus sobre les cordes de la guitarra.',
    tags: ['funció tonal', 'graus', 'màstil'],
    highlightType: 'graus'
  },
  {
    title: 'Funció tonal col2',
    category: 'Màstil',
    kind: 'pdf',
    src: 'documentacio_per _treball/esquema guit funcio tonal OK col2.pdf',
    source: 'esquema guit funcio tonal OK col2.pdf',
    summary: 'Variant de l\'esquema de funció tonal amb segona columna.',
    tags: ['funció tonal', 'màstil'],
    highlightType: 'graus'
  },
  {
    title: 'Funció tonal posicions',
    category: 'Màstil',
    kind: 'pdf',
    src: 'documentacio_per _treball/esquema guit funcio tonal OK col2 pos OK.pdf',
    source: 'esquema guit funcio tonal OK col2 pos OK.pdf',
    summary: 'Versió de funció tonal orientada a posicions.',
    tags: ['posicions', 'funció tonal', 'màstil'],
    highlightType: 'graus'
  },
  {
    title: 'Funció tonal XLS',
    category: 'Màstil',
    kind: 'pdf',
    src: 'assets/docs-generated/esquema guit funcio tonal OK .pdf',
    source: 'esquema guit funcio tonal OK .xls',
    summary: 'Font XLS convertida a PDF per consulta interna.',
    tags: ['xls', 'funció tonal', 'màstil'],
    highlightType: 'graus'
  },
  {
    title: 'Funció tonal ODS col2',
    category: 'Màstil',
    kind: 'pdf',
    src: 'assets/docs-generated/esquema guit funcio tonal OK col2.pdf',
    source: 'esquema guit funcio tonal OK col2.ods',
    summary: 'Font ODS col2 convertida a PDF.',
    tags: ['ods', 'funció tonal', 'màstil'],
    highlightType: 'graus'
  },
  {
    title: 'Roda de quintes',
    category: 'Harmonia',
    kind: 'image',
    src: 'documentacio_per _treball/Rueda-de-quintas.gif',
    source: 'Rueda-de-quintas.gif',
    summary: 'Cercle de quintes amb tonalitats i relacions harmòniques.',
    tags: ['quintes', 'tonalitats', 'harmonia']
  },
  {
    title: 'Cercle cromàtic',
    category: 'Harmonia',
    kind: 'image',
    src: 'documentacio_per _treball/circulocromatico.jpg',
    source: 'circulocromatico.jpg',
    summary: 'Cercle cromàtic amb colors per relacionar notes i distàncies.',
    tags: ['cromàtic', 'notes', 'harmonia']
  },
  {
    title: 'Escala cromàtica Do mòbil',
    category: 'Harmonia',
    kind: 'pdf',
    src: 'assets/docs-generated/ESCALA CROMATICA  DO MOBIL.pdf',
    source: 'ESCALA CROMATICA  DO MOBIL.odt',
    summary: 'Document de Do mòbil convertit a PDF.',
    tags: ['cromàtica', 'do mòbil', 'odt']
  },
  {
    title: 'Afinació natural i temperament',
    category: 'Harmonia',
    kind: 'image',
    src: 'documentacio_per _treball/afinacion natural-temperat.jpg',
    source: 'afinacion natural-temperat.jpg',
    summary: 'Comparativa visual entre afinació natural i sistema temperat.',
    tags: ['afinació', 'temperament', 'freqüències']
  },
  {
    title: 'Coherència harmònica',
    category: 'Harmonia',
    kind: 'image',
    src: 'documentacio_per _treball/coherencia8.jpg',
    source: 'coherencia8.jpg',
    summary: 'Diagrama circular de relacions harmòniques.',
    tags: ['harmonia', 'relacions', 'cercle']
  },
  {
    title: 'Harmonia musical',
    category: 'Harmonia',
    kind: 'image',
    src: 'documentacio_per _treball/1dc26a768b928925980854c30f75a414.jpg',
    source: '1dc26a768b928925980854c30f75a414.jpg',
    summary: 'Làmina de referència d\'harmonia musical.',
    tags: ['harmonia', 'referència']
  },
  {
    title: 'Diccionari flamenc',
    category: 'Flamenc',
    kind: 'pdf',
    src: 'documentacio_per _treball/Diccionario_Flamenco.pdf',
    source: 'Diccionario_Flamenco.pdf',
    summary: 'Diccionari i descripció de palos flamencs amb terminologia.',
    tags: ['flamenc', 'diccionari', 'palos']
  },
  {
    title: 'Palos flamencs',
    category: 'Flamenc',
    kind: 'image',
    src: 'documentacio_per _treball/Palos_flamencos.jpg',
    source: 'Palos_flamencos.jpg',
    summary: 'Arbre visual de palos flamencs i agrupacions.',
    tags: ['flamenc', 'palos', 'estils']
  },
  {
    title: 'Mapa geogràfic flamenc',
    category: 'Flamenc',
    kind: 'image',
    src: 'documentacio_per _treball/Mapa-geografía-flamenca.jpg',
    source: 'Mapa-geografía-flamenca.jpg',
    summary: 'Mapa de zones i referències geogràfiques del flamenc.',
    tags: ['flamenc', 'mapa', 'geografia']
  },
  {
    title: 'Compases flamencos',
    category: 'Ritme',
    kind: 'pdf',
    src: 'documentacio_per _treball/compases.pdf',
    source: 'compases.pdf',
    summary: 'Explicació dels compasos flamencs, accents i estructures de 12 temps.',
    tags: ['compàs', 'flamenc', 'ritme', '12 temps']
  }
];

// Estat
let activeDocCategory = 'Tots';
let activeDocId = 0;
let visibleVoicingLimit = 250;

// Cerca
function docMatches(doc, query) {
  if (!query) return true;
  const haystack = [doc.title, doc.category, doc.source, doc.summary, ...(doc.tags || [])].join(' ').toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function filteredDocs() {
  const query = document.getElementById('docSearch')?.value || '';
  return DOCS
    .map((doc, index) => ({ ...doc, id: index }))
    .filter((doc) => activeDocCategory === 'Tots' || doc.category === activeDocCategory)
    .filter((doc) => docMatches(doc, query));
}

// Seleccionar tipus d'acord des del document
function selectChordType(type) {
  const typeSelect = document.getElementById('typeSelect');
  if (![...typeSelect.options].some((option) => option.value === type)) return;
  typeSelect.value = type;
  visibleVoicingLimit = 250;
  updatePresets();
  document.querySelector('.side-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Renderitzar pestanyes
function renderDocTabs() {
  const tabs = document.getElementById('docTabs');
  tabs.innerHTML = '';
  for (const category of DOC_CATEGORIES) {
    const btn = document.createElement('button');
    btn.className = `doc-tab ${category === activeDocCategory ? 'is-active' : ''}`;
    btn.type = 'button';
    const count = category === 'Tots' ? DOCS.length : DOCS.filter((doc) => doc.category === category).length;
    btn.textContent = `${category} ${count}`;
    btn.addEventListener('click', () => {
      activeDocCategory = category;
      const first = filteredDocs()[0];
      activeDocId = first ? first.id : 0;
      renderDocs();
    });
    tabs.appendChild(btn);
  }
}

// Renderitzar llista
function renderDocList() {
  const list = document.getElementById('docList');
  const docs = filteredDocs();
  list.innerHTML = '';
  if (!docs.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-msg';
    empty.textContent = 'No hi ha resultats.';
    list.appendChild(empty);
    return;
  }
  if (!docs.some((doc) => doc.id === activeDocId)) activeDocId = docs[0].id;
  for (const doc of docs) {
    const btn = document.createElement('button');
    btn.className = `doc-item ${doc.id === activeDocId ? 'is-active' : ''}`;
    btn.type = 'button';
    btn.innerHTML = `<span class="doc-item-title">${doc.title}</span><span class="doc-item-meta">${doc.category} · ${doc.kind.toUpperCase()} · ${doc.source}</span>`;
    btn.addEventListener('click', () => {
      activeDocId = doc.id;
      renderDocs();
    });
    list.appendChild(btn);
  }
}

// Obtenir notes a ressaltar segons el tipus de document
function getHighlightNotes(highlightType) {
  if (!highlightType) return [];
  
  // Per ara, retornem notes per a Do major com a exemple
  // En una implementació completa, això vindria del document seleccionat
  if (highlightType === 'notes') {
    // Do major: C, E, G
    return [0, 4, 7]; 
  }
  if (highlightType === 'graus') {
    // Graus de l'escala major
    return [0, 2, 4, 5, 7, 9, 11];
  }
  return [];
}

// Estat de les pestanyes interactives
let activeInteractiveTab = 'document'; // 'document', 'circleOfFifths', 'chromatic', 'flamenco'

function shouldShowInteractiveTabs(doc) {
  // Mostrar pestanyes interactives per documents específics
  const interactiveCategories = ['Harmonia', 'Flamenc'];
  const interactiveTitles = ['Roda de quintes', 'Cercle cromàtic', 'Escala cromàtica Do mòbil', 'Diccionari flamenc'];
  return interactiveCategories.includes(doc.category) || 
         interactiveTitles.some(t => doc.title.toLowerCase().includes(t.toLowerCase()));
}

// Renderitzar visor
function renderDocViewer() {
  const viewer = document.getElementById('docViewer');
  const doc = DOCS[activeDocId] || DOCS[0];
  
  // Determinar si mostrar pestanyes interactives
  const showTabs = shouldShowInteractiveTabs(doc);
  
  if (showTabs) {
    // Mode amb pestanyes interactives
    renderInteractiveViewer(viewer, doc);
  } else {
    // Mode document estàtic
    renderStaticViewer(viewer, doc);
  }
}

function renderStaticViewer(viewer, doc) {
  const src = encodeURI(doc.src);
  
  // Botons de tipus d'acord
  const chips = (doc.chordTypes || [])
    .filter((type) => CHORDS.some((chord) => chord.s === type))
    .map((type) => {
      const chord = chordBySuffix(type);
      const label = type ? `${chord.label} (${type})` : chord.label;
      return `<button class="doc-chip" type="button" data-chord-type="${type}">${label}</button>`;
    })
    .join('');
  
  // Mini diapasó per documents de màstil (amb ressaltat de notes)
  let miniBoard = '';
  if (doc.highlightType) {
    miniBoard = `<svg id="miniBoard" class="diapaso-mini"></svg>`;
  }
  
  const media = doc.kind === 'image'
    ? `<img src="${src}" alt="${doc.title}">`
    : `<object data="${src}" type="application/pdf"><iframe src="${src}" title="${doc.title}"></iframe></object>`;
  
  viewer.innerHTML = [
    '<div class="doc-viewer-head">',
    `<div class="doc-viewer-title">${doc.title}</div>`,
    `<div class="doc-viewer-summary">${doc.summary}</div>`,
    `<div class="doc-item-meta">${doc.source} · ${doc.category}</div>`,
    chips ? `<div class="doc-chip-row">${chips}</div>` : '',
    miniBoard,
    '</div>',
    `<div class="doc-media">${media}</div>`
  ].join('');
  
  // Event listeners pels botons de tipus d'acord
  viewer.querySelectorAll('[data-chord-type]').forEach((button) => {
    button.addEventListener('click', () => selectChordType(button.dataset.chordType));
  });
  
  // Renderitzar mini diapasó si aplica
  if (doc.highlightType && typeof renderMiniFretboard === 'function') {
    const notes = getHighlightNotes(doc.highlightType);
    renderMiniFretboard(notes);
  }
}

function renderInteractiveViewer(viewer, doc) {
  // Determinar quina pestanya activa segons el document
  const availableTabs = getAvailableTabs(doc);
  
  // Si la pestanya activa no està disponible, tornar a 'document'
  if (!availableTabs.includes(activeInteractiveTab)) {
    activeInteractiveTab = 'document';
  }
  
  // Generar HTML de les pestanyes
  const tabButtons = [
    { id: 'document', label: 'Document', icon: '📄' },
    { id: 'circleOfFifths', label: 'Cercle de Quintes', icon: '🔄' },
    { id: 'chromatic', label: 'Escala Cromàtica', icon: '🎹' },
    { id: 'flamenco', label: 'Diccionari', icon: '📚' }
  ].filter(tab => availableTabs.includes(tab.id));
  
  const tabsHtml = tabButtons.map(tab => 
    `<button class="doc-interactive-tab ${activeInteractiveTab === tab.id ? 'active' : ''}" data-tab="${tab.id}">
      ${tab.icon} ${tab.label}
    </button>`
  ).join('');
  
  // Generar contingut segons la pestanya activa
  let contentHtml = '';
  if (activeInteractiveTab === 'document') {
    // Renderitzar document estàtic
    const src = encodeURI(doc.src);
    const media = doc.kind === 'image'
      ? `<img src="${src}" alt="${doc.title}">`
      : `<object data="${src}" type="application/pdf"><iframe src="${src}" title="${doc.title}"></iframe></object>`;
    contentHtml = `
      <div class="doc-viewer-head">
        <div class="doc-viewer-title">${doc.title}</div>
        <div class="doc-viewer-summary">${doc.summary}</div>
        <div class="doc-item-meta">${doc.source} · ${doc.category}</div>
      </div>
      <div class="doc-media">${media}</div>
    `;
  } else if (activeInteractiveTab === 'circleOfFifths') {
    contentHtml = `<div id="cofContainer"></div>`;
  } else if (activeInteractiveTab === 'chromatic') {
    contentHtml = `<div id="chromaticContainer"></div>`;
  } else if (activeInteractiveTab === 'flamenco') {
    contentHtml = `<div id="flamencoContainer"></div>`;
  }
  
  viewer.innerHTML = `
    <div class="doc-interactive-tabs">${tabsHtml}</div>
    <div class="doc-interactive-content">${contentHtml}</div>
  `;
  
  // Event listeners per les pestanyes
  viewer.querySelectorAll('.doc-interactive-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activeInteractiveTab = tab.dataset.tab;
      renderInteractiveViewer(viewer, doc);
    });
  });
  
  // Inicialitzar el mòdul interactiu corresponent
  if (activeInteractiveTab === 'circleOfFifths' && typeof createCircleOfFifths === 'function') {
    createCircleOfFifths();
  } else if (activeInteractiveTab === 'chromatic' && typeof createChromaticModule === 'function') {
    createChromaticModule();
  } else if (activeInteractiveTab === 'flamenco' && typeof createFlamencoModule === 'function') {
    createFlamencoModule();
  }
}

function getAvailableTabs(doc) {
  const tabs = ['document'];
  
  // Cercle de quintes per documents d'harmonia
  if (doc.category === 'Harmonia' || doc.title.includes('quintes')) {
    tabs.push('circleOfFifths');
  }
  
  // Escala cromàtica per documents d'harmonia o escala
  if (doc.category === 'Harmonia' || doc.title.includes('cromàt') || doc.title.includes('mòbil')) {
    tabs.push('chromatic');
  }
  
  // Diccionari flamenc per documents de flamenc
  if (doc.category === 'Flamenc' || doc.title.includes('flamenc')) {
    tabs.push('flamenco');
  }
  
  return tabs;
}

// Renderitzar tot
function renderDocs() {
  renderDocTabs();
  renderDocList();
  renderDocViewer();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    DOC_CATEGORIES, DOCS, activeDocCategory, activeDocId, visibleVoicingLimit,
    docMatches, filteredDocs, selectChordType, renderDocTabs, renderDocList, renderDocViewer, renderDocs
  };
}
