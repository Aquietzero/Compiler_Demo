/* ll_1.js defines a class predictive table and some methods
 * related to LL(1) grammar and its parsing. The predictive
 * table is two dimensional, where the first dimension is the
 * nonterminals in the grammar while the second dimension is 
 * the terminals and the right endmarker of the grammar. The 
 * table is somewhat like the one shown as below:
 *
 *                                  Grammar
 *
 *                              E  -> TE'
 *                              E' -> +TE' | e
 *                              T  -> FT'
 *                              T' -> *FT' | e
 *                              F  -> (E) | id
 *
 *                          Predictive Analysis Table
 * -----------------------------------------------------------------------------------
 * |             |                           Inputs                                  |
 * | Nonterminal |-------------------------------------------------------------------|
 * |             |   id     |     +      |     *      |    (     |    )    |    $    |
 * |-------------|----------|------------|------------|----------|---------|---------|
 * |      E      | E -> TE' |            |            | E -> TE' |         |         |
 * |      E'     |          | E' -> +TE' |            |          | E' -> e | E' -> e |
 * |      T      | T -> FT' |            |            | T -> FT' |         |         |
 * |      T'     |          |  T' -> e   | T' -> *FT' |          | T' -> e | T' -> e |
 * |      F      | F -> id  |            |            | F -> (E) |         |         |
 * -----------------------------------------------------------------------------------
 *
 * An associative array will be used to simulate this kind of
 * two dimensional table.
 */

function PredictiveTable(grammar) {
    this.table       = new Array();
    this.startSymbol = grammar.productions[0].head;
    this.terminals   = grammar.terminals.clone();

    this.generateTable(grammar);
}

PredictiveTable.prototype.generateTable = function(grammar) {
    var production, body, first, follow, index;

    for (var i = 0; i < grammar.productions.length; ++i) {
        production = grammar.productions[i];
        for (var j = 0; j < production.bodies.length; ++j) {
            body = production.bodies[j];
            first = firstSetGeneral(grammar, body);

            // If e in First(alpha), for every terminal b in Follow(A), 
            // add A -> alpha to table[A, b].
            if (first.contains("e")) {
                first.excludes("e");
                follow = production.follow;

                for (var n = 0; n < follow.length; ++n) {
                    if (!this.table[[production.head, follow[n]]])
                        this.table[[production.head, follow[n]]] = body;
                }
                if (follow.contains("$"))
                    this.table[[production.head, "$"]] = body;
            }
            // For every a in First(alpha), add A -> alpha to the table[A, a].
            for (var n = 0; n < first.length; ++n) 
                this.table[[production.head, first[n]]] = body;
        }
    }
}


var ID = 0;

/* The predictive analysis algorithm based on the predictive table.
 */
function predictiveAnalysis(predictiveTable, input) {
    var stack = new Array();
    var matched = new Array();
    var rst = "";
    var action = "";
    ID = 0;

    input.push("$");
    stack.push("$");
    stack.push(predictiveTable.startSymbol);

    var X = stack[stack.length - 1];
    var ip = 0;
    rst = updateResult(rst, matched, stack, input, ip, action);
    while (X != "$") {
        if (X == "e")
            stack.pop();
        else if (X == input[ip]) {
            matched.push(input[ip]);
            stack.pop();
            action = "Matched " + input[ip];
            ip++;
        }
        else if (predictiveTable.terminals.contains(X)) {
            action = "error";
            break;
        }
        else if (!predictiveTable.table[[X, input[ip]]]) {
            action = "error";
            break;
        }
        else if (predictiveTable.table[[X, input[ip]]]) {
            action = X + " -> " + predictiveTable.table[[X, input[ip]]].join("");
            stack.pop();
            stack.pushArray(predictiveTable.table[[X, input[ip]]]);
        }
        X = stack[stack.length - 1];
        rst = updateResult(rst, matched, stack, input, ip, action);
    }

    return rst;
}

function updateResult(currRst, matched, stack, input, ip, action) {
    var currRow = "";

    if (stack[stack.length - 1] != "e") {
        currRow += "<td class='matched'>" + matched.join(" ") + "</td>"; 

        currRow += "<td class='stack'>"; 
        for (var i = stack.length - 1; i >= 0; --i)
            currRow += stack[i] + " ";
        currRow += "</td>";

        currRow += "<td class='input'>";
        for  (var i = ip; i < input.length; ++i)
            currRow += input[i] + " ";
        currRow += "</td>";

        currRow += "<td class='action'>" + action + "</td>";
        ID++;
        return currRst + "<tr id='predictiveAlgorithm" + ID + "'>" + currRow + "</tr>";
    }

    return currRst + "";
}
