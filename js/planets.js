// === PLANÈTES ===
const planetsObjects = [];

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

function createPlanets() {
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

        // Orbites visuelles
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
}

createPlanets();
