/* re.js defines a bunch of classes which are frequently used
 * in regular expression parsing. Parsing a regular expression
 * can be divided into several steps.
 *
 *      (1) build regular expression elements.
 *      (2) convert the infix regular expression to postfix.
 *      (3) add catenation symbols to the regular expression.
 *      (4) build an abstract syntax tree.
 *      (5) convert the AST to DFA.
 *
 * Different phases has different class to deal with.
 *      "*" Kleine closure.
 *      "+" Positive closure.
 *      "~" Concatenation of different regular expression elements.
 *      "?" Matches zero or one character.
 *      "\\" Escape character.
 *      "|" Union.
 */

/* Pay attention to the bracket "()" and "{}", they are operators.
 * But these two bracket combinations are not take part in the 
 * regular expression evaluation since they will be eliminated
 * when the regular expression converts to its postfix form.
 */
var RE_OPERATORS = [ "*", "+", "~", "?", "\\", "|", 
                     "{", "}", "(", ")"];

var RE_PRECEDENCY = {
    "\\" : 9,
    "{"  : 9,
    "}"  : 9,
    "("  : 9,
    ")"  : 9,
    "?"  : 7,
    "*"  : 9,
    "+"  : 9,
    "|"  : 6,
    "~"  : 5
};

var RE_OP_DIMENSION = {
    "\\" : 1,
    "{"  : 0,
    "}"  : 0,
    "("  : 0,
    ")"  : 0,
    "?"  : 1,
    "*"  : 1,
    "+"  : 1,
    "|"  : 2,
    "~"  : 2
};

/* reElement is the basic element in a regular expression. For example, 
 * given the input "{digit}", then there are three reElements in it. The
 * first one is "{", then the "digit" and the following "}". Each of the
 * reElement object has several auxilliary information. The character
 * describes what the reElement actually is. The isOperator boolean value
 * tells whether the given character is the basic regular expression
 * operator or not. The precedency is the priority of the operator. Then
 * the dimension tells how many operands the operator takes.
 */
function reElement(c) {
    this.character  = c;
    this.isOperator = RE_OPERATORS.contains(c);
    this.precedency = RE_PRECEDENCY[c] || 0;
    this.dimension  = RE_OP_DIMENSION[c] || 0;
}

reElement.prototype.equalsTo = function(c) {
    return this.character == c;
}

/* reExpression is an array of the reElements. The special symbol "#"
 * indicates the end of a regular expression.
 */
function reExpression(reInput) {
    this.reExp = new Array();
    this.postfixExp = new Array();
    for (var i = 0; i < reInput.length; ++i)
        this.reExp.push(new reElement(reInput[i]));
}

reExpression.prototype.toPostfix = function() {
    var currReElem;
    var opStack = new Array();
    var postfix = new Array();

    for (var i = 0; i < this.reExp.length; ++i) {
        currReElem = this.reExp[i];

        // The end of the infix regular expression.
        if (currReElem.equalsTo("#")) {
            while (opStack.length > 0)
                postfix.push(opStack.pop());
            postfix.push(currReElem);
        }
       
        // Meets the ")", pops the reElements until the "(" appears.
        else if (currReElem.equalsTo(")")) {
            while (!opStack.isEmpty() &&
                   !opStack.top().equalsTo("("))
                postfix.push(opStack.pop());
            opStack.pop(); // Pops the "(".
        }
        // Meets the "}", pops the reElements until the "{" appears.
        else if (currReElem.equalsTo("}")) {
            while (!opStack.isEmpty() &&
                   !opStack.top().equalsTo("{"))
                postfix.push(opStack.pop());
            opStack.pop(); // Pops the "{".
        }

        // Meets the operator.
        else if (currReElem.isOperator) {
            while (!opStack.isEmpty() && 
                   opStack.top().isOperator &&
                   opStack.top().precedency >= currReElem.precedency)
                postfix.push(opStack.pop());
            if (!currReElem.equalsTo("(") && !currReElem.equalsTo("{"))
                opStack.push(currReElem);
        }
        else
            postfix.push(currReElem);
    }

    this.postfixExp = postfix;
}
