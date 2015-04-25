var LevelModel = require('./level.model.js');
var vow = require('../../node_modules/vow/lib/vow.js');

module.exports = Backbone.Collection.extend({
    model: LevelModel,

    saveToLS: function () {
        localStorage['level'] = JSON.stringify(this.toJSON());
    },

    saveToFile: function () {
        this.saveToLS();
        this._saveToJsonFile(JSON.parse(localStorage['level']), 'level.json');
    },

    _saveToJsonFile: function (data, filename) {
        var blob = new Blob([JSON.stringify(data, undefined, 4)], { type: 'text/json' });
        var e = document.createEvent('MouseEvents');
        var a = document.createElement('a');

        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        e.initEvent('click', true, true);
        a.dispatchEvent(e);
    },

    loadFromLs: function () {
        this.set([]);
        this.add(JSON.parse(localStorage['level']));
    },

    loadFromFile: function () {
        var deferred = vow.defer();

        $.getJSON('statics/json/level.json', {}, function (levelJson) {
            this.set([]);
            this.add(levelJson);
            deferred.resolve();
        }.bind(this));

        return deferred.promise();
    }
});
