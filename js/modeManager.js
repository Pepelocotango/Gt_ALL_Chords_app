// Gestor de modes: BUILD vs FIND
// BUILD: Usuari clica al màstil → s'identifica l'acord
// FIND: Usuari selecciona acord → es mostra al màstil

let currentMode = 'build'; // 'build', 'find' o 'tonal'

function initModeManager() {
  const modeToggle = document.getElementById('modeToggle');
  const findModeGroup = document.getElementById('findModeGroup');
  const btnShowChord = document.getElementById('btnShowChord');
  const resultCard = document.getElementById('result');
  
  if (!modeToggle) return;
  
  // Event listeners pels botons de mode
  modeToggle.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      setMode(mode);
    });
  });
  
  // Botó "Veure al màstil"
  if (btnShowChord) {
    btnShowChord.addEventListener('click', () => {
      if (currentMode !== 'find') return;
      showChordOnBoard();
    });
  }
  
  // Inicialitzar funció tonal
  if (typeof initTonalFunction === 'function') {
    initTonalFunction();
  }
  
  // Inicialitzar estat
  updateModeUI();
}

function setMode(mode) {
  if (mode !== 'build' && mode !== 'find' && mode !== 'tonal') return;
  
  currentMode = mode;
  updateModeUI();
  
  // Actualitzar missatge del result-card segons el mode
  const resultCard = document.getElementById('result');
  
  // Gestionar mode tonal
  if (typeof setTonalModeActive === 'function') {
    setTonalModeActive(mode === 'tonal');
  }
  
  if (mode === 'build') {
    if (dots.size === 0 && !muted.some(m => m)) {
      resultCard.innerHTML = '<div class="empty-msg">Fes clic als punts del diapasó per col·locar els dits</div>';
    }
    // Re-identificar si hi ha notes
    identify();
  } else if (mode === 'find') {
    resultCard.innerHTML = '<div class="empty-msg">Selecciona un acord i prem "Veure al màstil"</div>';
  } else if (mode === 'tonal') {
    resultCard.innerHTML = '<div class="empty-msg">Mode Funció Tonal: cada nota mostra la seva funció harmònica</div>';
  }
}

function updateModeUI() {
  const modeToggle = document.getElementById('modeToggle');
  const findModeGroup = document.getElementById('findModeGroup');
  const tonalModeGroup = document.getElementById('tonalModeGroup');
  
  if (!modeToggle) return;
  
  // Actualitzar botons actius
  modeToggle.querySelectorAll('.mode-btn').forEach(btn => {
    if (btn.dataset.mode === currentMode) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Mostrar/ocultar grup de cerca
  if (findModeGroup) {
    if (currentMode === 'find') {
      findModeGroup.classList.remove('hidden');
    } else {
      findModeGroup.classList.add('hidden');
    }
  }
  
  // Mostrar/ocultar grup de funció tonal
  if (tonalModeGroup) {
    if (currentMode === 'tonal') {
      tonalModeGroup.classList.remove('hidden');
    } else {
      tonalModeGroup.classList.add('hidden');
    }
  }
}

function showChordOnBoard() {
  const root = document.getElementById('rootSelect').value;
  const type = document.getElementById('typeSelect').value;
  
  if (!root || !type) {
    alert('Selecciona una nota arrel i un tipus d\'acord');
    return;
  }
  
  // Buscar el millor preset o generar forma
  const rootPitchVal = ROOT_OPTIONS.find(r => r.value === root)?.pitch ?? NS.indexOf(root);
  const chord = chordBySuffix(type);
  
  if (!chord) {
    alert('Tipus d\'acord no trobat');
    return;
  }
  
  // Buscar preset existent
  const presets = PRESETS.filter(p => p.root === root && p.type === type);
  
  if (presets.length > 0) {
    // Usar el primer preset (el més habitual)
    applyPreset(presets[0]);
  } else {
    // Generar forma automàtica
    const voicings = generateVoicings(root, type);
    if (voicings.length > 0) {
      // Triar la forma amb millor puntuació
      const best = voicings.sort((a, b) => b.score - a.score)[0];
      applyShape(best.frets);
    } else {
      alert('No s\'ha pogut generar cap forma per aquest acord');
      return;
    }
  }
  
  // Actualitzar el resultat
  const resultCard = document.getElementById('result');
  const chordObj = chordBySuffix(type);
  const chordName = `${root}${type}`;
  resultCard.innerHTML = `
    <div class="chord-name">${chordName}</div>
    <div class="chord-notes">Mostrant forma al màstil</div>
    <div class="chord-hint">Clica al màstil per passar a mode "Construir"</div>
  `;
}

// Quan l'usuari clica al màstil en mode FIND, passar a mode BUILD
function onBoardClick() {
  if (currentMode === 'find') {
    setMode('build');
  }
}

// Exportar per a mòduls
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initModeManager, setMode, getCurrentMode: () => currentMode, onBoardClick };
}
