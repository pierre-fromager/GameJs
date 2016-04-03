/**
 * Viewport object
 * 
 */
var Viewport = {
    event : 'resize'
    , width : 0
    , height : 0
    , reserve : 200
    , set : function(){
        var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0];
        this.width = (w.innerWidth || e.clientWidth || g.clientWidth) - this.reserve;
        this.height = (w.innerHeight || e.clientHeight || g.clientHeight) - this.reserve;
    }
    , init : function(){
        window.dispatchEvent(new Event(this.event));
    }
    , bind : function(){
        window.addEventListener(
            this.event
            , function(event) {Viewport.set();}
            , false
        );
    }
}

