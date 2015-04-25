module.exports = Backbone.Model.extend({
    initialize: function () {
        if (!this.get('x')) {
            this.set('x', 0);
        }

        if (!this.get('y')) {
            this.set('y', 0);
        }
    }
});
