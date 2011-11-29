Array.prototype.contains = function(elem) {
    return this.indexOf(elem) != -1;
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
