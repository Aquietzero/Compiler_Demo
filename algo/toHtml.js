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
    RESULT = "<tr class='tableHead'>" + 
                 "<td>Matched</td>" + 
                 "<td>Stack</td>"   +
                 "<td>Input</td>"   +
                 "<td>Action</td>"  +
             "</tr>" + RESULT;
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
function itemCollectionToHtml() {
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
            rst += " -> " + currbody + "\n";
        }
        rst += "</pre>";

        rst += "</div>";

        if (i == col2) {
            rst += "</div>";
            rst += "<div class='itemSetsColumn'>";
        }
        if (i == col3) {
            rst += "</div>";
            rst += "<div class='itemSetsColumn'>";
        }

    }
    rst += "</div>";

    return rst;
}

