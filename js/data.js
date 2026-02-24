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
            { name: 'Frontend', detail: 'React, Vue.js, CSS/SCSS, Responsive Design, HTML5',
              skillDetails: {
                'React':             'Hooks, Context, State Management, Performance Optimization, Tests unitaires',
                'Vue.js':            'Composition API, Vuex/Pinia, Routing, SSR avec Nuxt',
                'CSS/SCSS':          'Flexbox, Grid, Variables, Mixins, Animations CSS',
                'Responsive Design': 'Mobile First, Breakpoints fluides, Fluid Typography',
                'HTML5':             'Sémantique, Accessibilité ARIA, APIs Web natives'
              }
            },
            { name: 'Backend', detail: 'Node.js, Databases, APIs REST',
              skillDetails: {
                'Node.js':     'Express, Middleware, Streams, Event Loop, NPM',
                'Databases':   'MySQL, PostgreSQL, MongoDB, Redis, ORM Prisma',
                'APIs REST':   'CRUD, JWT Auth, Versioning, OpenAPI/Swagger'
              }
            },
            { name: 'Outils', detail: 'TypeScript, Webpack, Git, Testing, Docker, VM',
              skillDetails: {
                'TypeScript': 'Types stricts, Generics, Decorators, tsconfig',
                'Webpack':    'Bundling, Code Splitting, Loaders, Plugins, Vite',
                'Git':        'Branching, Rebase, CI/CD, GitHub Actions',
                'Testing':    'Jest, Vitest, Cypress, TDD, Coverage',
                'Docker':     'Images, Containers, Compose, Volumes, Networking',
                'VM':         'Linux, SSH, Nginx'
              }
            }
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
            { name: 'Modélisation', detail: 'Blender, Sculpting, Hard Surface',
              skillDetails: {
                'Blender':       'Interface, Shortcuts, Modifiers, Geometry Nodes',
                'Sculpting':     'Dyntopo, Multires, Brushes, Retopology',
                'Hard Surface':  'Booleans, Bevels, Subdiv Modeling, CAD-like'
              }
            },
            { name: 'Texturing', detail: 'PBR, Materials, UV Mapping',
              skillDetails: {
                'PBR':        'Albedo, Roughness, Metallic, Normal, AO Maps',
                'Materials':  'Shader Editor, Principled BSDF, Procedural',
                'UV Mapping': 'Unwrapping, Seams, Atlas, UDIM'
              }
            },
            { name: 'Design', detail: 'Photoshop, Illustration, Composition, Branding',
              skillDetails: {
                'Photoshop':    'Retouche, Masques, Calques, Effets, RAW',
                'Illustration': 'Dessin vectoriel, Concept Art, Storyboard',
                'Composition':  'Règle des tiers, Couleurs, Lumière, Hiérarchie',
                'Branding':     'Identité visuelle, Charte graphique, Logo'
              }
            }
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
            { name: 'Montage', detail: 'Premiere Pro, Canva, CapCut',
              skillDetails: {
                'Premiere Pro': 'Timeline, Color Correction, Multicam, Export',
                'Canva':        'Templates, Branding, Réseaux sociaux, Motion',
                'CapCut':       'Montage mobile, Effets, Sous-titres auto'
              }
            },
            { name: 'Motion', detail: 'After Effects, Blender, Keyframing, Animation, Transitions',
              skillDetails: {
                'After Effects':  'Compositions, Expressions, Plugins, Motion Bro',
                'Blender':        'Animation 3D, NLA Editor, Shape Keys, Drivers',
                'Keyframing':     'Courbes Bézier, Graph Editor, Timing',
                'Animation':      'Principes des 12, Squash & Stretch, Anticipation',
                'Transitions':    'Cut, Wipe, Morph, Match Cut, L-cut'
              }
            },
            { name: 'VFX', detail: 'Compositing, Color Grading, Effets Visuels',
              skillDetails: {
                'Compositing':     'Keying, Tracking, Masking, Roto, AE + Blender',
                'Color Grading':   'LUTs, Courbes, Davinci Resolve, Ambiance',
                'Effets Visuels':  'Particles, Simulations, CGI intégration'
              }
            }
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
            { name: 'Interface', detail: 'Figma, Adobe XD, Wireframing',
              skillDetails: {
                'Figma':       'Components, Auto Layout, Variables, Prototyping, Dev Mode',
                'Adobe XD':    'Artboards, Repeat Grid, Partage de specs',
                'Wireframing': 'Low/High Fidelity, User Flow, Annotations'
              }
            },
            { name: 'Expérience', detail: 'UX Research, User Testing, Personas, Flows',
              skillDetails: {
                'UX Research':   'Interviews, Surveys, Analyse concurrentielle',
                'User Testing':  'Tests modérés, A/B Testing, Heatmaps',
                'Personas':      'Empathy Map, Jobs To Be Done, Archétypes',
                'Flows':         'User Journey, Task Flow, Sitemap'
              }
            },
            { name: 'Accessibilité', detail: 'W3C, Responsive Design, Inclusif',
              skillDetails: {
                'W3C':             'WCAG 2.1, Niveaux A/AA, Audit, ARIA',
                'Responsive Design':'Mobile First, Breakpoints, Touch targets',
                'Inclusif':        'Contraste, Lecteurs d\'écran, Focus visible'
              }
            }
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
            { name: 'Python', detail: 'Data Science, Scripts, Automation, Django',
              skillDetails: {
                'Data Science': 'Pandas, NumPy, Matplotlib, Jupyter, Sklearn',
                'Scripts':      'Automatisation fichiers, Web Scraping, APIs',
                'Automation':   'Cron, Selenium, PyAutoGUI, CI scripting',
                'Django':       'ORM, Admin, REST Framework, Auth, Templates'
              }
            },
            { name: 'PHP', detail: 'Web Development, Symfony, APIs',
              skillDetails: {
                'Web Development': 'MVC, Sessions, Forms, PDO, Sécurité',
                'Symfony':         'Bundles, Doctrine, Twig, Console, Tests',
                'APIs':            'REST, JSON, OAuth2, Consommation externe'
              }
            },
            { name: 'Tailwind', detail: 'CSS Framework, Utility-First, Responsive Design',
              skillDetails: {
                'CSS Framework':    'JIT, Config, Plugins, Purge, Dark Mode',
                'Utility-First':    'Classes atomiques, Composition, DX',
                'Responsive Design':'Breakpoints sm/md/lg/xl, Flexbox, Grid'
              }
            },
            { name: 'Sass', detail: 'CSS Preprocessor, Variables, Mixins, Nesting',
              skillDetails: {
                'CSS Preprocessor': 'Compilation, Maps, Functions, Extend',
                'Variables':        'Tokens de design, Thèmes, Override',
                'Mixins':           'Paramètres, Include, Content blocks',
                'Nesting':          'BEM, Structure, Lisibilité, Maintenance'
              }
            },
            { name: 'C++', detail: 'Performance, Game Dev, Systèmes, Algorithm Optimization',
              skillDetails: {
                'Performance':           'Mémoire, Pointeurs, Cache Locality, Profiling',
                'Game Dev':              'SFML, SDL2, Boucle de jeu, ECS',
                'Systèmes':              'Threads, Sockets, Fichiers, Compilation',
                'Algorithm Optimization':'Big O, DP, Graphes, STL avancé'
              }
            },
            { name: 'JavaScript', detail: 'Web, Full-Stack, Frameworks, Node.js',
              skillDetails: {
                'Web':        'DOM, Events, Fetch, Canvas, Web APIs',
                'Full-Stack': 'Next.js, Nuxt, API Routes, SSR/SSG',
                'Frameworks': 'React, Vue, Three.js, Express, Fastify',
                'Node.js':    'Runtime, npm, Modules, Streams, Event Loop'
              }
            }
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
            { name: 'Keyframe', detail: 'Traditional Animation, Timing, Easing',
              skillDetails: {
                'Traditional Animation': '12 principes, Pose-to-Pose, Straight Ahead',
                'Timing':               'Frames, Spacing, Rythme, Beat',
                'Easing':               'Ease In/Out, Courbes Bézier, Anticipation'
              }
            },
            { name: 'Simulation', detail: 'Physics, Cloth Simulation, Particles',
              skillDetails: {
                'Physics':          'Rigid Body, Soft Body, Contraintes Blender',
                'Cloth Simulation': 'Pinning, Collision, Vent, Qualité',
                'Particles':        'Emitter, Hair, Force Fields, Instances'
              }
            }
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
            { name: 'Sculpting', detail: 'Dynamesh, ZBrush, Digital Sculpting, Detail',
              skillDetails: {
                'Dynamesh':        'Résolution dynamique, Remesh, Polish',
                'ZBrush':          'Subtools, IMM Brushes, ZRemesher, Fibermesh',
                'Digital Sculpting':'Blender Sculpt Mode, Matcaps, Masking',
                'Detail':           'Pores, Wrinkles, High-Freq, Micro-détails'
              }
            },
            { name: 'Baking', detail: 'Normal Maps, Ambient Occlusion, Displacement',
              skillDetails: {
                'Normal Maps':      'High-to-Low, Tangent Space, xNormal, Marmoset',
                'Ambient Occlusion':'Ray casting, Baking Blender, Post-process',
                'Displacement':     'Maps 16-bit, Tessellation, Adaptive Subdiv'
              }
            },
            { name: 'Rendering', detail: 'Cycles, Eevee, Render Passes, Quality',
              skillDetails: {
                'Cycles':        'Path Tracing, Denoising, GPU/CPU, Samples',
                'Eevee':         'Real-time, Bloom, SSR, SSAO, Shadow Maps',
                'Render Passes': 'Diffuse, Specular, Shadow, Compositing',
                'Quality':       'AA, Resolution, Tile Size, Output Formats'
              }
            }
        ]
    },
    {
      name:'Hobbys',
      size: 20,
      distance: 180,
      color: 0xff77ee,
      skills: 'Divers loisirs créatifs et techniques',
      speed: 0.004,
      description: 'Une variété de loisirs qui enrichissent ma créativité et mes compétences techniques.',
      continents: [
        {
          name: 'TEST', detail: 'Guitare, Clavier, Batterie, Violon, Chant, Composition, Production, Théorie musicale',
          skillDetails: {
            'Guitare':       'Accords, Solos, Styles variés, Pratique régulière',
            'Clavier':      'Piano, Synthétiseurs, MIDI, Arrangement',
            'Batterie':     'Rythmes, Coordination, Styles, Pratique régulière',
            'Violon':       'Techniques de base',
            'Chant':        'Techniques vocales, Interprétation, Pratique régulière, Chorale',
            'Composition':   'Mélodies, Harmonies, Arrangement, Bandlab',
            'Production':    'Mixage, Mastering, Sound Design, Plugins',
            'Théorie musicale':'Gammes, Accords, Progressions, Analyse'
          } 

        },
          { name: 'Musique', detail: 'Guitare, Clavier, Batterie, Violon, Chant, Composition, Production, Théorie musicale',
            skillDetails: {
              'Guitare':       'Accords, Solos, Styles variés, Pratique régulière',
              'Clavier':      'Piano, Synthétiseurs, MIDI, Arrangement',
              'Batterie':     'Rythmes, Coordination, Styles, Pratique régulière',
              'Violon':       'Techniques de base',
              'Chant':        'Techniques vocales, Interprétation, Pratique régulière, Chorale',
              'Composition':   'Mélodies, Harmonies, Arrangement, Bandlab',
              'Production':    'Mixage, Mastering, Sound Design, Plugins',
              'Théorie musicale':'Gammes, Accords, Progressions, Analyse'
            }
          },
          { name: 'Jeux vidéo', detail: 'RPG, Stratégie/ Gestion, Streaming',
            skillDetails: {
              'RPG':        'Zelda, Albion Online, Witcher',
              'Stratégie':  'Civilization VI, Fallout Shelter',
              'Streaming':  'Diffusion en direct, Interaction avec la communauté'
            }
          },
          { name:'JDR', detail: 'Règles, Histoires, Personnages, Jeu de rôle',
            skillDetails: {
              'Règles':        'Pathfinder, Novonia Jazz, Règles de base',
              'Histoires':     'Narration, Création de monde, Quêtes',
              'Personnages':   'Création de personnages, Compétences, Classes',
              'Jeu de rôle':   'Interprétation, Imagination, Communication'
            }
          },
          { name:'Cuisine', detail: 'Recettes, Techniques, Pâtisserie',
            skillDetails: {
              'Recettes':      'Cuisine française, Italienne, Asiatique',
              'Techniques':     'Sauté, Rôtir, Griller, Cuisson lente',
              'Pâtisserie':     'Gâteaux, Tartes, Viennoiseries, Décoration'
            }
          },
          { name:'Bricolage', detail: 'Menuiserie, Électronique, DIY',
            skillDetails: {
              'Menuiserie':    'Travail du bois, Meubles, Décoration',
              'Électronique':  'Arduino, Raspberry Pi, Prototypage',
              'DIY':           'Projets créatifs, Réparations, Upcycling'
            }
          },
          { name:'Photographie', detail: 'Techniques, Post-traitement, Styles',
            skillDetails: {
              'Techniques':        'Composition, Exposition, Éclairage',
              'Post-traitement':   'Lightroom, Photoshop, Retouche',
              'Styles':            'Portrait, Paysage, Urbain, Macro'
            }
          },
          { name:'Langues', detail: 'Anglais, Espagnol, Japonais',
            skillDetails: {
              'Anglais':  'Niveau avancé, Communication fluide, Compréhension écrite et orale',
              'Allemand': 'Niveau intermédiaire, Communication basique, Compréhension écrite',
              'Japonais': 'Niveau débutant, Connaissance de base des hiragana et katakana'
            }
          },
          { name:'Sports', detail: 'Football, Natation, Randonnée',
            skillDetails: {
              'Football': 'Jeu en équipe, Stratégie, Endurance',
              'Natation': 'Techniques de nage, Endurance, Sécurité aquatique',
              'Randonnée': 'Orientation, Préparation, Respect de la nature'
            }
          },
          { name:'Lecture', detail: 'Fiction, Non-fiction, Science, Histoire',
            skillDetails: {
              'Fiction':     'Romans, Science-fiction, Fantasy, Littérature classique',
              'Non-fiction': 'Développement personnel, Sciences, Histoire',
              'Science':     'Physique, Astronomie, Biologie, Informatique',
              'Histoire':    'Histoire mondiale, Histoire de l\'art, Histoire des sciences'
            }
          },
          { name:'Voyages', detail: 'Découverte de cultures, Aventure, Photographie de voyage',
            skillDetails: {
              'Découverte de cultures': 'Immersion, Apprentissage, Respect',
              'Aventure':              'Randonnée, Exploration, Activités en plein air',
              'Photographie de voyage': 'Capturer des moments, Paysages, Portraits'
            }
          },
          { name:'Jardinage', detail: 'Plantes, Aménagement, Permaculture',
            skillDetails: {
              'Plantes':       'Entretien, Propagation, Plantes d\'intérieur et d\'extérieur',
              'Aménagement':    'Design de jardin, Espaces verts, Mobilier de jardin',
              'Permaculture':   'Principes de permaculture, Compostage, Cultures associées'
            }
          },
          { name:'Astronomie', detail: 'Observation, Cosmologie, Astrophotographie',
            skillDetails: {
              'Observation':       'Télescope, Constellations, Planètes, Événements célestes',
              'Cosmologie':        'Origine de l\'univers, Théories, Découvertes récentes',
              'Astrophotographie': 'Techniques de prise de vue, Post-traitement, Équipement'
            }
          },
          { name:'DIY Tech', detail: 'Projets électroniques, Impression 3D, Raspberry Pi',
            skillDetails: {
              'Projets électroniques': 'Circuits, Capteurs, Microcontrôleurs',
              'Impression 3D':          'Modélisation, Slicing, Matériaux, Maintenance',
              'Raspberry Pi':           'Projets DIY, Serveurs personnels, Apprentissage de Linux'
            }
          },
          { name:'Arts créatifs', detail: 'Peinture, Dessin, Sculpture',
            skillDetails: {
              'Peinture': 'Acrylique, Aquarelle, Techniques mixtes, Théorie des couleurs',
              'Dessin':   'Perspective, Anatomie, Encre, Illustration digitale',
              'Sculpture': 'Argile, Bois, Métal, Techniques de moulage'
            }
          },
          { name:'Écriture', detail: 'Fiction, Non-fiction, Blogging',
            skillDetails: {
              'Fiction':     'Romans, Nouvelles, Scénarios, Techniques narratives',
              'Non-fiction': 'Essais, Articles, Blogging, Rédaction technique',
              'Blogging':    'Création de contenu, SEO, Engagement, Plateformes'
            }
          },
          { name:'Technologie', detail: 'Gadgets, IA, Réalité virtuelle',
            skillDetails: {
              'Gadgets':          'Dernières technologies, Tests, Recommandations',
              'Réalité virtuelle':'Expériences VR, Développement, Tendances'
            }
          },
          { name:'Bénévolat', detail: 'Communauté, Environnement, Aide humanitaire',
            skillDetails: {
              'Communauté':       'Organisation d\'événements, Soutien local, Engagement',
              'Environnement':    'Nettoyage, Sensibilisation, Projets écologiques',
              'Aide humanitaire': 'Collecte de fonds, Volontariat, Partenariats'
            }
          },
          { name:'Autres', detail: 'Divers loisirs et intérêts',
            skillDetails: {
              'Divers loisirs et intérêts': 'Exploration de nouveaux hobbies, Curiosité, Apprentissage continu'
            }
          },
          { name:'À découvrir', detail: 'De nombreux autres centres d\'intérêt à explorer',
            skillDetails: {
              'De nombreux autres centres d\'intérêt à explorer': 'Toujours ouvert à de nouvelles expériences et passions'
            }
          },
          {
            name:'À venir', detail: 'De futurs projets et passions en développement',
            skillDetails: {
              'De futurs projets et passions en développement': 'Restez à l\'écoute pour de nouvelles aventures passionnantes'
            }
          }
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
