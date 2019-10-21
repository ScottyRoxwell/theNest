export const utils = {

  norm: function(value, min, max){
    return (value - min) / (max - min);
  },

  lerp: function(norm, min, max){
    return (max - min) * norm + min;
  },

  map: function(value, sourceMin, sourceMax, destMin, destMax){
    return this.lerp(this.norm(value, sourceMin, sourceMax), destMin, destMax);
  },

  clamp: function(value, min, max){
    return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
  },
  randomRange: function(min, max){
    return min + Math.random()*(max - min);
  },
  randomInt: function(min, max){
    return Math.floor(min + Math.random()*(max - min + 1));
  },
  radiansToDegrees: function(radians){
    return radians * 180 / Math.PI;
  },
  degreesToRadians: function(degrees){
    return degrees / 180 * Math.PI;
  },
  roundToPlaces: function(value, places){
    let mult = Math.pow(10, places);
    return Math.round(value * mult) / mult;
  },
  roundNearest: function(value, nearest){
    return Math.round(value / nearest) * nearest;
  },
  randomDist: function(min, max, iterations){
    let total = 0;
    for(let i = 0; i < iterations; i++){
      total += utils.randomRange(min, max);
    }
    return total/iterations;
  }
}