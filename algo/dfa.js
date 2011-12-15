/* There are two ways to construct a deterministic finite 
 * automaton. One way is to establish the DFA according to
 * the corresponding NFA. The other way is to directly 
 * establish the DFA according to the abstract syntax tree
 * given by the regular expression. These two methods are
 * both provided here.
 */

function DFA(reExp) {

    this.reExp  = reExp;
    this.begin  = 0;
    this.end    = new Array();
    this.states = {};

}

DFA.prototype.constructByNFA = function(nfa) {

    var nfaStates = nfa.epsilonClosure([nfa.begin.id]);
    var nextNfaStates;
    var dfaState, nextDfaState;
    var stateStack = new Array();
    var id = new NameID();
    var alphabet = nfa.reExp.alphabet;

    stateStack.push(nfaStates);
    dfaState = id.nextID(nfaStates.sort().join(","));
    this.states[dfaState] = {};

    while (!stateStack.isEmpty()) {
        
        nfaStates = stateStack.pop();
        dfaState  = id.getID(nfaStates.sort().join(","));

        for (var i = 0; i < alphabet.length; ++i) {
        
            nextNfaStates = nfa.epsilonClosure(
                            nfa.move(nfaStates, alphabet[i]));
            nextDfaState = id.nextID(nextNfaStates.sort().join(","));

            if (!this.states[nextDfaState]) {
                stateStack.push(nextNfaStates);
                this.states[nextDfaState] = {};
            }

            this.states[dfaState][alphabet[i]] = nextDfaState;

            if (nextNfaStates.contains(nfa.end.id))
                this.end.push(nextDfaState);

        }
    
    }

}

DFA.prototype.constructByAST = function() {

}

DFA.prototype.scan = function(input) {

    var state = 0;
    for (var i = 0; i < input.length; ++i) {
        state = this.states[state][input[i]];
        console.log("curr State--->" + state);
        if (this.end.contains(state))
            return true;
    }

    return false;

}
