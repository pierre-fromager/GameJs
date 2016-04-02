/**
 * Dom class manipulations
 * 
 * @scope : no instance just inheritance
 * 
 */
var Dom = function() {
    
    this.root = document;
    this.vendorPattern = /^((M|m)oz|(W|w)ebkit|(K|k)html|(O|o)|(ms|MS)|Icab)(?=[A-Z])/;
    
    /**
     * getDomId
     * 
     */
    this.getDomId = function(id){
        var id = (id) ? id : this.id;
        return this.root.getElementById(id);
    }
    
    /**
     * hasClassName
     * 
     */
    this.hasClassName = function(cls, id){
        var hasClassName = (' ' + this.getDomId(id).className + ' ').indexOf(' ' + cls + ' ') > -1;
        return hasClassName;
    }
    
    /**
     * toggleClassName
     * 
     */
    this.toggleClassName = function(cls, id){
        if (cls) {
            var i = this.getDomId(id);
            var currentClass = i.className;
            if (this.hasClassName(cls)) {
                currentClass = currentClass.replace(cls,'');
            } else {
                currentClass += ' ' + cls + ' ';
            }
            currentClass = currentClass.replace(/\s+/g, ' ');
            i.className = currentClass;
        }
    }
    
    /**
     * removeClassName
     * 
     */
    this.removeClassName = function(cls, id){
        if (cls) {
            this.getDomId(id).className = this.getDomId(id).className.replace(cls,'');
        }
    }
    
    /**
     * removeChildsFromByClassName
     * 
     */
    this.removeChildsFromByClassName = function(cls, id) {
        if (cls) {
            var group = this.getDomId(id).getElementsByClassName(cls);
            while (group.length > 0) {
                group[0].parentNode.removeChild(group[0]);
            }
        }
    }
    
    /**
     * appendElementTo
     * 
     */
    this.appendElementTo= function(id, element) {
        if (element) {
            this.getDomId(id).appendChild(element);
        }
    }
    
    /**
     * getCreatedElement
     * 
     */
    this.getCreatedElement = function(tag, attributes){
        var element = this.root.createElement(tag);
        if (attributes) {
            for (var attrname in attributes) {
                if (typeof(attributes[attrname]) === 'object') {
                    if (attrname === 'style') {
                        attributes[attrname] = JSON.stringify(attributes[attrname])
                            .replaceArray(
                                [  '"', '{', '}', ',']
                                , ['' , '' , '' , ';']
                            );
                    }
                }
                element[attrname] = attributes[attrname]; 
            }
        }
        return element;
    }
    
    this.getVendor = function(){
        var el = this.getCreatedElement('div'), css;
        for(css in el.style){
            //console.log('check getVendor loop');
            //console.log('--' + css + '--');
            if(this.vendorPattern.test(css)){
                /*
                var predicate = css.match(this.vendorPattern)[0];
                alert('predicate : ' + predicate);
                //console.info('predicate : ' + predicate);
                return predicate;*/
                return css.match(this.vendorPattern)[0];
            }
        }
    }
}