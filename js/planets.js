// Configuración básica de Three.js
const container = document.getElementById('centerPlanet');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Hacer transparente el fondo del canvas

// Global variables
let leftPlanet = "Venus";
let activePlanet;
let rightPlanet = "Mars";
let previousState = null;  // Almacenará el estado anterior

//
// JSON de datos de los planetas
const planetsData = {
    "mercury": {
      "composition": {
        "Oxygen": "42%",
        "Sodium": "29%",
        "Hydrogen": "22%",
        "Helium": "6%"
      },
      "description": "Mercury is the smallest planet in the Solar System and the closest to the Sun. It has no atmosphere to retain heat, resulting in extreme temperature variations. The surface is heavily cratered, resembling Earth’s Moon. It completes one orbit around the Sun in just 88 Earth days. Mercury has a very weak magnetic field compared to Earth. Despite its proximity to the Sun, ice has been found in permanently shadowed craters. The planet’s core is large, making up about 60% of its total mass. Mercury’s surface is covered in long cliffs, evidence of planetary contraction. It rotates very slowly, completing one full rotation in 59 Earth days. The planet lacks weather systems due to its thin exosphere. Sunlight is seven times stronger on Mercury than on Earth. Spacecraft such as Mariner 10 and MESSENGER have provided detailed images. Mercury’s lack of an atmosphere makes it vulnerable to asteroid impacts. The planet's thin exosphere is mostly made of atoms blasted off its surface by solar winds."
    },
    "venus": {
      "composition": {
        "Carbon Dioxide": "96.5%",
        "Nitrogen": "3.5%",
        "Sulfur Dioxide": "0.015%",
        "Other": "0.035%"
      },
      "description": "Venus is the hottest planet due to its thick atmosphere trapping heat. Its surface is covered by volcanic plains, with over 1,600 major volcanoes. A day on Venus is longer than its year, taking 243 Earth days to rotate once. The planet spins in the opposite direction of most planets, including Earth. Venus’ dense clouds make it the brightest object in the sky after the Sun and Moon. Its atmospheric pressure is 92 times that of Earth’s. Scientists believe Venus may have had oceans billions of years ago. The planet has massive, highland plateaus such as Ishtar Terra and Aphrodite Terra. Venus’ thick clouds create a runaway greenhouse effect, making it extremely hot. Wind speeds in Venus’ upper atmosphere reach 360 km/h. The planet's surface temperature remains stable, even at night. Venus’ sulfuric acid clouds reflect most of the sunlight that hits them. The Venera landers sent by the Soviet Union were the first to land on Venus. Because of its slow rotation, a day on Venus lasts longer than a year."
    },
    "earth": {
      "composition": {
        "Nitrogen": "78%",
        "Oxygen": "21%",
        "Argon": "1%",
        "Other": "1%"
      },
      "description": "Earth is the only known planet to support life, with a rich atmosphere of oxygen and nitrogen. It has one natural satellite, the Moon, which stabilizes Earth's rotation. The planet’s magnetic field protects it from harmful solar and cosmic radiation. Earth’s surface is 71% covered by water, making it unique in the Solar System. It has a diverse climate, ranging from icy poles to tropical regions. The planet orbits the Sun at an average speed of 107,000 km/h. Earth’s atmosphere plays a key role in maintaining a stable climate. Earth has active plate tectonics that cause earthquakes and volcanic eruptions. The ozone layer protects the planet from harmful ultraviolet radiation. Earth’s biosphere has existed for over 3.5 billion years. Human civilization has drastically altered Earth's environment. The planet has experienced multiple mass extinctions in its history. The hydrological cycle moves water between the oceans, atmosphere, and land. Earth's axial tilt is responsible for the changing seasons."
    },
    "mars": {
      "composition": {
        "Carbon Dioxide": "95%",
        "Nitrogen": "2.7%",
        "Argon": "1.6%",
        "Oxygen": "0.13%"
      },
      "description": "Mars is known as the Red Planet due to its iron-rich surface. It has the tallest volcano in the Solar System, Olympus Mons, which stands 22 km high. Mars’ thin atmosphere makes it a cold, dry desert with frequent dust storms. Scientists believe liquid water once existed on Mars, raising the possibility of past life. The planet has two small, irregularly shaped moons: Phobos and Deimos. Mars has seasons similar to Earth, but they last twice as long due to its longer orbit. Future missions aim to explore the possibility of human colonization on Mars. The Valles Marineris canyon system is over 4,000 km long, much larger than the Grand Canyon. Mars has signs of ancient river valleys, deltas, and lakebeds. Some Martian soil samples show traces of frozen water beneath the surface. Dust storms on Mars can cover the entire planet for weeks. Mars’ polar ice caps contain frozen carbon dioxide and water ice. The planet’s low atmospheric pressure makes liquid water unstable on the surface. NASA’s Perseverance rover is currently exploring Mars for signs of ancient life."
    },
    "jupiter": {
      "composition": {
        "Hydrogen": "89.8%",
        "Helium": "10.2%",
        "Methane": "0.3%",
        "Other": "0.1%"
      },
      "description": "Jupiter is the largest planet in the Solar System, with a mass over 300 times Earth's. Its Great Red Spot is a massive storm that has raged for centuries. The planet has at least 79 known moons, including Ganymede, the largest in the Solar System. Jupiter’s intense gravity affects the orbits of nearby celestial bodies. Its powerful magnetic field is the strongest of any planet. Jupiter radiates more heat than it receives from the Sun. Its rapid rotation causes extreme weather patterns and massive cloud bands. The planet has a faint ring system mostly made of dust. Jupiter’s atmosphere is mostly hydrogen and helium, similar to the Sun. Strong jet streams create its distinctive colored cloud bands. Some of its moons may have subsurface oceans capable of supporting life. Jupiter played a key role in shaping the early Solar System. The Galileo probe provided the first detailed data about Jupiter’s atmosphere. The planet’s magnetosphere extends millions of kilometers into space."
    },
    "saturn": {
      "composition": {
        "Hydrogen": "96%",
        "Helium": "3%",
        "Methane": "0.3%",
        "Other": "0.7%"
      },
      "description": "Saturn is famous for its bright rings, composed of countless ice and rock particles. It is the second-largest planet and has a fast rotation, completing a day in about 10.7 hours. Saturn has at least 83 moons, with Titan being the largest and having a thick atmosphere. Despite its size, Saturn is the least dense planet and could float in water. Its rings are constantly changing, with some parts appearing to disappear over time. The planet has powerful storms, including a hexagonal storm at its north pole. Saturn's atmosphere is mostly hydrogen and helium, similar to Jupiter’s. The Cassini mission provided the most detailed observations of Saturn. Enceladus, one of Saturn’s moons, has water jets that may indicate an underground ocean. The planet's strong winds can reach speeds of 1,800 km/h. Its rings span over 280,000 km but are only 10 meters thick. Saturn’s gravity is strong enough to slightly compress the planet’s shape. The planet emits more heat than it receives due to helium sinking in its atmosphere."
    },
    "uranus": {
    "composition": {
      "Hydrogen": "83%",
      "Helium": "15%",
      "Methane": "2%",
      "Other": "0.1%"
    },
    "description": "Uranus rotates on its side, making it unique among the planets in the Solar System. It appears blue-green due to methane in its atmosphere absorbing red light. The planet has faint rings that were discovered in 1977. Uranus has extreme seasons, with each lasting around 42 Earth years. Its core is much colder compared to Jupiter and Saturn, despite being an ice giant. Uranus’ winds can reach speeds of over 900 km/h. The planet has 27 known moons, with Miranda displaying dramatic cliffs and valleys. Uranus was the first planet discovered using a telescope in 1781. The planet’s rings are made of dark particles, making them hard to see. Uranus emits very little heat compared to other gas giants. It is the least dense of the giant planets, with a rocky core and icy mantle. Voyager 2 is the only spacecraft to have visited Uranus. The planet’s magnetic field is tilted at a different angle than its rotation. Uranus has an unusual orbit that makes it appear to roll around the Sun."
  },
  "neptune": {
    "composition": {
      "Hydrogen": "80%",
      "Helium": "19%",
      "Methane": "1%",
      "Other": "0.1%"
    },
    "description": "Neptune is the farthest planet from the Sun and has the strongest winds in the Solar System. Its deep blue color comes from methane in its atmosphere. Neptune has a massive storm called the Great Dark Spot, similar to Jupiter’s Great Red Spot. The planet has 14 known moons, with Triton orbiting in the opposite direction of Neptune’s rotation. Neptune’s gravity is stronger than Earth’s despite being much farther from the Sun. It takes 165 Earth years to complete one orbit around the Sun. The planet was discovered in 1846 using mathematical predictions before being observed. Neptune’s atmosphere has layers of clouds and storms that can last for years. Its moon Triton is the coldest known object in the Solar System. Voyager 2 provided the only close-up images of Neptune. The planet radiates more heat than it receives from the Sun. Neptune’s winds can reach speeds of over 2,000 km/h, the fastest in the Solar System. Its rings are faint and consist mostly of dust and ice particles. Neptune’s interior is believed to contain water, ammonia, and methane ices."
  }
};

// Función para actualizar la información del planeta
function updatePlanetInfo(planetName) {
    const planetInfo = planetsData[planetName.toLowerCase()];

    if (!planetInfo) {
        console.warn(`No se encontró información para el planeta '${planetName}'.`);
        return;
    }

    // Actualizar la composición atmosférica
    const compositionDivs = document.querySelectorAll("#planetInfo div .circle");
    const compositionKeys = Object.keys(planetInfo.composition);
    
    compositionDivs.forEach((div, index) => {
        if (compositionKeys[index]) {
            div.querySelector("p").textContent = compositionKeys[index];
            div.querySelector("span").textContent = planetInfo.composition[compositionKeys[index]];
        }
    });
    console.log(planetInfo);
    // Actualizar la descripción
    document.querySelector("#planetInfo .infoTextPlanet").textContent = planetInfo.description;

    // Mostrar el contenedor
    document.getElementById("planetInfo").style.display = "block";
}

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // Fondo transparente
container.appendChild(renderer.domElement);

document.getElementById('backButton').addEventListener('click', function() {
    restoreState(leftPlanet, activePlanet, rightPlanet);
  });

// Obtener todos los enlaces dentro del lateralBar
const menuItems = document.querySelectorAll('#lateralBar ul li a');

const troposferaGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const troposferaMaterial = new THREE.MeshBasicMaterial({
    color: 0x00bfff, // Azul para la troposfera
    transparent: true,
    opacity: 0.5
});
const troposfera = new THREE.Mesh(troposferaGeometry, troposferaMaterial);

const estratosferaGeometry = new THREE.SphereGeometry(1.7, 32, 32);
const estratosferaMaterial = new THREE.MeshBasicMaterial({
    color: 0xff6347, // Naranja para la estratosfera
    transparent: true,
    opacity: 0.5
});
const estratosfera = new THREE.Mesh(estratosferaGeometry, estratosferaMaterial);

const mesosferaGeometry = new THREE.SphereGeometry(2, 32, 32);
const mesosferaMaterial = new THREE.MeshBasicMaterial({
    color: 0xff4500, // Rojo para la mesosfera
    transparent: true,
    opacity: 0.5
});
const mesosfera = new THREE.Mesh(mesosferaGeometry, mesosferaMaterial);

const termosferaGeometry = new THREE.SphereGeometry(2.6, 32, 32);
const termosferaMaterial = new THREE.MeshBasicMaterial({
    color: 0x8b0000, // Rojo oscuro para la termosfera
    transparent: true,
    opacity: 0.5
});
const termosfera = new THREE.Mesh(termosferaGeometry, termosferaMaterial);

const exosferaGeometry = new THREE.SphereGeometry(3.9, 32, 32);
const exosferaMaterial = new THREE.MeshBasicMaterial({
    color: 0x00008b, // Azul oscuro para la exósfera
    transparent: true,
    opacity: 0.5
});
const exosfera = new THREE.Mesh(exosferaGeometry, exosferaMaterial);

// Declaramos layerLabels como variable global para acceder en ambas funciones
const layerLabels = [];
const layerObjects = [troposfera, estratosfera, mesosfera, termosfera, exosfera]; // Lista de capas

function removeAtmosphere() {
    // Ocultar las capas en lugar de eliminarlas para evitar perder sus referencias
    layerObjects.forEach(layer => {
        layer.visible = false;  // Simplemente ocultamos las capas en vez de removerlas
    });

    // Ocultar y eliminar las etiquetas HTML
    layerLabels.forEach(({ element }) => {
        element.remove(); // Elimina la etiqueta del DOM
    });

    layerLabels.length = 0; // Vaciar el array de etiquetas
}

function addAtmosphere() {
    // Volver a mostrar las capas en la escena
    removeAtmosphere();

    layerObjects.forEach(layer => {
        layer.visible = true;  // Hacemos visibles nuevamente las capas
        scene.add(layer);
    });
    // Limpiar cualquier etiqueta residual antes de agregar nuevas

    // Lista de nombres de las capas
    const layerNames = ['Troposfera', 'Estratosfera', 'Mesósfera', 'Termósfera', 'Exósfera'];

    // Crear etiquetas para cada capa
    layerObjects.forEach((layer, index) => {
        const label = document.createElement('div');
        label.className = 'label';
        label.textContent = layerNames[index];

        // **Estilización para visibilidad**
        label.style.position = 'absolute';
        label.style.color = 'white';
        label.style.background = 'none';
        label.style.padding = '5px 10px';
        label.style.borderRadius = '8px';
        label.style.fontSize = '14px';
        label.style.fontFamily = 'Arial, sans-serif';
        label.style.textAlign = 'center';
        label.style.pointerEvents = 'none'; // Evita interferencias con clics
        label.style.transform = 'translate(-50%, 50%)';
        label.style.zIndex = '10';

        document.body.appendChild(label);
        layerLabels.push({ element: label, object: layer });
    });

    // **Actualizar la posición de las etiquetas en la pantalla**
    function updateLabels() {
        const vector = new THREE.Vector3();
        layerLabels.forEach(({ element, object }) => {
            vector.copy(object.position);

            // **Colocar el texto en el borde superior de la esfera**
            const sphereRadius = object.geometry.parameters.radius;
            vector.y += sphereRadius + 0.05;  // Ajuste para evitar superposición

            vector.project(camera);

            const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const y = -(vector.y * 0.5 - 0.5) * window.innerHeight;

            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
        });
    }

    // **Animación de la escena**
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        updateLabels();  // Mantener los textos actualizados
    }

    animate();

    // **Posicionar las capas progresivamente en el eje Y**
    animatePlanet(troposfera, new THREE.Vector3(0, -2, 0), 1);
    animatePlanet(estratosfera, new THREE.Vector3(0, -2, 0), 1);
    animatePlanet(mesosfera, new THREE.Vector3(0, -2, 0), 1);
    animatePlanet(termosfera, new THREE.Vector3(0, -2, 0), 1);
    animatePlanet(exosfera, new THREE.Vector3(0, -2, 0), 1);
}


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
            removeAtmosphere();
            document.getElementById('planetInfo').style.display = 'none';
            if (activePlanet == 'earth') {
                animatePlanet(moon, new THREE.Vector3(0, 0, 0), 1); 
                animatePlanet(earth, new THREE.Vector3(0, 0, 0), 1);  
                animatePlanet(atmosphere, new THREE.Vector3(0, 0, 0), 1); 
                animatePlanet(clouds, new THREE.Vector3(0, 0, 0), 1);  
            } else if (activePlanet == 'saturn') {
                animatePlanet(saturn, new THREE.Vector3(0, 0, 0), 3); 
                animatePlanet(particles, new THREE.Vector3(0, 0, 0), 3);  
            } else {
                planet = convertToObject(activePlanet);
                animatePlanet(planet, new THREE.Vector3(0, 0, 0), 3); 
            }
             
        }
        else if (targetId === 'info') {
            updatePlanetInfo(activePlanet);
            removeAtmosphere();
            // Mostrar el div "planetInfo"
            document.getElementById('planetInfo').style.display = 'block';
            if (activePlanet == 'earth') {
                animatePlanet(moon, new THREE.Vector3(-2, 0.8, 0), 1);
                animatePlanet(earth, new THREE.Vector3(-2, 0, 0), 1);  
                animatePlanet(atmosphere, new THREE.Vector3(-2, 0, 0), 1);
                animatePlanet(clouds, new THREE.Vector3(-2, 0, 0), 1);  
            } else if (activePlanet == 'saturn') {
                animatePlanet(saturn, new THREE.Vector3(-2, 0, 0), 3); 
                animatePlanet(particles, new THREE.Vector3(-2, 0, 0), 3);  
            } else {
                planet = convertToObject(activePlanet);
                animatePlanet(planet, new THREE.Vector3(-2, 0, 0), 3); 
            }  
        } 
        else if (targetId === 'atmosphere'){
            // Crear una capa para las diferentes capas de la atmósfera
            if (activePlanet == 'earth') {
                addAtmosphere();
                animatePlanet(moon, new THREE.Vector3(0, -10, 0), 1); 
                animatePlanet(earth, new THREE.Vector3(0, -2, 0), 1);  
                animatePlanet(atmosphere, new THREE.Vector3(0, -2, 0), 1); 
                animatePlanet(clouds, new THREE.Vector3(0, -2, 0), 1);   
            } else if (activePlanet == 'saturn') {
                animatePlanet(saturn, new THREE.Vector3(-2, 0, 0), 3); 
                animatePlanet(particles, new THREE.Vector3(-2, 0, 0), 3);  
            } else {
                planet = convertToObject(activePlanet);
                animatePlanet(planet, new THREE.Vector3(-2, 0, 0), 3); 
            } 
            // Ocultar el div "planetInfo" si no se está en la sección "INFO"
            document.getElementById('planetInfo').style.display = 'none';
            
            
        }
        else if (targetId === 'moons'){
            removeAtmosphere();
            if (activePlanet == 'earth') {
                animatePlanet(moon, new THREE.Vector3(0, 0, 0), 5); 
                animatePlanet(earth, new THREE.Vector3(0, -10, 0), 1);  
                animatePlanet(atmosphere, new THREE.Vector3(0, -10, 0), 1); 
                animatePlanet(clouds, new THREE.Vector3(0, -10, 0), 1);  
            }
            // Ocultar el div "planetInfo" si no se está en la sección "INFO"
            document.getElementById('planetInfo').style.display = 'none';
            
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

// Lunas de marte
const fobosMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('../img/phobos_texture.jpg'),
    bumpMap: textureLoader.load('../img/phobos_texture.jpg'),
    bumpScale: 0.03,
});
const fobos = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), fobosMaterial);
fobos.position.set(4.5, -1, 0);
fobos.name = "fobos";
scene.add(fobos);

const deimosMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('../img/deimos_texture.jpg'),
    bumpMap: textureLoader.load('../img/deimos_texture.jpg'),
    bumpScale: 0.03,
});
const deimos = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), deimosMaterial);
deimos.position.set(4.5, -1, 0);
deimos.name = "deimos";
scene.add(deimos);


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

const particlesGeometry = new THREE.BufferGeometry();
const particleCount = 9000;
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

// Definir una paleta de colores similar a los anillos de Saturno
const colorPalette = [
    new THREE.Color(0xd4af37), // Dorado
    new THREE.Color(0xc2b280), // Beige
    new THREE.Color(0x8d5524), // Marrón claro
    new THREE.Color(0xf5deb3)  // Trigo
];

for (let i = 0; i < particleCount; i++) {
    const radius = THREE.MathUtils.randFloat(0.6, 0.8);
    const angle = THREE.MathUtils.randFloat(0, Math.PI * 2);
    positions[i * 3] = radius * Math.cos(angle);
    positions[i * 3 + 1] = THREE.MathUtils.randFloat(-0.02, 0.02);
    positions[i * 3 + 2] = radius * Math.sin(angle);

    // Asignar un color aleatorio de la paleta
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particlesMaterial = new THREE.PointsMaterial({
    vertexColors: true, // Habilitar colores por vértice
    size: 0.015,
    transparent: true
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
particles.position.set(9,0,0);
scene.add(particles);


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
let angle2 = 0; 

//
activePlanet = 'earth';


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
    mars.rotation.y += 0.002; 
    fobos.rotation.y += 0.002;
    fobos.rotation.x += 0.002;
    deimos.rotation.y += 0.0008;
    deimos.rotation.x += 0.0008; // Rotación de Marte
    jupiter.rotation.y += 0.0005;
    saturn.rotation.y += 0.0005;
    particles.rotation.z += 0.00001;
    uranus.rotation.y += 0.0004;
    neptune.rotation.y += 0.0002;

    angle += 0.005;
    angle2 += 0.002; // Controlar la velocidad de la órbita

    // Hacer que la Luna orbite alrededor de la Tierra sin mover la Tierra
    let earthX = earth.position.x;
    let earthZ = earth.position.z;
    let marsX = mars.position.x;
    let marsZ = mars.position.z;
    
    // El radio de la Tierra es obtenido de la geometría de la esfera
    let earthRadius = earth.geometry.parameters.radius;
    let marsRadius = mars.geometry.parameters.radius;
    
    // La Luna orbita a una distancia de 2 unidades del centro de la Tierra, pero con el radio de la Tierra añadido
    let earthOrbitRadius = earthRadius + 0.2;  
    let marsOrbitRadius;

    if (activePlanet == 'mars') {
        marsOrbitRadius = marsRadius + 0.7; 
    } else {
        marsOrbitRadius = marsRadius + 0.4;
    }
      
    
    // Calculamos la posición de la Luna en función del ángulo de la órbita
    moon.position.x = earthX + earthOrbitRadius * Math.cos(angle);  
    moon.position.z = earthZ + earthOrbitRadius * Math.sin(angle);

    // Phobos
    fobos.position.x = marsX + marsOrbitRadius * Math.cos(angle);  
    fobos.position.z = marsZ + marsOrbitRadius * Math.sin(angle);
    deimos.position.x = marsX + marsOrbitRadius * Math.cos(angle2);  
    deimos.position.z = marsZ + marsOrbitRadius * Math.sin(angle2);

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


// Función para guardar el estado actual
function saveState() {
    previousState = {
        mercuryPos: mercury.position.clone(),
        venusPos: venus.position.clone(),
        earthPos: earth.position.clone(),
        marsPos: mars.position.clone(),
        fobosPos: fobos.position.clone(),
        deimosPos: deimos.position.clone(),
        jupiterPos: jupiter.position.clone(),
        moonPos: moon.position.clone(),
        atmospherePos: atmosphere.position.clone(),
        cloudsPos: clouds.position.clone(),
        
        // Añadir planetas que faltan
        saturnPos: saturn.position.clone(),
        particlesPos: particles.position.clone(),
        uranusPos: uranus.position.clone(),
        neptunePos: neptune.position.clone(),
    };
    
}

function restoreState(leftPlanet, actualPlanet, rightPlanet) {
    if (previousState) {
        removeAtmosphere(); 
        animatePlanet(mercury, previousState.mercuryPos, 1);
        animatePlanet(venus, previousState.venusPos, 1);
        animatePlanet(mars, previousState.marsPos, 1);
        animatePlanet(fobos, previousState.fobosPos, 1);
        animatePlanet(deimos, previousState.deimosPos, 1);
        animatePlanet(jupiter, previousState.jupiterPos, 1);
        animatePlanet(saturn, previousState.saturnPos, 1);
        animatePlanet(particles, previousState.particlesPos, 1);
        animatePlanet(uranus, previousState.uranusPos, 1);
        animatePlanet(neptune, previousState.neptunePos, 1);

        if (actualPlanet == 'earth') {
            animatePlanet(earth, previousState.earthPos, 1);
            animatePlanet(moon, previousState.moonPos, 1);
            animatePlanet(atmosphere, previousState.atmospherePos, 1);
            animatePlanet(clouds, previousState.cloudsPos, 1);
        } else {
            animatePlanet(earth, previousState.earthPos, 0.3);
            animatePlanet(moon, previousState.moonPos, 0.3);
            animatePlanet(atmosphere, previousState.atmospherePos, 0.3);
            animatePlanet(clouds, previousState.cloudsPos, 0.3);
        }

        planet = convertToObject(actualPlanet);
        scale =  getPlanetScale(actualPlanet);
        animatePlanet(planet, new THREE.Vector3(0, -1.8, 0), scale);
        if (planet == saturn) {
            animatePlanet(particles, new THREE.Vector3(0, -1, 0), scale);
        }
        
        // Restaurar títulos si es necesario
        document.getElementById('infoDetailed').style.display = 'none';
        document.getElementById('backButton').style.display = 'none';
        leftPlanetTitle.textContent = capitalizeFirstLetter(leftPlanet);
        title.innerHTML = "PLANET <br>" + toUpperCaseText(actualPlanet);
        rightPlanetTitle.textContent = capitalizeFirstLetter(rightPlanet);
    }
}

function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function toUpperCaseText(text) {
    return text.toUpperCase();
}

const layout = {
    mercury: {
        left: [neptune, [-4.5, 0, 0], 1],
        center: [mercury, [0, -1.8, 0], 2.5],
        right: [venus, [4.5, 0, 0], 1]
    },
    venus: {
        left: [mercury, [-4.5, 0, 0], 1],
        center: [venus, [0, -1.8, 0], 3],
        right: [
            [earth, [4.5, 0, 0], 0.3], 
            [atmosphere, [4.5, 0, 0], 0.3],
            [clouds, [4.5, 0, 0], 0.3],
            [moon, [4.5, 0, 0], 0.3]
        ]
    },
    earth: {
        left: [venus, [-4.5, 0, 0], 1],
        center: [
            [earth, [0, -1.8, 0], 1], 
            [atmosphere, [0, -1.8, 0], 1],
            [clouds, [0, -1.8, 0], 1],
            [moon, [0, -1.8, 0], 1]
        ],
        right: [mars, [4.5, 0, 0], 1],
    },
    mars: {
        left: [
            [earth, [0, 0, 0], 0.3], 
            [atmosphere, [0, 0, 0], 0.3],
            [clouds, [0, 0, 0], 0.3],
            [moon, [0, 0, 0], 0.3]
        ],
        center: [mars, [0, -1.8, 0], 2.5],
        right: [jupiter, [4.5, 0, 0], 1],
    },
    jupiter	: {
        left: [mars, [-4.5, 0, 0], 1],
        center: [jupiter, [0, -1.8, 0], 4.5],
        right: [
            [saturn, [4.5, 0, 0], 1], 
            [particles, [4.5, 0, 0], 1]
        ],
    },
    saturn : {
        left: [jupiter, [-4.5, 0, 0], 1],
        center: [
            [saturn, [0, -1.8, 0], 4.2], 
            [particles, [0, -1.8, 0], 4.5]
        ],
        right: [uranus, [4.5, 0, 0], 1],
    },
    uranus : {
        left: [ 
            [saturn, [-4.5, 0, 0], 1], 
            [particles, [-4.5, 0, 0], 1]
        ],
        center: [uranus, [0, -1.8, 0], 3.9],
        right: [neptune, [4.5, 0, 0], 1],
    },
    neptune : {
        left: [uranus, [-4.5, 0, 0], 1],
        center: [neptune, [0, -1.8, 0], 3.9],
        right: [mercury, [4.5, 0, 0], 1],
    },
    
};


const title = document.getElementById("title");
const leftPlanetTitle = document.getElementById("leftPlanet");
const rightPlanetTitle = document.getElementById("rightPlanet");

// Variables para el raycaster y el mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function namePlanets(){
    leftPlanetTitle.textContent = capitalizeFirstLetter(leftPlanet);
    title.innerHTML = "PLANET <br>" + toUpperCaseText(activePlanet);
    rightPlanetTitle.textContent = capitalizeFirstLetter(rightPlanet);
}

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
    if (intersects.length > 0 && document.getElementById('infoDetailed').style.display == 'none') {
        const intersectedObject = intersects[0].object;
        
        // Lógica para mover y cambiar el tamaño de los planetas
        switch (intersectedObject.name) {
            
            case 'mercury':
                if (activePlanet == 'mercury') {
                    saveState();
                    document.getElementById('infoDetailed').style.display = 'flex';  
                    document.getElementById('backButton').style.display = 'block';

                    // Realizas las animaciones para mostrar los planetas en su nueva posición                                      
                    animatePlanet(mercury, new THREE.Vector3(0, 0, 0), 3);
                    leftPlanetTitle.textContent = "";
                    title.innerHTML = "";
                    rightPlanetTitle.textContent = "";
                    animatePlanet(uranus, new THREE.Vector3(-9, 0, 0), 1); 
                    animatePlanet(neptune, new THREE.Vector3(-9, 0, 0), 1);                     
                    animatePlanet(venus, new THREE.Vector3(9, 0, 0), 1);  
                    animatePlanet(earth, new THREE.Vector3(9, 0, 0), 0.3); 
                    animatePlanet(atmosphere, new THREE.Vector3(9, 0, 0), 0.3); 
                    animatePlanet(clouds, new THREE.Vector3(9, 0, 0), 0.3); 
                    animatePlanet(moon, new THREE.Vector3(9, 0, 0), 0.3); 
                } else {
                    leftPlanet = neptune.name;
                    activePlanet = 'mercury';
                    rightPlanet = venus.name;
                    namePlanets();
                    
                    // Venus al tamaño base, los demás planetas más pequeños
                    animatePlanet(uranus, new THREE.Vector3(-9, 0, 0), 1); 
                    animatePlanet(neptune, new THREE.Vector3(-4.5, 0, 0), 1); 
                    
                    animatePlanet(mercury, new THREE.Vector3(0, -1.8, 0), 2.5); 
                    
                    animatePlanet(venus, new THREE.Vector3(4.5, 0, 0), 1);  
                    
                    animatePlanet(earth, new THREE.Vector3(9, 0, 0), 0.3); 
                    animatePlanet(atmosphere, new THREE.Vector3(9, 0, 0), 0.3); 
                    animatePlanet(clouds, new THREE.Vector3(9, 0, 0), 0.3); 
                    animatePlanet(moon, new THREE.Vector3(9, 0, 0), 0.3); 
                }
                
                break;
            case 'venus':
                // Add mercury to the scene
                if (activePlanet == 'venus') {
                    saveState();
                    document.getElementById('infoDetailed').style.display = 'flex';  
                    document.getElementById('backButton').style.display = 'block';
                    
                    // Realizas las animaciones para mostrar los planetas en su nueva posición                                      
                    animatePlanet(mercury, new THREE.Vector3(-9, 0, 0), 1);
                    leftPlanetTitle.textContent = "";
                    title.innerHTML = "";
                    animatePlanet(venus, new THREE.Vector3(0, 0, 0), 3);
                    rightPlanetTitle.textContent = ""; 
                    animatePlanet(moon, new THREE.Vector3(9, 0.8, 0), 1);
                    animatePlanet(earth, new THREE.Vector3(9, 0, 0), 1);  
                    animatePlanet(atmosphere, new THREE.Vector3(9, 0, 0), 1);
                    animatePlanet(clouds, new THREE.Vector3(9, 0, 0), 1);  

                } else {
                    leftPlanet = mercury.name;
                    activePlanet = 'venus';
                    rightPlanet = earth.name;
                    namePlanets();

                    animatePlanet(neptune, new THREE.Vector3(-9, 0, 0), 1); 
                    animatePlanet(mercury, new THREE.Vector3(-4.5, 0, 0), 1); 

                    animatePlanet(venus, new THREE.Vector3(0, -1.8, 0), 3); 

                    animatePlanet(earth, new THREE.Vector3(4.5, 0, 0), 0.3); 
                    animatePlanet(atmosphere, new THREE.Vector3(4.5, 0, 0), 0.3); 
                    animatePlanet(clouds, new THREE.Vector3(4.5, 0, 0), 0.3); 
                    animatePlanet(moon, new THREE.Vector3(4.5, 0, 0), 0.3); 

                    animatePlanet(mars, new THREE.Vector3(9, 0, 0), 1); 
                }

                 
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
                    leftPlanet = venus.name;
                    activePlanet = 'earth';
                    rightPlanet = mars.name;
                    namePlanets();
                
                    // Los planetas vuelven a su tamaño base y las animaciones se hacen en su lugar
                    animatePlanet(mercury, new THREE.Vector3(-9, 0, 0), 1);  
                    animatePlanet(venus, new THREE.Vector3(-4.5, 0, 0), 1);  
                
                    animatePlanet(moon, new THREE.Vector3(0, -1, 0), 1); 
                    animatePlanet(earth, new THREE.Vector3(0, -1.8, 0), 1);  
                    animatePlanet(atmosphere, new THREE.Vector3(0, -1.8, 0), 1); 
                    animatePlanet(clouds, new THREE.Vector3(0, -1.8, 0), 1);  
                
                    animatePlanet(mars, new THREE.Vector3(4.5, 0, 0), 1);
                    animatePlanet(fobos, new THREE.Vector3(4.5, -1, 0), 1); 
                    animatePlanet(deimos, new THREE.Vector3(4.5, 1, 0), 1);  
                    animatePlanet(jupiter, new THREE.Vector3(9, 0, 0), 1);
                } 
                break;
            case 'mars':
                if (activePlanet == 'mars') {
                    saveState();
                    document.getElementById('infoDetailed').style.display = 'flex';  
                    document.getElementById('backButton').style.display = 'block';
                    
                    // Realizas las animaciones para mostrar los planetas en su nueva posición                                      
                    leftPlanetTitle.textContent = "";
                    title.innerHTML = "";
                    rightPlanetTitle.textContent = ""; 
                    animatePlanet(venus, new THREE.Vector3(-9, 0, 0), 1);  
                    animatePlanet(earth, new THREE.Vector3(-9, 0, 0), 0.3);  
                    animatePlanet(atmosphere, new THREE.Vector3(-9, 0, 0), 0.3); 
                    animatePlanet(clouds, new THREE.Vector3(-9, 0, 0), 0.3); 
                    animatePlanet(moon, new THREE.Vector3(-9, 0, 0), 0.3); 

                    animatePlanet(mars, new THREE.Vector3(0, 0, 0), 2.5);
                    animatePlanet(fobos, new THREE.Vector3(0, 0.5, 0), 2); 
                    animatePlanet(deimos, new THREE.Vector3(0, 0, 0), 2);    

                    animatePlanet(jupiter, new THREE.Vector3(9, 0, 0), 1); 
                    animatePlanet(saturn, new THREE.Vector3(9, 0, 0), 1); 
                    animatePlanet(particles, new THREE.Vector3(9, 0, 0), 1);

                } else {
                    leftPlanet = earth.name;
                    activePlanet = 'mars';
                    rightPlanet = jupiter.name;
                    namePlanets();

    
                    // Marte al tamaño base, los demás planetas más pequeños
                    animatePlanet(venus, new THREE.Vector3(-9, 0, 0), 1);  

                    animatePlanet(earth, new THREE.Vector3(-4.5, 0, 0), 0.3);  
                    animatePlanet(atmosphere, new THREE.Vector3(-4.5, 0, 0), 0.3); 
                    animatePlanet(clouds, new THREE.Vector3(-4.5, 0, 0), 0.3); 
                    animatePlanet(moon, new THREE.Vector3(-4.5, 0, 0), 0.3); 

                    animatePlanet(mars, new THREE.Vector3(0, -1.8, 0), 2.5);
                    animatePlanet(fobos, new THREE.Vector3(0, -1.8, 1), 1.8); 
                    animatePlanet(deimos, new THREE.Vector3(0, -1.4, 0), 1.5);  
                    
                    animatePlanet(jupiter, new THREE.Vector3(4.5, 0, 0), 1); 

                    animatePlanet(saturn, new THREE.Vector3(9, 0, 0), 1); 
                    animatePlanet(particles, new THREE.Vector3(9, 0, 0), 1);  
                }
            
                break;
            case 'jupiter':
                if (activePlanet == 'jupiter') {
                    saveState();
                    document.getElementById('infoDetailed').style.display = 'flex';  
                    document.getElementById('backButton').style.display = 'block';
                    
                    // Realizas las animaciones para mostrar los planetas en su nueva posición                                      
                    leftPlanetTitle.textContent = "";
                    title.innerHTML = "";
                    rightPlanetTitle.textContent = ""; 
                    animatePlanet(earth, new THREE.Vector3(-9, 0, 0), 0.3);  
                    animatePlanet(atmosphere, new THREE.Vector3(-9, 0, 0), 0.3); 
                    animatePlanet(clouds, new THREE.Vector3(-9, 0, 0), 0.3); 
                    animatePlanet(moon, new THREE.Vector3(-9, 0, 0), 0.3); 

                    animatePlanet(mars, new THREE.Vector3(-9, 0, 0), 1); 
                    
                    animatePlanet(jupiter, new THREE.Vector3(0, 0, 0), 3); 
                    
                    animatePlanet(saturn, new THREE.Vector3(9, 0, 0), 1);
                    animatePlanet(particles, new THREE.Vector3(9, 0, 0), 1); 

                    animatePlanet(uranus, new THREE.Vector3(9, 0, 0), 1); 


                } else {
                    leftPlanet = mars.name;
                    activePlanet = 'jupiter';
                    rightPlanet = saturn.name;
                    namePlanets();


                    // Marte al tamaño base, los demás planetas más pequeños
                    animatePlanet(earth, new THREE.Vector3(-9, 0, 0), 0.3);  
                    animatePlanet(atmosphere, new THREE.Vector3(-9, 0, 0), 0.3); 
                    animatePlanet(clouds, new THREE.Vector3(-9, 0, 0), 0.3); 
                    animatePlanet(moon, new THREE.Vector3(-9, 0, 0), 0.3); 

                    animatePlanet(mars, new THREE.Vector3(-4.5, 0, 0), 1); 
                    
                    animatePlanet(jupiter, new THREE.Vector3(0, -1.8, 0), 4.5); 
                    
                    animatePlanet(saturn, new THREE.Vector3(4.5, 0, 0), 1);
                    animatePlanet(particles, new THREE.Vector3(4.5, 0, 0), 1); 

                    animatePlanet(uranus, new THREE.Vector3(9, 0, 0), 1);  
                }
                break;
            case 'saturn':
                if (activePlanet == 'saturn') {
                    saveState();
                    document.getElementById('infoDetailed').style.display = 'flex';  
                    document.getElementById('backButton').style.display = 'block';
                    
                    // Realizas las animaciones para mostrar los planetas en su nueva posición                                      
                    leftPlanetTitle.textContent = "";
                    title.innerHTML = "";
                    rightPlanetTitle.textContent = ""; 
                    animatePlanet(mars, new THREE.Vector3(-9, 0, 0), 1);
                    
                    animatePlanet(jupiter, new THREE.Vector3(-9, 0, 0), 1);
                    
                    animatePlanet(saturn, new THREE.Vector3(0, 0, 0), 3);
                    animatePlanet(particles, new THREE.Vector3(0, 0, 0), 3.3); 
                    
                    animatePlanet(uranus, new THREE.Vector3(9, 0, 0), 1);

                    animatePlanet(neptune, new THREE.Vector3(9, 0, 0), 1);  


                } else {
                    leftPlanet = jupiter.name;
                    activePlanet = 'saturn';
                    rightPlanet = uranus.name;
                    namePlanets();

                    // Marte al tamaño base, los demás planetas más pequeños
                    animatePlanet(mars, new THREE.Vector3(-9, 0, 0), 1);
                    
                    animatePlanet(jupiter, new THREE.Vector3(-4.5, 0, 0), 1);
                    
                    animatePlanet(saturn, new THREE.Vector3(0, -1.8, 0), 4.2);
                    animatePlanet(particles, new THREE.Vector3(0, -1, 0), 4.5); 
                    
                    animatePlanet(uranus, new THREE.Vector3(4.5, 0, 0), 1);

                    animatePlanet(neptune, new THREE.Vector3(9, 0, 0), 1);  
                }
                break;
            case 'uranus':
                if (activePlanet == 'uranus') {
                    saveState();
                    document.getElementById('infoDetailed').style.display = 'flex';  
                    document.getElementById('backButton').style.display = 'block';
                    
                    // Realizas las animaciones para mostrar los planetas en su nueva posición                                      
                    leftPlanetTitle.textContent = "";
                    title.innerHTML = "";
                    rightPlanetTitle.textContent = ""; 
                    animatePlanet(jupiter, new THREE.Vector3(-9, 0, 0), 1); 
                    
                    animatePlanet(saturn, new THREE.Vector3(-9, 0, 0), 1); 
                    animatePlanet(particles, new THREE.Vector3(-9, 0, 0), 1); 
                    
                    animatePlanet(uranus, new THREE.Vector3(0, 0, 0), 3); 
                    
                    animatePlanet(neptune, new THREE.Vector3(9, 0, 0), 1);

                    animatePlanet(mercury, new THREE.Vector3(9, 0, 0), 1); 


                } else {
                    leftPlanet = saturn.name;
                    activePlanet = 'uranus';
                    rightPlanet = neptune.name; 
                    namePlanets();          

                    // Marte al tamaño base, los demás planetas más pequeños
                    animatePlanet(jupiter, new THREE.Vector3(-9, 0, 0), 1); 
                    
                    animatePlanet(saturn, new THREE.Vector3(-4.5, 0, 0), 1); 
                    animatePlanet(particles, new THREE.Vector3(-4.5, 0, 0), 1); 
                    
                    animatePlanet(uranus, new THREE.Vector3(0, -1.8, 0), 3.9); 
                    
                    animatePlanet(neptune, new THREE.Vector3(4.5, 0, 0), 1);

                    animatePlanet(mercury, new THREE.Vector3(9, 0, 0), 1); 
                }

                break;
            case 'neptune':
                if (activePlanet == 'neptune') {
                    saveState();
                    document.getElementById('infoDetailed').style.display = 'flex';  
                    document.getElementById('backButton').style.display = 'block';
                    
                    // Realizas las animaciones para mostrar los planetas en su nueva posición                                      
                    leftPlanetTitle.textContent = "";
                    title.innerHTML = "";
                    rightPlanetTitle.textContent = ""; 
                    animatePlanet(saturn, new THREE.Vector3(-9, 0, 0), 1); 
                    animatePlanet(particles, new THREE.Vector3(-9, 0, 0), 1); 
                    
                    animatePlanet(uranus, new THREE.Vector3(-9, 0, 0), 1); 
                    
                    animatePlanet(neptune, new THREE.Vector3(0, 0, 0), 3); 
                    
                    animatePlanet(mercury, new THREE.Vector3(9, 0, 0), 1);
                    animatePlanet(venus, new THREE.Vector3(9, 0, 0), 1);


                } else {
                    leftPlanet = uranus.name;
                    activePlanet = 'neptune';
                    rightPlanet = mercury.name;
                    namePlanets();
                    
                    // Marte al tamaño base, los demás planetas más pequeños
                    animatePlanet(saturn, new THREE.Vector3(-9, 0, 0), 1); 
                    animatePlanet(particles, new THREE.Vector3(-9, 0, 0), 1); 
                    
                    animatePlanet(uranus, new THREE.Vector3(-4.5, 0, 0), 1); 
                    
                    animatePlanet(neptune, new THREE.Vector3(0, -1.8, 0), 3.9); 
                    
                    animatePlanet(mercury, new THREE.Vector3(4.5, 0, 0), 1);
                    animatePlanet(venus, new THREE.Vector3(9, 0, 0), 1);
                }

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

// Funcion para agregar un planeta a la screen
function addPlanetToScreen(planet){
    scene.add(planet)
}

function convertToObject(planetName) {
    const planets = {
        mercury: mercury,
        venus: venus,
        earth: earth,
        mars: mars,
        jupiter: jupiter,
        saturn: saturn,
        uranus: uranus,
        neptune: neptune
    };

    const planet = planets[planetName.toLowerCase()];


    if (!planet) {
        console.warn(`El planeta '${planetName}' no existe en la escena.`);
        return null;
    }

    return planet;
}

function getPlanetScale(planetName) {
    const planetScales = {
        mercury: 2.5,
        venus: 3,
        earth: 1,
        mars: 2.5,
        jupiter: 4.5,
        saturn: 4.2,
        particles: 4.5,
        uranus: 3.9,
        neptune: 3.9
    };

    const scale = planetScales[planetName.toLowerCase()];

    if (!scale) {
        console.warn(`No se encontró escala para el planeta '${planetName}'.`);
        return null;
    }

    return scale;
}



// Añadir un escuchador de eventos de clic
window.addEventListener('click', onMouseClick, false);