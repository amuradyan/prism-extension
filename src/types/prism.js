// Contains facets and operations over them.
function Prism(url, facet, authorId) {
    this.url = url

    if (facet === undefined) {
        this.topics = []
        this.facets = []
    } else {
        this.topics = facet.topics
        this.facets = [facet]
    }

    this.creationDate = Date.now()
    this.authorId = authorId

    this.addFacet = function (facet) {
        this.facets.push(facet)

        const setOfTopics = new Set(this.topics)
        facet.topics.forEach(e => setOfTopics.add(e))
        this.topics = Array.from(setOfTopics)
    }
}

module.exports = {
    createPrism: function (url, facet, authorId) {
        return new Prism(url, facet, authorId)
    },

    createPrismFromDBResult: function (dbRes) {
        const prism = new Prism(dbRes.url)
        dbRes.facets.forEach(e => prism.addFacet(e))

        return prism
    }
}
