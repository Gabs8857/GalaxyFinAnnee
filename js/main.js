// Configuration de la scène
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x0a0015);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

camera.position.z = 200;

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
const planetAngles = [];
let hoveredPlanet = null;

// Tableau pour raycast
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

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
    mesh.position.set(planet.distance, Math.sin(index) * 10, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    // Stocker les données
    mesh.userData = {
        planet: planet,
        originalScale: 1,
        isHovered: false,
        distance: planet.distance,
        angle: Math.random() * Math.PI * 2,
        orbitSpeed: planet.speed
    };

    scene.add(mesh);
    planetsObjects.push(mesh);
    planetAngles.push(mesh.userData.angle);

    // Ajouter des orbites visuelles
    const orbitGeometry = new THREE.BufferGeometry();
    const orbitPoints = [];
    for (let i = 0; i <= 128; i++) {
        const angle = (i / 128) * Math.PI * 2;
        orbitPoints.push(
            Math.cos(angle) * planet.distance,
            0,
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

// Gestion du hover
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planetsObjects);

    // Réinitialiser hover
    planetsObjects.forEach(mesh => {
        if (mesh.userData.isHovered) {
            mesh.userData.isHovered = false;
            mesh.scale.set(1, 1, 1);
        }
    });
    infoPanel.classList.remove('active');

    // Appliquer hover si intersection
    if (intersects.length > 0) {
        const planet = intersects[0].object;
        planet.userData.isHovered = true;
        hoveredPlanet = planet;
        
        // Afficher les infos
        infoPanel.innerHTML = `
            <h3>${planet.userData.planet.name}</h3>
            <p>${planet.userData.planet.skills}</p>
        `;
        infoPanel.classList.add('active');
    }
});

// Gestion du clic pour afficher la vue détail
window.addEventListener('click', (event) => {
    // Vérifier que la detail-view n'est pas visible
    const detailView = document.getElementById('detail-view');
    if (detailView && detailView.classList.contains('active')) {
        return; // Ne pas traiter les clics si la modal est ouverte
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

// Gestion du redimensionnement
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
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
    planetsObjects.forEach((mesh, index) => {
        mesh.userData.angle += mesh.userData.orbitSpeed;
        
        const x = Math.cos(mesh.userData.angle) * mesh.userData.distance;
        const z = Math.sin(mesh.userData.angle) * mesh.userData.distance;
        
        mesh.position.x = x;
        mesh.position.z = z;
        
        // Rotation propre de la planète
        mesh.rotation.x += 0.003;
        mesh.rotation.y += 0.004;
    });
}

// === VUE DÉTAIL ===
let detailScene = null;
let detailCamera = null;
let detailRenderer = null;
let detailAnimationId = null;
let detailRaycaster = new THREE.Raycaster();
let detailMouse = new THREE.Vector2();
let detailContinentMeshes = [];
let currentDetailPlanet = null;
let isDraggingDetail = false;
let previousDetailMousePosition = { x: 0, y: 0 };

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

    // Animation de la vue détail
    function animateDetail() {
        detailAnimationId = requestAnimationFrame(animateDetail);

        // Rotation lente de la scène
        detailScene.rotation.y += 0.0003;

        detailRenderer.render(detailScene, detailCamera);
    }

    animateDetail();
    
    // Événements pour interagir avec la planète
    detailRenderer.domElement.addEventListener('click', onDetailCanvasClick);
    detailRenderer.domElement.addEventListener('mousemove', onDetailCanvasInteraction);
    detailRenderer.domElement.addEventListener('mousedown', onDetailCanvasMouseDown);
    detailRenderer.domElement.addEventListener('mouseup', onDetailCanvasMouseUp);
    detailRenderer.domElement.addEventListener('mouseleave', onDetailCanvasMouseUp);
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
    continents.forEach((continent, index) => {
        const color = continentColors[index % continentColors.length];
        
        // Créer une petite sphère pour chaque continent
        const geometry = new THREE.SphereGeometry(6, 8, 8);
        const material = new THREE.MeshPhongMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.4,
            shininess: 100,
            transparent: true,
            opacity: 0.8
        });

        const mesh = new THREE.Mesh(geometry, material);
        
        // Positionner autour de la planète de manière regulière
        const angle = (index / continents.length) * Math.PI * 2;
        const angleX = (index / continents.length) * Math.PI;
        
        const x = Math.cos(angle) * (radius + 15);
        const y = Math.sin(angleX) * 20;
        const z = Math.sin(angle) * (radius + 15);
        
        mesh.position.set(x, y, z);
        
        mesh.userData = {
            isContinent: true,
            continent: continent,
            continentIndex: index,
            originalOpacity: 0.8
        };

        detailScene.add(mesh);
        detailContinentMeshes.push(mesh);
    });
}

function onDetailCanvasClick(event) {
    // Récupérer le canvas
    const rect = detailRenderer.domElement.getBoundingClientRect();
    detailMouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    detailMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Raycast
    detailRaycaster.setFromCamera(detailMouse, detailCamera);
    const intersects = detailRaycaster.intersectObjects(detailContinentMeshes);

    // Chercher un continent à afficher
    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.userData.isContinent && intersects[i].object.userData.continent) {
            showContinentInfo(intersects[i].object.userData.continent);
            break;
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
    
    // Réinitialiser le panel info
    const infoPanel = document.getElementById('info-panel');
    if (infoPanel) {
        infoPanel.classList.remove('active');
    }
    
    if (detailAnimationId) {
        cancelAnimationFrame(detailAnimationId);
    }
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
