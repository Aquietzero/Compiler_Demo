$(function() {
    
    $("#toNfaPage").bind("click", showNfaPage);
    $("#nfaConfirm").bind("click", showNfaTransferTable);
    $("#reSentenceConfirm").bind("click", showReParsingResult);

});

function showNfaPage() {

    console.log("here");
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
    getRegularExpression();

    $(reAlphabetToHtml()).insertAfter("#nfaAlphabet");
    $(nfaToHtml()).insertAfter("#nfaTransferTableDisplay");
    $("#nfaTransferTableDisplayArea").fadeIn("slow");

}

function showReParsingResult() {
    
    $("#reParsingResultDisplayArea table").remove();
    $("#reParsingResultDisplayArea strong").remove();
    $("#reParsingResultDisplayArea pre").remove();

    parseRegularExpression();
    $(reParsingResultToHtml()).insertAfter("#reParsingResultDisplay");
    $("#reParsingResultDisplayArea").fadeIn("slow");

}

function clearNfaPage() {
    
    $("#nfaTransferTableDisplayArea table").remove();
    $("#nfaTransferTableDisplayArea pre").remove();
    $("#reParsingResultDisplayArea table").remove();

}
