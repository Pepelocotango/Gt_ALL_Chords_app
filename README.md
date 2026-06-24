# Autor

Pëp pepelocotango@gmail.com

# Creador d'Acords de Guitarra

Aplicació d'escriptori per a Linux per crear, buscar i estudiar acords de guitarra.

## Característiques

- **Diapasó interactiu**: Visualitza i selecciona posicions al diapasó
- **Identificador d'acords**: Detecta automàticament els acords segons les posicions marcades
- **Filtres de digitacions**: Filtra acords per dificultat, nombre de cordes, posició, etc.
- **Centre d'estudi**: Eina per practicar i memoritzar acords
- **Cercle de quintes**: Visualització harmònica per entendre relacions tonals
- **Diccionari flamenc**: Col·lecció d'acords típics del flamenc
- **Escala cromàtica**: Eina visual per a l'escala cromàtica
- **Presets**: Carrega acords predefinits ràpidament

## Requisits

- Node.js 18+
- npm o yarn
- Linux (per a la construcció AppImage)

## Instal·lació

```bash
# Clonar el repositori
git clone https://github.com.com/peplx/Gt_ALL_Chords_app.git
cd Gt_ALL_Chords_app

# Instal·lar dependències
npm install
```

## Ús

### Executar en mode desenvolupament

```bash
npm start
```

### Construir AppImage (distribuïble)

```bash
npm run build:appimage
```

L'arxiu `.AppImage` es generarà a la carpeta `dist/`.

## Estructura del projecte

```
Gt_ALL_Chords_app/
├── assets/              # Imatges i recursos
├── documentacio_per_treball/  # Documentació del projecte
├── js/                  # Mòduls JavaScript
│   ├── chordData.js     # Dades d'acords
│   ├── chordEngine.js   # Motor d'identificació
│   ├── fretboard.js     # Diapasó interactiu
│   ├── circleOfFifths.js # Cercle de quintes
│   ├── studyCenter.js   # Centre d'estudi
│   └── ...
├── guitar_chord_identifier.html  # Interfície principal
├── main.js              # Punt d'entrada Electron
├── styles.css           # Estils de l'aplicació
└── package.json
```

## Tecnologies

- [Electron](https://www.electronjs.org/) - Framework per a aplicacions d'escriptori
- [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG) - Gràfics vectorials per al diapasó
- HTML5/CSS3/JavaScript (ES6+)

## Llicència

**Polyform Noncommercial License 1.0.0** (Codi obert no comercial)

Aquest projecte és **codi obert però estrictament NO comercial**:

✅ **Permès**:
- Ús personal i estudis
- Ús educatiu i acadèmic
- Modificacions (amb codi font disponible)
- Organitzacions sense ànim de lucre
- Recerca pública

❌ **Prohibit**:
- Qualsevol ús comercial o amb finalitat de lucre
- Venda del software o serveis basats en ell
- Ús per empreses o organitzacions comercials

**Copyleft:** Si distribueixes el codi (modificat o no), has de fer públic el codi font sota la mateixa llicència.

Per a llicències comercials, contacta amb l'autor.

Consulta el fitxer `LICENSE` per al text complet: <https://polyformproject.org/licenses/noncommercial/1.0.0>

## Autor

**peplx**

## Llicència

Aquest projecte està llicenciat sota la llicència **GNU General Public License v3.0**. Consulta el fitxer [LICENSE](LICENSE) per obtenir més detalls.

---
**Visita el portal de projectes:** [https://pepelocotango.github.io](https://pepelocotango.github.io)
---
