var TransmissionModel = require('./transmission.model.js');

(function () {
    var expect = chai.expect;

    describe('TransmissionModel', function () {
        describe('acceleration', function () {
            it('если вперед а потом нейтралка должно быть замедление до нуля', function () {
                var shouldBe = JSON.stringify([
                    1.01, 1.02, 1.03, 1.04, 1.05, 1.06, 1.05, 1.04, 1.03,
                    1.02, 1.01, 1, 0.99, 0.98, 0.97, 0.96, 0.95, 0.94, 0, 0, 0
                ]);
                var acceleration = [];
                var direction = 1; // веперед
                var transmission = new TransmissionModel();

                for (var i = 0; i < 21; i = i + 1) {
                    if (i > 5) {
                        direction = 0;// стоп
                    }

                    transmission.setCurrent({
                        value: direction,
                        name: 'acceleration',
                        step: 0.01,
                        max: 5,
                        inertia: true
                    });

                    acceleration.push(transmission.get('current-acceleration'));
                }

                expect(JSON.stringify(acceleration)).to.equal(shouldBe);
            });
            it('если вперед, нейтралка, вперед не должно быть подергивания', function () {
                var shouldBe = JSON.stringify([1.01, 1.02, 1.03, 1.04, 1.05, 1.06, 1.07, 1.06, 1.07, 1.08]);
                var acceleration = [];
                var direction = 1; // веперед
                var transmission = new TransmissionModel();

                for (var i = 0; i < 10; i = i + 1) {
                    if (i > 6) {
                        direction = 0;// стоп
                    }

                    if (i > 7) {
                        direction = 1;// вперед
                    }

                    transmission.setCurrent({
                        value: direction,
                        name: 'acceleration',
                        step: 0.01,
                        max: 5,
                        inertia: true
                    });

                    acceleration.push(transmission.get('current-acceleration'));
                }

                expect(JSON.stringify(acceleration)).to.equal(shouldBe);
            });
            it('если при движении вперед нажать назад должен сработать тормоз', function () {
                var shouldBe = JSON.stringify([1.01, 1.02, 1.03, 1.04, 1.05, 1.06, 1.05, 1.02, 0.99, 0.96, 0]);
                var acceleration = [];
                var direction = 1; // веперед
                var transmission = new TransmissionModel();

                for (var i = 0; i < 11; i = i + 1) {
                    if (i > 5) {
                        direction = 0;// нетралка
                    }

                    if (i > 6) {
                        direction = -1;// назад
                    }

                    transmission.setCurrent({
                        value: direction,
                        name: 'acceleration',
                        step: 0.01,
                        max: 5,
                        inertia: true
                    });

                    acceleration.push(transmission.get('current-acceleration'));
                }

                expect(JSON.stringify(acceleration)).to.equal(shouldBe);
            });
            it('если при движении назад нажать вперед должен сработать тормоз', function () {
                var shouldBe = JSON.stringify([-1.01, -1.02, -1.03, -1.04, -1.05, -1.06, -1.05,
                    -1.02, -0.99, -0.96, 0]);
                var acceleration = [];
                var direction = -1; // веперед
                var transmission = new TransmissionModel();

                for (var i = 0; i < 11; i = i + 1) {
                    if (i > 5) {
                        direction = 0;// нетралка
                    }

                    if (i > 6) {
                        direction = 1;// назад
                    }

                    transmission.setCurrent({
                        value: direction,
                        name: 'acceleration',
                        step: 0.01,
                        max: 5,
                        inertia: true
                    });

                    acceleration.push(transmission.get('current-acceleration'));
                }

                expect(JSON.stringify(acceleration)).to.equal(shouldBe);
            });
        });
    });
}());
