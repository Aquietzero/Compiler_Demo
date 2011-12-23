$(function() {
    
    $("#toNfaPage").bind("click", showNfaPage);
    $("#nfaConfirm").bind("click", showNfaTransferTable);
    $("#nfaReSentenceConfirm").bind("click", showNFAReParsingResult);

});

function showNfaPage() {

    var bullet = $("#toNfaPage");
    $("#introductionPart").css("display", "none");

    clearAllPages();

    modifyTitle();
    restoreAllBullets();
    modifySelectedBullet(bullet);
    hideAllPages();

    $("#nfaPage").fadeIn("slow");
    $("#nfaTransferTableDisplayArea").css("display", "none");
    showLexicalNavigation();

}

function showNfaTransferTable() {
    
    clearNfaPage();
    getNFARegularExpression();

    $(reAlphabetToHtml()).insertAfter("#nfaAlphabet");
    $(nfaToHtml()).insertAfter("#nfaTransferTableDisplay");
    $("#nfaTransferTableDisplayArea").fadeIn("slow");

}

function showNFAReParsingResult() {
    
    $("#nfaReParsingResultDisplayArea table").remove();
    $("#nfaReParsingResultDisplayArea strong").remove();
    $("#nfaReParsingResultDisplayArea pre").remove();

    parseNFARegularExpression();
    $(nfaReParsingResultToHtml()).insertAfter("#nfaReParsingResultDisplay");
    $("#nfaReParsingResultDisplayArea").fadeIn("slow");

}

function clearNfaPage() {
    
    $("#nfaTransferTableDisplayArea table").remove();
    $("#nfaTransferTableDisplayArea pre").remove();
    $("#nfaReParsingResultDisplayArea table").remove();

}
