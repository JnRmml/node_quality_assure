const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function(){
// #getNum
    test('#getNum1', function () {
      assert.typeOf(convertHandler.getNum("999"), 'number');
	});
	test('#getNum2', function () {
      assert.typeOf(convertHandler.getNum("99.34"), 'number');
	  });
	test('#getNum3', function () {    
      assert.typeOf(convertHandler.getNum("213/34"), 'number');
      });
	test('#getNum4', function () {
	  assert.typeOf(convertHandler.getNum("21.45/34"), 'number');
	});
	test('#getNum5', function () {
      assert.isNull(convertHandler.getNum("21/45/34"), 'number');
	});
	test('#getNum6', function () {
      assert.strictEqual(convertHandler.getNum("lbs"), 1);
      //assert.isNotNull(1, '1 is not null');
    });
	// #getUnit
    test('#getUnit1', function () {
      assert.strictEqual(convertHandler.getUnit("999kg"), 'kg');
	});
	test('#getUnit2', function () {
      assert.strictEqual(convertHandler.getUnit("999lbs"), 'lbs');
	});
	test('#getUnit3', function () {
      assert.strictEqual(convertHandler.getUnit("999L"), 'L');
	});
	test('#getUnit4', function () {
      assert.strictEqual(convertHandler.getUnit("999gal"), 'gal');
	});
	test('#getUnit5', function () {
    
      assert.strictEqual(convertHandler.getUnit("999km"), 'km');
	});
	test('#getUnit6', function () {
    
      assert.strictEqual(convertHandler.getUnit("999mi"), 'mi');
	});
	test('#getUnit7', function () {
    
      assert.isNull(convertHandler.getUnit("99.34m"));
	});
	test('#getUnit8', function () {
    
      assert.strictEqual(convertHandler.spellOutUnit(convertHandler.getUnit("kg")), 'kilograms');
	});
	test('#getUnit9', function () {
    
      assert.strictEqual(convertHandler.spellOutUnit(convertHandler.getUnit("km")), 'kilometers');
	});
	test('#getUnit10', function () {
    
      assert.strictEqual(convertHandler.spellOutUnit(convertHandler.getUnit("lbs")), 'pounds');
	});
	test('#getUnit11', function () {
    
      assert.strictEqual(convertHandler.spellOutUnit(convertHandler.getUnit("gal")), 'gallons');
	});
	test('#getUnit12', function () {
    
      assert.strictEqual(convertHandler.spellOutUnit(convertHandler.getUnit("L")), 'liters');
	});
	test('#getUnit13', function () {
    
      assert.strictEqual(convertHandler.spellOutUnit(convertHandler.getUnit("mi")), 'miles');
    });
	// #getReturnUnit
    test('#getReturnUnit', function () {
      assert.strictEqual(convertHandler.getReturnUnit("kg"), 'lbs');
    });
    test('#getReturnUnit', function () {
      assert.strictEqual(convertHandler.getReturnUnit("lbs"), 'kg');
    });
    test('#getReturnUnit', function () {
      assert.strictEqual(convertHandler.getReturnUnit("km"), 'mi');
    });
    test('#getReturnUnit', function () {
      assert.strictEqual(convertHandler.getReturnUnit("mi"), 'km');
    });
    test('#getReturnUnit', function () {
      assert.strictEqual(convertHandler.getReturnUnit("L"), 'gal');
    });
    test('#getReturnUnit', function () {
      assert.strictEqual(convertHandler.getReturnUnit("gal"), 'L');
    });
});