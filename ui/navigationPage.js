$(function() {
    
    $("#structureGraph tr").hover(function() {
        $(this).addClass("trHover");
    }, function() {
        $(this).removeClass("trHover");
    });   

    $("#toSyntaxPage").bind("click", showInputPage);

});

function showNavigationPage() {

    hideSyntaxNavigation();
    hideAllPages();

    $("#navigationPage").fadeIn("slow");
    $("#introductionPart").fadeIn("slow");

}
