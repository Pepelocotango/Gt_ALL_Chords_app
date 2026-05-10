// Diapasó interactiu - Rendering SVG
// Requereix: chordData.js, chordEngine.js

const SVG_NS = 'http://www.w3.org/2000/svg';

function el(tag, attrs, par) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (par) par.appendChild(e);
  return e;
}

function render() {
  const svg = document.getElementById('board');
  if (!svg) return;
  svg.innerHTML = '';
  const W = 220;
  const H = FY_TOP + N_FRE * FH + 10;
  svg.setAttribute('width', W);
  svg.setAttribute('height', H);
  
  const cc = getComputedStyle(document.documentElement);
  const colPrimary = cc.getPropertyValue('--color-text-primary').trim() || '#000';
  const colSecondary = cc.getPropertyValue('--color-text-secondary').trim() || '#666';
  const colBorder = cc.getPropertyValue('--color-border-secondary').trim() || '#ccc';
  const colBg = cc.getPropertyValue('--color-background-primary').trim() || '#fff';
  const boardX0 = CX(0);
  const boardX1 = CX(N_STR - 1);
  
  // Comprovar si hi ha un acord identificat per mostrar funcions
  const hasIdentifiedChord = window.lastIdentifiedChord && window.lastIdentifiedChord.chord;
  let chordNotes = [];
  let rootPitch = null;
  let chordSuffix = '';
  
  if (hasIdentifiedChord) {
    rootPitch = window.lastIdentifiedChord.root;
    chordSuffix = window.lastIdentifiedChord.chord.s;
    chordNotes = window.lastIdentifiedChord.chord.i.map(interval => (rootPitch + interval) % 12);
  }
  
  // Helper per obtenir color de funció
  function getDotColor(s, f, note, isActive) {
    if (!hasIdentifiedChord || !isActive) {
      return { fill: isActive ? colPrimary : null, text: null };
    }
    
    const inChord = chordNotes.includes(note);
    if (inChord || note === rootPitch) {
      const interval = (note - rootPitch + 12) % 12;
      const func = getIntervalName(interval, chordSuffix);
      const color = getFunctionColor(func);
      return { fill: color, text: func };
    } else {
      // Nota activa però no a l'acord (o possible tensió no catalogada)
      const interval = (note - rootPitch + 12) % 12;
      const func = getIntervalName(interval, 'tension'); // Forçar nom de tensió si no és de l'acord
      return { fill: colPrimary, text: func, stroke: '#e74c3c' };
    }
  }

  function getOpenStringInfo(s) {
    if (!hasIdentifiedChord) return null;
    const note = OPEN_N[s];
    const interval = (note - rootPitch + 12) % 12;
    const func = getIntervalName(interval, chordSuffix);
    const color = getFunctionColor(func);
    return { func, color, note };
  }
  
  // Cejilla (trast 1) si estem a la posició 1
  if (fretPos === 1) {
    el('rect', { x: boardX0 - 1, y: FY_TOP - 4, width: boardX1 - boardX0 + 2, height: 5, fill: colPrimary, rx: 2 }, svg);
  }
  
  // Línies horitzontals (trasts)
  for (let f = 0; f <= N_FRE; f++) {
    if (f === 0 && fretPos === 1) continue;
    el('line', { x1: boardX0, y1: FY(f), x2: boardX1, y2: FY(f), stroke: colBorder, 'stroke-width': 1 }, svg);
  }
  
  // Línies verticals (cordes)
  for (let s = 0; s < N_STR; s++) {
    el('line', { x1: CX(s), y1: FY_TOP, x2: CX(s), y2: FY(N_FRE), stroke: colBorder, 'stroke-width': 1.2 + (N_STR - s) * 0.15 }, svg);
  }
  
  // Marcadors de trast
  const dotMarkers = [3, 5, 7, 9, 12];
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
  
  // Cel·les clicables i dots
  for (let f = 1; f <= N_FRE; f++) {
    for (let s = 0; s < N_STR; s++) {
      const hd = dots.has(`${s}-${f}`);
      const actualFret = fretPos + f - 1;
      const note = (OPEN_N[s] + actualFret) % 12;
      const g = el('g', {}, svg);
      const hitArea = el('rect', { x: CX(s) - 20, y: FY(f) - FH / 2 - DOT_R, width: 40, height: DOT_R * 2, fill: 'transparent', cursor: 'pointer' }, g);
      
      if (!hd) {
        const ghost = el('circle', { cx: CX(s), cy: FY(f) - FH / 2, r: DOT_R, fill: colSecondary, opacity: 0 }, g);
        hitArea.addEventListener('mouseenter', () => ghost.setAttribute('opacity', '0.22'));
        hitArea.addEventListener('mouseleave', () => ghost.setAttribute('opacity', '0'));
      } else {
        const colorInfo = getDotColor(s, f, note, true);
        const circleAttrs = { 
          cx: CX(s), 
          cy: FY(f) - FH / 2, 
          r: DOT_R, 
          fill: colorInfo.fill
        };
        if (colorInfo.stroke) {
          circleAttrs.stroke = colorInfo.stroke;
          circleAttrs['stroke-width'] = 2;
        }
        el('circle', circleAttrs, g);
        
        if (colorInfo.text) {
          // Mostrar funció harmònica
          el('text', { x: CX(s), y: FY(f) - FH / 2 + 4.5, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': '650', fill: 'white' }, g).textContent = colorInfo.text;
        } else {
          // Mostrar número de trast normal
          el('text', { x: CX(s), y: FY(f) - FH / 2 + 4.5, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': '650', fill: colBg }, g).textContent = actualFret;
        }
      }
      hitArea.addEventListener('click', () => clickCell(s, f));
    }
  }
  
  // Indicadors de cordes obertes/mutades
  const iRow = document.getElementById('indRow');
  iRow.innerHTML = '';
  for (let s = 0; s < N_STR; s++) {
    const hd = [...dots].some((k) => k.startsWith(`${s}-`));
    const isMuted = !hd && muted[s];
    const btn = document.createElement('button');
    btn.className = `ind-btn ${isMuted ? 'ind-muted' : 'ind-open'}`;
    btn.type = 'button';

    const symbol = document.createElement('span');
    symbol.textContent = isMuted ? 'X' : 'O';
    btn.appendChild(symbol);

    if (!isMuted && !hd && hasIdentifiedChord) {
      const openInfo = getOpenStringInfo(s);
      if (openInfo) {
        const funcLabel = document.createElement('span');
        funcLabel.className = 'open-func';
        funcLabel.textContent = openInfo.func;
        funcLabel.style.color = openInfo.color;
        btn.appendChild(funcLabel);
      }
    }

    btn.title = isMuted ? 'Silenciada, clic per obrir' : 'Oberta, clic per silenciar';
    btn.addEventListener('click', () => toggleMute(s));
    iRow.appendChild(btn);
  }
  
  // Números de trast
  const fc = document.getElementById('fretCol');
  fc.innerHTML = '';
  for (let f = 1; f <= N_FRE; f++) {
    const div = document.createElement('div');
    div.className = 'fret-num';
    div.textContent = fretPos + f - 1;
    fc.appendChild(div);
  }
  
  // Noms de les cordes
  const sn = document.getElementById('snames');
  sn.innerHTML = '';
  for (let s = 0; s < N_STR; s++) {
    const d = document.createElement('div');
    d.className = 'sname';
    d.textContent = STR_NAMES[s];
    sn.appendChild(d);
  }

  renderBoardLegend();
}

function renderBoardLegend() {
  const legend = document.getElementById('boardLegend');
  if (!legend) return;

  const items = [
    { label: 'T', description: 'Tònica', color: getFunctionColor('T') },
    { label: 'b2 / b9', description: 'Segona bemoll / novena bemoll', color: getFunctionColor('b9') },
    { label: '2 / 9', description: 'Segona o novena', color: getFunctionColor('9') },
    { label: 'b3 / #9', description: 'Tercera menor o novena sostenida', color: getFunctionColor('#9') },
    { label: '3', description: 'Tercera major', color: getFunctionColor('3') },
    { label: '4 / 11', description: 'Quarta o onze', color: getFunctionColor('11') },
    { label: '#4 / b5 / #11', description: 'Quarta sostenida, quinta bemoll o onze sostenida', color: getFunctionColor('#4') },
    { label: '5', description: 'Quinta justa', color: getFunctionColor('5') },
    { label: 'b6 / b13', description: 'Sexta bemoll o tretzena bemoll', color: getFunctionColor('b13') },
    { label: '6 / 13 / bb7', description: 'Sexta, tretzena o doble bemoll de setena', color: getFunctionColor('13') },
    { label: 'b7 / #13', description: 'Setena menor o tretzena sostenida', color: getFunctionColor('#13') },
    { label: '7 / maj7', description: 'Setena major', color: getFunctionColor('7') }
  ];

  legend.innerHTML = `
    <h3>Funcions harmòniques</h3>
    ${items.map(item => `
      <div class="board-legend-item">
        <span class="board-legend-color" style="background:${item.color}"></span>
        <div>
          <div class="board-legend-label">${item.label}</div>
          <div class="board-legend-desc">${item.description}</div>
        </div>
      </div>
    `).join('')}
  `;
}

// Renderitzar mini diapasó per al centre d'estudi (ressaltar notes)
function renderMiniFretboard(highlightNotes = [], highlightGrau = null) {
  const svg = document.getElementById('miniBoard');
  if (!svg) return;
  
  svg.innerHTML = '';
  const W = 240;
  const H = 60;
  svg.setAttribute('width', W);
  svg.setAttribute('height', H);
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  
  const cc = getComputedStyle(document.documentElement);
  const colPrimary = cc.getPropertyValue('--color-text-primary').trim() || '#000';
  const colSecondary = cc.getPropertyValue('--color-text-secondary').trim() || '#666';
  const colBorder = cc.getPropertyValue('--color-border-secondary').trim() || '#ccc';
  
  // Mostrar trasts 0-12
  const fretWidth = W / 13;
  const stringY = H / 2;
  
  // Corda (horizontal)
  el('line', { x1: 0, y1: stringY, x2: W, y2: stringY, stroke: colBorder, 'stroke-width': 2 }, svg);
  
  // Trasts
  for (let f = 0; f <= 12; f++) {
    const x = f * fretWidth;
    el('line', { x1: x, y1: stringY - 8, x2: x, y2: stringY + 8, stroke: colBorder, 'stroke-width': f === 0 ? 3 : 1 }, svg);
    
    // Número de trast
    if (f > 0 && f % 2 === 0) {
      el('text', { x: x + fretWidth/2, y: stringY + 18, 'text-anchor': 'middle', 'font-size': 9, fill: colSecondary }, svg).textContent = f;
    }
  }
  
  // Ressaltar notes
  const openNotes = [4, 9, 2, 7, 11, 4]; // E A D G B E
  const stringOffsets = [-2, -1, 0, 1, 2, 3]; // Offset vertical per cada corda
  
  for (let s = 0; s < 6; s++) {
    const yOffset = stringOffsets[s] * 6;
    
    for (let f = 0; f <= 12; f++) {
      const note = (openNotes[s] + f) % 12;
      const noteName = NS[note];
      
      let shouldHighlight = false;
      let highlightClass = '';
      
      if (highlightNotes.includes(note)) {
        shouldHighlight = true;
        highlightClass = 'nota-ressaltada';
      }
      
      if (shouldHighlight) {
        const x = f === 0 ? 4 : f * fretWidth + fretWidth/2;
        const y = stringY + yOffset;
        const circle = el('circle', { cx: x, cy: y, r: 5, class: highlightClass }, svg);
        el('text', { x: x, y: y + 3, 'text-anchor': 'middle', 'font-size': 7, fill: 'white' }, svg).textContent = noteName;
      }
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { el, render, renderMiniFretboard };
}
