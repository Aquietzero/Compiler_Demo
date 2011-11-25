/* An item of a grammar G is a production of grammar G with a dot
 * at some place in the production body. For example, the items of
 * production A -> XYZ can be as follows:
 *
 *                  A -> .XYZ
 *                  A -> X.YZ
 *                  A -> XY.Z
 *                  A -> XYZ.
 *
 * For this reason, I am going to reduce some redundancies in the
 * definition of Production. Since an item has only one body, so
 * its structure can be defined as follow, where the position means
 * the position of the dot in the production body.
 * If the "next" is not passed, then the item is LR(0) item, other-
 * wise, it is a LR(1) item.
 */
function Item(head, body, position, next) {
   this.head = head;
   this.body = body;
   this.position = position;
   this.next = next || "";
}

Item.prototype.equalsTo = function(otherItem) {
    if (this.head == otherItem.head &&
        this.body.equalsTo(otherItem.body) &&
        this.position == otherItem.position &&
        this.next == otherItem.next)
        return true;
    return false;
}

Item.prototype.looselyEqualsTo = function(otherItem) {
    if (this.head == otherItem.head &&
        this.body.equalsTo(otherItem.body))
        return true;
    return false;
}

Item.prototype.clone = function() {
    return new Item(this.head, this.body.clone(), 
                    this.position, this.next);
}

/* Item Set is a set of items. Initially, the Item Set has not items
 * in it only if some of them are pushed into.
 */
function ItemSet() {
    this.items = new Array();
}

ItemSet.prototype.isEmpty = function() {
    return this.items.length == 0;
}

/* Item sets are not ordered. The equality between two item sets is
 * defined as below: Two item sets contains the same items regardless
 * of the order they are organized in the item set.
 */
ItemSet.prototype.equalsTo = function(otherItemSet) {
    if (this.items.length != otherItemSet.items.length)
        return false;

    for (var i = 0; i < this.items.length; ++i) {
        if (!this.containsItem(otherItemSet.items[i]))
            return false;
    }
    return true;
}

ItemSet.prototype.containsItem = function(item) {
    for (var i = 0; i < this.items.length; ++i)
        if (this.items[i].equalsTo(item))
            return true;
    return false;
}

ItemSet.prototype.addItem = function(item) {
    this.items.push(item);
}

ItemSet.prototype.clone = function() {
    var newItemSet = new ItemSet;

    for (var i = 0; i < this.items.length; ++i)
        newItemSet.addItem(this.items[i]);

    return newItemSet;
}

/* Though not exactly needed, I still add this method to the class
 * ItemSet since it may reduce some of the future work. 
 */
ItemSet.prototype.getSymbols = function() {
    var symbols = new Array();  
    var currSymbol;
    for (var i = 0; i < this.items.length; ++i) {
        currSymbol = this.items[i];
        // The stage is now the end of the body.
        if (currSymbol.body.length <= currSymbol.position)
            continue;

        if (!symbols.contains(currSymbol.body[currSymbol.position]))
            symbols.push(currSymbol.body[currSymbol.position]);
    }
    return symbols;
}

/* Closure is one of the most important algorithms of class item set.
 * it starts with the items in it initially and the given grammar.
 * One thing that needs to pay attention is that this method calculates
 * the closure in place. Namely the item set will be changed after the
 * closure calculation. So if you want the item set to remains the same
 * and obtain the closure as a brand new item set, then you have to 
 * clone the item set first.
 */
ItemSet.prototype.closure = function(grammar) {
    var currItem, bodyHead, production, index;
    var counter, newItem;

    do {
        counter = 0;
        for (var i = 0; i < this.items.length; ++i) {

            currItem = this.items[i];
            if (currItem.position >= currItem.body.length)
                continue;

            // If the body head is terminal, then there is no need to traverse
            // the bodies.
            bodyHead = currItem.body[currItem.position];
            index = grammar.getNonterminalIndex(bodyHead);
            if (index == -1)
                continue;

            production = grammar.productions[index];
            for (var j = 0; j < production.bodies.length; ++j) {
                newItem = new Item(production.head, production.bodies[j], 0);
                if (!this.containsItem(newItem)) {
                    this.addItem(newItem);
                    counter++;
                }
            }
        }
    } while (counter);
}

/* Goto is another important method of the class item set. Intuitively, the 
 * goto function is used to define the transitions in the LR(0). This goto
 * method is somewhat the same as the closure defined as above. It calculates
 * the goto set of its own and the given grammar and symbol rather than a 
 * general function of the calculating the goto set of arbitrary given item
 * set and symbol.
 */
ItemSet.prototype.goto = function(grammar, symbol) {
    var newItemSet = new ItemSet();
    var currItem;

    if (!symbol)
        return newItemSet;

    // Get the items whose dots are just right in front of the symbol.
    for (var i = 0; i < this.items.length; ++i) {
        currItem = this.items[i].clone();
        if (currItem.position < currItem.body.length && 
            symbol == currItem.body[currItem.position])
            newItemSet.items.push(currItem);
    }

    // Move the stage one step forward.
    for (var i = 0; i < newItemSet.items.length; ++i) 
        newItemSet.items[i].position++;
    // Calculate the closure of the new item set.
    newItemSet.closure(grammar);

    return newItemSet;
}


/* Item Set Collection is the collection of the item sets. Each of the
 * item set in the item set collection represents a state in the LR(0)
 * automaton. The constructor of the item set collection accepts the 
 * grammar as the argument and builds up a item set according to the 
 * given grammar. The grammar should be guarantee to be the augmented
 * grammar.
 *
 * Attention: Since  most of the information of the SLR analysis table
 * is generated while the canonical LR(0) collection is under calculating,
 * so there is no need to construct the SLR analysis table after the 
 * calculation of the collection is totally finished. Hence, I use a
 * goto table to keep track of the transfers among the states, namely
 * the item sets, which can be further used.
 */
function ItemSetCollection(grammar) {
    this.itemSets = new Array();
    this.gotoTable = new Array();

    this.canonical_LR_collection(grammar) 
}

ItemSetCollection.prototype.containsItemSet = function(itemSet) {
    for (var i = 0; i < this.itemSets.length; ++i) {
        if (this.itemSets[i].equalsTo(itemSet))
            return i;
    }    
    return -1;
}

ItemSetCollection.prototype.canonical_LR_collection = function(grammar) {
    var firstProduction = new Production(grammar.getAugmentedProduction());
    var firstItemSet = new ItemSet();
    var symbols, nextItemSet, newItemSets, counter;
    var itemSetIndex;

    // Add the augmented production to the first item set.
    firstItemSet.addItem(
        new Item(firstProduction.head, firstProduction.bodies[0], 0));
    firstItemSet.closure(grammar);

    this.itemSets.push(firstItemSet);

    do {
        newItemSets = new Array();
        counter = 0;

        for (var i = 0; i < this.itemSets.length; ++i) {
            symbols = this.itemSets[i].getSymbols();
            for (var j = 0; j < symbols.length; ++j) {
                nextItemSet = this.itemSets[i].goto(grammar, symbols[j]);
                // Keep track with the connection between the nextItemSet
                // and its corresonding symbol.
                if (!nextItemSet.isEmpty())
                    newItemSets.push([nextItemSet, i, symbols[j]]);
            }
        }

        for (var i = 0; i < newItemSets.length; ++i) {
            itemSetIndex = this.containsItemSet(newItemSets[i][0]);
            // Set the GOTO table to keep track of the transfer information
            // among different item sets.
            if (itemSetIndex == -1) {
                this.itemSets.push(newItemSets[i][0]);
                this.gotoTable[[newItemSets[i][1], newItemSets[i][2]]] 
                    = this.itemSets.length - 1; 
                counter++;
            }
            else
                this.gotoTable[[newItemSets[i][1], newItemSets[i][2]]]
                    = itemSetIndex;
        }
    
    } while (counter);

    console.log(this.gotoTable);
}
