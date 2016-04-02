String.prototype.replaceArray = function(find, replace) {
    var replaceString = this;
    var regex; 
    for (var i = 0; i < find.length; i++) {
        regex = new RegExp(find[i], 'g');
        replaceString = replaceString.replace(regex, replace[i]);
    }
    return replaceString;
};

String.prototype.replaceArrayLit = function(find, replace) {
    var replaceString = this;
        for (var i = 0; i < find.length; i++) {
          replaceString = replaceString.split(find[i]).join(replace[i]);
        }
    return replaceString;
};

String.prototype.splitLength = function(size) {
    var regex = new RegExp('.{1,' + size + '}', 'g');
    return this.match(regex);
};