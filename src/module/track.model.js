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
    },

    checkEntry: function (carModel) {
        var modernPosition = this._turnAndTranslate(carModel);

        return (this._inRectangle(modernPosition) || this._inCircle(modernPosition));
    },

    _turnAndTranslate: function (carModel) {
        var begin = this.get('begin');

        return [
            this.get('cos') * (carModel.get('x') - begin.x) + this.get('sin') * (carModel.get('y') - begin.y),
            this.get('sin') * (-carModel.get('x') + begin.x) + this.get('cos') * (carModel.get('y') - begin.y)
        ];
    },

    _inRectangle: function (position) {
        if (Math.abs(position[1]) < this.get('radius') && position[0] > 0 && position[0] < this.get('length')) {
            return true;
        }

        return false;
    },

    _inCircle: function (position) {
        var sqrRadiusBegin = Math.pow(position[0], 2) + Math.pow(position[1], 2);
        var sqrRadiusEnd = Math.pow(position[1], 2) + Math.pow(position[0] - this.get('length'), 2);

        if ((sqrRadiusBegin < this.get('sqrRadius')) || sqrRadiusEnd < this.get('sqrRadius')) {
            return true;
        }

        return false;
    }
});
