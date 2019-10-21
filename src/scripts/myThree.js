
import noise from './utils/perlinNoise';

import {vector} from './vector';
import {particle} from './particle';
import { updateExpression } from 'babel-types';

window.onload = function(){
 
  const canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight,
        ship = particle.create(width/2,height/2,0,0),
        thrust = vector.create(0,0);
        
  
  let angle = 0, 
      turningRight = false,
      turningLeft = false,
      thrusting = false;

  // for(let i = 0; i < numParticles; i++){
  //   particles.push(particle.create(width/2.0,height/2.0, Math.random()*4.0+1.0, Math.random()*Math.PI*2.0));
  // }

  // document.body.style.backgroundColor = "green"

  update();

  document.body.addEventListener('keydown',function(e){
    switch(e.keyCode){
      case 38: thrusting = true;
        break;
      case 37: turningLeft = true;
        break;
      case 39: turningRight = true;
        break;
      default:
        break;
    }
  })

  document.body.addEventListener('keyup',function(e){
    switch(e.keyCode){
      case 38: thrusting = false;
        break;
      case 37: turningLeft = false;
        break;
      case 39: turningRight = false;
        break;
      default:
        break;
    }
  })

  function update(){
    context.clearRect(0,0,width,height);

    if(turningLeft) angle -= 0.05;
    if(turningRight) angle += 0.05;

    thrust.setAngle(angle);

    if(thrusting) thrust.setLength(0.1);
    else thrust.setLength(0);

    ship.accelerate(thrust);
    ship.update();

    context.save();
    context.translate(ship.position.getX(), ship.position.getY());
    context.rotate(angle);

    context.beginPath();
    context.moveTo(10,0);
    context.lineTo(-10,-7);
    context.lineTo(-10,7);
    context.lineTo(10,0);
    if(thrusting){
      context.moveTo(-10,0);
      context.lineTo(-18,0);
    }
    context.stroke();

    context.restore();

    if(ship.position.getX() > width){
      ship.position.setX(0);
    } 
    if(ship.position.getX() < 0){
      ship.position.setX(width);
    } 
    if(ship.position.getY() > height){
      ship.position.setY(0);
    } 
    if(ship.position.getY() < 0){
      ship.position.setY(height);
    } 
    

    requestAnimationFrame(update);
  }

}