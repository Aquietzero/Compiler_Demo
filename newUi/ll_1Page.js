var STEP,
    MAX_STEP = 1000;

$(function() {
    $("#toLL_1Page").bind("click", showLL_1Page);
    $("#sentenceConfirm").bind("click", parseSentence);
    $("#ll_1Next").bind("click", stepForward);
    $("#ll_1Prev").bind("click", stepBackward);
    $("#ll_1ShowAll").bind("click", showAll);
});

function showLL_1Page() {
    var bullet = $("#toLL_1Page");
    $("#introductionPart").css("display", "none");

    clearLL_1Page();
    clearLR_0Page();

    modifyTitle();
    restoreAllBullets();
    modifySelectedBullet(bullet);
    hideAllPages();

    getLL_1Grammar();

    $(firstSetsToHtml()).insertAfter("#firstSetsDisplay");
    $(followSetsToHtml()).insertAfter("#followSetsDisplay");
    $(predictiveTableToHtml()).insertAfter("#predictiveTableDisplay");

    $("#ll_1Page").fadeIn("slow");
    showNavigation();
}

function clearLL_1Page() {
    $("#ll_1ResultDisplay pre").remove();
    $("#ll_1ResultDisplay table").remove();
}

function parseSentence() {
    STEP = 1;
    
    getSentence();
    var result = resultToHtml();
    var id;

    if ($("#predictiveAnalysisResult").length != 0)
        $("#predictiveAnalysisResult").remove();

    $(result).insertAfter("#ll_1ParsingResult");

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
