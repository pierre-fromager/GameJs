Number.prototype.limit = function(min, max) {
    var i = this;
    if (i < min) i = min;
    if (i > max) i = max;
    return i;
};