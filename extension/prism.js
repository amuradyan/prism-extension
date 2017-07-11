// Contains facets and operations over them.
function Prism(url) {
    this.url = url;
    this.facets = [];
    this.topics = new Set();

    this.addFacet = function(facet) {
    	this.facets.push(facet);
    	facet.topics.forEach( e => this.topics.add(e));
    }
}

module.exports = {
    createPrism: function(url) {
        return new Prism(url);
    }
};
