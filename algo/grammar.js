
/* Grammar consists of a set of productions: 
 *
 *                 E  -> T E'
 *                 E' -> + T E' | e
 *                 T  -> F T'
 *                 T' -> * F T' | E
 *                 F  -> ( E ) | id
 *
 * The passing productions is an array input which contains the 
 * productions of the grammar.
 * This constructor passes each of the production to the constructor
 * Production to obtain an object of a production and then pushes it
 * to the grammar.
 * After parsing, the grammar should have the following form:
 *
 *                 [ 
 *                   production1,
 *                   production2,
 *                   production3,
 *                   production4,
 *                   production5
 *                 ]
 *
 * where, for example, production2 is as follows:
 *
 *                 production1.head = "E'",
 *                 production1.bodies = [["+", "T", "E'"], [e]],
 *                 production1.first  = [],
 *                 production1.follow = [];
 *
 */
function Grammar(terminals, productions) {
    this.terminals = terminals;
    this.productions = new Array();

    for (var i = 0; i < productions.length; ++i)
        this.productions.push(new Production(productions[i]));
}

Grammar.prototype.toString = function() {
    rst = "";
    for (var i = 0; i < this.productions.length; ++i)
        rst += this.productions[i].toString() + "\n";
    return rst;
}

Grammar.prototype.clone = function () {
    var terminals = this.terminals.clone();
    var productions = new Array();

    for (var i = 0; i < this.productions.length; ++i)
        productions.push(this.productions[i].toString());
    return new Grammar(terminals, productions);
}

/* Converts a grammar to its augmented form. Namely, if the current start 
 * nonterminal of the grammar is S, then its augmented form is the original
 * grammar with a new production like this: S' -> S
 */
Grammar.prototype.augmentedGrammar = function() {
    var currStart = this.productions[0].head;
    var newStart = new Production(currStart + "\# -> " + currStart);
    this.productions.unshift(newStart);
}

Grammar.prototype.getAugmentedProduction = function() {
    return this.productions[0].head.toString() + " -> " +
           this.productions[0].bodies[0].toString();
}

/* Given a nonterminal and returns its position in the productions 
 * array in grammar.
 */
Grammar.prototype.getNonterminalIndex = function(nonterminal) {
    for (var i = 0; i < this.productions.length; ++i) {
        if (this.productions[i].head == nonterminal)
            return i;
    }
    return -1;
};

/* Calculate the first sets of all the nonterminals in the grammar.
 */
Grammar.prototype.getFirstSets = function() {
    var production;
    for (var i = 0; i < this.productions.length; ++i) {
        production = this.productions[i];
        production.first = firstSet(this, production.head);
    }
};

/* Calculate the follow sets of all the nonterminals in the grammar.
 */
Grammar.prototype.getFollowSets = function() {
    var production;
    for (var i = 0; i < this.productions.length; ++i) {
        production = this.productions[i];
        production.follow = followSet(this, production.head);
    }
};

/* Reduce the redundancy in the grammar. If the input is like the
 * following way:
 *
 *              E' -> a
 *              E' -> b
 *              E' -> e
 *
 * Then this function will make it like this:
 *
 *          E' -> a | b | e
 */
Grammar.prototype.reduceRedundancy = function() {
    var i = 1;
    var j = i;

    while (this.productions[i]) {
        for (j = i - 1; j >= 0; --j) {
            if (this.productions[j].head == this.productions[i].head) {

                this.productions[j].bodies.pushArray(this.productions[i].bodies);
                this.productions.excludes(this.productions[i]);

                // The coming elements will shift one position forward after
                // excludes, so i must decrease in order to make up the change
                // of the current element.
                i--;
                break;
            }
        }
        i++;
    }
};



/* This algorithm only works if the given grammar is not cyclic or has no
 * "e" productions. The resulting grammar is non-left-recursive.
 */
Grammar.prototype.leftRecursionElimination = function() {
    var newProductions = new Array();    
    var newBodies = new Array();
    var prevHeads = new Array();
    var production, rest, substitute, head, newProduction;

    for (var i = 0; i < this.productions.length; ++i) {
        newBodies = [];
        // Current production.
        production = this.productions[i];

        // Get all of the nonterminals before the head of the current
        // production.
        for (var j = 0; j < i; ++j) 
            prevHeads.push(this.productions[j].head);        

        // Traverse the bodies of the current production.
        for (var j = 0; j < production.bodies.length; ++j) {
            // Get the head of the current body.
            head = production.bodies[j][0];

            if (prevHeads.contains(head)) {
                substitute = this.productions[this.getNonterminalIndex(head)];

                // Delete the head.
                rest = production.bodies[j].clone();
                rest.shift();

                for (var n = 0; n < substitute.bodies.length; ++n)
                    newBodies.push(substitute.bodies[n].concat(rest));

                production.bodies.excludesArray(
                    production.bodies[j]);
                j--;
            }
        }

        for (var j = 0; j < newBodies.length; ++j)
            production.bodies.push(newBodies[j]);

        newProduction = production.immediateLeftRecursionElimination();
        if (newProduction)
            newProductions.push(new Production(newProduction));
    }

    for (var i = 0; i < newProductions.length; ++i)
        this.productions.push(newProductions[i]);
};
