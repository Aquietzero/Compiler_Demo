var TERMINALS,
    GRAMMAR,
    MODIFIED_GRAMMAR,

    SENTENCE,
    PREDICTIVE_TABLE,
    RESULT,
    ITEMCOLLECTION,
    SLR_TABLE,

    INFIX,
    POSTFIX,
    REGULAR_EXPRESSION,
    NF_AUTOMATON,
    DF_AUTOMATON,

    RE_DEFINITION,
    ACTIONS;

function parseByLL_1() {

    var sentenceInput = $("#ll_1SentenceInput").val();
    SENTENCE = sentenceInput.split(" ");

    RESULT = predictiveAnalysis(PREDICTIVE_TABLE, SENTENCE);

}

function parseBySLR() {

    var sentenceInput = $("#slrSentenceInput").val();
    SENTENCE = sentenceInput.split(" ");

    RESULT = slrAnalysis(SLR_TABLE, SENTENCE, false);

}

function parseByLR_1() {

    var sentenceInput = $("#lr_1SentenceInput").val();
    SENTENCE = sentenceInput.split(" ");

    RESULT = slrAnalysis(SLR_TABLE, SENTENCE, true);

}

function getGrammar() {

    var terminalInput = $("#terminalsInput").val();
    var grammarInput = $("#grammarInput").val();

    TERMINALS = terminalInput.split(", ");
    GRAMMAR = new Grammar(TERMINALS, grammarInput.split("\n"));
    MODIFIED_GRAMMAR = new Grammar(TERMINALS, grammarInput.split("\n"));

}

function getLL_1Grammar() {

    // First get the original version of the grammar.
    MODIFIED_GRAMMAR = GRAMMAR.clone();

    MODIFIED_GRAMMAR.reduceRedundancy();
    MODIFIED_GRAMMAR.leftRecursionElimination();

    MODIFIED_GRAMMAR.getFirstSets();
    MODIFIED_GRAMMAR.getFollowSets();

    console.log(MODIFIED_GRAMMAR);

    PREDICTIVE_TABLE = new PredictiveTable(MODIFIED_GRAMMAR);

}

/* There is some problem here. For some grammar, which is left recursive, 
 * the first and follow set cannot be calculated correctly if the left
 * recursion is not eliminated. But calculating its item sets does not
 * need to know its first and follow set before hand. If the left recursion
 * is performed, the original grammar may be modified and the resulting
 * item sets maybe different from the one which is calculated without the
 * grammar being left recursion eliminated.
 */
function getLR_0Grammar() {

    MODIFIED_GRAMMAR = GRAMMAR.clone();

    MODIFIED_GRAMMAR.getFirstSets();
    MODIFIED_GRAMMAR.getFollowSets();

    MODIFIED_GRAMMAR.augmentedGrammar();
    ITEMCOLLECTION = new ItemSetCollection(MODIFIED_GRAMMAR, false);
    SLR_TABLE = new SLRAnalysisTable(
        MODIFIED_GRAMMAR, ITEMCOLLECTION, false);

    console.log(SLR_TABLE); console.log(MODIFIED_GRAMMAR); 

}

function getLR_1Grammar() {

    MODIFIED_GRAMMAR = GRAMMAR.clone();

    MODIFIED_GRAMMAR.getFirstSets();
    MODIFIED_GRAMMAR.getFollowSets();

    MODIFIED_GRAMMAR.augmentedGrammar();
    ITEMCOLLECTION = new ItemSetCollection(MODIFIED_GRAMMAR, true);
    SLR_TABLE = new SLRAnalysisTable(
        MODIFIED_GRAMMAR, ITEMCOLLECTION, true);

    console.log(ITEMCOLLECTION);

}

function getPostfix() {

    INFIX = $("#infixInput").val();
    INFIX += " #";

    REGULAR_EXPRESSION = new ReExpression(INFIX.split(" "));
    RESULT = REGULAR_EXPRESSION.toPostfix();
    POSTFIX = REGULAR_EXPRESSION.postfixExp;

}

function getNFARegularExpression() {

    INFIX = $("#nfaInput").val();
    INFIX += " #";

    REGULAR_EXPRESSION = new ReExpression(INFIX.split(" "));
    REGULAR_EXPRESSION.toPostfix();
    //REGULAR_EXPRESSION.deleteEndmarker();
    NF_AUTOMATON = new NFA(REGULAR_EXPRESSION);

}

function parseNFARegularExpression() {

    var reInput = $("#nfaReSentenceInput").val();

    reInput += " #";
    RESULT = NF_AUTOMATON.scan(reInput.split(" "));

}

function getDFARegularExpression() {

    INFIX = $("#dfaInput").val();
    INFIX += " #";

    REGULAR_EXPRESSION = new ReExpression(INFIX.split(" "));
    REGULAR_EXPRESSION.toPostfix();
    //REGULAR_EXPRESSION.deleteEndmarker();
    NF_AUTOMATON = new NFA(REGULAR_EXPRESSION);
    DF_AUTOMATON = new DFA(NF_AUTOMATON);

}

function parseDFARegularExpression() {

    var reInput = $("#dfaReSentenceInput").val();

    reInput += " #";
    RESULT = DF_AUTOMATON.scan(reInput.split(" "));

}

function getReDefinition() {

    RE_DEFINITION = $('#lexerReDefinitionInput').val();
    ACTIONS = $('#lexerActionsInput').val();
}

window.onload = function() {
    //============ TEST AREA ================
    var re = "( a | b ) * a b b #";
    //var re = "{ letter } ( { letter } | { digit } ) * #";
    //var re = "a * ( b a * b ) * | b * ( a b * a ) * b * #";
    //var re = "c * d ( c | d ) * #";
    //var re = 'a | b #';
    var reTest = new ReExpression(re.split(" "));

    //reTest.toPostfix();
    //reTest.establishAST();
    //reTest.deleteEndmarker();

    //var nfaTest = new NFA(reTest);
    //var dfaTest = new DFA(nfaTest);

    //console.log(nfaTest.displayNFA());
    //console.log(dfaTest.displayDFA());
    
    var lex = "letter -> a | b | c | d\n" +
              "digit  -> 1 | 2 | 3 | 4\n" +
              "id     -> letter ( letter | digit ) *\n" +
              "number -> digit digit *";
    var actions = "{id} -> {return(ID);}\n" +
                  "{number} -> {return(NUM)}\n" +
                  ">=   -> {return(RELOP);}\n" +
                  "<=   -> {return(RELOP);}\n" +
                  "==   -> {return(RELOP);}\n" +
                  ">    -> {return(RELOP);}\n" +
                  "<    -> {return(RELOP);}";
    var lexInput = 'b12 >= d4 <= abc == b2 > 123 < 2123';

    //var lex = "digit  -> 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9\n" +
    //          "digits -> digit digit *\n" +
    //          "optionalFraction -> . digits | e";
    var lexerTest = new Lexer(lex, actions);

    console.log(lexerTest);
    //console.log(lexerTest.lexerNFA.displayNFA());
    console.log(lexerTest.lexerDFA.displayDFA());
    lexerTest.parse(lexInput);

};
