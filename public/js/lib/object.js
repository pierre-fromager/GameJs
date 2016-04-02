Object.prototype.SumValues = function(){
    var sum = 0;
    for( var el in this ) {
        if( this.hasOwnProperty( el ) ) {
            sum += parseFloat( this[el] );
        }
    }
    return sum;
}