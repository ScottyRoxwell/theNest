import {THREE} from '../vendor';
import noise from './utils/perlinNoise';
import { PointsMaterial, DepthPackingStrategies } from 'three';
import { thisExpression, objectMethod } from 'babel-types';
const width = window.innerWidth;
const height = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(width/-2,width/2,height/-2,height/2,1,1000);
// const camera = new THREE.PerspectiveCamera(50,width/height,1,1000);
// console.log(window.innerWidth)

// var light = new THREE.PointLight( 0xffffff, 100, 500);
// scene.add( light );

// document.body.addEventListener('mousemove', moveCircle);

// function moveCircle(e){
//   circle.position.x = e.clientX;
//   circle.position.y = -e.clientY;
// }

camera.position.z = -1;
camera.position.y = 0;
camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width,height);
const canvas = document.getElementById('canvas');
canvas.appendChild(renderer.domElement);

// let geometry = new THREE.Geometry();
// let particles = [];
// function createParticles(amount){

//   for(let i = 0; i < amount; i++){
//     let particle = new THREE.Vector3(
//       Math.cos(Math.random()*Math.PI*2) * Math.random() * (width/2 + 50),
//       Math.sin(Math.random()*Math.PI*2) * Math.random() * (width/2 + 50),
//       0 
//     );
//     particle.size = Math.random()*(2-.3);
//     geometry.vertices.push(particle);    
//     particles.push(particle);
//   }
//   let material = new THREE.PointsMaterial({
//     color: 0xffffff,
//     transparent: true,

//   });
//   let stars = new THREE.Points( geometry, material );
//   scene.add(stars);
//   return stars;
// }

// let backSplashGeo = new THREE.CircleGeometry(20,30);
// let backSplashMat = new THREE.MeshBasicMaterial({color: 0xffccaa});
// let circle = new THREE.Mesh( backSplashGeo, backSplashMat);
// circle.position.z = 2000;
// circle.scale.setX(2);
// scene.add(circle)
let particle = {

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

let stars = [];
function createSky(amount){
  for(let i = 0; i < amount; i++){
    let star = particle.create();
    stars.push(star);
    scene.add(star.mesh);
  }
  console.log(stars)
}

createSky(1000)

let delta = 0;
const animate = function () {
  requestAnimationFrame( animate );
  delta = 0.0001;

  stars.forEach(s => {
    s.update(delta);
    // s.mesh.position.x = Math.cos(s.theta + delta) * s.radius;
    // s.mesh.position.y = Math.sin(s.theta + delta) * s.radius;
  });

	renderer.render( scene, camera );
};

animate();