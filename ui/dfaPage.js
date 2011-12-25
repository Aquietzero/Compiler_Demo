$(function() {
    
    $("#toDfaPage").bind("click", showDfaPage);
    $("#dfaConfirm").bind("click", showDfaTransferTable);
    $("#dfaReSentenceConfirm").bind("click", showDFAReParsingResult);

});

function showDfaPage() {

    var bullet = $("#toDfaPage");
    $("#introductionPart").css("display", "none");

    clearAllPages();

    modifyTitle();
    restoreAllBullets();
    modifySelectedBullet(bullet);
    hideAllPages();

    $("#dfaPage").fadeIn("slow");
    $("#dfaTransferTableDisplayArea").css("display", "none");
    showLexicalNavigation();

}

function showDfaTransferTable() {
    
    clearDfaPage();
    getDFARegularExpression();

    $(reAlphabetToHtml()).insertAfter("#dfaAlphabet");
    $(dfaToHtml()).insertAfter("#dfaTransferTableDisplay");
    $("#dfaTransferTableDisplayArea").fadeIn("slow");

}

function showDFAReParsingResult() {
    
    $("#dfaReParsingResultDisplayArea table").remove();
    $("#dfaReParsingResultDisplayArea strong").remove();
    $("#dfaReParsingResultDisplayArea pre").remove();

    parseDFARegularExpression();
    $(dfaReParsingResultToHtml()).insertAfter("#dfaReParsingResultDisplay");
    $("#dfaReParsingResultDisplayArea").fadeIn("slow");

}

function clearDfaPage() {
    
    $("#dfaTransferTableDisplayArea table").remove();
    $("#dfaTransferTableDisplayArea pre").remove();
    $("#dfaReParsingResultDisplayArea table").remove();

}
