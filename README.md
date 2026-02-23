# Portfolio Cosmique

Portfolio interactif en 3D construit avec Three.js.
Le projet met en scène des domaines de compétences sous forme de planètes en orbite autour d’un soleil central.

## Aperçu

- Scène 3D temps réel avec interactions souris et tactile
- Système d’orbites elliptiques avec variation de vitesse selon la distance au soleil
- Vue détail intégrée pour afficher les informations d’une planète
- Aperçu des continents directement visible en vue galaxie
- Design visuel spatial avec effets lumineux et ceintures d’astéroïdes

## Démonstration locale

Depuis la racine du projet, lancer :

```bash
python3 -m http.server 8000
```

Puis ouvrir dans le navigateur :

```text
http://127.0.0.1:8000
```

Arrêter le serveur avec :

```text
Ctrl + C
```

Si la commande python3 n’est pas disponible :

```bash
python -m http.server 8000
```

## Contrôles

### Desktop

- Clic gauche + mouvement : rotation de la scène
- Molette : zoom
- Clic sur une planète : ouverture de la vue détail

### Mobile / Tactile

- Glisser : rotation de la scène
- Pincer : zoom
- Tap : ouverture de la vue détail

## Domaines représentés

1. Dev Web
2. Infographie
3. Audiovisuel
4. Design UI/UX
5. Programmation
6. Animation
7. Modélisation
8. Game Dev

## Stack technique

- Three.js (CDN v128)
- HTML5
- CSS3
- JavaScript (vanilla)

## Structure du projet

```text
galaxy-test/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── data.js
│   ├── geometry.js
│   └── main.js
├── CV.pdf
└── toggle.png
```

## Notes techniques

- Les données des planètes sont dans js/data.js
- Les fonctions de génération géométrique (continents/polygones) sont dans js/geometry.js
- La logique de scène et d’interaction est dans js/main.js
- Les détails des planètes s’affichent dans une vue intégrée (pas de pages séparées)
- Les orbites sont ovales et dynamiques (accélération proche du soleil, décélération à l’éloignement)

## Pistes d’amélioration

- Ajouter un mode clair/sombre pour la couche UI
- Ajouter des performances adaptatives selon la puissance de l’appareil
- Ajouter une section crédits et licence
