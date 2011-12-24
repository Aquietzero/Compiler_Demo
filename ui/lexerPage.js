var DEFAULT_REDEFINITION = "letter -> a | b | c | d\n" +
                           "digit  -> 1 | 2 | 3 | 4\n" +
                           "id     -> letter ( letter | digit ) *\n" +
                           "number -> digit digit *";
var DEFAULT_ACTIONS = "{id}     -> {return(ID);}\n" +
                      "{number} -> {return(NUM);}\n" +
                      ">=       -> {return(RELOP);}\n" +
                      "<=       -> {return(RELOP);}\n" +
                      "==       -> {return(RELOP);}\n" +
                      ">        -> {return(RELOP);}\n" +
                      "<        -> {return(RELOP);}";

$(function() {
    
    $("#lexerReDefinitionInput").val(DEFAULT_REDEFINITION);
    $("#lexerActionsInput").val(DEFAULT_ACTIONS);

    $("#toLexerPage").bind("click", showLexerPage);
    $("#lexerConfirm").bind("click", showLexer);

});

function showLexerPage() {

    var bullet = $("#toLexerPage");
    $("#introductionPart").css("display", "none");

    clearAllPages();

    modifyTitle();
    restoreAllBullets();
    modifySelectedBullet(bullet);
    hideAllPages();

    $("#lexerPage").fadeIn("slow");
    showLexicalNavigation();

}

function showLexer() {
    getReDefinition();
    $(lexerDFAToHtml()).insertAfter('#lexerDFATableDisplay');
}
