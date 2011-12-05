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

Production.prototype.toString = function() {
    var head = this.head.toString() + " -> ";
    var body = new Array();
    for (var i = 0; i < this.bodies.length; ++i) 
        body.push(this.bodies[i].join(" "));

    return head + body.join(" | ");
}

Production.prototype.clone = function() {
    var newProduction = new Production(this.toString());
    newProduction.first  = this.first.clone();
    newProduction.follow = this.follow.clone();

    return newProduction;
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
 * There are some tricks used here, for production:
 *          
 *          A -> Aa | ...
 *
 * The algorithm will ignore "A -> Aa" here because it believes when it gets
 * down to a specific level, the first set of A can finally be calculated 
 * without evaluating "A -> Aa". For a more general case, consider production:
 *
 *          A -> Ba | ...
 *          B -> Cb | ...
 *          C -> Ac | ...
 *
 * Here, the algorithm should ignore "C -> Ac", or the algorithm can never
 * terminate when it calculate First(A) to get First(C). So an auxiliary
 * array is used to keep track of the first nonterminal in the bodies. Look
 * at the procedure below:
 *
 *       Aim        Production      To Do      Track
 *     First(A)      A -> Ba       First(B)    [A, B]
 *     First(B)      B -> Cb       First(C)    [A, B, C]
 *     First(C)      C -> Ac       First(A)    [A, B, C, A]
 *                                                       ^
 * Since "A" appears again in the tracking array, causing the algorithm
 * cyclic, so there is no need to evaluate the First(A). It will be re-
 * evaluated when we calculate First(C) after obtaining First(A) and First(B).
 */
function firstSet(grammar, nonterminal) {
    return firstSetIteration(grammar, nonterminal, [nonterminal]);
}

function firstSetIteration(grammar, nonterminal, prevHeads) {
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
    console.log(nonterminal);
    var productionIndex = grammar.getNonterminalIndex(nonterminal);
    var production = grammar.productions[productionIndex];
    var firstSets = new Array();
    var subFirstSet;

    // For each body of the given nonterminal
    for (var i = 0; i < production.bodies.length; ++i) {
        // Avoid infinite recursion if the nonterminal is equal to
        // the beginning symbol of the body.
        if (prevHeads.contains(production.bodies[i][0]))
            continue;

        // For each nonterminal in the specific body.
        for (var j = 0; j < production.bodies[i].length; ++j) {
            prevHeads.push(production.bodies[i][j]);
            subFirstSet = firstSetIteration(grammar, production.bodies[i][j], prevHeads);
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
    if (nonterminals[0] == "$")
        return ["$"];

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
            firstSet = grammar.productions[nonterminalIndex].first.clone();
            firstSets.merge(firstSet);
            if (!firstSet.contains("e"))
                 break;
        }
    }

    return firstSets;
}



/* Calculate the follow set of the given nonterminal according to the
 * grammar. The function of prevHeads is the same as that in firstSet.
 */
function followSet(grammar, nonterminal) {
    return followSetIteration(grammar, nonterminal, [nonterminal]);
}

function followSetIteration(grammar, nonterminal, prevHeads) {
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
            // Since the nonterminal can appear more than once in the production, 
            // like "S -> C C", so we have to find out all positions that the 
            // nonterminal appear in the production. The follow set of each may
            // contribute a little to the final result.
            pos = body.getPositions(nonterminal);

            for (var n = 0; n < pos.length; ++n) {
                // The nonterminal is not in the production.
                if (pos[n] == -1) continue;

                // For the situation A -> aB
                if (pos[n] == body.length - 1 && !prevHeads.contains(production.head)) {
                    prevHeads.push(production.head);
                    followSets.merge(
                        followSetIteration(grammar, production.head, prevHeads));
                }

                // For the situation A -> aBb
                else {
                    var rest = body.slice(pos[n] + 1, body.length);
                    var firstSetOfRest = firstSetGeneral(grammar, rest);

                    // First(b) does not contains "e"
                    if (!firstSetOfRest.contains("e")) 
                        followSets.merge(firstSetOfRest);
                    // First(b) contains "e"
                    else {
                        firstSetOfRest.excludes("e");
                        followSets.merge(firstSetOfRest);
                        if (!prevHeads.contains(production.head)) {
                            prevHeads.push(production.head);
                            followSets.merge(
                                followSetIteration(grammar, production.head, prevHeads));
                        }
                    }
                }
            }
        }
    }

    return followSets;
}
