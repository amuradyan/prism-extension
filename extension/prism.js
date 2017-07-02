// Contains facets and operations over them.

function Prism(facets) {
	this.facets = facets
}

module.exports = {
	createPrism: function (facets) {
		return new Prism(facets);
	}
};