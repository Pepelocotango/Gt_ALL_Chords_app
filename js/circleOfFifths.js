// Cercle de Quintes interactiu
// Permet rotar, seleccionar tonalitat i veure families d'acords

const COF_NOTES = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
const COF_MAJORS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Gb', 'Db', 'Ab', 'Eb', 'Bb'];
const COF_MINORS = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'Ebm', 'Bbm', 'Fm', 'Cm', 'Gm'];
const COF_SIGNATURES = [0, 1, 2, 3, 4, 5, 6, -6, -5, -4, -3, -2]; // Sostenits (positiu) / bemolls (negatiu)

let selectedKeyIndex = 0; // C per defecte
let rotationOffset = 0;

function createCircleOfFifths() {
  const container = document.getElementById('cofContainer');
  if (!container) return;
  
  container.innerHTML = `
    <div class="cof-wrapper">
      <svg id="cofSvg" width="320" height="320" viewBox="-160 -160 320 320">
        <!-- Cercle exterior amb notes majors -->
        <g id="cofOuter"></g>
        <!-- Cercle interior amb notes menors -->
        <g id="cofInner"></g>
        <!-- Centre -->
        <circle cx="0" cy="0" r="35" fill="var(--color-background-secondary)" stroke="var(--color-border-secondary)" stroke-width="2"/>
        <text x="0" y="-5" text-anchor="middle" font-size="12" fill="var(--color-text-secondary)">Tonalitat</text>
        <text id="cofCenterKey" x="0" y="12" text-anchor="middle" font-size="18" font-weight="650" fill="var(--color-text-primary)">C</text>
      </svg>
      
      <div class="cof-controls">
        <button id="cofRotateLeft" class="cof-btn">◀ Rotar</button>
        <button id="cofReset" class="cof-btn">Reset</button>
        <button id="cofRotateRight" class="cof-btn">Rotar ▶</button>
      </div>
      
      <div class="cof-info">
        <div class="cof-info-title">Informació de la tonalitat</div>
        <div id="cofInfoContent" class="cof-info-content">
          <div><strong>Tonalitat:</strong> <span id="cofKeyName">C major / Am</span></div>
          <div><strong>Armadura:</strong> <span id="cofSignature">Cap sostenit ni bemoll</span></div>
          <div><strong>Acords de la tonalitat:</strong></div>
          <div id="cofChords" class="cof-chords-list"></div>
        </div>
      </div>
    </div>
  `;
  
  renderCircle();
  
  // Event listeners
  document.getElementById('cofRotateLeft').addEventListener('click', () => rotateCOF(-1));
  document.getElementById('cofRotateRight').addEventListener('click', () => rotateCOF(1));
  document.getElementById('cofReset').addEventListener('click', () => {
    rotationOffset = 0;
    selectedKeyIndex = 0;
    renderCircle();
  });
}

function renderCircle() {
  const outer = document.getElementById('cofOuter');
  const inner = document.getElementById('cofInner');
  const centerKey = document.getElementById('cofCenterKey');
  
  if (!outer || !inner) return;
  
  outer.innerHTML = '';
  inner.innerHTML = '';
  
  const radiusOuter = 120;
  const radiusInner = 75;
  const angleStep = 30; // 360 / 12
  
  // Renderitzar cercle exterior (majors)
  for (let i = 0; i < 12; i++) {
    const angle = (i * angleStep - 90 + rotationOffset * 30) * Math.PI / 180;
    const x = Math.cos(angle) * radiusOuter;
    const y = Math.sin(angle) * radiusOuter;
    
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'cof-segment');
    g.setAttribute('data-index', i);
    g.style.cursor = 'pointer';
    
    // Color segons distància de C
    const isSelected = i === selectedKeyIndex;
    const color = isSelected ? 'var(--color-text-info)' : 
                  (i === 0 ? '#246a73' : // C - blau verdós
                   i < 6 ? '#4a7c59' : // Zona sostenits - verd
                   '#8b4513'); // Zona bemolls - marró
    
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', isSelected ? 28 : 24);
    circle.setAttribute('fill', isSelected ? color : 'var(--color-background-secondary)');
    circle.setAttribute('stroke', color);
    circle.setAttribute('stroke-width', isSelected ? 3 : 2);
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y + 5);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', isSelected ? 16 : 14);
    text.setAttribute('font-weight', isSelected ? '650' : '500');
    text.setAttribute('fill', isSelected ? 'white' : color);
    text.textContent = COF_MAJORS[i];
    
    g.appendChild(circle);
    g.appendChild(text);
    
    g.addEventListener('click', () => selectKey(i));
    g.addEventListener('mouseenter', () => {
      circle.setAttribute('r', 28);
    });
    g.addEventListener('mouseleave', () => {
      if (i !== selectedKeyIndex) circle.setAttribute('r', 24);
    });
    
    outer.appendChild(g);
  }
  
  // Renderitzar cercle interior (menors)
  for (let i = 0; i < 12; i++) {
    const angle = (i * angleStep - 90 + rotationOffset * 30) * Math.PI / 180;
    const x = Math.cos(angle) * radiusInner;
    const y = Math.sin(angle) * radiusInner;
    
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'cof-segment-minor');
    g.setAttribute('data-index', i);
    g.style.cursor = 'pointer';
    
    const isSelected = i === selectedKeyIndex;
    const color = isSelected ? 'var(--color-text-danger)' : 'var(--color-text-secondary)';
    
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', isSelected ? 20 : 18);
    circle.setAttribute('fill', isSelected ? color : 'var(--color-background-secondary)');
    circle.setAttribute('stroke', color);
    circle.setAttribute('stroke-width', isSelected ? 2 : 1);
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y + 4);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', isSelected ? 12 : 11);
    text.setAttribute('font-weight', isSelected ? '650' : '400');
    text.setAttribute('fill', isSelected ? 'white' : color);
    text.textContent = COF_MINORS[i].replace('m', '');
    
    g.appendChild(circle);
    g.appendChild(text);
    
    g.addEventListener('click', () => selectKey(i));
    
    inner.appendChild(g);
  }
  
  // Actualitzar centre
  if (centerKey) {
    centerKey.textContent = COF_MAJORS[selectedKeyIndex];
  }
  
  updateCOFInfo();
}

function rotateCOF(direction) {
  rotationOffset += direction;
  selectedKeyIndex = ((selectedKeyIndex - direction) % 12 + 12) % 12;
  renderCircle();
}

function selectKey(index) {
  selectedKeyIndex = index;
  renderCircle();
}

function updateCOFInfo() {
  const keyName = document.getElementById('cofKeyName');
  const signature = document.getElementById('cofSignature');
  const chords = document.getElementById('cofChords');
  
  if (!keyName || !signature || !chords) return;
  
  const major = COF_MAJORS[selectedKeyIndex];
  const minor = COF_MINORS[selectedKeyIndex];
  const sig = COF_SIGNATURES[selectedKeyIndex];
  
  keyName.textContent = `${major} major / ${minor}`;
  
  if (sig === 0) {
    signature.textContent = 'Cap sostenit ni bemoll';
  } else if (sig > 0) {
    signature.textContent = `${sig} sostenit${sig > 1 ? 's' : ''} (#)`;
  } else {
    signature.textContent = `${Math.abs(sig)} bemoll${Math.abs(sig) > 1 ? 's' : ''} (b)`;
  }
  
  // Acords de la tonalitat
  const rootPitch = COF_NOTES.indexOf(COF_MAJORS[selectedKeyIndex]) * 7 % 12;
  const scaleDegrees = [0, 2, 4, 5, 7, 9, 11]; // Escala major
  const chordTypes = ['', 'm', 'm', '', '', 'm', 'dim']; // I-ii-iii-IV-V-vi-vii°
  const romanNumerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
  
  const tonalChords = scaleDegrees.map((degree, i) => {
    const noteIndex = (rootPitch + degree) % 12;
    const noteName = COF_NOTES[noteIndex];
    return {
      numeral: romanNumerals[i],
      chord: noteName + chordTypes[i],
      type: chordTypes[i] === '' ? 'Major' : chordTypes[i] === 'm' ? 'Menor' : 'Disminuït',
      function: i === 0 ? 'Tònica' : i === 3 ? 'Subdominant' : i === 4 ? 'Dominant' : i === 5 ? 'Tònica relativa' : 'Color'
    };
  });
  
  chords.innerHTML = tonalChords.map(c => 
    `<span class="cof-chord-chip" data-chord="${c.chord.replace(/[^a-zA-Z#]/g, '')}" title="${c.function}">${c.numeral}: ${c.chord}</span>`
  ).join('');
  
  // Fer clicables els acords
  chords.querySelectorAll('.cof-chord-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const chordName = chip.dataset.chord;
      // Extreure arrel i tipus
      const rootMatch = chordName.match(/^([A-G][#b]?)/);
      if (rootMatch) {
        const root = rootMatch[1];
        const type = chordName.slice(root.length);
        // Buscar al selector
        const rootSelect = document.getElementById('rootSelect');
        const typeSelect = document.getElementById('typeSelect');
        if (rootSelect && [...rootSelect.options].some(o => o.value === root)) {
          rootSelect.value = root;
        }
        if (typeSelect && [...typeSelect.options].some(o => o.value === type)) {
          typeSelect.value = type;
          updatePresets();
          document.querySelector('.side-panel')?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createCircleOfFifths, renderCircle, rotateCOF, selectKey };
}
