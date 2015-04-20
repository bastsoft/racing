(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var CarView = require('./module/freeCar.view.js');
var CarModel = require('./module/car.model.js');

window.onload = function () {
    var path = JSON.parse(localStorage.path);
    var canvas = $('.canvas')[0];
    var context = canvas.getContext('2d');
    var carModel = new CarModel({
        path: path,
        speed: 5,
        angle: 0,
        mod: 0,
        imgSrc: 'img/car.png'
    });

    setInterval(draw.bind(null, canvas, context, [
        _circle(context),
        new CarView({ ctx: context, model: carModel })
    ]), 30);
};

function draw(canvas, context, items) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    items.forEach(function (item) {
        item.render();
    });
}

function createPoint(context, x, y) {
    context.beginPath();
    context.arc(x, y, 4, 0, 2 * Math.PI, false);
    context.lineWidth = 2;
    context.fillStyle = 'red';
    context.fill();
    context.closePath();
    context.stroke();
}

function _circle(context) {
    return {
        render: function () {
            var path = JSON.parse(localStorage.path);

            for (var i = 0; i <= path.length - 1; i += 1) {
                createPoint(context, path[i][0], path[i][1]);
            }
        }
    };
}

},{"./module/car.model.js":2,"./module/freeCar.view.js":3}],2:[function(require,module,exports){
module.exports = Backbone.Model.extend({
    initialize: function () {
        this.path = this.get('path');
        this.set('x', this.path[0][0]);
        this.set('y', this.path[0][1]);
        this.curPathId = 0;
        this._calculateAngle(this.path[0][0], this.path[0][1]);
        this._setCarImage();
        this._addEventKey();
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
        var x = this._calculateCoordinates('x', 'cos');
        var y = this._calculateCoordinates('y', 'sin');

        this._calculateRotate();
        this._calculateAngle(x, y);
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
