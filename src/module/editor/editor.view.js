var LevelView = require('./level.view.js');
var LevelCollection = require('./../level.collection.js');
var TrackCollection = require('../track.collection.js');
var TrackView = require('../track.view.js');

module.exports = Backbone.View.extend({
    el: '.editor',

    elemButton: _.template('<button class="editor__button_<%= mod %>"><%= content %></button>'),
    elemLi: _.template('<li class="editor__li_<%= mod %>"><%= content %></li>'),

    events: {},

    initialize: function () {
        this.levelCollection = new LevelCollection();

        this.levelCollection.on('add', function () {
            this.$('.editor__ul-level').html('');
            this.levelCollection.each(function (levelModel) {
                var levelView = new LevelView({ model: levelModel });
                var level = levelView.render();
                var li = $(this.elemLi({
                    mod: 'li-level',
                    content: ''
                })).append(level.el);

                this.$('.editor__ul-level').append(li);
            }.bind(this));
        }.bind(this));

        this.button = [];

        this._addButton('save', 'SAVE', function () {
            this.levelCollection.saveToLS();
        });

        this._addButton('save-to-file', 'SAVE TO FILE', function () {
            this.levelCollection.saveToFile();
        });

        this._addButton('load-from-ls', 'LOAD FROM LS', function () {
            this.levelCollection.loadFromLs();
        });

        this._addButton('load-from-file', 'LOAD FROM FILE', function () {
            this.levelCollection.loadFromFile('statics/json/level.json');
        });

        this._addButton('add-level', 'add level', function () {
            this.levelCollection.push({});
        });

        this._addButton('redraw-all', 'redraw All', function () {
            var data = this.levelCollection.toJSON()[0];
            var canvas = $('.canvas')[0];
            var context = canvas.getContext('2d');
            var trackCollection = new TrackCollection();
            var track = new TrackView({ ctx: context, collection: trackCollection });

            var createPoint = function (context, x, y) {
                context.beginPath();
                context.arc(x, y, 4, 0, 2 * Math.PI, false);
                context.lineWidth = 2;
                context.fillStyle = 'red';
                context.fill();
                context.fillStyle = '#000';
                context.closePath();
                context.stroke();
            };
            var _circle = function (context, path) {
                return {
                    render: function () {
                        for (var i = 0; i <= path.length - 1; i += 1) {
                            createPoint(context, path[i].x, path[i].y);
                        }
                    }
                };
            };

            trackCollection.setPoint(data.trackCollection, data.width);
            context.clearRect(0, 0, canvas.width, canvas.height);
            track.render();
            _circle(context, data.pathCollection.toJSON()).render();
        });
    },

    _addButton: function (name, content, callback) {
        var localName = '_' + name;

        this['_' + name + 'ButtonRender'] = this.$el.append.bind(this.$el, this.elemButton({
            mod: name,
            content: content
        }));

        this[localName] = callback.bind(this);
        this.events['click .editor__button' + localName] = localName;

        this.button.push(name);
    },

    render: function () {
        this.button.forEach(function (buttonName) {
            this['_' + buttonName + 'ButtonRender']();
        }, this);

        this.$el.append('<ul class="editor__ul-level"></ul>');
    }
});
