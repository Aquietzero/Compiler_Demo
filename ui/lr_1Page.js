$(function() {
    $("#toLR_1Page").bind("click", showLR_1Page);
})

function showLR_1Page() {
    var bullet = $("#toLR_1Page");
    $("#intruductionPart").css("display", "none");

    clearLL_1Page();
    clearLR_0Page();
    clearLR_1Page();

    modifyTitle();
    restoreAllBullets();
    modifySelectedBullet(bullet);
    hideAllPages();

    getLR_1Grammar();

    $(itemCollectionToHtml(true)).insertAfter("#lr_1ItemSetsDisplay");
    $(slrProductionListToHtml()).insertAfter("#lr_1IndexedGrammar");
    $(slrTableToHtml()).insertAfter("#lr_1TableDisplay");

    $("#lr_1Page").fadeIn("slow");
    showNavigation();
}

function clearLR_1Page() {
    var itemSetsColumns = $("#lr_1Page .itemSetsColumn");
    for (var i = 0; i < itemSetsColumns.length; ++i)
        $(itemSetsColumns[i]).remove();
}
