var KeyboardModel = require('./keyboard.model.js');
TransmissionModel = Backbone.Model.extend({
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
        var newAcceleration = (obj.inertia ? this._toAccelerateInertia.bind(this) : this._toAccelerate.bind(this))(obj);

        return (Math.abs(newAcceleration) < obj.max) ? newAcceleration : obj.what;
    },

    _toAccelerate: function (obj) {
        return (Math.abs(obj.what) + obj.step) * obj.trend;
    },

    _toAccelerateInertia: function (obj) {
        var newAcceleration;
        var trendName = 'trend-' + obj.name;
        var inertiaName = 'acceleration-' + obj.name;
        var vector = -1;
        var inertia = this.get(inertiaName) || obj.what;
        var trend = this.get(trendName);

        if (obj.trend !== 0) {
            if (inertia && (trend && trend !== obj.trend)) {
                inertia -= (0.02 * trend);
            } else {
                vector = 1;
                trend = obj.trend;
            }
        }

        newAcceleration = (Math.abs(inertia) + (obj.step * vector)) * trend;
        this.set(inertiaName, Math.abs(newAcceleration) < 0.94 ? 0 : newAcceleration);
        this.set(trendName, trend);

        return this.get(inertiaName);
    }
});

module.exports = TransmissionModel;
