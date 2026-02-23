// === ÉTIQUETTES DE PLANÈTES ===
const planetLabels = [];

function createPlanetLabels() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '99';
    document.body.appendChild(svg);

    planetsObjects.forEach((mesh) => {
        const label = document.createElement('div');
        label.className = 'planet-label';
        label.innerHTML = `&#10142; ${mesh.userData.planet.name}`;
        document.body.appendChild(label);

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('stroke', '#ff99ff');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('opacity', '0');
        line.style.transition = 'opacity 0.2s ease';
        svg.appendChild(line);

        planetLabels.push({ element: label, mesh, line });
    });
}

function updatePlanetLabels() {
    const margin = 8;
    const gap = 18;
    const elHeight = 18;

    planetLabels.forEach(({ element, mesh, line }) => {
        const worldPos = new THREE.Vector3();
        mesh.getWorldPosition(worldPos);
        const vector = worldPos.clone();
        vector.project(camera);

        const isVisible = vector.z < 1 && vector.z > -1;

        if (isVisible) {
            const sx = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const sy = (-(vector.y * 0.5) + 0.5) * window.innerHeight;

            const planetSize = mesh.userData.planet.size / 2;
            const rv = worldPos.clone().add(new THREE.Vector3(planetSize, 0, 0));
            rv.project(camera);
            const radiusPx = Math.abs((rv.x * 0.5 + 0.5) * window.innerWidth - sx);

            const onRight = sx > window.innerWidth * 0.5;
            const side = onRight ? 'left' : 'right';

            if (element.dataset.side !== side) {
                element.dataset.side = side;
                element.innerHTML = onRight
                    ? `${mesh.userData.planet.name} &larr;`
                    : `&rarr; ${mesh.userData.planet.name}`;
            }

            const labelTop = Math.max(margin, Math.min(window.innerHeight - elHeight - margin, sy - elHeight / 2));
            const labelCenterY = labelTop + elHeight / 2;

            element.style.top = `${labelTop}px`;
            element.style.opacity = isAnimationPaused ? '1' : '0';

            let lineX1, lineX2;

            if (onRight) {
                const rightEdge = sx - radiusPx - gap;
                element.style.left = `${rightEdge}px`;
                element.style.transform = 'translateX(-100%)';
                lineX1 = sx - radiusPx;
                lineX2 = rightEdge;
            } else {
                const leftEdge = sx + radiusPx + gap;
                element.style.left = `${leftEdge}px`;
                element.style.transform = 'none';
                lineX1 = sx + radiusPx;
                lineX2 = leftEdge;
            }

            line.setAttribute('x1', lineX1);
            line.setAttribute('y1', sy);
            line.setAttribute('x2', lineX2);
            line.setAttribute('y2', labelCenterY);
            line.setAttribute('opacity', isAnimationPaused ? '0.6' : '0');
        } else {
            element.style.opacity = '0';
            line.setAttribute('opacity', '0');
        }
    });
}

function togglePlanetLabels(show) {
    if (show) updatePlanetLabels();
}

// === BOUTON PAUSE ===
const animationPauseBtn = document.getElementById('animation-pause-btn');
if (animationPauseBtn) {
    animationPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isAnimationPaused = !isAnimationPaused;
        animationPauseBtn.innerHTML = isAnimationPaused ? '&#9654;' : '&#9208;';
        togglePlanetLabels(isAnimationPaused);
    });
}
