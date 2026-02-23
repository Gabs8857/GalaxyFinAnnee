# Portfolio Cosmique

Portfolio interactif en 3D construit avec Three.js.
Le projet met en scène des domaines de compétences sous forme de planètes en orbite autour d’un soleil central.

## Aperçu

### Fonctionnalités principales

- **Scène 3D temps réel** avec interactions souris et tactile
- **Orbites elliptiques dynamiques** avec variation de vitesse (loi de Kepler)
- **Ceintures d'astéroïdes** avec rotation circulaire fluide
- **Vue détail immersive** avec planète 3D interactive et rotation automatique
  - **Répartition 70/30** : planète occupe 70% de l'espace, texte 30%
  - **Zoom adaptatif automatique** selon la taille du conteneur
- **Légende interactive** des continents avec indicateurs colorés
- **Système de focus** sur les continents (orientation automatique par quaternions)
- **Aperçu des continents** visible directement en vue galaxie
- **Géométrie procédurale** avec algorithme de Fibonacci et bruit 3D
- **Interface moderne** avec bouton retour stylisé et effets lumineux
- **Animations fluides** avec transitions et interpolations

### Interface utilisateur

- Navigation intuitive entre vue galaxie et vue détail
- Légende cliquable des continents avec descriptions
- Bouton retour avec animation de pulsation et rotation
- Responsive design adapté mobile et desktop

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

### Vue Galaxie

**Desktop :**
- Clic gauche + mouvement : rotation de la scène
- Molette : zoom
- Clic sur une planète : ouverture de la vue détail
- Clic sur le soleil : ouverture du CV (PDF)

**Mobile / Tactile :**
- Glisser : rotation de la scène
- Pincer : zoom
- Tap sur une planète : ouverture de la vue détail
- Tap sur le soleil : ouverture du CV

### Vue Détail

- Bouton ← (en haut à gauche) : retour à la vue galaxie
- Clic sur un continent : focus et orientation de la planète
- Clic sur la planète : affichage des informations générales
- Rotation automatique de la planète
- Zoom adaptatif selon la taille d'écran

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

## Architecture du code

### Organisation des fichiers

- **js/data.js** : Configuration des planètes (8 domaines) et couleurs des continents
- **js/geometry.js** : Algorithmes de génération géométrique procédurale
  - `getFibonacciSphereDirection()` : distribution uniforme sur sphère
  - `pseudoNoise3()` : bruit procédural 3D pour variations naturelles
  - `buildContinentPatchGeometry()` : génération des patches de continents
  - `addPolygonReliefMeshes()` : ajout de relief polygonal
- **js/main.js** : Logique principale de la scène et interactions
  - Gestion des deux vues (galaxie et détail)
  - Système d'orbites elliptiques avec variation de vitesse
  - Raycasting pour détection de clics
  - Animations et transitions (quaternions, lerp)
- **css/style.css** : Styles avec variables CSS et animations
  - Thème spatial avec couleurs violettes/roses
  - Effets de glow et transitions fluides
  - Responsive breakpoints

### Points techniques clés

- Orbites elliptiques avec calcul de vitesse proportionnel à la distance
- Rotation des planètes uniforme via THREE.Group
- Focus sur continents avec interpolation quaternion (slerp)
- **Zoom adaptatif dynamique** : fonction `calculateAdaptiveZoom()` ajuste la distance caméra
  - Basé sur les dimensions du conteneur (référence 600px)
  - Plage de zoom entre 40 et 70 pour vue optimale
  - Recalcul automatique lors du redimensionnement de fenêtre
- **Layout responsive** : répartition 70% planète / 30% texte en vue détail
- Cache-busting via paramètre de version CSS (?v=2.0)
- Le soleil est cliquable et ouvre CV.pdf

## Détails du code

### Génération des continents

La génération des continents repose sur deux niveaux complémentaires :

1. **Patch principal de continent**
	- `buildContinentPatchGeometry(...)` part d’une sphère non indexée.
	- Chaque triangle est testé selon son orientation (`dot` avec une direction centrale).
	- Un bruit procédural (`pseudoNoise3`) perturbe le seuil pour casser les contours parfaits.
	- Les sommets retenus sont légèrement extrudés pour donner du relief.

2. **Relief polygonal additionnel**
	- `addPolygonReliefMeshes(...)` ajoute de petits polyèdres autour de la zone du continent.
	- Ces “blocs” renforcent l’aspect rocheux/polygonal et la lecture visuelle.

### Où cela s’applique

- **Vue galaxie** : aperçu simplifié des continents sur chaque planète
- **Vue détail** : version plus dense (patch + polygones) avec interaction au clic
- **Focus continent** : orientation automatique de la planète via quaternion.slerp()

### Ceintures d'astéroïdes

- Rotation circulaire fluide autour du soleil
- Variation verticale légère pour un effet 3D naturel
- Particules individuelles tournant sur elles-mêmes
- Animation continue via `rotateY()` du groupe parent

## Pistes d’amélioration

- Ajouter un mode clair/sombre pour la couche UI
- Ajouter des performances adaptatives selon la puissance de l’appareil
- Ajouter une section crédits et licence
