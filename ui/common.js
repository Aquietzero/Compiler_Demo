var PAGES = ["#welcomePage",
             "#navigationPage",
             "#inputPage",
             "#confirmPage",
             "#lexicalWelcomePage",
             "#postfixPage",
             "#nfaPage",
             "#ll_1Page",
             "#lr_0Page",
             "#lr_1Page"];
var BULLETS = ["#toLL_1Page",
               "#toLR_0Page",
               "#toLR_1Page",
               "#toPostfix",
               "#toNfaPage",
               "#toDfaPage",
               "#syntaxToNavigation",
               "#lexicalToNavigation",
               "#toHelpPage"];

/* Hide and show all pages
 */
function getAllPages() {
    var pages = [];
    for (var i = 0; i < PAGES.length; ++i)
        pages.push($(PAGES[i]));
    return pages;
}

function hideAllPages() {
    var pages = getAllPages();
    for (var i = 0; i < PAGES.length; ++i)
        pages[i].css("display", "none");
}

function clearAllPages() {
    clearLL_1Page();
    clearLR_0Page();
    clearLR_1Page();
    clearPostfixPage();
}

/* Title behaviors control
 */
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

/* Bullets behaviors control
 */
function addBulletHoverBehavior() {
    var bullet;
    for (var i = 0; i < BULLETS.length; ++i) {
        bullet = $(BULLETS[i]);
        bullet.hover(function() {
            $(this).animate({ marginLeft : "25px"}, 100);
        }, function() {
            $(this).animate({ marginLeft : "20px"}, 100);
        });
    }
}

function removeBulletHoverBehavior(bullet) {
    bullet.hover(function() {
    }, function() {
    });
}

function modifySelectedBullet(bullet) {
    var mainColumn = $("#mainColumn")
    var newWidth;

    bullet.addClass("clicked");
    newWidth = mainColumn.offset().left - bullet.offset().left;
    bullet.css("width", newWidth + "px");
    bullet.removeClass("hover");
    removeBulletHoverBehavior(bullet);
}

function restoreAllBullets() {
    var bullet;
    for (var i = 0; i < BULLETS.length; ++i) {
        bullet = $(BULLETS[i]);
        bullet.removeClass("clicked");
        bullet.css("width", "180px");
    }
}
