var SectionModel = require('./track.model.js');

module.exports = Backbone.Collection.extend({
    model: SectionModel,

    initialize: function () {

    },

    setPoint: function (pointArray, width) {
        pointArray.forEach(function (point, i) {
            var prePoint = (i !== 0) ? i - 1 : pointArray.length - 1;

            this.add({
                begin: pointArray[prePoint],
                end: point,
                width: width
            });
        }.bind(this));
    },

    checkBorder: function (carModel) {
        return !this.some(function (trackModel, i) {
            var checkEntry = trackModel.checkEntry(carModel);

            if (checkEntry) {
                carModel.setCurrentTrack(i, this.length);
            }

            return checkEntry;
        }, this);
    }
});
