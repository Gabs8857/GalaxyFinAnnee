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
        description: 'Une de mes principales spécificités en tant qu\'étudiant, c\'est ma polyvalence. Notamment dans le domaine du web où, en plus de développer avancé. Touchez les régions pour plus de détails',
        continents: [
            { name: 'Frontend', detail: 'React, Vue.js, CSS/SCSS, Responsive Design' },
            { name: 'Backend', detail: 'Node.js, Express, Databases, APIs' },
            { name: 'Outils', detail: 'TypeScript, Webpack, Git, Testing' }
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
            { name: 'Modélisation', detail: 'Blender, Sculpting, Retopology' },
            { name: 'Texturing', detail: 'PBR, Materials, UV Mapping' },
            { name: 'Design', detail: 'Photoshop, Illustration, Composition' }
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
            { name: 'Montage', detail: 'Premiere Pro, Final Cut, DaVinci' },
            { name: 'Motion', detail: 'After Effects, Keyframing, Animation' },
            { name: 'VFX', detail: 'Compositing, Color Grading, Effets' }
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
            { name: 'Interface', detail: 'Figma, Adobe XD, Prototyping' },
            { name: 'Expérience', detail: 'UX Research, Wireframing, Testing' },
            { name: 'Accessibilité', detail: 'WCAG, Responsive, Inclusif' }
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
            { name: 'Python', detail: 'Data Science, Scripts, Automation' },
            { name: 'C++', detail: 'Performance, Game Dev, Systèmes' },
            { name: 'JavaScript', detail: 'Web, Full-Stack, Frameworks' }
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
            { name: 'Keyframe', detail: 'Traditional Animation, Timing' },
            { name: 'Rigging', detail: 'Skeleton, IK/FK, Weight Painting' },
            { name: 'Simulation', detail: 'Physics, Cloth, Particles' }
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
            { name: 'Sculpting', detail: 'Dynamesh, Zbrush, Digital Sculpting' },
            { name: 'Baking', detail: 'Normal Maps, Ambient Occlusion' },
            { name: 'Rendering', detail: 'Cycles, EeveeRender, Denoising' }
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
            { name: 'Unity', detail: 'C#, Physics, Game Logic' },
            { name: 'Unreal', detail: 'Blueprints, C++, Advanced VFX' },
            { name: 'Gameplay', detail: 'Mechanics, UI, Audio Integration' }
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

// Gestion du clic pour aller aux pages de détails
window.addEventListener('click', (event) => {
    if (!isDragging && hoveredPlanet) {
        const planetName = hoveredPlanet.userData.planet.name.toLowerCase().replace(/[^a-z]+/g, '-');
        window.location.href = `pages/planet-${planetName}.html`;
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
