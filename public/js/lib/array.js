/**
 * array shuffle 
 * 
 */
if (!Array.prototype.shuffle) {
    Array.prototype.shuffle = function() {
        var input = this;
        for (var i = input.length - 1; i > 0; i--) {
            var randomIndex = Math.floor(Math.random() * (i + 1));
            var itemAtIndex = input[randomIndex];
            input[randomIndex] = input[i];
            input[i] = itemAtIndex;
        }
        return input;
    }
}
/**
 * array first 
 * 
 */
if (!Array.prototype.first) {
    Array.prototype.first = function() {
        var input = this;
        return (input[0]) ? input[0] : false;
    }
}

Array.prototype.erase = function(item) {
    for (var i = this.length; i >= 0; i--) {
        if (this[i] === item) {
            this.splice(i, 1);
            return this;
        }
    }
    return this;
};

Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.split = function(w) {
    var splited = [];
    for (var i = 0; i < this.length; i+=w) {
        splited.push(this.slice(i, i+w));
    }
    return splited;
};

Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}

