// Configuration de la scène
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x0a0015);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

camera.position.z = 200;

const controlsText = document.querySelector('.controls p');

function updateControlsText() {
    if (!controlsText) return;
    if (window.innerWidth <= 768) {
        controlsText.textContent = 'Glisser: Rotation | Pincer: Zoom | Tap: Details';
    } else {
        controlsText.textContent = 'Clic gauche + mouvement: Rotation | Molette: Zoom | Clic: Details';
    }
}

const planetsObjects = [];
let hoveredPlanet = null;

// Tableau pour raycast
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let suppressNextClick = false;

function addGalaxyContinentPreview(planetMesh, planet) {
    const continents = planet.continents || [];
    if (continents.length === 0) return;

    const planetRadius = planet.size / 2;
    const sourceGeometry = new THREE.SphereGeometry(planetRadius + 0.2, 14, 10).toNonIndexed();
    const baseAngularRadius = Math.max(0.35, 0.62 - (continents.length * 0.04));

    continents.forEach((continent, index) => {
        const centerDir = getFibonacciSphereDirection(index, continents.length);
        const angularRadius = baseAngularRadius + (index % 2 === 0 ? 0.03 : -0.02);
        const geometry = buildContinentPatchGeometry(sourceGeometry, centerDir, angularRadius, planetRadius, {
            thresholdOffset: -0.09,
            thresholdNoise: 0.12,
            elevationBase: 0.07,
            elevationAmount: 0.28,
            elevationPower: 0.85,
            surfaceOffset: 0.18
        });
        if (!geometry) return;

        const material = new THREE.MeshPhongMaterial({
            color: 0xefe7c7,
            emissive: 0x2d1a12,
            emissiveIntensity: 0.07,
            shininess: 25,
            transparent: true,
            opacity: 0.95
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData = { isPreviewContinent: true };
        planetMesh.add(mesh);

        addPolygonReliefMeshes(planetMesh, centerDir, continent, planetRadius, 0xd4c59a, 0.7);
    });
}

// Ajouter les lumières
const ambientLight = new THREE.AmbientLight(0x6600ff, 0.3);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xff99ff, 2, 500);
sunLight.position.set(0, 0, 0);
sunLight.castShadow = true;
scene.add(sunLight);

// Créer le soleil au centre
const sunGeometry = new THREE.IcosahedronGeometry(25, 5);
const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xff66ff,
    emissive: 0xff99ff
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(0, 0, 0);
scene.add(sun);

function openCv() {
    window.open('CV.pdf', '_blank', 'noopener');
}

// Ajouter un glow au soleil
const glowGeometry = new THREE.IcosahedronGeometry(27, 4);
const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xff66ff,
    transparent: true,
    opacity: 0.1
});
const glow = new THREE.Mesh(glowGeometry, glowMaterial);
sun.add(glow);

// Créer les ceintures d'astéroides
function createAsteroidBelt(distance, count, thickness) {
    const particles = new THREE.BufferGeometry();
    const posArray = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = distance + (Math.random() - 0.5) * thickness;
        const y = (Math.random() - 0.5) * thickness * 0.3;

        posArray[i * 3] = Math.cos(angle) * dist;
        posArray[i * 3 + 1] = y;
        posArray[i * 3 + 2] = Math.sin(angle) * dist;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
        color: 0xaa66ff,
        size: 0.8,
        transparent: true,
        opacity: 0.6
    });

    const mesh = new THREE.Points(particles, material);
    scene.add(mesh);
    return mesh;
}

// Ajouter 2 ceintures d'astéroides
const beltLine1 = createAsteroidBelt(72, 800, 8);
const beltLine2 = createAsteroidBelt(142, 600, 10);

// Créer les planètes
planets.forEach((planet, index) => {
    const geometry = new THREE.IcosahedronGeometry(planet.size / 2, 4);
    const orbitRadiusX = planet.distance;
    const orbitRadiusZ = planet.distance * (0.72 + (index % 4) * 0.06);
    const initialAngle = Math.random() * Math.PI * 2;
    
    const material = new THREE.MeshPhongMaterial({
        color: planet.color,
        emissive: planet.color,
        emissiveIntensity: 0.3,
        shininess: 50,
        wireframe: false
    });

    const mesh = new THREE.Mesh(geometry, material);
    const planetYOffset = Math.sin(index) * 10;
    mesh.position.set(
        Math.cos(initialAngle) * orbitRadiusX,
        planetYOffset,
        Math.sin(initialAngle) * orbitRadiusZ
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    // Stocker les données
    mesh.userData = {
        planet: planet,
        originalScale: 1,
        isHovered: false,
        orbitRadiusX: orbitRadiusX,
        orbitRadiusZ: orbitRadiusZ,
        angle: initialAngle,
        orbitSpeed: planet.speed,
        orbitYOffset: planetYOffset
    };

    scene.add(mesh);
    planetsObjects.push(mesh);
    addGalaxyContinentPreview(mesh, planet);

    // Ajouter des orbites visuelles
    const orbitGeometry = new THREE.BufferGeometry();
    const orbitPoints = [];
    for (let i = 0; i <= 128; i++) {
        const angle = (i / 128) * Math.PI * 2;
        orbitPoints.push(
            Math.cos(angle) * orbitRadiusX,
            planetYOffset,
            Math.sin(angle) * orbitRadiusZ
        );
    }
    orbitGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(orbitPoints), 3));
    const orbitMaterial = new THREE.LineBasicMaterial({ 
        color: planet.color, 
        transparent: true, 
        opacity: 0.2 
    });
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    scene.add(orbitLine);
});

// Info panel
const infoPanel = document.createElement('div');
infoPanel.className = 'planet-info';
document.body.appendChild(infoPanel);

function getPlanetIntersection(clientX, clientY) {
    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planetsObjects);
    return intersects.length > 0 ? intersects[0].object : null;
}

function getSpaceIntersection(clientX, clientY) {
    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([sun, ...planetsObjects], true);
    return intersects.length > 0 ? intersects[0].object : null;
}

function isObjectInSunHierarchy(object) {
    let current = object;
    while (current) {
        if (current === sun) return true;
        current = current.parent;
    }
    return false;
}

function getPlanetFromObject(object) {
    let current = object;
    while (current) {
        if (planetsObjects.includes(current)) return current;
        current = current.parent;
    }
    return null;
}

function updateHoverFromPointer(clientX, clientY) {
    const planet = getPlanetIntersection(clientX, clientY);

    // Réinitialiser hover
    planetsObjects.forEach(mesh => {
        if (mesh.userData.isHovered) {
            mesh.userData.isHovered = false;
            mesh.scale.set(1, 1, 1);
        }
    });
    infoPanel.classList.remove('active');

    if (planet) {
        planet.userData.isHovered = true;
        hoveredPlanet = planet;

        infoPanel.innerHTML = `
            <h3>${planet.userData.planet.name}</h3>
            <p>${planet.userData.planet.skills}</p>
        `;
        infoPanel.classList.add('active');
    }
}

// Gestion du hover
window.addEventListener('mousemove', (event) => {
    updateHoverFromPointer(event.clientX, event.clientY);
});

// Gestion du clic pour afficher la vue détail
window.addEventListener('click', (event) => {
    if (suppressNextClick) {
        suppressNextClick = false;
        return;
    }

    // Vérifier que la detail-view n'est pas visible
    const detailView = document.getElementById('detail-view');
    if (detailView && detailView.classList.contains('active')) {
        return; // Ne pas traiter les clics si la modal est ouverte
    }

    const hitObject = getSpaceIntersection(event.clientX, event.clientY);
    if (hitObject && isObjectInSunHierarchy(hitObject)) {
        openCv();
        return;
    }

    const hitPlanet = getPlanetFromObject(hitObject);
    if (!isDragging && hitPlanet) {
        showDetailView(hitPlanet);
    }
});

// Contrôles souris (drag)
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

window.addEventListener('mousedown', (e) => {
    isDragging = true;
});

window.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        scene.rotation.y += deltaX * 0.005;
        scene.rotation.x += deltaY * 0.005;
    }

    previousMousePosition = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

// Zoom avec la molette
window.addEventListener('wheel', (e) => {
    e.preventDefault();
    camera.position.z += e.deltaY * 0.15;
    camera.position.z = Math.max(80, Math.min(600, camera.position.z));
}, { passive: false });

// Interactions tactiles (drag + pinch + tap)
const touchState = {
    isDragging: false,
    hasMoved: false,
    lastX: 0,
    lastY: 0,
    isPinching: false,
    lastDistance: 0,
    hoveredPlanetMesh: null  // planete selectionnee au 1er tap
};

function getTouchDistance(touchA, touchB) {
    const dx = touchA.clientX - touchB.clientX;
    const dy = touchA.clientY - touchB.clientY;
    return Math.hypot(dx, dy);
}

window.addEventListener('touchstart', (event) => {
    const detailView = document.getElementById('detail-view');
    if (detailView && detailView.classList.contains('active')) {
        return;
    }

    if (event.touches.length === 1) {
        const touch = event.touches[0];
        touchState.isDragging = true;
        touchState.hasMoved = false;
        touchState.isPinching = false;
        touchState.lastX = touch.clientX;
        touchState.lastY = touch.clientY;
        // Ne pas appeler updateHoverFromPointer ici, géré dans touchend
    } else if (event.touches.length === 2) {
        touchState.isPinching = true;
        touchState.isDragging = false;
        touchState.lastDistance = getTouchDistance(event.touches[0], event.touches[1]);
    }

    event.preventDefault();
}, { passive: false });

window.addEventListener('touchmove', (event) => {
    const detailView = document.getElementById('detail-view');
    if (detailView && detailView.classList.contains('active')) {
        return;
    }

    if (touchState.isPinching && event.touches.length === 2) {
        const distance = getTouchDistance(event.touches[0], event.touches[1]);
        const delta = distance - touchState.lastDistance;
        camera.position.z -= delta * 0.2;
        camera.position.z = Math.max(80, Math.min(600, camera.position.z));
        touchState.lastDistance = distance;
        touchState.hasMoved = true;
        event.preventDefault();
        return;
    }

    if (touchState.isDragging && event.touches.length === 1) {
        const touch = event.touches[0];
        const deltaX = touch.clientX - touchState.lastX;
        const deltaY = touch.clientY - touchState.lastY;

        scene.rotation.y += deltaX * 0.005;
        scene.rotation.x += deltaY * 0.005;

        touchState.lastX = touch.clientX;
        touchState.lastY = touch.clientY;
        touchState.hasMoved = true;
        // On a bougé : annuler le hover tactile en cours
        if (touchState.hoveredPlanetMesh) {
            touchState.hoveredPlanetMesh = null;
            updateHoverFromPointer(-9999, -9999);
        }
        event.preventDefault();
    }
}, { passive: false });

window.addEventListener('touchend', (event) => {
    const detailView = document.getElementById('detail-view');
    if (detailView && detailView.classList.contains('active')) {
        touchState.isDragging = false;
        touchState.isPinching = false;
        return;
    }

    if (!touchState.isPinching && !touchState.hasMoved && event.changedTouches.length > 0) {
        const touch = event.changedTouches[0];
        const hitObject = getSpaceIntersection(touch.clientX, touch.clientY);

        if (hitObject && isObjectInSunHierarchy(hitObject)) {
            suppressNextClick = true;
            openCv();
        } else {
            const planet = getPlanetFromObject(hitObject);

            if (!planet) {
                // Tap dans le vide : reset le hover
                touchState.hoveredPlanetMesh = null;
                updateHoverFromPointer(-9999, -9999);
            } else if (touchState.hoveredPlanetMesh === planet) {
                // 2e tap sur la meme planete : ouvrir la vue detail
                suppressNextClick = true;
                showDetailView(planet);
                touchState.hoveredPlanetMesh = null;
            } else {
                // 1er tap sur une planete : afficher le hover
                touchState.hoveredPlanetMesh = planet;
                updateHoverFromPointer(touch.clientX, touch.clientY);
                suppressNextClick = true;
            }
        }
    }

    touchState.isDragging = false;
    touchState.isPinching = false;
}, { passive: false });

window.addEventListener('touchcancel', () => {
    touchState.isDragging = false;
    touchState.isPinching = false;
});

// Gestion du redimensionnement
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateControlsText();
    
    // Adapter le zoom de la vue détail si elle est active
    const detailCanvas = document.getElementById('detail-canvas');
    if (detailCanvas && detailRenderer && detailCamera) {
        const width = detailCanvas.clientWidth;
        const height = detailCanvas.clientHeight;
        if (width > 0 && height > 0) {
            detailCamera.aspect = width / height;
            detailCamera.updateProjectionMatrix();
            detailRenderer.setSize(width, height);
            
            // Recalculer le zoom adaptatif
            detailDefaultCameraZ = calculateAdaptiveZoom();
            detailTargetCameraZ = detailDefaultCameraZ;
        }
    }
});

// Animation du hover
function animatePlanetHover() {
    planetsObjects.forEach(mesh => {
        if (mesh.userData.isHovered) {
            mesh.scale.lerp(new THREE.Vector3(1.4, 1.4, 1.4), 0.1);
        } else {
            mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        }
    });
}

// Rotation du soleil
function rotateSun() {
    sun.rotation.x += 0.002;
    sun.rotation.y += 0.003;
}

// Rotation des ceintures d'astéroides
function rotateBelts() {
    beltLine1.rotation.y += 0.0005;
    beltLine2.rotation.y -= 0.0003;
}

// Mouvement orbital des planètes

function updateOrbits() {
    planetsObjects.forEach((mesh) => {
        const orbitRadiusX = mesh.userData.orbitRadiusX || mesh.userData.distance;
        const orbitRadiusZ = mesh.userData.orbitRadiusZ || mesh.userData.distance;

        const distanceReference = (orbitRadiusX + orbitRadiusZ) * 0.5;
        const currentDistance = Math.max(
            0.001,
            Math.hypot(
                Math.cos(mesh.userData.angle) * orbitRadiusX,
                Math.sin(mesh.userData.angle) * orbitRadiusZ
            )
        );
        const speedFactor = THREE.MathUtils.clamp(
            Math.pow(distanceReference / currentDistance, 1.25),
            0.55,
            1.9
        );

        mesh.userData.angle += mesh.userData.orbitSpeed * speedFactor;
        
        const x = Math.cos(mesh.userData.angle) * orbitRadiusX;
        const z = Math.sin(mesh.userData.angle) * orbitRadiusZ;
        
        mesh.position.x = x;
        mesh.position.y = mesh.userData.orbitYOffset;
        mesh.position.z = z;
        
        // Rotation propre de la planète
        mesh.rotation.x += 0.003;
        mesh.rotation.y += 0.004;
    });
}

// === PAUSE ANIMATION ===
let isAnimationPaused = false;
const planetLabels = [];

// Creer les etiquettes pour chaque planete
function createPlanetLabels() {
    // Creer un SVG container pour les lignes
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '99';
    document.body.appendChild(svg);
    
    planetsObjects.forEach((mesh, index) => {
        // Creer l'etiquette simple avec le nom
        const label = document.createElement('div');
        label.className = 'planet-label';
        label.innerHTML = `&#10142; ${mesh.userData.planet.name}`;
        document.body.appendChild(label);
        
        // Creer une ligne SVG
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('stroke', '#ff99ff');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('opacity', '0');
        line.style.transition = 'opacity 0.2s ease';
        svg.appendChild(line);
        
        planetLabels.push({ element: label, mesh: mesh, line: line });
    });
}

// Mettre a jour la position des etiquettes et les lignes
function updatePlanetLabels() {
    const margin = 8;
    const gap = 18;       // distance entre bord planete et bord etiquette
    const elHeight = 18;  // hauteur approximative d'une etiquette

    planetLabels.forEach(({ element, mesh, line }) => {
        // Utiliser la position MONDE pour tenir compte de la rotation de la scene
        const worldPos = new THREE.Vector3();
        mesh.getWorldPosition(worldPos);
        const vector = worldPos.clone();
        vector.project(camera);

        // Visible : devant la camera
        const isVisible = vector.z < 1 && vector.z > -1;

        if (isVisible) {
            const sx = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const sy = (-(vector.y * 0.5) + 0.5) * window.innerHeight;

            // Rayon en pixels (offset dans l'espace monde)
            const planetSize = mesh.userData.planet.size / 2;
            const rv = worldPos.clone().add(new THREE.Vector3(planetSize, 0, 0));
            rv.project(camera);
            const radiusPx = Math.abs((rv.x * 0.5 + 0.5) * window.innerWidth - sx);

            // Cote : mettre l'etiquette a gauche si la planete est sur la droite
            const onRight = sx > window.innerWidth * 0.5;

            // Mettre a jour le texte / fleche seulement si le cote change
            const side = onRight ? 'left' : 'right';
            if (element.dataset.side !== side) {
                element.dataset.side = side;
                element.innerHTML = onRight
                    ? `${mesh.userData.planet.name} &larr;`
                    : `&rarr; ${mesh.userData.planet.name}`;
            }

            // Centrer verticalement, clamp dans l'ecran
            const labelTop = Math.max(margin, Math.min(window.innerHeight - elHeight - margin, sy - elHeight / 2));
            const labelCenterY = labelTop + elHeight / 2;

            element.style.top = `${labelTop}px`;
            element.style.opacity = isAnimationPaused ? '1' : '0';

            let lineX1, lineX2;

            if (onRight) {
                // Etiquette a gauche : son bord DROIT = bord gauche planete - gap
                const rightEdge = sx - radiusPx - gap;
                element.style.left = `${rightEdge}px`;
                element.style.transform = 'translateX(-100%)';
                lineX1 = sx - radiusPx;  // bord gauche de la planete
                lineX2 = rightEdge;      // bord droit de l'etiquette
            } else {
                // Etiquette a droite : son bord GAUCHE = bord droit planete + gap
                const leftEdge = sx + radiusPx + gap;
                element.style.left = `${leftEdge}px`;
                element.style.transform = 'none';
                lineX1 = sx + radiusPx;  // bord droit de la planete
                lineX2 = leftEdge;       // bord gauche de l'etiquette
            }

            line.setAttribute('x1', lineX1);
            line.setAttribute('y1', sy);
            line.setAttribute('x2', lineX2);
            line.setAttribute('y2', labelCenterY);
            line.setAttribute('opacity', isAnimationPaused ? '0.6' : '0');
        } else {
            element.style.opacity = '0';
            line.setAttribute('opacity', '0');
        }
    });
}

// Afficher/cacher les etiquettes
function togglePlanetLabels(show) {
    // Les etiquettes s'affichent/cachent automatiquement via updatePlanetLabels
    // Cette fonction sert juste a forcer la mise a jour immediate
    if (show) {
        updatePlanetLabels();
    }
}

// Bouton de mise en pause de l'animation
const animationPauseBtn = document.getElementById('animation-pause-btn');
console.log('Bouton pause trouve:', animationPauseBtn);
if (animationPauseBtn) {
    animationPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isAnimationPaused = !isAnimationPaused;
        animationPauseBtn.innerHTML = isAnimationPaused ? '&#9654;' : '&#9208;';
        togglePlanetLabels(isAnimationPaused);
        console.log('Animation pausee:', isAnimationPaused);
    });
} else {
    console.error('Bouton pause non trouve!');
}

// === VUE DÉTAIL ===
let detailScene = null;
let detailCamera = null;
let detailRenderer = null;
let detailRaycaster = new THREE.Raycaster();
let detailMouse = new THREE.Vector2();
let detailContinentMeshes = [];
let detailPlanetGroup = null;
let currentDetailPlanet = null;
let isDraggingDetail = false;
let previousDetailMousePosition = { x: 0, y: 0 };
let isDetailAnimating = false;
let detailTargetCameraZ = 50;
let detailDefaultCameraZ = 50;
const detailFocusedCameraZ = 42;
let detailHasTargetQuaternion = false;
const detailTargetQuaternion = new THREE.Quaternion();
const detailContinentDirections = new Map();

function calculateAdaptiveZoom() {
    const detailCanvas = document.getElementById('detail-canvas');
    if (!detailCanvas) return 50;
    
    const height = detailCanvas.clientHeight;
    const width = detailCanvas.clientWidth;
    const minDimension = Math.min(height, width);
    
    // Calculer le zoom basé sur la taille du conteneur
    // Plus le conteneur est petit, plus on zoom (position z plus petite)
    // Plus le conteneur est grand, plus on dézoom (position z plus grande)
    const baseZoom = 50;
    const zoomFactor = minDimension / 600; // 600px comme référence
    const adaptiveZoom = baseZoom * Math.max(0.8, Math.min(zoomFactor, 1.2));
    
    return Math.max(40, Math.min(adaptiveZoom, 70));
}

function clearDetailFocus() {
    detailTargetCameraZ = detailDefaultCameraZ;
    detailHasTargetQuaternion = false;
}

function focusOnContinent(continentName) {
    if (!detailPlanetGroup) return;
    const direction = detailContinentDirections.get(continentName);
    if (!direction) return;

    detailTargetCameraZ = detailDefaultCameraZ;
    const desiredQuaternion = new THREE.Quaternion().setFromUnitVectors(
        direction.clone().normalize(),
        new THREE.Vector3(0, 0, 1)
    );
    detailTargetQuaternion.copy(desiredQuaternion);
    detailHasTargetQuaternion = true;
}

function renderDetailContinentCards(planet, activeContinentName = '') {
    const container = document.getElementById('detail-continent-cards');
    if (!container) return;

    container.innerHTML = '';
    const continents = planet?.continents || [];

    continents.forEach((continent, index) => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'detail-continent-legend-item';
        if (continent.name === activeContinentName) {
            card.classList.add('active');
        }

        const colorHex = `#${continentColors[index % continentColors.length].toString(16).padStart(6, '0')}`;

        card.innerHTML = `
            <span class="detail-continent-color" style="background:${colorHex}"></span>
            <span class="detail-continent-text">
                <span class="detail-continent-name">${continent.name}</span>
                <span class="detail-continent-hint">${continent.detail}</span>
            </span>
        `;

        card.addEventListener('click', () => {
            showContinentInfo(continent);
        });

        container.appendChild(card);
    });
}

function showPlanetInfo(planet) {
    if (!planet) return;
    clearDetailFocus();
    document.getElementById('detail-title').textContent = planet.name.toUpperCase();
    document.getElementById('detail-description').textContent = planet.description;
    renderDetailContinentCards(planet);
}

function initDetailView() {
    const detailCanvas = document.getElementById('detail-canvas');
    if (!detailCanvas) return;
    
    detailScene = new THREE.Scene();
    detailCamera = new THREE.PerspectiveCamera(
        75, 
        detailCanvas.clientWidth / detailCanvas.clientHeight, 
        0.1, 
        1000
    );
    detailRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    detailRenderer.setSize(detailCanvas.clientWidth, detailCanvas.clientHeight);
    detailRenderer.setClearColor(0x1a0033, 0.3);
    detailCanvas.appendChild(detailRenderer.domElement);
    
    // Zoom adaptatif
    detailDefaultCameraZ = calculateAdaptiveZoom();
    detailCamera.position.z = detailDefaultCameraZ;
    detailTargetCameraZ = detailDefaultCameraZ;

    // Lumière
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    detailScene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff99ff, 2);
    pointLight.position.set(50, 50, 50);
    detailScene.add(pointLight);

    const backLight = new THREE.PointLight(0xaa66ff, 1);
    backLight.position.set(-50, -50, 30);
    detailScene.add(backLight);
    startDetailAnimation();
    
    // Événements pour interagir avec la planète
    detailRenderer.domElement.addEventListener('click', onDetailCanvasClick);
    detailRenderer.domElement.addEventListener('mousemove', onDetailCanvasInteraction);
    detailRenderer.domElement.addEventListener('mousedown', onDetailCanvasMouseDown);
    detailRenderer.domElement.addEventListener('mouseup', onDetailCanvasMouseUp);
    detailRenderer.domElement.addEventListener('mouseleave', onDetailCanvasMouseUp);
    detailRenderer.domElement.addEventListener('touchstart', onDetailCanvasTouchStart, { passive: false });
    detailRenderer.domElement.addEventListener('touchmove', onDetailCanvasTouchMove, { passive: false });
    detailRenderer.domElement.addEventListener('touchend', onDetailCanvasTouchEnd, { passive: false });
    detailRenderer.domElement.addEventListener('touchcancel', onDetailCanvasTouchEnd, { passive: false });
}

function animateDetail() {
    if (!isDetailAnimating) return;
    requestAnimationFrame(animateDetail);

    if (!detailRenderer || !detailScene || !detailCamera) {
        return;
    }

    if (detailPlanetGroup) {
        detailPlanetGroup.rotation.y += 0.0003;
        if (detailHasTargetQuaternion) {
            detailPlanetGroup.quaternion.slerp(detailTargetQuaternion, 0.08);
        }
    }

    if (detailCamera) {
        detailCamera.position.z = THREE.MathUtils.lerp(detailCamera.position.z, detailTargetCameraZ, 0.08);
    }

    detailRenderer.render(detailScene, detailCamera);
}

function startDetailAnimation() {
    if (isDetailAnimating) return;
    isDetailAnimating = true;
    animateDetail();
}

function clearDetailPlanetGroup() {
    if (detailPlanetGroup) {
        detailPlanetGroup.traverse((object) => {
            if (object.isMesh) {
                if (object.geometry) object.geometry.dispose();
                if (object.material) object.material.dispose();
            }
        });
        detailScene.remove(detailPlanetGroup);
    }
    detailPlanetGroup = null;
    detailContinentMeshes = [];
    detailContinentDirections.clear();
}


function createContinentSegments(planet) {
    clearDetailPlanetGroup();
    clearDetailFocus();

    detailPlanetGroup = new THREE.Group();
    detailScene.add(detailPlanetGroup);

    const continents = planet.continents;
    const radius = 35;

    // Créer la planète de base
    const baseGeometry = new THREE.IcosahedronGeometry(radius, 4);
    const baseMaterial = new THREE.MeshStandardMaterial({
        color: planet.color,
        emissive: 0x111111,
        emissiveIntensity: 0.06,
        roughness: 0.9,
        metalness: 0.05,
    });
    const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
    baseMesh.userData.isContinent = false;
    detailPlanetGroup.add(baseMesh);
    detailContinentMeshes.push(baseMesh);

    // Créer et afficher tous les continents à la fois autour de la planète
    const sourceGeometry = new THREE.SphereGeometry(radius + 0.6, 36, 24).toNonIndexed();
    const baseAngularRadius = Math.max(0.35, 0.65 - (continents.length * 0.03));

    continents.forEach((continent, index) => {
        const color = continentColors[index % continentColors.length];

        const centerDir = getFibonacciSphereDirection(index, continents.length);
        detailContinentDirections.set(continent.name, centerDir.clone());
        const angularRadius = baseAngularRadius + (index % 2 === 0 ? 0.04 : -0.02);
        const geometry = buildContinentPatchGeometry(sourceGeometry, centerDir, angularRadius, radius, {
            thresholdOffset: -0.08,
            thresholdNoise: 0.13,
            elevationBase: 0.2,
            elevationAmount: 1.25,
            elevationPower: 0.72,
            surfaceOffset: 0.65
        });
        if (!geometry) {
            return;
        }

        const material = new THREE.MeshStandardMaterial({
            color: color,
            emissive: 0x15110a,
            emissiveIntensity: 0.06,
            roughness: 0.92,
            metalness: 0.03,
            transparent: true,
            opacity: 0.97
        });

        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.userData = {
            isContinent: true,
            continent: continent,
            continentIndex: index,
            originalOpacity: 0.97,
            originalEmissiveIntensity: 0.06
        };

        detailPlanetGroup.add(mesh);
        detailContinentMeshes.push(mesh);

        addPolygonReliefMeshes(detailPlanetGroup, centerDir, continent, radius, color, 1.2, detailContinentMeshes);
    });
}

function getDetailIntersection(clientX, clientY) {
    const rect = detailRenderer.domElement.getBoundingClientRect();
    detailMouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    detailMouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    detailRaycaster.setFromCamera(detailMouse, detailCamera);
    const intersects = detailRaycaster.intersectObjects(detailContinentMeshes);
    return intersects.length > 0 ? intersects[0].object : null;
}

function onDetailCanvasClick(event) {
    const hit = getDetailIntersection(event.clientX, event.clientY);
    if (hit && hit.userData && hit.userData.isContinent && hit.userData.continent) {
        showContinentInfo(hit.userData.continent);
        return;
    }

    if (hit && currentDetailPlanet) {
        showPlanetInfo(currentDetailPlanet);
    }
}

const detailTouchState = {
    isDragging: false,
    hasMoved: false,
    lastX: 0,
    lastY: 0
};

function onDetailCanvasTouchStart(event) {
    if (event.touches.length !== 1) return;
    const touch = event.touches[0];
    detailTouchState.isDragging = true;
    detailTouchState.hasMoved = false;
    detailTouchState.lastX = touch.clientX;
    detailTouchState.lastY = touch.clientY;
    detailRenderer.domElement.style.cursor = 'grabbing';
    event.preventDefault();
}

function onDetailCanvasTouchMove(event) {
    if (!detailTouchState.isDragging || event.touches.length !== 1) return;
    const touch = event.touches[0];
    const deltaX = touch.clientX - detailTouchState.lastX;
    const deltaY = touch.clientY - detailTouchState.lastY;

    detailTouchState.lastX = touch.clientX;
    detailTouchState.lastY = touch.clientY;
    detailTouchState.hasMoved = true;

    if (detailPlanetGroup) {
        detailPlanetGroup.rotation.y += deltaX * 0.005;
        detailPlanetGroup.rotation.x += deltaY * 0.005;
    }

    event.preventDefault();
}

function onDetailCanvasTouchEnd(event) {
    detailTouchState.isDragging = false;
    detailRenderer.domElement.style.cursor = 'grab';

    if (!detailTouchState.hasMoved && event.changedTouches.length > 0) {
        const touch = event.changedTouches[0];
        const hit = getDetailIntersection(touch.clientX, touch.clientY);
        if (hit && hit.userData && hit.userData.isContinent && hit.userData.continent) {
            showContinentInfo(hit.userData.continent);
        } else if (hit && currentDetailPlanet) {
            showPlanetInfo(currentDetailPlanet);
        }
    }
}

function onDetailCanvasInteraction(event) {
    // Drag - tourner la planète
    if (isDraggingDetail && currentDetailPlanet) {
        const deltaX = event.clientX - previousDetailMousePosition.x;
        const deltaY = event.clientY - previousDetailMousePosition.y;
        
        previousDetailMousePosition = { x: event.clientX, y: event.clientY };

        if (detailPlanetGroup) {
            detailPlanetGroup.rotation.y += deltaX * 0.005;
            detailPlanetGroup.rotation.x += deltaY * 0.005;
        }
        return;
    }

    // Survol - mettre en évidence
    const rect = detailRenderer.domElement.getBoundingClientRect();
    detailMouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    detailMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Raycast pour le survol
    detailRaycaster.setFromCamera(detailMouse, detailCamera);
    const intersects = detailRaycaster.intersectObjects(detailContinentMeshes, false);

    // Réinitialiser tous les continents
    detailContinentMeshes.forEach(mesh => {
        if (mesh.userData && mesh.userData.isContinent) {
            mesh.material.opacity = mesh.userData.originalOpacity || 0.8;
            mesh.material.emissiveIntensity = mesh.userData.originalEmissiveIntensity || 0.06;
        }
    });

    // Mettre en évidence le continent survolé
    let found = false;
    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.userData && intersects[i].object.userData.isContinent) {
            intersects[i].object.material.opacity = 1;
            intersects[i].object.material.emissiveIntensity = 0.18;
            detailRenderer.domElement.style.cursor = 'pointer';
            found = true;
            break;
        }
        if (intersects[i].object.userData && intersects[i].object.userData.isContinent === false) {
            detailRenderer.domElement.style.cursor = 'pointer';
            found = true;
            break;
        }
    }
    
    if (!found) {
        detailRenderer.domElement.style.cursor = 'grab';
    }
}

function onDetailCanvasMouseDown(event) {
    isDraggingDetail = true;
    previousDetailMousePosition = { x: event.clientX, y: event.clientY };
    detailRenderer.domElement.style.cursor = 'grabbing';
}

function onDetailCanvasMouseUp() {
    isDraggingDetail = false;
    detailRenderer.domElement.style.cursor = 'grab';
}

function showDetailView(planetMesh) {
    const planet = planetMesh.userData.planet;
    currentDetailPlanet = planet;

    // Créer les segments
    createContinentSegments(planet);
    startDetailAnimation();

    if (detailCamera) {
        detailCamera.position.z = detailDefaultCameraZ;
    }

    // Afficher la vue
    const detailView = document.getElementById('detail-view');
    detailView.style.display = 'flex';
    setTimeout(() => {
        detailView.classList.add('active');
    }, 10);

    // Redimensionner le renderer et recalculer le zoom
    setTimeout(() => {
        const detailCanvas = document.getElementById('detail-canvas');
        const width = detailCanvas.clientWidth;
        const height = detailCanvas.clientHeight;
        if (detailCamera && detailRenderer) {
            detailCamera.aspect = width / height;
            detailCamera.updateProjectionMatrix();
            detailRenderer.setSize(width, height);
            
            // Recalculer le zoom adaptatif
            detailDefaultCameraZ = calculateAdaptiveZoom();
            detailTargetCameraZ = detailDefaultCameraZ;
            detailCamera.position.z = detailDefaultCameraZ;
        }
    }, 50);
    
    showPlanetInfo(planet);
}

function showContinentInfo(continent) {
    document.getElementById('detail-title').textContent = continent.name.toUpperCase();
    document.getElementById('detail-description').textContent = continent.detail;
    focusOnContinent(continent.name);
    if (currentDetailPlanet) {
        renderDetailContinentCards(currentDetailPlanet, continent.name);
    }
}

function hideDetailView() {
    const detailView = document.getElementById('detail-view');
    detailView.classList.remove('active');
    setTimeout(() => {
        detailView.style.display = 'none';
    }, 400);
    const continentCards = document.getElementById('detail-continent-cards');
    if (continentCards) continentCards.innerHTML = '';
    clearDetailPlanetGroup();
    currentDetailPlanet = null;
    hoveredPlanet = null;
    
}

// Initialiser la vue détail quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    initDetailView();
});

// Boucle d'animation
function animate() {
    requestAnimationFrame(animate);

    // Animations (pause si isAnimationPaused est true)
    if (!isAnimationPaused) {
        rotateSun();
        rotateBelts();
        updateOrbits();
        animatePlanetHover();
    }
    
    // Mettre a jour les positions des etiquettes en continu pour qu'elles suivent la camera
    updatePlanetLabels();

    renderer.render(scene, camera);
}

animate();

updateControlsText();

// Creer les etiquettes apres que tout soit charge
createPlanetLabels();
