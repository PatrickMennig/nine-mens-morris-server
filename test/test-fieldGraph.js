// ==== IMPORTS ====
const assert 						= require('assert');
const fieldGraph					= require('../src/game/rules/fieldGraph');



// ==== TESTS ====
describe('fieldGraph', function () {

	describe('neighbors', function () {

		it('should return true for two intersections that are neighbors', function () {
			assert.equal(true, fieldGraph.neighbors(19,20));
		});

		it('should return false for two intersections that aren\'t neighbors', function () {
			assert.equal(false, fieldGraph.neighbors(1,20));
		});

	});

	describe('getNeighbors', function () {

		it('should return the neighbors of an intersection', function () {
			assert.deepEqual([16,18,20,22], fieldGraph.getNeighbors(19));
		});

		it('should return the neighbors of an intersection', function () {
			assert.deepEqual([7,12], fieldGraph.getNeighbors(8));
		});

	});

	describe('verticalNeighbors', function () {

		it('should return true if two intersections are vertical neighbors', function () {
			assert.equal(true, fieldGraph.verticalNeighbors(15,11));
		});

		it('should return false if two intersections aren\'t vertical neighbors', function () {
			assert.equal(false, fieldGraph.verticalNeighbors(15,16));
		});
	});

	describe('horizontalNeighbors', function () {

		it('should return true if two intersections are horizontal neighbors', function () {
			assert.equal(true, fieldGraph.horizontalNeighbors(4,5));
		});

		it('should return false if two intersections aren\'t horizontal neighbors', function () {
			assert.equal(false, fieldGraph.horizontalNeighbors(4,7));
		});
	});

	describe('getVerticalRow', function () {

		it('should return the vertical row/mill of an intersection', function () {
			assert.deepEqual([16,19,22], fieldGraph.getVerticalRow(19));
		});

		it('should return the vertical row/mill of an intersection', function () {
			assert.deepEqual([3,10,18], fieldGraph.getVerticalRow(3));
		});
	});

	describe('getHorizontalRow', function () {

		it('should return the horizontal row/mill of an intersection', function () {
			assert.deepEqual([9,10,11], fieldGraph.getHorizontalRow(10));
		});

		it('should return the horizontal row/mill of an intersection', function () {
			assert.deepEqual([15,16,17], fieldGraph.getHorizontalRow(17));
		});

	});

});
