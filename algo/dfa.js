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

    alphabet.push('#');
    stateStack.push(nfaStates);
    dfaState = id.nextID(nfaStates.sort().join(","));
    this.states[dfaState] = {};

    // Keep generate new states until the stack is empty.
    while (!stateStack.isEmpty()) {
        
        nfaStates = stateStack.pop();
        dfaState  = id.getID(nfaStates.sort().join(","));

        // For a specific state and a given input, calculate the epsilon
        // closure and add it to the 2-dimension table.
        for (var i = 0; i < alphabet.length; ++i) {
        
            nextNfaStates = nfa.epsilonClosure(
                            nfa.move(nfaStates, alphabet[i]));

            if (!nextNfaStates.isEmpty()) {
                nextDfaState = id.nextID(nextNfaStates.sort().join(","));
                if (!this.states[nextDfaState]) {
                    stateStack.push(nextNfaStates);
                    this.states[nextDfaState] = {};
                }
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
        if (this.end.contains(state))
            return true;
    }

    return false;

}

/* Display the DFA in a specific format which makes the debug
 * more convinient and easy.
 */
DFA.prototype.displayDFA = function() {

    var rst = 'DFA\n';
    var nextState;
    var alphabet = this.reExp.alphabet;

    rst += 'begin state: ' +
           this.begin + '\n';
    rst += 'end states: ';
    for (var i = 0; i < this.end.length; ++i)
        rst += this.end[i] + ' ';
    rst += '\n';

    for (var id in this.states) {
        rst += '\nstate ' + id + ': ';
        for (var i = 0; i < alphabet.length; ++i) {
            nextState = this.states[id][alphabet[i]];
            if (nextState)
                rst += '(' + nextState + ',' + alphabet[i] + ') ===> ';
            else
                rst += '(nothing,' + alphabet[i] + ') ===> ';
        }
    }

    return rst + '\n==============================\n';

}


