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
        controlsText.textContent = 'Clic gauche + mouvement: Rotation | Molette: Zoom | Clic: Détails';
    }
}

// Planètes et leurs infos avec orbites
const planets = [
    { 
        name: 'Dev Web', 
        size: 12, 
        distance: 50, 
        color: 0xb366ff, 
        skills: 'React, Vue, Node.js, TypeScript', 
        speed: 0.015,
        description: 'Une de mes principales spécificités en tant qu\'étudiant, c\'est ma polyvalence. Notamment dans le domaine du web où, en plus de développer avancé.',
        continents: [
            { name: 'Frontend', detail: 'React, Vue.js, CSS/SCSS, Responsive Design, HTML5' },
            { name: 'Backend', detail: 'Node.js, Databases, APIs REST' },
            { name: 'Outils', detail: 'TypeScript, Webpack, Git, Testing, Docker, VM' }
        ]
    },
    { 
        name: 'Infographie', 
        size: 18, 
        distance: 85, 
        color: 0xff66cc, 
        skills: 'Blender, Photoshop, 3D Design', 
        speed: 0.008,
        description: 'Expertise en création 3D et design graphique avec Blender et Photoshop. Création de modèles, textures, et rendus professionnels.',
        continents: [
            { name: 'Modélisation', detail: 'Blender, Sculpting, Hard Surface' },
            { name: 'Texturing', detail: 'PBR, Materials, UV Mapping' },
            { name: 'Design', detail: 'Photoshop, Illustration, Composition, Branding' }
        ]
    },
    { 
        name: 'Audiovisuel', 
        size: 10, 
        distance: 120, 
        color: 0x9933ff, 
        skills: 'Montage, Motion, Effets VFX', 
        speed: 0.005,
        description: 'Maîtrise du montage vidéo et des effets visuels. Création de contenu audiovisuel dynamique et professionnel.',
        continents: [
            { name: 'Montage', detail: 'Premiere Pro, Canva, CapCut' },
            { name: 'Motion', detail: 'After Effects, Blender, Keyframing, Animation, Transitions' },
            { name: 'VFX', detail: 'Compositing, Color Grading, Effets Visuels' }
        ]
    },
    { 
        name: 'Design UI/UX', 
        size: 14, 
        distance: 155, 
        color: 0xdd66ff, 
        skills: 'Figma, Adobe XD, UX Design', 
        speed: 0.003,
        description: 'Conception d\'interfaces utilisateur modernes et ergonomiques. Création d\'expériences utilisateur optimales.',
        continents: [
            { name: 'Interface', detail: 'Figma, Adobe XD, Wireframing' },
            { name: 'Expérience', detail: 'UX Research, User Testing, Personas, Flows' },
            { name: 'Accessibilité', detail: 'W3C, Responsive Design, Inclusif' }
        ]
    },
    { 
        name: 'Programmation', 
        size: 11, 
        distance: 60, 
        color: 0xaa55ff, 
        skills: 'Python, C++, JavaScript', 
        speed: 0.012,
        description: 'Programmation multi-langages avec focus sur la logique et les structures de données.',
        continents: [
            { name: 'Python', detail: 'Data Science, Scripts, Automation, Django' },
            { name: 'PHP', detail: 'Web Development, Symfony, APIs' },
            { name: 'Tailwind', detail: 'CSS Framework, Utility-First, Responsive Design' },
            { name: 'Sass', detail: 'CSS Preprocessor, Variables, Mixins, Nesting' },
            { name: 'C++', detail: 'Performance, Game Dev, Systèmes, Algorithm Optimization' },
            { name: 'JavaScript', detail: 'Web, Full-Stack, Frameworks, Node.js' }
        ]
    },
    { 
        name: 'Animation', 
        size: 15, 
        distance: 95, 
        color: 0xff99dd, 
        skills: 'Keyframe, Physics, Rigging', 
        speed: 0.007,
        description: 'Création d\'animations fluides et réalistes pour la 3D et l\'audiovisuel.',
        continents: [
            { name: 'Keyframe', detail: 'Traditional Animation, Timing, Easing' },
            { name: 'Simulation', detail: 'Physics, Cloth Simulation, Particles' }
        ]
    },
    { 
        name: 'Modélisation', 
        size: 13, 
        distance: 130, 
        color: 0xbb44ff, 
        skills: 'Sculpting, Texturing, Rendering', 
        speed: 0.004,
        description: 'Modélisation 3D avancée avec sculpting, texturing haute résolution et rendering.',
        continents: [
            { name: 'Sculpting', detail: 'Dynamesh, ZBrush, Digital Sculpting, Detail' },
            { name: 'Baking', detail: 'Normal Maps, Ambient Occlusion, Displacement' },
            { name: 'Rendering', detail: 'Cycles, Eevee, Render Passes, Quality' }
        ]
    },
    { 
        name: 'Game Dev', 
        size: 16, 
        distance: 165, 
        color: 0xff77cc, 
        skills: 'Unity, Unreal, C#', 
        speed: 0.002,
        description: 'Développement de jeux vidéo complets avec Unity et Unreal Engine.',
        continents: [
            { name: 'Unity', detail: 'C#, Physics Engine, Game Logic, Scripting' },
            { name: 'Godot', detail: 'GDScript, 2D/3D, Node System, Open Source' },
            { name: 'Unreal', detail: 'Blueprints, Optimization, Simulation' },
            { name: 'Gameplay', detail: 'Mechanics Design, UI Systems, Audio Integration' }
        ]
    }
];

const planetsObjects = [];
let hoveredPlanet = null;

// Tableau pour raycast
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let suppressNextClick = false;

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
    
    const material = new THREE.MeshPhongMaterial({
        color: planet.color,
        emissive: planet.color,
        emissiveIntensity: 0.3,
        shininess: 50,
        wireframe: false
    });

    const mesh = new THREE.Mesh(geometry, material);
    const planetYOffset = Math.sin(index) * 10;
    mesh.position.set(planet.distance, planetYOffset, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    // Stocker les données
    mesh.userData = {
        planet: planet,
        originalScale: 1,
        isHovered: false,
        distance: planet.distance,
        angle: Math.random() * Math.PI * 2,
        orbitSpeed: planet.speed,
        orbitYOffset: planetYOffset
    };

    scene.add(mesh);
    planetsObjects.push(mesh);

    // Ajouter des orbites visuelles
    const orbitGeometry = new THREE.BufferGeometry();
    const orbitPoints = [];
    for (let i = 0; i <= 128; i++) {
        const angle = (i / 128) * Math.PI * 2;
        orbitPoints.push(
            Math.cos(angle) * planet.distance,
            planetYOffset,
            Math.sin(angle) * planet.distance
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

    const sunHit = getPlanetIntersection(event.clientX, event.clientY);
    if (sunHit === sun) {
        openCv();
        return;
    }
    
    if (!isDragging && hoveredPlanet) {
        showDetailView(hoveredPlanet);
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
    lastDistance: 0
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
        updateHoverFromPointer(touch.clientX, touch.clientY);
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
        updateHoverFromPointer(touch.clientX, touch.clientY);
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
        const planet = getPlanetIntersection(touch.clientX, touch.clientY);
        if (planet === sun) {
            suppressNextClick = true;
            openCv();
        } else if (planet) {
            suppressNextClick = true;
            showDetailView(planet);
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
        mesh.userData.angle += mesh.userData.orbitSpeed;
        
        const x = Math.cos(mesh.userData.angle) * mesh.userData.distance;
        const z = Math.sin(mesh.userData.angle) * mesh.userData.distance;
        
        mesh.position.x = x;
        mesh.position.y = mesh.userData.orbitYOffset;
        mesh.position.z = z;
        
        // Rotation propre de la planète
        mesh.rotation.x += 0.003;
        mesh.rotation.y += 0.004;
    });
}
// Bouton de mise en pause de l'animation
const animationPauseBtn = document.getElementById('animation-pause-btn');
let isAnimationPaused = false;
animationPauseBtn.addEventListener('click', () => {
    isAnimationPaused = !isAnimationPaused;
    animationPauseBtn.textContent = isAnimationPaused ? '▶️' : '⏸️';
});
// === VUE DÉTAIL ===
let detailScene = null;
let detailCamera = null;
let detailRenderer = null;
let detailRaycaster = new THREE.Raycaster();
let detailMouse = new THREE.Vector2();
let detailContinentMeshes = [];
let currentDetailPlanet = null;
let isDraggingDetail = false;
let previousDetailMousePosition = { x: 0, y: 0 };
let isDetailAnimating = false;

const continentColors = [
    0xFF6B9D, // Rose vif
    0x00D9FF, // Cyan
    0x7B68EE, // Bleu violet
    0xFF4500, // Orange rouge
    0x32CD32, // Vert lime
    0xFFD700, // Or
];

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
    
    detailCamera.position.z = 60;

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

    // Rotation lente de la scène
    detailScene.rotation.y += 0.0003;

    detailRenderer.render(detailScene, detailCamera);
}

function startDetailAnimation() {
    if (isDetailAnimating) return;
    isDetailAnimating = true;
    animateDetail();
}


function createContinentSegments(planet) {
    // Nettoyer les anciens meshes
    detailContinentMeshes.forEach(mesh => {
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) mesh.material.dispose();
        detailScene.remove(mesh);
    });
    detailContinentMeshes = [];

    const continents = planet.continents;
    const radius = 35;

    const getFibonacciSphereDirection = (index, total) => {
        const i = index + 0.5;
        const phi = Math.acos(1 - (2 * i) / total);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        return new THREE.Vector3(
            Math.cos(theta) * Math.sin(phi),
            Math.sin(theta) * Math.sin(phi),
            Math.cos(phi)
        ).normalize();
    };

    const buildContinentPatchGeometry = (sourceGeometry, centerDir, angularRadius) => {
        const threshold = Math.cos(angularRadius);
        const positions = sourceGeometry.attributes.position.array;
        const patchPositions = [];

        const v1 = new THREE.Vector3();
        const v2 = new THREE.Vector3();
        const v3 = new THREE.Vector3();
        const centroid = new THREE.Vector3();

        for (let i = 0; i < positions.length; i += 9) {
            v1.set(positions[i], positions[i + 1], positions[i + 2]);
            v2.set(positions[i + 3], positions[i + 4], positions[i + 5]);
            v3.set(positions[i + 6], positions[i + 7], positions[i + 8]);

            centroid.copy(v1).add(v2).add(v3).multiplyScalar(1 / 3).normalize();

            if (centroid.dot(centerDir) >= threshold) {
                patchPositions.push(
                    v1.x, v1.y, v1.z,
                    v2.x, v2.y, v2.z,
                    v3.x, v3.y, v3.z
                );
            }
        }

        if (patchPositions.length === 0) {
            return null;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(patchPositions, 3));
        geometry.computeVertexNormals();
        return geometry;
    };

    // Créer la planète de base
    const baseGeometry = new THREE.IcosahedronGeometry(radius, 4);
    const baseMaterial = new THREE.MeshPhongMaterial({
        color: planet.color,
        emissive: planet.color,
        emissiveIntensity: 0.2,
        shininess: 50,
    });
    const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
    baseMesh.userData.isContinent = false;
    detailScene.add(baseMesh);
    detailContinentMeshes.push(baseMesh);

    // Créer et afficher tous les continents à la fois autour de la planète
    const sourceGeometry = new THREE.SphereGeometry(radius + 0.6, 36, 24).toNonIndexed();
    const baseAngularRadius = Math.max(0.35, 0.65 - (continents.length * 0.03));

    continents.forEach((continent, index) => {
        const color = continentColors[index % continentColors.length];

        const centerDir = getFibonacciSphereDirection(index, continents.length);
        const angularRadius = baseAngularRadius + (index % 2 === 0 ? 0.04 : -0.02);
        const geometry = buildContinentPatchGeometry(sourceGeometry, centerDir, angularRadius);
        if (!geometry) {
            return;
        }

        const material = new THREE.MeshPhongMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.4,
            shininess: 100,
            transparent: true,
            opacity: 0.9
        });

        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.userData = {
            isContinent: true,
            continent: continent,
            continentIndex: index,
            originalOpacity: 0.9
        };

        detailScene.add(mesh);
        detailContinentMeshes.push(mesh);
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
    if (hit && hit.userData.isContinent && hit.userData.continent) {
        showContinentInfo(hit.userData.continent);
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

    detailContinentMeshes.forEach(mesh => {
        if (mesh.userData && (mesh.userData.isContinent || !mesh.userData.isContinent)) {
            mesh.rotation.y += deltaX * 0.005;
            mesh.rotation.x += deltaY * 0.005;
        }
    });

    event.preventDefault();
}

function onDetailCanvasTouchEnd(event) {
    detailTouchState.isDragging = false;
    detailRenderer.domElement.style.cursor = 'grab';

    if (!detailTouchState.hasMoved && event.changedTouches.length > 0) {
        const touch = event.changedTouches[0];
        const hit = getDetailIntersection(touch.clientX, touch.clientY);
        if (hit && hit.userData.isContinent && hit.userData.continent) {
            showContinentInfo(hit.userData.continent);
        }
    }
}

function onDetailCanvasInteraction(event) {
    // Drag - tourner la planète
    if (isDraggingDetail && currentDetailPlanet) {
        const deltaX = event.clientX - previousDetailMousePosition.x;
        const deltaY = event.clientY - previousDetailMousePosition.y;
        
        previousDetailMousePosition = { x: event.clientX, y: event.clientY };

        // Tourner tous les meshes continents ET la planète
        detailContinentMeshes.forEach(mesh => {
            if (mesh.userData && (mesh.userData.isContinent || !mesh.userData.isContinent)) {
                mesh.rotation.y += deltaX * 0.005;
                mesh.rotation.x += deltaY * 0.005;
            }
        });
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
            mesh.material.emissiveIntensity = 0.4;
        }
    });

    // Mettre en évidence le continent survolé
    let found = false;
    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.userData && intersects[i].object.userData.isContinent) {
            intersects[i].object.material.opacity = 1;
            intersects[i].object.material.emissiveIntensity = 0.8;
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

    // Afficher la vue
    const detailView = document.getElementById('detail-view');
    detailView.style.display = 'flex';
    setTimeout(() => {
        detailView.classList.add('active');
    }, 10);

    // Redimensionner le renderer
    setTimeout(() => {
        const detailCanvas = document.getElementById('detail-canvas');
        const width = detailCanvas.clientWidth;
        const height = detailCanvas.clientHeight;
        if (detailCamera && detailRenderer) {
            detailCamera.aspect = width / height;
            detailCamera.updateProjectionMatrix();
            detailRenderer.setSize(width, height);
        }
    }, 50);
    
    // Afficher le premier continent par défaut
    if (planet.continents.length > 0) {
        showContinentInfo(planet.continents[0]);
    }
}

function showContinentInfo(continent) {
    document.getElementById('detail-title').textContent = continent.name.toUpperCase();
    document.getElementById('detail-description').textContent = continent.detail;
}

function hideDetailView() {
    const detailView = document.getElementById('detail-view');
    detailView.classList.remove('active');
    setTimeout(() => {
        detailView.style.display = 'none';
    }, 400);
    detailContinentMeshes.forEach(mesh => detailScene.remove(mesh));
    detailContinentMeshes = [];
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

    // Animations
    rotateSun();
    rotateBelts();
    updateOrbits();
    animatePlanetHover();

    renderer.render(scene, camera);
}

animate();

updateControlsText();
