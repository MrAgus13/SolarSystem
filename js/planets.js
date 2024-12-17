// Configuración básica de Three.js
const container = document.getElementById('centerPlanet');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Hacer transparente el fondo del canvas

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // Fondo transparente
container.appendChild(renderer.domElement);

// Luz
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// Cargar las texturas
const textureLoader = new THREE.TextureLoader();


// Crear un sistema de partículas para las estrellas
const numStars = 4000;  // Número de estrellas a crear

// Geometría de las estrellas (esferas pequeñas)
const starGeometry = new THREE.SphereGeometry(0.05, 8, 8);  // Tamaño pequeño de las estrellas

// Material de las estrellas (brillantes)
const starMaterial = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,  // Color blanco para las estrellas
    emissive: 0xFFFFFF,  // Color de emisión para simular el brillo
    emissiveIntensity: 1,  // Intensidad de la emisión para que brillen
    transparent: true,  // Hacer las estrellas transparentes para poder modificar la opacidad
    opacity: 1  // Empieza con opacidad completa
});

// Crear las estrellas y agregarlas a la escena
const stars = [];
for (let i = 0; i < numStars; i++) {
    const star = new THREE.Mesh(starGeometry, starMaterial);

    // Colocar cada estrella en una posición aleatoria en el espacio
    star.position.set(
        (Math.random() - 0.5) * 100,  // Posición X aleatoria entre -500 y 500
        (Math.random() - 0.5) * 100,  // Posición Y aleatoria entre -500 y 500
        (Math.random() - 0.5) * 400   // Posición Z aleatoria entre -500 y 500
    );

    // Añadir la estrella a la escena y al array de estrellas
    scene.add(star);
    stars.push(star);
}

// Variables para controlar el parpadeo

// Asignar un intervalo de parpadeo diferente a cada estrella

const blinkSpeed = 2;  // Velocidad de parpadeo (más bajo es más lento)
const blinkDuration = 5000;  // Duración total para parpadear de apagado a encendido (en ms)

// Función para animar el parpadeo suave de las estrellas
function animateStars() {
    stars.forEach((star) => {
        // Crear un parpadeo suave usando una interpolación en el tiempo
        const time = Date.now() * 0.002 // Tiempo en función de la velocidad de parpadeo
        const opacity = Math.sin(time * blinkSpeed) * 0.5 + 0.5; // Cambia la opacidad de 0 a 1 de forma suave

        // Asignar la opacidad calculada
        star.material.opacity = opacity;
    });
    

    // Llamar a la función de animación en el siguiente frame
    requestAnimationFrame(animateStars);
    renderer.render(scene, camera);
}

// Iniciar la animación de parpadeo
animateStars();

// Crear el modelo de la Tierra
const earthGeometry = new THREE.SphereGeometry(1.4, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('../img/2k_earth_daymap.jpg'),
    bumpMap: textureLoader.load('../img/2k_earth_daymap.jpg'),
    bumpScale: 0.03,  // Escala de relieve

});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.position.set(0, -1.8, 0); // Posición X, Y, Z (puedes ajustarlas según lo que necesites)
scene.add(earth);

// Cargar la textura de las nubes
const cloudTexture = textureLoader.load('../img/2k_earth_clouds.jpg'); // Asegúrate de tener una textura de nubes

// Crear la geometría para las nubes (esfera más grande que la de la Tierra)
const cloudGeometry = new THREE.SphereGeometry(1.41, 32, 32); // Un poco más grande que la Tierra
const cloudMaterial = new THREE.MeshBasicMaterial({
    map: cloudTexture,  // Textura de las nubes
    blending: THREE.AdditiveBlending, // Mezcla aditiva para un efecto más suave
});

// Crear las nubes
const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
clouds.position.set(0, -1.8, 0); // Posición X, Y, Z (puedes ajustarlas según lo que necesites)
scene.add(clouds);



// Crear la atmósfera
const atmosphereGeometry = new THREE.SphereGeometry(1.46, 32, 32); // Esfera ligeramente más grande
const atmosphereMaterial = new THREE.ShaderMaterial({
    uniforms: {
        'glowColor': { value: new THREE.Color(0x87CEFA) }, // Azul claro para la atmósfera
        'glowIntensity': { value: 0.5 }, // Intensidad del brillo
    },
    vertexShader: `
        varying vec3 vNormal;
        void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 glowColor;
        uniform float glowIntensity;
        varying vec3 vNormal;
        void main() {
            float intensity = pow(0.5 - dot(vNormal, normalize(vec3(0.0, 0.0, 1.0))), 2.0);
            gl_FragColor = vec4(glowColor * intensity * glowIntensity, 1.0);
        }
    `,
    side: THREE.BackSide, // Usamos el lado interior para simular el brillo
    blending: THREE.AdditiveBlending, // Mezcla aditiva para el brillo\
});
const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
atmosphere.position.set(0, -1.8, 0); // Posición X, Y, Z (puedes ajustarlas según lo que necesites)
scene.add(atmosphere);

// Cambiar la posición de Venus
const venusMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('../img/2k_venus_surface.jpg'),
});
const venus = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), venusMaterial);
venus.position.set(-4.5, 0, 0); // Venus en X = -4, Y = 1, Z = 0
scene.add(venus);

// Cambiar la posición de Marte
const marsMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('../img/2k_mars.jpg'),
});
const mars = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), marsMaterial);
mars.position.set(4.5, 0, 0); // Marte en X = 4, Y = -1, Z = 0
scene.add(mars);

// Ajustar la posición de la cámara
camera.position.z = 6;  // Cambiar la posición de la cámara según sea necesario

// Animar la rotación de la Tierra
function animate() {
    requestAnimationFrame(animate);
    earth.rotation.y += 0.001; // Velocidad de rotación de la Tierra
    atmosphere.rotation.y += 0.005; // Rotación de la atmósfera
    clouds.rotation.y += 0.0007;
    venus.rotation.y += 0.003; // Rotación de Venus
    mars.rotation.y += 0.003;  // Rotación de Marte
    renderer.render(scene, camera);
}

animate();

// Ajustar el tamaño en caso de redimensionar la ventana
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
