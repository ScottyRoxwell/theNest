import {THREE} from '../vendor';
// import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {GodRaysEffect, RenderPass, EffectPass, EffectComposer} from 'postprocessing';
import noise from './utils/perlinNoise';
import { SceneUtils } from 'three';

const GLTFLoader = require('./gltfloader');

const width = window.innerWidth;
const height = window.innerHeight;
const start = new THREE.Vector3(150,75,-11);
const end = new THREE.Vector3(400,169,-11);
const shootingStars = [];

const scene = new THREE.Scene();
// const camera = new THREE.OrthographicCamera(width/-2,width/2,height/-2,height/2,1,1000);
const camera = new THREE.PerspectiveCamera(80,width/height,1,1000);

camera.position.z = 570;
camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(width,height);
const canvas = document.getElementById('canvas');
canvas.appendChild(renderer.domElement);

const theNestTitle = document.createElement('img');
theNestTitle.src = '../images/theNestTitle3.png';

const items = document.querySelectorAll('li');
items.forEach((item,i)=>{
  if(i === 0) item.appendChild(theNestTitle);
})


// THE NEST
const loader = new THREE.GLTFLoader();
loader.load('../objects/theNest46.glb', (gltf) => {
  let nest = gltf.scene.children[1];
  nest.rotation.x = Math.PI/2;
  nest.scale.set(32,1,32);
  nest.position.y = -200;
  nest.position.z = -10;

  // Masking Layer
  let mask = gltf.scene.children[0];
  let maskMap = mask.material.map;
  mask.material = new THREE.MeshBasicMaterial({color:0x000000, alphaMap:maskMap});
  mask.material.map = null;
  mask.material.transparent = true;
  mask.material.opacity = .9;
  mask.material.depthWrite = false;
  mask.rotation.x = Math.PI/2;
  mask.position.y = -200;
  mask.scale.set(32,1,32);

  // Tranparency settings for development
  // nest.material.transparent = true;
  // nest.material.opacity = .5;

  // console.log(mask)
  // console.log(nest)
  // console.log(gltf.scene)
  scene.add(gltf.scene);
  init();
})

function init(){

  // ADD EVENT LISTENERS

  let mouseX, mouseY, clientX, clientY;

  document.body.addEventListener('mousemove', moveNest);

  function moveNest(e){
    mouseX = THREE.Math.mapLinear(e.clientX,0,width,-width/2,width/2);
    mouseY = THREE.Math.mapLinear(e.clientY,0,height,height/2,-height/2);
    clientX = e.clientX;
    clientY = e.clientY;
    return mouseX, mouseY, clientX, clientY;
  }

  window.addEventListener( 'resize', onWindowResize, false );

  function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    composer.setSize( window.innerWidth, window.innerHeight );
    destroySky();
    createSky(1400,window.innerWidth,window.innerHeight);
  }

  const menu = document.querySelector('ul');
  let fullRad = true;
  let fullDeg = true;

  menu.addEventListener('click',(e)=>{
    if(e.target.id === '10'){
      fullRad = !fullRad;
    }
    if(e.target.id === '11'){
      fullDeg = !fullDeg;
    }
  })

  // ANWING BACKSPLASH PLANE
  const backsplashGeo = new THREE.PlaneBufferGeometry(1,1);
  const backsplachMat = new THREE.MeshPhongMaterial(0xffffff);
  const backsplash = new THREE.Mesh(backsplashGeo,backsplachMat);
  backsplash.scale.set(180,40,1);
  backsplash.rotation.z = Math.PI/10;
  backsplash.position.set(270,122,-11);
  scene.add(backsplash);

  // MOON
  const moonGeo = new THREE.CircleGeometry(70,30);
  const moonMat = new THREE.MeshBasicMaterial({color: 0x777788});
  const moon = new THREE.Mesh( moonGeo, moonMat);
  moon.position.set(250, 162, -22);
  scene.add(moon);

  // AWNING LIGHT
  const moonGeo2 = new THREE.PlaneBufferGeometry(1,1);
  const moonMat2 = new THREE.MeshBasicMaterial({color: 0x777776});
  const awningLight = new THREE.Mesh( moonGeo2, moonMat2);
  awningLight.position.set(start.x,start.y,start.z);
  awningLight.rotation.z = Math.PI/10;
  awningLight.scale.set(130,35,1);
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
    blur: true
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

    create: function(w,h){
      let obj = Object.create(this);
      let geometry = new THREE.PlaneBufferGeometry(1,1);
      let material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      obj.mesh = new THREE.Mesh(geometry,material);
      obj.radius = Math.random() * ((w>h)?w:h*1.25/2 + 50) + 150;
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
  function createSky(amount,w,h){
    for(let i = 0; i < amount; i++){
      let star = particle.create(w,h);
      stars.push(star);
      scene.add(star.mesh);
    }
  }
  createSky(1400,width,height);

  function destroySky(){
    stars.forEach(s=>{
      scene.remove(s.mesh);
    })
  }

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
      obj.speed = Math.random()*12.2+11;
      obj.degree = Math.random()*3.5+.5;
      obj.size = Math.random()*1.3+.6;
      obj.wish.position.x = width+10; 
      obj.wish.position.y = Math.random()*(height/2+50)+(height/2*.8);
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

  // GROUND LIGHT
  const groundLight = new THREE.SpotLight(0xddddff);
  groundLight.angle = Math.PI/5;
  groundLight.penumbra = .1;
  groundLight.decay = 2;
  groundLight.position.set(width/2*1.05,-height/2*1.01,10);
  groundLight.target = new THREE.Object3D();
  groundLight.target.position.set(100,-300,-10);
  scene.add(groundLight.target);
  scene.add(groundLight);

  // HEADLIGHTS
  const headlight1 = new THREE.SpotLight(0xbbbbff,0);
  headlight1.penumbra = .4;
  headlight1.decay = .001;
  headlight1.angle = Math.PI/6;
  headlight1.position.set(172,200,20);
  headlight1.target = new THREE.Object3D();
  headlight1.target.position.set(-60,80,-10);
  scene.add(headlight1.target);
  scene.add(headlight1);

  const headlight2 = new THREE.SpotLight(0xbbbbff,2);
  headlight2.penumbra = 1;
  headlight2.decay = .1;
  headlight2.angle = Math.PI/10;
  headlight2.position.set(-120,160,500);
  headlight2.target = new THREE.Object3D();
  headlight2.target.position.set(-250,110,-10);
  scene.add(headlight2.target);
  scene.add(headlight2);

  // XMAS LIGHTS
  const xmasLights = [];
  (function(){
    for(let i = 0; i < 9; i++){
      let xmasLight = new THREE.PointLight(0xffffff,4,50);
      if(i===0) xmasLight.position.set(230,-9,5);
      if(i===1) xmasLight.position.set(304,12,5);
      if(i===2) xmasLight.position.set(385,37,5);
      if(i===3) xmasLight.position.set(472,64,5);
      if(i===4) xmasLight.position.set(566,95,5);
      if(i===5) xmasLight.position.set(159,-30,5);
      if(i===6) xmasLight.position.set(94,-50,5);
      if(i===7) xmasLight.position.set(93,-70,5);
      if(i===8) xmasLight.position.set(191,-86,5);
      xmasLights.push(xmasLight)
      scene.add(xmasLight);
    }
    console.log(scene)
  })();


  //=================== ANIMATION =====================//
  let delta = 0;
  let pdelta = 0;
  let qdelta = 0;
  let p,q,r,s;
  let lerper = 0;

  const animate = function () {
    requestAnimationFrame( animate );
    delta = 0.00011;

    // CAMERA CONTROLS FOR DEVELOPMENT
    // camera.position.x = THREE.Math.mapLinear(mouseX,-width/2,width/2,-1000,1000);
    // camera.position.y = THREE.Math.mapLinear(mouseY,-height/2,height/2,-1000,1000);
    // camera.lookAt(0,0,0)

    // LIGHT FLICKER
    pdelta += 0.07;
    qdelta += 0.03;
    s = noise(qdelta);
    p = noise(pdelta);
    q = noise(pdelta*.7);
    r = noise(pdelta*.5);
    light1.intensity = THREE.Math.mapLinear(p,0,1,4.5,6);
    light2.intensity = THREE.Math.mapLinear(q,0,1,4.5,7);
    light3.intensity = THREE.Math.mapLinear(r,0,1,4.5,8);
    groundLight.intensity = THREE.Math.mapLinear(p,0,1,1.5,1.8);

    xmasLights.forEach(light=>{
      light.intensity = THREE.Math.mapLinear(s/2,0,1,2,6)
    })

    // HEADLIGHT MOVEMENT
    // theta += 0.03;
    // radius = 70;
    // headlight1.target.position.x = (Math.cos(theta)*radius)-300;
    // headlight1.target.position.y = (Math.sin(theta)*radius*1.8);
    // headlight2.target.position.x = (Math.cos(theta)*radius);
    // headlight2.target.position.y = (Math.sin(theta)*radius)-400;
    // Mouse controlled headlights
    // headlight1.target.position.set(mouseX,mouseY,-10);
    headlight2.target.position.set(mouseX,mouseY,-10);

    // MOONRISE
    const moonMaxHeight = 400;
    moon.position.y += (moonMaxHeight-moon.position.y)*.0008;

    // SANDS LIGHTING
    if(moon.position.y > 230 && moon.position.y < 270){
      headlight1.intensity = THREE.Math.mapLinear(moon.position.y,230,270,0,5);
    }

    // AWNING BACKSPLASH RECEDE TO PREVENT MOONLIGHT FROM INITIALLY SHINING THROUGH
    if(moon.position.y >= 198) backsplash.position.z = -12;
    
    // AWNING GODRAYS
    if(backsplash.position.z === -12){
      lerper += .0009;
      if(awningLight.position.x > end.x){
        awningLight.material.opacity = 0;
        awningLight.position.set(170,91,-11);
        lerper = 0;
      } else {
        awningLight.material.opacity = 1;
        awningLight.position.lerpVectors(start,end,lerper);
      }
    }

    // SHOOTING STARS
    if(Math.random() > .98){
      let wish = shootingStar.create(Math.ceil(Math.random()*30+25));
      shootingStars.push(wish)
      scene.add(wish.wish);
    }
    if(shootingStars.length){
      shootingStars.forEach(wish => {
        wish.update();
      })
    }
    
    // SKY ROTATION
    stars.forEach(s => {
      s.update(delta);
    });
    
    // UI //
    items.forEach((item,i)=>{
      let radius = (Math.floor(Math.sqrt(mouseX * mouseX + mouseY * mouseY)*Math.pow(10,2)))/Math.pow(10,2);
      let cosX = (Math.floor(mouseX/radius*Math.pow(10,4)))/Math.pow(10,4);
      let sinY = (Math.floor(mouseY/radius*Math.pow(10,4)))/Math.pow(10,4);
      let radiansFull = Math.sign(Math.atan2(sinY,cosX)) === 1 ? Math.floor((Math.atan2(sinY,cosX))*Math.pow(10,2))/Math.pow(10,2) : Math.floor((Math.PI*2 + (Math.atan2(sinY,cosX)))*Math.pow(10,2))/Math.pow(10,2);
      let radiansHalf = Math.floor((Math.atan2(sinY,cosX))*Math.pow(10,2))/Math.pow(10,2);
      let degreesFull = Math.floor(180*radiansFull/Math.PI*Math.pow(10,2))/Math.pow(10,2);
      let degreesHalf = Math.floor(180*radiansHalf/Math.PI*Math.pow(10,2))/Math.pow(10,2);
      if(i === 1) item.innerText = 'Width: ' + window.innerWidth;
      if(i === 2) item.innerText = 'Height: ' + window.innerHeight;
      if(i === 3) item.innerText = 'MouseX: ' + clientX;
      if(i === 4) item.innerText = 'MouseY: ' + clientY;
      if(i === 5) item.innerText = 'ThreeX: ' + mouseX;
      if(i === 6) item.innerText = 'ThreeY: ' + mouseY;
      if(i === 7) item.innerText = 'cosX: ' + cosX;
      if(i === 8) item.innerText = 'sinY: ' + sinY;
      if(i === 9) item.innerText = 'Radius: ' + radius;
      if(i === 10) item.innerText = 'Radians: ' + ((fullRad) ? radiansFull : radiansHalf);
      if(i === 11) item.innerText = 'Degrees: ' + ((fullDeg) ? degreesFull : degreesHalf);
    })

    composer.render(0.1);
    // renderer.render( scene, camera );
  };

  animate();
}
