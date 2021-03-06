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

        rst += "<span class='arrow'>→</span>";

        // Insert the bodies.
        for (var j = 0; j < production.bodies.length; ++j) {
            rst += production.bodies[j].join(" ");
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
                rst += "<td>" + nonterminal + "<span class='arrow'>→</span>" + 
                       production.join("") + "</td>";
            else
                rst += "<td></td>";
        }
        rst += "</tr>"
    }
    MODIFIED_GRAMMAR.terminals.excludes("$");

    return "<table id='predictiveTable'>" + rst + "</table>";
}

function ll_1ResultToHtml() {

    RESULT = "<tr class='tableHead'>" + 
                 "<td>Matched</td>" + 
                 "<td>Stack</td>"   +
                 "<td>Input</td>"   +
                 "<td>Action</td>"  +
             "</tr>" + RESULT;
    return "<table id='predictiveAnalysisResult'>" + RESULT + "</table>";

}

function slrResultToHtml() {

    RESULT = "<tr class='tableHead'>" + 
                 "<td>Stack</td>" + 
                 "<td>Symbol</td>"   +
                 "<td>Input</td>"   +
                 "<td>Action</td>"  +
             "</tr>" + RESULT;
    return "<table id='slrAnalysisResult'>" + RESULT + "</table>";

}

function toPostfixResultToHtml() {

    RESULT = "<tr class='tableHead'>" +
                "<td>Stack</td>" +
                "<td>Postfix</td>" +
                "<td>Symbol</td>" +
                "<td>Parsed</td>" +
             "</tr>" + RESULT;
    return "<table id='postfixResult'>" + RESULT + "</table>";

}

function nfaReParsingResultToHtml() {

    RESULT = "<tr class='tableHead'>" +
                "<td>Current States</td>" +
                "<td>Input</td>" +
                "<td>Next States</td>" +
                "<td>Rest Input</td>" +
             "</tr>" + RESULT;
    return "<table id='nfaReParsingResult'>" + RESULT + "</table>";

}

function dfaReParsingResultToHtml() {

    RESULT = "<tr class='tableHead'>" +
                "<td>Current State</td>" +
                "<td>Input</td>" +
                "<td>Next State</td>" +
                "<td>Rest Input</td>" +
             "</tr>" + RESULT;
    return "<table id='dfaReParsingResult'>" + RESULT + "</table>";

}

function addConcatenationToHtml() {
    
    var rst = "";
    for (var i = 0; i < REGULAR_EXPRESSION.reExp.length; ++i)
        rst += REGULAR_EXPRESSION.reExp[i].character + " ";
    return "<pre>" + rst + "</pre>";

}

function postfixToHtml() {

    var rst = "";
    for (var i = 0; i < REGULAR_EXPRESSION.postfixExp.length; ++i)
        rst += REGULAR_EXPRESSION.postfixExp[i].character + " ";
    return "<pre>" + rst + "</pre>";

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

/* The input array contains strings with different length.
 */
function maxLengthGeneral(arr) {
    if (!arr)
        return 0;

    var max = arr[0].length;
    for (var i = 1; i < arr.length; ++i) {
        if (arr[i].length > max)
            max = arr[i].length;
    }
    return max;
}

/* The structure of the display of the item sets is described as follows:
 *
 * <div class="itemSetsColumn">
 *     <div class="itemSet">
 *         <p class="itemSetTitle"> The title of the item set </p>
 *         <div class="itemSetBodies"> The bodies of the item set </div>
 *                                        :
 *                                        :
 *                                        :
 *               first (ITEMCOLLECTION.itemSets.length / 2) item sets
 *                                        :
 *                                        :
 *                                        :
 *         <p class="itemSetTitle"> The title of the item set </p>
 *         <div class="itemSetBodies"> The bodies of the item set </div>
 *     </div>
 *
 *     <div class="itemSet">
 *         <p class="itemSetTitle"> The title of the item set </p>
 *         <div class="itemSetBodies"> The bodies of the item set </div>
 *                                        :
 *                                        :
 *                                        :
 *               last (ITEMCOLLECTION.itemSets.length / 2) item sets
 *                                        :
 *                                        :
 *                                        :
 *         <p class="itemSetTitle"> The title of the item set </p>
 *         <div class="itemSetBodies"> The bodies of the item set </div>
 *     </div>
 * </div>
 */
function itemCollectionToHtml(isLR_1) {
    var rst = "";
    var currItemSet;
    var currItem;
    var currbody;
    var heads, maxHeadLength;
    var col2 = ITEMCOLLECTION.itemSets.length / 3 - 1;
    var col3 = col2 + ITEMCOLLECTION.itemSets.length / 3;

    // Separated column.
    rst += "<div class='itemSetsColumn'>";
    for (var i = 0; i < ITEMCOLLECTION.itemSets.length; ++i) {

        // Each item set.
        rst += "<div class='itemSet'>";

        rst += "<p class='itemSetTitle'><strong>Item Set " + i + "</strong></p>";
        // Show item set number
        currItemSet = ITEMCOLLECTION.itemSets[i];

        rst += "<pre class='itemSetBodies'>";

        // For the alignment of the arrow.
        heads = new Array();
        for (var j = 0; j < currItemSet.items.length; ++j) 
            heads.push(currItemSet.items[j].head);
        maxHeadLength = maxLengthGeneral(heads);

        for (var j = 0; j < currItemSet.items.length; ++j) {
            currItem = currItemSet.items[j].clone();
            currbody = currItem.body.splice(0, currItem.position).join("") + 
                       "." + currItem.body.join("");

            // For the alignment of the arrow.
            rst += currItem.head; 
            for (var k = currItem.head.length; k < maxHeadLength; ++k)
                rst += " ";
            rst += "<span class='arrow'>→</span>" + currbody;

            if (isLR_1) rst += ", " + currItem.next + "\n";
            else        rst += "\n";
        }
        rst += "</pre>";

        rst += "</div>";

        if (i == parseInt(col2)) {
            rst += "</div>";
            rst += "<div class='itemSetsColumn'>";
        }
        if (i == parseInt(col3)) {
            rst += "</div>";
            rst += "<div class='itemSetsColumn'>";
        }

    }
    rst += "</div>";

    return rst;
}

function slrTableToHtml() {
    var rst = "";
    var terminalsNum = SLR_TABLE.terminals.length + 1;
    var nonterminalsNum = MODIFIED_GRAMMAR.productions.length - 1;
    var tableItem, parseRst;

    SLR_TABLE.terminals.push("$");

    // Table header
    rst += "<tr><td class='slrTableTitle' rowspan='2'>States</td>";
    rst += "<td colspan=\'" + 
           terminalsNum + "\'>" + "Action</td>";
    rst += "<td colspan=\'" + 
           nonterminalsNum + "\'>" + "Goto</td></tr>";

    rst += "<tr>";
    for (var i = 0; i < terminalsNum; ++i)
        rst += "<td>" + SLR_TABLE.terminals[i] + "</td>";
    for (var i = 1; i <= nonterminalsNum; ++i)
        rst += "<td>" + MODIFIED_GRAMMAR.productions[i].head + "</td>";
    rst += "</tr>";

    // Table Body
    for (var i = 0; i < ITEMCOLLECTION.itemSets.length; ++i) {
        rst += "<tr><td>(" + i + ")</td>";
        for (var j = 0; j < terminalsNum; ++j) {
            tableItem = SLR_TABLE.action[[i, SLR_TABLE.terminals[j]]];
            parseRst = parseSLRTableItem(tableItem);
            rst += "<td>" + parseRst + "</td>";
        }

        for (var j = 1; j <= nonterminalsNum; ++j) {
            rst += "<td>" 
                +  (SLR_TABLE.goto[[i, MODIFIED_GRAMMAR.productions[j].head]] || "") 
                + "</td>";
        }
        rst += "</tr>";
    }
    SLR_TABLE.terminals.excludes("$");

    rst = "<table id='slrTable'>" + rst + "</table>";
    if (SLR_TABLE.errorMsg != "")
        rst += "<strong class='warning'>" +
               "<span class='skull'>☠</span>" +
               "WARNING<br /></strong>" +
               "<pre class='errorMessage'>" +
               SLR_TABLE.errorMsg + "</pre>";

    return rst;
}

function parseSLRTableItem(slrTableItem) {
    if (!slrTableItem)
        return "";
    if (slrTableItem[0] == "a")
        return "acc";
    if (slrTableItem[0] == "s")
        return "s" + slrTableItem[1];
    if (slrTableItem[0] == "r") {
        return "r" + SLR_TABLE.searchItemInProductionList(slrTableItem[1]);
    }
    else
        return "err";
}

function slrProductionListToHtml() {

    var rst = "";
    var currItem, maxLength;
    var productionHeads = new Array();
    var productionNum = SLR_TABLE.productionList.length;

    for (var i = 0; i < productionNum; ++i)
        productionHeads.push(SLR_TABLE.productionList[i].head);
    maxLength = maxLengthGeneral(productionHeads);

    for (var i = 0; i < productionNum; ++i) {
        currItem = SLR_TABLE.productionList[i];

        rst += "(" + i + ") " + currItem.head;
        for (var j = currItem.head.length; j < maxLength; ++j)
            rst += " ";
        rst += "<span class='arrow'>→</span>";
        rst += currItem.body.join("");
        rst += "\n";
    }    

    return "<pre id='slrProductionList'>" + rst + "</pre>";

}

function nfaToHtml() {
    
    var rst = "";
    var currState, currEdges;
    var currSet;
    var alphabet = NF_AUTOMATON.alphabet;

    // Print the letters in alphabet and the epsilon and endmarker.
    rst += "<tr>" + "<td>states</td>";
    for (var i = 0; i < alphabet.length; ++i)
        rst += "<td>" + alphabet[i] + "</td>";
    rst += "<td>&#603;</td>";
    rst += "</tr>";

    alphabet.push("e");

    for (var id in NF_AUTOMATON.states) {

        rst += "<tr>";
        rst += "<td>" + id + "</td>";

        currState = NF_AUTOMATON.states[id];
        for (var j = 0; j < alphabet.length; ++j) {
            currEdges = currState.searchEdge(alphabet[j]);
            if (!currEdges.isEmpty()) {
                currSet = new Array();
                for (var n = 0; n < currEdges.length; ++n)
                    currSet.push(currEdges[n].next.id);
                rst += "<td>{ " + currSet.join(", ") + " }</td>";
            }
            else
                rst += "<td>&#8709;</td>";
        }
        rst += "</tr>";

    }

    return "<table id='nfaTransferTable'>" + rst + "</table>";

}

function dfaToHtml() {
    
    var rst = "";
    var currState, nextState;
    var alphabet = DF_AUTOMATON.alphabet;

    // Print the letters in alphabet and the epsilon and endmarker.
    rst += "<tr>" + "<td>state</td>";
    for (var i = 0; i < alphabet.length; ++i)
        rst += "<td>" + alphabet[i] + "</td>";
    rst += "</tr>";

    for (var id in DF_AUTOMATON.states) {

        rst += "<tr>";
        rst += "<td>" + id + "</td>";

        for (var j = 0; j < alphabet.length; ++j) {
            nextState = DF_AUTOMATON.states[id][alphabet[j]];
            if (nextState)
                rst += "<td>" + nextState + "</td>";
            else
                rst += "<td>&#8709;</td>";
        }
        rst += "</tr>";

    }

    return "<table id='dfaTransferTable'>" + rst + "</table>";

}

function reAlphabetToHtml() {

    var alphabet = new Array();
    for (var i = 0; i < REGULAR_EXPRESSION.alphabet.length; ++i)
        alphabet.push(REGULAR_EXPRESSION.alphabet[i]);
    return "<pre>{ " + alphabet.join(", ") + " }</pre>";

}

function lexerDFAToHtml() {

    var dfa = LEXER.lexerDFA;
    var rst = '';
    var nextState;
    var alphabet = dfa.alphabet;

    rst += "<table id='lexerDFATable'>";
    rst += '<tr>';
    rst += '<td>states</td>';
    for (var i = 0; i < alphabet.length; ++i)
        rst += '<td>' + alphabet[i] + '</td>';
    rst += '</tr>';
    
    for (var id in dfa.states) {

        if (id == 0)
            rst += "<tr class='dfaBegin'>";
        else if (dfa.end.contains(parseInt(id)))
            rst += "<tr class='dfaEnd'>";
        else
            rst += "<tr>";

        rst += '<td>' + id + '</td>';
        for (var i = 0; i < alphabet.length; ++i) {
            nextState = dfa.states[id][alphabet[i]];
            if (nextState)
                rst += '<td>' + nextState + '</td>';
            else
                rst += '<td>&#8709;</td>';
        }

        rst += '</tr>';
    }
    rst += '</table>';

    return rst;

}

function lexerParseMassageToHtml() {

    var rst = '';
    rst += "<strong class='warning'>" +
           "Parsing Message:<br /></strong>" +
           "<pre class='errorMessage'>" +
           LEXER.parseMsg + "</pre>";
    return rst;

}

function lexerParseResultToHtml() {

    return "<strong class='normalStrong'>" +
           "<br />Parsing Result:<br /></strong>" +
           "<pre class='resultPre'>" + LEXER.parseRst + "</pre>";

}
