import { objectMethod } from "babel-types";
import {vector} from './vector';
import { Z_SYNC_FLUSH } from "zlib";

export const particle = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  gravity: 0,
  mass: 1,
  radius: 0,
  bounce: -1,
  friction: 1,
  springs: null,
  gravitations: null,

  create: function(x, y, speed, direction, grav){
    let obj = Object.create(this);
    obj.x = x;
    obj.y = y;
    obj.vx = Math.cos(direction)*speed;
    obj.vy = Math.sin(direction)*speed;
    obj.gravity = grav || 0;
    obj.springs = [];
    obj.gravitations = [];
    return obj;
  },
  getSpeed: function(){
    return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  },
  setSpeed: function(speed){
    let heading = this.getHeading();
    this.vx = Math.cos(heading) * speed;
    this.vy = Math.sin(heading) * speed;
  },
  getHeading: function(){
    return Math.atan2(this.vy, this.vx);
  },
  setHeading: function(heading){
    let speed = this.getSpeed();
    this.vx = Math.cos(heading) * speed;
    this.vy = Math.sin(heading) * speed;
  },
  accelerate: function(ax, ay){
    this.vx += ax;
    this.vy += ay;
  },
  update: function(){
    this.handleSprings();
    this.handleGravitations();
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
  },
  handleSprings: function(){
    this.springs.forEach(spring => {
      this.springTo(spring.point, spring.k, spring.length);
    })
  },
  handleGravitations: function(){
    this.gravitations.forEach(g => this.gravitateTo(g)); 
  },
  angleTo: function(p2){
    return Math.atan2(p2.y - this.y, p2.x - this.x);
  },
  distanceTo: function(p2){
    let dx = p2.x - this.x,
        dy = p2.y - this.y;

    return Math.sqrt(dx * dx + dy * dy);
  },
  gravitateTo: function(p2){
    let dx = p2.x - this.x,
        dy = p2.y - this.y,
        distSQ = dx * dx + dy * dy,
        dist = Math.sqrt(distSQ),
        force = p2.mass/distSQ,
        ax = dx/dist * force,
        ay = dy/dist * force;

        this.vx += ax;
        this.vy += ay;
  },
  addGravitation: function(p){
    this.removeGravitation(p);
    this.gravitations.push(p);
  },
  removeGravitation: function(g){
    this.gravitations.forEach((gravitation,i) => {
      if(g === gravitation){
        this.gravitations.splice(i,1);
        // return;
      }
    })
  },
  springTo: function(point, k, length){
    let dx = point.x - this.x,
        dy = point.y - this.y,
        dist = Math.sqrt(dx * dx + dy * dy),
        springForce = (dist - length || 0) * k;

    this.vx += dx/dist * springForce;
    this.vy += dy/dist * springForce;
  },
  addSpring: function(point, k, length){
    this.removeSpring(point);
    this.springs.push({
      point,
      k,
      length: length || 0
    })
  },
  removeSpring: function(point){
    this.springs.forEach((spring,i) => {
      if(point === spring.point){
        this.springs.splice(i,1);
        // return;
      }
    })
  }
}