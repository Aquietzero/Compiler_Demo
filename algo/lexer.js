/* Lexer is a lexical parser. A normal lex program has three parts.
 * Manifest, regular definition and operations when the token is
 * recognized. But due to the limit of time and my capability, I only
 * achieve a little part of lexer. Frankly, I have no idea how I can
 * combine all the parts yet and I don't know how I can analyze the
 * user input operations, so I provide the simplest operations: 
 *
 *      (1) Return the token.
 *      (2) Install the id.
 *      (3) Install the number.
 *
 * The lexer takes a set of regular definition as the input, such as:
 *
 *      delim  [ \t\n]
 *      ws     {delim}+
 *      letter [A-Za-z]
 *      digit  [0-9]
 *      id     {letter}({letter}|{digit})*
 *      number {digit}+(\.{digit}+)?(E[+-]?{digit}+)?
 *
 * Of course, I don't provide so many regular expression operations
 * either. Only the basic operations are valid here. After taking the
 * regular definitions, the lexer will examine those definitions and
 * modify some of them, such as reduce the redundency and proper
 * substitutions.
 *
 * The structure of a lexer can be easily seen from the constructor
 * below.
 *
 *      (1) originReDefinitions:
 *          
 *          Stores the original input regular expression definition.
 *          Though not quite necessary, it can be used for showing
 *          messages. It has the form as the example given above.
 *
 *      (2) reDefinitions:
 *
 *          Stores the modified regular expression definition. The 
 *          input regular exxpression definition is not absolutely
 *          right. The modification of the input definition can 
 *          reduce some redundencies. Its structure is like:
 *
 *          [1] [token1, regular expression1]
 *          [2] [token2, regular expression2]
 *                          :
 *                          :
 *                          :
 *          [N] [tokenN, regular expressionN]
 *
 *      (3) reducedReDefinition:
 *
 *          Stores the reduced regular expression definition. It takes
 *          the regular expression with lower index as the explanation
 *          of those of higher index.
 *
 *      (4) actionTable:
 *
 *          Stores the 'token : action' pairs. When the lexer parses a 
 *          token, it looks for this table to take an appropriate action.
 *          Its structure is describe as below:
 *
 *         { 
 *            token1 : Token1(token1, reExp1, [action1_1, action1_2, ... action1_m]),
 *            token2 : Token2(token2, reExp2, [action2_1, action2_2, ... action2_m]),
 *                                  :
 *                                  :
 *                                  :
 *            tokenN : TokenN(tokenN, reExpN, [actionN_1, actionN_2, ... actionN_m]),
 *         }
 */

function Token(token, reExp, actions) {

    this.token = token;
    this.reExp = reExp;
    this.actions = actions;

}

function Lexer(reDefinitions, actions) {

    // Regular Expresions(String form).
    this.originReDefinitions = reDefinitions;

    // Regular Expressions(Array form).
    this.reDefinitions = []; 
    this.getReDefinition();

    // Reduced regular expression. All the regualr expression in this
    // dictionary will be a normal regular expression.
    this.reducedReDefinition = {};
    this.getReducedReDefinition();

    // Action table. The dictionary of 'token => actions' pairs.
    this.actionTable = {};
    this.getActionTable(actions);

    // NFA v.s. Token mapping is a dictionary which records how the 
    // sub NFA terminal states maps to the token.
    this.nfaTokenMapping = {};

    // This variable is only for output.
    this.nfas = '';

    // Lexer NFA.
    this.lexerNFA = new NFA();
    this.constructLexerNFA(this.actionTable);

    // Construct the DFA according to the NFA which is calculated above.
    this.lexerDFA = new DFA(this.lexerNFA);

    // A message that shows whether the parse is valid or what errors occures.
    this.parseMsg = '';
    this.parseRst = '';

}

Lexer.prototype.getReDefinition = function() {

    var lines = this.originReDefinitions.split("\n");
    var token, re;
    for (var i = 0; i < lines.length; ++i) {
        token = lines[i].split("->")[0].trim();
        //re    = lines[i].split("->")[1].trim().split(" ");
        re = lines[i].split("->")[1].trim();
        re = bracketProcessor(re)[0].split(' ');
        this.reDefinitions.push([token, re]);
    }

}

/* Pre-requisit: The reduced regular definition is not null. */
Lexer.prototype.getActionTable = function(actionsInput) {

    var lines = actionsInput.split('\n');
    var token, actions;
    for (var i = 0; i < lines.length; ++i) {
        token   = this.parseToken(lines[i].split('->')[0].trim());
        actions = this.parseAction(lines[i].split('->')[1].trim());

        if (token && actions)
            this.actionTable[token] = new Token(token[0], token[1], actions);
    }

}

/* Parse the token.
 * If the token is in the form '{token}', then this token should
 * have been pre-defined in the regular definitions and it should
 * also have been reduced by the method getReducedReDefinition.
 * So look up the reducedReDefinition table can get its regular
 * definition. Otherwise, if the token is a normal string such as
 * 'if', '>='. Then it must be one of the key words or operators.
 */
Lexer.prototype.parseToken = function(token) {

    // Not key words and basic operators.
    if (token[0] == '{' && token[token.length - 1]  == '}') {

        tokenName = token.slice(1, token.length - 1);
        if (tokenName != '')
            return [tokenName, this.reducedReDefinition[tokenName]];
        else // No token.
            return undefined;
        
    }
    // Key words and operators.
    else
        return [token, new ReExpression(token + '#')];
    
}

/* Parse the actions.
 * The actions should be in the form of '{ action1; action2; ... actionN; }',
 * This method separates those actions and store them in an array.
 */
Lexer.prototype.parseAction = function(actions) {

    if (actions[0] == '{' && actions[actions.length - 1] == '}') {

        actions = actions.slice(1, actions.length - 1);
        // Actions not empty.
        if (actions != '') {
            var lines = actions.split(';');
            // Ignore empty actions.
            lines = lines.filter(function(x) { return x.length != 0; });
            if (lines.length > 0) 
                return lines;
        }

    }

}

Lexer.prototype.getReducedReDefinition = function() {

    // Add the first regular expression to the reduced regular
    // expression definition set.
    var firstReDef = this.reDefinitions[0][1].clone();
    firstReDef.push("#");
    this.reducedReDefinition[this.reDefinitions[0][0]] =
        new ReExpression(firstReDef);

    // If there are only one regular expression, then further
    // reduction is useless.
    if (this.reDefinitions.length == 1)
        return;

    var msg = "";
    var currReDef, preReDef, modifiedReDef, groupReDef;
    // Scan each regular definition.
    for (var i = 1; i < this.reDefinitions.length; ++i) {
    
        // For a specific regular definition, scan each of its 
        // regular elements.
        currReDef = this.reDefinitions[i];                
        for (var j = 0; j < currReDef[1].length; ++j) {
            // Once a token appears, scan the previous regular
            // expressions to see if it has been defined before.
            if (currReDef[1][j].length > 1) {
                for (var n = 0; n < i; ++n) {

                    preReDef = this.reDefinitions[n];
                    // If the token is previously defined,  then uses
                    // its previous definition to replace the current
                    // one. Otherwise gives warning.
                    if (currReDef[1][j] == preReDef[0]) {
                        groupReDef = preReDef[1].clone();
                        groupReDef.unshift("(");
                        groupReDef.push(")");
                        currReDef[1].splice2(j, 1, groupReDef);
                    }
                    else
                        msg += "The lexical token " +
                               currReDef[1][j] +
                               " is undefined.";

                }
            }
        }

        modifiedReDef = currReDef[1].clone();
        modifiedReDef.push("#");
        this.reducedReDefinition[currReDef[0]] = 
            new ReExpression(modifiedReDef);
    
    }

    return msg;

}

/* This method constructs a general NFA for the given regular expressions.
 * Actually, its job is simple. A new beginning state connects all the
 * NFAs corresponds to the regular expressions. The new end state is the
 * conbination of those NFAs.
 */
Lexer.prototype.constructLexerNFA = function(actionTable) {

    var currReDef;
    var nfas = new Array();
    var alphabet = new Array();
    var nfa;
    var beginState, endState;
    var beginID, endID;

    // Construct all the NFAs of each regular expression definition.
    // The id begins with 1 because 0 is reserved for the begin state
    // of lexerNFA. And in order to make the ids different, each NFA
    // begins with the id of the end state of the previous NFA.
    beginID    = 1; 
    for (var token in actionTable) {
    
        currReDef = actionTable[token].reExp;
        currReDef.toPostfix();
        nfa = new NFA(currReDef, beginID);
        beginID = parseInt(nfa.end) + 1;
        nfas.push(nfa);

        // Since all the NFA here are all sub NFAs of the tokens, so the 
        // terminal state of the specific NFA is unique.
        this.nfaTokenMapping[nfa.end[0]] = actionTable[token].token;

        // Merge all the alphabets from different NFAs to make an alphabet
        // for the lexer NFA.
        alphabet.merge(nfa.alphabet);
    
    }

    // Construct the begin state and the end state.
    beginState = new NFAState(0);
    endState   = new Array();
    // Connect the begin state to all the NFAs.
    for (var i = 0; i < nfas.length; ++i) {
    
        nfa = nfas[i];

        this.nfas += nfa.displayNFA();

        beginState.addEdge(new NFAEdge(beginState, nfa.states[nfa.begin], "e"));
        endState.pushArray(nfa.end);
        for (var id in nfa.states) 
            this.lexerNFA.states[id] = nfa.states[id];
    
    }

    this.lexerNFA.begin = beginState.id;
    this.lexerNFA.end   = endState;
    this.lexerNFA.states[0] = beginState;
    this.lexerNFA.alphabet = alphabet;

}

/* The parsing model : double pointer.
 *
 *    a b c    >=    1 2 3
 *        ^            ^
 *      tokPtr      currPos
 *        ^
 *     tokState
 *  
 *  currPos  : The current position of the parsing sentence.
 *  tokPtr   : Records the last position of the previous matched token.
 *  tokState : The corresponding DFA state of the tokPtr.
 */
Lexer.prototype.parse = function(input) {

    var dfa = this.lexerDFA;    
    var tokPtr, prevTokPtr, currPos, symbol, tokState;
    var state = 0;
    var nfaState, token;

    // Reset parsing information.
    this.parseRst = '';
    this.parseMsg = '';

    prevTokPtr = 0;
    tokPtr = 0;
    input += '#'; // Add an endmarker manually.
    for (var currPos = 0; currPos < input.length; ++currPos) {

        // Ignore whitespace.
        if (input[currPos] == ' ')
            continue;

        // Detect invalid symbol.
        if (!this.lexerDFA.alphabet.contains(input[currPos])) {
            this.parseMsg += 'The input ' + input[currPos] +
                             ' is not a valid symbol in the alphabet.\n';
            break;
        }

        // If the scanning has not reach the end, then the scanning can
        // be freely continuing. But once the '#' appears, no more scanning
        // is allowed. So at this time, the next state is set to be undefined.
        if (input[currPos] != '#') {
            state = dfa.states[state][input[currPos]];

            // If the current state is one of the end state, then keep
            // going scanning according to the maximum matching and
            // record the current position.
            if (state && dfa.end.contains(dfa.endmarkerMove(state))) {
                tokPtr = currPos;
                tokState = dfa.endmarkerMove(state);
            }
        }
        else
            state = undefined;

        // No valid further state and needs a trace back. Matching
        // the nearest previous valid state.
        if (!state) {
           
            nfaState = Math.min(dfa.stateMapping[tokState]);            
            token = this.nfaTokenMapping[nfaState];
            state = 0;
            currPos = tokPtr;
            
            // No further transition in the DFA.
            if (currPos == prevTokPtr) {
                if (input[currPos + 1] != '#')
                    this.parseMsg += "No further transition in the DFA with the symbol \'" +
                                     input[currPos] + "\' in " + currPos + " and the comming symbol \'" + 
                                     input[currPos + 1] + '\'\n'; 
                break;
            }

            if (token)
                this.parseRst += token + ' ';
            prevTokPtr = tokPtr;

            // For the input end matching.
            if (input[currPos] == '#') {
                // If the scanning reaches the end of the input and the last token
                // matches, then matches it and return. 
                if (state && dfa.end.contains(dfa.endmarkerMove(state))) {
                    tokState = dfa.endmarkerMove(state);
                    nfaState = Math.min(dfa.stateMapping[tokState]);            
                    token = this.nfaTokenMapping[nfaState];
                    this.parseRst += token;
                }
                // If no tokens matched though the scanning reaches the end, a trace
                // back is needed.
                else {
                    nfaState = Math.min(dfa.stateMapping[tokState]);            
                    token = this.nfaTokenMapping[nfaState];
                    this.parseRst += token;
                    state = 0;
                    currPos = tokPtr;
                }
            }

        }
    }

    if (state && dfa.end.contains(dfa.endmarkerMove(state))) {
        tokState = dfa.endmarkerMove(state);
        nfaState = Math.min(dfa.stateMapping[tokState]);            
        token = this.nfaTokenMapping[nfaState];
        this.parseRst += token;
    }

    if (this.parseRst == '')
        this.parseMsg += 'The input sentence matches none of the patterns.';
    if (this.parseRst != '' && this.parseMsg == '')
        this.parseMsg += 'The input sentence is valid to the given pattern.';

}

