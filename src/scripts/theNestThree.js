import {THREE} from '../vendor';
import noise from './utils/perlinNoise';
import { PointsMaterial } from 'three';
const width = window.innerWidth;
const height = window.innerHeight;
const scene = new THREE.Scene();
// PerspectiveCamera FOV parameter: 0 - 180 degrees
const camera = new THREE.PerspectiveCamera(40,width/height,1,1000);
// console.log(window.innerWidth)

// var light = new THREE.PointLight( 0xffffff, 100, 500);
// scene.add( light );

var ambient= new THREE.AmbientLight( 0xffffff, .6); // soft white light
scene.add( ambient );

camera.position.z = 250;
camera.position.y = 0;
camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width,height);
const canvas = document.getElementById('canvas');
canvas.appendChild(renderer.domElement);

let geometry = new THREE.Geometry();
let particles = [];
function createParticles(amount){

  for(let i = 0; i < amount; i++){
    let random = Math.random();
    let random2 = Math.random();
    let particle = new THREE.Vector3(
      Math.cos(Math.sqrt(random)*Math.PI*2) * random2 * (width/2),
      Math.sin(Math.sqrt(random)*Math.PI*2) * random2 * (width/2),
      0 
    );
    geometry.vertices.push(particle);    
    particles.push(particle);
  }
  let material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.8,
    transparent: true
  });
  let stars = new THREE.Points( geometry, material );
  scene.add(stars);
  return stars;
}

const universe = createParticles(15000);

let delta;
const animate = function () {
  requestAnimationFrame( animate );
  delta = 0.0001;

  universe.rotation.z += delta;

 
	renderer.render( scene, camera );
};

animate();