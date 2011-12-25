function isDigit(c) {
    return c >= '0' && c <= '9';
}

function isLetter(c) {
    return c >= 'a' && c <= 'z' ||
           c >= 'A' && c <= 'Z';
}

function isUpperCase(c) {
    return c >= 'A' && c <= 'Z';
}

function isLowerCase(c) {
    return c >= 'a' && c <= 'z';
}

function bracketMatching(input) {
    var bracketStack = new Array();

    for (var i = 0; i < input.length; ++i) {
        if (input[i].equalsTo("(") ||
            input[i].equalsTo("[") ||
            input[i].equalsTo("{"))
            bracketStack.push(input[i]);
        else if (input[i].equalsTo(")") &&
                 bracketStack.top().equalsTo("("))
            bracketStack.pop();
        else if (input[i].equalsTo("}") &&
                 bracketStack.top().equalsTo("{"))
            bracketStack.pop();
        else if (input[i].equalsTo("]") &&
                 bracketStack.top().equalsTo("["))
            bracketStack.pop();
    }

    return bracketStack.isEmpty();
}
