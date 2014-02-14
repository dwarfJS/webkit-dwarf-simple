require(['../dist/simple'], function () {
    var $ = require('../dist/simple');

    describe('core', function () {

        before(function () {

        });

        describe('#toArray', function () {
            it('should return array', function () {
                console.log($.toArray({
                    '1': 'test1',
                    '2': 'test2'
                }));
            });
        });

        describe('$()', function () {
            it('should return array', function () {
                var tmp = $('#mocha');
                expect(tmp[0]).to.equal(document.getElementById('mocha'));
                expect(tmp.length).to.equal(1);
                expect(Array.isArray(tmp)).to.equal(true);
                expect()
            });
        });
    });
});
