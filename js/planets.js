// Configuración básica de Three.js
const container = document.getElementById('centerPlanet');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Hacer transparente el fondo del canvas

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // Fondo transparente
container.appendChild(renderer.domElement);

document.getElementById('backButton').addEventListener('click', restoreState);

// Obtener todos los enlaces dentro del lateralBar
const menuItems = document.querySelectorAll('#lateralBar ul li a');

// Iterar sobre los enlaces y agregar un evento 'click' a cada uno
menuItems.forEach(item => {
    item.addEventListener('click', (event) => {
        // Prevenir la acción por defecto del enlace (si es necesario)
        event.preventDefault();

        menuItems.forEach(link => {
            link.parentElement.classList.remove('active');
        });

        item.parentElement.classList.add('active');
        document.querySelectorAll('section').forEach(section => {
            section.style.display = 'none'; 
        });

        const targetId = item.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.style.display = 'block';
        } 
        if (targetId === 'planetInfo') {
            document.getElementById('planetInfo').style.display = 'none';
            animatePlanet(moon, new THREE.Vector3(0, 0, 0), 1); 
            animatePlanet(earth, new THREE.Vector3(0, 0, 0), 1);  
            animatePlanet(atmosphere, new THREE.Vector3(0, 0, 0), 1); 
            animatePlanet(clouds, new THREE.Vector3(0, 0, 0), 1);  
        }
        else if (targetId === 'info') {
            // Mostrar el div "planetInfo"
            document.getElementById('planetInfo').style.display = 'block';
            animatePlanet(moon, new THREE.Vector3(-2, 0.8, 0), 1);
            animatePlanet(earth, new THREE.Vector3(-2, 0, 0), 1);  
            animatePlanet(atmosphere, new THREE.Vector3(-2, 0, 0), 1);
            animatePlanet(clouds, new THREE.Vector3(-2, 0, 0), 1);
            
        } 
        else if (targetId === 'atmosphere'){
            // Ocultar el div "planetInfo" si no se está en la sección "INFO"
            document.getElementById('planetInfo').style.display = 'none';
            animatePlanet(moon, new THREE.Vector3(0, -10, 0), 1); 
            animatePlanet(earth, new THREE.Vector3(0, -2, 0), 1);  
            animatePlanet(atmosphere, new THREE.Vector3(0, -2, 0), 1); 
            animatePlanet(clouds, new THREE.Vector3(0, -2, 0), 1);  
            
        }
        else if (targetId === 'moons'){
            // Ocultar el div "planetInfo" si no se está en la sección "INFO"
            document.getElementById('planetInfo').style.display = 'none';
            animatePlanet(moon, new THREE.Vector3(0, 0, 0), 5); 
            animatePlanet(earth, new THREE.Vector3(0, -10, 0), 1);  
            animatePlanet(atmosphere, new THREE.Vector3(0, -10, 0), 1); 
            animatePlanet(clouds, new THREE.Vector3(0, -10, 0), 1);  
            
        }

    });
});


// Luz
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

const specificLight = new THREE.PointLight(0xffffff, 1, 100); // Luz cálida con intensidad 1 y alcance 10
specificLight.position.set(3, 0, 0); // Posicionar la luz en x = 4.5
scene.add(specificLight);

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
const blinkSpeed = 2;  // Velocidad de parpadeo (más bajo es más lento)
const blinkDuration = 5000;  // Duración total para parpadear de apagado a encendido (en ms)

// Función para animar el parpadeo suave de las estrellas
function animateStars() {
    stars.forEach((star) => {
        // Crear un parpadeo suave usando una interpolación en el tiempo
        const time = Date.now() * 0.002; // Tiempo en función de la velocidad de parpadeo
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
earth.name = "earth";  // Asignamos un nombre
scene.add(earth);

// Crear el modelo de la Luna
const moonGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('../img/2k_moon.jpg'),
    bumpMap: textureLoader.load('../img/2k_moon.jpg'),
    bumpScale: 0.03,
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(1.8, -1, 0); // Posición X, Y, Z (puedes ajustarlas según lo que necesites)
moon.name = "moon";  // Asignamos un nombre
scene.add(moon);

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


// Cambiar la posición de Mercurio
const mercuryMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('../img/2k_mercury.jpg'),
    bumpMap: textureLoader.load('../img/2k_mercury.jpg'),
    bumpScale: 0.03,
});
const mercury = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), mercuryMaterial);
mercury.position.set(-9, 0, 0); // Venus en X = -4, Y = 1, Z = 0
mercury.name = "mercury";  // Asignamos un nombre
scene.add(mercury);

// Cambiar la posición de Venus
const venusMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('../img/2k_venus_surface.jpg'),
    bumpMap: textureLoader.load('../img/2k_venus_surface.jpg'),
    bumpScale: 0.03,
});
const venus = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), venusMaterial);
venus.position.set(-4.5, 0, 0); // Venus en X = -4, Y = 1, Z = 0
venus.name = "venus";  // Asignamos un nombre
scene.add(venus);

// Cambiar la posición de Marte
const marsMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('../img/2k_mars.jpg'),
    bumpMap: textureLoader.load('../img/2k_mars.jpg'),
    bumpScale: 0.03,
});
const mars = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), marsMaterial);
mars.position.set(4.5, 0, 0); // Marte en X = 4, Y = -1, Z = 0
mars.name = "mars";  // Asignamos un nombre
scene.add(mars);

// Jupiter
const jupiterMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('../img/2k_jupiter.jpg'),
    bumpMap: textureLoader.load('../img/2k_jupiter.jpg'),
    bumpScale: 0.03,
});
const jupiter = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), jupiterMaterial);
jupiter.position.set(9, 0, 0); // Marte en X = 4, Y = -1, Z = 0
jupiter.name = "jupiter";  // Asignamos un nombre
scene.add(jupiter);

// Saturn
const saturnMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('../img/2k_saturn.jpg'),
    bumpMap: textureLoader.load('../img/2k_saturn.jpg'),
    bumpScale: 0.03,
});
const saturn = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), saturnMaterial);
saturn.position.set(9, 0, 0); // Marte en X = 4, Y = -1, Z = 0
saturn.name = "saturn";  // Asignamos un nombre
scene.add(saturn);

const saturnRingsMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('../img/saturnmapthumb.jpg'),
    bumpMap: textureLoader.load('../img/saturnmapthumb.jpg'),
    bumpScale: 0.03,
});
const saturnRings = new THREE.Mesh(
    new THREE.TorusGeometry(0.6, 0.025, 32, 120), // Radio interior, grosor, segmentos radiales y circulares
    saturnRingsMaterial
);
saturnRings.position.set(9, 0, 0);
saturnRings.rotation.x = Math.PI / 2.75;  // Rotación de 90 grados sobre el eje X
saturnRings.name = "saturnRings";  // Asignamos un nombre
scene.add(saturnRings);


// Uranus
const uranusMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('../img/2k_uranus.jpg'),
    bumpMap: textureLoader.load('../img/2k_uranus.jpg'),
    bumpScale: 0.03,
});
const uranus = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), uranusMaterial);
uranus.position.set(9, 0, 0); // Marte en X = 4, Y = -1, Z = 0
uranus.name = "uranus";  // Asignamos un nombre
scene.add(uranus);

// Neptune
const neptuneMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('../img/2k_neptune.jpg'),
    bumpMap: textureLoader.load('../img/2k_neptune.jpg'),
    bumpScale: 0.03,
});
const neptune = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), neptuneMaterial);
neptune.position.set(9, 0, 0); // Marte en X = 4, Y = -1, Z = 0
neptune.name = "neptune";  // Asignamos un nombre
scene.add(neptune);

// Ajustar la posición de la cámara
camera.position.z = 6;  // Cambiar la posición de la cámara según sea necesario
let angle = 0; 

//
let activePlanet = 'earth';


// Animar la rotación de la Tierra
function animate() {
    requestAnimationFrame(animate);
    mercury.rotation.y += 0.002; 
    moon.rotation.y += 0.002;
    moon.rotation.x += 0.002;
    earth.rotation.y += 0.001; // Velocidad de rotación de la Tierra
    atmosphere.rotation.y += 0.005; // Rotación de la atmósfera
    clouds.rotation.y += 0.0007;
    venus.rotation.y += 0.0015; // Rotación de Venus
    mars.rotation.y += 0.002;  // Rotación de Marte
    jupiter.rotation.y += 0.0005;
    saturn.rotation.y += 0.0005;
    saturnRings.rotation.y += 0.0001;
    uranus.rotation.y += 0.0004;
    neptune.rotation.y += 0.0002;

    angle += 0.005; // Controlar la velocidad de la órbita

    // Hacer que la Luna orbite alrededor de la Tierra sin mover la Tierra
    const earthX = earth.position.x;
    const earthZ = earth.position.z;
    
    // El radio de la Tierra es obtenido de la geometría de la esfera
    const earthRadius = earth.geometry.parameters.radius;
    
    // La Luna orbita a una distancia de 2 unidades del centro de la Tierra, pero con el radio de la Tierra añadido
    const orbitRadius = earthRadius + 0.2;  

    console.log(orbitRadius);
    
    // Calculamos la posición de la Luna en función del ángulo de la órbita
    moon.position.x = earthX + orbitRadius * Math.cos(angle);  
    moon.position.z = earthZ + orbitRadius * Math.sin(angle);

    // Hacer que la Luna gire sobre su propio eje

    renderer.render(scene, camera);
}

animate();

// Ajustar el tamaño en caso de redimensionar la ventana
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

let previousState = null;  // Almacenará el estado anterior

// Función para guardar el estado actual
function saveState() {
    previousState = {
        mercuryPos: mercury.position.clone(),
        venusPos: venus.position.clone(),
        earthPos: earth.position.clone(),
        marsPos: mars.position.clone(),
        jupiterPos: jupiter.position.clone(),
        moonPos: moon.position.clone(),
        atmospherePos: atmosphere.position.clone(),
        cloudsPos: clouds.position.clone(),
        
        // Añadir planetas que faltan
        saturnPos: saturn.position.clone(),
        saturnRingsPos: saturnRings.position.clone(),
        uranusPos: uranus.position.clone(),
        neptunePos: neptune.position.clone(),
    };
    
}

function restoreState() {
    if (previousState) {
        animatePlanet(mercury, previousState.mercuryPos, 1);
        animatePlanet(venus, previousState.venusPos, 1);
        animatePlanet(earth, previousState.earthPos, 1);
        animatePlanet(mars, previousState.marsPos, 1);
        animatePlanet(jupiter, previousState.jupiterPos, 1);
        animatePlanet(moon, previousState.moonPos, 1);
        animatePlanet(atmosphere, previousState.atmospherePos, 1);
        animatePlanet(clouds, previousState.cloudsPos, 1);
        
        // Restaurar títulos si es necesario
        document.getElementById('infoDetailed').style.display = 'none';
        document.getElementById('backButton').style.display = 'none';
        leftPlanetTitle.textContent = "Venus";
        title.innerHTML = "PLANET <br> EARTH";
        rightPlanetTitle.textContent = "Mars";
    }
}



const title = document.getElementById("title");
const leftPlanetTitle = document.getElementById("leftPlanet");
const rightPlanetTitle = document.getElementById("rightPlanet");

// Variables para el raycaster y el mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Función para detectar el clic en los planetas
function onMouseClick(event) {
    // Calculamos la posición del mouse en el espacio de la pantalla (-1 a 1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Actualizamos el raycaster con la cámara y la posición del mouse
    raycaster.ray.origin.copy(camera.position); // El origen del rayo es la posición de la cámara
    raycaster.ray.direction.set(mouse.x, mouse.y, 0.5).unproject(camera).sub(raycaster.ray.origin).normalize(); // Dirección del rayo

    // Usamos intersectObjects para encontrar las intersecciones
    const intersects = raycaster.intersectObjects([mercury,earth, venus, mars,jupiter,saturn,uranus,neptune]);  // Revisamos intersecciones con los tres planetas

    // Verificamos si se ha producido alguna intersección
    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        console.log("Clic en el planeta: ", intersectedObject.name);

        // Lógica para mover y cambiar el tamaño de los planetas
        switch (intersectedObject.name) {
            case 'mercury':
                activePlanet = 'mercury';
                leftPlanetTitle.textContent = "Neptune"
                title.innerHTML = "PLANET <br> MERCURY"
                rightPlanetTitle.textContent = "Venus"  
                // Venus al tamaño base, los demás planetas más pequeños
                animatePlanet(uranus, new THREE.Vector3(-9, 0, 0), 1); 
                animatePlanet(neptune, new THREE.Vector3(-4.5, 0, 0), 1); 
                
                animatePlanet(mercury, new THREE.Vector3(0, -1.8, 0), 2.5); 
                
                animatePlanet(venus, new THREE.Vector3(4.5, 0, 0), 1);  
                
                animatePlanet(earth, new THREE.Vector3(9, 0, 0), 0.3); 
                animatePlanet(atmosphere, new THREE.Vector3(9, 0, 0), 0.3); 
                animatePlanet(clouds, new THREE.Vector3(9, 0, 0), 0.3); 
                animatePlanet(moon, new THREE.Vector3(9, 0, 0), 0.3); 
                break;
            case 'venus':
                activePlanet = 'venus';
                // Add mercury to the scene
                leftPlanetTitle.textContent = "Mercury"
                title.innerHTML = "PLANET <br> VENUS"
                rightPlanetTitle.textContent = "Earth"  
                // Venus al tamaño base, los demás planetas más pequeños
                animatePlanet(neptune, new THREE.Vector3(-9, 0, 0), 1); 
                animatePlanet(mercury, new THREE.Vector3(-4.5, 0, 0), 1); 

                animatePlanet(venus, new THREE.Vector3(0, -1.8, 0), 3); 

                animatePlanet(earth, new THREE.Vector3(4.5, 0, 0), 0.3); 
                animatePlanet(atmosphere, new THREE.Vector3(4.5, 0, 0), 0.3); 
                animatePlanet(clouds, new THREE.Vector3(4.5, 0, 0), 0.3); 
                animatePlanet(moon, new THREE.Vector3(4.5, 0, 0), 0.3); 

                animatePlanet(mars, new THREE.Vector3(9, 0, 0), 1);  
                break;
            case 'earth':
                if (activePlanet == 'earth') {
                    saveState();  // Guardamos el estado actual antes de hacer la animación
                    
                    // Mostrar el botón de regresar solo cuando la vista esté en la Tierra
                    document.getElementById('infoDetailed').style.display = 'flex';  
                    document.getElementById('backButton').style.display = 'block';

        
                    // Realizas las animaciones para mostrar los planetas en su nueva posición
                    animatePlanet(venus, new THREE.Vector3(-9, 0, 0), 1);
                    leftPlanetTitle.textContent = "";
                    title.innerHTML = "";
                    animatePlanet(moon, new THREE.Vector3(0, 0.8, 0), 1);
                    animatePlanet(earth, new THREE.Vector3(0, 0, 0), 1);  
                    animatePlanet(atmosphere, new THREE.Vector3(0, 0, 0), 1);
                    animatePlanet(clouds, new THREE.Vector3(0, 0, 0), 1);  
                    rightPlanetTitle.textContent = ""; 
                    animatePlanet(mars, new THREE.Vector3(9, 0, 0), 1);
                } else {
                    activePlanet = 'earth';
                
                    leftPlanetTitle.textContent = "Venus";
                    title.innerHTML = "PLANET <br> EARTH";
                    rightPlanetTitle.textContent = "Mars";       
                
                    // Los planetas vuelven a su tamaño base y las animaciones se hacen en su lugar
                    animatePlanet(mercury, new THREE.Vector3(-9, 0, 0), 1);  
                    animatePlanet(venus, new THREE.Vector3(-4.5, 0, 0), 1);  
                
                    animatePlanet(moon, new THREE.Vector3(0, -1, 0), 1); 
                    animatePlanet(earth, new THREE.Vector3(0, -1.8, 0), 1);  
                    animatePlanet(atmosphere, new THREE.Vector3(0, -1.8, 0), 1); 
                    animatePlanet(clouds, new THREE.Vector3(0, -1.8, 0), 1);  
                
                    animatePlanet(mars, new THREE.Vector3(4.5, 0, 0), 1);  
                    animatePlanet(jupiter, new THREE.Vector3(9, 0, 0), 1);
                } 
                break;
            case 'mars':
                activePlanet = 'mars';
                leftPlanetTitle.textContent = "Earth"
                title.innerHTML = "PLANET <br> MARS"
                rightPlanetTitle.textContent = "Jupiter"  
                // Marte al tamaño base, los demás planetas más pequeños
                animatePlanet(venus, new THREE.Vector3(-9, 0, 0), 1);  

                animatePlanet(earth, new THREE.Vector3(-4.5, 0, 0), 0.3);  
                animatePlanet(atmosphere, new THREE.Vector3(-4.5, 0, 0), 0.3); 
                animatePlanet(clouds, new THREE.Vector3(-4.5, 0, 0), 0.3); 
                animatePlanet(moon, new THREE.Vector3(-4.5, 0, 0), 0.3); 

                animatePlanet(mars, new THREE.Vector3(0, -1.8, 0), 2.5); 
                
                animatePlanet(jupiter, new THREE.Vector3(4.5, 0, 0), 1); 

                animatePlanet(saturn, new THREE.Vector3(9, 0, 0), 1); 
                animatePlanet(saturnRings, new THREE.Vector3(9, 0, 0), 1); 
                break;
            case 'jupiter':
                activePlanet = 'jupiter';
                leftPlanetTitle.textContent = "Mars"
                title.innerHTML = "PLANET <br> JUPITER"
                rightPlanetTitle.textContent = "Saturn"  
                // Marte al tamaño base, los demás planetas más pequeños
                animatePlanet(earth, new THREE.Vector3(-9, 0, 0), 0.3);  
                animatePlanet(atmosphere, new THREE.Vector3(-9, 0, 0), 0.3); 
                animatePlanet(clouds, new THREE.Vector3(-9, 0, 0), 0.3); 
                animatePlanet(moon, new THREE.Vector3(-9, 0, 0), 0.3); 

                animatePlanet(mars, new THREE.Vector3(-4.5, 0, 0), 1); 
                
                animatePlanet(jupiter, new THREE.Vector3(0, -1.8, 0), 4.5); 
                
                animatePlanet(saturn, new THREE.Vector3(4.5, 0, 0), 1);
                animatePlanet(saturnRings, new THREE.Vector3(4.5, 0, 0), 1); 

                animatePlanet(uranus, new THREE.Vector3(9, 0, 0), 1); 
                break;
            case 'saturn':
                activePlanet = 'saturn';
                leftPlanetTitle.textContent = " ..         Jupiter"
                title.innerHTML = "PLANET <br> SATURN"
                rightPlanetTitle.textContent = "Uranus"  
                // Marte al tamaño base, los demás planetas más pequeños
                animatePlanet(mars, new THREE.Vector3(-9, 0, 0), 1);
                
                animatePlanet(jupiter, new THREE.Vector3(-4.5, 0, 0), 1);
                
                animatePlanet(saturn, new THREE.Vector3(0, -1.8, 0), 4.2);
                animatePlanet(saturnRings, new THREE.Vector3(0, -1.8, 0), 4.5); 
                
                animatePlanet(uranus, new THREE.Vector3(4.5, 0, 0), 1);

                animatePlanet(neptune, new THREE.Vector3(9, 0, 0), 1);

                break;
            case 'uranus':
                activePlanet = 'uranus';
                leftPlanetTitle.textContent = ".Saturn"
                title.innerHTML = "PLANET <br> URANUS"
                rightPlanetTitle.textContent = "Neptune"  
                // Marte al tamaño base, los demás planetas más pequeños
                animatePlanet(jupiter, new THREE.Vector3(-9, 0, 0), 1); 
                
                animatePlanet(saturn, new THREE.Vector3(-4.5, 0, 0), 1); 
                animatePlanet(saturnRings, new THREE.Vector3(-4.5, 0, 0), 1); 
                
                animatePlanet(uranus, new THREE.Vector3(0, -1.8, 0), 3.9); 
                
                animatePlanet(neptune, new THREE.Vector3(4.5, 0, 0), 1);

                animatePlanet(mercury, new THREE.Vector3(9, 0, 0), 1);

                break;
            case 'neptune':
                activePlanet = 'neptune';
                leftPlanetTitle.textContent = "Uranus"
                title.innerHTML = "PLANET <br> NEPTUNE"
                rightPlanetTitle.textContent = "Mercury"  
                // Marte al tamaño base, los demás planetas más pequeños
                animatePlanet(saturn, new THREE.Vector3(-9, 0, 0), 1); 
                animatePlanet(saturnRings, new THREE.Vector3(-9, 0, 0), 1); 
                
                animatePlanet(uranus, new THREE.Vector3(-4.5, 0, 0), 1); 
                
                animatePlanet(neptune, new THREE.Vector3(0, -1.8, 0), 3.9); 
                
                animatePlanet(mercury, new THREE.Vector3(4.5, 0, 0), 1);
                animatePlanet(venus, new THREE.Vector3(9, 0, 0), 1);

                break;
    }
    } else {
        console.log("No se ha hecho clic en ningún planeta.");
    }
}

// Función para animar el movimiento y cambio de escala de un planeta
function animatePlanet(planet, newPosition, targetScale) {
    const duration = 1; // Duración en segundos
    const startPosition = planet.position.clone();
    const targetPosition = newPosition;
    const startScale = planet.scale.clone();
    const targetScaleVector = new THREE.Vector3(targetScale, targetScale, targetScale);  // Tamaño objetivo

    let elapsedTime = 0;

    function updatePlanetPosition() {
        elapsedTime += 0.016;  // Asumiendo 60fps
        const t = Math.min(elapsedTime / duration, 1);

        // Interpolamos posición y escala
        planet.position.lerpVectors(startPosition, targetPosition, t);
        planet.scale.lerpVectors(startScale, targetScaleVector, t);
        

        if (t < 1) {
            requestAnimationFrame(updatePlanetPosition);
        }
    }

    updatePlanetPosition();
}

// Añadir un escuchador de eventos de clic
window.addEventListener('click', onMouseClick, false);