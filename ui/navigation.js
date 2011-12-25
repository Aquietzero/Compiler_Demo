function showSyntaxNavigation() {
    $("#syntaxNavigation").fadeIn("slow");
    addBulletHoverBehavior();
}

function hideSyntaxNavigation() {
    $("#syntaxNavigation").css("display", "none");
}

function showLexicalNavigation() {
    $("#lexicalNavigation").fadeIn("slow");
    addBulletHoverBehavior();
}

function hideLexicalNavigation() {
    $("#lexicalNavigation").css("display", "none");
}
