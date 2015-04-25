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
            this.set('y', this.path[0].y);
            this.curPathId = 0;
            this._calculateAngle(this.path[0].x, this.path[0].y);
        } else {
            this.transmission.addEventKey();
        }

        this._setCarImage();
    },

    _calculateAngle: function (x, y) {
        var checkTolerance = function (num, x) {
            var tolerance = 5;
            console.log(this.curPathId, num, this.path[this.curPathId][num]);
            return Math.abs(this.path[this.curPathId][num] - x) < tolerance;
        }.bind(this);

        if (checkTolerance('x', x) || checkTolerance('y', y)) {
            this._setNewAngle();
            this.curPathId = (this.curPathId < this.path.length - 2) ? this.curPathId + 1 : 0;
            this._calculateAngle(x, y);
        }
    },

    _setNewAngle: function () {
        var angle = this.get('angle');

        angle += this._calculateAngleRadians(this.curPathId);
        this.set('angle', angle);
    },

    _calculateAngleRadians: function (i) {
        var first = {
            a: [this.path[i].x, this.path[i].y],
            b: [this.path[i + 1].x, this.path[i + 1].y]
        };
        var second = {
            a: [this.get('x'), this.get('y')],
            b: [this._calculateCoordinates('x', 'cos', 1), this._calculateCoordinates('y', 'sin', 1)]
        };
        var firstVector = [first.b[0] - first.a[0], first.b[1] - first.a[1]];
        var secondVector = [second.b[0] - second.a[0], second.b[1] - second.a[1]];
        var scalarProductVectors = (firstVector[0] * secondVector[0]) + (firstVector[1] * secondVector[1]);
        var firstLengthVectors = Math.sqrt(Math.pow(firstVector[0], 2) + Math.pow(firstVector[1], 2));
        var secondLengthVectors = Math.sqrt(Math.pow(secondVector[0], 2) + Math.pow(secondVector[1], 2));
        var cosA = scalarProductVectors / (firstLengthVectors * secondLengthVectors);
        var radians = Math.acos(cosA);

        return radians * 180 / Math.PI;
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
            step: 0.01,
            max: 5,
            inertia: true
        });

        if (!this.path) {
            console.log(this.get('current-acceleration'));
        }

        axis += (car.speed * this.get('current-acceleration')) * Math[trigonometricalName](this._getRotate());

        return axis;
    }
});
