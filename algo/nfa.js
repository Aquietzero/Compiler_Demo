/* nfa.js defines one of the most important structures in 
 * regular expression parsing. Since most of the algorithms
 * relating to NFA have all been optimalized, so my imple-
 * mentations maybe less optimal. But I think that separate
 * the implementation of some of the optimal algorithms can
 * be better for demostration.
 *
 * I mainly use McMaughton-Yamada-Thompson algorithm to 
 * construct the NFA from a given regular expression. Rules
 * are listed as follows.
 *
 * Basic Rules:
 *
 * (1) e -> NFA
 *
 *                       e
 *      start -----> i -----> f
 *
 * (2) a -> NFA for a in alphabet.
 *
 *                       a
 *      start -----> i -----> f
 *
 * Reduce Rules:
 *
 * (1) r = s | t -> NFA
 *
 *                     ________________________
 *                    |                        | 
 *                    |  i(s)    N(s)     f(s) |
 *                    |__/__________________\__|
 *                      /                    \
 *                   e /                      \ e
 *                    /                        \
 *      start -----> i                          f
 *                    \                        /
 *                   e \                      / e
 *                     _\____________________/__
 *                    |  \                  /   |
 *                    |  i(t)    N(t)     f(t)  |
 *                    |_________________________|
 *
 *
 * (2) r = s t -> NFA
 *
 *
 *                    ________________________________________
 *                   |                 /    \                 |
 *                   |                / f(i) \                |
 *      start -----> |  i     N(s)   |        |   N(t)     f  | 
 *                   |                \ i(t) /                |
 *                   |_________________\____/_________________|
 *
 *
 * (3) r = s* -> NFA
 *
 *                                       
 *                                  ______________
 *                                 /      e       \
 *                          ______/________________\______
 *                       e |     |                  |     | e
 *      start -----> i ----|--> i(s)      N(s)    f(s) <--|---- f 
 *                    \    |______________________________|    /
 *                     \                                      /
 *                      \____________________________________/
 *                                        e
 *
 */

/* The relationship of NFAState and NFAEdge is shown as below.
 *                 
 *
 *               edgeA:
 *                   prev  : state1
 *                   next  : state2
 *                   input : a
 * 
 *      _________                 _________
 *     |         |    input a    |         |
 *     | state 1 | ------------> | state 2 |
 *     |_________|               |_________|
 *     
 *     id    : 1                  id    : 2
 *     edges : [edgeA]            edges : []
 *
 */
function NFAState(id) {

    this.id = id;
    this.edges = new Array();

}

NFAState.prototype.addEdge = function(e) {

    this.edges.push(e);

}

/* Search an edge according to the input in a specific state. */
NFAState.prototype.searchEdge = function(input) {

    var edges = new Array();
    for (var i = 0; i < this.edges.length; ++i) {
        if (this.edges[i].input == input)
            edges.push(this.edges[i]);
    }
    return edges;

}

function NFAEdge(prev, next, input) {

    this.prev = prev;
    this.next = next;
    this.input = input;

}

/* Nondeterministic Finite Automaton. */
function NFA(reExp) {

    this.reExp  = reExp;
    this.begin  = undefined;
    this.end    = undefined;
    this.states = {};

    this.constructNFA();

}

NFA.prototype.constructNFA = function() {

    var postfix = this.reExp.postfixExp;
    var nfaStack = new Array();
    var begin, end, edge;
    var nfa1, nfa2;
    var currReElem;
    var id = new IDGenerator(0);

    for (var i = 0; i < postfix.length; ++i) {
    
        currReElem = postfix[i];
        begin = new NFAState(id.nextID());
        end   = new NFAState(id.nextID());

        if (!currReElem.isOperator)
            begin.addEdge(new NFAEdge(begin, end, currReElem.character));
    
        else {
        
            switch (currReElem.character) {
            
                // Actually, nfa1, nfa2 are [begin, end] pairs.
                case "|":
                    nfa2 = nfaStack.pop();
                    nfa1 = nfaStack.pop();
                    begin.addEdge(new NFAEdge(begin, nfa1[0], "e"));
                    begin.addEdge(new NFAEdge(begin, nfa2[0], "e"));
                    nfa1[1].addEdge(new NFAEdge(nfa1[1], end, "e"));
                    nfa2[1].addEdge(new NFAEdge(nfa2[1], end, "e"));
                    break;

                case "~":
                    nfa2 = nfaStack.pop();
                    nfa1 = nfaStack.pop();
                    nfa1[1].addEdge(new NFAEdge(nfa1[1], nfa2[0], "e"));
                    begin = nfa1[0];
                    end   = nfa2[1];
                    break;

                case "*":
                    nfa1 = nfaStack.pop();
                    begin.addEdge(new NFAEdge(begin, nfa1[0], "e"));
                    begin.addEdge(new NFAEdge(begin, end, "e"));
                    nfa1[1].addEdge(new NFAEdge(nfa1[1], end, "e"));
                    nfa1[1].addEdge(new NFAEdge(nfa1[1], nfa1[0], "e"));
                    break;
            
            }

        }

        nfaStack.push([begin, end]);
        this.states[begin.id] = begin;
        this.states[end.id]   = end;
    }

    this.begin = nfaStack.top()[0];
    this.end   = nfaStack.top()[1];

}

/* Returns a set of NFA states which can be reached from the
 * states in the given state set when the epsilon transfer is
 * performed.
 */
NFA.prototype.epsilonClosure = function(states) {
    
    var closure = new Array();
    var stateStack = new Array();
    var currState, toStates;
    var count = 0;

    for (var i = 0; i < states.length; ++i)
        stateStack.push(states[i]);

    do {

        count = 0;
        currState = stateStack.pop();
        closure.push(currState);
        toStates = this.move([currState], "e");

        for (var i = 0; i < toStates.length; ++i) {

            if (!closure.contains(toStates[i])) {
                stateStack.push(toStates[i]);
                count++;
            }

        }

    } while (!stateStack.isEmpty());

    return closure;

}

/* Returns a set of NFA states which can be reached from the 
 * states in the given state set when meeting the input. If
 * there are no transformations on the input, then the original
 * states set will be returned.
 */
NFA.prototype.move = function(states, input) {

    var toStates = new Array();
    var currState, nextState;

    for (var i = 0; i < states.length; ++i) {
        
        currState = this.states[states[i]];
        for (var j = 0; j < currState.edges.length; ++j) {
            nextState = currState.edges[j].next.id;
            if (currState.edges[j].input == input &&
                !toStates.contains(nextState))
                toStates.push(nextState);
        }

    }

    return toStates;

}

NFA.prototype.scan = function(input) {

    var states = this.epsilonClosure([this.begin.id]);
    var nextStates;
    console.log("begin states : " + states);
    
    for (var i = 0; i < input.length; ++i) {

        nextStates = this.move(states, input[i]);
        if (!nextStates.isEmpty())
            states = this.epsilonClosure(nextStates);
        else
            break;
        console.log("temp states ---> " + states + "  input ---> " + input[i]);
    
    }

    console.log("final states ---> " + states);
    if (states.contains(this.end.id))
        return true;
    else
        return false;
}

NFA.prototype.test1 = function() {

    console.log("0 -> a : " + this.move([0], "a") + "\n" +
                "1 -> e : " + this.move([1], "e") + "\n" +
                "2 -> b : " + this.move([2], "b") + "\n" +
                "3 -> e : " + this.move([3], "e") + "\n" +
                "4 -> e : " + this.move([4], "e") + "\n" +
                "5 -> e : " + this.move([5], "e") + "\n" +
                "6 -> e : " + this.move([6], "e") + "\n" +
                "7 -> e : " + this.move([7], "e") + "\n" +
                "8 -> a : " + this.move([8], "a") + "\n" +
                "9 -> e : " + this.move([9], "e") + "\n" +
                "12 -> b : " + this.move([12], "b") + "\n" +
                "13 -> e : " + this.move([13], "e") + "\n" +
                "16 -> b : " + this.move([16], "b") + "\n" +
                "17 -> e : " + this.move([17], "e") + "\n" +
                "20 -> # : " + this.move([20], "#") + "\n" +
                "6,5 -> e : " + this.move([6, 5], "e"));

}

NFA.prototype.test2 = function() {

    console.log("e(6) : " + this.epsilonClosure([6]));
    console.log("e(0) : " + this.epsilonClosure([0]));

}
