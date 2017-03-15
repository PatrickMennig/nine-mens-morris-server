// ==== IMPORTS ====
const assert = require('assert');
const Store  = require('../src/logic/store/Store');


// ==== TESTS ====
describe('Store', function () {

    describe('getValue', function () {

        it('should allow me to store a value', function () {
            const s   = new Store();
            const res = s.put(0, {prop: 'test'});
            assert.equal(true, res);
        });


        it('should allow me to store a value and access it', function () {
            const s = new Store();
            s.put(0, {prop: 'test'});
            const val = s.get(0);
            assert.equal('test', val.prop);
        });


        it('should allow me to store a value and delete it', function () {
            const s = new Store();
            s.put(0, {prop: 'test'});
            const res = s.delete(0);
            assert.equal(true, res);
        });

    });
});