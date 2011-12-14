$(function() {
    $("#toLR_1Page").bind("click", showLR_1Page);
    $("#lr_1SentenceConfirm").bind("click", lr_1ParseSentence);
    $("#lr_1Next").bind("click", lr_1StepForward);
    $("#lr_1Prev").bind("click", lr_1StepBackward);
    $("#lr_1ShowAll").bind("click", lr_1ShowAll);
})

function showLR_1Page() {
    var bullet = $("#toLR_1Page");
    $("#intruductionPart").css("display", "none");

    clearAllPages();

    modifyTitle();
    restoreAllBullets();
    modifySelectedBullet(bullet);
    hideAllPages();

    getLR_1Grammar();

    $(itemCollectionToHtml(true)).insertAfter("#lr_1ItemSetsDisplay");
    $(slrProductionListToHtml()).insertAfter("#lr_1IndexedGrammar");
    $(slrTableToHtml()).insertAfter("#lr_1TableDisplay");

    $("#lr_1Page").fadeIn("slow");
    showSyntaxNavigation();
}

function clearLR_1Page() {
    var itemSetsColumns = $("#lr_1Page .itemSetsColumn");
    for (var i = 0; i < itemSetsColumns.length; ++i)
        $(itemSetsColumns[i]).remove();
        
    // Clear LR(1) table.
    $("#lr_1Page #slrTable").remove();
    $("#lr_1Page pre.errorMessage").remove();
    $("#lr_1Page strong.warning").remove();

    // Clear Production List
    $("#lr_1Page #slrProductionList").remove();
}

function lr_1ParseSentence() {
    STEP = 1;

    parseByLR_1();
    var result = slrResultToHtml();
    var id;

    if ($("#slrAnalysisResult").length != 0)
        $("#slrAnalysisResult").remove();

    $(result).insertAfter("#lr_1ParsingResult");

    for (var i = STEP + 1; i < MAX_STEP; ++i) {
        id = "#lr_1Algorithm" + i + "";
        $(id).css("display", "none");
    }
}

function lr_1StepForward() {
    STEP++;
    var id = "#lr_1Algorithm" + STEP + "";
    if ($(id).length != 0)
        $(id).fadeIn("fast");
    else
        STEP--;
}

function lr_1StepBackward() {
    if (STEP > 1) {
        var id = "#lr_1Algorithm" + STEP + "";
        $(id).fadeOut("fast");
        STEP--;
    }
}

function lr_1ShowAll() {
    for (var i = STEP; i < MAX_STEP; ++i) {
        STEP++;
        var id = "#lr_1Algorithm" + i + "";
        if ($(id).length != 0)
            $(id).fadeIn("fast");
        else
            STEP--;
    }
}
