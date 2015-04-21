var KeyboardModel = require('./keyboard.model.js');

module.exports = Backbone.Model.extend({
    initialize: function () {
        this.path = this.get('path');

        if (this.path) {
            this.set('x', this.path[0][0]);
            this.set('y', this.path[0][1]);
            this.curPathId = 0;
            this._calculateAngle(this.path[0][0], this.path[0][1]);
            this.set('mod', 1);
        } else {
            this._addEventKey();
        }

        this._setCarImage();
    },

    _addEventKey: function () {
        var keyModel = new KeyboardModel();

        keyModel.on('all', function () {
            var angle = this.get('angle');

            this.set('mod', keyModel.get('mod'));
            this.set('angle', angle + keyModel.get('angle'));
        }, this);
    },

    _calculateAngle: function (x, y) {
        if ((Math.abs(this.path[this.curPathId][0] - x) < 4 || Math.abs(this.path[this.curPathId][1] - y) < 4)) {
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
            a: [this.path[i][0], this.path[i][1]],
            b: [this.path[i + 1][0], this.path[i + 1][1]]
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

    _calculateCoordinates: function (axisName, trigonometricalName, mod) {
        var car = this.toJSON();
        var axis = car[axisName];

        if (mod === undefined) {
            mod = car.mod;
        }

        axis += (car.speed * mod) * Math[trigonometricalName](this._getRotate());

        return axis;
    }
});
