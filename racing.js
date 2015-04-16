(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var CarView = require('./module/car.view.js');
var CarModel = require('./module/car.model.js');

window.onload = function () {
    var canvas = $('.canvas')[0];
    var context = canvas.getContext('2d');
    var carModel = new CarModel({
        x: 0,
        y: 0,
        speed: 5,
        angle: 0,
        mod: 0,
        imgSrc: 'img/car.png'
    });

    setInterval(draw.bind(null, context, [
        _circle(context),
        new CarView({ ctx: context, model: carModel })
    ]), 30);
};

function draw(context, items) {
    context.clearRect(0, 0, 800, 800);

    items.forEach(function (item) {
        item.render();
    });
}

function _circle(context) {
    return {
        render: function () {
            context.beginPath();
            context.arc(50, 50, 50, 0, 2 * Math.PI, false);
            context.lineWidth = 2;
            context.fillStyle = 'black';
            context.fill();
            context.closePath();
            context.stroke();
        }
    };
}

},{"./module/car.model.js":2,"./module/car.view.js":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
module.exports = Backbone.View.extend({
    initialize: function (obj) {
        this.ctx = obj.ctx;
    },

    render: function () {
        this.model.calculate();
        var model = this.model.toJSON();

        this.ctx.save();
        this.ctx.translate(model.x, model.y);
        this.ctx.rotate(model.rotate);
        this.ctx.drawImage(model.img, 0, (-model.imgHeight / 2), model.imgWidth, model.imgHeight);
        this.ctx.restore();
    }
});

},{}]},{},[1]);
