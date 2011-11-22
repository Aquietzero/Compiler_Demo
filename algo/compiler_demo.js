var TERMINALS,
    GRAMMAR,
    MODIFIED_GRAMMAR,
    SENTENCE,
    PREDICTIVE_TABLE,
    RESULT,
    ITEMCOLLECTION;

function getSentence() {
    var sentenceInput = document.getElementById("sentence").value.toString();
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
    MODIFIED_GRAMMAR.reduceRedundancy();
    MODIFIED_GRAMMAR.leftRecursionElimination();

    MODIFIED_GRAMMAR.getFirstSets();
    MODIFIED_GRAMMAR.getFollowSets();

    PREDICTIVE_TABLE = new PredictiveTable(MODIFIED_GRAMMAR);
}

function getLR_0Grammar() {
    MODIFIED_GRAMMAR.getFirstSets();
    MODIFIED_GRAMMAR.getFollowSets();

    MODIFIED_GRAMMAR.augmentedGrammar();
    ITEMCOLLECTION = new ItemSetCollection(MODIFIED_GRAMMAR);
}


function first(nonterminal) {
    var firstRst = new Array();

    if (terminal.contains(nonterminal)) {
        firstRst.push(nonterminal);
        return firstRst;
    }
}

/* The following functions  mainly converts the result calculated by 
 * other functions into HTML language. Then being passed to the ui 
 * functions, this results can be well shown and explained the algorithm.
 */
function terminalsToHtml() {
    return "<pre>{" + TERMINALS.join(", ") + "}</pre>";
}

function grammarToHtml() {
    var rst = "";
    var production;
    var maxlength = headMaxLength();

    for (var i = 0; i < GRAMMAR.productions.length; ++i) {
        production = GRAMMAR.productions[i];
        // Insert the head and align.
        rst += production.head;
        for (var j = maxlength - production.head.length; j > 0; --j)
            rst += " ";

        rst += " -> ";

        // Insert the bodies.
        for (var j = 0; j < production.bodies.length; ++j) {
            rst += production.bodies[j].join("");
            if (j != production.bodies.length - 1)
                rst += " | ";
        }

        rst += "<br />";
    }

    return "<pre>" + rst + "</pre>";
}

function modifiedGrammarToHtml() {
    var rst = "";
    var production;
    var maxlength = headMaxLength();

    for (var i = 0; i < MODIFIED_GRAMMAR.productions.length; ++i) {
        production = MODIFIED_GRAMMAR.productions[i];
        // Insert the head and align.
        rst += production.head;
        for (var j = maxlength - production.head.length; j > 0; --j)
            rst += " ";

        rst += " -> ";

        // Insert the bodies.
        for (var j = 0; j < production.bodies.length; ++j) {
            rst += production.bodies[j].join("");
            if (j != production.bodies.length - 1)
                rst += " | ";
        }

        rst += "<br />";
    }

    return "<pre>" + rst + "</pre>";
}

function firstSetsToHtml() {
    var rst = "";
    var production;
    var maxlength = headMaxLength();

    for (var i = 0; i < MODIFIED_GRAMMAR.productions.length; ++i) {
        production = MODIFIED_GRAMMAR.productions[i];
        // Insert the head and align.
        rst += production.head;
        for (var j = maxlength - production.head.length; j > 0; --j)
            rst += " ";

        rst += " = { " + production.first.join(", ") + " }<br />";
    }

    return "<pre>" + rst + "</pre>";
}

function followSetsToHtml() {
    var rst = "";
    var production;
    var maxlength = headMaxLength();

    for (var i = 0; i < MODIFIED_GRAMMAR.productions.length; ++i) {
        production = MODIFIED_GRAMMAR.productions[i];
        // Insert the head and align.
        rst += production.head;
        for (var j = maxlength - production.head.length; j > 0; --j)
            rst += " ";

        rst += " = { " + production.follow.join(", ") + " }<br />";
    }

    return "<pre>" + rst + "</pre>";
}

function predictiveTableToHtml() {
    var rst = "";
    var nonterminal, terminal;
    var production;
    
    // Table head
    rst += "<tr><td rowspan='2'>Nonterminals</td>";
    rst += "<td colspan='" + MODIFIED_GRAMMAR.terminals.length + 1 + 
           "'>Inputs</td></tr>";
    rst += "<tr>";
    
    for (var i = 0; i < MODIFIED_GRAMMAR.terminals.length; ++i) {
        rst += "<td>" + MODIFIED_GRAMMAR.terminals[i] + "</td>";
    }

    rst += "<td>$</td></tr>";

    MODIFIED_GRAMMAR.terminals.push("$");
    for (var i = 0; i < MODIFIED_GRAMMAR.productions.length; ++i) {
        nonterminal = MODIFIED_GRAMMAR.productions[i].head;
        rst += "<tr>"
        rst += "<td>" + nonterminal + "</td>";
        for (var j = 0; j < MODIFIED_GRAMMAR.terminals.length; ++j) {
            terminal = MODIFIED_GRAMMAR.terminals[j];
            production = PREDICTIVE_TABLE.table[[nonterminal, terminal]];
            if (production) 
                rst += "<td>" + nonterminal + " -> " + production.join("") + "</td>";
            else
                rst += "<td></td>";
        }
        rst += "</tr>"
    }
    MODIFIED_GRAMMAR.terminals.excludes("$");

    return "<table id='predictiveTable'>" + rst + "</table>";
}

function resultToHtml() {
    RESULT = "<tr class='tableHead'><td>Matched</td><td>Stack</td><td>Input</td><td>Action</td></tr>" + RESULT;
    return "<table id='predictiveAnalysisResult'>" + RESULT + "</table>";
}

function headMaxLength() {
    var maxlength = GRAMMAR.productions[0].head.length;
    var production;
    // Calculate the max length of the productions heads in order to align.
    for (var i = 1; i < MODIFIED_GRAMMAR.productions.length; ++i) {
        production = MODIFIED_GRAMMAR.productions[i];
        if (production.head.length > maxlength)
            maxlength = production.head.length;
    }

    return maxlength;
}

function itemCollectionToHtml() {
    var rst = "";
    var currItemSet;
    var currItem;
    var currbody;

    for (var i = 0; i < ITEMCOLLECTION.itemSets.length; ++i) {
        // Show item set number
        rst += "<p><strong>Item Set " + i + "</strong></p>";
        currItemSet = ITEMCOLLECTION.itemSets[i];

        rst += "<pre>";
        for (var j = 0; j < currItemSet.items.length; ++j) {
            currItem = currItemSet.items[j];
            currbody = currItem.body.join("");
            currbody = currbody.substring(0, currItem.position) + "." +
                       currbody.substring(currItem.position, currItem.body.length);
            rst += currItem.head.toString() + "\t->\t" + 
                   currbody + "\n";
        }
        rst += "</pre>";
    }

    return rst;
}

window.onload = function() {
};
