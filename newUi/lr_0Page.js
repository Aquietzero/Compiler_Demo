$(function() {
    $("#toLR_0Page").bind("click", showLR_0Page);
});

function showLR_0Page() {
    var bullet = $("#toLR_0Page");
    $("#introductionPart").css("display", "none");

    clearLL_1Page();
    clearLR_0Page();

    modifyTitle();
    restoreAllBullets();
    modifySelectedBullet(bullet);
    hideAllPages();

    getLR_0Grammar();
    
    $(itemCollectionToHtml()).insertAfter("#itemSetsDisplay");

    $("#lr_0Page").fadeIn("slow");
    showNavigation();
}

function clearLR_0Page() {
    var itemSetsColumns = $(".itemSetsColumn");
    for (var i = 0; i < itemSetsColumns.length; ++i)
        $(itemSetsColumns[i]).remove();
}
