function ConvertHandler() {
  
  this.getNum = function(input) {
	//Zahl aus Input-String filtern
	let result;	  
	let obj = /[a-zA-Z]/.exec(input);
	//console.log("fund: "+obj);
	let filterdNum = obj != null ? obj.input.substr(0, obj.index) : input;
	
	//console.log("gefilterte nummer: ", filterdNum);
	
	// Teiler suchen
	let teiler = /[/]/.exec(filterdNum);
    if(teiler != null){
		//Aufteilen in  Zähler und Nenner
		let part1 = filterdNum.slice(0,teiler.index);
		let part2 = filterdNum.slice(teiler.index+1);
		//console.log("part1 ", part1, "part2 ", part2);
		// Teiler in Zähler und Nenner suchen, wenn ja: Fehler, return null
		let teiler1 = /[/]/.exec(part1);
		let teiler2 = /[/]/.exec(part2);
		if(teiler1 != null || teiler2 != null){ 
			return null;
		}else {
			if(part1 != null  && part2 != null){
				//Division - Rechnung
				filterdNum = part1 / part2;
			}
		}
	}
	if (filterdNum == null || filterdNum == '' || isNaN(filterdNum)){
		//wenn keine Zahl vorhanden ist
		filterdNum = 1;
	}
	result = parseFloat(filterdNum);
	/*if(isNaN(result)){
		//kann rausgenommen  werden
		result = 1;
	}*/
	//console.log(result);
    return result;
	
  };
  
  this.getUnit = function(input) {
	//Einheiten filtern, Stringausgabe wird in der api.js geregelt
	const units = ["mi","km","lbs","kg","gal","l"]; //alle gültigen Einheiten
	//Einheiten suchen
	let obj = /[a-zA-Z]/.exec(input);
	let result;
	// vlt noch trim?
	let filterunit = input.slice(obj.index).toLowerCase();
	console.log(filterunit);
	if (obj != null && units.indexOf(filterunit) > -1 && units.indexOf(filterunit) < 6 ){
		//wenn gefunden und es eine gültige Einheit ist
		if (filterunit == "l"){
			//bisschen umständlich, damit l und L für Liter klappt
			result = 'L';
		}else {
			result = filterunit;
		}
	}
	else { //wenn es keine gültige Einheit ist
		result = null;
	}
    return result;
  };
  
  this.getReturnUnit = function(initUnit) {
	 //Umwandlung Einheit --> Gegenstückeinheit im metrischen / imperialen System (je nachdem)
	 //default case überarbeiten
	  switch(initUnit) {
		case "mi":
		    return "km";
    		break;
		case "km":
			return "mi";
			break;
		case "lbs":
			return "kg";
			break;
		case "kg":
			return "lbs";
			break;
		case "gal":
			return "L";
			break;
		case "L":
			return "gal";
			break;
		default:
			console.error("Kein gültiger Einheiten-Input.")
			return "error";
		} 
  };

  this.spellOutUnit = function(unit) {
	 //Umwandlung Einheit --> ausgeschriebene Form
	 //default case überarbeiten
    switch(unit) {
		case "mi":
			return "miles";
			break;
		case "km":
			return "kilometers";
			break;
		case "lbs":
			return "pounds";
			break;
		case "kg":
			return "kilograms";
			break;
		case "gal":
			return "gallons";
			break;
		case "L":
			return "liters";
			break;
		default:
			console.error("Kein gültiger Einheiten-Input.")
			return "error";
		} 
  };
  
  this.convert = function(initNum, initUnit) {
	//Zahlumwandlung  von metrisch <--> imperial
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;
	//console.log(initNum, initUnit);
	    switch(initUnit) {
		case "mi":
			result = initNum * miToKm;
			break;
		case "km":
			result = initNum / miToKm;
			break;
		case "lbs":
			result = initNum * lbsToKg;
			break;
		case "kg":
			result = initNum / lbsToKg;
			break;
		case "gal":
			result = initNum * galToL;
			break;
		case "L":
			result = initNum / galToL;
			break;
		default:
			console.error("Kein gültiger Einheiten-Input.")
			result = NaN;
		} 
    return result;
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    //string-generierung 
	let result = initNum +" "+this.spellOutUnit(initUnit)+" converts to "+returnNum + " " +this.spellOutUnit(returnUnit);
    
    return result;
  };
  
}

module.exports = ConvertHandler;
