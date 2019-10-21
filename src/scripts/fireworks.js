
import noise from './utils/perlinNoise';

import {vector} from './vector';
import {particle} from './particle';
// import { updateExpression } from 'babel-types';

window.onload = function(){
 
  const canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight,
        particles = [],
        numOfParticles = 100;

  for(let i = 0; i < numOfParticles; i++){
    particles.push(particle.create(width/2, height/3, Math.random()*(20-10)+10, Math.random()*Math.PI*2, .25));
  }

  
  update();

  function update(){
    context.clearRect(0,0,width,height);

    particles.forEach(p => {
      p.update();
      context.beginPath();
      context.arc(p.position.getX(),p.position.getY(),5,0,Math.PI*2,false);
      context.fill();
    });
    

    requestAnimationFrame(update);
  }

}