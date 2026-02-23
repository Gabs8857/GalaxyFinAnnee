// === RAYCASTER & HELPERS ===
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let suppressNextClick = false;
let hoveredPlanet = null;

// Panel d'info survol
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

// === ÉVÉNEMENTS SOURIS ===
window.addEventListener('mousemove', (event) => {
    updateHoverFromPointer(event.clientX, event.clientY);
});

window.addEventListener('click', (event) => {
    if (suppressNextClick) {
        suppressNextClick = false;
        return;
    }

    const detailView = document.getElementById('detail-view');
    if (detailView && detailView.classList.contains('active')) return;

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

// === DRAG SOURIS ===
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

window.addEventListener('mousedown', () => { isDragging = true; });

window.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        scene.rotation.y += deltaX * 0.005;
        scene.rotation.x += deltaY * 0.005;
    }
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mouseup', () => { isDragging = false; });

// === ZOOM MOLETTE ===
window.addEventListener('wheel', (e) => {
    e.preventDefault();
    camera.position.z += e.deltaY * 0.15;
    camera.position.z = Math.max(80, Math.min(600, camera.position.z));
}, { passive: false });

// === ÉVÉNEMENTS TACTILES ===
const touchState = {
    isDragging: false,
    hasMoved: false,
    lastX: 0,
    lastY: 0,
    isPinching: false,
    lastDistance: 0,
    hoveredPlanetMesh: null
};

function getTouchDistance(touchA, touchB) {
    const dx = touchA.clientX - touchB.clientX;
    const dy = touchA.clientY - touchB.clientY;
    return Math.hypot(dx, dy);
}

window.addEventListener('touchstart', (event) => {
    const detailView = document.getElementById('detail-view');
    if (detailView && detailView.classList.contains('active')) return;

    if (event.touches.length === 1) {
        const touch = event.touches[0];
        touchState.isDragging = true;
        touchState.hasMoved = false;
        touchState.isPinching = false;
        touchState.lastX = touch.clientX;
        touchState.lastY = touch.clientY;
    } else if (event.touches.length === 2) {
        touchState.isPinching = true;
        touchState.isDragging = false;
        touchState.lastDistance = getTouchDistance(event.touches[0], event.touches[1]);
    }
    event.preventDefault();
}, { passive: false });

window.addEventListener('touchmove', (event) => {
    const detailView = document.getElementById('detail-view');
    if (detailView && detailView.classList.contains('active')) return;

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
                touchState.hoveredPlanetMesh = null;
                updateHoverFromPointer(-9999, -9999);
            } else if (touchState.hoveredPlanetMesh === planet) {
                suppressNextClick = true;
                showDetailView(planet);
                touchState.hoveredPlanetMesh = null;
            } else {
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

// === REDIMENSIONNEMENT ===
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateControlsText();

    const detailCanvas = document.getElementById('detail-canvas');
    if (detailCanvas && detailRenderer && detailCamera) {
        const width = detailCanvas.clientWidth;
        const height = detailCanvas.clientHeight;
        if (width > 0 && height > 0) {
            detailCamera.aspect = width / height;
            detailCamera.updateProjectionMatrix();
            detailRenderer.setSize(width, height);
            detailDefaultCameraZ = calculateAdaptiveZoom();
            detailTargetCameraZ = detailDefaultCameraZ;
        }
    }
});
