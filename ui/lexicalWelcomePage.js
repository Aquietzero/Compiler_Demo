$(function() {

})

function showLexicalWelcomePage() {
    $("#introductionPart").css("display", "none");
    hideSyntaxNavigation();
    hideAllPages();

    $("#lexicalWelcomePage").fadeIn("slow");
    $("#lexicalNavigation").fadeIn("slow");

    showLexicalNavigation();
}
