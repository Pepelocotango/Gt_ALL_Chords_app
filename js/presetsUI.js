// UI de la llista de presets i voicings generats - Versió compacta amb desplegable
// Requereix: chordData.js, chordEngine.js, presets.js, studyCenter.js

function updatePresets() {
  const root = document.getElementById('rootSelect').value;
  const type = document.getElementById('typeSelect').value;
  const select = document.getElementById('presetSelect');
  const countLabel = document.getElementById('presetCount');
  const matches = PRESETS.filter((p) => p.root === root && p.type === type);
  const allGenerated = generateVoicings(root, type);
  const generated = allGenerated.slice(0, visibleVoicingLimit);
  
  select.innerHTML = '';
  
  // Opció per defecte
  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = 'Selecciona una posició...';
  select.appendChild(defaultOpt);
  
  if (!matches.length && !allGenerated.length) {
    const empty = document.createElement('option');
    empty.disabled = true;
    empty.textContent = 'No hi ha posicions disponibles';
    select.appendChild(empty);
    countLabel.textContent = '';
    return;
  }
  
  // Actualitzar comptador
  const totalItems = matches.length + generated.length;
  countLabel.textContent = `(${totalItems})`;
  
  // Grup: Presets habituals
  if (matches.length) {
    const groupHabituals = document.createElement('optgroup');
    groupHabituals.label = `Habituals (${matches.length})`;
    for (const preset of matches) {
      const opt = document.createElement('option');
      opt.value = JSON.stringify({ type: 'preset', data: preset });
      opt.textContent = `${preset.name} — ${shapeLabel(preset.frets)}`;
      groupHabituals.appendChild(opt);
    }
    select.appendChild(groupHabituals);
  }
  
  // Grup: Voicings generats
  if (generated.length) {
    const groupGenerats = document.createElement('optgroup');
    groupGenerats.label = `Generats (${generated.length})`;
    for (const shape of generated) {
      if (matches.some((preset) => shapeLabel(preset.frets) === shapeLabel(shape.frets))) continue;
      const opt = document.createElement('option');
      opt.value = JSON.stringify({ type: 'shape', data: shape });
      const start = normalizeShapeWindow(shape.frets);
      opt.textContent = `${root}${type} (trast ${start}) — ${shapeLabel(shape.frets)}`;
      groupGenerats.appendChild(opt);
    }
    select.appendChild(groupGenerats);
  }
  
  // Opció "Mostra més" si hi ha més resultats
  if (allGenerated.length > visibleVoicingLimit) {
    const moreOpt = document.createElement('option');
    moreOpt.value = '__MORE__';
    moreOpt.textContent = `Mostra més posicions (+${Math.min(250, allGenerated.length - visibleVoicingLimit)})`;
    select.appendChild(moreOpt);
  }
}

// Gestionar selecció del desplegable
document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('presetSelect');
  if (select) {
    select.addEventListener('change', (e) => {
      const value = e.target.value;
      if (!value) return;
      
      if (value === '__MORE__') {
        visibleVoicingLimit += 250;
        updatePresets();
        e.target.value = '';
        return;
      }
      
      try {
        const parsed = JSON.parse(value);
        if (parsed.type === 'preset') {
          applyPreset(parsed.data);
        } else if (parsed.type === 'shape') {
          applyShape(parsed.data.frets);
        }
      } catch (err) {
        console.error('Error aplicant posició:', err);
      }
    });
  }
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { updatePresets };
}
