# Portfolio Cosmique

Un portfolio interactif utilisant Three.js pour créer une visualisation 3D des compétences.

## 📁 Structure du projet

```
portfolio-cosmique/
├── index.html              # Page d'accueil - Galaxie interactive
├── css/
│   └── style.css          # Feuille de styles unifiée
├── js/
│   ├── main.js            # Logique principale (scène 3D, interactions)
│   └── planet-detail.js   # Logique des pages de détail des planètes
└── pages/                 # Pages de détail individuelles
    ├── planet-dev-web.html
    ├── planet-infographie.html
    ├── planet-audiovisuel.html
    ├── planet-design-uiux.html
    ├── planet-programmation.html
    ├── planet-animation.html
    ├── planet-modelisation.html
    └── planet-game-dev.html
```

## 🎮 Contrôles

- **Clic gauche + mouvement** : Rotation de la scène
- **Molette** : Zoom
- **Clic sur une planète** : Voir les détails

## 🌍 Planètes

Le portfolio contient 8 domaines d'expertise représentés comme des planètes orbitant autour d'un soleil central :

1. **Dev Web** - Développement web (React, Vue, Node.js)
2. **Infographie** - Design 3D et graphique
3. **Audiovisuel** - Montage vidéo et VFX
4. **Design UI/UX** - Conception d'interfaces
5. **Programmation** - Multi-langages (Python, C++, JavaScript)
6. **Animation** - Animation 3D et motion
7. **Modélisation** - Modélisation 3D avancée
8. **Game Dev** - Développement de jeux (Unity, Unreal)

## 🚀 Utilisation

1. Ouvrir `index.html` dans un navigateur moderne
2. Explorer la galaxie avec la souris
3. Cliquer sur une planète pour voir les détails
4. Cliquer le bouton "←" pour revenir

## 📦 Dépendances

- **Three.js** (v128) - Chargé via CDN

## 📝 Notes

- Tous les fichiers CSS sont consolidés dans `css/style.css`
- La logique JavaScript est séparée en deux modules : `js/main.js` (galaxie) et `js/planet-detail.js` (détails)
- Les pages de détail utilisent des chemins relatifs (`../`) pour accéder aux ressources
