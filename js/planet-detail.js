// Données des planètes
const planetsData = {
    'dev-web': {
        name: 'Dev Web',
        color: 0xb366ff,
        description: 'Une de mes principales spécificités en tant qu\'étudiant, c\'est ma polyvalence. Notamment dans le domaine du web où, en plus de développer avancé.',
        continents: [
            { name: 'Frontend', detail: 'React, Vue.js, CSS/SCSS, Responsive Design, HTML5' },
            { name: 'Backend', detail: 'Node.js, Databases, APIs REST' },
            { name: 'Outils', detail: 'TypeScript, Webpack, Git, Testing, Docker, VM' }
        ]
    },
    'infographie': {
        name: 'Infographie',
        color: 0xff66cc,
        description: 'Expertise en création 3D et design graphique avec Blender et Photoshop. Création de modèles, textures, et rendus professionnels.',
        continents: [
            { name: 'Modélisation', detail: 'Blender, Sculpting, Hard Surface' },
            { name: 'Texturing', detail: 'PBR, Materials, UV Mapping' },
            { name: 'Design', detail: 'Photoshop, Illustration, Composition, Branding' }
        ]
    },
    'audiovisuel': {
        name: 'Audiovisuel',
        color: 0x9933ff,
        description: 'Maîtrise du montage vidéo et des effets visuels. Création de contenu audiovisuel dynamique et professionnel.',
        continents: [
            { name: 'Montage', detail: 'Premiere Pro, Canva, CapCut' },
            { name: 'Motion', detail: 'After Effects, Blender, Keyframing, Animation, Transitions' },
            { name: 'VFX', detail: 'Compositing, Color Grading, Effets Visuels' }
        ]
    },
    'design-uiux': {
        name: 'Design UI/UX',
        color: 0xdd66ff,
        description: 'Conception d\'interfaces utilisateur modernes et ergonomiques. Création d\'expériences utilisateur optimales.',
        continents: [
            { name: 'Interface', detail: 'Figma, Adobe XD, Wireframing' },
            { name: 'Expérience', detail: 'UX Research, User Testing, Personas, Flows' },
            { name: 'Accessibilité', detail: 'W3C, Responsive Design, Inclusif' }
        ]
    },
    'programmation': {
        name: 'Programmation',
        color: 0xaa55ff,
        description: 'Programmation multi-langages avec focus sur la logique et les structures de données.',
        continents: [
            { name: 'Python', detail: 'Data Science, Scripts, Automation, Django' },
            { name: 'PHP', detail: 'Web Development, Symfony, APIs' },
            { name : 'Tailwind', detail: 'CSS Framework, Utility-First, Responsive Design' },
            { name : 'Sass', detail: 'CSS Preprocessor, Variables, Mixins, Nesting' },
            { name: 'C++', detail: 'Performance, Game Dev, Systèmes, Algorithm Optimization' },
            { name: 'JavaScript', detail: 'Web, Full-Stack, Frameworks, Node.js' }
        ]
    },
    'animation': {
        name: 'Animation',
        color: 0xff99dd,
        description: 'Création d\'animations fluides et réalistes pour la 3D et l\'audiovisuel.',
        continents: [
            { name: 'Keyframe', detail: 'Traditional Animation, Timing, Easing' },
            { name: 'Simulation', detail: 'Physics, Cloth Simulation, Particles' }
        ]
    },
    'modelisation': {
        name: 'Modélisation',
        color: 0xbb44ff,
        description: 'Modélisation 3D avancée avec sculpting, texturing haute résolution et rendering.',
        continents: [
            { name: 'Sculpting', detail: 'Dynamesh, ZBrush, Digital Sculpting, Detail' },
            { name: 'Baking', detail: 'Normal Maps, Ambient Occlusion, Displacement' },
            { name: 'Rendering', detail: 'Cycles, Eevee, Render Passes, Quality' }
        ]
    },
    'game-dev': {
        name: 'Game Dev',
        color: 0xff77cc,
        description: 'Développement de jeux vidéo complets avec Unity et Unreal Engine.',
        continents: [
            { name: 'Unity', detail: 'C#, Physics Engine, Game Logic, Scripting' },
            { name :'Godot', detail: 'GDScript, 2D/3D, Node System, Open Source' },
            { name: 'Unreal', detail: 'Blueprints, Optimization, Simulation' },
            { name: 'Gameplay', detail: 'Mechanics Design, UI Systems, Audio Integration' }
        ]
    }
};

// Initialiser la scène 3D
function initPlanetDetail(planetKey) {
    const data = planetsData[planetKey];
    if (!data) return;

    // Mettre à jour le texte
    document.getElementById('planet-name').textContent = data.name;
    document.getElementById('planet-description').textContent = data.description;

    // Créer les boutons des continents
    const continentList = document.getElementById('continent-list');
    continentList.innerHTML = '';
    data.continents.forEach((continent, index) => {
        const btn = document.createElement('button');
        btn.className = 'continent-btn' + (index === 0 ? ' active' : '');
        btn.textContent = continent.name;
        btn.onclick = () => selectContinent(btn, continent);
        continentList.appendChild(btn);
    });

    // Afficher le premier continent par défaut
    if (data.continents.length > 0) {
        selectContinent(continentList.firstChild, data.continents[0]);
    }

    // Créer la scène 3D
    const canvas3D = document.getElementById('canvas-3d');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas3D.clientWidth / canvas3D.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(canvas3D.clientWidth, canvas3D.clientHeight);
    renderer.setClearColor(0x1a0033, 0.3);
    canvas3D.appendChild(renderer.domElement);

    camera.position.z = 80;

    // Lumières
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff99ff, 1.8);
    pointLight.position.set(40, 40, 40);
    scene.add(pointLight);

    const backLight = new THREE.PointLight(0xaa66ff, 0.8);
    backLight.position.set(-40, -40, 20);
    scene.add(backLight);

    // Créer la planète
    const geometry = new THREE.IcosahedronGeometry(45, 6);
    const material = new THREE.MeshPhongMaterial({
        color: data.color,
        emissive: data.color,
        emissiveIntensity: 0.3,
        shininess: 100,
        flatShading: false
    });
    const planet = new THREE.Mesh(geometry, material);
    scene.add(planet);

    // Ajouter des continents visuels (segments colorés)
    const continentGeometry = new THREE.IcosahedronGeometry(46, 6);
    const continentMaterial = new THREE.MeshPhongMaterial({
        color: data.color,
        emissive: 0x000000,
        emissiveIntensity: 0,
        shininess: 50,
        opacity: 0.7,
        transparent: true,
        wireframe: false
    });
    const continentMesh = new THREE.Mesh(continentGeometry, continentMaterial);
    continentMesh.scale.set(1.02, 1.02, 1.02);
    scene.add(continentMesh);

    // Animation
    function animate() {
        requestAnimationFrame(animate);

        // Rotation très lente de la planète
        planet.rotation.x += 0.0005;
        planet.rotation.y += 0.0008;
        continentMesh.rotation.x += 0.0005;
        continentMesh.rotation.y += 0.0008;

        renderer.render(scene, camera);
    }

    animate();

    // Gestion redimensionnement
    window.addEventListener('resize', () => {
        const width = canvas3D.clientWidth;
        const height = canvas3D.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
}

function selectContinent(btn, continent) {
    // Retirer l'active de tous les boutons
    document.querySelectorAll('.continent-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Afficher les infos du continent
    const continentInfo = document.getElementById('continent-info');
    document.getElementById('continent-name').textContent = continent.name;
    document.getElementById('continent-detail').textContent = continent.detail;
    continentInfo.style.display = 'block';

    // Animation d'entrée
    continentInfo.style.animation = 'none';
    setTimeout(() => {
        continentInfo.style.animation = 'slideIn 0.3s ease';
    }, 10);
}

// Fonction pour aller back à la galaxy
function goBack() {
    window.location.href = '../index.html';
}

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', () => {
    // Extraire le nom de la planète de l'URL
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
    const planetKey = filename.replace('planet-', '');
    
    initPlanetDetail(planetKey);
});
