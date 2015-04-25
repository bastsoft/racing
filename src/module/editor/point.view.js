module.exports = Backbone.View.extend({
    elemInput: _.template([
        '<div class="point__enter">',
        '<label for="<%= id %>"><%= label %></label>',
        '<input class="point__input point__input_<%= mod %>" type="number" id="<%= id %>" value="<%= content %>">',
        '</div>'
    ].join('')),
    elemButton: _.template('<button class="point__button_<%= mod %>"><%= content %></button>'),

    initialize: function () {
        this.model.bind('destroy', this.remove, this);

        this.button = [];

        this._addButton('delete', 'X', function () {
            this.model.destroy();
        });
        this._addButton('addAfter', '>', function () {
            this.model.trigger('addAfter', this.model.cid);
        });
    },

    _addButton: function (name, content, callback) {
        var localName = '_' + name;

        this['_' + name + 'ButtonRender'] = this.$el.append.bind(this.$el, this.elemButton({
            mod: name,
            content: content
        }));

        this[localName] = callback.bind(this);
        this.events['click .point__button' + localName] = localName;

        this.button.push(name);
    },

    events: {
        'keyup .point__input_x': '_xKeyup',
        'keyup .point__input_y': '_yKeyup',
        'click .point__button_delete': '_delete'
    },

    _xKeyup: function () {
        var x = Number(this.$el.find('.point__input_x').val());
        this.model.set('x', x);
    },

    _yKeyup: function () {
        var y = Number(this.$el.find('.point__input_y').val());
        this.model.set('y', y);
    },

    render: function () {
        this.$el.append(this.elemInput({
            mod: 'x',
            label: 'x',
            id: ('id' + Math.random()).replace('.', ''),
            content: this.model.get('x')
        }));
        this.$el.append(this.elemInput({
            mod: 'y',
            label: 'y',
            id: ('id' + Math.random()).replace('.', ''),
            content: this.model.get('y')
        }));

        this.button.forEach(function (buttonName) {
            this['_' + buttonName + 'ButtonRender']();
        }, this);

        return this;
    }
});
