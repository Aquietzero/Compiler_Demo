var DEFAULT_RE = "( a | b ) * a b b #";

$(function() {
    $("#infixInput").value = DEFAULT_RE;

    $("#toPostfix").bind("click", showPostfixPage);
    $("#infixConfirm").bind("click", showPostfixResult);
});

function showPostfixPage() {

    var bullet = $("#toPostfix");
    $("#introductionPart").css("display", "none");

    modifyTitle();
    restoreAllBullets();
    modifySelectedBullet(bullet);
    hideAllPages();

    $("#postfixPage").fadeIn("slow");
    showLexicalNavigation();

}

function showPostfixResult() {
    
    getPostfix();
    console.log(RESULT);
    $(toPostfixToHtml()).insertAfter("#toPostfixResult");

}
