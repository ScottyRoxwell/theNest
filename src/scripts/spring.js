
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
        point = particle.create(width/2,height/2,0,0),
        point2 = particle.create(utils.randomRange(0,width),utils.randomRange(0,height,0,0)),
        weight = particle.create(width/2+100,height/2-200,0,0,.8),
        k = .1,
        springLength = 100;

  point.radius = 2;
  point2.radius = 2;
  weight.radius = 20;
  weight.friction = .9;
  weight.addSpring(point, k, springLength);
  weight.addSpring(point2, k, springLength);

  document.body.addEventListener("mousedown", onMouseDown);

  function onMouseDown(e){
    document.body.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseup', onMouseUp);
    weight.removeSpring(point2);
    console.log(weight.springs)
    weight.x = e.clientX;
    weight.y = e.clientY;
  }

  function onMouseMove(e){
    weight.x = e.clientX;
    weight.y = e.clientY;
  }

  function onMouseUp(e){
    document.body.removeEventListener('mousemove', onMouseMove);
    document.body.removeEventListener('mouseup', onMouseUp);
    weight.x = e.clientX;
    weight.y = e.clientY;
  }
  
  update();

  function update(){
    context.clearRect(0,0,width,height);

    weight.update();

    context.beginPath();
    context.arc(point.x,point.y,point.radius,0,Math.PI*2,false);
    context.fill();

    context.beginPath();
    context.arc(point2.x,point2.y,point2.radius,0,Math.PI*2,false);
    context.fill();

    context.beginPath();
    context.arc(weight.x,weight.y,weight.radius,0,Math.PI*2,false);
    context.fill();
    
    context.beginPath();
    context.moveTo(point.x,point.y);
    context.lineTo(weight.x,weight.y);
    context.lineTo(point2.x,point2.y);
    context.stroke();

    requestAnimationFrame(update);
  }

}