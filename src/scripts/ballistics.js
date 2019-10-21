
import noise from './utils/perlinNoise';
import {utils} from './utilities';
import {vector} from './vector';
import {particle} from './particle';
import { deflateRaw } from 'zlib';
// import { updateExpression } from 'babel-types';

let delta = 0;

window.onload = function(){
 
  const canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight,
        gun = {
                x: 200,
                y: height,
                angle: -Math.PI/4
              },
        cannonBall = particle.create(gun.x,gun.y,0,gun.angle,.9);

  let norm,
      isShooting = false;
 
  cannonBall.firePower = 0;
  
  document.body.addEventListener('keydown', shoot);
  document.body.addEventListener('mousedown', onMouseDown);

  function onMouseDown(e){
    document.body.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseup', onMouseUp);
    aimGun(e.clientX,e.clientY);
  }

  function onMouseMove(e){
    aimGun(e.clientX,e.clientY);
  }

  function onMouseUp(e){
    document.body.removeEventListener('mousemove', onMouseMove);
    document.body.removeEventListener('mouseup', onMouseUp);
    aimGun(e.clientX,e.clientY);
  }

  function aimGun(x,y){
    gun.angle = Math.atan2(y - gun.y, x - gun.x);
    gun.angle = utils.clamp(gun.angle,-Math.PI/16,-Math.PI/2);
    // draw();
  }

  function shoot(e){
    // console.log(e.keyCode);
    if(e.keyCode === 32 && !isShooting){
      cannonBall.x = gun.x + Math.cos(gun.angle)*80;
      cannonBall.y = gun.y + Math.sin(gun.angle)*80;
      cannonBall.setSpeed(cannonBall.firePower);
      cannonBall.setHeading(gun.angle);
      isShooting = true;
    } 
  }
   
  // function draw(){
    
  // } 

  // draw();
  update();

  function update(){
    context.clearRect(0,0,width,height);
    // draw();
    if(!isShooting) delta+=.1;
    norm = Math.abs(Math.sin(delta));

    context.beginPath();
    context.arc(gun.x, gun.y, 50, 0, Math.PI*2, false);
    context.fill();

    context.beginPath();
    context.arc(cannonBall.x,cannonBall.y,12,0,Math.PI*2,false);
    context.fill();

    context.save();
    context.translate(gun.x,gun.y);
    context.rotate(gun.angle);
    context.beginPath();
    context.fillRect(0,-25/2,80,25);
    context.restore();

    context.beginPath();
    context.fillStyle = "#dddddd";
    context.fillRect(50, height - 200, 40, 180);
   
    context.beginPath();
    context.fillStyle = "#444444";
    context.fillRect(50, height - 20, 40, -180*norm);

    cannonBall.firePower = utils.map(norm,0,1,5,40);
    if(isShooting) cannonBall.update();
    if(cannonBall.y >= height){
      isShooting = false;
    }
    
    
    requestAnimationFrame(update);
  }

}