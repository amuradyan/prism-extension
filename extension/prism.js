// Contains facets and operations over them.
function Prism(url) {
    this.url = url;
    this.facets = [];

    this.addFacet = function(facet) {
    	this.facets.push(facet);
    }
}

module.exports = {
    createPrism: function(url) {
        return new Prism(url);
    }
};
