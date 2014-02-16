require(['../dist/simple'], function () {
    var $ = require('../dist/simple'),
        obj = {};

    describe('data', function () {

        before(function () {

        });

        describe('#cache', function () {
            it('should able to get the same cache', function () {
                expect($.data(obj).cache).to.equal($.data(obj).cache);
            });
        })

        describe('#set() & get()', function () {
            it('should able to set and get data', function () {
                var data = $.data(obj);
                data.set('test', 'test');
                expect(data.get('test')).to.equal('test');
            });
        });

        describe('#remove()', function () {
            it('should able to remove a data', function () {
                var data = $.data(obj);
                data.set('test', 'test');
                expect(data.remove('test')).to.equal('test');
                expect(data.get('test')).to.equal(undefined);
            });
        });
    });
});
