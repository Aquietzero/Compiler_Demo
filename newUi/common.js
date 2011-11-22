var PAGES = ["welcomePage",
             "inputPage",
             "confirmPage",
             "ll_1Page"];
var BULLETS = ["toLL_1Page",
               "toLR_0Page",
               "toLR_1Page",
               "toHelpPage"];

function getAllPages() {
    var pages = [];
    for (var i = 0; i < PAGES.length; ++i)
        pages.push($("#" + PAGES[i]));
    return pages;
}

function hideAllPages() {
    var pages = getAllPages();
    for (var i = 0; i < PAGES.length; ++i)
        pages[i].css("display", "none");
}

function addBulletHoverBehavior() {
    var bullet;
    for (var i = 0; i < BULLETS.length; ++i) {
        bullet = $("#" + BULLETS[i]);
        bullet.hover(function() {
            $(this).animate({ "marginLeft" : "25px" }, 100);
        }, function() {
            $(this).animate({ "marginLeft" : "20px" }, 100);
        });
    }
}

function removeBulletHoverBehavior(bullet) {
    bullet.hover(function() {
    }, function() {
    });
}
