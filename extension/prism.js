// Contains facets and operations over them.
function Prism(url, facet) {
    this.url = url;

    if(facet === undefined) {
	    this.topics = [];
	    this.facets = [];
    } else {
	    this.topics = facet.topics;
	    this.facets = [facet];
    }

    this.creationDate = Date.now();
    	

    this.addFacet = function(facet) {
    	this.facets.push(facet);
    	facet.topics.forEach( e => this.topics.push(e));
    }
}

module.exports = {
    createPrism: function(url, facet) {
        return new Prism(url, facet);
    }
};
