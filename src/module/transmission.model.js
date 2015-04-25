var KeyboardModel = require('./keyboard.model.js');

module.exports = Backbone.Model.extend({
    initialize: function () {
        this.set('direction', 1);
    },

    addEventKey: function () {
        this.keyModel = new KeyboardModel();
        this.set('direction', 0);

        this.keyModel.on('all', function () {
            var angle = this.get('angle') || 0;

            if (this.get('current-acceleration')) {
                this.setCurrent({
                    value: this.keyModel.get('turn'),
                    name: 'turn',
                    step: 0.1,
                    max: 10
                });
                this.set('angle', angle + this.get('current-turn'));
            }

            this.set('direction', this.keyModel.get('direction'));
        }, this);
    },

    setCurrent: function (obj) {
        if (this.get(obj.name) !== obj.value) {
            this.set(obj.name, obj.value);
            this.set('current-' + obj.name, this.get(obj.name));
        }

        obj.what = this.get('current-' + obj.name);
        obj.trend = this.get(obj.name);

        this.set('current-' + obj.name, this._addAcceleration(obj));
    },

    _addAcceleration: function (obj) {
        var newAcceleration;
        var trendName = 'inertia-trend-' + obj.name;
        var inertiaName = 'inertia-acceleration-' + obj.name;

        if (obj.trend !== 0 || !obj.inertia) {
            newAcceleration = (Math.abs(obj.what) + obj.step) * obj.trend;
            this.set(trendName, obj.trend);
        } else {
            newAcceleration = (Math.abs(this.get(inertiaName)) - obj.step) * this.get(trendName);
        }

        this.set(inertiaName, newAcceleration);

        return (Math.abs(newAcceleration) < obj.max) ? newAcceleration : obj.what;
    }
});
