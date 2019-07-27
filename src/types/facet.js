// Contains facets that form prisms. 
// Each facet holds an object of selection 
// and a replacement for former.

function Facet(name, source, replacement, topics, state, authorId) {
    this.name = name
    this.source = source
    this.replacement = replacement
    this.topics = Array.from(new Set(topics))
    this.state = state
    this.creationDate = Date.now()
    this.authorId = authorId
}

module.exports = {
    createFacet: function (name, source, replacement, topics, state, authorId) {
        return new Facet(name, source, replacement, topics, state, authorId)
    }
}
