// Direction Proto
var Direction = function(func) {
    this.go = func;
};

Direction.prototype.execute = function(coords) {
    this.x = coords.x;
    this.y = coords.y;
    this.go();
    return {
        x : this.x
        , y : this.y
    }
};

// Direction pad
var goUp = new Direction(function() {
    this.name = 'goUp';
    --this.y;
});
            
var goDown = new Direction(function() {
    this.name = 'goDown';
    ++this.y;
});

var goLeft = new Direction(function() {
    this.name = 'goLeft';
    --this.x;
});

var goRight = new Direction(function() {
    this.name = 'goRight';
    ++this.x;
});