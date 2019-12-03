import {THREE} from '../vendor';

const leftContainer = document.getElementById('leftIntro');
const rightContainer = document.getElementById('rightIntro');
const menu = document.querySelector('.left');
const container = document.getElementById('introDiv');
const items = document.querySelectorAll('.item');
const title = document.getElementById('title');
const menuPic = document.getElementById('menuPic');
let vh,vw;
// alert(`${window.screen.width} X ${window.screen.height}`)
if(window.screen.height > window.screen.width){
  vh = window.innerHeight * 0.01;
  menu.style.setProperty('--vh', `${vh}px`);
} else {
  vh = window.innerWidth * 0.01;
  menu.style.setProperty('--vw', `${vw}px`);
}



// Clicking the menu in and out
// container.addEventListener('click',(e)=>{
//   if(e.clientX < window.innerWidth/2){
//     if(!leftContainer.classList.contains('active')){
//       leftContainer.classList.add('active');
//       menu.classList.remove('menuOff');
//       menu.classList.add('menuOn');
      
//     } else {
//       leftContainer.classList.remove('active');
//       menu.classList.remove('menuOn');
//       menu.classList.add('menuOff')
//     }
//   }
// })

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

  if(window.screen.height > window.screen.width){
    vh = window.innerHeight * 0.01;
    menu.style.setProperty('--vh', `${vh}px`);
  } else {
    vh = window.innerWidth * 0.01;
    menu.style.setProperty('--vw', `${vw}px`);
  }

  // Nest Title Pulse
  x += .01;
  px = Math.cos(x);
  dx = 1-Math.pow(Math.max(0,Math.abs(px)*2-1), 3);
  title.style.opacity = THREE.Math.mapLinear(dx,-1,1,.5,1);

  requestAnimationFrame(animate);
})();
// welcome.opacity = Math.pow(Math.abs(Mat