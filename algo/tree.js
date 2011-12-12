/* tree.js defines the basic tree structure and some of
 * related methods. The tree in this project refers to
 * the abstract syntax tree. For example, the AST which
 * correspond to the regular expression "(a|b)*abb#" is:
 *
 *                   ~
 *                  / \
 *                 ~   #
 *                / \
 *               ~   b
 *              / \
 *             ~   b
 *            / \
 *           *   a
 *           |
 *           |
 *          / \
 *         a   b
 *
 * The '~'s are the concatenations which are inserted in
 * a method provided by re.js.
 */

function Tree(node, lTree, rTree, parent) {

    this.node   = node   || undefined;
    this.lTree  = lTree  || undefined;
    this.rTree  = rTree  || undefined;

}

Tree.prototype.equalsTo = function(otherTree) {

    return (this.node.equalsTo(otherTree.node)     &&
            this.lTree.equalsTo(otherTree.lTree)   &&
            this.rTree.equalsTo(otherTree.rTree));

}

Tree.prototype.copy = function() {

    return new Tree(this.node.copy(),
                    this.lTree.copy(),
                    this.rTree.copy());

}

/* Calculates the height of the tree. */
function treeHeight(tree) {
    
    return (function heightIter(subtree) {

        if (subtree) {
            return Math.max(
                heightIter(subtree.lTree),
                heightIter(subtree.rTree)
            ) + 1; 
        }
        return 0;

    })(tree) - 1;

}

/* Calculates the number of leaves of the tree. */
function treeCount(tree) {

    return (function countIter(subtree) {
    
        if (subtree) {
            return countIter(subtree.lTree) +
                   countIter(subtree.rTree) +
                   1;
        }
        return 0;
        
    })(tree);
}

/* Traverse the tree in preorder. */
function preorder(subtree, visit) {

    if (subtree != undefined) {
        visit(subtree.node);
        preorder(subtree.lTree, visit);
        preorder(subtree.rTree, visit);
    }

}

/* Traverse the tree in inorder. */
function inorder(subtree, visit) {

    if (subtree != undefined) {
        inorder(subtree.lTree, visit);
        visit(subtree.node);
        inorder(subtree.rTree, visit);
    }

}

/* Traverse the tree in postorder. */
function postorder(subtree, visit) {

    if (subtree != undefined) {
        postorder(subtree.lTree, visit);
        postorder(subtree.rTree, visit);
        visit(subtree.node);
    }

}

function treeTest() {
    F = new Tree("F");
    D = new Tree("D", F);    
    E = new Tree("E");    
    B = new Tree("B", D, E);    
    C = new Tree("C");    
    A = new Tree("A", B, C);    
}

function visit(elem) {
    console.log(elem);
}
