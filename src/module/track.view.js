module.exports = Backbone.View.extend({
    initialize: function (obj) {
        this.ctx = obj.ctx;
    },

    render: function () {
        this.collection.each(function (model) {
            var begin = model.get('begin');
            var length = model.get('length');
            var radius = model.get('radius');
            var width = 0;

            this.ctx.save();
            this.ctx.translate(begin.x, begin.y);
            this.ctx.rotate(model.get('angle'));
            this._drawCircle(length, 0, radius + width);
            this.ctx.fillRect(0, -radius - width, length, 2 * (radius + width));
            this.ctx.restore();
        }, this);

        this._drawFinish();
    },

    _drawCircle: function (x, y, radius) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2, false);
        this.ctx.closePath();
        this.ctx.fill();
    },

    _drawFinish: function () {
        var model = this.collection.at(1);
        var begin = model.get('begin');
        var radius = model.get('radius');

        this.ctx.save();
        this.ctx.translate(begin.x, begin.y);
        this.ctx.rotate(model.get('angle'));
        this.ctx.fillStyle = '#FFF';
        this.ctx.fillRect(0, -radius, 5, 2 * radius);
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(5, -radius, 3, 2 * radius);
        this.ctx.restore();
    },

    checkBorder: function (car) {
        return this.collection.checkBorder(car.model);
    }
});
