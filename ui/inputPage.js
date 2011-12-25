var DEFAULT_TERMINALS = "id, +, *, (, )",
    DEFAULT_GRAMMAR   = "E -> E + T | T\nT -> T * F | F\nF -> ( E ) | id";


$(function() {
    $("#terminalsInput").val(DEFAULT_TERMINALS);
    $("#grammarInput").val(DEFAULT_GRAMMAR);

    $("#grammarConfirm").bind("click", showConfirmPage);
});

function showInputPage() {
    hideSyntaxNavigation();
    hideAllPages();

    $("#inputPage").fadeIn("slow");
    $("#introductionPart").fadeIn("slow");
}
