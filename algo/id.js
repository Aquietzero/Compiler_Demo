/* ID deals with integer ids. A new id defaults to be
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

/* Name id deals with name ids. The id generator generates
 * new id according to the given name. If the given name is
 * already exist, then the generator returns -1 to denote 
 * the error. If the given name is not exist, then the gen-
 * erator will return a new id which is 1 larger than the
 * previous one.
 *
 * For example, the following operation sequence is one of
 * the possibility:
 *
 *          input      id
 *      ---------------------
 *      (1)  "A"  ---> 1
 *      (2)  "B"  ---> 2
 *      (3)  "A"  ---> -1
 *      (4)  "C"  ---> 3
 *
 * The id can be begin with a given value. Otherwise, it is
 * default to be 0.
 */

function NameID(begin) {
 
   this.id = begin || 0;
   this.names = new Array;
 
}

NameID.prototype.reset = function(begin) {

    this.id = begin || 0;
    this.names = new Array();

}

NameID.prototype.nextID = function(name) {

    for (var i = 0; i < this.names.length; ++i)
        if (this.names[i] == name)
            return i;

    this.names.push(name);
    return this.id++;

}

NameID.prototype.getID = function(name) {

    for (var i = 0; i < this.names.length; ++i)
        if (this.names[i] == name)
            return i;
    return -1;

}

NameID.prototype.currID = function(name) {

    return this.id;

}
