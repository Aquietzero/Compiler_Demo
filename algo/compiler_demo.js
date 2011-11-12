var TERMINALS,
    GRAMMAR,
    SENTENCE;

function getSentence() {
    var sentenceInput = document.getElementById("sentence").value.toString();
    SENTENCE = sentenceInput.split(" ");

    var predictiveTable = new PredictiveTable(GRAMMAR);

    console.log(predictiveTable);
    predictiveAnalysis(predictiveTable, SENTENCE);
}

function getTerminal() {
    var terminalInput = document.getElementById("terminal").value.toString();
    TERMINALS = terminalInput.split(", ");
}

function getGrammar() {
    var grammarInput = document.getElementById("grammar").value.toString();

    GRAMMAR = new Grammar(TERMINALS, grammarInput.split("\n"));
    GRAMMAR.getFirstSets();
    GRAMMAR.getFollowSets();

    console.log(GRAMMAR);
}

function first(nonterminal) {
    var firstRst = new Array();

    if (terminal.contains(nonterminal)) {
        firstRst.push(nonterminal);
        return firstRst;
    }
}

window.onload = function() {
    document.getElementById("terminalConfirm").onclick = getTerminal;
    document.getElementById("grammarConfirm").onclick = getGrammar;
    document.getElementById("sentenceConfirm").onclick = getSentence;
};
