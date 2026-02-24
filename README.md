# Portfolio Cosmique

Portfolio interactif en 3D construit avec Three.js.
Le projet met en scene des domaines de competences sous forme de planetes en orbite autour d'un soleil central.

## Apercu

### Fonctionnalites principales

- **Scene 3D temps reel** avec interactions souris et tactile
- **Orbites elliptiques dynamiques** avec variation de vitesse (loi de Kepler)
- **Ceintures d'asteroides** animees individuellement — chaque particule avance sur sa propre trajectoire elliptique
- **Securite des orbites** : les orbites planetaires ne chevauchent jamais les ceintures (`BELT_ZONES`)
- **Etiquettes dynamiques des planetes** visibles en mode pause
  - Positionnement automatique gauche/droite selon la position a l'ecran
  - Ligne SVG reliant le bord de la planete a son etiquette
  - **Effet de masque solaire** : la typographie passe en bleu sur la zone couverte par le soleil (clip-path dynamique)
- **Vue detail immersive** avec planete 3D interactive et rotation automatique
  - Repartition 50/50 : planete / sidebar
  - **Zoom adaptatif geometrique** calcule selon FOV et aspect ratio du conteneur (fillRatio 72 %)
  - Mis a jour en temps reel via ResizeObserver
- **Cartes-legendes des continents** cliquables avec couleur, nom et hint des skills
- **Systeme de focus** sur les continents (orientation automatique par quaternions)
- **Apercu des continents** (couleurs Fibonacci) visible directement en vue galaxie
- **Rochers-skill interactifs** : un rocher par skill sur chaque continent
  - Tooltip au survol (position curseur)
  - **Encart skill** au clic : panneau anime en bas de sidebar avec nom, continent et description detaillee du skill
- **Geometrie procedurale** avec algorithme de Fibonacci et bruit 3D
- **Interface moderne** avec bouton retour stylise et effets lumineux
- **Animations fluides** avec transitions et interpolations

### Interface utilisateur

- Navigation intuitive entre vue galaxie et vue detail
- Cartes continents cliquables avec indicateurs colores et hints de skills
- Bouton retour avec animation de pulsation
- Bouton pause/lecture pour figer l'animation et afficher les etiquettes
- Responsive design adapte mobile et desktop

## Demonstration locale

Depuis la racine du projet :

```bash
python3 -m http.server 8000
```

Ouvrir dans le navigateur : `http://127.0.0.1:8000`

## Controles

### Vue Galaxie

**Desktop :**
- Clic gauche + mouvement : rotation de la scene
- Molette : zoom
- Clic sur une planete : vue detail
- Clic sur le soleil : ouverture du CV (PDF)
- Bouton pause : fige l'animation, affiche les etiquettes

**Mobile / Tactile :**
- Glisser : rotation | Pincer : zoom
- Tap planete : vue detail
- Tap soleil : ouverture du CV

### Vue Detail

- Bouton `←` : retour galaxie
- Survol rocher : tooltip skill
- **Clic rocher** : encart skill (nom, continent, description detaillee)
- Clic carte continent : oriente la planete vers ce continent
- Clic planete (zone libre) : ferme l'encart, reaffiche les infos globales
- Bouton `✕` de l'encart : ferme l'encart

## Domaines representes (planetes)

| # | Planete | Couleur | Distance | Taille | Continents |
|---|---------|---------|----------|--------|------------|
| 1 | Dev Web | #b366ff | 50 | 12 | Frontend, Backend, Outils |
| 2 | Programmation | #aa55ff | 60 | 11 | Python, PHP, Tailwind, Sass, C++, JavaScript |
| 3 | Infographie | #ff66cc | 85 | 18 | Modelisation, Texturing, Design |
| 4 | Animation | #ff99dd | 95 | 15 | Keyframe, Simulation |
| 5 | Audiovisuel | #9933ff | 120 | 10 | Montage, Motion, VFX |
| 6 | Modelisation | #bb44ff | 130 | 13 | Sculpting, Baking, Rendering |
| 7 | Design UI/UX | #dd66ff | 155 | 14 | Interface, Experience, Accessibilite |

## Stack technique

- Three.js (CDN r128) / HTML5 / CSS3 / JavaScript vanilla

## Structure du projet

```
galaxytest/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── data.js       # donnees planetes, continents, skillDetails et continentColors
    ├── geometry.js   # geometrie procedurale (Fibonacci, bruit 3D, rochers)
    ├── scene.js      # scene Three.js, camera, lumieres, soleil
    ├── asteroids.js  # ceintures d'asteroides + BELT_ZONES
    ├── planets.js    # creation planetes, orbites, safePlanetOrbit()
    ├── animation.js  # boucle animate(), updateBelts(), updateOrbits()
    ├── detail.js     # vue detail, zoom adaptatif, encart skill, focus continent
    ├── controls.js   # souris, tactile, zoom, resize
    ├── labels.js     # etiquettes SVG, masque solaire (clip-path)
    └── main.js       # point d'entree
```

## Points techniques cles

- **Zoom adaptatif** : `Z = R / (fillRatio * tan(FOV/2))` — planete a 72% de la dim contraignante
- **Securite ceintures** : `BELT_ZONES` dans asteroids.js, `safePlanetOrbit()` dans planets.js (marge 5u)
- **Asteroides orbitaux** : BufferAttribute mis a jour individuellement a chaque frame via `needsUpdate`
- **Masque solaire** : `.label-sun` avec `clip-path: circle(Rpx at X Y)` recalcule a chaque frame
- **Encart skill** : `#skill-encart` glisse depuis le bas (transform/translateY), couleur dynamique du continent
- **Focus continent** : quaternion.slerp() pour orienter la planete vers le continent cible
- **Etiquettes** : `getWorldPosition()` a chaque frame pour suivre la rotation de scene

## Pistes d'amelioration

- Descriptions/liens par skill dans l'encart
- Mode clair/sombre
- Performances adaptatives (LOD)
