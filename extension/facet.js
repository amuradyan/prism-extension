// Contains facets that form prisms. 
// Each facet holds an object of selection 
// and a replacement for former.

function Facet(selection, replacement) {
    this.source = selection;
    this.replacement = replacement;
}

module.exports = {
    createFacet: function(selection, replacement) {
    	return new Facet(selection, replacement);
    }
};
