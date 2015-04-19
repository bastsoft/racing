module.exports = Backbone.Model.extend({
    initialize: function () {
        var angle = this.get('angle');

        this.path = this.get('path');

        this.set('x', this.path[0][0]);
        this.set('y', this.path[0][1]);

        angle += this._calculateAngle(0);
        console.log('angle', angle);
        this.set('angle', angle);

        this._setCarImage();
        this._addEventKey();
    },

    _calculateAngle: function (i) {
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
        var carImage = new Image();

        carImage.src = this.get('imgSrc');
        this.set('img', carImage);
        this.set('imgWidth', carImage.width);
        this.set('imgHeight', carImage.height);
    },

    _addEventKey: function () {
        this._keysPress = {};
        window.addEventListener('keydown', this._keypress_handler.bind(this), false);
        window.addEventListener('keyup', this._keyup_handler.bind(this), false);
    },

    _keyup_handler: function (event) {
        delete this._keysPress[event.keyCode];
        this._keyCheck();
    },

    _keypress_handler: function (event) {
        this._keysPress[event.keyCode] = true;
        this._keyCheck();
    },

    _keyCheck: function () {
        var obj = {
            mod: 0,
            angle: this.get('angle')
        };

        Object.keys(this._keysPress).forEach(function (key) {
            var handler = this._keyHandlers(key);

            if (handler) {
                handler(obj);
            }
        }, this);

        this.set('mod', obj.mod);
        this.set('angle', obj.angle);
    },

    _keyHandlers: function (keyCode) {
        var that = this;

        return {
            38: that.handlers.forward.bind(that),
            40: that.handlers.reverse.bind(that),
            37: that.handlers.left.bind(that),
            39: that.handlers.right.bind(that),
            87: that.handlers.forward.bind(that), // key W
            83: that.handlers.reverse.bind(that), // key S
            65: that.handlers.left.bind(that), // key A
            68: that.handlers.right.bind(that) // key D
        }[keyCode];
    },

    handlers: {
        forward: function (obj) {
            obj.mod = 1;
        },
        reverse: function (obj) {
            obj.mod = -1;
        },
        left: function (obj) {
            obj.angle -= 5;
        },
        right: function (obj) {
            obj.angle += 5;
        }
    },

    calculate: function () {
        this._calculateRotate();
        this.set('x', this._calculateCoordinates('x', 'cos'));
        this.set('y', this._calculateCoordinates('y', 'sin'));
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
