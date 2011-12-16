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
 */

function Lexer(reDefinitions) {

    this.originReDefinitions = reDefinitions;
    this.reDefinitions       = [];
    this.reducedReDefinition = {};
    this.lexerNFA            = {};

}

Lexer.prototype.getReDefinition = function() {

    var lines = this.originReDefinitions.split("\n");

    for (var i = 0; i < lines.length; ++i) {
    
        var token = lines[i].split("->")[0].trim();
        var re    = lines[i].split("->")[1].trim().split(" ");
    
        this.reDefinitions.push([token, re]);

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

}

Lexer.prototype.constructLexerNFA = function() {

    var currReDef;
    var nfas = new Array();
    var nfa;
    var beginState, endState;
    var beginID, endID;

    // Construct the beginning state.
    beginState = new NFAState(0);

    // Construct all the NFAs of each regular expression definition.
    beginID    = 1; 
    for (var i = 0; i < this.reducedReDefinition.length; ++i) {
    
        currReDef = this.reducedReDefinition[i];
        nfa = new NFA(currReDef, beginID);
        nfas.push(nfa);
        beginID = nfa.end.id + 1;
    
    }

    for (var i = 0; i < nfas.length; ++i) {
    
        nfa = nfas[i];

    
    }
}
