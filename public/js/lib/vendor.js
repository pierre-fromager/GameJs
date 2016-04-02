function Vendor(){
    Dom.call(this);
    if(Vendor.prototype.instance){
        return Vendor.prototype.instance;
    }
    this.vendor = null;
    this.pattern = /^((M|m)oz|(W|w)ebkit|(K|k)html|(O|o)|(ms|MS)|Icab)(?=[A-Z])/;
    Vendor.prototype.instance = this;
}

Vendor.prototype.get = function(){
    //var pattern = /^((M|m)oz|(W|w)ebkit|(K|k)html|(O|o)|(ms|MS)|Icab)(?=[A-Z])/;
    var el = document.createElement('div');
    var css;
    for(css in el.style){
        if(this.pattern.test(css)){
            return css.match(this.pattern)[0];
        }
    }
}




