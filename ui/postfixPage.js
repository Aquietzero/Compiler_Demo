var DEFAULT_RE = "( a | b ) * a b b #";

$(function() {

    $("#infixInput").value = DEFAULT_RE;

    $("#toPostfix").bind("click", showPostfixPage);
    $("#infixConfirm").bind("click", showPostfixResult);

});

function showPostfixPage() {

    var bullet = $("#toPostfix");
    $("#introductionPart").css("display", "none");

    clearAllPages();

    modifyTitle();
    restoreAllBullets();
    modifySelectedBullet(bullet);
    hideAllPages();

    $("#postfixPage").fadeIn("slow");
    $("#toPostfixResultDisplay").css("display", "none");
    showLexicalNavigation();

}

function showPostfixResult() {
    
    clearPostfixPage();
    getPostfix();

    $(addConcatenationToHtml()).insertAfter("#addConcatenation");
    $(toPostfixResultToHtml()).insertAfter("#toPostfixResult");
    $(postfixToHtml()).insertAfter("#toPostfixResult");
    $("#toPostfixResultDisplay").fadeIn("slow");

}

function clearPostfixPage() {

    $("#toPostfixResultDisplay pre").remove();
    $("#toPostfixResultDisplay table").remove();

}
