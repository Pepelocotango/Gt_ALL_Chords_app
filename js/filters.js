// Panell de filtres de digitacions
// Requereix: chordEngine.js

function createFiltersPanel() {
  const container = document.getElementById('filtersPanel');
  if (!container) return;
  
  container.innerHTML = `
    <div class="filtres-titol">Filtres de digitacions</div>
    <div class="filtres-grid">
      <div class="filtre-grup">
        <label class="filtre-label">Zona del màstil</label>
        <select id="filtreZona" class="filtre-select">
          <option value="totes">Totes les zones</option>
          <option value="baixa">Baixa (trast 1-5)</option>
          <option value="mitjana">Mitjana (trast 3-9)</option>
          <option value="alta">Alta (trast 7+)</option>
          <optgroup label="Rang específic">
            <option value="1-5">Trasts 1-5</option>
            <option value="5-9">Trasts 5-9</option>
            <option value="9-12">Trasts 9-12</option>
            <option value="12+">Trast 12+</option>
          </optgroup>
        </select>
      </div>
      
      <div class="filtre-grup">
        <label class="filtre-label">Nombre de cordes</label>
        <select id="filtreCordes" class="filtre-select">
          <option value="qualsevol">Qualsevol</option>
          <option value="4">4 cordes</option>
          <option value="5">5 cordes</option>
          <option value="6">6 cordes</option>
        </select>
      </div>
      
      <div class="filtre-grup">
        <label class="filtre-label">Dificultat</label>
        <select id="filtreDificultat" class="filtre-select">
          <option value="tots">Totes</option>
          <option value="facil">Fàcil (obertes, span petit)</option>
          <option value="mitja">Mitjana</option>
          <option value="dificil">Difícil (barre, lluny)</option>
        </select>
      </div>
      
      <div class="filtre-grup">
        <label class="filtre-label">Inversió</label>
        <select id="filtreInversio" class="filtre-select">
          <option value="qualsevol">Qualsevol</option>
          <option value="fundamental">Fonamental al baix</option>
          <option value="primera">Primera inversió (3a al baix)</option>
          <option value="segona">Segona inversió (5a al baix)</option>
        </select>
      </div>
      
      <div class="filtre-grup">
        <label class="filtre-label">Cordes obertes</label>
        <select id="filtreObertes" class="filtre-select">
          <option value="qualsevol">Indiferent</option>
          <option value="amb">Amb cordes obertes</option>
          <option value="sense">Sense cordes obertes</option>
        </select>
      </div>
      
      <div class="filtre-grup">
        <label class="filtre-label">Baix específic</label>
        <select id="filtreBaix" class="filtre-select">
          <option value="qualsevol">Qualsevol corda</option>
          <option value="mi">Corda Mi (6a)</option>
          <option value="la">Corda La (5a)</option>
          <option value="re">Corda Re (4a)</option>
          <option value="sol">Corda Sol (3a)</option>
          <option value="si">Corda Si (2a)</option>
          <option value="mi2">Corda Mi (1a)</option>
        </select>
      </div>
    </div>
    <div class="filtres-accions">
      <button id="btnAplicarFiltres" class="filtre-btn actiu">Aplicar filtres</button>
      <button id="btnResetFiltres" class="filtre-btn">Restablir filtres</button>
    </div>
  `;
  
  // Event listeners
  document.getElementById('filtreZona').addEventListener('change', (e) => setFilter('zona', e.target.value));
  document.getElementById('filtreCordes').addEventListener('change', (e) => setFilter('cordes', e.target.value));
  document.getElementById('filtreDificultat').addEventListener('change', (e) => setFilter('dificultat', e.target.value));
  document.getElementById('filtreInversio').addEventListener('change', (e) => setFilter('inversio', e.target.value));
  document.getElementById('filtreObertes').addEventListener('change', (e) => setFilter('obertes', e.target.value));
  document.getElementById('filtreBaix').addEventListener('change', (e) => setFilter('baix', e.target.value));
  
  document.getElementById('btnAplicarFiltres').addEventListener('click', () => {
    visibleVoicingLimit = 250;
    updatePresets();
  });
  
  document.getElementById('btnResetFiltres').addEventListener('click', () => {
    resetFilters();
    // Actualitzar UI
    document.getElementById('filtreZona').value = 'totes';
    document.getElementById('filtreCordes').value = 'qualsevol';
    document.getElementById('filtreDificultat').value = 'tots';
    document.getElementById('filtreInversio').value = 'qualsevol';
    document.getElementById('filtreObertes').value = 'qualsevol';
    document.getElementById('filtreBaix').value = 'qualsevol';
    visibleVoicingLimit = 250;
    updatePresets();
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createFiltersPanel };
}
