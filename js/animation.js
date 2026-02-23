// === ÉTAT DE PAUSE ===
let isAnimationPaused = false;

// === ANIMATIONS PAR FRAME ===
function animatePlanetHover() {
    planetsObjects.forEach(mesh => {
        if (mesh.userData.isHovered) {
            mesh.scale.lerp(new THREE.Vector3(1.4, 1.4, 1.4), 0.1);
        } else {
            mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        }
    });
}

function rotateSun() {
    sun.rotation.x += 0.002;
    sun.rotation.y += 0.003;
}

function rotateBelts() {
    beltLine1.rotation.y += 0.0005;
    beltLine2.rotation.y -= 0.0003;
}

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

        mesh.position.x = Math.cos(mesh.userData.angle) * orbitRadiusX;
        mesh.position.y = mesh.userData.orbitYOffset;
        mesh.position.z = Math.sin(mesh.userData.angle) * orbitRadiusZ;

        mesh.rotation.x += 0.003;
        mesh.rotation.y += 0.004;
    });
}

// === BOUCLE PRINCIPALE ===
function animate() {
    requestAnimationFrame(animate);

    if (!isAnimationPaused) {
        rotateSun();
        rotateBelts();
        updateOrbits();
        animatePlanetHover();
    }

    updatePlanetLabels();
    renderer.render(scene, camera);
}
