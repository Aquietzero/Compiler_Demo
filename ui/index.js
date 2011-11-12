$(function() {
    // Hide non index pages.
    $("#ll_1").hide();

    $("#grammarConfirm").bind("click", indexToNext);
});


function indexToNext() {
    $("#indexPage").fadeOut("slow");
}
