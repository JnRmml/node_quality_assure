const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

	
    //Solve a puzzle with valid puzzle string: POST request to /api/solve
    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
		.send({
			"puzzle": "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37." 
			})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.equal(res.body.solution , '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
		  done();
        });
    });
    //Solve a puzzle with missing puzzle string: POST request to /api/solve
    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
		.send({ })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.equal(res.body.error , 'Required field missing');
		  done();
        });
    });
    //Solve a puzzle with invalid characters: POST request to /api/solve
    test('Solve a puzzle with invalid characters: POST request to /api/solve', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
		.send({ 
			"puzzle": "1.5..2.84..63.12.7.2a.5.....9..1....8.2.3674.3.7.2..$.47...8..1..16....926914.37." 
			})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.equal(res.body.error , 'Invalid characters in puzzle');
		  done();
        });
    });
    //Solve a puzzle with incorrect length: POST request to /api/solve
    test('Solve a puzzle with incorrect length: POST request to /api/solve', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
		.send({ 
			"puzzle": "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...311" 
			})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.equal(res.body.error , 'Expected puzzle to be 81 characters long');
		  done();
        });
    });
    //Solve a puzzle that cannot be solved: POST request to /api/solve
    test('Solve a puzzle that cannot be solved: POST request to /api/solve', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
		.send({ 
			"puzzle": "1.5..2.84..63.12.7.25.5.5...9..1....8.2.3674.3.7.2..5.47...8..1..16....926914.37." 
			})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.equal(res.body.error , 'Puzzle cannot be solved');
		  done();
        });
    });
    //Check a puzzle placement with all fields: POST request to /api/check
    test('Check a puzzle placement with all fields: POST request to /api/check', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
		.send({ 
			"puzzle" : '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
		    "coordinate" : 'A1',
		    "value" : '1'
			})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.equal(res.body.valid , true);
		  done();
        });
    });
    //Check a puzzle placement with single placement conflict: POST request to /api/check
    test('Check a puzzle placement with single placement conflict: POST request to /api/check', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
		.send({ 
			"puzzle" : '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
		    "coordinate" : 'B5',
		    "value" : '2'
			})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.equal(res.body.valid , false);
          assert.equal(res.body.conflict[0] , "column");
          assert.equal(res.body.conflict.length , 1);
          assert.isArray(res.body.conflict , "conflict soll ein Array sein");
		  done();
        });
    });
    //Check a puzzle placement with multiple placement conflicts: POST request to /api/check
    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
		.send({ 
			"puzzle" : '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
		    "coordinate" : 'D3',
		    "value" : '8'
			})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.equal(res.body.valid , false);
          assert.equal(res.body.conflict[0] , "row");
          assert.equal(res.body.conflict[1] , "column");
          assert.equal(res.body.conflict.length , 2);
          assert.isArray(res.body.conflict , "conflict soll ein Array sein");
		  done();
        });
    });
    //Check a puzzle placement with all placement conflicts: POST request to /api/check
    test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
		.send({ 
            "puzzle" : '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
            "coordinate" : 'D3',
            "value" : '4'
            })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.equal(res.body.valid , false);
          assert.equal(res.body.conflict[0] , "row");
          assert.equal(res.body.conflict[1] , "column");
          assert.equal(res.body.conflict[2] , "region");
          assert.equal(res.body.conflict.length , 3);
          assert.isArray(res.body.conflict , "conflict soll ein Array sein");
		  done();
        });
    });
    //Check a puzzle placement with missing required fields: POST request to /api/check
	test('Check a puzzle placement with missing required fields: POST request to /api/check', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.equal(res.body.error , "Required field(s) missing");
		  done();
        });
    });
    //Check a puzzle placement with invalid characters: POST request to /api/check
	test('Check a puzzle placement with invalid characters: POST request to /api/check', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ 
            "puzzle" : '..839.7.575.....964.!1.......16.29846.9.312.7..754....a62..5.78.8...3.2...492...1',
            "coordinate" : 'D3',
            "value" : "8"
           })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.equal(res.body.error , "Invalid characters in puzzle");
          done();
        });
    });
    //Check a puzzle placement with incorrect length: POST request to /api/check
	test('Check a puzzle placement with incorrect length: POST request to /api/check', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
		.send({ 
			"puzzle" : '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...111',
		    "coordinate" : 'D3',
		    "value" : "8"
			})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.equal(res.body.error , "Expected puzzle to be 81 characters long");
		  done();
        });
    });
	//Check a puzzle placement with invalid placement coordinate: POST request to /api/check
	test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
		.send({ 
			"puzzle" : '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
		    "coordinate" : 'Z3',
		    "value" : "8"
			})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.equal(res.body.error , "Invalid coordinate");
		  done();
        });
    });
    //Check a puzzle placement with invalid placement value: POST request to /api/check
    test('Check a puzzle placement with invalid placement value: POST request to /api/check', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
		.send({ 
			"puzzle" : '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
		    "coordinate" : 'D3',
		    "value" : "82"
			})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.equal(res.body.error , "Invalid value");
          done();
        });
    });

});

