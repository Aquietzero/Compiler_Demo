var STEP,
    MAX_STEP = 1000;

$(function() {
    $("#toLL_1Page").bind("click", showLL_1Page);
    $("#ll_1SentenceConfirm").bind("click", ll_1ParseSentence);
    $("#ll_1Next").bind("click", ll_1StepForward);
    $("#ll_1Prev").bind("click", ll_1StepBackward);
    $("#ll_1ShowAll").bind("click", ll_1ShowAll);
});

function showLL_1Page() {
    var bullet = $("#toLL_1Page");
    $("#introductionPart").css("display", "none");

    clearAllPages();

    modifyTitle();
    restoreAllBullets();
    modifySelectedBullet(bullet);
    hideAllPages();

    getLL_1Grammar();

    $(firstSetsToHtml()).insertAfter("#firstSetsDisplay");
    $(followSetsToHtml()).insertAfter("#followSetsDisplay");
    $(predictiveTableToHtml()).insertAfter("#predictiveTableDisplay");

    $("#ll_1Page").fadeIn("slow");
    showSyntaxNavigation();
}

function clearLL_1Page() {
    $("#ll_1ResultDisplay pre").remove();
    $("#ll_1ResultDisplay table").remove();
}

function ll_1ParseSentence() {
    STEP = 1;
    
    parseByLL_1();
    var result = ll_1ResultToHtml();
    var id;

    if ($("#predictiveAnalysisResult").length != 0)
        $("#predictiveAnalysisResult").remove();

    $(result).insertAfter("#ll_1ParsingResult");

    for (var i = STEP + 1; i < MAX_STEP; ++i) {
        id = "#predictiveAlgorithm" + i + "";
        $(id).css("display", "none");
    }
}

function ll_1StepForward() {
    STEP++;
    var id = "#predictiveAlgorithm" + STEP + "";
    if ($(id).length != 0)
        $(id).fadeIn("fast");
    else
        STEP--;
}

function ll_1StepBackward() {
    if (STEP > 1) {
        var id = "#predictiveAlgorithm" + STEP + "";
        $(id).fadeOut("fast");
        STEP--;
    }
}

function ll_1ShowAll() {
    for (var i = STEP; i < MAX_STEP; ++i) {
        STEP++;
        var id = "#predictiveAlgorithm" + i + "";
        if ($(id).length != 0)
            $(id).fadeIn("fast");
        else
            STEP--;
    }
}
