import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

var canvas;
var renderer;
var camera;
var scene;
var material;
var lightDir;
var lightAmb;
var lightHem;
var loader;
var moon;
var sun;

function setUpScene() {
  canvas = document.querySelector('#canvas');
  renderer = new THREE.WebGLRenderer({antialias: true, canvas});
  renderer.shadowMap.enabled = true;

  renderer.setSize(700, 450);

  const fov = 45; //45
  const aspect = 2;
  const near = 0.1;
  const far = 100;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 65); //0, 10, 20

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 10, 0); //0, 0, 0
  controls.update();

  function updateCamera() {
    camera.updateProjectionMatrix();
  }
   
  const guiMM = new GUI();
  guiMM.add(camera, 'fov', 1, 180).onChange(updateCamera);
  const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'fov', 0.1);
  guiMM.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
  guiMM.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera);
  guiMM.domElement.style.position = 'absolute';
  guiMM.domElement.style.top = '5px';
  guiMM.domElement.style.left = '1060px';

  scene = new THREE.Scene();
  loader = new THREE.TextureLoader();
  renderer.render(scene, camera);

  const cameraPole = new THREE.Object3D();
  scene.add(cameraPole);
  cameraPole.add(camera);

  material = [
    new THREE.MeshPhongMaterial({map: makeTexture('img/wall.jpg')}),
    new THREE.MeshPhongMaterial({map: makeTexture('img/wall.jpg')}),
    new THREE.MeshPhongMaterial({map: makeTexture('img/wall.jpg')}),
    new THREE.MeshPhongMaterial({map: makeTexture('img/wall.jpg')}),
    new THREE.MeshPhongMaterial({map: makeTexture('img/wall.jpg')}),
    new THREE.MeshPhongMaterial({map: makeTexture('img/wall.jpg')})
  ];

  {
    const planeSize = 100;
    const texture = loader.load('img/ground.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.receiveShadow = true;
    mesh.rotation.x = Math.PI * -.5;
    mesh.position.set(0, -5, 0);
    scene.add(mesh);
  }
  {
    const near = 0.5;
    const far = 150;
    const color = 0xffffff;
    scene.fog = new THREE.Fog(color, near, far);
    scene.background = new THREE.Color(color);
    const guiFog = new GUI();
    const fogGUIHelper = new FogGUIHelper(scene.fog);
    guiFog.add(fogGUIHelper, 'near', near, far).listen();
    guiFog.add(fogGUIHelper, 'far', near, far).listen();
    guiFog.domElement.style.position = 'absolute';
    guiFog.domElement.style.top = '310px';
    guiFog.domElement.style.left = '1060px';
  }
  {
    const sphereRadius = 4;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const loaderMoon = new THREE.TextureLoader();
    const textureMoon = loaderMoon.load('img/moon.jpg');
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const sphereMat = new THREE.MeshPhongMaterial({map: textureMoon});
    moon = new THREE.Mesh(sphereGeo, sphereMat);
    moon.castShadow = true;
    moon.receiveShadow = true;
    moon.position.set(-40, 30, -20);
    scene.add(moon);
  }
  {
    const sphereRadius2 = 4;
    const sphereWidthDivisions2 = 32;
    const sphereHeightDivisions2 = 16;
    const loaderSun = new THREE.TextureLoader();
    const textureSun = loaderSun.load('img/sun.jpg');
    const sphereGeo2 = new THREE.SphereGeometry(sphereRadius2, sphereWidthDivisions2, sphereHeightDivisions2);
    const sphereMat2 = new THREE.MeshPhongMaterial({map: textureSun});
    sun = new THREE.Mesh(sphereGeo2, sphereMat2);
    sun.castShadow = true;
    sun.receiveShadow = true;
    sun.position.set(40, 30, -20);
    scene.add(sun);
  }
  {
    const colorDir = 0xFFFFFF;
    const intensityDir = 3;
    lightDir = new THREE.DirectionalLight(colorDir, intensityDir);
    lightDir.castShadow = true;
    lightDir.position.set(-1, 2, 4);
    scene.add(lightDir);
  }
  {
    const colorAmb = 0x000000;
    const intensityAmb = 1;
    lightAmb = new THREE.AmbientLight(colorAmb, intensityAmb);
    scene.add(lightAmb);
    const guiAmbColor = new GUI();
    guiAmbColor.addColor(new ColorGUIHelper(lightAmb, 'color'), 'value').name('color');
    guiAmbColor.add(lightAmb, 'intensity', 0, 5, 0.01);
    guiAmbColor.domElement.style.position = 'absolute';
    guiAmbColor.domElement.style.top = '115px';
    guiAmbColor.domElement.style.left = '1060px';
  }
  {
    const skyColor = 0x000000;
    const groundColor = 0x000000;
    const intensityHem = 1;
    lightHem = new THREE.HemisphereLight(skyColor, groundColor, intensityHem);
    scene.add(lightHem);
    const guiHemColor = new GUI();
    guiHemColor.addColor(new ColorGUIHelper(lightHem, 'color'), 'value').name('skyColor');
    guiHemColor.addColor(new ColorGUIHelper(lightHem, 'groundColor'), 'value').name('groundColor');
    guiHemColor.add(lightHem, 'intensity', 0, 5, 0.01);
    guiHemColor.domElement.style.position = 'absolute';
    guiHemColor.domElement.style.top = '200px';
    guiHemColor.domElement.style.left = '1060px';
  }
  {
    const mtlLoader = new MTLLoader();
		mtlLoader.load('img/plant.mtl', (mtl) => {
			mtl.preload();
			const objLoader = new OBJLoader();
			objLoader.setMaterials(mtl);
			objLoader.load('img/plant.obj', (root) => {
        root.position.set(0, -5, 30);
			  scene.add(root);
			});
		});
  }
  {
    const loaderSky = new THREE.TextureLoader();
    const texture = loaderSky.load(
      'img/sky.jpg',
    () => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      scene.background = texture;
    });
  }
}

var objects = [];

function makeTexture(file) {
  var texture = loader.load(file);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeBoxInstance(geometry, position, texture, clr = 0x44aa88, materials = material) {
  if (texture) {
    materials = new THREE.MeshPhongMaterial({map: texture});
  }
  else if (clr != 0) {
    materials = new THREE.MeshPhongMaterial({color: clr});
  }
  var objGeometry = new THREE.BoxGeometry(geometry[0], geometry[1], geometry[2]);
  var object = new THREE.Mesh(objGeometry, materials);
  object.castShadow = true;
  object.receiveShadow = true;
  scene.add(object);
  object.position.set(position[0], position[1], position[2]);
  return object;
}

function makeCylinderInstance(geometry, position, texture, clr = 0x44aa88, materials = material) {
  if (texture) {
    materials = new THREE.MeshPhongMaterial({map: texture});
  }
  else if (clr != 0) {
    materials = new THREE.MeshPhongMaterial({color: clr});
  }
  var objGeometry = new THREE.CylinderGeometry(geometry[0], geometry[1], geometry[2], geometry[3]);
  var object = new THREE.Mesh(objGeometry, materials);
  object.castShadow = true;
  object.receiveShadow = true;
  scene.add(object);
  object.position.set(position[0], position[1], position[2]);
  return object;
}

const pickPosition = {x: 0, y: 0};

function getCanvasRelativePosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * canvas.width  / rect.width,
    y: (event.clientY - rect.top ) * canvas.height / rect.height,
  };
}
 
function setPickPosition(event) {
  const pos = getCanvasRelativePosition(event);
  pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
  pickPosition.y = (pos.y / canvas.height) * -2 + 1;
}
 
function clearPickPosition() {
  pickPosition.x = -100000;
  pickPosition.y = -100000;
}

function pick() {
  clearPickPosition();
  window.addEventListener('mousemove', setPickPosition);
  window.addEventListener('mouseout', clearPickPosition);
  window.addEventListener('mouseleave', clearPickPosition);

  window.addEventListener('touchstart', (event) => {
    event.preventDefault();
    setPickPosition(event.touches[0]);
  }, {passive: false});
   
  window.addEventListener('touchmove', (event) => {
    setPickPosition(event.touches[0]);
  });
   
  window.addEventListener('touchend', clearPickPosition);
}

const ray = new THREE.Raycaster();
const pickHelper = new PickHelper(ray);
function render(time) {
  time *= 0.001;

  const speed = 0.5;
  const rot = time * speed;
  moon.rotation.y = rot;
  sun.rotation.y = rot;
 
  pickHelper.pick(pickPosition, scene, camera, time);
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function main() {
  setUpScene();

  objects = [
    makeBoxInstance([16, 4, 7], [-8, -2.99, -30], 0, '#8AC'),
    makeBoxInstance([16, 4, 7], [8, -2.99, -30], 0, 0xff2600),
    makeBoxInstance([16, 4, 7], [0, 1, -30], 0, 0xffffff),
    makeBoxInstance([16, 4, 7], [-16, 1, -30], 0, 0xff2600),
    makeBoxInstance([16, 4, 7], [16, 1, -30], 0, '#8AC'),
    makeBoxInstance([12, 4, 7], [24, 5, -30], 0, 0xff2600),
    makeBoxInstance([12, 4, 7], [-24, 5, -30], 0, '#8AC'),

    makeCylinderInstance([1, 1, 2, 32], [0, 2.75, -28.5], 0, 0xffffff),
    makeCylinderInstance([1, 1, 2, 32], [0, 2.75, -31.5], 0, 0xffffff),
    makeCylinderInstance([1, 1, 2, 32], [3, 2.75, -28.5], 0, 0xffffff),
    makeCylinderInstance([1, 1, 2, 32], [3, 2.75, -31.5], 0, 0xffffff),
    makeCylinderInstance([1, 1, 2, 32], [6, 2.75, -28.5], 0, 0xffffff),
    makeCylinderInstance([1, 1, 2, 32], [6, 2.75, -31.5], 0, 0xffffff),
    makeCylinderInstance([1, 1, 2, 32], [-3, 2.75, -28.5], 0, 0xffffff),
    makeCylinderInstance([1, 1, 2, 32], [-3, 2.75, -31.5], 0, 0xffffff),
    makeCylinderInstance([1, 1, 2, 32], [-6, 2.75, -28.5], 0, 0xffffff),
    makeCylinderInstance([1, 1, 2, 32], [-6, 2.75, -31.5], 0, 0xffffff),

    makeCylinderInstance([1, 1, 2, 32], [10, 2.75, -28.5], 0, '#8AC'),
    makeCylinderInstance([1, 1, 2, 32], [10, 2.75, -31.5], 0, '#8AC'),
    makeCylinderInstance([1, 1, 2, 32], [13, 2.75, -28.5], 0, '#8AC'),
    makeCylinderInstance([1, 1, 2, 32], [13, 2.75, -31.5], 0, '#8AC'),
    makeCylinderInstance([1, 1, 2, 32], [16, 2.75, -28.5], 0, '#8AC'),
    makeCylinderInstance([1, 1, 2, 32], [16, 2.75, -31.5], 0, '#8AC'),

    makeCylinderInstance([1, 1, 2, 32], [-10, 2.75, -28.5], 0, 0xff2600),
    makeCylinderInstance([1, 1, 2, 32], [-10, 2.75, -31.5], 0, 0xff2600),
    makeCylinderInstance([1, 1, 2, 32], [-13, 2.75, -28.5], 0, 0xff2600),
    makeCylinderInstance([1, 1, 2, 32], [-13, 2.75, -31.5], 0, 0xff2600),
    makeCylinderInstance([1, 1, 2, 32], [-16, 2.75, -28.5], 0, 0xff2600),
    makeCylinderInstance([1, 1, 2, 32], [-16, 2.75, -31.5], 0, 0xff2600),

    makeCylinderInstance([1, 1, 2, 32], [-20, 6.75, -28.5], 0, '#8AC'),
    makeCylinderInstance([1, 1, 2, 32], [-20, 6.75, -31.5], 0, '#8AC'),
    makeCylinderInstance([1, 1, 2, 32], [-22.65, 6.75, -28.5], 0, '#8AC'),
    makeCylinderInstance([1, 1, 2, 32], [-22.65, 6.75, -31.5], 0, '#8AC'),
    makeCylinderInstance([1, 1, 2, 32], [-25.4, 6.75, -28.5], 0, '#8AC'),
    makeCylinderInstance([1, 1, 2, 32], [-25.4, 6.75, -31.5], 0, '#8AC'),
    makeCylinderInstance([1, 1, 2, 32], [-28, 6.75, -28.5], 0, '#8AC'),
    makeCylinderInstance([1, 1, 2, 32], [-28, 6.75, -31.5], 0, '#8AC'),

    makeCylinderInstance([1, 1, 2, 32], [20, 6.75, -28.5], 0, 0xff2600),
    makeCylinderInstance([1, 1, 2, 32], [20, 6.75, -31.5], 0, 0xff2600),
    makeCylinderInstance([1, 1, 2, 32], [22.65, 6.75, -28.5], 0, 0xff2600),
    makeCylinderInstance([1, 1, 2, 32], [22.65, 6.75, -31.5], 0, 0xff2600),
    makeCylinderInstance([1, 1, 2, 32], [25.4, 6.75, -28.5], 0, 0xff2600),
    makeCylinderInstance([1, 1, 2, 32], [25.4, 6.75, -31.5], 0, 0xff2600),
    makeCylinderInstance([1, 1, 2, 32], [28, 6.75, -28.5], 0, 0xff2600),
    makeCylinderInstance([1, 1, 2, 32], [28, 6.75, -31.5], 0, 0xff2600),
  ];

  pick();
  requestAnimationFrame(render);
}

main();