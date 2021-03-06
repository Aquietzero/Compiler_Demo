Array.prototype.contains = function(elem) {
    return this.indexOf(elem) != -1;
}

Array.prototype.first = function() {
    return this[0];
}

Array.prototype.last = function() {
    return this[this.length - 1];
}

Array.prototype.top = function() {
    return this[this.length - 1] || undefined;
}

Array.prototype.isEmpty = function() {
    return this.length == 0;
}

Array.prototype.containsArray = function(arr) {
    for (var i = 0; i < this.length; ++i) {
        if (this[i].length == arr.length) {
            var j;
            for (j = 0; j < arr.length; ++j)
                if (arr[j] != this[i][j])
                    break;
            if (j == arr.length)
                return i;
        }
    }
    return -1;
}

Array.prototype.merge = function(arr) {
    if (arr) {
        for (var i = 0; i < arr.length; ++i) {
            if (!this.contains(arr[i]))
                this.push(arr[i]);
        }
    }
}

Array.prototype.excludes = function(elem) {
    var pos = this.indexOf(elem);
    if (pos != -1) 
        this.splice(pos, 1);
}

Array.prototype.excludesArray = function(arr) {
    var pos = this.containsArray(arr);
    if (pos != -1)
        this.splice(pos, 1);
}

Array.prototype.pushArray = function(arr) {
    if (arr) {
        for (var i = arr.length - 1; i >= 0; --i)
            this.push(arr[i]);
    }
}

Array.prototype.clone = function() {
    var newArr = new Array();
    for (var i = 0; i < this.length; ++i)
        newArr.push(this[i]);
    return newArr;
}

Array.prototype.equalsTo = function(arr) {
    if (this.length != arr.length)
        return false;

    for (var i = 0; i < this.length; ++i)
        if (arr[i] != this[i])
            return false;
    return true;
}

Array.prototype.getPositions = function(elem) {
    var posistions = new Array();
    for (var i = 0; i < this.length; ++i)
        if (this[i] == elem)
            posistions.push(i);
    return posistions;
}

Array.prototype.intersection = function(arr) {
    var intersection = new Array();
    for (var i = 0; i < arr.length; ++i)
        if (this.contains(arr[i]))
            intersection.push(arr[i]);
    return intersection;
}

/* Insert expands the array.
 * Add only adds an element to the array if the given
 * position in the array has not been occupied.
 */
Array.prototype.insert = function(elem, pos) {
    this.splice(pos, 0, elem);
}

Array.prototype.splice2 = function(start, count, arr) {
    this.splice(start, count);
    for (var i = 0; i < arr.length; ++i)
        this.splice(start + i, 0, arr[i]);
}
