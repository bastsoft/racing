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
        angle: 0,
        x: 100,
        y: 100,
        img: carImage
    });
     var carModel2 = new CarModel({
        path: data.pathCollection.toJSON(),
        speed: 1,
        angle: 0,
        img: carImage
     });
    var trackCollection = new TrackCollection();
    var track = new TrackView({ ctx: context, collection: trackCollection });

    trackCollection.setPoint(data.trackCollection, data.width);

    setInterval(draw.bind(null, canvas, context, [
        track,
        new CarView({ ctx: context, model: carModel }),
        new CarView({ ctx: context, model: carModel2 })
    ]), 30);
});

function draw(canvas, context, items) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    items.forEach(function (item) {
        item.render();
    });
}

carImage.src = 'statics/img/car2.png';
