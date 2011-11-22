var STEP,
    MAX_STEP,
    DEFAULT_TERMINALS = "id, +, *, (, )",
    //DEFAULT_GRAMMAR = "E  -> T E'\nE' -> + T E' | e\nT  -> F T'\nT' -> * F T' | e\nF  -> ( E ) | id";
    DEFAULT_GRAMMAR = "E -> E + T | T\nT -> T * F | F\nF -> ( E ) | id";
    DEFAULT_SENTENCE = "id + id * id";

$(function() {
    document.getElementById("terminal").value = DEFAULT_TERMINALS;
    document.getElementById("grammar").value  = DEFAULT_GRAMMAR;
    document.getElementById("sentence").value  = DEFAULT_SENTENCE;

    $("#grammarConfirm").bind("click", indexToNext);
    $("#sentenceConfirm").bind("click", parseSentence);
    // Grammar chosen
    $("#ll_1Grammar").bind("click", showResultLL_1);
    $("#lr_0Grammar").bind("click", showResultLR_0);

    // Hide elements
    $("#inputDisplay").css("display", "none");
    $("#grammarMenu").css("display", "none");
    $("#ll_1").css("display", "none");
    $("#next, #prev, #showAll").css("display", "none");

    $("#next").bind("click", stepForward);
    $("#prev").bind("click", stepBackward);
    $("#showAll").bind("click", showAll);

    STEP = 1;
    MAX_STEP = 1000;
});


function indexToNext() {
    $("#indexPage").css("display", "none");

    getGrammar();
    showInput();

    //if ($("#indexPage").is(":animated"))
    $("#inputDisplay").fadeIn("slow");
    $("#grammarMenu").fadeIn("slow");
}

function showInput() {
    $(terminalsToHtml()).insertAfter("#terminalsDisplay");
    $(grammarToHtml()).insertAfter("#grammarDisplay");
    $("#modifiedGrammarDisplay").fadeIn("fast");
    $(modifiedGrammarToHtml()).insertAfter("#modifiedGrammarDisplay");
}

function showResultLL_1() {
    $("#lr_0").hide("fast");

    getLL_1Grammar();

    $(firstSetsToHtml()).insertAfter("#firstSetsDisplay");
    $(followSetsToHtml()).insertAfter("#followSetsDisplay");
    $(predictiveTableToHtml()).insertAfter("#predictiveTableDisplay");

    $("#ll_1").fadeIn("slow");
}

function showResultLR_0() {
    $("#ll_1").hide("fast");

    getLR_0Grammar();

    $(itemCollectionToHtml()).insertAfter("#itemSetCollection");

    $("#lr_0").fadeIn("slow");
}

function parseSentence() {
    STEP = 1;

    getSentence();
    var result = resultToHtml();
    var id;

    $("#next, #prev, #showAll").show();

    if ($("#predictiveAnalysisResult").length != 0)
        $("#predictiveAnalysisResult").remove();

    $(result).insertAfter("#parsingResult");

    for (var i = STEP + 1; i < MAX_STEP; ++i) {
        id = "#predictiveAlgorithm" + i + "";
        $(id).css("display", "none");
    }
}

function stepForward() {
    STEP++;
    var id = "#predictiveAlgorithm" + STEP + "";
    if ($(id).length != 0) 
        $(id).fadeIn("fast");
    else
        STEP--;
}

function stepBackward() {
    if (STEP > 1) {
        var id = "#predictiveAlgorithm" + STEP + "";
        $(id).fadeOut("fast");
        STEP--;
    }
}

function showAll() {
    for (var i = STEP; i < MAX_STEP; ++i) {
        STEP++;
        var id = "#predictiveAlgorithm" + i + "";
        if ($(id).length != 0) 
            $(id).fadeIn("fast");
        else
            STEP--;
    }
}
