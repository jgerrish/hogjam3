var inherits = require('inherits');
var Entity = require('crtrdg-entity');
var randomInt = require('./util/math').randomInt;
var randomRGB = require('./util/math').randomRGB;
var randomRGBA = require('./util/math').randomRGBA;

module.exports = Player;

function Player(options){
  Entity.call(this);
  var self = this;

  this.game = options.game;
  this.keysDown = options.keysDown;
  this.camera = options.camera;

  this.size = { x: 40, y: 40 };
  this.velocity = { x: 0, y: 0 };
  this.position = options.position;

  this.speed = 8;
  this.friction = 0.4;
  this.health = 100;
  this.strength = 5;
  this.color = '#fff';
  this.visible = true;
  this.points = 00;
  this.blockers = {};

  this.particles = {
    jump: {
      size: 3,
      number: 10,
      color: '#b4b4ad'
    }
  }

  this.on('update', function(interval){
    self.input(self.keysDown);
    self.handleBlockers();
    self.move();
    self.velocity.x *= this.friction;
    self.velocity.y *= this.friction;
    self.boundaries();
  });

  this.on('draw', function(c){
    c.save();
    c.fillStyle = self.color;
    c.fillRect(
      self.position.x - this.camera.position.x,
      self.position.y - this.camera.position.y,
      self.size.x,
      self.size.y
    );
    c.restore();
  });
}

inherits(Player, Entity);

Player.prototype.move = function(){
  this.position.x += this.velocity.x * this.friction;
  this.position.y += this.velocity.y * this.friction;
};

Player.prototype.handleBlockers = function() {
  for (var blocker in this.blockers) {
    if (this.blockers[blocker]) {
      var b = this.blockers[blocker];
      var x_overlap, y_overlap;

      // TODO: more intelligently do this based on center of objects
      if (this.position.x <= (b.position.x + b.size.x) &&
          (((b.position.x + b.size.x) - this.position.x) < this.size.x)) {
        x_overlap = this.position.x - (b.position.x + b.size.x);
        this.position.x -= x_overlap - 1;
        if (this.velocity.x < 0) {
          this.velocity.x = 0;
        }
      } else if ((this.position.x + this.size.y) >= b.position.x) {
        x_overlap = (this.position.x + this.size.x) - b.position.x;
        this.position.x -= x_overlap + 2;
        if (this.velocity.x < 0) {
          this.velocity.x = 0;
        }
      }
    }
  };
};

Player.prototype.addBlocker = function(blocker) {
  this.blockers[blocker.uid] = blocker;
}

Player.prototype.removeBlocker = function(blocker) {
  this.blockers[blocker.uid] = false;
}

Player.prototype.boundaries = function(){
  if (this.position.x <= 0){
    this.position.x = 0;
  }

  if (this.position.x >= this.camera.map.width - this.size.x){
    this.position.x = this.camera.map.width - this.size.x;
  }

  if (this.position.y <= 0){
    this.position.y = 0;
  }

  if (this.position.y >= this.camera.map.height - this.size.y){
    this.position.y = this.camera.map.height - this.size.y;
  }
};

Player.prototype.input = function(){
  if ('W' in this.keysDown){
    this.velocity.y -= this.speed;
  }

  if ('S' in this.keysDown){
    this.velocity.y += this.speed;
  }

  if ('A' in this.keysDown){
    this.velocity.x -= this.speed;
  }

  if ('D' in this.keysDown){
    this.velocity.x += this.speed;
  }
};
