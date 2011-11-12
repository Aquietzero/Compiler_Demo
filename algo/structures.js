
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
 *                 production1.body = [["+", "T", "E'"], [e]],
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
}

/* Calculate the follow sets of all the nonterminals in the grammar.
 */
Grammar.prototype.getFollowSets = function() {
    var production;
    for (var i = 0; i < this.productions.length; ++i) {
        production = this.productions[i];
        production.follow = followSet(this, production.head);
    }
}



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
            if (!subFirstSet.contains("e"))
                break;
        }
        firstSets.merge(subFirstSet);
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
        nonterminalIndex = grammar.getNonterminalIndex(nonterminals[i]);
        firstSet = grammar.productions[nonterminalIndex].first;
        firstSets.merge(firstSet);
        if (!firstSet.contains("e"))
            break;
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
