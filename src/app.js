var CarView = require('./module/freeCar.view.js');
var CarModel = require('./module/car.model.js');

window.onload = $.getJSON.bind($, 'statics/json/path.json', {}, function (pathJson) {
    var path = localStorage.path ? JSON.parse(localStorage.path) : pathJson;
    var canvas = $('.canvas')[0];
    var context = canvas.getContext('2d');
    var carImage = new Image();

    carImage.onload = function () {
        var carModel = new CarModel({
            path: path,
            speed: 5,
            angle: 0,
            mod: 0,
            img: carImage
        });

        var carModel2 = new CarModel({
            speed: 5,
            angle: 0,
            mod: 0,
            x: path[0][0],
            y: path[0][1] + 100,
            img: carImage
        });

        setInterval(draw.bind(null, canvas, context, [
            _circle(context, path),
            new CarView({ ctx: context, model: carModel }),
            new CarView({ ctx: context, model: carModel2 })
        ]), 30);
    };

    carImage.src = 'statics/img/car.png';
});

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

function _circle(context, path) {
    return {
        render: function () {
            for (var i = 0; i <= path.length - 1; i += 1) {
                createPoint(context, path[i][0], path[i][1]);
            }
        }
    };
}
