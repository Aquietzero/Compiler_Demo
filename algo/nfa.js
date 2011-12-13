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
    this.edge = new Array();

}

NFAState.prototype.addEdge = function(e) {

    this.edge.push(e);

}

function NFAEdge(prev, next, input) {

    this.prev = prev;
    this.next = next;
    this.input = input;

}

function NFA(reExp) {

    this.reExp = reExp;
    this.begin = undefined;
    this.end   = undefined;

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

        if (!currReElem.isOperator) {
            begin = new NFAState(id.nextID());
            end   = new NFAState(id.nextID());
            begin.addEdge(new NFAEdge(begin, end, currReElem.character));
        }
    
        else {
        
            switch (currReElem.character) {
            
                // Actually, nfa1, nfa2 are [begin, end] pairs.
                case "|":
                    begin = new NFAState(id.nextID());
                    end   = new NFAState(id.nextID());
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
                    begin = new NFAState(id.nextID());
                    end   = new NFAState(id.nextID());
                    nfa1 = nfaStack.pop();
                    begin.addEdge(new NFAEdge(begin, nfa1[0], "e"));
                    begin.addEdge(new NFAEdge(begin, end, "e"));
                    nfa1[1].addEdge(new NFAEdge(nfa1[1], end, "e"));
                    nfa1[1].addEdge(new NFAEdge(nfa1[1], nfa1[0], "e"));
                    break;
            
            }

        }

        nfaStack.push([begin, end]);
    }

    this.begin = nfaStack.top()[0];
    this.end   = nfaStack.top()[1];

}

