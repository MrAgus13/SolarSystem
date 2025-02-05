function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([mercury, venus, earth, mars, jupiter, saturn, uranus, neptune]);

    if (intersects.length === 0 || document.getElementById('infoDetailed').style.display !== 'none') return;

    const planet = intersects[0].object.name;
    console.log("Clic en el planeta:", planet);
    
    if (activePlanet === planet) {
        saveState();
        document.getElementById('infoDetailed').style.display = 'flex';
        document.getElementById('backButton').style.display = 'block';
        animatePlanetsForInfoView(planet);
    } else {
        activePlanet = planet;
        updatePlanetsPositions(planet);
    }
}

function animatePlanetsForInfoView(planet) {
    const hidePositions = new THREE.Vector3(-9, 0, 0);
    const planetsToMove = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, atmosphere, clouds, moon, particles];

    planetsToMove.forEach(p => animatePlanet(p, hidePositions, 1));
    animatePlanet(window[planet], new THREE.Vector3(0, 0, 0), 3);
}

function updatePlanetsPositions(planet) {
    const layout = {
        mercury: { left: 'neptune', right: 'venus', pos: [0, -1.8, 0], size: 2.5 },
        venus: { left: 'mercury', right: 'earth', pos: [0, -1.8, 0], size: 3 },
        earth: { left: 'venus', right: 'mars', pos: [0, -1.8, 0], size: 1 },
        mars: { left: 'earth', right: 'jupiter', pos: [0, -1.8, 0], size: 2.5 },
        jupiter: { left: 'mars', right: 'saturn', pos: [0, -1.8, 0], size: 4.5 },
        saturn: { left: 'jupiter', right: 'uranus', pos: [0, -1.8, 0], size: 4.2 },
        uranus: { left: 'saturn', right: 'neptune', pos: [0, -1.8, 0], size: 3.9 },
        neptune: { left: 'uranus', right: 'mercury', pos: [0, -1.8, 0], size: 3.9 }
    };

    leftPlanet = layout[planet].left;
    rightPlanet = layout[planet].right;
    namePlanets();

    Object.keys(layout).forEach(p => {
        const isActive = p === planet;
        const position = isActive ? layout[p].pos : [-9, 0, 0];
        const size = isActive ? layout[p].size : 1;
        animatePlanet(window[p], new THREE.Vector3(...position), size);
    });
}




function name(params) {
    
}


if (activePlanet == intersectedObject.name) {
    
}