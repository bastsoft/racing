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
