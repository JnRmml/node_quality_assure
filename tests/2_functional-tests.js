const chaiHttp = require('chai-http');
const chai = require('chai');
let assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
// #10 L GET
    test('Test GET /api/convert with 10 L', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/convert?input=10L')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.equal(res.body.initNum , 10);
          assert.equal(res.body.initUnit, "L");//{"initNum": initNum,"initUnit":iniU,"returnNum":retNum,"returnUnit":retU, "string": statement}
          assert.equal(res.body.returnNum, 2.64172);//{"initNum": initNum,"initUnit":iniU,"returnNum":retNum,"returnUnit":retU, "string": statement}
          assert.equal(res.body.returnUnit, "gal");//{"initNum": initNum,"initUnit":iniU,"returnNum":retNum,"returnUnit":retU, "string": statement}
          assert.equal(res.body.string, "10 liters converts to 2.64172 gallons");//{"initNum": initNum,"initUnit":iniU,"returnNum":retNum,"returnUnit":retU, "string": statement}
          done();
        });
    });
	// #32 g GET
    test('Test GET /api/convert with 32 g', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/convert?input=32g')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'invalid unit');
          done();
        });
    });
	// #3/7.2/4kg GET
    test('Test GET /api/convert with 3/7.2/4kg', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/convert?input=3/7.2/4kg')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'invalid number');
          done();
        });
    });
	// #3/7.2/4kilomegagram GET
    test('Test GET /api/convert with 3/7.2/4kilomegagram', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/convert?input=3/7.2/4kilomegagram')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'invalid number and unit');
          done();
        });
    });
	// #kg GET
    test('Test GET /api/convert with kg', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/convert?input=kg')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.equal(res.body.initNum , 1);
          assert.equal(res.body.initUnit, "kg");//{"initNum": initNum,"initUnit":iniU,"returnNum":retNum,"returnUnit":retU, "string": statement}
          assert.equal(res.body.returnNum, 2.20462);//{"initNum": initNum,"initUnit":iniU,"returnNum":retNum,"returnUnit":retU, "string": statement}
          assert.equal(res.body.returnUnit, "lbs");//{"initNum": initNum,"initUnit":iniU,"returnNum":retNum,"returnUnit":retU, "string": statement}
          assert.equal(res.body.string, "1 kilograms converts to 2.20462 pounds");//{"initNum": initNum,"initUnit":iniU,"returnNum":retNum,"returnUnit":retU, "string": statement}
          done();
        });
    });
});
