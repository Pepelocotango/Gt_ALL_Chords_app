// Motor d'acords - Identificació i generació de voicings
// Requereix: chordData.js, presets.js

// Estat del diapasó
let dots = new Set();
let muted = Array(N_STR).fill(false);
let fretPos = 1;

// Estat dels filtres
const FILTERS = {
  zona: 'totes',        // 'totes', 'baixa', 'mitjana', 'alta', '1-5', '5-9', '9-12', '12+'
  cordes: 'qualsevol',  // 'qualsevol', '4', '5', '6'
  dificultat: 'tots',   // 'tots', 'facil', 'mitja', 'dificil'
  inversio: 'qualsevol', // 'qualsevol', 'fundamental', 'primera', 'segona'
  obertes: 'qualsevol', // 'qualsevol', 'amb', 'sense'
  baix: 'qualsevol'     // 'qualsevol', 'mi', 'la', 're', 'sol', 'si', 'mi2'
};

// Obtenir notes actives del diapasó
function getActive() {
  const out = [];
  for (let s = 0; s < N_STR; s++) {
    let df = null;
    for (let f = 1; f <= N_FRE; f++) {
      if (dots.has(`${s}-${f}`)) {
        df = f;
        break;
      }
    }
    if (df !== null) out.push({ s, note: (OPEN_N[s] + (fretPos - 1) + df) % 12 });
    else if (!muted[s]) out.push({ s, note: OPEN_N[s] });
  }
  return out;
}

// Puntuació d'un acord
function scoreChord(pitches, bass, root, chord) {
  const chordSet = new Set(chord.i.map((i) => (root + i) % 12));
  const matched = pitches.filter((p) => chordSet.has(p)).length;
  const extra = pitches.filter((p) => !chordSet.has(p)).length;
  const missing = [...chordSet].filter((p) => !pitches.includes(p));
  const intervalsPresent = pitches.map((p) => ((p - root + 12) % 12));
  const hasRoot = intervalsPresent.includes(0);
  const hasThird = intervalsPresent.includes(3) || intervalsPresent.includes(4);
  const exact = extra === 0 && missing.length === 0;
  const completeCore = chord.i.length <= 2 || (hasRoot && (hasThird || chord.s.includes('sus') || chord.s === '5'));
  let score = matched * 10 - extra * 12 - missing.length * 3;
  if (exact) score += 28;
  if (bass === root) score += 10;
  if (hasRoot) score += 5;
  if (hasThird) score += 3;
  if (completeCore) score += 3;
  score -= Math.max(0, chord.i.length - pitches.length) * 1.2;
  if (chord.family === 'Dominants alterats' && !exact) score -= 4;
  return { score, matched, extra, missing: missing.length, exact };
}

// Identificar candidats d'acords
function identifyCandidates(pitches, bass) {
  const candidates = [];
  for (let root = 0; root < 12; root++) {
    for (const chord of CHORDS) {
      const result = scoreChord(pitches, bass, root, chord);
      if (result.matched < Math.min(2, pitches.length)) continue;
      if (result.extra > 2) continue;
      if (!result.exact && result.score < 6) continue;
      candidates.push({ root, chord, ...result });
    }
  }
  return candidates
    .sort((a, b) => b.score - a.score || Number(b.exact) - Number(a.exact) || a.missing - b.missing || a.chord.i.length - b.chord.i.length)
    .filter((candidate, index, list) => list.findIndex((item) => chordName(item.root, item.chord, bass) === chordName(candidate.root, candidate.chord, bass)) === index);
}

// Identificar acord actual
function identify() {
  const active = getActive();
  const el = document.getElementById('result');
  const details = document.getElementById('details');
  if (active.length < 2) {
    el.innerHTML = '<div class="empty-msg">Necessites almenys 2 notes sonant</div>';
    details.innerHTML = '<div class="detail-line"><strong>Notes:</strong> cap acord identificable.</div>';
    render();
    return;
  }
  const pitches = [...new Set(active.map((n) => n.note))];
  const bass = active[0].note;
  const candidates = identifyCandidates(pitches, bass);
  const best = candidates[0];
  if (!best) {
    el.innerHTML = '<div class="empty-msg">No s\'ha pogut identificar</div>';
    details.innerHTML = '<div class="detail-line"><strong>Notes:</strong> cap acord identificable.</div>';
    render();
    return;
  }
  const flat = FLAT_ROOTS.has(best.root);
  const display = chordName(best.root, best.chord, bass);
  const rootName = nname(best.root, flat);
  const bn = getCorrectNoteName(rootName, getIntervalName((bass - best.root + 12) % 12, best.chord.s)) || nname(bass, flat);
  const nl = pitches.map((p) => {
    const interval = (p - best.root + 12) % 12;
    const func = getIntervalName(interval, best.chord.s);
    return getCorrectNoteName(rootName, func) || nname(p, flat);
  }).join(' · ');
  const quality = best.exact ? best.chord.label : `${best.chord.label}, coincidencia parcial`;
  const alternatives = candidates.slice(1, 7).map((c) => `<span class="alt-pill">${chordName(c.root, c.chord, bass)}</span>`).join('');
  el.innerHTML = [
    `<div class="chord-name">${display}</div>`,
    `<div class="chord-notes">${nl}</div>`,
    `<div class="chord-hint">${quality}</div>`,
    alternatives ? `<div class="alt-list" aria-label="Alternatives">${alternatives}</div>` : ''
  ].join('');
  details.innerHTML = [
    `<div class="detail-line"><strong>Notes:</strong> ${nl}</div>`,
    `<div class="detail-line"><strong>Baix:</strong> ${bn}</div>`,
    `<div class="detail-line"><strong>Família:</strong> ${best.chord.family}</div>`,
    `<div class="detail-line"><strong>Cordes:</strong> ${shapeText()}</div>`
  ].join('');
  
  // Guardar l'acord identificat per mostrar funcions al renderitzar
  window.lastIdentifiedChord = { root: best.root, chord: best.chord, active };
  
  // Mostrar grup de canvi de tònica i actualitzar opcions
  const rootShiftGroup = document.getElementById('rootShiftGroup');
  const newRootSelect = document.getElementById('newRootSelect');
  if (rootShiftGroup && newRootSelect) {
    rootShiftGroup.classList.remove('hidden');
    
    // Filtrar el selector per mostrar només les notes de l'acord actual
    const uniquePitches = [...new Set(active.map(n => n.note))];
    newRootSelect.innerHTML = '';
    uniquePitches.forEach(pitch => {
      const func = getIntervalName((pitch - best.root + 12) % 12, best.chord.s);
      const pitchName = getCorrectNoteName(rootName, func) || nname(pitch, flat);
      const opt = document.createElement('option');
      opt.value = pitchName; // Guardem l'String exacte ('Gb', 'D#', etc.) perquè no es perdi l'enharmonia.
      opt.textContent = pitchName;
      if (pitch === best.root) opt.selected = true;
      newRootSelect.appendChild(opt);
    });
  }
  
  render();
}

// Text de la digitació actual
function shapeText() {
  const values = [];
  for (let s = 0; s < N_STR; s++) {
    let shown = muted[s] ? 'x' : '0';
    for (let f = 1; f <= N_FRE; f++) {
      if (dots.has(`${s}-${f}`)) shown = String(fretPos + f - 1);
    }
    values.push(shown);
  }
  return values.join(' ');
}

// Funcions del diapasó
function moveFret(d) {
  fretPos = Math.max(1, Math.min(20, fretPos + d));
  document.getElementById('btnDn').disabled = fretPos === 1;
  document.getElementById('fretLbl').textContent = fretPos === 1 ? 'Trast 1 (ceja)' : `Trast ${fretPos}`;
  render();
  identify();
}

function toggleMute(s) {
  const hd = [...dots].some((k) => k.startsWith(`${s}-`));
  if (hd) {
    for (let f = 1; f <= N_FRE; f++) dots.delete(`${s}-${f}`);
    muted[s] = false;
  } else {
    muted[s] = !muted[s];
  }
  render();
  identify();
}

function clickCell(s, f) {
  const k = `${s}-${f}`;
  const was = dots.has(k);
  for (let ff = 1; ff <= N_FRE; ff++) dots.delete(`${s}-${ff}`);
  if (!was) {
    dots.add(k);
    muted[s] = false;
  }
  // Si estem en mode FIND, passar a mode BUILD
  if (typeof onBoardClick === 'function') {
    onBoardClick();
  }
  render();
  identify();
}

function resetAll() {
  dots.clear();
  muted = Array(N_STR).fill(false);
  fretPos = 1;
  window.lastIdentifiedChord = null;
  syncFretLabel();
  document.getElementById('result').innerHTML = '<div class="empty-msg">Fes clic als punts del diapasó per col·locar els dits</div>';
  document.getElementById('details').innerHTML = '<div class="detail-line"><strong>Consell:</strong> fes clic a O/X per obrir o silenciar una corda.</div>';
  
  // Amagar grup de canvi de tònica
  const rootShiftGroup = document.getElementById('rootShiftGroup');
  if (rootShiftGroup) {
    rootShiftGroup.classList.add('hidden');
  }
  
  render();
}

function syncFretLabel() {
  document.getElementById('btnDn').disabled = fretPos === 1;
  document.getElementById('fretLbl').textContent = fretPos === 1 ? 'Trast 1 (ceja)' : `Trast ${fretPos}`;
}

function setAllMuted(value) {
  dots.clear();
  muted = Array(N_STR).fill(value);
  render();
  identify();
}

// Reinterpretar l'acord amb una nova tònica (mantenint les mateixes notes al màstil)
function reinterpretChord(newRootName) {
  console.log('reinterpretChord cridat amb newRootName:', newRootName);
  
  // Convertim el nom (String) al pitch (Número) per fer els càlculs interns
  const newRootPitch = rootPitch(newRootName);
  if (newRootPitch === undefined || newRootPitch === null) return;
  
  const active = getActive();
  if (active.length < 2) return;
  
  const pitches = [...new Set(active.map((n) => n.note))];
  const bass = active[0].note;
  
  // Buscar quin acord encaixa millor amb aquestes notes i la nova tònica
  const candidates = [];
  for (const chord of CHORDS) {
    const result = scoreChord(pitches, bass, newRootPitch, chord);
    // Un candidat és vàlid si té almenys les notes de l'acord (o gairebé totes)
    if (result.matched >= 2 || result.exact) {
      candidates.push({ root: newRootPitch, chord, ...result });
    }
  }
  
  if (candidates.length === 0) {
    console.warn('No es pot reinterpretar amb aquesta tònica');
    return;
  }
  
  // Triar el millor candidat
  const best = candidates.sort((a, b) => b.score - a.score || Number(b.exact) - Number(a.exact) || a.missing - b.missing)[0];
  console.log('millor candidat reinterpretat:', best);
  
  // Actualitzar l'acord identificat
  window.lastIdentifiedChord = { root: newRootPitch, chord: best.chord, active };
  
  // Actualitzar la UI d'identificació
  const flat = FLAT_ROOTS.has(newRootPitch);
  const display = chordName(newRootName, best.chord, bass); // Passem l'String!
  const rootName = newRootName; // Forcem l'String!
  const bn = getCorrectNoteName(rootName, getIntervalName((bass - newRootPitch + 12) % 12, best.chord.s)) || nname(bass, flat);
  const nl = pitches.map((p) => {
    const interval = (p - newRootPitch + 12) % 12;
    const func = getIntervalName(interval, best.chord.s);
    return getCorrectNoteName(rootName, func) || nname(p, flat);
  }).join(' · ');
  const quality = best.exact ? best.chord.label : `${best.chord.label}, coincidencia parcial`;
  
  const el = document.getElementById('result');
  const details = document.getElementById('details');
  
  if (el) {
    el.innerHTML = [
      `<div class="chord-name">${display}</div>`,
      `<div class="chord-notes">${nl}</div>`,
      `<div class="chord-hint">${quality} (reinterpretat)</div>`
    ].join('');
  }
  
  if (details) {
    details.innerHTML = [
      `<div class="detail-line"><strong>Notes:</strong> ${nl}</div>`,
      `<div class="detail-line"><strong>Baix:</strong> ${bn}</div>`,
      `<div class="detail-line"><strong>Tònica:</strong> ${nname(newRootPitch, flat)}</div>`,
      `<div class="detail-line"><strong>Família:</strong> ${best.chord.family}</div>`,
      `<div class="detail-line"><strong>Cordes:</strong> ${shapeText()}</div>`
    ].join('');
  }
  
  render();
}

function applyShape(frets) {
  dots.clear();
  muted = Array(N_STR).fill(false);
  fretPos = normalizeShapeWindow(frets);
  for (let s = 0; s < N_STR; s++) {
    const actual = frets[s];
    if (actual < 0) {
      muted[s] = true;
    } else if (actual > 0) {
      const relative = actual - fretPos + 1;
      if (relative >= 1 && relative <= N_FRE) dots.add(`${s}-${relative}`);
    }
  }
  syncFretLabel();
  render();
  identify();
}

function applyPreset(preset) {
  applyShape(preset.frets);
}

// Generador de voicings
function possibleStringFrets(stringIndex, chordSet, minFret, maxFret) {
  const values = [{ fret: -1, note: null }];
  const openNote = OPEN_N[stringIndex] % 12;
  if (chordSet.has(openNote)) values.push({ fret: 0, note: openNote });
  for (let fret = minFret; fret <= maxFret; fret++) {
    const note = (OPEN_N[stringIndex] + fret) % 12;
    if (chordSet.has(note)) values.push({ fret, note });
  }
  return values;
}

function hasRequiredTone(intervals, chord) {
  if (chord.s === '5') return intervals.includes(0) && intervals.includes(7);
  if (chord.s.includes('sus')) return intervals.includes(0) && (intervals.includes(2) || intervals.includes(5));
  return intervals.includes(0) && (intervals.includes(3) || intervals.includes(4));
}

// Puntuació de digitació amb filtres
function shapeScore(frets, notes, root, chord) {
  const sounding = notes.filter((note) => note !== null);
  const unique = [...new Set(sounding)];
  const intervals = unique.map((note) => (note - root + 12) % 12);
  const pressed = frets.filter((f) => f > 0);
  const mutedCount = frets.filter((f) => f < 0).length;
  const openCount = frets.filter((f) => f === 0).length;
  const minPressed = pressed.length ? Math.min(...pressed) : 0;
  const maxPressed = pressed.length ? Math.max(...pressed) : 0;
  const span = pressed.length ? maxPressed - minPressed : 0;
  const bass = sounding[0];
  
  let score = 0;
  score += unique.length * 18;
  score += chord.i.filter((i) => intervals.includes(i)).length * 12;
  score += hasRequiredTone(intervals, chord) ? 28 : -35;
  score += intervals.includes(0) ? 14 : -20;
  score += bass === root ? 18 : 0;
  score += sounding.length >= 4 ? 8 : 0;
  score += openCount * 1.5;
  score -= span * 7;
  score -= mutedCount * 3;
  score -= Math.max(0, minPressed - 7) * 1.5;
  score -= Math.max(0, sounding.length - 5) * 1.5;
  
  // Aplicar filtres
  score = applyFilterScore(score, frets, notes, root, intervals, openCount, span, mutedCount);
  
  return score;
}

// Aplicar puntuació segons filtres actius
function applyFilterScore(score, frets, notes, root, intervals, openCount, span, mutedCount) {
  const pressed = frets.filter((f) => f > 0);
  const minPressed = pressed.length ? Math.min(...pressed) : 0;
  const maxPressed = pressed.length ? Math.max(...pressed) : 0;
  const sounding = notes.filter((n) => n !== null);
  const bass = sounding[0];
  const bassString = frets.findIndex((f, i) => f >= 0 && notes[i] === bass);
  
  // Filtre de zona del màstil
  if (FILTERS.zona !== 'totes') {
    let inZone = false;
    switch (FILTERS.zona) {
      case 'baixa': inZone = maxPressed <= 5; break;
      case 'mitjana': inZone = minPressed >= 3 && maxPressed <= 9; break;
      case 'alta': inZone = minPressed >= 7; break;
      case '1-5': inZone = maxPressed <= 5; break;
      case '5-9': inZone = minPressed >= 5 && maxPressed <= 9; break;
      case '9-12': inZone = minPressed >= 9 && maxPressed <= 12; break;
      case '12+': inZone = minPressed >= 12; break;
    }
    if (!inZone) score -= 100;
  }
  
  // Filtre de nombre de cordes
  if (FILTERS.cordes !== 'qualsevol') {
    const numStrings = sounding.length;
    const targetStrings = parseInt(FILTERS.cordes);
    if (numStrings < targetStrings) score -= 50;
    if (numStrings === targetStrings) score += 10;
  }
  
  // Filtre de dificultat
  if (FILTERS.dificultat !== 'tots') {
    let diff = 'facil';
    if (span > 4 || mutedCount > 0 || minPressed > 7) diff = 'dificil';
    else if (span > 3 || openCount === 0) diff = 'mitja';
    
    if (diff !== FILTERS.dificultat) score -= 30;
    else score += 10;
  }
  
  // Filtre d'inversió
  if (FILTERS.inversio !== 'qualsevol') {
    const hasFundamental = bass === root;
    const hasTercera = intervals.includes(3) || intervals.includes(4);
    const hasSetena = intervals.includes(10) || intervals.includes(11);
    
    if (FILTERS.inversio === 'fundamental' && !hasFundamental) score -= 60;
    else if (FILTERS.inversio === 'primera' && (hasFundamental || !hasTercera)) score -= 40;
    else if (FILTERS.inversio === 'segona' && (hasFundamental || !hasSetena)) score -= 40;
  }
  
  // Filtre de cordes obertes
  if (FILTERS.obertes !== 'qualsevol') {
    if (FILTERS.obertes === 'amb' && openCount === 0) score -= 40;
    else if (FILTERS.obertes === 'sense' && openCount > 0) score -= 40;
    else score += 5;
  }
  
  // Filtre de baix específic
  if (FILTERS.baix !== 'qualsevol') {
    const stringNames = ['mi', 'la', 're', 'sol', 'si', 'mi2'];
    const targetString = stringNames.indexOf(FILTERS.baix);
    if (bassString !== targetString) score -= 70;
    else score += 15;
  }
  
  return score;
}

// Generar voicings amb filtres
function generateVoicings(rootName, type, limit = Infinity) {
  const root = rootPitch(rootName);
  const chord = chordBySuffix(type);
  const chordSet = new Set(chord.i.map((interval) => (root + interval) % 12));
  const out = [];
  const seen = new Set();
  const stringGroups = [
    [0, 1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5],
    [0, 1, 2, 3, 4],
    [2, 3, 4, 5],
    [1, 2, 3, 4],
    [0, 1, 2, 3],
    [3, 4, 5],
    [2, 3, 4],
    [1, 2, 3],
    [0, 1, 2]
  ];
  
  // Determinar rang de finestres segons filtres de zona
  let windowStartMin = 1, windowStartMax = 11;
  if (FILTERS.zona === 'baixa' || FILTERS.zona === '1-5') windowStartMax = 5;
  else if (FILTERS.zona === '5-9') { windowStartMin = 3; windowStartMax = 9; }
  else if (FILTERS.zona === '9-12') { windowStartMin = 7; windowStartMax = 12; }
  else if (FILTERS.zona === '12-15') { windowStartMin = 11; windowStartMax = 11; }
  else if (FILTERS.zona === 'mitjana') { windowStartMin = 2; windowStartMax = 9; }
  else if (FILTERS.zona === 'alta') windowStartMin = 7;
  
  for (let windowStart = windowStartMin; windowStart <= windowStartMax; windowStart++) {
    const windowEnd = windowStart + 4;
    const perString = STR_NAMES.map((_, s) => possibleStringFrets(s, chordSet, windowStart, windowEnd));
    
    for (const group of stringGroups) {
      if (FILTERS.cordes !== 'qualsevol') {
        const targetStrings = parseInt(FILTERS.cordes);
        if (group.length !== targetStrings) continue;
      }
      
      if (!group.some((stringIndex) => perString[stringIndex].some((option) => option.note === root))) continue;
      
      const frets = Array(N_STR).fill(-1);
      const notes = Array(N_STR).fill(null);
      
      function walk(groupIndex, hasRoot) {
        if (groupIndex === group.length) {
          if (!hasRoot) return;
          const sounding = notes.filter((note) => note !== null);
          if (sounding.length < 3) return;
          const unique = [...new Set(sounding)];
          const intervals = unique.map((note) => (note - root + 12) % 12);
          if (!hasRequiredTone(intervals, chord)) return;
          const key = shapeLabel(frets);
          if (seen.has(key)) return;
          seen.add(key);
          
          const score = shapeScore(frets, notes, root, chord);
          // Només afegir si la puntuació és acceptable (no filtrada)
          if (score > -50) {
            out.push({ frets: [...frets], notes: [...notes], score });
          }
          return;
        }
        
        const stringIndex = group[groupIndex];
        const options = perString[stringIndex].filter((item) => item.fret >= 0);
        for (const option of options) {
          frets[stringIndex] = option.fret;
          notes[stringIndex] = option.note;
          walk(groupIndex + 1, hasRoot || option.note === root);
          frets[stringIndex] = -1;
          notes[stringIndex] = null;
        }
      }
      
      walk(0, false);
    }
  }
  
  return out
    .sort((a, b) => b.score - a.score || normalizeShapeWindow(a.frets) - normalizeShapeWindow(b.frets))
    .slice(0, limit);
}

// Funcions per als filtres
function setFilter(type, value) {
  FILTERS[type] = value;
}

function resetFilters() {
  FILTERS.zona = 'totes';
  FILTERS.cordes = 'qualsevol';
  FILTERS.dificultat = 'tots';
  FILTERS.inversio = 'qualsevol';
  FILTERS.obertes = 'qualsevol';
  FILTERS.baix = 'qualsevol';
}

// Verificar cobertura de voicings per arrels i tipus d'acord
function verifyChordCoverage(limitPerChord = 10) {
  const report = [];
  for (const chord of CHORDS) {
    const missingRoots = [];
    for (let root = 0; root < 12; root += 1) {
      const rootName = nname(root, false);
      const voicings = generateVoicings(rootName, chord.s, limitPerChord);
      if (voicings.length === 0) missingRoots.push(rootName);
    }
    if (missingRoots.length > 0) {
      report.push({ chord: chord.s, label: chord.label, missingRoots });
    }
  }
  if (report.length === 0) {
    console.log('verifyChordCoverage: every chord type has at least one voicing for every root.');
  } else {
    console.warn('verifyChordCoverage: missing voicings for some chord/root combinations:', report);
  }
  return report;
}

window.verifyChordCoverage = verifyChordCoverage;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    dots, muted, fretPos, FILTERS,
    getActive, scoreChord, identifyCandidates, identify, shapeText,
    moveFret, toggleMute, clickCell, resetAll, syncFretLabel, setAllMuted,
    applyShape, applyPreset, generateVoicings, setFilter, resetFilters,
    shapeScore, applyFilterScore, reinterpretChord
  };
}
