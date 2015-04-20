module.exports = Backbone.Model.extend({
    initialize: function () {
        this._setCarImage();
        this._addEventKey();
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
            this._keyHandlers(key)(obj);
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
        this._calculateCoordinates('x', 'cos');
        this._calculateCoordinates('y', 'sin');
    },

    _calculateRotate: function () {
        this.set('rotate', this._getRotate());
    },

    _getRotate: function () {
        return Math.PI / 180 * this.get('angle');
    },

    _calculateCoordinates: function (axisName, trigonometricalName) {
        var car = this.toJSON();
        var axis = car[axisName];

        axis += (car.speed * car.mod) * Math[trigonometricalName](this._getRotate());
        this.set(axisName, axis);
    }
});
