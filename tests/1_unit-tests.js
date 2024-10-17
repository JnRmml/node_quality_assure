const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const puzzle_strings = require('../controllers/puzzle-strings.js');
let solver = new Solver();

suite('Unit Tests', () => {

    //Logic handles a valid puzzle string of 81 characters
	test('string of 81 characters', function () {
      //assert.strictEqual(solver.validate("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."), 'valid');
	  //console.log(puzzle_strings.puzzlesAndSolutions[1]);
      assert.strictEqual(solver.validate(puzzle_strings.puzzlesAndSolutions[1][1]), 'valid');
	});
    //Logic handles a puzzle string with invalid characters (not 1-9 or .)
	test('puzzle string with invalid characters (not 1-9 or .)', function () {
      assert.strictEqual(solver.validate("1.5..!.84..63.12.7.2..5.a...9..1....8.2.3674.3.7.2..9.47...8..1..16....9269ü4.37."), 'invalid char');
	});
    //Logic handles a puzzle string that is not 81 characters in length
	test('string that is not 81 characters in length', function () {
      //assert.strictEqual(solver.validate("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."), 'valid');
	  //console.log(puzzle_strings.puzzlesAndSolutions[1]);
      assert.strictEqual(solver.validate(puzzle_strings.puzzlesAndSolutions[1][1]+"1"), 'not 81 long');
	});
    //Logic handles a valid row placement
	test('Logic handles a valid row placement', function () {
        assert.strictEqual(solver.checkRowPlacement(puzzle_strings.puzzlesAndSolutions[2][0], 7, 4, 4), true);
	});
    //Logic handles an invalid row placement
	test('Logic handles an invalid row placement', function () {
        assert.strictEqual(solver.checkRowPlacement(puzzle_strings.puzzlesAndSolutions[3][0], 6, 6, 1), false);
	});
    //Logic handles a valid column placement
	test('Logic handles a valid column placement', function () {
        assert.strictEqual(solver.checkColPlacement(puzzle_strings.puzzlesAndSolutions[2][0], 4, 6, 1), true);
	});
    //Logic handles an invalid column placement
	test('Logic handles a invalid column placement', function () {
        assert.strictEqual(solver.checkColPlacement(puzzle_strings.puzzlesAndSolutions[2][0], 6, 4, 2), false);
	});
    //Logic handles a valid region (3x3 grid) placement
	test('Logic handles a valid region (3x3 grid) placement', function () {
        assert.strictEqual(solver.checkRegionPlacement(puzzle_strings.puzzlesAndSolutions[2][0], 4, 5, 9), true);
	});
    //Logic handles an invalid region (3x3 grid) placement
	test('Logic handles an invalid region (3x3 grid) placement', function () {
        assert.strictEqual(solver.checkRegionPlacement(puzzle_strings.puzzlesAndSolutions[2][0], 6, 4, 2), false);
	});
    //Valid puzzle strings pass the solver
	test('Valid puzzle strings pass the solver', function () {
        assert.strictEqual(solver.solve(puzzle_strings.puzzlesAndSolutions[4][0])[0], true);
	});
    //Invalid puzzle strings fail the solver
	test('Invalid puzzle strings fail the solver', function () {
        assert.equal(solver.solve('82..4..65..16..89...98315.749.157..5.....5....53..4...96.415..81.57632..3...28.51')[0], false);
	});
    //Solver returns the expected solution for an incomplete puzzle
	test('Solver returns the expected solution for an incomplete puzzle', function () {
        assert.equal(solver.solve(puzzle_strings.puzzlesAndSolutions[2][0])[0], true);
	});

});
