import {THREE} from '../vendor';
// import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {GodRaysEffect, RenderPass, EffectPass, EffectComposer} from 'postprocessing';
import noise from './utils/perlinNoise';
import { SceneUtils } from 'three';


const GLTFLoader = require('./gltfloader');

const width = window.innerWidth;
const height = window.innerHeight;

const scene = new THREE.Scene();
// const camera = new THREE.OrthographicCamera(width/-2,width/2,height/-2,height/2,1,1000);
const camera = new THREE.PerspectiveCamera(80,width/height,1,1000);
// scene.add(camera)

camera.position.z = 570;
camera.position.y = 0;
camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width,height);
const canvas = document.getElementById('canvas');
canvas.appendChild(renderer.domElement);

let mouseX;
let mouseY;

document.body.addEventListener('mousemove', moveNest);

function moveNest(e){
  mouseX = THREE.Math.mapLinear(e.clientX,0,width,-width/2,width/2);
  mouseY = THREE.Math.mapLinear(e.clientY,0,height,height/2,-height/2);
  return mouseX, mouseY;
}

// THE NEST
const loader = new THREE.GLTFLoader();
loader.load('../objects/theNest20.glb', (gltf) => {
  let nest = gltf.scene.children[0];

  nest.rotation.x = Math.PI/2
  // nest.rotation.z = Math.PI/2
  nest.scale.x = 32
  nest.scale.y = 32
  nest.scale.z = 32
  nest.position.y = -200
  nest.position.z = -10
  scene.add(gltf.scene)
  console.log(nest)
  renderer.render(scene,camera)
})

// MOON
const moonGeo = new THREE.CircleGeometry(50,30);
const moonMat = new THREE.MeshBasicMaterial({color: 0x777788});
const circle = new THREE.Mesh( moonGeo, moonMat);
circle.position.set(250, 182, -20);
scene.add(circle)

// GODRAYS
let godraysEffect = new GodRaysEffect(camera, circle,{
  resolutionScale: .7,
  density: 3,
  decay: .97,
  weight: .2,
  samples: 320,
  blur: false
});

let renderPass = new RenderPass(scene,camera);
let effectPass = new EffectPass(camera,godraysEffect);
effectPass.renderToScreen = true;

let composer = new EffectComposer(renderer);
composer.addPass(renderPass);
composer.addPass(effectPass);

// STARS
const particle = {
  scale: 1,
  radius: null,
  theta: null,

  create: function(){
    let obj = Object.create(this);
    let geometry = new THREE.PlaneBufferGeometry(1,1);
    let material = new THREE.MeshBasicMaterial({ color: 0xffffff});
    obj.mesh = new THREE.Mesh(geometry,material);
    obj.radius = Math.random() * (width/2 + 50);
    obj.scale = Math.random()*(2.6-.3) + .3;
    obj.theta = Math.random()*Math.PI*2;
    obj.mesh.position.x = Math.cos(obj.theta) * obj.radius;
    obj.mesh.position.y = Math.sin(obj.theta) * obj.radius;
    obj.mesh.position.z = -30;
    obj.mesh.scale.x = obj.scale;
    obj.mesh.scale.y = obj.scale;
    return obj;
  },
  update: function(delta){
    this.theta += delta;
    this.mesh.position.x = Math.cos(this.theta) * this.radius;
    this.mesh.position.y = Math.sin(this.theta) * this.radius;
  }
}

// NEST LIGHTS
const lightColor = new THREE.Color(0xffffaa)
const penumbra = .4;
const light1 = new THREE.SpotLight(lightColor,2);
light1.penumbra = penumbra;
light1.position.x = 288;
light1.position.y = -96;
light1.position.z = -1;
light1.target = new THREE.Object3D();
light1.target.position.set(light1.position.x+5,light1.position.y-50, light1.position.z);
scene.add(light1.target);
scene.add(light1);

const light2 = new THREE.SpotLight(lightColor,2);
light2.penumbra = penumbra;
light2.position.x = 525;
light2.position.y = -44;
light2.position.z = -1;
light2.target = new THREE.Object3D();
light2.target.position.set(light2.position.x+7,light2.position.y-50, light2.position.z);
scene.add(light2.target);
scene.add(light2);

const light3 = new THREE.SpotLight(lightColor,2);
light3.penumbra = penumbra;
light3.position.x = 828;
light3.position.y = 32;
light3.position.z = -1;
light3.target = new THREE.Object3D();
light3.target.position.set(light3.position.x+9,light3.position.y-50, light3.position.z);
scene.add(light3.target);
scene.add(light3);

// AMBIENT LIGHT
const light = new THREE.AmbientLight(0xffeeee, .3);
scene.add(light)

// DIRECTIONAL LIGHT
// const directional = new THREE.DirectionalLight(0xffffff,2);
// directional.position.set(200,0,300)
// directional.target = new THREE.Object3D();
// directional.target.position.set(-100,0,-10)
// scene.add(directional.target)
// scene.add(directional);

// HEADLIGHTS
// const headlight1 = new THREE.SpotLight(0xbbbbff,1.3);
// headlight1.penumbra = .4
// headlight1.angle = Math.PI/6
// headlight1.position.set(0,-300,800);
// headlight1.target = new THREE.Object3D();
// scene.add(headlight1.target);
// scene.add(headlight1);

// const headlight2 = new THREE.SpotLight(0xbbbbff,1.3);
// headlight2.penumbra = .4
// headlight2.angle = Math.PI/6
// headlight2.position.set(600,-300,800);
// headlight2.target = new THREE.Object3D();
// scene.add(headlight2.target);
// scene.add(headlight2);

// SHOOTING STARS
const shootingStar = {
  scale: 1,

  create: function(){
    let obj = Object.create(this);
    let geometry = new THREE.PointGeometry()
  }
}

const stars = [];
function createSky(amount){
  for(let i = 0; i < amount; i++){
    let star = particle.create();
    stars.push(star);
    scene.add(star.mesh);
  }
}

createSky(1000)

let delta = 0;
let pdelta = 0;
let p,q,r;
const animate = function () {
  requestAnimationFrame( animate );
  delta = 0.00011;

  // LIGHT FLICKER
  pdelta += 0.07
  p = noise(pdelta);
  q = noise(pdelta*.7);
  r = noise(pdelta*.5);
  light1.intensity = THREE.Math.mapLinear(p,0,1,4.5,6);
  light2.intensity = THREE.Math.mapLinear(q,0,1,4.5,7);
  light3.intensity = THREE.Math.mapLinear(r,0,1,4.5,8);

  // headlight1.target.position.set(mouseX,mouseY,-10);
  // headlight2.target.position.set(mouseX+400,mouseY,-10);

  let moonMaxHeight = 690;
  circle.position.y += (circle.position.y >= moonMaxHeight-200) ? 0 : (moonMaxHeight-circle.position.y)*.0002;

  stars.forEach(s => {
    s.update(delta);
  });
  composer.render(0.1);
	// renderer.render( scene, camera );
};

animate();