var PointView = require('./point.view.js');

module.exports = Backbone.View.extend({
    elemInput: _.template([
        '<div>',
        '<label for="<%= id %>"><%= label %></label>',
        '<input class="level__input_<%= mod %>" type="number" id="<%= id %>" value="<%= content %>">',
        '</div>'
    ].join('')),
    elemButton: _.template('<button class="level__button_<%= mod %>"><%= content %></button>'),
    elemLi: _.template('<li class="level__li_<%= mod %>"><%= content %></li>'),

    initialize: function () {
        this.collections = ['trackCollection', 'pathCollection', 'barriersCollection'];

        this.model.bind('destroy', this.remove, this);

        this.collections.forEach(function (collectionName) {
            this.model.get(collectionName).on('add', this._redrawTrackItems.bind(this, collectionName));

            this['_add-' + collectionName] = function () {
                this.model.get(collectionName).push({});
            }.bind(this);

            this.events['click .level__button_add-' + collectionName] = '_add-' + collectionName;
        }, this);
    },

    _redrawTrackItems: function (collectionName) {
        var ulClass = '.level__ul-' + collectionName;

        this.$(ulClass).html('');
        this.model.get(collectionName).each(function (pointModel) {
            var pointView = new PointView({ model: pointModel });
            var trackItem = pointView.render();
            var li = $(this.elemLi({
                mod: 'li-track',
                content: ''
            })).append(trackItem.el);

            this.$(ulClass).append(li);
        }.bind(this));
    },

    events: {
        'keyup .level__input_number': '_numberKeyup',
        'keyup .level__input_width': '_widthKeyup',
        'click .level__button_delete': '_delete'
    },

    _delete: function () {
        this.model.destroy();
    },

    _numberKeyup: function () {
        var number = Number(this.$el.find('.level__input_number').val());
        this.model.set('number', number);
    },

    _widthKeyup: function () {
        var width = Number(this.$el.find('.level__input_width').val());
        this.model.set('width', width);
    },

    render: function () {
        this.$el.append(this.elemButton({
            mod: 'delete',
            content: 'X'
        }));
        this.$el.append(this.elemInput({
            mod: 'number',
            label: 'number of tracks',
            id: ('id' + Math.random()).replace('.', ''),
            content: this.model.get('number')
        }));
        this.$el.append(this.elemInput({
            mod: 'width',
            label: 'track width',
            id: ('id' + Math.random()).replace('.', ''),
            content: this.model.get('width')
        }));

        this.collections.forEach(function (collectionName) {
            this._addCollectionUI(collectionName);

            if (this.model.get(collectionName).length) {
                this._redrawTrackItems(collectionName);
            }
        }, this);

        return this;
    },

    _addCollectionUI: function (collectionName) {
        this.$el.append(this.elemButton({
            mod: 'add-' + collectionName,
            content: 'add ' + collectionName
        }));
        this.$el.append('<ul class="level__ul-' + collectionName + '"></ul>');
    }
});
