var TERMINALS,
    GRAMMAR,
    MODIFIED_GRAMMAR,
    SENTENCE,
    PREDICTIVE_TABLE,
    RESULT,
    ITEMCOLLECTION,
    SLR_TABLE;

function parseByLL_1() {
    var sentenceInput = 
        document.getElementById("ll_1SentenceInput").value.toString();
    SENTENCE = sentenceInput.split(" ");

    RESULT = predictiveAnalysis(PREDICTIVE_TABLE, SENTENCE);
}

function parseBySLR() {
    var sentenceInput = 
        document.getElementById("slrSentenceInput").value.toString();
    SENTENCE = sentenceInput.split(" ");

    RESULT = slrAnalysis(SLR_TABLE, SENTENCE);
}

function getGrammar() {
    var terminalInput = document.getElementById("terminalsInput").value.toString();
    var grammarInput = document.getElementById("grammarInput").value.toString();

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

    console.log(SLR_TABLE);
    console.log(MODIFIED_GRAMMAR);
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

/*
function first(nonterminal) {
    var firstRst = new Array();

    if (terminal.contains(nonterminal)) {
        firstRst.push(nonterminal);
        return firstRst;
    }
}*/

window.onload = function() {
};
