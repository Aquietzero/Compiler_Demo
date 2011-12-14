$(function() {
    
    $("#structureGraph tr").hover(function() {
        $(this).addClass("trHover");
    }, function() {
        $(this).removeClass("trHover");
    });   

    $("#toSyntaxPage").bind("click", showInputPage);
    $("#toLexicalPage").bind("click", showLexicalWelcomePage);

    $("#syntaxToNavigation").bind("click", showNavigationPage);
    $("#lexicalToNavigation").bind("click", showNavigationPage);

});

function showNavigationPage() {

    hideSyntaxNavigation();
    hideAllPages();

    hideSyntaxNavigation();
    hideLexicalNavigation();
    $("#navigationPage").fadeIn("slow");
    $("#introductionPart").fadeIn("slow");

}
