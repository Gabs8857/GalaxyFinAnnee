# Portfolio Cosmique

Portfolio interactif en 3D construit avec Three.js.
Le projet met en scene des domaines de competences sous forme de planetes en orbite autour d'un soleil central.

## Apercu

### Fonctionnalites principales

- **Scene 3D temps reel** avec interactions souris et tactile
- **Orbites elliptiques dynamiques** avec variation de vitesse (loi de Kepler)
- **Ceintures d'asteroides** avec rotation circulaire fluide
- **Etiquettes dynamiques des planetes** visibles en mode pause
  - Positionnement automatique gauche/droite selon la position a l'ecran
  - Ligne SVG reliant le bord de la planete a son etiquette
  - Position recalculee a chaque frame via `getWorldPosition()` pour suivre la rotation de la scene
- **Vue detail immersive** avec planete 3D interactive et rotation automatique
  - **Repartition 70/30** : planete occupe 70% de l'espace, texte 30%
  - **Zoom adaptatif automatique** selon la taille du conteneur
- **Legende interactive** des continents avec indicateurs colores
- **Systeme de focus** sur les continents (orientation automatique par quaternions)
- **Apercu des continents** visible directement en vue galaxie
- **Geometrie procedurale** avec algorithme de Fibonacci et bruit 3D
- **Interface moderne** avec bouton retour stylise et effets lumineux
- **Animations fluides** avec transitions et interpolations

### Interface utilisateur

- Navigation intuitive entre vue galaxie et vue detail
- Legende cliquable des continents avec descriptions
- Bouton retour avec animation de pulsation et rotation
- Bouton pause/lecture pour figer l'animation et afficher les etiquettes
- Responsive design adapte mobile et desktop

## Demonstration locale

Depuis la racine du projet, lancer :

```bash
python3 -m http.server 8000
```

Puis ouvrir dans le navigateur :

```text
http://127.0.0.1:8000
```

Arreter le serveur avec :

```text
Ctrl + C
```

Si la commande python3 n'est pas disponible :

```bash
python -m http.server 8000
```

## Controles

### Vue Galaxie

**Desktop :**
- Clic gauche + mouvement : rotation de la scene
- Molette : zoom
- Clic sur une planete : ouverture de la vue detail
- Clic sur le soleil : ouverture du CV (PDF)
- Bouton pause (en haut a droite) : pause de l'animation + affichage des etiquettes

**Mobile / Tactile :**
- Glisser : rotation de la scene
- Pincer : zoom
- Tap sur une planete : affichage du hover (nom + competences)
- Double tap sur la meme planete : ouverture de la vue detail
- Tap dans le vide : reset du hover
- Tap sur le soleil : ouverture du CV

### Vue Detail

- Bouton <- (en haut a gauche) : retour a la vue galaxie
- Clic sur un continent : focus et orientation de la planete
- Clic sur la planete : affichage des informations generales
- Rotation automatique de la planete
- Zoom adaptatif selon la taille d'ecran

## Domaines representes

1. Dev Web
2. Infographie
3. Audiovisuel
4. Design UI/UX
5. Programmation
6. Animation
7. Modelisation
8. Game Dev

## Stack technique

- Three.js (CDN v128)
- HTML5
- CSS3
- JavaScript (vanilla)

## Structure du projet

```text
galaxy-test/
+-index.html
+-css/
|  +-style.css
+-js/
|  +-data.js
|  +-geometry.js
|  +-main.js
+-CV.pdf
+-toggle.png
```

## Architecture du code

### Organisation des fichiers

- **js/data.js** : Configuration des planetes (8 domaines) et couleurs des continents
- **js/geometry.js** : Algorithmes de generation geometrique procedurale
  - `getFibonacciSphereDirection()` : distribution uniforme sur sphere
  - `pseudoNoise3()` : bruit procedural 3D pour variations naturelles
  - `buildContinentPatchGeometry()` : generation des patches de continents
  - `addPolygonReliefMeshes()` : ajout de relief polygonal
- **js/main.js** : Logique principale de la scene et interactions
  - Gestion des deux vues (galaxie et detail)
  - Systeme d'orbites elliptiques avec variation de vitesse
  - Raycasting pour detection de clics
  - Animations et transitions (quaternions, lerp)
  - Systeme d'etiquettes SVG dynamiques
- **css/style.css** : Styles avec variables CSS et animations
  - Theme spatial avec couleurs violettes/roses
  - Effets de glow et transitions fluides
  - Responsive breakpoints

### Points techniques cles

- Orbites elliptiques avec calcul de vitesse proportionnel a la distance
- Rotation de la scene via `scene.rotation` (drag souris/tactile)
- Focus sur continents avec interpolation quaternion (slerp)
- **Zoom adaptatif dynamique** : fonction `calculateAdaptiveZoom()` ajuste la distance camera
  - Base sur les dimensions du conteneur (reference 600px)
  - Plage de zoom entre 40 et 70 pour vue optimale
  - Recalcul automatique lors du redimensionnement de fenetre
- **Layout responsive** : repartition 70% planete / 30% texte en vue detail
- **Etiquettes dynamiques** : `updatePlanetLabels()` appelee a chaque frame
  - Utilise `mesh.getWorldPosition()` pour tenir compte de la rotation de la scene
  - Placement automatique : a droite si planete dans la moitie gauche, a gauche sinon
  - Lignes SVG mises a jour en temps reel, visibles uniquement en mode pause
- Cache-busting via parametre de version CSS (?v=2.0)
- Le soleil est cliquable et ouvre CV.pdf

## Details du code

### Generation des continents

La generation des continents repose sur deux niveaux complementaires :

1. **Patch principal de continent**
   - `buildContinentPatchGeometry(...)` part d'une sphere non indexee.
   - Chaque triangle est teste selon son orientation (`dot` avec une direction centrale).
   - Un bruit procedural (`pseudoNoise3`) perturbe le seuil pour casser les contours parfaits.
   - Les sommets retenus sont legerement extruded pour donner du relief.

2. **Relief polygonal additionnel**
   - `addPolygonReliefMeshes(...)` ajoute de petits polyedres autour de la zone du continent.
   - Ces blocs renforcent l'aspect rocheux/polygonal et la lecture visuelle.

### Ou cela s'applique

- **Vue galaxie** : apercu simplifie des continents sur chaque planete
- **Vue detail** : version plus dense (patch + polygones) avec interaction au clic
- **Focus continent** : orientation automatique de la planete via quaternion.slerp()

### Ceintures d'asteroides

- Rotation circulaire fluide autour du soleil
- Variation verticale legere pour un effet 3D naturel
- Particules individuelles tournant sur elles-memes
- Animation continue via `rotateY()` du groupe parent

### Etiquettes des planetes

- Creees une seule fois au chargement via `createPlanetLabels()`
- Repositionnees a chaque frame via `updatePlanetLabels()` dans la boucle `animate()`
- Visibles uniquement quand l'animation est en pause (`isAnimationPaused = true`)
- Placement intelligent : a droite si la planete est dans la moitie gauche, a gauche sinon
- `getWorldPosition()` utilise pour que les etiquettes suivent la rotation de la scene
- La ligne SVG relie le bord exact de la planete au bord de l'etiquette

## Pistes d'amelioration

- Ajouter un mode clair/sombre pour la couche UI
- Ajouter des performances adaptatives selon la puissance de l'appareil
- Ajouter une section credits et licence
