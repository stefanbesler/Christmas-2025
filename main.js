import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0e27);
scene.fog = new THREE.Fog(0x0a0e27, 10, 50);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
// Position camera at a nice angle to view the tree
camera.position.set(8, 6, 12);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for better performance on mobile
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Controls - set target to center of tree (middle height where candles are)
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 5, 0); // Look at the middle of the tree
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 8;
controls.maxDistance = 30;
controls.maxPolarAngle = Math.PI / 2.2;
controls.update(); // Update controls to apply target
// Enable touch controls for mobile
controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN
};

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
scene.add(directionalLight);

// Ground
const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x1a3a2e,
    roughness: 0.8,
    metalness: 0.2
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
ground.receiveShadow = true;
scene.add(ground);

// Christmas Tree
function createChristmasTree() {
    const treeGroup = new THREE.Group();
    
    // Tree trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 2, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 1;
    trunk.castShadow = true;
    treeGroup.add(trunk);
    
    // Tree layers (from bottom to top)
    const layers = [
        { radius: 3, y: 2.5, color: 0x228b22 },
        { radius: 2.5, y: 4, color: 0x2d9a2d },
        { radius: 2, y: 5.5, color: 0x32cd32 },
        { radius: 1.5, y: 7, color: 0x228b22 },
        { radius: 1, y: 8.5, color: 0x2d9a2d },
    ];
    
    layers.forEach((layer, index) => {
        const coneGeometry = new THREE.ConeGeometry(layer.radius, 1.5, 8);
        const coneMaterial = new THREE.MeshStandardMaterial({ 
            color: layer.color,
            roughness: 0.7
        });
        const cone = new THREE.Mesh(coneGeometry, coneMaterial);
        cone.position.y = layer.y;
        cone.castShadow = true;
        cone.receiveShadow = true;
        treeGroup.add(cone);
    });
    
    // Star on top
    const starGeometry = new THREE.ConeGeometry(0.3, 1, 4);
    const starMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffd700,
        emissive: 0xffd700,
        emissiveIntensity: 0.5
    });
    const star = new THREE.Mesh(starGeometry, starMaterial);
    star.position.y = 9.5;
    star.rotation.y = Math.PI / 4;
    treeGroup.add(star);
    
    // Add some decorations (ornaments)
    const ornamentPositions = [
        { x: 1.5, y: 3, z: 0.5 },
        { x: -1.2, y: 4.5, z: 0.8 },
        { x: 0.8, y: 6, z: -0.6 },
        { x: -0.7, y: 7.5, z: 0.4 },
    ];
    
    ornamentPositions.forEach((pos, index) => {
        const ornamentGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const colors = [0xff0000, 0x0000ff, 0xffff00, 0xff00ff];
        const ornamentMaterial = new THREE.MeshStandardMaterial({ 
            color: colors[index % colors.length],
            emissive: colors[index % colors.length],
            emissiveIntensity: 0.3
        });
        const ornament = new THREE.Mesh(ornamentGeometry, ornamentMaterial);
        ornament.position.set(pos.x, pos.y, pos.z);
        treeGroup.add(ornament);
    });
    
    return treeGroup;
}

const tree = createChristmasTree();
scene.add(tree);

// Candles - positioned on outer edges of tree layers
// Using angles to position them around the tree circumference, slightly outside the layer radius
const candles = [];
const candleAngles = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2]; // 4 angles around the tree
const candleOffset = -0.5; // Push candles slightly outside the tree
const candlePositions = [
    { x: (3.0 + candleOffset) * Math.cos(candleAngles[0]), y: 3.2, z: (3.0 + candleOffset) * Math.sin(candleAngles[0]) },      // On first layer (radius 3)
    { x: (2.5 + candleOffset) * Math.cos(candleAngles[1]), y: 4.7, z: (2.5 + candleOffset) * Math.sin(candleAngles[1]) },     // On second layer (radius 2.5)
    { x: (2.0 + candleOffset) * Math.cos(candleAngles[2]), y: 6.2, z: (2.0 + candleOffset) * Math.sin(candleAngles[2]) },      // On third layer (radius 2)
    { x: (1.5 + candleOffset) * Math.cos(candleAngles[3]), y: 7.7, z: (1.5 + candleOffset) * Math.sin(candleAngles[3]) },     // On fourth layer (radius 1.5)
];

let litCandles = 0;

function createCandle(position) {
    const candleGroup = new THREE.Group();
    
    // Candle body
    const candleGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 16);
    const candleMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f5dc });
    const candleBody = new THREE.Mesh(candleGeometry, candleMaterial);
    candleBody.position.y = 0.15;
    candleBody.castShadow = true;
    candleGroup.add(candleBody);
    
    // Candle wick (unlit)
    const wickGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.05, 8);
    const wickMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
    const wick = new THREE.Mesh(wickGeometry, wickMaterial);
    wick.position.y = 0.35;
    candleGroup.add(wick);
    
    // Flame (initially invisible)
    const flameGeometry = new THREE.ConeGeometry(0.04, 0.1, 8);
    const flameMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff6600,
        transparent: true,
        opacity: 0
    });
    const flame = new THREE.Mesh(flameGeometry, flameMaterial);
    flame.position.y = 0.4;
    candleGroup.add(flame);
    
    // Point light (initially off)
    const candleLight = new THREE.PointLight(0xffaa00, 0, 2);
    candleLight.position.set(0, 0.4, 0);
    candleGroup.add(candleLight);
    
    candleGroup.position.set(position.x, position.y, position.z);
    candleGroup.userData = {
        isLit: false,
        flame: flame,
        light: candleLight,
        wick: wick
    };
    
    return candleGroup;
}

candlePositions.forEach(pos => {
    const candle = createCandle(pos);
    tree.add(candle);
    candles.push(candle);
});

// Update candle count display
function updateCandleCount() {
    document.getElementById('candle-count').textContent = litCandles;
    document.getElementById('total-candles').textContent = candles.length;
}

updateCandleCount();

// Raycaster for mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function handleInteraction(event) {
    // Get coordinates from either mouse or touch event
    let clientX, clientY;
    if (event.touches && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    } else {
        clientX = event.clientX;
        clientY = event.clientY;
    }
    
    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(candles, true);
    
    if (intersects.length > 0) {
        // Find the parent candle group
        let candleGroup = intersects[0].object;
        while (candleGroup && !candles.includes(candleGroup)) {
            candleGroup = candleGroup.parent;
        }
        
        if (candleGroup && !candleGroup.userData.isLit) {
            // Light the candle
            candleGroup.userData.isLit = true;
            litCandles++;
            
            // Show flame
            candleGroup.userData.flame.material.opacity = 1;
            candleGroup.userData.flame.material.color.setHex(0xff6600);
            
            // Turn on light
            candleGroup.userData.light.intensity = 1.5;
            candleGroup.userData.light.distance = 3;
            
            // Change wick color
            candleGroup.userData.wick.material.color.setHex(0xff6600);
            
            // Add particle effect
            createSparkle(candleGroup.position);
            
            updateCandleCount();
            
            // Show celebration when 4th candle is lit
            if (litCandles === 4) {
                setTimeout(() => {
                    celebrate();
                }, 500);
            }
        }
    }
}

function onMouseClick(event) {
    handleInteraction(event);
}

function onTouchStart(event) {
    // Prevent default to avoid scrolling/zooming
    event.preventDefault();
    handleInteraction(event);
}

// Sparkle effect
function createSparkle(position) {
    const sparkleGeometry = new THREE.BufferGeometry();
    const particleCount = 20;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = position.x + (Math.random() - 0.5) * 0.5;
        positions[i + 1] = position.y + Math.random() * 0.5;
        positions[i + 2] = position.z + (Math.random() - 0.5) * 0.5;
    }
    
    sparkleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const sparkleMaterial = new THREE.PointsMaterial({
        color: 0xffd700,
        size: 0.1,
        transparent: true,
        opacity: 1
    });
    
    const sparkles = new THREE.Points(sparkleGeometry, sparkleMaterial);
    scene.add(sparkles);
    
    // Animate and remove
    let opacity = 1;
    const animateSparkle = () => {
        opacity -= 0.02;
        sparkleMaterial.opacity = opacity;
        sparkles.rotation.y += 0.1;
        
        if (opacity > 0) {
            requestAnimationFrame(animateSparkle);
        } else {
            scene.remove(sparkles);
        }
    };
    animateSparkle();
}

// Celebration when all candles are lit
function celebrate() {
    const message = document.getElementById('message');
    message.style.display = 'block';
    
    // Add more sparkles
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createSparkle(new THREE.Vector3(
                (Math.random() - 0.5) * 10,
                Math.random() * 10,
                (Math.random() - 0.5) * 10
            ));
        }, i * 50);
    }
}

// Add event listeners for both mouse and touch
renderer.domElement.addEventListener('click', onMouseClick);
renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: false });

// Animate flame flickering
function animateFlames() {
    candles.forEach(candle => {
        if (candle.userData.isLit) {
            const flame = candle.userData.flame;
            const time = Date.now() * 0.005;
            
            // Flicker effect
            flame.scale.x = 1 + Math.sin(time * 10) * 0.1;
            flame.scale.z = 1 + Math.cos(time * 10) * 0.1;
            flame.rotation.z = Math.sin(time * 5) * 0.1;
            
            // Light intensity variation
            candle.userData.light.intensity = 1.5 + Math.sin(time * 8) * 0.3;
        }
    });
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    controls.update();
    animateFlames();
    
    // Rotate tree slowly
    tree.rotation.y += 0.002;
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

animate();


