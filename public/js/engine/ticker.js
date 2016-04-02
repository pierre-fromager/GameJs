/**
 * Ticker sticks to tick
 * 
 */

function Ticker(fpms){
    // Singleton Ticker is maybe the best practice for now.
    if(Ticker.prototype.instance){
        return Ticker.prototype.instance;
    }
    Dom.call(this);
    this.startTime = +new Date();
    this.lastTime = +new Date();
    var hasPerformance = !!(window.performance && window.performance.now);
    this.fpms = (fpms) 
        ? parseFloat(fpms)
        : 0.06;
    this.vendor = this.getVendor();
    this.performance = hasPerformance ? window.performance : {};
    this.performance.now = this.performance.now || this._now;
    this.lastRequestTime = 0;
    this.maxElapsedMS = 100;
    this.timeBase = 1000;
    this.elapsedMS = 1 / this.fpms;
    this.deltaTime = 1;
    this.speed = 1;
    delete(Ticker.prototype._now);
    window.requestAnimationFrame = (
        window.requestAnimationFrame
        || window[this.vendor + 'RequestAnimationFrame']
        || this._request
    );
    delete(Ticker.prototype._request);
    window.cancelAnimationFrame = (
        window.cancelAnimationFrame
        || window[this.vendor + 'CancelAnimationFrame']
        || window[this.vendor + 'CancelRequestAnimationFrame']
        || this._cancel
    );
    delete(Ticker.prototype._cancel);
    Ticker.prototype.instance = this;
}

Ticker.prototype.getVendor = function(){
    var pattern = /^((M|m)oz|(W|w)ebkit|(K|k)html|(O|o)|(ms|MS)|Icab)(?=[A-Z])/;
    var el = document.createElement('div');
    var css, raw = '';
    for(css in el.style){
        if(pattern.test(css)){
            return css.match(pattern)[0];
        }
    }
}

Ticker.prototype.start = function(callback, context){
    if(this.frame){
        return void(0);
    }
    var args = Array.prototype.slice.call(arguments, 2);
    var scope = this;
    this.lastRequestTime = this.performance.now();
    (function tick(now){
        var elapsedMS = scope.elapsedMS = now - scope.lastRequestTime;
        if(elapsedMS > scope.maxElapsedMS){
            elapsedMS = scope.maxElapsedMS;
        }
        scope.deltaTime = elapsedMS * scope.fpms * scope.speed;
        callback.apply(context, [scope.deltaTime].concat(args));
        scope.lastRequestTime = now;
        scope.frame = window.requestAnimationFrame(tick);
    }(this.performance.now()));
};

Ticker.prototype.stop = function(){
    window.cancelAnimationFrame(this.frame);
    delete this.frame;
};

Ticker.prototype.setMinFPS = function(fps){
    var minFPMS = Math.min(Math.max(0, fps) / this.timeBase, this.fpms);
    this.maxElapsedMS = 1 / minFPMS;
};

Ticker.prototype.getMinFPS = function(){
    return this.timeBase / this.maxElapsedMS;
};

Ticker.prototype.getFPS = function(){
    return this.timeBase / this.elapsedMS;
};

// This method is deleted when `Ticker` is instantiated.
Ticker.prototype._request = function(callback){
    var currentTime, delay;
    var scope = Ticker.instance;
    currentTime = +new Date();
    delay = 16 + scope.lastTime - currentTime;
    delay = delay < 0 ? 0 : delay;
    scope.lastTime = currentTime;
    return window.setTimeout(
        function(){
            scope.lastTime = +new Date();
            callback(scope.now);
        }
        , delay
    );
};

// This method is deleted when `Ticker` is instantiated.
Ticker.prototype._cancel = function(frame){
    window.clearTimeout(frame);
};

// This method is deleted when `Ticker` is instantiated.
Ticker.prototype._now = function(){
    return +new Date() - Ticker.instance.startTime;
};