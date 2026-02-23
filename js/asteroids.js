// === CEINTURES D'ASTÉROÏDES ===
function createAsteroidBelt(distance, count, thickness) {
    const particles = new THREE.BufferGeometry();
    const posArray = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = distance + (Math.random() - 0.5) * thickness;
        const y = (Math.random() - 0.5) * thickness * 0.3;

        posArray[i * 3]     = Math.cos(angle) * dist;
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

const beltLine1 = createAsteroidBelt(72, 800, 8);
const beltLine2 = createAsteroidBelt(142, 600, 10);
