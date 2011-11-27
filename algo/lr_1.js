function LR_1AnalysisTable(grammar, iteSetCollection) {
    this.action = new Array();
    this.goto   = new Array();
    this.productionList = new Array();
    this.terminals      = grammar.terminals.clone();
    this.errorMsg       = "";
}
