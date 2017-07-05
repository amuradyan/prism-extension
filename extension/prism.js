// Contains facets and operations over them.
function Prism(url) {
    this.url = url;
    this.facets = [];
}

module.exports = {
    createPrism: function(url) {
        return new Prism(url);
    }
};
