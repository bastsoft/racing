var CarView = require('./module/car.view.js');
var CarModel = require('./module/car.model.js');
var TrackCollection = require('./module/track.collection.js');
var TrackView = require('./module/track.view.js');
var LevelCollection = require('./module/level.collection.js');
var vow = require('../node_modules/vow/lib/vow.js');
var canvas = $('.canvas')[0];
var context = canvas.getContext('2d');
var onload = (new vow.Promise(function (resolve) {
    window.onload = resolve;
}));
var levelCollection = new LevelCollection();
var carImage = new Image();

onload.then(function () {
    return levelCollection.loadFromFile('statics/json/level.json');
}).then(function () {
    return new vow.Promise(function (resolve) {
        carImage.onload = resolve(carImage);
    });
}).then(function () {
    var data = levelCollection.toJSON()[0];
    var carModel = new CarModel({
        speed: 2,
        accelerationMax: 3,
        accelerationStep: 0.01,
        angle: 0,
        x: data.trackCollection[0].x,
        y: data.trackCollection[0].y - 30,
        img: carImage
    });
    var carModel2 = new CarModel({
        path: data.pathCollection.toJSON(),
        speed: 1,
        accelerationMax: 1,
        accelerationStep: 0.005,
        angle: 0,
        img: carImage
    });
    var trackCollection = new TrackCollection();
    var track = new TrackView({ ctx: context, collection: trackCollection });

    trackCollection.setPoint(data.trackCollection, data.width);

    setInterval(draw.bind(null, track, [
        new CarView({ ctx: context, model: carModel }),
        new CarView({ ctx: context, model: carModel2 })
    ]), 30);
});

function draw(track, itemsCar) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    track.render();

    itemsCar.forEach(function (car) {
        car.model.set('speed', track.checkBorder(car) ? 0.5 : 2);

        car.render();
    });
}

carImage.src = 'statics/img/car2.png';
