$(function() {
    $("#toLR_0Page").bind("click", showLR_0Page);
    $("#slrSentenceConfirm").bind("click", slrParseSentence);
    $("#slrNext").bind("click", slrStepForward);
    $("#slrPrev").bind("click", slrStepBackward);
    $("#slrShowAll").bind("click", slrShowAll);
});

function showLR_0Page() {
    var bullet = $("#toLR_0Page");
    $("#introductionPart").css("display", "none");

    clearLL_1Page();
    clearLR_0Page();

    modifyTitle();
    restoreAllBullets();
    modifySelectedBullet(bullet);
    hideAllPages();

    getLR_0Grammar();
    
    $(itemCollectionToHtml(false)).insertAfter("#itemSetsDisplay");
    $(slrProductionListToHtml()).insertAfter("#indexedGrammar");
    $(slrTableToHtml()).insertAfter("#slrTableDisplay");

    $("#lr_0Page").fadeIn("slow");
    showSyntaxNavigation();
}

function clearLR_0Page() {
    // Clear item sets.
    var itemSetsColumns = $("#lr_0Page .itemSetsColumn");
    for (var i = 0; i < itemSetsColumns.length; ++i)
        $(itemSetsColumns[i]).remove();

    // Clear SLR table.
    $("#lr_0Page #slrTable").remove();
    $("#lr_0Page pre.errorMessage").remove();
    $("#lr_0Page strong.warning").remove();

    // Clear Production List
    $("#lr_0Page #slrProductionList").remove();
}

function slrParseSentence() {
    STEP = 1;

    parseBySLR();
    var result = slrResultToHtml();
    var id;

    if ($("#slrAnalysisResult").length != 0)
        $("#slrAnalysisResult").remove();

    $(result).insertAfter("#slrParsingResult");

    for (var i = STEP + 1; i < MAX_STEP; ++i) {
        id = "#slrAlgorithm" + i + "";
        $(id).css("display", "none");
    }
}

function slrStepForward() {
    STEP++;
    var id = "#slrAlgorithm" + STEP + "";
    if ($(id).length != 0)
        $(id).fadeIn("fast");
    else
        STEP--;
}

function slrStepBackward() {
    if (STEP > 1) {
        var id = "#slrAlgorithm" + STEP + "";
        $(id).fadeOut("fast");
        STEP--;
    }
}

function slrShowAll() {
    for (var i = STEP; i < MAX_STEP; ++i) {
        STEP++;
        var id = "#slrAlgorithm" + i + "";
        if ($(id).length != 0)
            $(id).fadeIn("fast");
        else
            STEP--;
    }
}
