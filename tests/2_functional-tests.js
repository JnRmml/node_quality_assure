const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    // #1
    test('Test POST /api/issues/{project}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/apitest')
		.send({
			"issue_title": "Test Titel",
			"issue_text": "issue_text No.1",
			"created_by": "Max Mustermann",
			"assigned_to": "Manni Musterperson",
			"status_text": "Status statusmensch",
			})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.equal(res.body.issue_title, 'Test Titel');
          assert.equal(res.body.issue_text, 'issue_text No.1');
          assert.equal(res.body.created_by, 'Max Mustermann');
          assert.equal(res.body.assigned_to, 'Manni Musterperson');
          assert.equal(res.body.status_text, 'Status statusmensch');
          done();
        });
    });
    // #2
    test('Test required POST /api/issues/{project}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/apitest')
		.send({
			"issue_title": "Test Titel_req",
			"issue_text": "issue_text No.1_req",
			"created_by": "Max Mustermann_req"
			})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.equal(res.body.issue_title, 'Test Titel_req');
          assert.equal(res.body.issue_text, 'issue_text No.1_req');
          assert.equal(res.body.created_by, 'Max Mustermann_req'); 
          done();
        });
    });
    // #3
    test('Test required missing POST /api/issues/{project}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/apitest')
		.send({
			"issue_title": "Test Titel_req",
			"created_by": "Max Mustermann_req"
			})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.equal(res.body.error, 'required field(s) missing'); 
          done();
        });
    });
    // #4
    test('GET request to /api/issues/{project}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/apitest')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.isArray(res.body, 'Should be an array'); 
          done();
        });
    });
    // #5
    test('GET with one filter request to /api/issues/{project}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/apitest?issue_title=Test%20Titel_req') 
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.isArray(res.body, 'Should be an array'); 
          assert.equal(res.body[0].issue_title, 'Test Titel_req');
          assert.equal(res.body[0].issue_text, 'issue_text No.1_req');
		  assert.equal(res.body[0].created_by, 'Max Mustermann_req'); 
          done();
        });
    });
    // #6
    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/apitest?issue_title=Test%20Titel_req&created_by=Max%20Mustermann_req') 
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.isArray(res.body, 'Should be an array'); 
          assert.equal(res.body[0].issue_title, 'Test Titel_req');
          assert.equal(res.body[0].issue_text, 'issue_text No.1_req');
          assert.equal(res.body[0].created_by, 'Max Mustermann_req'); 
          done();
        });
    });
    // #7
    test('Update one field on an issue: PUT request to /api/issues/{project}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/fcc-project')
		.send({
			"_id": "1457570f-ce38-4dde-9558-1fc4f48078cb",
			"created_by": "Max Mustermann Neu"
			})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.equal(res.body.result, 'successfully updated'); 
          assert.equal(res.body._id, "1457570f-ce38-4dde-9558-1fc4f48078cb"); 
          done();
        });
    });
    // #8
    test('Update multiple fields on an issue: PUT request to /api/issues/{project} ', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/fcc-project')
		.send({
			"_id": "1457570f-ce38-4dde-9558-1fc4f48078cb",
			"issue_title": "Test Titel_anders",
			"created_by": "Max Mustermann_Neuer"
			})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.equal(res.body.result, 'successfully updated'); 
          assert.equal(res.body._id, "1457570f-ce38-4dde-9558-1fc4f48078cb"); 
          done();
        });
    });
    // #9
    test('Update an issue with missing _id: PUT request to /api/issues/{project}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/fcc-project')
		.send({
			"issue_title": "Test Titel_req",
			"created_by": "Max Mustermann_req"
			})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.equal(res.body.error, 'missing _id'); 
          done();
        });
    });
    // #10
    test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/fcc-project')
		.send({
			"_id": "1457570f-ce38-4dde-9558-1fc4f48078cb"
			})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.equal(res.body.error, 'no update field(s) sent'); 
          done();
        });
    });
    // #11
    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/apitest')
		.send({
			"_id": "no invalid id is a valid id",
			"issue_title": "Test Titel_req",
			"created_by": "Max Mustermann_req"
			})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.equal(res.body.error, 'could not update'); 
          assert.equal(res.body._id, "no invalid id is a valid id"); 
          done();
        });
    });
    // #12
    test('DELETE request to /api/issues/{project}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/fcc-project')
		.send({
			"_id": "1457570f-ce38-4dde-9558-1fc4f48078cb"
			})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.equal(res.body.result, 'successfully deleted'); 
          assert.equal(res.body._id, "1457570f-ce38-4dde-9558-1fc4f48078cb"); 
          done();
        });
    });
    // #13
    test('invalid _id: DELETE request to /api/issues/{project}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/fcc-project')
		.send({
			"_id": "no invalid id is a valid id",
			})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.equal(res.body.error, 'could not delete'); 
          assert.equal(res.body._id, 'no invalid id is a valid id'); 
          done();
        });
    });
    // #14
    test('missing _id: DELETE request to /api/issues/{project}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/fcc-project')
		.send({	})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');//'application/json' Object);
          assert.equal(res.body.error, 'missing _id'); 
          done();
        });
    });
});
