var Terrain = function(terrainOptions) {
    this.id = (terrainOptions.id) 
        ?  terrainOptions.id 
        : 'terrain01';
    this.className = (terrainOptions.className) 
        ?  terrainOptions.className 
        : 'terrain';
    this.elementsClassName = (terrainOptions.elementsClassName) 
        ?  terrainOptions.elementsClassName 
        : 'terrain';
    this.questElements = (typeof terrainOptions.questElements) 
        ?  terrainOptions.questElements 
        : ['n','d','e','t'];
    this.bouncedElements = (typeof terrainOptions.bouncedElements) 
        ? terrainOptions.bouncedElements 
        : ['w','b'];
    this.width = (typeof terrainOptions.width) 
        ? terrainOptions.width + 'px'
        : '1260px';
    this.height = (typeof terrainOptions.height) 
        ? terrainOptions.height + 'px'
        : '1260px';
    this.matrix = [];
    this.map = terrainOptions.map;
    this.elementPrefixId = 'elt_';
    this.emptyElementKind = 'e';
    this.side = 0;
    
    Dom.call(this);
    
    this.countQuestElements = function(){
        var count = 0;
        for (i = 0, k = -1; i < this.questElements.length; i++) {
            count += this.getPosByKind(this.questElements[i]).length;
        }
        var diff = this.getPosByKind('e').length;
        return count - diff;
    }
    
    this.setElementClassNameById = function(id,cls,cls2){
        this.removeClassName(cls,id);
        this.getDomId(id).ClassName += cls2;
    }
    
    this.setMap = function(map){
        this.map = map;
    }
    
    this.getMap = function() {
        return this.map;
    }
    
    this.getDimensions = function(){
        return Math.sqrt(this.map.length);
    }
    
    this.side = this.getDimensions() - 1;
    
    this.setMatrix = function() {
        this.matrix = this.map.split(this.getDimensions());
    }
    
    this.compareMapMatrix = function(){
        return (
            JSON.stringify(this.getMap())
                == JSON.stringify(this.getMatrixVector())
        );
    }
    
    this.getFirstElementPos = function(kind){
        kind = (kind) ? kind : 'e';
        var size= this.getDimensions();
        var index = this.getMatrixVector().indexOf(kind);
        return {
            x : index % size
            ,y : Math.floor(index / size)
        };
    }
    
    this.convertPosToCoord = function(pos){
        pos = (pos) ? pos : 0;
        return {
            x : pos % this.getDimensions()
            , y : Math.floor(pos / this.getDimensions())
        }
    }
    
    this.drawMap = function(){}
    
    this.getPosByKind = function(kind){
        kind = (kind) ? kind : this.emptyElementKind;
        return this.getMatrixVector()
        .map(
            function(k,v){return (k == kind) ? v : false;}
        )
        .filter(
            function(k,v){return (k != false);}
        );
    }
    
    this.getSolution = function(){
        var amazing = new Maze();
        amazing.exitCol = this.getExitCoords().x;
        amazing.exitRow = this.getExitCoords().y;
        amazing.solution(this.map, this.getDimensions());
        var solution = amazing.ssol;
        delete amazing;
        return solution;
    }
    
    this.getRandomPosByKind = function(kind) {
        var rawPos = this.getPosByKind(kind).shuffle().first();
        var coords = this.convertPosToCoord(rawPos);
        return coords;
    }
    
    this.getEntranceCoords = function(){
        return this.getFirstElementPos('i');
    }

    this.getNextEntranceCoords = function(){
        var entranceCoords = this.getEntranceCoords();
        var nextEntranceCoords = entranceCoords;
        if (this.getElementPos(entranceCoords.x + 1, entranceCoords.y) == this.emptyElementKind) {
             ++nextEntranceCoords.x;
        }
        if (this.getElementPos(entranceCoords.x - 1, entranceCoords.y) == this.emptyElementKind) {
             --nextEntranceCoords.x;
        }
        if (this.getElementPos(entranceCoords.x, entranceCoords.y + 1) == this.emptyElementKind) {
             ++nextEntranceCoords.y;
        }
        if (this.getElementPos(entranceCoords.x, entranceCoords.y - 1) == this.emptyElementKind) {
             --nextEntranceCoords.y;
        }
        return nextEntranceCoords;
    }
    
    this.getExitCoords = function(){
        return this.getFirstElementPos('o');
    }
    
    this.getMatrix = function(){
        return this.matrix;
    }
    
    this.getMatrixVector = function(){
        var vector = [];
        vector = vector.concat.apply(vector, this.matrix);
        return vector;
    }
    
    this.getElementPos = function(x, y) {
        var dim = this.getDimensions() - 1;
        x = x.limit(0, dim);
        y = y.limit(0, dim);
        return this.matrix[y][x];
    }
    
    this.setElementPos = function(coords , element){
        var dim = this.getDimensions() - 1;
        coords.x = coords.x.limit(0, dim);
        coords.y = coords.y.limit(0, dim);
        this.matrix[coords.y][coords.x] = element;
    }
    
    this.getElementPosByCoord = function(coords){
        return coords.x + (coords.y * this.getDimensions());
    }
    
    this.getElementIdByCoord = function(coords){
        return this.elementPrefixId + this.getElementPosByCoord(coords);
    }
    
    this.setElementMapPos = function(coords , element, _className){
        var index =  this.getElementPosByCoord(coords);
        this.map[index] = element;
        if (_className) {
            var elementMapPosId = this.elementPrefixId + index;
            var domElement = document.getElementById(elementMapPosId);
            domElement.className = _className;
        }
    }
    
    this.drawElements = function(){
        var domTerrain = this.getDomId();
        var dimensions = this.map.length;
        var redrawAble = ['b','w','i','o'];
        redrawAble = redrawAble.concat(this.questElements);
        var vector = this.getMatrixVector().map(
            function(k){
                return (redrawAble.indexOf(k) !== -1) 
                    ? k 
                    : this.emptyElementKind;
            }
        );
        for (i = 0; i < dimensions; i++) {
            var terrainElement = this.root.createElement('div');
            terrainElement.id = this.elementPrefixId + i;
            terrainElement.className = this.elementsClassName + ' ' + vector[i];
            domTerrain.appendChild(terrainElement);
        }
    }
    
    this.draw = function(){
        var terrain = this.getCreatedElement(
            'div'
            , {
                id : this.id
                , className : this.className
                , style : {
                    width : this.width
                    , height : this.height
                }
            }
        );
        this.root.body.appendChild(terrain);
        this.drawElements();
    }
    
    this.refresh = function(){
        this.removeChildsFromByClassName('element');
        this.drawElements();
    }
}