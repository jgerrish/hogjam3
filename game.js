var tick = require('tic')();
var buzz = require('buzz');

/*
* crtrdg.js modules
*/

var Game = require('crtrdg-gameloop');
var Keyboard = require('crtrdg-keyboard');
var Mouse = require('crtrdg-mouse');
var SceneManager = require('crtrdg-scene');

/*
* custom modules
*/

var Map = require('./map');
var Camera = require('./camera');
var Player = require('./player');
var Item = require('./item');
var Inventory = require('./inventory');
var Wallet = require('./wallet');
var AssetLoader = require('./asset_loader');
var Menu = require('./menu');

/* util */
var randomInt = require('./util/math').randomInt;
var randomRGB = require('./util/math').randomRGB;
var randomRGBA = require('./util/math').randomRGBA;

var Meter = require('./meter');

/*
* create game object
*/

var game = new Game({
  canvas: 'game',
  width: window.innerWidth,
  height: window.innerHeight - 100,
  backgroundColor: randomRGBA(122, 256, 22, 256, 0, 256, 0.4)
});

game.on('pause', function(){
	console.log('paused');
});

game.on('resume', function(){
	console.log('resumed');
});

game.on('update', function(interval){
	tick.tick(interval);
});

game.on('draw', function(c){

});

game.on('draw-background', function(context){
  context.fillStyle = 'rgb(100, 200, 150)';
  context.fillRect(0, 0, game.width, game.height);
  map.draw(context, camera);
  game.currentScene.emit('draw-background', context);
});

game.on('draw-foreground', function(context){
	game.currentScene.emit('draw-foreground', context);
});


/*
* Sounds
*/

var soundOne = new buzz.sound('./sounds/01.mp3');

soundOne.play().loop();


/*
* Counter stuff
*/

// Global list of counter listeners
intervalEvents = [];
minuteListeners = [];

/* every minute */

var minutes = 0;
tick.interval(function() {
  if(minutes === 0) scene.set(day);
  if(minutes === 5) scene.set(night);

  player.everyMinute(minutes);

  if (minutes == 8) minutes = 0;
  else minutes++;

  minuteListeners.forEach(function(listener, index, array) {
    listener.everyMinute(minutes);
  });
}, 60000);

/* every second */
var seconds = 0;
tick.interval(function() {
  player.everySecond(seconds);

  if (seconds == 60) seconds = 0;
  else seconds++;

  intervalEvents.forEach(function(listener, index, array) {
    listener.everySecond(seconds);
  });

}, 1000);

game.addIntervalEvent = function(listener) {
  intervalEvents.push(listener);
};

game.addMinuteListener = function(listener) {
  minuteListeners.push(listener);
};

game.addTimeout = function(listener, time) {
  tick.timeout(listener, time);
}

/*
* Keyboard
*/

var keyboard = new Keyboard(game);
var keysDown = keyboard.keysDown;


/*
* Mouse
*/

var mouse = new Mouse(game);

mouse.on('click', function(){
	if (game.paused) game.resume();
	else game.pause();
});


/*
* Player
*/

var player = new Player({
  game: game,
  keysDown: keysDown,
  camera: camera,
  position: { x: 830, y: 900 }
});

player.addTo(game);

player.everySecond = function() {
  if(game.currentScene.name == 'day'){

  }

  if(game.currentScene.name == 'night'){

  }
}

player.everyMinute = function(){
	if(game.currentScene.name == 'day'){

  }

  if(game.currentScene.name == 'night'){

  }
}


/*
*
* MAP & CAMERA
*
*/

var map = new Map(game, 5000, 5000);
map.generate();

var camera = new Camera({
  game: game,
  follow: player,
  followPoint: { x: game.width / 2, y: game.height / 2 },
  viewport: { width: game.width, height: game.height },
  map: map
});


/*
* Scenes
*/

var scene = new SceneManager(game);


/*
* Day
*/

var day = scene.create({
	name: 'day'
});

/* start with day scene */
scene.set(day);

day.on('start', function(){
	console.log('day is starting');
});

day.on('update', function(interval){

});

day.on('draw', function(context){

});

day.on('draw-background', function(c){

});

day.on('draw-foreground', function(c){
  c.fillStyle = 'rgba(255, 255, 255, 0.2)';
  c.fillRect(0, 0, game.width, game.height);
});


/*
* Night
*/

var night = scene.create({
	name: 'night'
});

night.on('start', function(){
	console.log('night is starting')
});

night.on('update', function(interval){

});

night.on('draw', function(c){

});

night.on('draw-background', function(c){

});

night.on('draw-foreground', function(c){
  c.fillStyle = 'rgba(0, 0, 0, 0.5)';
  c.fillRect(0, 0, game.width, game.height);
});

//addIntervalEvent(player.everySecond);

var healthMeter = new Meter({
  game: game,
  camera: camera,
  name: "health",
  color: "red",
  position: { x: 10, y: 10 }
});
healthMeter.addTo(game);

var energyMeter = new Meter({
  game: game,
  camera: camera,
  name: "energy",
  color: "blue",
  position: { x: 10, y: 30 }
});
energyMeter.addTo(game);

var moneyMeter = new Meter({
  game: game,
  camera: camera,
  name: "money",
  color: "green",
  position: { x: 10, y: 50 }
});
moneyMeter.addTo(game);


/*
*
* INVENTORY & ITEMS
*
*/

var inventory = new Inventory(game);

var shelterFood = new Item({
  name: 'Shelter Food',
  healthMeter: healthMeter,
  inventory: inventory,
  position: { x: 500, y: 140 },
  size: { x: 20, y: 20 },
  weight: 2,
  healing: 5
});

shelterFood.addTo(game);

shelterFood.on('update', function(){
	if (player.touches(shelterFood)){
		console.log('hmm, guess this will do for now');
		shelterFood.remove();
          inventory.add(shelterFood);
          energyMeter.add(10);
          healthMeter.add(5);
	}
});

shelterFood.on('draw', function(c){
	c.fillStyle = '#ff0000';
	c.fillRect(
		this.position.x - camera.position.x,
		this.position.y - camera.position.y,
		this.size.x,
		this.size.y
	);
});


var basicFood = new Item({
  name: 'Basic Food',
  healthMeter: healthMeter,
  inventory: inventory,
  position: { x: 450, y: 140 },
  size: { x: 20, y: 20 },
  weight: 3,
  healing: 10
});

basicFood.addTo(game);

basicFood.on('update', function(){
  if (player.touches(basicFood)){
    console.log('mmm mmmm good!');
    basicFood.remove();
    inventory.add(basicFood);
    energyMeter.add(15);
    healthMeter.add(10);
  }
});

basicFood.on('draw', function(c){
  c.fillStyle = '#0000ff';
  c.fillRect(
    this.position.x - camera.position.x,
    this.position.y - camera.position.y,
    this.size.x,
    this.size.y
  );
});


var goodFood = new Item({
  name: 'Good Food',
  healthMeter: healthMeter,
  inventory: inventory,
  position: { x: 550, y: 140 },
  size: { x: 20, y: 20 },
  weight: 3,
  healing: 20
});

goodFood.addTo(game);

goodFood.on('update', function(){
  if (player.touches(goodFood)){
    console.log('Yummy Yummy Yummy I got food in my tummy!');
    goodFood.remove();
    inventory.add(goodFood);
    goodFood.eat();
    energyMeter.add(20);
    healthMeter.add(15);
  }
});

goodFood.on('draw', function(c){
  c.fillStyle = '#3d4f2a';
  c.fillRect(
    this.position.x - camera.position.x,
    this.position.y - camera.position.y,
    this.size.x,
    this.size.y
  );
});


/*
* Wallet
*/

var wallet = new Wallet();


map.load(game, camera, "locations.json");

map.locations.forEach(function(location, index, array) {
  console.log("location");
  location.on('update', function(c) {
    if (player.touches(location)) {
      player.addBlocker(location);
      if (location.menu) {
        if (!location.menu.opened) {
          location.menu.opened = true;
          console.log("opening");
          location.menu.open();
        }
      }
    } else {
      player.removeBlocker(location);
    }
  });
});

var menus = {
  shop: new Menu({
    game: game,
    window: document.getElementById("dialog"),
    message: "Welcome to the store, please have a look around and let me know what you would like to purchase",
    close_timeout: 5,
    choices: [
      { "name": "choice1", "value": "choice 1" },
      { "name": "choice2", "value": "choice 2" }
    ]
  }),
  shelter: new Menu({
    game: game,
    window: document.getElementById("dialog"),
    message: "Welcome to the shelter.",
    close_timeout: 5,
    choices: [
      { "name": "choice1", "value": "choice 1" },
      { "name": "choice2", "value": "choice 2" }
    ]
  }),
  food_bank: new Menu({
    game: game,
    window: document.getElementById("dialog"),
    message: "Welcome to the Food bank",
    close_timeout: 5,
    choices: [
      { "name": "choice1", "value": "choice 1" },
      { "name": "choice2", "value": "choice 2" }
    ]
  }),
  office: new Menu({
    game: game,
    window: document.getElementById("dialog"),
    message: "Welcome to the store, please have a look around and let me know what you would like to purchase",
    close_timeout: 5,
    choices: [
      { "name": "choice1", "value": "choice 1" },
      { "name": "choice2", "value": "choice 2" }
    ]
  }),
  jail: new Menu({
    game: game,
    window: document.getElementById("dialog"),
    message: "Since you have behaved yourself in jail you are being released.",
    close_timeout: 5,
    choices: [
      { "name": "choice1", "value": "choice 1" },
      { "name": "choice2", "value": "choice 2" }
    ]
  })
};

map.locations.forEach(function(location, index, array) {
  location.menu = menus[location.id];
});
