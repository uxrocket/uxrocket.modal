/**
 * @author Bilal Cinarli
 */

var expect = chai.expect;

describe('Testing UX Rocket Modal', function() {
    describe('Properties', function() {
        it('should have version property', function() {
            expect($.uxrmodal).to.have.property('version');
        });
    });
});