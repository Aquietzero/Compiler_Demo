/* SLR analysis table is calculated based on the given grammar and the
 * LR(0) item set collection. The LR(0) item set collection gives some
 * hint of the goto function when it is generated. Actually, the two
 * parts in the table, namely action and goto, can be combined as one
 * dictionary structure. Considering for better expression and convertion
 * to html form, I abandon this idea and instead, I choose the same way
 * given in the Dragon Book. The table is somewhat like follows:
 *
 *                          Grammar
 *
 *                         E  -> TE'
 *                         E' -> +TE' | e
 *                         T  -> FT'
 *                         T' -> *FT' | e
 *                         F  -> (E) | id
 *
 *                       SLR Analysis Table
 * ------------------------------------------------------
 * |        |                    ACTION     |   GOTO    |
 * | STATES |-------------------------------|-----------|
 * |        |  id    +    *    (    )    $  |  E  T  F  |
 * |--------|-------------------------------|-----------|
 * |   0    |  s5             s4            |  1  2  3  |
 * |   1    |       s6                  acc |           |
 * |   2    |       r2   s7        r2   r2  |           |
 * |   3    |       r4   r4        r4   r4  |           |
 * |   4    |  s5             s4            |  8  2  3  |
 * |   5    |       r6   r6        r6   r6  |           |
 * |   6    |  s5             s4            |           |
 * |   7    |  s5             s4            |     9  3  |
 * |   8    |       s6            s11       |       10  |
 * |   9    |       r1   s7        r1   r1  |           |
 * |  10    |       r3   r3        r3   r3  |           |
 * |  11    |       r5   r5        r5   r5  |           |
 * ------------------------------------------------------
 */
function SLRAnalysisTable(grammar, itemSetCollection) {
    this.action = new Array();
    this.goto   = new Array();
    this.productionList = new Array();
    this.terminals      = grammar.terminals.clone();
    this.errorMsg       = "";

    this.getProductionList(grammar);
    this.generateTable(grammar, itemSetCollection);
}

/* Production list is a list of separated productions, each of which
 * only contains one body. For example, for grammar:
 *
 *              E -> E + T | T
 *              T -> T * F | F
 *              F -> (E) | id
 *
 * This method will split the above grammar into a list as follows:
 *
 *          (1) E -> E + T        (4) T -> F
 *          (2) E -> T            (5) F -> (E)
 *          (3) T -> T * F        (6) F -> id
 */
SLRAnalysisTable.prototype.getProductionList = function(grammar) {
    var production;
    for (var i = 0; i < grammar.productions.length; ++i) {
        production = grammar.productions[i];
        for (var j = 0; j < production.bodies.length; ++j) {
            this.productionList.push(new Item(
                production.head,
                production.bodies[j],
                0
            ));
        }
    }
}

SLRAnalysisTable.prototype.searchItemInProductionList = function(item) {
    for (var i = 1; i < this.productionList.length; ++i) 
        if (this.productionList[i].looselyEqualsTo(item))
            return i;
    return -1;
}

SLRAnalysisTable.prototype.generateAction = function(state, symbol, action) {

    console.log(this.action[[state, symbol]]);

    // accept state conflict
    if (this.action[[state, symbol]] && action[0] == "a")
        this.errorMsg += "accepted state conflict.\n";
 
    // shift state conflict
    else if (this.action[[state, symbol]] && action[0] == "s")
        this.errorMsg += "shift conflict in state " + state + 
                         ", when \'" + symbol + "\' encounters.\n";

    // reduce state conflict
    else if (this.action[[state, symbol]] && action[0] == "r")
        this.errorMsg += "reduce conflict in state " + state +
                         " with production \'" + action[1].head +
                         " → " + action[1].body.join("") +
                         "\'.\n";

    // no conflict
    else
        this.action[[state, symbol]] = action;
}

SLRAnalysisTable.prototype.generateTable = 
    function(grammar, itemSetCollection) {

    var itemSet, item, nonterminal;
    var symbol, nextState, productionIndex, follow;
    this.errorMsg = "";

    for (var i = 0; i < itemSetCollection.itemSets.length; ++i) {
        
        itemSet = itemSetCollection.itemSets[i];
        for (var j = 0; j < itemSet.items.length; ++j) {

            item = itemSet.items[j];    

            symbol = item.body[item.position] || "";
            nextState = itemSetCollection.gotoTable[[i, symbol]] || "";

            // For situation "S# -> S.", which is the accept state.
            if (grammar.productions[0].head == item.head &&
                item.position == item.body.length)
                this.generateAction(i, "$", ["a", -1]);

            // For situation "A -> x.ab", shift operation.
            else if (item.position < item.body.length &&
                     this.terminals.contains(symbol))
                this.generateAction(i, symbol, ["s", nextState]);

            // For situation "A -> a.", reduce operation.
            else if (item.position == item.body.length) {
                productionIndex = grammar.getNonterminalIndex(item.head);
                follow = grammar.productions[productionIndex].follow;
                for (var n = 0; n < follow.length; ++n)
                    this.generateAction(i, follow[n], ["r", item]);
            }
        }

        for (var j = 0; j < grammar.productions.length; ++j) {
            nonterminal = grammar.productions[j].head;
            this.goto[[i, nonterminal]] =
                itemSetCollection.gotoTable[[i, nonterminal]];
        }
    }
}

function slrAnalysis(slrTable, input) {
    var stack = [0];
    var symbol = new Array();
    var state, action;
    var ip, a;
    var rst = "";
    ID = 0;
    
    ip = 0;
    input.push("$");
    while (true) {

        a = input[ip];
        state = stack[stack.length - 1];
        action = slrTable.action[[state, a]];
        console.log(stack.join(" ") + "\t-----\t" + symbol.join(" ") + "\t-----\t" + a);

        rst += updateSLRResult(stack, symbol, input, ip, action);
        if (!action)
            // error
            break;

        if (action[0] == "s") {
            stack.push(action[1]);
            symbol.push(a);
            ip++;
        }
        else if (action[0] == "r") {
            if (action[1].body.length == 1 && action[1].body[0] == "e") {
                // do nothing
            }
            else 
                for (var i = 0; i < action[1].body.length; ++i) {
                    stack.pop();
                    symbol.pop();
                }
            state = stack[stack.length - 1];
            stack.push(slrTable.goto[[state, action[1].head]]);
            symbol.push(action[1].head);
        }
        else if (action[0] == "a")
            break;
    }

    return rst;
}

function updateSLRResult(stack, symbol, input, ip, action) {
    var currRow = "";

    if (!action) 
        return;

    currRow += "<td class='stack'>" + stack.join(" ") + "</td>";
    currRow += "<td class='symbol'>" + symbol.join(" ") + "</td>";
    
    currRow += "<td class='input'>";
    for (var i = ip; i < input.length; ++i)
        currRow += input[i] + " ";
    currRow += "</td>";

    currRow += "<td class='action'>"
    if (action[0] == "s")
        currRow += "<em>shift</em>";
    else if (action[0] == "r")
        currRow += "<em>reduce with </em>" + action[1].head +
                   " -> " + action[1].body.join("");
    else if (action[0] == "a")
        currRow += "<em>accepted</em>";
    currRow += "</td>";

    ID++;
    return "<tr id='slrAlgorithm" + ID + "'>" + currRow + "</tr>";
}
