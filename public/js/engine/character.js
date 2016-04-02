var Character = function(characterOptions) {
    this.name = (characterOptions.name) 
        ? characterOptions.name 
        : this.constructor;
    this.id = (characterOptions.id) 
        ? characterOptions.id 
        : this.constructor;
    this.kind = (characterOptions.kind) 
        ? characterOptions.kind 
        : 'm';
    this.className = (characterOptions.className) 
        ? characterOptions.className 
        : this.constructor;
    this.x = (characterOptions.x) 
        ? characterOptions.x 
        : 3;
    this.y = (characterOptions.y) 
        ? characterOptions.y 
        : 3;
    this.terrainId = (characterOptions.terrainId) 
        ? characterOptions.terrainId
        : 'terrain01';
    this.terrainClassName = (characterOptions.ClassName) 
        ? characterOptions.ClassName
        : 'terrains';
    this.width = (characterOptions.width) 
        ? characterOptions.width 
        : 60;
    this.height = (characterOptions.height) 
        ? characterOptions.height 
        : 60;
    this.allowedDirections = (characterOptions.allowedDirections) 
        ? characterOptions.allowedDirections 
        : [goUp,goDown,goRight,goLeft];
    this.allowedMovements = (characterOptions.allowedMovements) 
        ? characterOptions.allowedMovements 
        : [walking,staying,running,climbing];
    this.controller = (characterOptions.controller) 
        ? characterOptions.controller 
        : null;
    this.keyboardMapping = (characterOptions.keyboardMapping) 
        ? characterOptions.keyboardMapping 
        : null;
    this.isPlayer = (characterOptions.isPlayer) 
        ? characterOptions.isPlayer 
        : false;
    this.energy = (characterOptions.energy) 
        ? characterOptions.energy 
        : 1000;  
    this.movement = null;
    this.direction = null;
    this.life = (characterOptions.life) 
        ? characterOptions.life 
        : 5;
    this.memoryLimitOptions = (characterOptions.memoryLimitOptions) 
        ? characterOptions.memoryLimitOptions 
        : {
            'error' : 20
            , 'visited' : 20
        };
    this.memory = {
        limit : this.memoryLimitOptions
        , storage : {
            'error' : []
            , 'visited' : []
        }
    };
    this.scale = (characterOptions.scale) 
        ? characterOptions.scale 
        : 1;
    this.moveableElements = (characterOptions.moveableElements) 
        ? characterOptions.moveableElements 
        : ['e'];    
        
    var previousMovementName = '';
    this.speed = 1;
    this.bulletMode = false;
    this.key = null;
    
    // Dom inheritance
    Dom.call(this);
    RandomGen.call(this);
    
    this.setKey = function(key) {
        this.key = key;
    }
    
    this.getSchedulerState = function(){
        Oscilator.toggleFn(1); // sin
        Oscilator.toggleFnf(2); // sign
        Oscilator.amp = 1;
        Oscilator.freq = Scene.fps;//+ this.movement.speed;
        Oscilator.phase = 0;
        Oscilator.divider = 1;
        //Oscilator.x = parseInt(Scene.ticks.toString().substr(-3)) / (Scene.speed / 360);
        Oscilator.x = Scene.ticks;
        return (Oscilator.get() == -1) ? false : true;
    }
    
    this.changeMovement = function(movement) {
        this.movement = movement;
        this.speed = isNaN(this.movement.speed) ? 0 : this.movement.speed;
    }
    
    this.move = function() {
        this.movement.execute();
    }
    
    this.changeDirection = function(direction) {
        this.direction = direction;
    }
    
    this.go = function() {
        var coords = this.direction.execute(this.getPos());
        //this.checkMemory(coords);
        return coords;
    }
    
    this.getRandomPos = function(){
        var newCoods,newCoordsString = '';
        var rndDir = null;
        var rndMov = this.getIntMinMax(0, this.allowedMovements.length - 1);
        previousMovementName = this.movement.name;
        this.changeMovement(this.allowedMovements[rndMov]);
        this.move();
        var iter = 0;
        do {
            rndDir = this.getIntMinMax(0, this.allowedDirections.length - 1);
            this.changeDirection(this.allowedDirections[rndDir]);
            newCoods = this.go();
            newCoordsString = newCoods.x + ',' + newCoods.y;
            var dirFound = (iter < this.memory.limit.error);
            ++iter;
        } while(this.memory.storage.error.indexOf(newCoordsString) !== -1 && dirFound);
        return newCoods;
    }
    
    this.getKeyboard = function(){
        if (Key.hasDown()) {
            if (this.keyboardMapping[Key.getFirst()]) {
                if (new Date().getTime() % 3 == 0) {
                    this.changeMovement(walking);
                    this.move();
                    this.changeDirection(this.keyboardMapping[Key.getFirst()]);
                    return this.go();
                }
            }
        }
        return this.getPos();
    }
    
    this.toggleBulletMode = function(){
        this.bulletMode = !this.bulletMode;
    }
    
    this.requestTerrain = function(){
        if (this.controller == null) {
            return this.getRandomPos();
        }
        if (this.controller == 'keyboard') {
            var movableCoords = this.getKeyboard();
            return movableCoords;
        }
    }
    
    this.responseTerrain = function(responseCoords){
        var type = 'error';
        if (responseCoords) {
            if (responseCoords.accept === true) {
                this.setPos({
                    x : responseCoords.x
                    , y : responseCoords.y
                });
                type = 'visited';
            }
            if (responseCoords.element == 'e' || responseCoords.element == 'w') {
                this.addMemory(type, responseCoords);
            }
            this.refresh();
        }
    }
    
    this.addMemory = function(type, movableCoord, terrainElement){
        var memCoords = movableCoord.x + ',' + movableCoord.y;
        if (this.memory.storage[type].indexOf(memCoords) == -1) {
            this.memory.storage[type].push(memCoords);
            while (this.memory.storage[type].length > this.memory.limit[type]) {
                this.memory.storage[type].shift();
            }
        }
    }
    
    this.changeDirection(characterOptions.direction);
    this.changeMovement(characterOptions.movement);
    
    this.getPos = function(){
        return {
            x : this.x
            , y : this.y
        }
    }
    
    this.isMovable = function(element) {
        return (this.moveableElements.indexOf(element) != -1);
    }
    
    this.setPos = function(coord){
         this.x = coord.x;
         this.y = coord.y;
    }
    
    this.draw = function(){
        var unit = 'px';
        var characterElement = this.getCreatedElement(
            'div'
            , {
                id : this.id
                , className : this.className
                , style : {
                    left : ((this.width * this.scale ) * this.x) + unit
                    , top : ((this.height * this.scale) * this.y) + unit
                }
            }
        );
        this.getDomId(this.terrainId).appendChild(characterElement);
    }
    
    this.hydrate = function(options){
        for (prop in options) {
            if(prop in this) {
                this[prop] = options[prop];
            }
        }
        
    }
    
    this.refresh = function(){
        var unit = 'px';
        var characterElementObject = this.getDomId(this.id);
        var left =  ((this.width * this.scale ) * this.x);
        var top =  ((this.height * this.scale) * this.y);
        characterElementObject.style.left = left + unit;
        characterElementObject.style.top =  top + unit;
        if (this.bulletMode) {
            //console.log('Refresh');
            if (this.direction.name == 'goLeft') {
                this.removeClassName('bulletl');
                this.removeClassName('bulletr');
                this.toggleClassName('bulletl');
            } 
            if (this.direction.name == 'goRight') {
                this.removeClassName('bulletl');
                this.removeClassName('bulletr');
                this.toggleClassName('bulletr');
            }
        } 
        /*
        if (previousMovementName !== this.movement.name) {
            if (!previousMovementName) {
                this.toggleClassName('walking');
                previousMovementName = 'walking';
            }
            if (this.hasClassName(previousMovementName)) {
                this.toggleClassName(previousMovementName);
            }
            this.toggleClassName(this.movement.name);
        }*/
    }
};
