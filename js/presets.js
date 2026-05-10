// Presets habituals d'acords
const PRESETS = [
  { root: 'C', type: '', name: 'C', frets: [-1, 3, 2, 0, 1, 0], start: 1 },
  { root: 'C', type: 'm', name: 'Cm', frets: [-1, 3, 5, 5, 4, 3], start: 3 },
  { root: 'C', type: '7', name: 'C7', frets: [-1, 3, 2, 3, 1, 0], start: 1 },
  { root: 'D', type: '', name: 'D', frets: [-1, -1, 0, 2, 3, 2], start: 1 },
  { root: 'D', type: 'm', name: 'Dm', frets: [-1, -1, 0, 2, 3, 1], start: 1 },
  { root: 'D', type: '7', name: 'D7', frets: [-1, -1, 0, 2, 1, 2], start: 1 },
  { root: 'E', type: '', name: 'E', frets: [0, 2, 2, 1, 0, 0], start: 1 },
  { root: 'E', type: 'm', name: 'Em', frets: [0, 2, 2, 0, 0, 0], start: 1 },
  { root: 'E', type: '7', name: 'E7', frets: [0, 2, 0, 1, 0, 0], start: 1 },
  { root: 'F', type: '', name: 'F', frets: [1, 3, 3, 2, 1, 1], start: 1 },
  { root: 'F', type: 'm', name: 'Fm', frets: [1, 3, 3, 1, 1, 1], start: 1 },
  { root: 'G', type: '', name: 'G', frets: [3, 2, 0, 0, 0, 3], start: 1 },
  { root: 'G', type: '7', name: 'G7', frets: [3, 2, 0, 0, 0, 1], start: 1 },
  { root: 'A', type: '', name: 'A', frets: [-1, 0, 2, 2, 2, 0], start: 1 },
  { root: 'A', type: 'm', name: 'Am', frets: [-1, 0, 2, 2, 1, 0], start: 1 },
  { root: 'A', type: '7', name: 'A7', frets: [-1, 0, 2, 0, 2, 0], start: 1 },
  { root: 'B', type: '', name: 'B', frets: [-1, 2, 4, 4, 4, 2], start: 2 },
  { root: 'B', type: 'm', name: 'Bm', frets: [-1, 2, 4, 4, 3, 2], start: 2 }
];

// Funcions d'utilitat per a shapes
function shapeLabel(frets) {
  return frets.map((f) => (f < 0 ? 'x' : String(f))).join(' ');
}

function normalizeShapeWindow(frets) {
  const pressed = frets.filter((f) => f > 0);
  if (!pressed.length) return 1;
  return Math.max(1, Math.min(...pressed));
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRESETS, shapeLabel, normalizeShapeWindow };
}
