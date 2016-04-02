// http://jsperf.com/function-bind-performance
Function.prototype.bind = function(context) {
    var fn = this, linked = [];
    Array.prototype.push.apply(linked, arguments);
    linked.shift();

    return function() {
        var args = [];
        Array.prototype.push.apply(args, linked);
        Array.prototype.push.apply(args, arguments);
        return fn.apply(context, args);
    };
};