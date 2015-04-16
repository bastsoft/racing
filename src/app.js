var CarView = require('./module/car.view.js');
var CarModel = require('./module/car.model.js');

window.onload = function () {
    var canvas = $('.canvas')[0];
    var context = canvas.getContext('2d');
    var carModel = new CarModel({
        x: 0,
        y: 0,
        speed: 5,
        angle: 0,
        mod: 0,
        imgSrc: 'img/car.png'
    });

    setInterval(draw.bind(null, context, [
        _circle(context),
        new CarView({ ctx: context, model: carModel })
    ]), 30);
};

function draw(context, items) {
    context.clearRect(0, 0, 800, 800);

    items.forEach(function (item) {
        item.render();
    });
}

function _circle(context) {
    return {
        render: function () {
            context.beginPath();
            context.arc(50, 50, 50, 0, 2 * Math.PI, false);
            context.lineWidth = 2;
            context.fillStyle = 'black';
            context.fill();
            context.closePath();
            context.stroke();
        }
    };
}
