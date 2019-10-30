import {THREE} from '../vendor';
// import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {GodRaysEffect, RenderPass, EffectPass, EffectComposer} from 'postprocessing';
import noise from './utils/perlinNoise';


const GLTFLoader = require('./gltfloader');

const width = window.innerWidth;
const height = window.innerHeight;

const scene = new THREE.Scene();
// const camera = new THREE.OrthographicCamera(width/-2,width/2,height/-2,height/2,1,1000);
const camera = new THREE.PerspectiveCamera(80,width/height,1,1000);
// scene.add(camera)

camera.position.z = 590;
camera.position.y = 0;
camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width,height);
const canvas = document.getElementById('canvas');
canvas.appendChild(renderer.domElement);

// THE NEST
// const loader = new THREE.TextureLoader();
// let theNestMat = loader.load('../images/nestFron3.png');
// theNestMat.minFilter = THREE.LinearFilter;
// // theNestMat.flipY = false;
// let nestMaterial = new THREE.MeshBasicMaterial({map:theNestMat, transparent: true, side: THREE.FrontSide});
// let theNestPlane = new THREE.PlaneBufferGeometry(1,1);
// let theNest = new THREE.Mesh(theNestPlane,nestMaterial);
// theNest.scale.x = 1920;
// theNest.scale.y = 1280;
// theNest.position.y = -100;
// theNest.position.z = -10
// // theNest.rotateY(Math.PI)
// scene.add(theNest)

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
loader.load('../objects/theNest19.glb', (gltf) => {
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

const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light)
console.log(scene)

// MOON
const moonGeo = new THREE.CircleGeometry(50,30);
const moonMat = new THREE.MeshBasicMaterial({color: 0xaaaaaa});
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
})

// FOG
// const fog = new THREE.Fog(0xffffff);
// fog.position.z = 0
// scene.add(fog);

let renderPass = new RenderPass(scene,camera);
let effectPass = new EffectPass(camera,godraysEffect);
effectPass.renderToScreen = true;

let composer = new EffectComposer(renderer);
composer.addPass(renderPass);
composer.addPass(effectPass);

// const light = new THREE.DirectionalLight( 0xffffff);
// light.position.set(-340,-95,5)
// light.lookAt(-350,-30,-5)
// scene.add( light );




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
const light1 = new THREE.PointLight(0xffffff,200,0,.2);

light1.position.z = -9;
scene.add(light1);

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
const animate = function () {
  requestAnimationFrame( animate );
  delta = 0.00011;

  light1.position.x = mouseX;
  light1.position.y = mouseY;
  // theNest.position.y -= delta*1000
  let moonMaxHeight = 690;
  circle.position.y += (circle.position.y >= moonMaxHeight-200) ? 0 : (moonMaxHeight-circle.position.y)*.0002;

  stars.forEach(s => {
    s.update(delta);
  });
  composer.render(0.1);
	// renderer.render( scene, camera );
};

animate();