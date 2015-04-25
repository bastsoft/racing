var PointModel = require('./point.model.js');

module.exports = Backbone.Collection.extend({
    model: PointModel,

    initialize: function () {
        this.on('addAfter', function (cid) {
            var newCollection = [];

            this.each(function (model) {
                newCollection.push(model.toJSON());

                if (model.cid === cid) {
                    newCollection.push({});
                }
            }, this);

            this.set([]);
            this.add(newCollection);
        }.bind(this));
    }
});
