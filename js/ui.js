// UI principal - Inicialització de controls
// Requereix: chordData.js, chordEngine.js, fretboard.js, studyCenter.js, filters.js, presetsUI.js

function initControls() {
  const rootSelect = document.getElementById('rootSelect');
  const typeSelect = document.getElementById('typeSelect');
  
  // Omplir selector d'arrels
  for (const root of ROOT_OPTIONS) {
    const opt = document.createElement('option');
    opt.value = root.value;
    opt.textContent = root.value;
    rootSelect.appendChild(opt);
  }
  
  // Omplir selector de tipus d'acord (agrupats per família)
  const families = [...new Set(CHORDS.map((chord) => chord.family))];
  for (const family of families) {
    const group = document.createElement('optgroup');
    group.label = family;
    for (const chord of CHORDS.filter((item) => item.family === family)) {
      const opt = document.createElement('option');
      opt.value = chord.s;
      opt.textContent = chord.s ? `${chord.label} (${chord.s})` : chord.label;
      group.appendChild(opt);
    }
    typeSelect.appendChild(group);
  }
  
  // Comptador de catàleg
  document.getElementById('catalogCount').textContent = `${CHORDS.length} tipus d'acord i ${ROOT_OPTIONS.length} noms d'arrel disponibles.`;
  
  // Event listeners principals
  rootSelect.addEventListener('change', () => {
    visibleVoicingLimit = 250;
    updatePresets();
  });
  
  typeSelect.addEventListener('change', () => {
    visibleVoicingLimit = 250;
    updatePresets();
  });
  
  // Controls del diapasó
  document.getElementById('btnDn').addEventListener('click', () => moveFret(-1));
  document.getElementById('btnUp').addEventListener('click', () => moveFret(1));
  document.getElementById('btnResetTop').addEventListener('click', resetAll);
  document.getElementById('btnOpen').addEventListener('click', () => setAllMuted(false));
  document.getElementById('btnMute').addEventListener('click', () => setAllMuted(true));
  document.getElementById('btnClear').addEventListener('click', resetAll);
  
  // Omplir selector de nova tònica per reinterpretació
  const newRootSelect = document.getElementById('newRootSelect');
  if (newRootSelect) {
    for (const root of ROOT_OPTIONS) {
      const opt = document.createElement('option');
      opt.value = root.value;
      opt.textContent = root.value;
      newRootSelect.appendChild(opt);
    }
  }
  
  // Botó aplicar canvi de tònica
  const btnApplyRoot = document.getElementById('btnApplyRoot');
  if (btnApplyRoot) {
    btnApplyRoot.addEventListener('click', () => {
      const newRoot = document.getElementById('newRootSelect').value;
      console.log('Botó Aplicar clicat, newRoot:', newRoot);
      if (typeof reinterpretChord === 'function') {
        reinterpretChord(newRoot);
      } else {
        console.log('reinterpretChord no està disponible');
      }
    });
  } else {
    console.log('btnApplyRoot no trobat');
  }
  
  // Cerca de documentació
  document.getElementById('docSearch').addEventListener('input', () => {
    const first = filteredDocs()[0];
    if (first) activeDocId = first.id;
    renderDocs();
  });
  
  // Crear panell de filtres
  createFiltersPanel();
  
  // Inicialitzar
  updatePresets();
  renderDocs();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initControls };
}
