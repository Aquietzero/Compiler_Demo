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
    this.startState = 0;
    this.terminals  = grammar.terminals.clone();

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

SLRAnalysisTable.prototype.generateTable = 
    function(grammar, itemSetCollection) {

    var itemSet, item, nonterminal;
    var symbol, nextState, productionIndex, follow;
    for (var i = 0; i < itemSetCollection.itemSets.length; ++i) {
        
        itemSet = itemSetCollection.itemSets[i];
        for (var j = 0; j < itemSet.items.length; ++j) {

            item = itemSet.items[j];    

            symbol = item.body[item.position] || "";
            nextState = itemSetCollection.gotoTable[[i, symbol]] || "";

            // For situation "S# -> S.", which is the accept state.
            if (grammar.productions[0].head == item.head &&
                item.position == item.body.length)
                this.action[[i, "$"]] = ["a", -1];

            // For situation "A -> x.ab", shift operation.
            else if (item.position < item.body.length &&
                     this.terminals.contains(symbol))
                this.action[[i, symbol]] = ["s", nextState];

            // For situation "A -> a.", reduce operation.
            else if (item.position == item.body.length) {
                productionIndex = grammar.getNonterminalIndex(item.head);
                follow = grammar.productions[productionIndex].follow;
                for (var n = 0; n < follow.length; ++n)
                    this.action[[i, follow[n]]] = ["r", item];
            }
        }

        for (var j = 0; j < grammar.productions.length; ++j) {
            nonterminal = grammar.productions[j].head;
            this.goto[[i, nonterminal]] =
                itemSetCollection.gotoTable[[i, nonterminal]];
        }
    }
}
