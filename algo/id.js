/* ID deal with integer ids. A new id defaults to be
 * zero. Each time nextId is call, the id increases 1.
 * Once you reset the id generator, the id will be 
 * reseted to 0.
 */

function IDGenerator(begin) {

    this.id = begin || 0;

}

IDGenerator.prototype.nextID = function() {
    
    return this.id++;

} 

IDGenerator.prototype.currID = function() {
    
    return this.id;

} 

IDGenerator.prototype.resetID = function() {

    this.id = 0;

}
