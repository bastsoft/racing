var CarView = require('./module/freeCar.view.js');
var CarModel = require('./module/freeCar.model.js');

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

    setInterval(draw.bind(null, canvas, context, [
        _circle(context),
        new CarView({ ctx: context, model: carModel })
    ]), 30);
};

function draw(canvas, context, items) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    items.forEach(function (item) {
        item.render();
    });
}

function createPoint(context, x, y) {
    context.beginPath();
    context.arc(x, y, 4, 0, 2 * Math.PI, false);
    context.lineWidth = 2;
    context.fillStyle = 'red';
    context.fill();
    context.closePath();
    context.stroke();
}

function _circle(context) {
    return {
        render: function () {
            var path = JSON.parse(localStorage.path);

            for (var i = 0; i <= path.length - 1; i += 1) {
                createPoint(context, path[i][0], path[i][1]);
            }
        }
    };
}
