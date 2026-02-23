# Portfolio Cosmique

Un portfolio interactif utilisant Three.js pour créer une visualisation 3D des compétences.

## 📁 Structure du projet

```
galaxy-test/
├── index.html            # Page principale (galaxie interactive)
├── css/
│   └── style.css         # Styles globaux
├── js/
│   └── main.js           # Scène Three.js + interactions + vue détail
├── CV.pdf                # CV ouvert via interaction
└── toggle.png            # Favicon
```

## 🎮 Contrôles

- **Clic gauche + mouvement** : Rotation de la scène
- **Molette** : Zoom
- **Clic sur une planète** : Voir les détails
- **Tactile** : Glisser (rotation), pincer (zoom), tap (détails)

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

### Démarrage local (serveur Python)

Depuis la racine du projet, lancer :

```bash
python3 -m http.server 8000
```

Puis ouvrir dans le navigateur :

- `http://127.0.0.1:8000`

Pour arrêter le serveur :

- `Ctrl + C` dans le terminal

> Si `python3` ne fonctionne pas sur ta machine, essaie `python -m http.server 8000`.

### Utilisation

1. Démarrer le serveur local Python
2. Ouvrir `http://127.0.0.1:8000`
3. Explorer la galaxie avec la souris
4. Cliquer sur une planète pour voir les détails
5. Cliquer le bouton "←" pour revenir

## 📦 Dépendances

- **Three.js** (v128) - Chargé via CDN

## 📝 Notes

- Tous les fichiers CSS sont consolidés dans `css/style.css`
- Toute la logique JavaScript est centralisée dans `js/main.js`
- Les détails d'une planète s'affichent dans une vue intégrée (pas de pages HTML séparées)
- Les orbites sont elliptiques (ovales) avec une vitesse qui varie selon la distance au soleil
