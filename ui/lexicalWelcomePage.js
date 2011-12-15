$(function() {

})

function showLexicalWelcomePage() {
    $("#introductionPart").css("display", "none");
    hideSyntaxNavigation();

    restoreAllBullets();
    hideAllPages();

    $("#lexicalWelcomePage").fadeIn("slow");
    $("#lexicalNavigation").fadeIn("slow");

    showLexicalNavigation();
}
