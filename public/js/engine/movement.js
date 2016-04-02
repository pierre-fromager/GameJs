// Movement Proto
var Movement = function(func) {
    this.move = func;
};

Movement.prototype.execute = function() {
    this.move();
};

// Movements pad
var staying = new Movement(function() {
    this.speed = 0;
    this.name = 'staying';
});

var crawling = new Movement(function() {
    this.speed = 0.2;
    this.name = 'crawling';
});

var climbing = new Movement(function() {
    this.speed = 0.3;
    this.name = 'climbing';
});

var swimming = new Movement(function() {
    this.name = 'swimming';
    this.speed = 0.4;
});

var walking = new Movement(function() {
    this.name = 'walking';
    this.speed = 1;
});

var running = new Movement(function() {
    this.name = 'running';
    this.speed = 2;
});

var flying = new Movement(function() {
    this.name = 'flying';
    this.speed = 3;
});