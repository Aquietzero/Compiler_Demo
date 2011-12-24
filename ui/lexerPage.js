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
    $("#lexerSentenceConfirm").bind("click", showSentenceParseResult);

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

    clearLexerPage();

    getReDefinition();
    $(lexerDFAToHtml()).insertAfter('#lexerDFATableDisplay');

}

function showSentenceParseResult() {

    $('#lexerSentenceResultDisplayArea pre').remove();

    lexerSentenceParse();
    var rst = '<pre>' + RESULT + '</pre>';
    $(rst).insertAfter('#lexerSentenceResultDisplay');

}

function clearLexerPage() {

    $('#lexerDFATableDisplayArea table').remove();
    $('#lexerSentenceResultDisplayArea pre').remove();

}
