var TERMINALS,
    GRAMMAR,
    MODIFIED_GRAMMAR,
    SENTENCE,
    PREDICTIVE_TABLE,
    RESULT,
    ITEMCOLLECTION;

function getSentence() {
    var sentenceInput = document.getElementById("sentenceInput").value.toString();
    SENTENCE = sentenceInput.split(" ");

    RESULT = predictiveAnalysis(PREDICTIVE_TABLE, SENTENCE);
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
    console.log(MODIFIED_GRAMMAR);

    MODIFIED_GRAMMAR.reduceRedundancy();
    MODIFIED_GRAMMAR.leftRecursionElimination();

    MODIFIED_GRAMMAR.getFirstSets();
    MODIFIED_GRAMMAR.getFollowSets();

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

    MODIFIED_GRAMMAR.reduceRedundancy();
    MODIFIED_GRAMMAR.leftRecursionElimination();

    MODIFIED_GRAMMAR.getFirstSets();
    MODIFIED_GRAMMAR.getFollowSets();

    // Get the original grammar back since there is no need to modified
    // the grammar for calculating its item sets.
    MODIFIED_GRAMMAR = GRAMMAR.clone();
    MODIFIED_GRAMMAR.augmentedGrammar();
    ITEMCOLLECTION = new ItemSetCollection(MODIFIED_GRAMMAR);
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
