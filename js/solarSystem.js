// Configuración básica de Three.js
const container = document.getElementById('centerPlanet');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

// Configuración básica de Three.js
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // Fondo transparente
container.appendChild(renderer.domElement);
// Luz
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

const textureLoader = new THREE.TextureLoader();
const textures = {
    sun: textureLoader.load('../img/2k_sun.jpg'),
    mercury: textureLoader.load('../img/2k_mercury.jpg'),
    earth: textureLoader.load('../img/2k_earth_daymap.jpg'),
    mars: textureLoader.load('../img/2k_mars.jpg'),
    venus: textureLoader.load('../img/2k_venus_surface.jpg'),
    jupiter: textureLoader.load('../img/2k_jupiter.jpg'),
    saturn: textureLoader.load('../img/2k_saturn.jpg'),
    uranus: textureLoader.load('../img/2k_uranus.jpg'),
    neptune: textureLoader.load('../img/2k_neptune.jpg')
};

// Crear el Sol
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ map: textures.sun });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Añadir luz puntual al Sol
const sunLight = new THREE.PointLight(0xffffff, 1.5, 100, 2); 
sunLight.position.set(sun.position.x, sun.position.y, sun.position.z); 
scene.add(sunLight);


function updateSunLight() {
    sunLight.position.copy(sun.position); 
}


// Crear planetas con diferentes texturas
const planets = [];
const planetData = [
    { name: "Mercury", size: 0.5, distance: 8, texture: textures.mercury, rotationSpeed: 0.02 },
    { name: "Venus", size: 0.8, distance: 12, texture: textures.venus, rotationSpeed: 0.015 },
    { name: "Earth", size: 1, distance: 16, texture: textures.earth, rotationSpeed: 0.01 },
    { name: "Mars", size: 0.6, distance: 20, texture: textures.mars, rotationSpeed: 0.02 },
    { name: "Jupiter", size: 2, distance: 28, texture: textures.jupiter, rotationSpeed: 0.005 },
    { name: "Saturn", size: 1.8, distance: 36, texture: textures.saturn, rotationSpeed: 0.005 },
    { name: "Uranus", size: 1.2, distance: 44, texture: textures.uranus, rotationSpeed: 0.004 },
    { name: "Neptune", size: 1.1, distance: 52, texture: textures.neptune, rotationSpeed: 0.003 }
];

planetData.forEach(data => {
    const planetGeometry = new THREE.SphereGeometry(data.size, 32, 32);

    // Cambiar a MeshStandardMaterial para que los planetas reaccionen a la luz
    const planetMaterial = new THREE.MeshStandardMaterial({
        map: data.texture,  // Asigna la textura
    });

    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.position.x = data.distance;
    planet.rotationSpeed = data.rotationSpeed;
    planets.push(planet);
    scene.add(planet);
});

// Añadir anillos de Saturno
const saturn = planets.find(p => p.name === "Saturn");
if (saturn) {
    const ringGeometry = new THREE.RingGeometry(2, 2.5, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
        map: textureLoader.load('../img/2k_saturn_ring_alpha.png'),
        side: THREE.DoubleSide,
        transparent: true
    });
    const rings = new THREE.Mesh(ringGeometry, ringMaterial);
    rings.rotation.x = Math.PI / 2;
    saturn.add(rings);
}

const inclination = Math.PI / 3; // 30 grados de inclinación
scene.rotation.x = inclination;


// Crear líneas de órbita para los planetas
const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x999999 }); // Color gris para las órbitas

planetData.forEach((data) => {
    // Crear geometría de anillo para representar la órbita
    const orbitGeometry = new THREE.RingGeometry(data.distance - 0.1, data.distance + 0.1, 1000); // Aumenta el número de segmentos
    
    // Crear la línea de órbita usando LineLoop (que conecta los puntos formando un círculo)
    const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;  // Alinear la órbita al plano XZ
    scene.add(orbit);  // Añadir la órbita a la escena
});

camera.position.z = 90;
// Crear controles de órbita
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;  // Habilitar la amortiguación para una transición suave
controls.dampingFactor = 0.25;  // Factor de amortiguación (suaviza el movimiento)
controls.screenSpacePanning = false;  // No permitir desplazamiento en el plano de la pantalla
controls.maxPolarAngle = Math.PI / 2;

const orbitalSpeedFactor = 0.05; // Factor base para la velocidad orbital

// Función para calcular la velocidad orbital realista pero exagerada para marcar la diferencia
function getOrbitalSpeed(distance) {
    // La velocidad es inversamente proporcional a la raíz cuadrada de la distancia, pero multiplicamos por un factor
    const speed = orbitalSpeedFactor / Math.pow(distance, 1.5);  // Aumenta la diferencia en la velocidad
    return speed;
}

// Función para animar el sistema solar
function animate() {
    requestAnimationFrame(animate);

    // Rotar el sol
    sun.rotation.y += 0.005;

    // Actualizar las posiciones y rotaciones de los planetas
    planets.forEach((planet, index) => {
        planet.rotation.y += planet.rotationSpeed;
        const orbitalSpeed = getOrbitalSpeed(planetData[index].distance);
        planet.position.x = Math.cos(Date.now() * orbitalSpeed) * planetData[index].distance;
        planet.position.z = Math.sin(Date.now() * orbitalSpeed) * planetData[index].distance;
    });

    // Actualizar la posición de la luz del Sol
    updateSunLight();

    controls.update();  // Necesario para la amortiguación

    // Renderizar la escena
    renderer.render(scene, camera);
}


// Iniciar la animación
animate();