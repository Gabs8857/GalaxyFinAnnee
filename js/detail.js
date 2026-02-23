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

// --- Zoom adaptatif ---
function calculateAdaptiveZoom() {
    const detailCanvas = document.getElementById('detail-canvas');
    if (!detailCanvas) return 50;

    const height = detailCanvas.clientHeight;
    const width = detailCanvas.clientWidth;
    const minDimension = Math.min(height, width);

    const baseZoom = 50;
    const zoomFactor = minDimension / 600;
    const adaptiveZoom = baseZoom * Math.max(0.8, Math.min(zoomFactor, 1.2));
    return Math.max(40, Math.min(adaptiveZoom, 70));
}

// --- Focus continent ---
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

// --- UI des cartes continents ---
function renderDetailContinentCards(planet, activeContinentName = '') {
    const container = document.getElementById('detail-continent-cards');
    if (!container) return;

    container.innerHTML = '';
    const continents = planet?.continents || [];

    continents.forEach((continent, index) => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'detail-continent-legend-item';
        if (continent.name === activeContinentName) card.classList.add('active');

        const colorHex = `#${continentColors[index % continentColors.length].toString(16).padStart(6, '0')}`;

        card.innerHTML = `
            <span class="detail-continent-color" style="background:${colorHex}"></span>
            <span class="detail-continent-text">
                <span class="detail-continent-name">${continent.name}</span>
                <span class="detail-continent-hint">${continent.detail}</span>
            </span>
        `;
        card.addEventListener('click', () => { showContinentInfo(continent); });
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

function showContinentInfo(continent) {
    document.getElementById('detail-title').textContent = continent.name.toUpperCase();
    document.getElementById('detail-description').textContent = continent.detail;
    focusOnContinent(continent.name);
    if (currentDetailPlanet) {
        renderDetailContinentCards(currentDetailPlanet, continent.name);
    }
}

// --- Géométrie de la planète détail ---
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

    // Planète de base
    const baseGeometry = new THREE.IcosahedronGeometry(radius, 4);
    const baseMaterial = new THREE.MeshStandardMaterial({
        color: planet.color,
        emissive: 0x111111,
        emissiveIntensity: 0.06,
        roughness: 0.9,
        metalness: 0.05
    });
    const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
    baseMesh.userData.isContinent = false;
    detailPlanetGroup.add(baseMesh);
    detailContinentMeshes.push(baseMesh);

    // Continents
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
        if (!geometry) return;

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

// --- Raycast détail ---
function getDetailIntersection(clientX, clientY) {
    const rect = detailRenderer.domElement.getBoundingClientRect();
    detailMouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    detailMouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    detailRaycaster.setFromCamera(detailMouse, detailCamera);
    const intersects = detailRaycaster.intersectObjects(detailContinentMeshes);
    return intersects.length > 0 ? intersects[0].object : null;
}

// --- Événements canvas détail (souris) ---
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

function onDetailCanvasMouseDown(event) {
    isDraggingDetail = true;
    previousDetailMousePosition = { x: event.clientX, y: event.clientY };
    detailRenderer.domElement.style.cursor = 'grabbing';
}

function onDetailCanvasMouseUp() {
    isDraggingDetail = false;
    detailRenderer.domElement.style.cursor = 'grab';
}

function onDetailCanvasInteraction(event) {
    // Drag
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

    // Survol
    const rect = detailRenderer.domElement.getBoundingClientRect();
    detailMouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    detailMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    detailRaycaster.setFromCamera(detailMouse, detailCamera);
    const intersects = detailRaycaster.intersectObjects(detailContinentMeshes, false);

    detailContinentMeshes.forEach(mesh => {
        if (mesh.userData && mesh.userData.isContinent) {
            mesh.material.opacity = mesh.userData.originalOpacity || 0.8;
            mesh.material.emissiveIntensity = mesh.userData.originalEmissiveIntensity || 0.06;
        }
    });

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

    if (!found) detailRenderer.domElement.style.cursor = 'grab';
}

// --- Événements canvas détail (tactile) ---
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

// --- Boucle d'animation détail ---
function animateDetail() {
    if (!isDetailAnimating) return;
    requestAnimationFrame(animateDetail);

    if (!detailRenderer || !detailScene || !detailCamera) return;

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

// --- Initialisation ---
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

    detailDefaultCameraZ = calculateAdaptiveZoom();
    detailCamera.position.z = detailDefaultCameraZ;
    detailTargetCameraZ = detailDefaultCameraZ;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    detailScene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff99ff, 2);
    pointLight.position.set(50, 50, 50);
    detailScene.add(pointLight);

    const backLight = new THREE.PointLight(0xaa66ff, 1);
    backLight.position.set(-50, -50, 30);
    detailScene.add(backLight);

    startDetailAnimation();

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

// --- Affichage / masquage ---
function showDetailView(planetMesh) {
    const planet = planetMesh.userData.planet;
    currentDetailPlanet = planet;

    createContinentSegments(planet);
    startDetailAnimation();

    if (detailCamera) detailCamera.position.z = detailDefaultCameraZ;

    const detailView = document.getElementById('detail-view');
    detailView.style.display = 'flex';
    setTimeout(() => { detailView.classList.add('active'); }, 10);

    setTimeout(() => {
        const detailCanvas = document.getElementById('detail-canvas');
        const width = detailCanvas.clientWidth;
        const height = detailCanvas.clientHeight;
        if (detailCamera && detailRenderer) {
            detailCamera.aspect = width / height;
            detailCamera.updateProjectionMatrix();
            detailRenderer.setSize(width, height);
            detailDefaultCameraZ = calculateAdaptiveZoom();
            detailTargetCameraZ = detailDefaultCameraZ;
            detailCamera.position.z = detailDefaultCameraZ;
        }
    }, 50);

    showPlanetInfo(planet);
}

function hideDetailView() {
    const detailView = document.getElementById('detail-view');
    detailView.classList.remove('active');
    setTimeout(() => { detailView.style.display = 'none'; }, 400);

    const continentCards = document.getElementById('detail-continent-cards');
    if (continentCards) continentCards.innerHTML = '';

    clearDetailPlanetGroup();
    currentDetailPlanet = null;
    hoveredPlanet = null;
}

document.addEventListener('DOMContentLoaded', () => {
    initDetailView();
});
