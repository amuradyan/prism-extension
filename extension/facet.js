// Contains facets that form prisms. 
// Each facet holds an object of selection 
// and a replacement for former.

module.exports = {
	createFacet: function (selection, replacement, type) {
		var facet = {};
		facet.sourceSelection = selection;
		facet.replacement = replacement;
		facet.type = type;

		return facet;
	},
	
	createEmptyFacet: function () {
		createFacet(null, null, null);
	}
};