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
 */

/* Pay attention to the bracket "()" and "{}", they are operators.
 * But these two bracket combinations are not take part in the 
 * regular expression evaluation since they will be eliminated
 * when the regular expression converts to its postfix form.
 */
var RE_OPERATORS = [ "*", "|", "~", "(", ")" ]; 
var RE_PRECEDENCY = {

    "("  : 0,
    ")"  : 0,
    "*"  : 9,
    "~"  : 8,
    "|"  : 7

};

var RE_OP_DIMENSION = {

    "("  : 0,
    ")"  : 0,
    "*"  : 1,
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

/* Before constructing the abstract syntax tree, it is necessary to add some
 * concatenations to the regular expression. Some of the extended operators
 * are not provided in this file. So the basic element in the normal regular
 * expression are only listed as follows:
 *      
 *      C: Letters and digits.
 *      *: Kleene closure.
 *      ~: Concatenation.
 *      |: Alternation.
 *
 * There are several situations where concatenations should be inserted. I 
 * list these situations as below:
 *
 *      C C -> C ~ C
 *      C ( -> C ~ (
 *      ) C -> ) ~ C
 *      * C -> * ~ C
 *      * ( -> * ~ (
 *      ) ( -> ) ~ (
 *    any # -> any ~ #
 *
 * reExpression is an array of the reElements. The special symbol "#"
 * indicates the end of a regular expression.
 */
function reExpression(reInput) {

    this.reExp = new Array();
    this.postfixExp = new Array();

    for (var i = 0; i < reInput.length; ++i)
        this.reExp.push(new reElement(reInput[i]));
    this.insertConcatenation();

}

reExpression.prototype.reToString = function() {

    var reString = new Array();

    for (var i = 0; i < this.reExp.length; ++i)
        reString.push(this.reExp[i].character);

    return reString.join(" ");

}

reExpression.prototype.rePostfixToString = function() {

    var reString = new Array();

    for (var i = 0; i < this.postfixExp.length; ++i)
        reString.push(this.postfixExp[i].character);

    return reString.join(" ");

}

/* Add concatenation to the input regular expression. Each cases can be
 * referred to the situations listed as above.
 */
reExpression.prototype.insertConcatenation = function() {
    if (this.reExp.length < 2)
        return;
    
    var left  = this.reExp[0]; 
    var right = this.reExp[1];
    var i = 1;

    while (!right.equalsTo("#")) {

        if (!left.isOperator   && !right.isOperator   ||
            !left.isOperator   && right.equalsTo("(") ||
            left.equalsTo(")") && !right.isOperator   ||
            left.equalsTo("*") && !right.isOperator   ||
            left.equalsTo("*") && right.equalsTo("(") ||
            left.equalsTo("(") && right.equalsTo(")")) {

            this.reExp.insert(new reElement("~"), i);
            i++;
        }

        left  = this.reExp[i];
        right = this.reExp[i + 1];
        i++;

    }

    // The concateneation between the endmarker and the last
    // character will be dealed with in the method toPostfix.
}

reExpression.prototype.toPostfix = function() {

    var currReElem;
    var opStack = new Array();
    var postfix = new Array();

    var i = 0;
    while (true) {

        currReElem = this.reExp[i];
  
        // The end of the infix regular expression.
        if (currReElem.equalsTo("#")) {
            while (!opStack.isEmpty())
                postfix.push(opStack.pop());

            postfix.push(new reElement("#"));
            postfix.push(new reElement("~"));

            break;
        }

        // Meets the "("
        if (currReElem.equalsTo("("))
            opStack.push(currReElem);

        // Meets the ")", pops the reElements until the "(" appears.
        else if (currReElem.equalsTo(")")) {
            while (!opStack.isEmpty() &&
                   !opStack.top().equalsTo("("))
                postfix.push(opStack.pop());
            opStack.pop(); // Pops the "(".
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

        // Character
        else
            postfix.push(currReElem);

        i++;
    }

    this.postfixExp = postfix;

}
