
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

    for (var i = 1; i < this.productions.length; ++i) {
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

/* Valid Productions in my compile demo should have the following form:
 *
 *                  E -> + T E' | e
 *                  -    ----------
 *                  ^         ^
 *                 head     bodies
 *
 * Using "->" to separate the production head and body. Number of white-
 * spaces around "->" does not matter. Cases in body are separated by
 * " | "(pay attention to the whitespace around). Terminals or Nonterminals
 * in those cases should also be separated by a whitespace.
 * The most important convention here is that the "ipsilon" is represented
 * by "e".
 */
function Production(production) {
    if (!production)
        return;

    // First parse to get the head and body.
    this.head   = production.split("->")[0].trim();    
    this.bodies = production.split("->")[1].trim();    

    // Second parse to get the multiple cases in the body.
    this.bodies = this.bodies.split(" | ");
    for (var i = 0; i < this.bodies.length; ++i)
        this.bodies[i] = this.bodies[i].split(" ");

    // Initialize the first and follow set.
    this.first  = new Array();
    this.follow = new Array();
}


/* Immediate left recursion elimination deal with the situation when there
 * are some production bodies begin with the production head. This is the
 * production method. And it returns the new production if there are 
 * necessity to excute the left recursion elimination.
 */
Production.prototype.immediateLeftRecursionElimination = function() {
    // Immediate left recursion elimination only works while "e" production
    // does not exsit.
    //var hasEpsilon = false;
    //if (this.bodies.containsArray(["e"]) != -1)
    //    hasEpsilon = true;

    var beginWithHead = new Array();
    var otherBodies   = new Array();
    var newHead       = this.head.toString() + "\'";

    // Separate bodies into two groups. One with the head as the beginning,
    // the other with other terminals or nonterminals as the beginning.
    for (var i = 0; i < this.bodies.length; ++i) {
        if (this.bodies[i][0] == this.head)
            beginWithHead.push(this.bodies[i]);
        else
            otherBodies.push(this.bodies[i]);
    }
    // There are no immediate left recursion.
    if (beginWithHead.length == 0) 
        return null;

    //if (hasEpsilon) 
    //    otherBodies.excludesArray(["e"]);
    for (var i = 0; i < otherBodies.length; ++i) {
        if (otherBodies[i][0] == "e")
            otherBodies[i][0] = newHead;
        else
            otherBodies[i].push(newHead); 
    }

    for (var i = 0; i < beginWithHead.length; ++i) {
        // Remove head
        beginWithHead[i].shift();
        beginWithHead[i].push(newHead);
        beginWithHead[i] = beginWithHead[i].join(" ");
    }
    beginWithHead.push(["e"]);

    this.bodies = otherBodies;
    beginWithHead = beginWithHead.join(" | ");
    return newHead.toString() + " -> " + beginWithHead;
};

/* Calculate the first set of the given nonterminal according to the grammar.
 */
function firstSet(grammar, nonterminal) {
    // If the given nonterminal turns out to be a terminal, then
    // directly pushes it to the first set and returns.
    if (grammar.terminals.contains(nonterminal))
        return [nonterminal];

    // If the given nonterminal is just empty, then directly pushes
    // it to the first set and returns.
    if (nonterminal == "e") 
        return ["e"];

    // If the given nonterminal is really a nonterminal in the grammar,
    // then checks each of the cases in its body and calculate all its
    // first sets. And then returns the union of those sub-first sets.
    var productionIndex = grammar.getNonterminalIndex(nonterminal);
    var production = grammar.productions[productionIndex];
    var firstSets = new Array();
    var subFirstSet;

    // For each body of the given nonterminal
    for (var i = 0; i < production.bodies.length; ++i) {
        // Avoid infinite recursion if the nonterminal is equal to
        // the beginning symbol of the body.
        if (nonterminal == production.bodies[i][0])
            continue;

        // For each nonterminal in the specific body.
        for (var j = 0; j < production.bodies[i].length; ++j) {
            subFirstSet = firstSet(grammar, production.bodies[i][j]);
            firstSets.merge(subFirstSet);
            if (!subFirstSet.contains("e"))
                break;
        }
    }

    return firstSets;
}

/* This function can only be called after all the first sets of the
 * nonterminals are calculated.
 */
function firstSetGeneral(grammar, nonterminals) {
    // If the nonterminals string begins with terminals, then the first
    // set of the nonterminal string is just the beginning terminal.
    if (grammar.terminals.contains(nonterminals[0]))
        return [nonterminals[0]];
    // If the nonterminals string has only one "e", then its first set
    // is just a "e", namely First(nonterminals) = {e}.
    if (nonterminals[0] == "e")
        return ["e"];

    var firstSets = new Array();

    var nonterminalIndex, firstSet;
    for (var i = 0; i < nonterminals.length; ++i) {
        // Current symbol is terminal
        if (grammar.terminals.contains(nonterminals[i])) {
            firstSets.push(nonterminals[i]);
            break;
        }
        // Current symbol is nonterminal
        else {
            nonterminalIndex = grammar.getNonterminalIndex(nonterminals[i]);
            firstSet = grammar.productions[nonterminalIndex].first;
            firstSets.merge(firstSet);
            if (!firstSet.contains("e"))
                 break;
        }
    }

    return firstSets;
}



/* Calculate the follow set of the given nonterminal according to the
 * grammar.
 */
function followSet(grammar, nonterminal) {
    var followSets = new Array();

    // If the given nonterminal is the start symbol, add the input right
    // endmarker to the follow set.
    if (nonterminal == grammar.productions[0].head)
        followSets.push("$");

    var production, pos, body;
    // For productions in each nonterminal. 
    for (var i = 0; i < grammar.productions.length; ++i) {
        production = grammar.productions[i];

        // For each production in a specific nonterminal.
        for (var j = 0; j < production.bodies.length; ++j) {
            body = production.bodies[j];
            pos = body.indexOf(nonterminal);

            // The nonterminal is not in the production.
            if (pos == -1) 
                continue;

            // For the situation A -> aB
            if (pos == body.length - 1) {
                // Avoid the recursion appearing in B -> aB
                if (nonterminal == production.head)
                    continue;
                followSets.merge(followSet(grammar, production.head));
            }
            // For the situation A -> aBb
            else {
                var rest = body.slice(pos + 1, body.length);
                var firstSetOfRest = firstSetGeneral(grammar, rest);

                // First(b) does not contains "e"
                if (!firstSetOfRest.contains("e")) 
                    followSets.merge(firstSetOfRest);
                // First(b) contains "e"
                else {
                    firstSetOfRest.excludes("e");
                    followSets.merge(firstSetOfRest);
                    followSets.merge(followSet(grammar, production.head));
                }
            }
        }
    }

    return followSets;
}
