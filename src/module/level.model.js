var PointCollection = require('./editor/point.collection.js');

module.exports = Backbone.Model.extend({
    initialize: function () {
        if (!this.get('number')) {
            this.set('number', 1);
        }

        if (!this.get('width')) {
            this.set('width', 60);
        }

        ['trackCollection', 'pathCollection', 'barriersCollection'].forEach(function (collectionName) {
            var data = this.get(collectionName) || [];

            this.set(collectionName, new PointCollection(data));
        }, this);
    },

    toJSON: function () {
        var json = _.clone(this.attributes);

        json.trackCollection = this.get('trackCollection').toJSON();

        return json;
    }
});
