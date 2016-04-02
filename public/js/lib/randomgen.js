/**
 * RandomGen Random class manipulations
 * 
 * @scope : no instance just inheritance
 * 
 */
var RandomGen = function() {
    
    this.randomSeed = 1;
    
    this.getIntMinMax = function(min, max) {
        return parseInt(Math.floor(this._generator() * (max - min + 1)) + min);
    }
    
    this._generator = function(){
        var x = Math.sin(this.randomSeed++) * 10000;
        x = x - Math.floor(x);
        return x;
    }
}