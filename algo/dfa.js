/* There are two ways to construct a deterministic finite 
 * automaton. One way is to establish the DFA according to
 * the corresponding NFA. The other way is to directly 
 * establish the DFA according to the abstract syntax tree
 * given by the regular expression. These two methods are
 * both provided here.
 */

function DFA(nfa) {

    this.begin  = 0;
    this.end    = new Array();
    this.states = {};
    this.reExp  = nfa.reExp || undefined;
    this.alphabet = nfa.alphabet || ['#'];

    this.constructByNFA(nfa);

}

DFA.prototype.constructByNFA = function(nfa) {

    var nfaStates = nfa.epsilonClosure([nfa.begin]);
    var nextNfaStates;
    var dfaState, nextDfaState;
    var stateStack = new Array();
    var id = new NameID();
    var alphabet = nfa.alphabet.clone();

    stateStack.push(nfaStates);
    dfaState = id.nextID(nfaStates.sort().join(","));
    this.states[dfaState] = {};

    // Keep generate new states until the stack is empty.
    while (!stateStack.isEmpty()) {
        
        nfaStates = stateStack.pop();
        dfaState  = id.getID(nfaStates.sort().join(","));

        //console.log(nfaStates.sort().join(',') + '---' + dfaState);

        // For a specific state and a given input, calculate the epsilon
        // closure and add it to the 2-dimension table.
        for (var i = 0; i < alphabet.length; ++i) {
        
            nextNfaStates = nfa.epsilonClosure(
                            nfa.move(nfaStates, alphabet[i]));

            if (!nextNfaStates.isEmpty()) {
                // Get next DFA state according to the given name which is
                // given by the NFA state.
                nextDfaState = id.nextID(nextNfaStates.sort().join(","));
                // If the state is not in the DFA transfer table yet, push
                // it to the table.
                if (!this.states[nextDfaState]) {
                    stateStack.push(nextNfaStates);
                    this.states[nextDfaState] = {};
                }
                // Set current transfer rule.
                this.states[dfaState][alphabet[i]] = nextDfaState;

                if (!nextNfaStates.intersection(nfa.end).isEmpty() &&
                    !this.end.contains(nextDfaState))
                    this.end.push(nextDfaState);
            }

        }
    
    }

}

DFA.prototype.constructByAST = function() {

}

DFA.prototype.scan = function(input) {

    var state = 0;
    for (var i = 0; i < input.length; ++i) {
        state = this.states[state][input[i]];
    }

    if (this.end.contains(state)) return true;
    else                          return false;

}

/* Display the DFA in a specific format which makes the debug
 * more convinient and easy.
 */
DFA.prototype.displayDFA = function() {

    var rst = 'DFA\n';
    var nextState;
    var alphabet = this.alphabet;

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


