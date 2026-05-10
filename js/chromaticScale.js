// Escala Cromàtica i Do Mòbil interactiu
// Visualització de relacions entre notes i transposició

const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const CHROMATIC_FLATS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

let mobileCPosition = 0; // Posició del Do (0 = C actual)
let selectedNote = 0; // Nota seleccionada
let showDoMobile = true; // Mode Do mòbil o escala cromàtica fixa

function createChromaticModule() {
  const container = document.getElementById('chromaticContainer');
  if (!container) return;
  
  container.innerHTML = `
    <div class="chromatic-wrapper">
      <div class="chromatic-controls">
        <label class="chromatic-toggle">
          <input type="checkbox" id="doMobileToggle" ${showDoMobile ? 'checked' : ''}>
          <span>Mode Do Mòbil</span>
        </label>
        <div class="chromatic-transpose">
          <span>Transposar:</span>
          <button id="transposeDown" class="chromatic-btn">▼</button>
          <span id="transposeValue">0</span>
          <button id="transposeUp" class="chromatic-btn">▲</button>
        </div>
      </div>
      
      <div class="chromatic-circle-wrapper">
        <svg id="chromaticSvg" width="300" height="300" viewBox="-150 -150 300 300">
          <g id="chromaticRing"></g>
          <g id="chromaticCenter"></g>
        </svg>
        
        <div class="chromatic-center-info">
          <div id="centerNoteName" class="center-note">C</div>
          <div id="centerNoteFreq" class="center-freq">261.63 Hz</div>
        </div>
      </div>
      
      <div class="chromatic-info">
        <div class="chromatic-info-title">Informació de la nota</div>
        <div id="chromaticNoteInfo">
          <div><strong>Nota:</strong> <span id="infoNoteName">C</span></div>
          <div><strong>Freqüència:</strong> <span id="infoFreq">261.63 Hz</span></div>
          <div><strong>Distància de C:</strong> <span id="infoInterval">Uníson</span></div>
          <div><strong>Graus en major:</strong> <span id="infoDegree">I (Tònica)</span></div>
        </div>
      </div>
      
      <div class="chromatic-piano">
        <div class="chromatic-piano-title">Teclat de referència</div>
        <div id="chromaticPianoKeys" class="piano-keys"></div>
      </div>
    </div>
  `;
  
  renderChromatic();
  renderPiano();
  
  // Event listeners
  document.getElementById('doMobileToggle').addEventListener('change', (e) => {
    showDoMobile = e.target.checked;
    renderChromatic();
  });
  
  document.getElementById('transposeDown').addEventListener('click', () => transpose(-1));
  document.getElementById('transposeUp').addEventListener('click', () => transpose(1));
}

function transpose(semitones) {
  mobileCPosition = (mobileCPosition + semitones + 12) % 12;
  document.getElementById('transposeValue').textContent = 
    semitones > 0 ? `+${mobileCPosition}` : mobileCPosition;
  renderChromatic();
  updateChromaticInfo();
}

function renderChromatic() {
  const ring = document.getElementById('chromaticRing');
  const center = document.getElementById('chromaticCenter');
  if (!ring || !center) return;
  
  ring.innerHTML = '';
  center.innerHTML = '';
  
  const radius = 100;
  const angleStep = 30;
  
  // Color wheel - cada nota amb el seu color característic
  const noteColors = [
    '#FF6B6B', // C - vermell
    '#FF9F43', // C# - taronja
    '#FECA57', // D - groc
    '#48DBFB', // D# - blau clar
    '#1DD1A1', // E - verd
    '#5F27CD', // F - lila
    '#FF9FF3', // F# - rosa
    '#54A0FF', // G - blau
    '#00D2D3', // G# - turquesa
    '#FF6B9D', // A - rosa fucsia
    '#C8D6E5', // A# - gris blavós
    '#8395A7'  // B - gris
  ];
  
  for (let i = 0; i < 12; i++) {
    const noteIndex = (i + mobileCPosition) % 12;
    const angle = (i * angleStep - 90) * Math.PI / 180;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.style.cursor = 'pointer';
    
    const isSelected = i === selectedNote;
    const color = noteColors[noteIndex];
    
    // Segment del cercle
    const nextAngle = ((i + 1) * angleStep - 90) * Math.PI / 180;
    const x2 = Math.cos(nextAngle) * radius;
    const y2 = Math.sin(nextAngle) * radius;
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const largeArcFlag = angleStep > 180 ? 1 : 0;
    const d = `M 0 0 L ${x} ${y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    path.setAttribute('d', d);
    path.setAttribute('fill', isSelected ? color : color + '80'); // 80 = 50% opacity
    path.setAttribute('stroke', isSelected ? 'white' : color);
    path.setAttribute('stroke-width', isSelected ? 3 : 1);
    
    // Text de la nota
    const textAngle = (i * angleStep + angleStep / 2 - 90) * Math.PI / 180;
    const textRadius = radius * 0.7;
    const tx = Math.cos(textAngle) * textRadius;
    const ty = Math.sin(textAngle) * textRadius;
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', tx);
    text.setAttribute('y', ty + 5);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', isSelected ? 16 : 14);
    text.setAttribute('font-weight', isSelected ? '650' : '500');
    text.setAttribute('fill', isSelected ? 'white' : 'var(--color-text-primary)');
    text.textContent = CHROMATIC_NOTES[noteIndex];
    
    g.appendChild(path);
    g.appendChild(text);
    
    g.addEventListener('click', () => selectNote(i));
    g.addEventListener('mouseenter', () => {
      path.setAttribute('fill', color);
    });
    g.addEventListener('mouseleave', () => {
      if (i !== selectedNote) path.setAttribute('fill', color + '80');
    });
    
    ring.appendChild(g);
  }
  
  // Centre amb la nota seleccionada
  const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  centerCircle.setAttribute('cx', 0);
  centerCircle.setAttribute('cy', 0);
  centerCircle.setAttribute('r', 40);
  centerCircle.setAttribute('fill', 'var(--color-background-secondary)');
  centerCircle.setAttribute('stroke', noteColors[(selectedNote + mobileCPosition) % 12]);
  centerCircle.setAttribute('stroke-width', 3);
  
  center.appendChild(centerCircle);
  
  updateChromaticInfo();
}

function selectNote(index) {
  selectedNote = index;
  renderChromatic();
}

function updateChromaticInfo() {
  const noteIndex = (selectedNote + mobileCPosition) % 12;
  const noteName = CHROMATIC_NOTES[noteIndex];
  const freq = 261.63 * Math.pow(2, noteIndex / 12); // Freqüència basada en A4=440Hz
  
  // Intervals
  const intervals = ['Uníson', '2a menor', '2a Major', '3a menor', '3a Major', 
                     '4a Justa', 'Tritó', '5a Justa', '6a menor', '6a Major', 
                     '7a menor', '7a Major'];
  const interval = intervals[noteIndex];
  
  // Graus en escala major
  const degrees = ['I (Tònica)', 'II (Supertònica)', 'III (Mediant)', 'IV (Subdominant)', 
                   'V (Dominant)', 'VI (Submediant)', 'VII (Subtònica/Leading)'];
  const majorScaleDegrees = [0, 2, 4, 5, 7, 9, 11];
  const degreeIndex = majorScaleDegrees.indexOf(noteIndex);
  const degree = degreeIndex >= 0 ? degrees[degreeIndex] : 'Nota alterada';
  
  document.getElementById('centerNoteName').textContent = noteName;
  document.getElementById('centerNoteFreq').textContent = `${freq.toFixed(2)} Hz`;
  document.getElementById('infoNoteName').textContent = noteName;
  document.getElementById('infoFreq').textContent = `${freq.toFixed(2)} Hz`;
  document.getElementById('infoInterval').textContent = interval;
  document.getElementById('infoDegree').textContent = degree;
  
  // Actualitzar piano
  renderPiano();
}

function renderPiano() {
  const piano = document.getElementById('chromaticPianoKeys');
  if (!piano) return;
  
  piano.innerHTML = '';
  
  const noteIndex = (selectedNote + mobileCPosition) % 12;
  const octaveNotes = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0]; // 0=blanca, 1=negra
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  // Crear una octava del piano
  for (let i = 0; i < 12; i++) {
    const isBlack = octaveNotes[i] === 1;
    const isSelected = i === noteIndex;
    const isDo = i === 0;
    
    const key = document.createElement('div');
    key.className = `piano-key ${isBlack ? 'black' : 'white'} ${isSelected ? 'active' : ''} ${isDo ? 'do' : ''}`;
    key.textContent = isDo ? 'C' : '';
    
    if (isSelected) {
      key.style.background = isBlack ? '#246a73' : '#54A0FF';
    }
    
    piano.appendChild(key);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createChromaticModule, transpose, selectNote };
}
