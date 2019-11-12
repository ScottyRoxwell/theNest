import {THREE} from '../vendor';
import { TriangleFanDrawMode } from 'three';
//fire off "Welcome to The Nest"
let welcome = document.querySelector('h1');
const NF = 80;
let rID = null, f = 0, dir = -1;

// function stopAni(){
//   cancelAnimationFrame(rID);
//   rID = null;
// };

// function update(){
//   f += dir;
//   let k = f/NF;
//   welcome.style.setProperty('opacity', `${+(k*100).toFixed(2)}%`);
//   if(!(f%NF)){
//     stopAni();
//     return
//   }
//   rID = requestAnimationFrame(update)
// };

// addEventListener('click', e => {
//   if(rID) stopAni();
//   dir *= -1;
//   update();
// }, false);


let x = 0;
let px,dx;
(function animate(){
  // if(x <= 1){
  //   x += .02;
  //   px = Math.cos(x)
  //   dx = 1-Math.pow(Math.max(0,Math.abs(px)*2-1), 3)
  //   welcome.style.opacity = THREE.Math.mapLinear(px,-1,1,0,1)
  // }
  requestAnimationFrame(animate);
})();
// welcome.opacity = Math.pow(Math.abs(Math.sin(Math.PI*x/2)))