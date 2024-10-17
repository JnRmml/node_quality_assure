 var fs = require('fs');

class SudokuSolver {

  validate(puzzleString) {
	  //Tests: ist nicht 81 Stellen languag
		let len = puzzleString.length;
		if (len != 81) {
			return "not 81 long";
		}
		// hat nicht nur Punkte und  Zahlen 
		let puzzle_array = puzzleString.split('');
		for (let i = 0; i <  len; i++){
			if (isNaN(puzzle_array[i]) && puzzle_array[i] != '.'){
				return "invalid char";
			}
		}
		return "valid";
  }

  checkRowPlacement(puzzleString, row, column, value) {
	let puzzle = puzzleString.split('');
	for (let i = 0; i  < 9; i++){
		//console.log(row * 9 + i -1);
		//console.log(puzzle[row * 9 + i -1]);
		if(puzzle[row * 9 + i ] == value){
			return false;
			
		}
	}
	return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
	let puzzle = puzzleString.split('');
	//column -= 1;
	for (let i = 0; i  < 9; i++){
		if(puzzle[i * 9 + column ] == value){
			return false;
		}
	}
	return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
	let puzzle = puzzleString.split('');
	// Berechne den Startpunkt der Region
	 //column -= 1;
    let regionRowStart = Math.floor(row / 3) * 3;
    let regionColStart = Math.floor(column / 3) * 3;
    //console.log("koord:", row, column);
    // Durch die 3x3-Region iterieren
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let cellValue = puzzle[(regionRowStart + i) * 9 + (regionColStart + j )];
			 if (cellValue == value) {
                return false;
            }
        }
    }
	/*
	if(column == 1 || column == 4 || column == 7 ){
		//links
		vertical = "left";
	}
	if(column == 2 || column == 5 || column == 8 ){
		//mitte 	
		vertical = "mid";
	}
	if(column == 3 || column == 6 || column == 9 ){
		//rechts
		vertical = "right";
	}
	console.log("lmr:", vertical);
	column -= 1;
	if(row == 1 || row == 4 || row == 7 ){
		//oben
		//row -= 1;
		if (vertical == "left"){
			for (let j = 0; j < 3; j++){
				for (let k = 0; k < 3; k++){
					console.log("Pruef:", vertical, puzzle[(j + row -1) * 9 + k ], (j + row -1) * 9 + k); 
					if(puzzle[(j + row -1) * 9 + k ] == value){
						return false
					}
				}
			}
		}
		if (vertical == "mid"){
			for (let j = 0; j < 3; j++){
				for (let k = 0; k < 3; k++){
					if(puzzle[(j + row) * 9 + k -1] == value){
						return false
					}
				}
			}
			
		}
		if (vertical == "right"){
			
			for (let j = 0; j < 3; j++){
				for (let k = 0; k < 3; k++){
					if(puzzle[(j + row) * 9 + k -2] == value){
						return false
					}
				}
			}
		}
	}
	if(row == 2 || row == 5 || row == 8 ){
		//mitte
		//row -= 1;
		if (vertical == "left"){
			for (let j = 0; j < 3; j++){
				for (let k = 0; k < 3; k++){
					if(puzzle[(j + row -1) * 9 + k] == value){
						return false
					}
				}
			}
		}
		if (vertical == "mid"){
			for (let j = 0; j < 3; j++){
				for (let k = 0; k < 3; k++){
					if(puzzle[(j + row -1) * 9 + k -1] == value){
						return false
					}
				}
			}
			
		}
		if (vertical == "right"){
			
			for (let j = 0; j < 3; j++){
				for (let k = 0; k < 3; k++){
					if(puzzle[(j + row -1) * 9 + k -2] == value){
						return false
					}
				}
			}
		}
	}
	if(row == 3 || row == 6 || row == 9 ){
		//unten
		//row -= 1;
		if (vertical == "left"){
			for (let j = 0; j < 3; j++){
				for (let k = 0; k < 3; k++){
					if(puzzle[(j + row -2) * 9 + k] == value){
						return false
					}
				}
			}
		}
		if (vertical == "mid"){
			for (let j = 0; j < 3; j++){
				for (let k = 0; k < 3; k++){
					if(puzzle[(j + row -2) * 9 + k -1] == value){
						return false
					}
				}
			}
			
		}
		if (vertical == "right"){
			
			for (let j = 0; j < 3; j++){
				for (let k = 0; k < 3; k++){
					if(puzzle[(j + row -2) * 9 + k -2] == value){
						return false
					}
				}
			}
		}
	}*/
	return true;
  }


  check_conf(puzzleString, r, c, z){
	    let conf = []
	    if(! (this.checkRowPlacement(puzzleString, r, c, z)) ) {		
				conf.push("row");
			}		
		if(! (this.checkColPlacement(puzzleString, r, c, z)) ) {
				conf.push("column");
			}
		if(! (this.checkRegionPlacement(puzzleString, r, c, z)) ) {
				conf.push("region");
			} 
				
		if (conf.length === 0) {
			return true;
		} else {
			return false
		}
	}
		
	  


/* folgender Algorithmus muss sich an diesem Backtrack-Ansatz orientieren:
		
		Find row, col of an unassigned cell
		If there is none, return true
		For digits from 1 to 9
			if there is no conflict for digit at row,col
				assign digit to row,col and recursively try fill in rest of grid
				if recursion successful, return true
				if !successful, remove digit and try another
		if all digits have been tried and nothing worked, return false to trigger backtracking

	Die entsprechenden Bereiche werden per Kommentar gekennzeichnet
	Quelle: https://web.archive.org/web/20160911011444/https://see.stanford.edu/materials/icspacs106b/H19-RecBacktrackExamples.pdf (Algorithmus als Pseudocode und C++ enthalten)
	tbh: habe davor viel mit Schleifen und Arrays herumprobiert eine iterative Varriante zu implementieren, aber es funktionierte nicht so gut
*/
  solve(puzzleString) {
	let puzzle = puzzleString.split('');
	let len = puzzle.length;
	for(let i = 0; i < len; i++){
		//Find row, col of an unassigned cell
		//If there is none, return true (puzzleString here)
		if (puzzle[i] === '.') {
			let r = parseInt(Math.floor(i  / 9)); 
			let c = i % 9;
			for (let z = 1; z < 10; z++){
					if (this.check_conf(puzzleString, r, c, z)){
						//For digits from 1 to 9
							//if there is no conflict for digit at row,col
								//assign digit to row,col and recursively try fill in rest of grid
						puzzle[i] = z;
						puzzleString = puzzle.join('');
						//console.log(puzzleString);
						let erg = this.solve(puzzleString);
						if (erg[0]){//if recursion successful, return true
							puzzleString = erg[1];
							return [true, puzzleString];
						} else { //if !successful, remove digit and try another
							puzzle[i] = '.';
							puzzleString = puzzle.join('');
						} 
						
					}
				}
				//if all digits have been tried and nothing worked, return false to trigger backtracking
				return [false, puzzleString]
			}	
		}//for-loop fertig 
	return  [true, puzzleString]; //
  }
}

module.exports = SudokuSolver;

