$(function() {
    
    $("#toNfaPage").bind("click", showNfaPage);
    $("#nfaConfirm").bind("click", showNfaTransferTable);

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

    $(nfaToHtml()).insertAfter("#nfaTransferTableDisplay");
    $("#nfaTransferTableDisplayArea").fadeIn("slow");

}

function clearNfaPage() {
    
    $("#nfaTransferTableDisplayArea table").remove();

}
