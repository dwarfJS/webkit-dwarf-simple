require(['../dist/simple.data'], function () {
    var Data = require('../dist/simple.data'),
        obj = {};

    describe('data', function () {

        before(function () {

        });

        describe('#cache', function () {
            it('should able to get the same cache', function () {
                expect(Data(obj).cache).to.equal(Data(obj).cache);
            });
        })

        describe('#set() & get()', function () {
            it('should able to set and get data', function () {
                var data = Data(obj);
                data.set('test', 'test');
                expect(data.get('test')).to.equal('test');
            });
        });

        describe('#remove()', function () {
            it('should able to remove a data', function () {
                var data = Data(obj);
                data.set('test', 'test');
                expect(data.remove('test')).to.equal('test');
                expect(data.get('test')).to.equal(undefined);
            });
        });
    });
});
