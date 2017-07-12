// Contains facets that form prisms. 
// Each facet holds an object of selection 
// and a replacement for former.

function Facet(name, source, replacement, topics, state) {
	this.name = name;
    this.source = source;
    this.replacement = replacement;
    this.topics = Array.from(new Set(topics));
  	this.state = state;
  	this.creationDate = Date.now();
}

module.exports = {
    createFacet: function(name, source, replacement, topics, state) {
    	return new Facet(name, source, replacement, topics, state);
    }
};
