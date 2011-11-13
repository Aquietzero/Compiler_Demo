$(function() {
    $("#grammarConfirm").bind("click", indexToNext);
});


function indexToNext() {
    $("#indexPage").fadeOut("slow");

    getGrammar();
    showInput();

    $("#ll_1").fadeIn("slow");
}

function showInput() {
    $(terminalsToHtml()).insertAfter("#terminalsDisplay");
    $(grammarToHtml()).insertAfter("#grammarDisplay");
    $(firstSetsToHtml()).insertAfter("#firstSetsDisplay");
    $(followSetsToHtml()).insertAfter("#followSetsDisplay");
}
