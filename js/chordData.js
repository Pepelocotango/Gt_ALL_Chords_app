// Constants globals
const N_STR = 6;
const N_FRE = 5;
const STR_NAMES = ['E', 'A', 'D', 'G', 'B', 'e'];
const OPEN_N = [4, 9, 2, 7, 11, 4];
const NS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NSF = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const FLAT_ROOTS = new Set([1, 3, 8, 10]);
const ENHARMONIC_NAMES = [
  ['C'],
  ['C#', 'Db'],
  ['D'],
  ['D#', 'Eb'],
  ['E'],
  ['F'],
  ['F#', 'Gb'],
  ['G'],
  ['G#', 'Ab'],
  ['A'],
  ['A#', 'Bb'],
  ['B']
];

function enharmonicNoteNames(pitch) {
  const idx = ((pitch % 12) + 12) % 12;
  return ENHARMONIC_NAMES[idx] ? [...new Set(ENHARMONIC_NAMES[idx])] : [NS[idx]];
}

// Coordenades del diapasó
const CX = (s) => 20 + s * 40;
const FY_TOP = 42;
const FH = 50;
const FY = (f) => FY_TOP + f * FH;
const DOT_R = 13;

// Opcions d'arrel
const ROOT_OPTIONS = [
  { value: 'C', pitch: 0 }, { value: 'C#', pitch: 1 }, { value: 'Db', pitch: 1 },
  { value: 'D', pitch: 2 }, { value: 'D#', pitch: 3 }, { value: 'Eb', pitch: 3 },
  { value: 'E', pitch: 4 }, { value: 'F', pitch: 5 }, { value: 'F#', pitch: 6 },
  { value: 'Gb', pitch: 6 }, { value: 'G', pitch: 7 }, { value: 'G#', pitch: 8 },
  { value: 'Ab', pitch: 8 }, { value: 'A', pitch: 9 }, { value: 'A#', pitch: 10 },
  { value: 'Bb', pitch: 10 }, { value: 'B', pitch: 11 }
];

// Acords base
const BASE_CHORDS = [
  { s: '', label: 'Major', i: [0, 4, 7], aliases: ['M'], family: 'Triades' },
  { s: 'm', label: 'Menor', i: [0, 3, 7], aliases: ['min', '-'], family: 'Triades' },
  { s: '5', label: 'Quinta', i: [0, 7], aliases: ['no3'], family: 'Triades' },
  { s: 'dim', label: 'Disminuït', i: [0, 3, 6], aliases: ['o'], family: 'Triades' },
  { s: 'aug', label: 'Augmentat', i: [0, 4, 8], aliases: ['+'], family: 'Triades' },
  { s: 'sus2', label: 'Suspès 2', i: [0, 2, 7], family: 'Suspesos' },
  { s: 'sus4', label: 'Suspès 4', i: [0, 5, 7], aliases: ['sus'], family: 'Suspesos' },
  { s: '6', label: 'Sisena', i: [0, 4, 7, 9], family: 'Sextes' },
  { s: 'm6', label: 'Menor 6', i: [0, 3, 7, 9], family: 'Sextes' },
  { s: '6/9', label: 'Sisena/novena', i: [0, 2, 4, 7, 9], family: 'Sextes' },
  { s: 'm6/9', label: 'Menor 6/9', i: [0, 2, 3, 7, 9], family: 'Sextes' },
  { s: '7', label: 'Dominant 7', i: [0, 4, 7, 10], family: 'Setenes' },
  { s: 'maj7', label: 'Major 7', i: [0, 4, 7, 11], aliases: ['M7', 'Δ7'], family: 'Setenes' },
  { s: 'm7', label: 'Menor 7', i: [0, 3, 7, 10], family: 'Setenes' },
  { s: 'mMaj7', label: 'Menor major 7', i: [0, 3, 7, 11], aliases: ['mM7'], family: 'Setenes' },
  { s: 'dim7', label: 'Disminuït 7', i: [0, 3, 6, 9], aliases: ['o7'], family: 'Setenes' },
  { s: 'm7b5', label: 'Semidisminuït', i: [0, 3, 6, 10], aliases: ['ø7'], family: 'Setenes' },
  { s: '7sus4', label: 'Setena suspesa 4', i: [0, 5, 7, 10], family: 'Suspesos' },
  { s: '7sus2', label: 'Setena suspesa 2', i: [0, 2, 7, 10], family: 'Suspesos' },
  { s: 'maj7sus4', label: 'Major 7 suspesa 4', i: [0, 5, 7, 11], family: 'Suspesos' },
  { s: 'add2', label: 'Add 2', i: [0, 2, 4, 7], family: 'Add' },
  { s: 'add4', label: 'Add 4', i: [0, 4, 5, 7], family: 'Add' },
  { s: 'add9', label: 'Add 9', i: [0, 2, 4, 7], family: 'Add' },
  { s: 'madd9', label: 'Menor add 9', i: [0, 2, 3, 7], family: 'Add' },
  { s: 'madd11', label: 'Menor add 11', i: [0, 3, 5, 7], family: 'Add' },
  { s: '9', label: 'Dominant 9', i: [0, 2, 4, 7, 10], family: 'Extensions' },
  { s: 'maj9', label: 'Major 9', i: [0, 2, 4, 7, 11], aliases: ['M9', 'Δ9'], family: 'Extensions' },
  { s: 'm9', label: 'Menor 9', i: [0, 2, 3, 7, 10], family: 'Extensions' },
  { s: 'mMaj9', label: 'Menor major 9', i: [0, 2, 3, 7, 11], family: 'Extensions' },
  { s: '11', label: 'Dominant 11', i: [0, 2, 4, 5, 7, 10], family: 'Extensions' },
  { s: 'maj11', label: 'Major 11', i: [0, 2, 4, 5, 7, 11], family: 'Extensions' },
  { s: 'm11', label: 'Menor 11', i: [0, 2, 3, 5, 7, 10], family: 'Extensions' },
  { s: '13', label: 'Dominant 13', i: [0, 2, 4, 7, 9, 10], family: 'Extensions' },
  { s: 'maj13', label: 'Major 13', i: [0, 2, 4, 7, 9, 11], family: 'Extensions' },
  { s: 'm13', label: 'Menor 13', i: [0, 2, 3, 7, 9, 10], family: 'Extensions' }
];

// Acords addicionals del PDF (Intermediate)
const INTERMEDIATE_CHORDS = [
  { s: 'm7b9', label: 'Menor 7 bemoll 9', i: [0, 1, 3, 7, 10], family: 'Setenes' },
  { s: '7add11', label: 'Dominant 7 add 11', i: [0, 4, 5, 7, 10], family: 'Extensions' }
];

// Dominants alterats (existent)
const ALTERED_DOMINANTS = [
  { s: '7b5', i: [0, 4, 6, 10] },
  { s: '7#5', i: [0, 4, 8, 10] },
  { s: '7b9', i: [0, 1, 4, 7, 10] },
  { s: '7#9', i: [0, 3, 4, 7, 10] },
  { s: '7#9#11', i:[0, 3, 4, 6, 10] },
  { s: '7#11', i: [0, 4, 6, 7, 10] },
  { s: '7b13', i: [0, 4, 7, 8, 10] },
  { s: '9b5', i: [0, 2, 4, 6, 10] },
  { s: '9#5', i: [0, 2, 4, 8, 10] },
  { s: '9#11', i: [0, 2, 4, 6, 7, 10] },
  { s: '13b9', i: [0, 1, 4, 7, 9, 10] },
  { s: '13#9', i: [0, 3, 4, 7, 9, 10] },
  { s: '13#11', i: [0, 2, 4, 6, 7, 9, 10] },
  { s: '7b9b5', i: [0, 1, 4, 6, 10] },
  { s: '7b9#5', i: [0, 1, 4, 8, 10] },
  { s: '7#9b5', i: [0, 3, 4, 6, 10] },
  { s: '7#9#5', i: [0, 3, 4, 8, 10] },
  { s: '7alt', i: [0, 1, 3, 4, 8, 10] }
].map((c) => ({ ...c, label: `Dominant ${c.s.slice(1)}`, family: 'Dominants alterats' }));

// Acords avançats del PDF (Advanced)
const ADVANCED_CHORDS = [
  { s: 'maj7b5', label: 'Major 7 bemoll 5', i: [0, 4, 6, 11], family: 'Setenes' },
  { s: 'maj7#5', label: 'Major 7 augmentat', i: [0, 4, 8, 11], family: 'Setenes' },
  { s: '7b5b9', label: 'Dominant 7 bemoll 5 bemoll 9', i: [0, 1, 4, 6, 10], family: 'Dominants alterats' },
  { s: '7#5b9', label: 'Dominant 7 augmentat bemoll 9', i: [0, 1, 4, 8, 10], family: 'Dominants alterats' },
  { s: '7#5#9', label: 'Dominant 7 augmentat sostingut 9', i: [0, 3, 4, 8, 10], family: 'Dominants alterats' },
  { s: 'm7b5b9', label: 'Semidisminuït bemoll 9', i: [0, 1, 3, 6, 10], family: 'Setenes' },
  { s: 'm7add11', label: 'Menor 7 add 11', i: [0, 3, 5, 7, 10], family: 'Setenes' },
  { s: 'maj7#11', label: 'Major 7 sostingut 11', i: [0, 4, 6, 7, 11], family: 'Extensions' },
  { s: 'm9b5', label: 'Menor 9 bemoll 5', i: [0, 2, 3, 6, 10], family: 'Extensions' },
  { s: 'mMaj9', label: 'Menor major 9', i: [0, 2, 3, 7, 11], family: 'Extensions' },
  { s: 'maj9#5', label: 'Major 9 augmentat', i: [0, 2, 4, 8, 11], family: 'Extensions' },
  { s: '9#11', label: 'Dominant 9 sostingut 11', i: [0, 2, 4, 6, 7, 10], family: 'Extensions' },
  { s: 'maj9#11', label: 'Major 9 sostingut 11', i: [0, 2, 4, 6, 7, 11], family: 'Extensions' },
  { s: '11b9', label: 'Dominant 11 bemoll 9', i: [0, 1, 4, 5, 7, 10], family: 'Extensions' },
  { s: '13b5b9', label: 'Dominant 13 bemoll 5 bemoll 9', i: [0, 1, 4, 6, 9, 10], family: 'Extensions' },
  { s: '13b9', label: 'Dominant 13 bemoll 9', i: [0, 1, 4, 7, 9, 10], family: 'Extensions' },
  { s: '13#9', label: 'Dominant 13 sostingut 9', i: [0, 3, 4, 7, 9, 10], family: 'Extensions' },
  { s: '13#11', label: 'Dominant 13 sostingut 11', i: [0, 2, 4, 6, 7, 9, 10], family: 'Extensions' }
];

// Funcions d'utilitat
function uniqIntervals(intervals) {
  return [...new Set(intervals.map((n) => ((n % 12) + 12) % 12))].sort((a, b) => a - b);
}

// Construir catàleg d'acords
function buildChordCatalog() {
  const source = [...BASE_CHORDS, ...INTERMEDIATE_CHORDS, ...ALTERED_DOMINANTS, ...ADVANCED_CHORDS];
  const seen = new Set();
  const catalog = [];
  for (const chord of source) {
    const intervals = uniqIntervals(chord.i);
    const key = `${chord.s}:${intervals.join(',')}`;
    if (seen.has(key)) continue;
    seen.add(key);
    catalog.push({ ...chord, i: intervals });
  }
  return catalog.sort((a, b) => a.family.localeCompare(b.family) || a.s.localeCompare(b.s));
}

const CHORDS = buildChordCatalog();

// Funcions d'utilitat musical
function nname(n, flat) {
  n = ((n % 12) + 12) % 12;
  return flat ? NSF[n] : NS[n];
}

const INTERVAL_NAMES = {
  0: { standard: 'T', alt: '1' },
  1: { standard: 'b2', alt: 'b9' },
  2: { standard: '2', alt: '9' },
  3: { standard: 'b3', alt: '#9' },
  4: { standard: '3', alt: 'b4' },
  5: { standard: '4', alt: '11' },
  6: { standard: 'b5', alt: '#11' },
  7: { standard: '5', alt: 'b6' },
  8: { standard: 'b6', alt: 'b13' },
  9: { standard: '6', alt: '13', dim: 'bb7' },
  10: { standard: 'b7', alt: '#13' },
  11: { standard: '7', alt: 'maj7' }
};

function getIntervalName(semitones, chordSuffix = '') {
  const info = INTERVAL_NAMES[semitones % 12];
  if (!info) return semitones.toString();

  const suffix = chordSuffix.toLowerCase();
  const has2 = /\b2\b|add2|sus2/.test(suffix);
  const has9 = /\b9\b|add9|maj9|m9|sus9|s9|11|13/.test(suffix);
  const hasFlat9 = /b9/.test(suffix);
  const hasSharp9 = /#9|s9/.test(suffix);
  const has11 = /\b11\b|s11/.test(suffix);
  const hasSharp11 = /#11|s11/.test(suffix);
  const hasFlat5 = /b5|dim7|o7|ø/.test(suffix);
  const has13 = /\b13\b/.test(suffix);
  const hasSharp13 = /#13|s13/.test(suffix);
  const has6 = /\b6\b/.test(suffix);
  const hasMaj7 = /maj7|Δ7|M7/.test(suffix);
  const hasDim7 = /dim7|o7/.test(suffix);

  if (hasDim7 && semitones === 9) return info.dim;

  switch (semitones % 12) {
    case 0:
      return info.standard;
    case 1:
      return has9 || hasFlat9 || hasSharp9 ? 'b9' : 'b2';
    case 2:
      if (has2 && !has9) return '2';
      return has9 ? '9' : '2';
    case 3:
      return hasSharp9 ? '#9' : info.standard;
    case 4:
      return info.standard;
    case 5:
      if (suffix.includes('sus4')) return '4';
      return has11 ? '11' : info.standard;
    case 6:
      if (hasSharp11) return '#11';
      if (hasFlat5) return 'b5';
      return info.standard;
    case 7:
      return info.standard;
    case 8:
      return 'b13';
    case 9:
      if (hasDim7) return info.dim;
      if (has13) return '13';
      if (has6 && !has13) return '6';
      return info.standard;
    case 10:
      if (hasSharp13) return '#13';
      return info.standard;
    case 11:
      return hasMaj7 ? 'maj7' : info.standard;
    default:
      return info.standard;
  }
}

const DIATONIC_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const NATURAL_LETTER_PITCH = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const INTERVAL_PROPERTIES = {
  T:   { degree: 1, semitones: 0 },
  '1': { degree: 1, semitones: 0 },
  'b2': { degree: 2, semitones: 1 },
  'b9': { degree: 2, semitones: 1 },
  '2': { degree: 2, semitones: 2 },
  '9': { degree: 2, semitones: 2 },
  '#2': { degree: 2, semitones: 3 },
  '#9': { degree: 2, semitones: 3 },
  's9': { degree: 2, semitones: 3 },
  'b3': { degree: 3, semitones: 3 },
  '3': { degree: 3, semitones: 4 },
  '4': { degree: 4, semitones: 5 },
  '11': { degree: 4, semitones: 5 },
  '#4': { degree: 4, semitones: 6 },
  'b5': { degree: 5, semitones: 6 },
  '5': { degree: 5, semitones: 7 },
  '#5': { degree: 5, semitones: 8 },
  'b6': { degree: 6, semitones: 8 },
  '6': { degree: 6, semitones: 9 },
  '13': { degree: 6, semitones: 9 },
  'bb7': { degree: 7, semitones: 9 },
  'b7': { degree: 7, semitones: 10 },
  '7': { degree: 7, semitones: 11 },
  'maj7': { degree: 7, semitones: 11 },
  '#11': { degree: 4, semitones: 6 },
  's11': { degree: 4, semitones: 6 },
  'b11': { degree: 4, semitones: 4 },
  'b13': { degree: 6, semitones: 8 },
  '#13': { degree: 6, semitones: 10 },
  's13': { degree: 6, semitones: 10 }
};

function parseIntervalDescriptor(interval) {
  if (!interval) return null;
  const normalized = interval.toString().trim().toLowerCase();
  const alias = {
    t: '1',
    s9: '#9',
    s11: '#11',
    s13: '#13',
    'Δ7': 'maj7'
  };
  const normalizedKey = alias[normalized] || normalized;
  if (INTERVAL_PROPERTIES[normalizedKey]) return INTERVAL_PROPERTIES[normalizedKey];

  const match = normalizedKey.match(/^(bb|b|##|#|x)?(\d+)$/i);
  if (!match) return null;

  const accidental = match[1] || '';
  const value = Number(match[2]);
  const degree = ((value - 1) % 7) + 1;
  const baseSemitones = [0, 2, 4, 5, 7, 9, 11][degree - 1];
  const offset = accidental === 'bb' ? -2 : accidental === 'b' ? -1 : accidental === '##' || accidental === 'x' ? 2 : accidental === '#' ? 1 : 0;
  return { degree, semitones: baseSemitones + offset };
}

function getCorrectNoteName(rootName, intervalName) {
  const root = rootName?.toString().trim();
  if (!root) return null;

  const rootPitchValue = rootPitch(root);
  const rootLetter = root[0].toUpperCase();
  if (!Object.prototype.hasOwnProperty.call(NATURAL_LETTER_PITCH, rootLetter)) return null;

  const interval = parseIntervalDescriptor(intervalName);
  if (!interval) return null;

  const targetLetterIndex = (DIATONIC_LETTERS.indexOf(rootLetter) + interval.degree - 1) % DIATONIC_LETTERS.length;
  const targetLetter = DIATONIC_LETTERS[targetLetterIndex];
  const naturalTargetPitch = NATURAL_LETTER_PITCH[targetLetter];
  const requiredPitch = (rootPitchValue + interval.semitones + 12) % 12;

  let alteration = requiredPitch - naturalTargetPitch;
  while (alteration > 6) alteration -= 12;
  while (alteration < -6) alteration += 12;

  const accidental = alteration === 0 ? '' : alteration < 0 ? 'b'.repeat(-alteration) : '#'.repeat(alteration);
  return `${targetLetter}${accidental}`;
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

function rootPitch(rootName) {
  return ROOT_OPTIONS.find((root) => root.value === rootName)?.pitch ?? 0;
}

function chordBySuffix(suffix) {
  return CHORDS.find((chord) => chord.s === suffix) || CHORDS[0];
}

function chordName(root, chord, bass = root) {
  const rootName = typeof root === 'string' ? root : nname(root, FLAT_ROOTS.has(root));
  const bassName = typeof bass === 'string' ? bass : nname(bass, FLAT_ROOTS.has(bass));
  const base = `${rootName}${chord.s}`;
  return bass !== root ? `${base}/${bassName}` : base;
}

// Exportar per a mòduls ES6 (si s'usa) o globals
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { N_STR, N_FRE, STR_NAMES, OPEN_N, NS, NSF, FLAT_ROOTS, CX, FY_TOP, FH, FY, DOT_R, ROOT_OPTIONS, CHORDS, nname, rootPitch, getCorrectNoteName, chordBySuffix, chordName, uniqIntervals };
}
