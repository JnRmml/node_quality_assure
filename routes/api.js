'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  let convertHandler = new ConvertHandler();
  app.get("/api/convert", (req, res) => {
	  let inp = req.query.input;
	  let iniU = convertHandler.getUnit(inp);
	  let initNum = convertHandler.getNum(inp);
	  //console.log(initNum);
	  //stärkere Vorbedingung, muss zuerst getestet werden
	  if (iniU == null && (initNum == null || isNaN(initNum))){ 
		  return res.end("invalid number and unit");
	  }else{
		if (iniU == null ){ 
		  return res.end("invalid unit");
		}else{
			if (initNum == null || isNaN(initNum) ){
				return res.end("invalid number");
			}else{
				let retU = convertHandler.getReturnUnit(iniU);
				let retNum = parseFloat(convertHandler.convert(initNum, iniU).toFixed(5));
				let statement = convertHandler.getString(initNum,iniU,retNum,retU);
				return res.json( {"initNum": initNum,"initUnit":iniU,"returnNum":retNum,"returnUnit":retU, "string": statement} );
			}
		}
	  }
  })
  

};
