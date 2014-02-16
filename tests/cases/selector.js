require(['../dist/simple'], function () {
    var $ = require('../dist/simple');

    describe('core', function () {

        before(function () {

        });

        describe('#toArray', function () {
            it('should return array', function () {
                expect($.toArray(document.getElementsByTagName('div')) instanceof Array).to.equal(true);
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
