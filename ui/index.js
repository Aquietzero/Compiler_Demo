var STEP,
    MAX_STEP,
    DEFAULT_TERMINALS = "id, +, *, (, )",
    DEFAULT_GRAMMAR = "E  -> T E'\nE' -> + T E' | e\nT  -> F T'\nT' -> * F T' | e\nF  -> ( E ) | id";
    DEFAULT_SENTENCE = "id + id * id";

$(function() {
    document.getElementById("terminal").value = DEFAULT_TERMINALS;
    document.getElementById("grammar").value  = DEFAULT_GRAMMAR;
    document.getElementById("sentence").value  = DEFAULT_SENTENCE;

    $("#grammarConfirm").bind("click", indexToNext);
    $("#sentenceConfirm").bind("click", parseSentence);

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
    showResult();

    //if ($("#indexPage").is(":animated"))
    $("#ll_1").fadeIn("slow");
}

function showInput() {
    $(terminalsToHtml()).insertAfter("#terminalsDisplay");
    $(grammarToHtml()).insertAfter("#grammarDisplay");
    $("#modifiedGrammarDisplay").fadeIn("fast");
    $(modifiedGrammarToHtml()).insertAfter("#modifiedGrammarDisplay");
}

function showResult() {
    $(firstSetsToHtml()).insertAfter("#firstSetsDisplay");
    $(followSetsToHtml()).insertAfter("#followSetsDisplay");
    $(predictiveTableToHtml()).insertAfter("#predictiveTableDisplay");
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
