var TransmissionModel = require('./transmission.model.js');

module.exports = Backbone.Model.extend({
    initialize: function () {
        this.path = this.get('path');
        this.transmission = new TransmissionModel();

        this.transmission.on('change:direction change:angle change:current-acceleration', function (model) {
            this.set('direction', model.get('direction'));
            this.set('current-acceleration', model.get('current-acceleration'));

            if (model.get('angle')) {
                this.set('angle', model.get('angle'));
            }
        }.bind(this));

        if (this.path) {
            this.set('x', this.path[0].x);
            this.set('y', this.path[0].y + 30);
            this.curPathId = 0;
            this._calculateAngle(this.path[0].x, this.path[0].y);
        } else {
            this.transmission.addEventKey();
        }

        this._setCarImage();
        this.set('currentTrack', -1);
    },

    _calculateAngle: function (x, y) {
        var checkTolerance = function (num, coor) {
            var tolerance = Math.abs(this.path[this.curPathId][num] - coor);

            return tolerance < 30;
        }.bind(this);

        if (checkTolerance('x', x) && checkTolerance('y', y)) {
            this.set('angle', this._getNewAngle(this.get('angle')));
            this.curPathId = (this.curPathId < this.path.length - 1) ? this.curPathId + 1 : 0;
            this._calculateAngle(x, y);
        }
    },

    _getNewAngle: function (angle) {
        angle -= this._calculateAngleRadians(this.curPathId);

        return angle;
    },

    _calculateAngleRadians: function (i) {
        var j = this.path[i + 1] ? i + 1 : 0;
        var first = {
            a: [this.path[i].x, this.path[i].y],
            b: [this.path[j].x, this.path[j].y]
        };
        var second = {
            a: [this.get('x'), this.get('y')],
            b: [this._calculateCoordinates('x', 'cos', 1), this._calculateCoordinates('y', 'sin', 1)]
        };

        var deltX1 = first.b[0] - first.a[0];
        var deltY1 = first.b[1] - first.a[1];

        var deltX2 = second.b[0] - second.a[0];
        var deltY2 = second.b[1] - second.a[1];

        return (Math.atan2(deltX1, deltY1) - Math.atan2(deltX2, deltY2)) * 180 / Math.PI;
    },

    _setCarImage: function () {
        var carImage = this.get('img');

        this.set('imgWidth', carImage.width);
        this.set('imgHeight', carImage.height);
    },

    calculate: function () {
        var x = this._calculateCoordinates('x', 'cos');
        var y = this._calculateCoordinates('y', 'sin');

        this._calculateRotate();

        if (this.path) {
            this._calculateAngle(x, y);
        }

        this.set('x', x);
        this.set('y', y);
    },

    _calculateRotate: function () {
        this.set('rotate', this._getRotate());
    },

    _getRotate: function () {
        return Math.PI / 180 * this.get('angle');
    },

    _calculateCoordinates: function (axisName, trigonometricalName, direction) {
        var car = this.toJSON();
        var axis = car[axisName];

        if (direction === undefined) {
            direction = car.direction;
        }

        this.transmission.setCurrent({
            value: direction,
            name: 'acceleration',
            step: car.accelerationStep,
            max: car.accelerationMax,
            inertia: true
        });

        axis += (car.speed * this.get('current-acceleration')) * Math[trigonometricalName](this._getRotate());

        return axis;
    },

    setCurrentTrack: function (currentTrack, lengthTrack) {
        if (lengthTrack - 1 === this.get('currentTrack')) {
            this.set('currentTrack', -1);
        }

        if (currentTrack === this.get('currentTrack') + 1) {
            this.set('currentTrack', currentTrack);
        }
    }
});
