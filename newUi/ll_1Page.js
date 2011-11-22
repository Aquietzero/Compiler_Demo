$(function() {
    $("#toLL_1Page").bind("click", showLL_1Page);
});

function showLL_1Page() {
    $("#introductionPart").css("display", "none");
    clearLL_1Page();
    modifyTitle();
    modifyLL_1Bullet();
    hideAllPages();

    getLL_1Grammar();

    $(firstSetsToHtml()).insertAfter("#firstSetsDisplay");
    $(followSetsToHtml()).insertAfter("#followSetsDisplay");
    $(predictiveTableToHtml()).insertAfter("#predictiveTableDisplay");

    $("#ll_1Page").fadeIn("slow");
    showNavigation();
}

function clearLL_1Page() {
    $("#ll_1ResultDisplay pre").remove();
    $("#ll_1ResultDisplay table").remove();
}

function modifyTitle() {
    var mainColumn = $("#mainColumn")
    var title = $("#titleBar");

    var offset = mainColumn.offset().left - 20 + "px";
    title.animate({"width" : offset, "opacity" : "0.95"}, 400);
    mainColumn.css("paddingTop", "20px");
}

function restoreTitle() {
    var mainColumn = $("#mainColumn")
    var title = $("#titleBar");

    title.css("width", "55%");
    mainColumn.css("paddingTop", "170px");
}

function modifyLL_1Bullet() {
    var mainColumn = $("#mainColumn")
    var bullet = $("#toLL_1Page");
    var newWidth;

    bullet.addClass("clicked");
    newWidth = mainColumn.offset().left - bullet.offset().left;
    bullet.css("width", newWidth + "px");
    bullet.removeClass("hover");
    removeBulletHoverBehavior(bullet);
}

function restoreLL_1Bullet() {
    var bullet = $("#toLL_1Page");

    bullet.removeClass("clicked");
    bullet.css("width", "180px");
}
