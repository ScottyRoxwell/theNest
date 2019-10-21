
import noise from './utils/perlinNoise';
import {utils} from './utilities';
import {vector} from './vector';
import {particle} from './particle';
// import { updateExpression } from 'babel-types';

window.onload = function(){
 
  const canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight,
        sun = {
          x: utils.randomRange(200,width-200),
          y: utils.randomRange(200,height-200),
          mass: 15000
        },
        sun2 = {
          x: utils.randomRange(200,width-200),
          y: utils.randomRange(200,height-200),
          mass: 18000
        },
        planets = [],
        numOfPlanets = 160;
      
  for(let i = 0; i < numOfPlanets; i++){
    let p = particle.create(width/2,0,utils.randomRange(2,6),utils.randomRange(Math.PI/4, Math.PI*3/4));
    // p.friction = .99;
    p.addGravitation(sun);
    p.addGravitation(sun2);
    planets.push(p);
  }


  update();

  function update(){
    context.clearRect(0,0,width,height);

    planets.forEach(p => {
      p.update();
      context.beginPath();
      context.fillStyle = "#0000ff";
      context.arc(p.x, p.y, 5, 0, Math.PI*2, false);
      context.fill();
      if(p.x < 0 || p.x > width || p.y < 0 || p.y > height){
        p.x = width/2;
        p.y = 0;
        p.setSpeed(utils.randomRange(2,6));
      }
      if(p.getSpeed() > 6) p.setSpeed(6);
    })

    context.beginPath();
    context.fillStyle = "#ffff00";
    context.arc(sun.x, sun.y, 20, 0, Math.PI*2, false);
    context.fill();

    context.beginPath();
    context.fillStyle = "#ffff00";
    context.arc(sun2.x, sun2.y, 30, 0, Math.PI*2, false);
    context.fill();

    requestAnimationFrame(update);
  }

}