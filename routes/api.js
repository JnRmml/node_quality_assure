'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  function char_to_num(c){
  //console.log(c);	  
  if (c == 'A'){ return 0;}
  if (c == 'B'){ return 1;}
  if (c == 'C'){ return 2;}
  if (c == 'D'){ return 3;}
  if (c == 'E'){ return 4;}
  if (c == 'F'){ return 5;}
  if (c == 'G'){ return 6;}
  if (c == 'H'){ return 7;}
  if (c == 'I'){ return 8;}
  return "Fehler";
  }

  function num_to_char(c){
  //console.log(c);	  
  if (c == 0){ return 'A';}
  if (c == 1){ return 'B';}
  if (c == 2){ return 'C';}
  if (c == 3){ return 'D';}
  if (c == 4){ return 'E';}
  if (c == 5){ return 'F';}
  if (c == 6){ return 'G';}
  if (c == 7){ return 'H';}
  if (c == 8){ return 'I';}
  return "Fehler";
  }
  app.route('/api/check')
    .post((req, res) => {
		let puzzle = req.body.puzzle;
		let coord = req.body.coordinate;
		let value = req.body.value;
		let coord_split = [];
		//checks
		if (puzzle == null || puzzle == "" || coord == null || coord == "" || value == null || value == "" ) {
			return res.json({ error: 'Required field(s) missing' });
		}
		value = parseInt(value);
		if(value < 1 || value > 9  || isNaN(value)){
			return res.json({ error: 'Invalid value' });
		}
		
		//String mit 81 Stellen aus Zahlen und Punkten
		let res_puzzle = solver.validate(puzzle);
		if (res_puzzle == "not 81 long"){
			return res.json({ error: 'Expected puzzle to be 81 characters long' });
		}
		if (res_puzzle == "invalid char"){
			return res.json({ error: 'Invalid characters in puzzle' });
		}
		
		//
		//Werte / Eingaben checken
		
		if (coord != undefined && coord != null){
			coord_split = coord.split('');
		} 
		coord_split[0] = char_to_num(coord_split[0]);
		coord_split[1] = parseInt(coord_split[1]);
		if (coord_split[0] < 0 || coord_split[0] > 10  || coord_split[1] < 1 || coord_split[1] > 10 || coord_split.length != 2 || coord_split[0] == "Fehler" || isNaN(coord_split[1]) ) {
			return res.json({ error: 'Invalid coordinate' });
		}
		
		if(puzzle[coord_split[0] *9 + coord_split[1] -1] == value){
			return res.json({ valid : true});
		}
		let conf = [];
		if(! (solver.checkRowPlacement(puzzle, coord_split[0], coord_split[1]-1, value)) ) {//  checkRowPlacement(puzzleString, row, column, value) {
		
			conf.push("row");
			}		
		if(! (solver.checkColPlacement(puzzle, coord_split[0], coord_split[1]-1, value)) ) {
			conf.push("column");
			}
		if(! (solver.checkRegionPlacement(puzzle, coord_split[0], coord_split[1], value)) ) {
			conf.push("region");
			} 
			
        
		if (conf.length > 0){
			 res.json({ valid : false, conflict : conf });
			 //console.log(res);
			 return
		} else {
			return res.json({ valid : true });
		}
	});
    
  app.route('/api/solve')
    .post((req, res) => {
		let puzzle = req.body.puzzle;
		// kein puzzle String
		if (puzzle == null || puzzle == "") {
			return res.json({ error: 'Required field missing' });
		}
		//String mit 81 Stellen aus Zahlen und Punkten
		let res_puzzle = solver.validate(puzzle);
		if (res_puzzle == "not 81 long"){
			return res.json({ error: 'Expected puzzle to be 81 characters long' });
		}
		if (res_puzzle == "invalid char"){
			return res.json({ error: 'Invalid characters in puzzle' });
		}
		res_puzzle = solver.solve(puzzle);
		if (res_puzzle[0]){
			return res.json({ solution: res_puzzle[1] });
		} else {
			return res.json({ error: 'Puzzle cannot be solved' });
		}
	});
};
