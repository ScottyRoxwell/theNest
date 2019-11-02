import {THREE} from '../vendor';
// import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {GodRaysEffect, RenderPass, EffectPass, EffectComposer} from 'postprocessing';
import noise from './utils/perlinNoise';


const GLTFLoader = require('./gltfloader');

const width = window.innerWidth;
const height = window.innerHeight;
const start = new THREE.Vector3(170,91,-20);
const end = new THREE.Vector3(380,155,-20);
const shootingStars = [];

const scene = new THREE.Scene();
// const camera = new THREE.OrthographicCamera(width/-2,width/2,height/-2,height/2,1,1000);
const camera = new THREE.PerspectiveCamera(80,width/height,1,1000);

camera.position.z = 570;
camera.position.y = 0;
camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer({antialias: true});
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
loader.load('../objects/theNest35.glb', (gltf) => {
  let nest = gltf.scene.children[0];
  nest.rotation.x = Math.PI/2;
  nest.scale.x = 32;
  nest.scale.y = 32;
  nest.scale.z = 32;
  nest.position.y = -200;
  nest.position.z = -10;
  // Tranparency settings for development
  // nest.material.transparent = true;
  // nest.material.opacity = .5;
  scene.add(gltf.scene);
  renderer.render(scene,camera);
})

// ANWING BACKSPLASH PLANE
const backsplashGeo = new THREE.PlaneBufferGeometry(1,1);
const backsplaceMat = new THREE.MeshPhongMaterial(0xffffff);
const backsplash = new THREE.Mesh(backsplashGeo,backsplaceMat);
backsplash.scale.set(180,50,1);
backsplash.rotation.z = Math.PI/10;
backsplash.position.set(270,120,-21);
scene.add(backsplash);

// MOON
const moonGeo = new THREE.CircleGeometry(70,30);
const moonMat = new THREE.MeshBasicMaterial({color: 0x777788});
const moon = new THREE.Mesh( moonGeo, moonMat);
moon.position.set(250, 162, -22);
scene.add(moon);

// AWNING LIGHT
const moonGeo2 = new THREE.CircleGeometry(40,8);
const moonMat2 = new THREE.MeshBasicMaterial({color: 0x777788});
const awningLight = new THREE.Mesh( moonGeo2, moonMat2);
awningLight.position.set(370,150,-20)
scene.add(awningLight);

// GODRAYS
let godraysEffect = new GodRaysEffect(camera, moon,{
  resolutionScale: .7,
  density: 3,
  decay: .97,
  weight: .2,
  samples: 320,
  blur: false
});

let godraysEffect2 = new GodRaysEffect(camera, awningLight,{
  resolutionScale: .8,
  density: 4,
  decay: .951,
  weight: .21,
  samples: 320,
  blur: false
});

let renderPass = new RenderPass(scene,camera);
let effectPass = new EffectPass(camera,godraysEffect);
let effectPass2 = new EffectPass(camera,godraysEffect2);
effectPass2.renderToScreen = true;

let composer = new EffectComposer(renderer);
composer.addPass(renderPass);
composer.addPass(effectPass);
composer.addPass(effectPass2);

// STARS
const particle = {
  scale: 1,
  radius: null,
  theta: null,

  create: function(){
    let obj = Object.create(this);
    let geometry = new THREE.PlaneBufferGeometry(1,1);
    let material = new THREE.MeshBasicMaterial({ color: 0xffffff });
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

// STARRY SKY
const stars = [];
function createSky(amount){
  for(let i = 0; i < amount; i++){
    let star = particle.create();
    stars.push(star);
    scene.add(star.mesh);
  }
}
createSky(1000);

// SHOOTING STARS
const star = {

  create: function(size){
    let obj = Object.create(this);
    let geometry = new THREE.PlaneBufferGeometry(size,size);
    let material = new THREE.MeshBasicMaterial(0xffffff);
    obj.mesh = new THREE.Mesh(geometry,material);
    return obj;
  }
}

const shootingStar = {
  speed: 2,
  degree: 1,
  size: 1,

  create: function(tailLength){
    let obj = Object.create(this);
    obj.wish = new THREE.Group();
    obj.speed = Math.random()*14.2+11;
    obj.degree = Math.random()*3.5+.5;
    obj.size = Math.random()*1.3+.6;
    obj.wish.position.x = width+20; 
    obj.wish.position.y = Math.random()*(height+200)+(height*.7);
    obj.wish.position.z = -29;
    for(let i = 1; i <= tailLength; i++){
      let tailDot = star.create(obj.size);
      tailDot.mesh.position.set(obj.speed*(i-1), obj.degree*(i-1), 0);
      tailDot.mesh.scale.set(obj.size/(i/1.1),obj.size/(i/1.1),1);
      obj.wish.add(tailDot.mesh);   
    }
    return obj;
  },
  update: function(){
    this.wish.position.x -= this.speed;
    this.wish.position.y -= this.degree;
    shootingStars.forEach((wish,i) => {
      if(wish.wish.position.x < -width/2-100){
        shootingStars.splice(i,1);
        scene.remove(wish.wish)
      } 
    })
  }
}

// NEST LIGHTS
const lightColor = new THREE.Color(0xffffaa);
const penumbra = .4;
const light1 = new THREE.SpotLight(lightColor,2);
light1.penumbra = penumbra;
light1.position.x = 285;
light1.position.y = -96;
light1.position.z = -1;
light1.target = new THREE.Object3D();
light1.target.position.set(light1.position.x+5, light1.position.y-50, light1.position.z);
scene.add(light1.target);
scene.add(light1);

const light2 = new THREE.SpotLight(lightColor,2);
light2.penumbra = penumbra;
light2.position.x = 524;
light2.position.y = -44;
light2.position.z = -1;
light2.target = new THREE.Object3D();
light2.target.position.set(light2.position.x+7, light2.position.y-50, light2.position.z);
scene.add(light2.target);
scene.add(light2);

const light3 = new THREE.SpotLight(lightColor,2);
light3.penumbra = penumbra;
light3.position.x = 828;
light3.position.y = 32;
light3.position.z = -1;
light3.target = new THREE.Object3D();
light3.target.position.set(light3.position.x+9, light3.position.y-50, light3.position.z);
scene.add(light3.target);
scene.add(light3);

// AMBIENT LIGHT
const light = new THREE.AmbientLight(0xffeeee, .3);
scene.add(light);

// DIRECTIONAL LIGHT
// const directional = new THREE.DirectionalLight(0xffffff,2);
// directional.position.set(200,0,300)
// directional.target = new THREE.Object3D();
// directional.target.position.set(-100,0,-10)
// scene.add(directional.target)
// scene.add(directional);

// HEADLIGHTS
const headlight1 = new THREE.SpotLight(0xbbbbff,1.3);
headlight1.penumbra = .4;
headlight1.angle = Math.PI/6;
headlight1.position.set(0,-300,800);
headlight1.target = new THREE.Object3D();
scene.add(headlight1.target);
scene.add(headlight1);

const headlight2 = new THREE.SpotLight(0xbbbbff,1.3);
headlight2.penumbra = .4;
headlight2.angle = Math.PI/6;
headlight2.position.set(600,-300,800);
headlight2.target = new THREE.Object3D();
scene.add(headlight2.target);
scene.add(headlight2);

//=================== ANIMATION =====================//
let delta = 0;
let pdelta = 0;
let p,q,r;
let lerper = 0;

const animate = function () {
  requestAnimationFrame( animate );
  delta = 0.00011;

  // LIGHT FLICKER
  pdelta += 0.07;
  p = noise(pdelta);
  q = noise(pdelta*.7);
  r = noise(pdelta*.5);
  light1.intensity = THREE.Math.mapLinear(p,0,1,4.5,6);
  light2.intensity = THREE.Math.mapLinear(q,0,1,4.5,7);
  light3.intensity = THREE.Math.mapLinear(r,0,1,4.5,8);

  // HEADLIGHT MOUSE MOVEMENT
  headlight1.target.position.set(mouseX,mouseY,-10);
  headlight2.target.position.set(mouseX+400,mouseY,-10);

  // MOONRISE
  const moonMaxHeight = 690;
  moon.position.y += (moon.position.y >= moonMaxHeight-250) ? 0 : (moonMaxHeight-moon.position.y)*.0002;
  
  // AWNING GODRAYS
  lerper += .0009;
  if(awningLight.position.x > end.x){
    awningLight.position.set(170,91,-20);
    lerper = 0;
  } else {
    awningLight.position.lerpVectors(start,end,lerper);
  }

  // SHOOTING STARS
  if(Math.random() > .298){
    let wish = shootingStar.create(Math.ceil(Math.random()*30+25));
    shootingStars.push(wish)
    scene.add(wish.wish);
  }
  if(shootingStars.length){
    shootingStars.forEach(wish => {
      wish.update();
    })
  }

  // console.log(shootingStars.length)
  
  
  // SKY ROTATION
  stars.forEach(s => {
    s.update(delta);
  });

  composer.render(0.1);
	// renderer.render( scene, camera );
};

animate();