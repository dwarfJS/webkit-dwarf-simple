require(['../dist/simple'], function () {
    var $ = require('../dist/simple');

    describe('css', function () {

        before(function () {

        });

        describe('#hasClass()', function () {
            it('should return true when target className exists', function () {
                expect($.css.hasClass($('#has-class'), 'has-class')).to.equal(true);
                expect($.css.hasClass($('#has-class-2'), 'has-class')).to.equal(true);
            });
            it('should return false when target className not exists', function () {
                expect($.css.hasClass($('#not-has-class'))).to.equal(false);
            });
        });

        describe('#addClass()', function () {
            it('should add target class to target element', function(){
                $.css.addClass($('#not-has-class'), 'has-class');
                expect($.css.hasClass($('#not-has-class'), 'has-class')).to.equal(true);
                $.css.addClass($('#not-has-class'), 'has-class-1 has-class-2');
                expect($.css.hasClass($('#not-has-class'), 'has-class-2')).to.equal(true);
            });
        });

        describe('#removeClass()', function () {
            it('should remove target class from target element', function(){
                $.css.removeClass($('#not-has-class'), 'has-class');
                expect($.css.hasClass($('#not-has-class'), 'has-class')).to.equal(false);
                $.css.removeClass($('#not-has-class'), 'has-class-1 has-class-2');
                expect($.css.hasClass($('#not-has-class'), 'has-class-2')).to.equal(false);
            });
        });
    });
});
