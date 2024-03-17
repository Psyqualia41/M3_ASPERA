import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';
import { GLTFLoader } from './GLTFLoader.js';

// Scene setup
const scene = new THREE.Scene();
let stars, starGeo;

lighting();
particles();

// Create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 6400); // Adjusted near plane value
camera.position.set(2000, 1000, -800); // Adjusted camera position

// Create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x76d5fc);
document.body.appendChild(renderer.domElement);

// Create Particle
function particles() {
    const points = [];

    for (let i = 0; i < 10000; i++) {
        let star = new THREE.Vector3(
            Math.random() * 6400 - 4000,
            Math.random() * 6400 - 4000,
            Math.random() * 6400 - 4000
        );
        points.push(star);
    }

    starGeo = new THREE.BufferGeometry().setFromPoints(points);

    let sprite = new THREE.TextureLoader().load("Assets/Texture/star.png");
    let starMaterial = new THREE.PointsMaterial({
        color: 352628,
        size: 4,
        map: sprite,
    });

    stars = new THREE.Points(starGeo, starMaterial);
    scene.add(stars);
}

// Load the sandfloor texture
const textureLoader = new THREE.TextureLoader();
const sandFloorTexture = textureLoader.load('Assets/Texture/sandfloor.jpg');

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight.position.set(1, 1, 1).normalize(); // Normalize directional light position
scene.add(directionalLight);

// Load GLB model
const loader = new GLTFLoader();
loader.load(
    './Assets/model/Building/oldbuilding.glb',
    function (gltf) {
        // Called when the model is loaded
        const model = gltf.scene;

        // Keep the scale factor unchanged
        const scaleFactor = 200; // Adjust this value as needed
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Rotate the model to the left
        model.rotation.y = Math.PI / 2; // Rotate 90 degrees (PI/2 radians) to the left

        // Move the model to the left
        const leftOffset = -1500; // Adjust this value as needed
        model.position.x += leftOffset;

        // Move the model higher
        const heightOffset = 250; // Adjust this value as needed
        model.position.y += heightOffset;

        scene.add(model);
    },
    function (xhr) {
        // Called while loading is progressing
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    function (error) {
        // Called if there's an error loading the model
        console.error('An error happened', error);
    }
);


// Load another GLB model
loader.load(
  './Assets/model/Building/oldbackground.glb',
  function (gltf) {
      // Called when the model is loaded
      const model2 = gltf.scene;

      // Keep the scale factor unchanged
      const scaleFactor = 5; // Adjust this value as needed
      model2.scale.set(scaleFactor, scaleFactor, scaleFactor);

      // Position the model
      model2.position.set(10, 250, -1500); // Adjust the position as needed

      scene.add(model2);
  },
  function (xhr) {
      // Called while loading is progressing
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
  },
  function (error) {
      // Called if there's an error loading the model
      console.error('An error happened', error);
  }
);

// Load another GLB model
loader.load(
  './Assets/model/Building/oldhouse.glb',
  function (gltf) {
      // Called when the model is loaded
      const model3 = gltf.scene;

      // Keep the scale factor unchanged
      const scaleFactor = 300; // Adjust this value as needed
      model3.scale.set(scaleFactor, scaleFactor, scaleFactor);

      // Rotate the model if needed
      model3.rotation.y = -Math.PI / 2; // Rotate 45 degrees (PI/4 radians) to the left

      // Position the model
      model3.position.set(1750, 3500, 5); // Adjust the position as needed

      scene.add(model3);
  },
  function (xhr) {
      // Called while loading is progressing
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
  },
  function (error) {
      // Called if there's an error loading the model
      console.error('An error happened', error);
  }
);

// Lighting for particle
function lighting() {
    const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 3);
    scene.add(light);

    const spotLight = new THREE.SpotLight(0xffffff, 3);
    spotLight.position.set(0, 0, 15);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;
    scene.add(spotLight);
}

// Animate Particle
function animateParticles() {
    starGeo.verticesNeedUpdate = true;
    stars.position.y -= 1;

    if (stars.position.y < -300) {
        stars.position.y = 100;
    }
}

// Create floor
const floorSize = 3000; // Adjust the size as needed
const floorGeometry = new THREE.BoxGeometry(floorSize, floorSize, 50);
const floorMaterial = new THREE.MeshStandardMaterial({ map: sandFloorTexture });
const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
floorMesh.rotation.x = -Math.PI / 2; // Rotate to lay flat
scene.add(floorMesh);

// Load the StoneBrickfloor texture
const rampTexture = textureLoader.load('Assets/Texture/StoneBrickfloor.jpg');

// Create ramp geometry
const rampWidth = 750; // Width of the ramp
const rampHeight = 250; // Height of the ramp
const rampLength = 1000; // Length of the ramp

const rampGeometry = new THREE.PlaneGeometry(rampWidth, rampLength);
const rampMaterial = new THREE.MeshStandardMaterial({ map: rampTexture }); // Use the StoneBrickfloor texture
const rampMesh = new THREE.Mesh(rampGeometry, rampMaterial);

// Position the ramp above the floor
rampMesh.position.set(0, rampHeight / 2, 0); // Position the ramp above the floor

// Calculate the angle for the incline
const inclineAngle = Math.atan(rampHeight / (rampLength / 1));

// Rotate the ramp to make it inclined
rampMesh.rotation.x = -Math.PI / 2 + inclineAngle; // Rotate around the X-axis to make it lie flat initially and add the incline angle

scene.add(rampMesh);


// Create platform geometry
const platformWidth = floorSize; // Increased width of the platform
const platformHeight = 250; // Increased height of the platform
const platformDepth = 1500; // Increased depth of the platform

const platformGeometry = new THREE.BoxGeometry(platformWidth, platformHeight, platformDepth);
const platformMaterial = new THREE.MeshStandardMaterial({ map: sandFloorTexture }); // Brown color
const platformMesh = new THREE.Mesh(platformGeometry, platformMaterial);

// Position the platform at the opposite end of the ramp
platformMesh.position.set((rampWidth + platformWidth) / 2, rampHeight / 2, -rampLength / 2); // Adjust the position as needed
scene.add(platformMesh);

// Move the platform higher
const platformHeightOffset = 5; // Adjust the offset as needed
platformMesh.position.y += platformHeightOffset;

// Move the platform to the center
const platformXOffset = -(rampWidth + platformWidth) / 2; // Negative value to move left
platformMesh.position.x += platformXOffset;

// Move the platform backward
const platformZOffset = 600; // Adjust the offset as needed
platformMesh.position.z -= platformZOffset;


// Create boxes in the middle of the platform
const boxWidth = 200; // Width of the box
const boxHeight = 200; // Height of the box
const boxDepth = 200; // Depth of the box

const numBoxes = 5; // Number of boxes to create
const spaceBetweenBoxes = 0; // Reduce space between each box

const boxTexture = new THREE.TextureLoader().load('Assets/model/crate.png'); // Load PNG texture

for (let i = 0; i < numBoxes; i++) {
    const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const boxMaterial = new THREE.MeshStandardMaterial({ map: boxTexture }); // Use PNG texture
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

    // Position the box on top of the platform
    boxMesh.position.copy(platformMesh.position);
    boxMesh.position.y = platformMesh.position.y + (platformHeight / 2) + (boxHeight / 2); // Adjust y position to be on top of the platform

    // Offset each box horizontally
    boxMesh.position.x += (i - (numBoxes - 1) / 2) * (boxWidth + spaceBetweenBoxes);

    scene.add(boxMesh);
}

// Create a new platform geometry
const newPlatformWidth = floorSize; // Width of the new platform
const newPlatformHeight = 250; // Height of the new platform
const newPlatformDepth = 1500; // Depth of the new platform

const newPlatformGeometry = new THREE.BoxGeometry(newPlatformWidth, newPlatformHeight, newPlatformDepth);
const newPlatformMaterial = new THREE.MeshStandardMaterial({ map: sandFloorTexture }); // Use the same material as the first platform
const newPlatformMesh = new THREE.Mesh(newPlatformGeometry, newPlatformMaterial);

// Position the new platform to the left side and lower it down
newPlatformMesh.position.copy(platformMesh.position);
newPlatformMesh.position.x -= (rampWidth + newPlatformWidth) / 2; // Adjust the x position to the left side of the first platform
newPlatformMesh.position.y -= newPlatformHeight / 15; // Lower the platform down

// Rotate the new platform to the left  
newPlatformMesh.rotation.y = -Math.PI / 2;

// Move the new platform to the left
const newPlatformXOffset = 750; // Adjust the offset as needed
newPlatformMesh.position.x += newPlatformXOffset;

// Adjust the z position to move the platform forward
newPlatformMesh.position.z += 1500; // Move the platform 1500 units forward

// Add the new platform to the scene
scene.add(newPlatformMesh);

// Load the texture for the wall
const wallTexture = new THREE.TextureLoader().load('Assets/Texture/CrustyWall.jpg');

// Create small walls for the new platform
const newWallHeight = 253; // Reduced height of the walls
const newWallThickness = 100; // Thickness of the walls

// Define the position of the wall relative to the new platform
const newWallPosition = {
    x: newPlatformMesh.position.x + newPlatformWidth / 4 - newWallThickness / 10, // Right side
    z: newPlatformMesh.position.z, // Same z position as the new platform
};

// Create the wall for the new platform
const newWallGeometry = new THREE.BoxGeometry(newWallThickness, newWallHeight, newPlatformWidth); // Set depth to newPlatformWidth
const newWallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture }); // Use texture as material
const newWallMesh = new THREE.Mesh(newWallGeometry, newWallMaterial);

// Position the wall on the right side of the new platform
newWallMesh.position.set(
    newWallPosition.x,
    newWallHeight / 2, // Adjusted height
    newWallPosition.z
);

// Add the wall to the scene
scene.add(newWallMesh);


// Add the wall to the scene
scene.add(newWallMesh);

// Load texture for the bars and pillars
const barTexture = new THREE.TextureLoader().load('Assets/Texture/cage.jpg');

// Create material using the texture
const barMaterial = new THREE.MeshStandardMaterial({ map: barTexture });

// Define bar dimensions
const numBars = 3; // Number of bars
const barWidth = newPlatformDepth / numBars * 0.75; // Reduced width of each bar
const barHeight = 30; // Height of the bars
const barDepth = newWallThickness; // Depth of the bars

// Define the number of sets of bars and pillars
const numSets = 3; // Number of sets

// Define how much to move the bars and pillars down
const moveDownAmount = 125; // Adjust this value as needed

// Calculate the gap between bars
const barGap = (newPlatformDepth - numBars * barWidth) / (numBars + 40);

// Loop to create multiple sets of bars and pillars
for (let j = 0; j < numSets; j++) {
    // Calculate the starting position for the bars at the end of the newPlatform
    const startZ = newPlatformMesh.position.z + newPlatformDepth / 2 - barWidth / 2 - newWallThickness / 2;
    
    // Loop to create multiple bars and pillars
    for (let i = 0; i < numBars; i++) {
        // Create bar geometry
        const barGeometry = new THREE.BoxGeometry(barDepth, barHeight, barWidth);
        
        // Create a mesh with the bar geometry and the loaded material
        const barMesh = new THREE.Mesh(barGeometry, barMaterial);
        
        // Calculate the position of the bar
        const barPositionX = newWallPosition.x;
        const barPositionY = newWallMesh.position.y + newWallHeight + barHeight / 2 - moveDownAmount + (j * barHeight * 3); // Adjusted y position
        const barPositionZ = startZ + barGap + i * (barWidth + barGap);
        
        // Position the bar on top of the wall
        barMesh.position.set(barPositionX, barPositionY, barPositionZ);
        
        // Add the bar to the scene
        scene.add(barMesh);
        
        // Create pillar geometry
        const pillarGeometry = new THREE.BoxGeometry(barDepth, barHeight * 3, barDepth);
        const pillarMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White color
        const pillarMesh = new THREE.Mesh(pillarGeometry, pillarMaterial);
        
        // Calculate the position of the pillar
        const pillarPositionX = newWallPosition.x;
        const pillarPositionY = newWallMesh.position.y + newWallHeight + barHeight * 3 / 2 - moveDownAmount + (j * barHeight * 3); // Adjusted y position
        const pillarPositionZ = startZ + barGap + i * (barWidth + barGap);
        
        // Position the pillar on top of the wall
        pillarMesh.position.set(pillarPositionX, pillarPositionY, pillarPositionZ);
        
        // Add the pillar to the scene
        scene.add(pillarMesh);
    }
}


// Define the amount to move the duplicates to the right
const rightOffset = 2300; // Adjust this value as needed



// Clone the new platform mesh
const newPlatformMeshDuplicate = newPlatformMesh.clone();

// Define the amount to move the duplicates to the left
const leftOffset = 1500; // Adjust this value as needed

// Clone the new wall mesh
const newWallMeshDuplicate = newWallMesh.clone();

// Adjust the position of the duplicate new wall to place it slightly to the left of the platform
newWallMeshDuplicate.position.x -= leftOffset; // Move to the left

// Add the duplicate new wall to the scene
scene.add(newWallMeshDuplicate);

// Adjust the position of the duplicate new platform and wall to place them slightly to the right of the platform
newPlatformMeshDuplicate.position.x += rightOffset; // Move to the right
newWallMeshDuplicate.position.x += rightOffset; // Move to the right

// Add the duplicate new platform and wall to the scene
scene.add(newPlatformMeshDuplicate);
scene.add(newWallMeshDuplicate);



// Add orbital camera control
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

// Render loop
function animate() {
    animateParticles();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
