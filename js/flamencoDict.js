// Diccionari Flamenc interactiu
// Cercador de termes, palos i conceptes

const FLAMENCO_DATA = {
  palos: [
    {
      name: 'Soleá',
      category: 'Cante Jondo',
      compas: '12 temps',
      caracter: 'Solemn, profund, rígid',
      origen: 'Sevilla (Triana, Jerez)',
      description: 'Un dels palos més antics i fonamentals del flamenc. Compàs de 12 temps amb accent a 3, 6, 8, 10, 12.'
    },
    {
      name: 'Bulerías',
      category: 'Cante Jondo',
      compas: '12 temps',
      caracter: 'Alegre, festiu, ràpid',
      origen: 'Jerez de la Frontera',
      description: 'Variant ràpida de la soleá. El més utilitzat per a la improvisació i el ball festiu.'
    },
    {
      name: 'Alegrías',
      category: 'Cante de Cádiz',
      compas: '12 temps',
      caracter: 'Alegre, brillant, femení',
      origen: 'Cádiz',
      description: 'Cante alegre en major, tradicionalment femení. Velocitat mitjana-ràpida.'
    },
    {
      name: 'Tientos',
      category: 'Cante Jondo',
      compas: '4/4',
      caracter: 'Intermedi, dramàtic',
      origen: 'Jerez, Cádiz',
      description: 'Parent proper de la taranta però més lliure. Tempo lent-mitjà.'
    },
    {
      name: 'Tangos',
      category: 'Cante Jondo',
      compas: '4/4',
      caracter: 'Sensual, rítmic',
      origen: 'Sevilla, Cádiz, Màlaga',
      description: 'No confondre amb el tango argentí. Compàs binari 4/4, accentuat i sensual.'
    },
    {
      name: 'Fandangos',
      category: 'Cante Líric',
      compas: '3/4 o 6/8',
      caracter: 'Líric, variat',
      origen: 'Huelva, Màlaga, Granada',
      description: 'Origen del flamenc. Nombroses variants locals (de Huelva, de Màlaga, granadins).'
    },
    {
      name: 'Seguiriya',
      category: 'Cante Jondo',
      compas: '12 temps (irregular)',
      caracter: 'Profund, tràgic, rígid',
      origen: 'Andalusia oriental (Granada, Jaén)',
      description: 'Considerat el cante més vell i profund. Compàs asimètric i rígid.'
    },
    {
      name: 'Saeta',
      category: 'Cante Jondo',
      compas: 'Lliure',
      caracter: 'Religiós, improvisat',
      origen: 'Sevilla, tota Andalusia',
      description: 'Cante religiós de processó. Sense compàs fix, altament ornamentat.'
    },
    {
      name: 'Petenera',
      category: 'Cante Líric',
      compas: '4/4 o 12 temps',
      caracter: 'Llegendari, tabú',
      origen: 'Paterna de Rivera (Cádiz)',
      description: 'Cante llegendari i "maleït". Textos que parlen de dones perilloses.'
    },
    {
      name: 'Guajira',
      category: 'Cante de Ida y Vuelta',
      compas: '6/8',
      caracter: 'Cubà, alegre',
      origen: 'Cuba (influència)',
      description: 'Cante d\'origen cubà. Temes sobre Cuba, ritme 6/8 característic.'
    }
  ],
  
  termes: [
    { term: 'A palo seco', def: 'Sense guitarra, només veu' },
    { term: 'Aire', def: 'Estil o manera de cantar un palo' },
    { term: 'Alzapúa', def: 'Tècnica de guitarra, picar cordes amb polze' },
    { term: 'Cante', def: 'El cant, veu del flamenc' },
    { term: 'Cantaor/a', def: 'Cantant de flamenc' },
    { term: 'Cejilla', def: 'Cejilla/capodastre' },
    { term: 'Compás', def: 'Compàs, ritme, mesura flamenca' },
    { term: 'Desplante', def: 'Final d\'una dansa, figures finals' },
    { term: 'Falseta', def: 'Passatge instrumental de guitarra' },
    { term: 'Golpe', def: 'Cop, percussió sobre la caixa de guitarra' },
    { term: 'Ida y vuelta', def: 'Estils d\'Amèrica Llatina adaptats' },
    { term: 'Jondo', def: 'Fondo/profund - cante més seriós' },
    { term: 'Llave', def: 'Clau, inici del compàs' },
    { term: 'Macho', def: 'Final ràpid d\'una peça' },
    { term: 'Palmas', def: 'Palmes, percussion amb mans' },
    { term: 'Palo', def: 'Estil/forma flamenca' },
    { term: 'Remate', def: 'Remat, final d\'una frase' },
    { term: 'Taconeo', def: 'Taconeig del ball' },
    { term: 'Toque', def: 'Toc, guitarra flamenca' },
    { term: 'Zapateado', def: 'Dansa amb zapateo (sabates)' }
  ],
  
  compassos: [
    { 
      name: '12 temps (Soleá, Bulería)',
      pattern: '1 2 3 4 5 6 7 8 9 10 11 12',
      accents: [3, 6, 8, 10, 12],
      description: 'Compàs bàsic del flamenc. Accents característics als cops 3, 6, 8, 10 i 12.'
    },
    { 
      name: '4/4 (Tangos, Tientos)',
      pattern: '1 2 3 4',
      accents: [1, 3],
      description: 'Compàs binari. Accent als temps imparells.'
    },
    { 
      name: '3/4 (Fandangos)',
      pattern: '1 2 3',
      accents: [1],
      description: 'Compàs ternari tradicional.'
    }
  ]
};

let activeFlamencoTab = 'palos';
let flamencoSearch = '';

function createFlamencoModule() {
  const container = document.getElementById('flamencoContainer');
  if (!container) return;
  
  container.innerHTML = `
    <div class="flamenco-wrapper">
      <div class="flamenco-search">
        <input type="search" id="flamencoSearch" class="flamenco-search-input" 
               placeholder="Cerca palos, termes o compassos...">
      </div>
      
      <div class="flamenco-tabs">
        <button class="flamenco-tab ${activeFlamencoTab === 'palos' ? 'active' : ''}" data-tab="palos">
          Palos (${FLAMENCO_DATA.palos.length})
        </button>
        <button class="flamenco-tab ${activeFlamencoTab === 'termes' ? 'active' : ''}" data-tab="termes">
          Termes (${FLAMENCO_DATA.termes.length})
        </button>
        <button class="flamenco-tab ${activeFlamencoTab === 'compassos' ? 'active' : ''}" data-tab="compassos">
          Compassos (${FLAMENCO_DATA.compassos.length})
        </button>
      </div>
      
      <div id="flamencoContent" class="flamenco-content">
        <!-- Contingut dinàmic -->
      </div>
    </div>
  `;
  
  // Event listeners
  document.getElementById('flamencoSearch').addEventListener('input', (e) => {
    flamencoSearch = e.target.value.toLowerCase();
    renderFlamencoContent();
  });
  
  document.querySelectorAll('.flamenco-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activeFlamencoTab = tab.dataset.tab;
      document.querySelectorAll('.flamenco-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderFlamencoContent();
    });
  });
  
  renderFlamencoContent();
}

function renderFlamencoContent() {
  const content = document.getElementById('flamencoContent');
  if (!content) return;
  
  content.innerHTML = '';
  
  switch (activeFlamencoTab) {
    case 'palos':
      renderPalos(content);
      break;
    case 'termes':
      renderTermes(content);
      break;
    case 'compassos':
      renderCompassos(content);
      break;
  }
}

function renderPalos(container) {
  const filtered = FLAMENCO_DATA.palos.filter(palo => 
    palo.name.toLowerCase().includes(flamencoSearch) ||
    palo.category.toLowerCase().includes(flamencoSearch) ||
    palo.description.toLowerCase().includes(flamencoSearch)
  );
  
  if (filtered.length === 0) {
    container.innerHTML = '<div class="flamenco-empty">No s\'han trobat palos</div>';
    return;
  }
  
  const grid = document.createElement('div');
  grid.className = 'flamenco-grid';
  
  filtered.forEach(palo => {
    const card = document.createElement('div');
    card.className = 'flamenco-card';
    card.innerHTML = `
      <div class="flamenco-card-header">
        <span class="flamenco-card-title">${palo.name}</span>
        <span class="flamenco-card-category">${palo.category}</span>
      </div>
      <div class="flamenco-card-props">
        <span class="flamenco-prop"><strong>Compàs:</strong> ${palo.compas}</span>
        <span class="flamenco-prop"><strong>Caràcter:</strong> ${palo.caracter}</span>
        <span class="flamenco-prop"><strong>Origen:</strong> ${palo.origen}</span>
      </div>
      <div class="flamenco-card-desc">${palo.description}</div>
    `;
    grid.appendChild(card);
  });
  
  container.appendChild(grid);
}

function renderTermes(container) {
  const filtered = FLAMENCO_DATA.termes.filter(item => 
    item.term.toLowerCase().includes(flamencoSearch) ||
    item.def.toLowerCase().includes(flamencoSearch)
  );
  
  if (filtered.length === 0) {
    container.innerHTML = '<div class="flamenco-empty">No s\'han trobat termes</div>';
    return;
  }
  
  const list = document.createElement('div');
  list.className = 'flamenco-terms-list';
  
  filtered.forEach(item => {
    const termEl = document.createElement('div');
    termEl.className = 'flamenco-term-item';
    termEl.innerHTML = `
      <span class="flamenco-term-name">${item.term}</span>
      <span class="flamenco-term-def">${item.def}</span>
    `;
    list.appendChild(termEl);
  });
  
  container.appendChild(list);
}

function renderCompassos(container) {
  const filtered = FLAMENCO_DATA.compassos.filter(item => 
    item.name.toLowerCase().includes(flamencoSearch) ||
    item.description.toLowerCase().includes(flamencoSearch)
  );
  
  if (filtered.length === 0) {
    container.innerHTML = '<div class="flamenco-empty">No s\'han trobat compassos</div>';
    return;
  }
  
  filtered.forEach(item => {
    const compasEl = document.createElement('div');
    compasEl.className = 'flamenco-compas-item';
    compasEl.innerHTML = `
      <div class="flamenco-compas-header">
        <span class="flamenco-compas-name">${item.name}</span>
      </div>
      <div class="flamenco-compas-pattern">
        ${renderCompasPattern(item.pattern, item.accents)}
      </div>
      <div class="flamenco-compas-desc">${item.description}</div>
    `;
    container.appendChild(compasEl);
  });
}

function renderCompasPattern(pattern, accents) {
  const times = pattern.split(' ');
  return times.map((t, i) => {
    const isAccent = accents.includes(i + 1);
    return `<span class="compas-beat ${isAccent ? 'accent' : ''}">${t}</span>`;
  }).join('');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createFlamencoModule, FLAMENCO_DATA };
}
