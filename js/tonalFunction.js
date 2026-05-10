// Funció Tonal - Visualització del màstil segons funcions en una tonalitat
// Mostra cada nota del màstil colorejada segons la seva funció (T, 3, 5, 7, tensions...)

// Escala major: T, 2, 3, 4, 5, 6, 7
// Escala menor natural: T, 2, b3, 4, 5, b6, b7
// Dòric: T, 2, b3, 4, 5, 6, b7
// Mixolidi: T, 2, 3, 4, 5, 6, b7
// Lídic: T, 2, 3, #4, 5, 6, 7

const MODE_INTERVALS = {
  major:      [0, 2, 4, 5, 7, 9, 11],      // T, 2, 3, 4, 5, 6, 7
  minor:      [0, 2, 3, 5, 7, 8, 10],      // T, 2, b3, 4, 5, b6, b7
  dorian:     [0, 2, 3, 5, 7, 9, 10],      // T, 2, b3, 4, 5, 6, b7
  mixolydian: [0, 2, 4, 5, 7, 9, 10],      // T, 2, 3, 4, 5, 6, b7
  lydian:     [0, 2, 4, 6, 7, 9, 11]       // T, 2, 3, #4, 5, 6, 7
};

const FUNCTION_NAMES = {
  0: 'T',      // Tònica
  1: 'b2',     // Bemoll 2
  2: '2',      // Segona
  3: 'b3',     // Tercera menor
  4: '3',      // Tercera major
  5: '4',      // Quarta
  6: 'b5',     // Bemoll 5 / Tritonus
  7: '5',      // Quinta
  8: '6',      // Sexta / bemoll 6 en menor
  9: 'bb7',    // Doble bemoll 7 (menor harmònica)
  10: 'b7',    // Sèptima menor
  11: '7'      // Sèptima major
};

const TENSION_NAMES = {
  13: 'b9',    // 13 = 1 (octava) + 13 semitons = bemoll 9
  14: '9',     // 14 = 2 + 12 = 9 justa
  15: 's9',    // 15 = 3 + 12 = sostingut 9
  17: 'b11',   // 17 = 5 + 12 = bemoll 11
  18: '11',    // 18 = 6 + 12 = 11 justa / bemoll 5 de l'octava superior
  19: 's11',   // 19 = 7 + 12 = sostingut 11 = 5 de l'octava superior
  20: 'b13',   // 20 = 8 + 12 = bemoll 13 / 6 menor
  21: '13',    // 21 = 9 + 12 = 13 justa / 6 major
  22: 's13'    // 22 = 10 + 12 = sostingut 13 / bemoll 7 de l'octava superior
};

let currentTonalRoot = 0; // Pitch de Do
let currentTonalMode = 'major';
let currentTonalView = 'chord'; // 'chord' o 'scale'
let isTonalModeActive = false;

function initTonalFunction() {
  const tonalRootSelect = document.getElementById('tonalRootSelect');
  const tonalChordTypeSelect = document.getElementById('tonalChordTypeSelect');
  const tonalScaleRootSelect = document.getElementById('tonalScaleRootSelect');
  const tonalScaleTypeSelect = document.getElementById('tonalScaleTypeSelect');
  const tonalModeTabs = document.getElementById('tonalModeTabs');
  const btnShowTonalChord = document.getElementById('btnShowTonalChord');
  const scaleSelectRow = document.getElementById('scaleSelectRow');
  
  if (!tonalRootSelect) return;
  
  // Omplir selectors d'arrels
  const rootNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  rootNotes.forEach((note, pitch) => {
    const opt = document.createElement('option');
    opt.value = pitch;
    opt.textContent = note;
    if (pitch === 0) opt.selected = true;
    tonalRootSelect.appendChild(opt.cloneNode(true));
    if (tonalScaleRootSelect) tonalScaleRootSelect.appendChild(opt);
  });
  
  // Omplir selector de tipus d'acord amb tots els CHORDS del catàleg
  if (tonalChordTypeSelect && typeof CHORDS !== 'undefined') {
    const families = [...new Set(CHORDS.map(c => c.family))];
    families.forEach(family => {
      const group = document.createElement('optgroup');
      group.label = family;
      CHORDS.filter(c => c.family === family).forEach(chord => {
        const opt = document.createElement('option');
        opt.value = chord.s;
        opt.textContent = chord.s ? `${chord.label} (${chord.s})` : chord.label;
        group.appendChild(opt);
      });
      tonalChordTypeSelect.appendChild(group);
    });
  }
  
  // Pestanyes de vista
  if (tonalModeTabs) {
    tonalModeTabs.querySelectorAll('.tonal-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        tonalModeTabs.querySelectorAll('.tonal-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentTonalView = tab.dataset.view;
        
        // Mostrar/ocultar selectors segons la vista
        if (currentTonalView === 'chord') {
          if (scaleSelectRow) scaleSelectRow.classList.add('hidden');
        } else {
          if (scaleSelectRow) scaleSelectRow.classList.remove('hidden');
        }
        
        if (isTonalModeActive) {
          if (currentTonalView === 'chord') {
            renderChordFunctionMode();
          } else {
            renderTonalMode();
          }
        }
      });
    });
  }
  
  // Botó "Mostrar funcions"
  if (btnShowTonalChord) {
    btnShowTonalChord.addEventListener('click', () => {
      if (currentTonalView === 'chord') {
        renderChordFunctionMode();
      } else {
        renderTonalMode();
      }
      updateTonalLegend();
    });
  }
  
  // Event listeners per canvis en selectors d'escala
  if (tonalScaleTypeSelect) {
    tonalScaleTypeSelect.addEventListener('change', (e) => {
      currentTonalMode = e.target.value;
      if (isTonalModeActive && currentTonalView === 'scale') {
        renderTonalMode();
        updateTonalLegend();
      }
    });
  }
}

function setTonalModeActive(active) {
  isTonalModeActive = active;
  const tonalModeGroup = document.getElementById('tonalModeGroup');
  
  if (active) {
    if (tonalModeGroup) tonalModeGroup.classList.remove('hidden');
    updateTonalLegend();
    renderTonalMode();
  } else {
    if (tonalModeGroup) tonalModeGroup.classList.add('hidden');
    // Restaurar renderitzat normal
    if (typeof render === 'function') render();
  }
}

function getNoteFunction(notePitch, rootPitch, mode) {
  const interval = ((notePitch - rootPitch) % 12 + 12) % 12;
  const modeIntervals = MODE_INTERVALS[mode];
  
  // Comprovar si és una nota de l'escala
  const degreeIndex = modeIntervals.indexOf(interval);
  
  if (degreeIndex !== -1) {
    // Mode-dependent naming
    if (mode === 'lydian' && interval === 6) return '#4';
    return FUNCTION_NAMES[interval];
  }
  
  // Si no és de l'escala, pot ser una tensió o nota cromàtica
  return FUNCTION_NAMES[interval] || interval.toString();
}

function getFunctionColor(func) {
  const root = document.documentElement;
  const styles = getComputedStyle(root);
  const colors = {
    'T': styles.getPropertyValue('--color-harmonic-t').trim(),
    '1': styles.getPropertyValue('--color-harmonic-t').trim(),
    'b2': styles.getPropertyValue('--color-harmonic-b2').trim(),
    'b9': styles.getPropertyValue('--color-harmonic-b2').trim(),
    '2': styles.getPropertyValue('--color-harmonic-2').trim(),
    '9': styles.getPropertyValue('--color-harmonic-2').trim(),
    'b3': styles.getPropertyValue('--color-harmonic-b3').trim(),
    '#9': styles.getPropertyValue('--color-harmonic-b3').trim(),
    '3': styles.getPropertyValue('--color-harmonic-3').trim(),
    '4': styles.getPropertyValue('--color-harmonic-4').trim(),
    '11': styles.getPropertyValue('--color-harmonic-4').trim(),
    '#4': styles.getPropertyValue('--color-harmonic-sharp4').trim(),
    'b5': styles.getPropertyValue('--color-harmonic-sharp4').trim(),
    '#11': styles.getPropertyValue('--color-harmonic-sharp4').trim(),
    '5': styles.getPropertyValue('--color-harmonic-5').trim(),
    'b6': styles.getPropertyValue('--color-harmonic-b6').trim(),
    'b13': styles.getPropertyValue('--color-harmonic-b6').trim(),
    '6': styles.getPropertyValue('--color-harmonic-6').trim(),
    '13': styles.getPropertyValue('--color-harmonic-6').trim(),
    'bb7': styles.getPropertyValue('--color-harmonic-6').trim(),
    'b7': styles.getPropertyValue('--color-harmonic-b7').trim(),
    '#13': styles.getPropertyValue('--color-harmonic-b7').trim(),
    '7': styles.getPropertyValue('--color-harmonic-7').trim(),
    'maj7': styles.getPropertyValue('--color-harmonic-7').trim(),
    's9': styles.getPropertyValue('--color-harmonic-b3').trim(),
    's11': styles.getPropertyValue('--color-harmonic-sharp4').trim(),
    's13': styles.getPropertyValue('--color-harmonic-6').trim()
  };
  return colors[func] || '#999999';
}

function updateTonalLegend() {
  const legend = document.getElementById('tonalLegend');
  if (!legend) return;
  
  const modeIntervals = MODE_INTERVALS[currentTonalMode];
  const rootPitch = parseInt(currentTonalRoot);
  
  // Funcions presents en aquest mode
  const activeFunctions = modeIntervals.map(interval => FUNCTION_NAMES[interval]);
  
  // Eliminar duplicats (ex: b3 i 3 no poden coexistir)
  const uniqueFunctions = [...new Set(activeFunctions)];
  
  let html = '';
  uniqueFunctions.forEach(func => {
    const color = getFunctionColor(func);
    html += `
      <div class="tonal-legend-item">
        <span class="tonal-legend-color" style="background: ${color}"></span>
        <span>${func}</span>
      </div>
    `;
  });
  
  legend.innerHTML = html;
}

function renderChordFunctionMode() {
  const svg = document.getElementById('board');
  const rootSelect = document.getElementById('tonalRootSelect');
  const typeSelect = document.getElementById('tonalChordTypeSelect');
  
  if (!rootSelect || !typeSelect) return;
  
  const rootPitch = parseInt(rootSelect.value);
  const chordType = typeSelect.value;
  
  // Buscar l'acord al catàleg
  const chord = typeof CHORDS !== 'undefined' ? CHORDS.find(c => c.s === chordType) : null;
  if (!chord) return;
  
  // Obtenir les notes de l'acord (intervals convertits a pitches absoluts)
  const chordNotes = chord.i.map(interval => (rootPitch + interval) % 12);
  
  // Netejar i redibuixar el màstil base
  svg.innerHTML = '';
  const W = 220;
  const H = FY_TOP + N_FRE * FH + 10;
  svg.setAttribute('width', W);
  svg.setAttribute('height', H);
  
  const cc = getComputedStyle(document.documentElement);
  const colPrimary = cc.getPropertyValue('--color-text-primary').trim() || '#000';
  const colBorder = cc.getPropertyValue('--color-border-secondary').trim() || '#ccc';
  const colSecondary = cc.getPropertyValue('--color-text-secondary').trim() || '#666';
  const boardX0 = CX(0);
  const boardX1 = CX(N_STR - 1);
  
  // Cejilla
  if (fretPos === 1) {
    el('rect', { x: boardX0 - 1, y: FY_TOP - 4, width: boardX1 - boardX0 + 2, height: 5, fill: colPrimary, rx: 2 }, svg);
  }
  
  // Línies de trasts
  for (let f = 0; f <= N_FRE; f++) {
    if (f === 0 && fretPos === 1) continue;
    el('line', { x1: boardX0, y1: FY(f), x2: boardX1, y2: FY(f), stroke: colBorder, 'stroke-width': 1 }, svg);
  }
  
  // Línies de cordes
  for (let s = 0; s < N_STR; s++) {
    el('line', { x1: CX(s), y1: FY_TOP, x2: CX(s), y2: FY(N_FRE), stroke: colBorder, 'stroke-width': 1.2 + (N_STR - s) * 0.15 }, svg);
  }
  
  // Marcadors de trast
  const dotMarkers = [3, 5, 7, 9, 12, 15, 17];
  for (let f = 1; f <= N_FRE; f++) {
    const actual = fretPos + f - 1;
    if (dotMarkers.includes(actual)) {
      el('circle', { cx: (boardX0 + boardX1) / 2, cy: FY(f) - FH / 2, r: 4, fill: colBorder }, svg);
    }
    if (actual === 12 || actual === 24) {
      el('circle', { cx: (boardX0 + boardX1) / 2 - 14, cy: FY(f) - FH / 2, r: 4, fill: colBorder }, svg);
      el('circle', { cx: (boardX0 + boardX1) / 2 + 14, cy: FY(f) - FH / 2, r: 4, fill: colBorder }, svg);
    }
  }
  
  // Dibuixar totes les notes, però destacar les de l'acord
  for (let s = 0; s < N_STR; s++) {
    // Nota oberta (trast 0)
    const openNote = OPEN_N[s];
    const isInChord = chordNotes.includes(openNote);
    const openInterval = (openNote - rootPitch + 12) % 12;
    const openFunc = isInChord ? getIntervalFunctionName(openInterval, chord.s) : null;
    
    if (isInChord) {
      const openColor = getFunctionColor(openFunc);
      const g0 = el('g', {}, svg);
      el('circle', { 
        cx: CX(s), 
        cy: FY_TOP - 25, 
        r: DOT_R, 
        fill: openColor,
        stroke: colBorder,
        'stroke-width': 2
      }, g0);
      el('text', { 
        x: CX(s), 
        y: FY_TOP - 22, 
        'text-anchor': 'middle', 
        'font-size': 10, 
        fill: 'white',
        'font-weight': 'bold'
      }, g0).textContent = openFunc;
    } else {
      // Ghost note (nota fora de l'acord)
      const g0 = el('g', {}, svg);
      el('circle', { 
        cx: CX(s), 
        cy: FY_TOP - 25, 
        r: DOT_R * 0.6, 
        fill: colSecondary,
        opacity: 0.2
      }, g0);
    }
    
    // Notes als trasts
    for (let f = 1; f <= N_FRE; f++) {
      const actualFret = fretPos + f - 1;
      const note = (OPEN_N[s] + actualFret) % 12;
      const inChord = chordNotes.includes(note);
      const interval = (note - rootPitch + 12) % 12;
      
      if (inChord) {
        const func = getIntervalFunctionName(interval, chord.s);
        const color = getFunctionColor(func);
        
        const g = el('g', {}, svg);
        
        // Cercle de la nota amb color de funció
        el('circle', { 
          cx: CX(s), 
          cy: FY(f) - FH / 2, 
          r: DOT_R, 
          fill: color,
          stroke: colBorder,
          'stroke-width': 1
        }, g);
        
        // Text de la funció
        el('text', { 
          x: CX(s), 
          y: FY(f) - FH / 2 + 4.5, 
          'text-anchor': 'middle', 
          'font-size': 10, 
          'font-weight': '650', 
          fill: 'white'
        }, g).textContent = func;
        
        // Número de trast petit
        el('text', { 
          x: CX(s) + 8, 
          y: FY(f) - FH / 2 - 8, 
          'text-anchor': 'middle', 
          'font-size': 8,
          fill: 'white',
          opacity: 0.8
        }, g).textContent = actualFret;
      } else {
        // Ghost note
        const g = el('g', {}, svg);
        el('circle', { 
          cx: CX(s), 
          cy: FY(f) - FH / 2, 
          r: DOT_R * 0.5, 
          fill: colSecondary,
          opacity: 0.15
        }, g);
      }
    }
  }
  
  // Actualitzar llegenda amb les funcions d'aquest acord
  updateChordLegend(chord);
}

function getIntervalFunctionName(interval, chordSuffix = '') {
  if (typeof getIntervalName === 'function') {
    return getIntervalName(interval, chordSuffix);
  }

  const funcMap = {
    0: 'T',      // Tònica
    1: 'b2',     // Bemoll 2
    2: '2',      // 9a / 2a
    3: 'b3',     // 3a menor
    4: '3',      // 3a major
    5: '4',      // 11a / 4a
    6: 'b5',     // Tritonus
    7: '5',      // 5a justa
    8: '6',      // 13a / 6a
    9: 'bb7',    // Doble bemoll 7
    10: 'b7',    // 7a menor
    11: '7'      // 7a major / maj7
  };
  return funcMap[interval] || interval.toString();
}

function updateChordLegend(chord) {
  const legend = document.getElementById('tonalLegend');
  if (!legend || !chord) return;
  
  const rootPitch = parseInt(document.getElementById('tonalRootSelect').value);
  const rootName = NS[rootPitch];
  
  // Obtenir les funcions de l'acord
  const functions = chord.i.map(interval => getIntervalFunctionName(interval, chord.s));
  const uniqueFunctions = [...new Set(functions)];
  
  let html = `<div style="width:100%; font-size:12px; margin-bottom:8px; color:var(--color-text-secondary)">
    <strong>${rootName}${chord.s}</strong> - ${chord.label}
  </div>`;
  
  uniqueFunctions.forEach(func => {
    const color = getFunctionColor(func);
    html += `
      <div class="tonal-legend-item">
        <span class="tonal-legend-color" style="background: ${color}"></span>
        <span>${func}</span>
      </div>
    `;
  });
  
  legend.innerHTML = html;
}

function renderTonalMode() {
  const svg = document.getElementById('board');
  const scaleRootSelect = document.getElementById('tonalScaleRootSelect');
  const scaleTypeSelect = document.getElementById('tonalScaleTypeSelect');
  
  const rootPitch = scaleRootSelect ? parseInt(scaleRootSelect.value) : parseInt(currentTonalRoot);
  const mode = scaleTypeSelect ? scaleTypeSelect.value : currentTonalMode;
  
  // Netejar i redibuixar el màstil base
  svg.innerHTML = '';
  const W = 220;
  const H = FY_TOP + N_FRE * FH + 10;
  svg.setAttribute('width', W);
  svg.setAttribute('height', H);
  
  const cc = getComputedStyle(document.documentElement);
  const colPrimary = cc.getPropertyValue('--color-text-primary').trim() || '#000';
  const colBorder = cc.getPropertyValue('--color-border-secondary').trim() || '#ccc';
  const boardX0 = CX(0);
  const boardX1 = CX(N_STR - 1);
  
  // Cejilla
  if (fretPos === 1) {
    el('rect', { x: boardX0 - 1, y: FY_TOP - 4, width: boardX1 - boardX0 + 2, height: 5, fill: colPrimary, rx: 2 }, svg);
  }
  
  // Línies de trasts
  for (let f = 0; f <= N_FRE; f++) {
    if (f === 0 && fretPos === 1) continue;
    el('line', { x1: boardX0, y1: FY(f), x2: boardX1, y2: FY(f), stroke: colBorder, 'stroke-width': 1 }, svg);
  }
  
  // Línies de cordes
  for (let s = 0; s < N_STR; s++) {
    el('line', { x1: CX(s), y1: FY_TOP, x2: CX(s), y2: FY(N_FRE), stroke: colBorder, 'stroke-width': 1.2 + (N_STR - s) * 0.15 }, svg);
  }
  
  // Marcadors de trast
  const dotMarkers = [3, 5, 7, 9, 12, 15, 17];
  for (let f = 1; f <= N_FRE; f++) {
    const actual = fretPos + f - 1;
    if (dotMarkers.includes(actual)) {
      el('circle', { cx: (boardX0 + boardX1) / 2, cy: FY(f) - FH / 2, r: 4, fill: colBorder }, svg);
    }
    if (actual === 12 || actual === 24) {
      el('circle', { cx: (boardX0 + boardX1) / 2 - 14, cy: FY(f) - FH / 2, r: 4, fill: colBorder }, svg);
      el('circle', { cx: (boardX0 + boardX1) / 2 + 14, cy: FY(f) - FH / 2, r: 4, fill: colBorder }, svg);
    }
  }
  
  // Dibuixar cada nota amb el seu color de funció
  for (let s = 0; s < N_STR; s++) {
    // Nota oberta (trast 0)
    const openNote = OPEN_N[s];
    const openFunc = getNoteFunction(openNote, rootPitch, mode);
    const openColor = getFunctionColor(openFunc);
    
    const g0 = el('g', {}, svg);
    el('circle', { 
      cx: CX(s), 
      cy: FY_TOP - 25, 
      r: DOT_R, 
      fill: openColor,
      stroke: colBorder,
      'stroke-width': 1
    }, g0);
    el('text', { 
      x: CX(s), 
      y: FY_TOP - 22, 
      'text-anchor': 'middle', 
      'font-size': 10, 
      fill: 'white',
      'font-weight': 'bold'
    }, g0).textContent = openFunc;
    
    // Notes als trasts
    for (let f = 1; f <= N_FRE; f++) {
      const actualFret = fretPos + f - 1;
      const note = (OPEN_N[s] + actualFret) % 12;
      const func = getNoteFunction(note, rootPitch, mode);
      const color = getFunctionColor(func);
      
      const g = el('g', {}, svg);
      
      // Cercle de la nota amb color de funció
      el('circle', { 
        cx: CX(s), 
        cy: FY(f) - FH / 2, 
        r: DOT_R, 
        fill: color,
        opacity: 0.9
      }, g);
      
      // Text de la funció
      el('text', { 
        x: CX(s), 
        y: FY(f) - FH / 2 + 4.5, 
        'text-anchor': 'middle', 
        'font-size': 10, 
        'font-weight': '650', 
        fill: 'white'
      }, g).textContent = func;
      
      // Número de trast petit
      el('text', { 
        x: CX(s) + 8, 
        y: FY(f) - FH / 2 - 8, 
        'text-anchor': 'middle', 
        'font-size': 8,
        fill: 'white',
        opacity: 0.8
      }, g).textContent = actualFret;
    }
  }
  
  // Actualitzar llegenda d'escala
  updateScaleLegend(rootPitch, mode);
}

function updateScaleLegend(rootPitch, mode) {
  const legend = document.getElementById('tonalLegend');
  if (!legend) return;
  
  const modeIntervals = MODE_INTERVALS[mode];
  const rootName = NS[rootPitch];
  
  // Funcions presents en aquest mode
  const activeFunctions = modeIntervals.map(interval => getNoteFunction((rootPitch + interval) % 12, rootPitch, mode));
  const uniqueFunctions = [...new Set(activeFunctions)];
  
  let html = `<div style="width:100%; font-size:12px; margin-bottom:8px; color:var(--color-text-secondary)">
    <strong>${rootName} ${mode}</strong> - Escala completa
  </div>`;
  
  uniqueFunctions.forEach(func => {
    const color = getFunctionColor(func);
    html += `
      <div class="tonal-legend-item">
        <span class="tonal-legend-color" style="background: ${color}"></span>
        <span>${func}</span>
      </div>
    `;
  });
  
  legend.innerHTML = html;
}

// Renderitzar el màstil en mode BUILD amb funcions harmòniques de l'acord identificat
// Aquesta funció es crida des de chordEngine.js quan s'identifica un acord
function renderBuildWithFunctions(rootPitch, chord, activeNotes) {
  const svg = document.getElementById('board');
  if (!svg) return;
  
  // Obtenir les notes de l'acord (intervals convertits a pitches absoluts)
  const chordNotes = chord.i.map(interval => (rootPitch + interval) % 12);
  
  // Crear un mapa de notes actives per corda
  const activeByString = {};
  activeNotes.forEach(n => {
    activeByString[n.s] = n.note;
  });
  
  // Netejar i redibuixar el màstil base
  svg.innerHTML = '';
  const W = 220;
  const H = FY_TOP + N_FRE * FH + 10;
  svg.setAttribute('width', W);
  svg.setAttribute('height', H);
  
  const cc = getComputedStyle(document.documentElement);
  const colPrimary = cc.getPropertyValue('--color-text-primary').trim() || '#000';
  const colBorder = cc.getPropertyValue('--color-border-secondary').trim() || '#ccc';
  const colSecondary = cc.getPropertyValue('--color-text-secondary').trim() || '#666';
  const boardX0 = CX(0);
  const boardX1 = CX(N_STR - 1);
  
  // Cejilla
  if (fretPos === 1) {
    el('rect', { x: boardX0 - 1, y: FY_TOP - 4, width: boardX1 - boardX0 + 2, height: 5, fill: colPrimary, rx: 2 }, svg);
  }
  
  // Línies de trasts
  for (let f = 0; f <= N_FRE; f++) {
    if (f === 0 && fretPos === 1) continue;
    el('line', { x1: boardX0, y1: FY(f), x2: boardX1, y2: FY(f), stroke: colBorder, 'stroke-width': 1 }, svg);
  }
  
  // Línies de cordes
  for (let s = 0; s < N_STR; s++) {
    el('line', { x1: CX(s), y1: FY_TOP, x2: CX(s), y2: FY(N_FRE), stroke: colBorder, 'stroke-width': 1.2 + (N_STR - s) * 0.15 }, svg);
  }
  
  // Marcadors de trast
  const dotMarkers = [3, 5, 7, 9, 12, 15, 17];
  for (let f = 1; f <= N_FRE; f++) {
    const actual = fretPos + f - 1;
    if (dotMarkers.includes(actual)) {
      el('circle', { cx: (boardX0 + boardX1) / 2, cy: FY(f) - FH / 2, r: 4, fill: colBorder }, svg);
    }
    if (actual === 12 || actual === 24) {
      el('circle', { cx: (boardX0 + boardX1) / 2 - 14, cy: FY(f) - FH / 2, r: 4, fill: colBorder }, svg);
      el('circle', { cx: (boardX0 + boardX1) / 2 + 14, cy: FY(f) - FH / 2, r: 4, fill: colBorder }, svg);
    }
  }
  
  // Dibuixar notes del màstil
  for (let s = 0; s < N_STR; s++) {
    // Nota oberta (trast 0)
    const openNote = OPEN_N[s];
    const isActiveOpen = activeByString[s] === openNote;
    const inChord = chordNotes.includes(openNote);
    
    if (isActiveOpen && inChord) {
      const interval = (openNote - rootPitch + 12) % 12;
      const func = getIntervalFunctionName(interval, chord.s);
      const color = getFunctionColor(func);
      
      const g0 = el('g', {}, svg);
      el('circle', { 
        cx: CX(s), 
        cy: FY_TOP - 25, 
        r: DOT_R, 
        fill: color,
        stroke: colBorder,
        'stroke-width': 2
      }, g0);
      el('text', { 
        x: CX(s), 
        y: FY_TOP - 22, 
        'text-anchor': 'middle', 
        'font-size': 10, 
        fill: 'white',
        'font-weight': 'bold'
      }, g0).textContent = func;
    } else if (isActiveOpen) {
      // Nota activa però no identificada com a part de l'acord (nota extra)
      const g0 = el('g', {}, svg);
      el('circle', { 
        cx: CX(s), 
        cy: FY_TOP - 25, 
        r: DOT_R, 
        fill: colPrimary,
        stroke: '#e74c3c',
        'stroke-width': 2
      }, g0);
      el('text', { 
        x: CX(s), 
        y: FY_TOP - 22, 
        'text-anchor': 'middle', 
        'font-size': 10, 
        fill: 'white'
      }, g0).textContent = '?';
    } else {
      // Ghost note (no activa)
      const g0 = el('g', {}, svg);
      el('circle', { 
        cx: CX(s), 
        cy: FY_TOP - 25, 
        r: DOT_R * 0.6, 
        fill: colSecondary,
        opacity: 0.2
      }, g0);
    }
    
    // Notes als trasts
    for (let f = 1; f <= N_FRE; f++) {
      const actualFret = fretPos + f - 1;
      const note = (OPEN_N[s] + actualFret) % 12;
      const k = `${s}-${f}`;
      const isActive = dots.has(k);
      const noteInChord = chordNotes.includes(note);
      
      if (isActive && noteInChord) {
        const interval = (note - rootPitch + 12) % 12;
        const func = getIntervalFunctionName(interval, chord.s);
        const color = getFunctionColor(func);
        
        const g = el('g', {}, svg);
        
        // Cercle de la nota amb color de funció
        el('circle', { 
          cx: CX(s), 
          cy: FY(f) - FH / 2, 
          r: DOT_R, 
          fill: color,
          stroke: colBorder,
          'stroke-width': 1
        }, g);
        
        // Text de la funció
        el('text', { 
          x: CX(s), 
          y: FY(f) - FH / 2 + 4.5, 
          'text-anchor': 'middle', 
          'font-size': 10, 
          'font-weight': '650', 
          fill: 'white'
        }, g).textContent = func;
        
        // Número de trast petit
        el('text', { 
          x: CX(s) + 8, 
          y: FY(f) - FH / 2 - 8, 
          'text-anchor': 'middle', 
          'font-size': 8,
          fill: 'white',
          opacity: 0.8
        }, g).textContent = actualFret;
      } else if (isActive) {
        // Nota activa però no a l'acord (nota extra/tensió)
        const g = el('g', {}, svg);
        el('circle', { 
          cx: CX(s), 
          cy: FY(f) - FH / 2, 
          r: DOT_R, 
          fill: colPrimary,
          stroke: '#e74c3c',
          'stroke-width': 2
        }, g);
        el('text', { 
          x: CX(s), 
          y: FY(f) - FH / 2 + 4.5, 
          'text-anchor': 'middle', 
          'font-size': 10, 
          fill: 'white'
        }, g).textContent = '?';
      } else {
        // Ghost note (no activa)
        const g = el('g', {}, svg);
        el('circle', { 
          cx: CX(s), 
          cy: FY(f) - FH / 2, 
          r: DOT_R * 0.5, 
          fill: colSecondary,
          opacity: 0.15
        }, g);
      }
    }
  }
  
  // Actualitzar indicadors de cordes obertes/mutades
  const iRow = document.getElementById('indRow');
  if (iRow) {
    iRow.innerHTML = '';
    for (let s = 0; s < N_STR; s++) {
      const hd = [...dots].some((k) => k.startsWith(`${s}-`));
      const isMuted = !hd && muted[s];
      const btn = document.createElement('button');
      btn.className = `ind-btn ${isMuted ? 'ind-muted' : 'ind-open'}`;
      btn.type = 'button';
      btn.textContent = isMuted ? 'X' : 'O';
      btn.title = isMuted ? 'Silenciada, clic per obrir' : 'Oberta, clic per silenciar';
      btn.addEventListener('click', () => toggleMute(s));
      iRow.appendChild(btn);
    }
  }
  
  // Actualitzar números de trast
  const fc = document.getElementById('fretCol');
  if (fc) {
    fc.innerHTML = '';
    for (let f = 1; f <= N_FRE; f++) {
      const div = document.createElement('div');
      div.className = 'fret-num';
      div.textContent = fretPos + f - 1;
      fc.appendChild(div);
    }
  }
  
  // Actualitzar noms de les cordes
  const sn = document.getElementById('snames');
  if (sn) {
    sn.innerHTML = '';
    for (let s = 0; s < N_STR; s++) {
      const d = document.createElement('div');
      d.className = 'sname';
      d.textContent = STR_NAMES[s];
      sn.appendChild(d);
    }
  }
}

// Exportar per a mòduls
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    initTonalFunction, 
    setTonalModeActive, 
    renderTonalMode,
    renderBuildWithFunctions,
    updateTonalLegend,
    getNoteFunction,
    getFunctionColor,
    getIntervalFunctionName
  };
}
