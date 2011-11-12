Array.prototype.contains = function(elem) {
    return this.indexOf(elem) != -1;
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
        this.splice(pos, pos + 1);
}

Array.prototype.pushArray = function(arr) {
    if (arr) {
        for (var i = arr.length - 1; i >= 0; --i)
            this.push(arr[i]);
    }
}
