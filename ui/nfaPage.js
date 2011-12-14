$(function() {
    
    $("#toNfaPage").bind("click", showNfaPage);

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
    showLexicalNavigation();

}
