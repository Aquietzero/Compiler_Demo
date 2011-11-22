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
 */
function Item(head, body, position) {
   this.head = head;
   this.body = body;
   this.position = position;
}

Item.prototype.equalsTo = function(otherItem) {
    if (this.head == otherItem.head &&
        this.body.equalsTo(otherItem.body) &&
        this.position == otherItem.position)
        return true;
    return false;
}

Item.prototype.clone = function() {
    return new Item(this.head, this.body, this.position);
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
 */
function ItemSetCollection(grammar) {
    this.itemSets = new Array();

    this.canonical_LR_collection(grammar) 
}

ItemSetCollection.prototype.containsItemSet = function(itemSet) {
    for (var i = 0; i < this.itemSets.length; ++i) {
        if (this.itemSets[i].equalsTo(itemSet))
            return true;
    }    
    return false;
}

ItemSetCollection.prototype.canonical_LR_collection = function(grammar) {
    var firstProduction = new Production(grammar.getAugmentedProduction());
    var firstItemSet = new ItemSet();
    var symbols, nextItemSet, newItemSets, counter;

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
                if (!nextItemSet.isEmpty())
                    newItemSets.push(nextItemSet);
            }
        }

        for (var i = 0; i < newItemSets.length; ++i) {
            if (!this.containsItemSet(newItemSets[i])) {
                this.itemSets.push(newItemSets[i]);
                counter++;
            }
        }
    
    } while (counter);
}


