import {THREE} from '../vendor';
import noise from './utils/perlinNoise';
import { thisExpression } from 'babel-types';
const width = window.innerWidth;
const height = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(width/-2,width/2,height/-2,height/2,1,1000);

camera.position.z = -1;
camera.position.y = 0;
camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width,height);
const canvas = document.getElementById('canvas');
canvas.appendChild(renderer.domElement);

const loader = new THREE.ImageBitmapLoader();
loader.setOptions({imageOrientation: 'flipY', resizeQuality: 'high'});
loader.load("../images/nestFron3.png", function(image){
  let texture = new THREE.CanvasTexture(image);
  texture.format
  let material = new THREE.MeshBasicMaterial({map:texture, transparent: true, side: THREE.DoubleSide});
  let theNestPlane = new THREE.PlaneBufferGeometry(width,height);
  let theNest = new THREE.Mesh(theNestPlane,material);
  theNest.rotateY(Math.PI)
  scene.add(theNest)
});




const backSplashGeo = new THREE.CircleGeometry(200,30);
const backSplashMat = new THREE.MeshBasicMaterial({color: 0xffccaa });
const circle = new THREE.Mesh( backSplashGeo, backSplashMat);
circle.position.set(-340,-95,20);
scene.add(circle)

var light = new THREE.DirectionalLight( 0xffffff);
light.position.set(-340,-95,5)
light.lookAt(-350,-30,-5)
scene.add( light );

// document.body.addEventListener('mousemove', moveCircle);

// function moveCircle(e){
//   circle.position.x = -e.clientX;
//   circle.position.y = e.clientY;
// }

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
    obj.mesh.position.z = 30;
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

const stars = [];
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
  delta = 0.00011;

  stars.forEach(s => {
    s.update(delta);
  });


	renderer.render( scene, camera );
};

animate();