$(function() {
    $("#backToInputPage").bind("click", backToInputPage);
});

function showConfirmPage() {
    $("#introductionPart").css("display", "none");
    hideAllPages();

    getGrammar();
    $(terminalsToHtml()).insertAfter("#terminalsDisplay");
    $(grammarToHtml()).insertAfter("#grammarDisplay");

    $("#confirmPage").fadeIn("slow");
    showSyntaxNavigation();

    //createBgGrammar();
}

function clearConfirmPage() {
    $("#inputDisplay pre").remove();
}

function backToInputPage() {
    clearConfirmPage();
    showInputPage();
    $("#introductionPart").fadeIn("slow");
}

function createBgGrammar() {
    var bgGrammar = $("#bgGrammar");
    var prevContent = $("#bgGrammar pre");
    
    prevContent.remove();
    bgGrammar.wrapInner(grammarToHtml());
    bgGrammar.addClass("rotateTest");
    bgGrammar.css("zIndex", "0");
}
