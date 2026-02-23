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

const continentColors = [
    0xFF6B9D,
    0x00D9FF,
    0x7B68EE,
    0xFF4500,
    0x32CD32,
    0xFFD700,
];
