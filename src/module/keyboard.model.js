module.exports = Backbone.Model.extend({
    initialize: function () {
        this._keysPress = {};
        this.set('direction', 0);
        this.set('turn', 0);
        this._addEventKey();
    },

    _addEventKey: function () {
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
            direction: 0,
            turn: 0
        };

        Object.keys(this._keysPress).forEach(function (key) {
            var handler = this._keyHandlers(key);

            if (handler) {
                handler(obj);
            }
        }, this);

        this.set('direction', obj.direction);
        this.set('turn', obj.turn);
        this.set('pressId', Math.random());
    },

    _keyHandlers: function (keyCode) {
        var that = this;
        var handlers = this._handlers;

        return {
            38: handlers.forward.bind(that),
            40: handlers.reverse.bind(that),
            37: handlers.left.bind(that),
            39: handlers.right.bind(that),
            87: handlers.forward.bind(that), // key W
            83: handlers.reverse.bind(that), // key S
            65: handlers.left.bind(that), // key A
            68: handlers.right.bind(that) // key D
        }[keyCode];
    },

    _handlers: {
        forward: function (obj) {
            obj.direction = 1;
        },
        reverse: function (obj) {
            obj.direction = -1;
        },
        left: function (obj) {
            obj.turn = -1;
        },
        right: function (obj) {
            obj.turn = 1;
        }
    }
});
