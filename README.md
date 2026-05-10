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

**Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**

Aquest projecte és **codi obert però NO comercial**:
- ✅ **Permès**: Ús personal, educatiu, modificacions, distribució no comercial
- ✅ **Requisit**: Atribució a l'autor original
- ✅ **Requisit**: Compartir amb la mateixa llicència (ShareAlike)
- ❌ **Prohibit**: Ús comercial sense autorització expressa

Consulta el fitxer `LICENSE` per al text complet.

## Autor

**peplx**
