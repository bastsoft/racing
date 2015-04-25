module.exports = Backbone.Model.extend({
    initialize: function (objModel) {
        var begin = objModel.begin;
        var end = objModel.end;
        var width = objModel.width;
        var angle = Math.atan2(end.y - begin.y, end.x - begin.x);

        this.set({
            begin: begin,
            end: end,
            angle: angle,
            sin: Math.sin(angle),
            cos: Math.cos(angle),
            radius: width,
            sqrRadius: Math.pow(width, 2),
            length: Math.sqrt(Math.pow(end.y - begin.y, 2) + Math.pow(end.x - begin.x, 2))
        });
    }
});
