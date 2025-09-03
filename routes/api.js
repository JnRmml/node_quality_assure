/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const { v4: uuidv4 } = require('uuid');
const myDB = require('./connection');
const { ObjectID } = require('mongodb');

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
	  
	try {
	  console.log("Anfrage get ohne ID");
	  myDB(async client => {
		const myDataBase = await client.db('database').collection('books');
		const books_that_exists = await myDataBase.find({}).toArray();
		
		if (books_that_exists) {
			// Buch ist schon vorhanden
		    //console.log("Buch schon vorhanden", books_that_exists._id);
		    //console.log("Rückgabe:", books_that_exists);
			//return res.json({ title: book_exists.title, _id: book_exists._id });
			return res.json(books_that_exists);
		}
		
          });	
    } catch (e) {
		console.error("Fehler:", e);
		return res.json({error: "keine Datenbankverbindung"});
	}finally {
		// Verbindung schließen
			//await client.close();
		}
    })
    
    .post(function (req, res){
	try {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
	  //console.log(req);
	  //console.log("Anfrage Post ohne Id");
	  //fehlender Titel
	  if(title == null || title == "") {
		  //res.statusCode = 200;
		res.setHeader('Content-Type', 'text/plain');
		res.end('missing required field title');
		return;
	  }
	  //DB Verbindung --> Anfrage: füge Buchtitel ein mit einer ID
	  let unique_id = uuidv4();
	  let old_id = "";
	  myDB(async client => {
		const myDataBase = await client.db('database').collection('books');
		const book_exists = await myDataBase.findOne({ title: title });
		
		if (book_exists) {
			// Buch ist schon vorhanden
		    console.log("Buch schon vorhanden", book_exists._id);
			return res.json({ title: book_exists.title, _id: book_exists._id });
		}
		
		const insert_operation = await myDataBase.insertOne({
          title: title,
          _id: unique_id,
		  commentcount: 0,
		  __v: 0,
		  comments: []
        });
		if (insert_operation.insertedId == null || insert_operation.insertedId == "") {
			  console.log("Fehler beim Einfügen in DB", err);
			  return res.json({ error: "Fehler beim Einfügen in die Datenbank" });
              //res.redirect('/');
            } else {
              // Erfolgreich eingefügt
				return res.json({ title: title, _id: unique_id });
			}
          });	
    } catch (e) {
		console.error("Fehler:", e);
		return res.json({error: "keine Datenbankverbindung", title: title, _id: unique_id});
	}finally {
		// Verbindung schließen
			//await client.close();
		}
	})
	  
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
	   try {
	  myDB(async client => {
		const myDataBase = await client.db('database').collection('books');
		const books_deleted = await myDataBase.deleteMany({});
		//console.log(books_deleted);
		if (books_deleted != null && books_deleted != "") {
	 	   res.setHeader('Content-Type', 'text/plain');
	       res.end('complete delete successful');
		}
		return;
          });	
    } catch (e) {
		console.error("Fehler:", e);
		return res.json({error: "keine Datenbankverbindung"});
	} finally {
		// Verbindung schließen
			//await client.close();
		}
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
	try {
	  //console.log("Anfrage GET mit id");
	  myDB(async client => {
		const myDataBase = await client.db('database').collection('books');
		const found_books = await myDataBase.findOne({_id : bookid});
		//console.log("Anpassen der Rückgabe, objekt:", found_books)
		if (found_books) {
			// Buch ist schon vorhanden
		    //console.log("Buch schon vorhanden", books_that_exists._id);
		    //console.log("Rückgabe:", books_that_exists);
			//return res.json({ title: book_exists.title, _id: book_exists._id });
			return res.json({ _id: found_books._id, title:  found_books.title, comments: found_books.comments });
		}
		
	 	   res.setHeader('Content-Type', 'text/plain');
	       res.end('no book exists');
		   return;
          });	
    } catch (e) {
		console.error("Fehler:", e);
		return res.json({error: "keine Datenbankverbindung"});
	} finally {
		// Verbindung schließen
			//await client.close();
		}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
	  //console.log("insert comment", bookid);
	  //console.log("insert comment", comment);
      //json res format same as .get
	  //fehlender Titel
	  if(comment == null || comment == "") {
		  //res.statusCode = 200;
		res.setHeader('Content-Type', 'text/plain');
		res.end('missing required field comment');
		return;
	  }
	  try {
	  myDB(async client => {
		const myDataBase = await client.db('database').collection('books');
		// Dokument aktualisieren 
		// $push um comment in Array hinzuzufügen
		const books_found = await myDataBase.updateOne({_id : bookid}, {$push: {comments : comment}, $inc: {commentcount: 1}} );
		
		//console.log(books_found);
		// Ergebnis prüfen
		if (books_found.matchedCount > 0) {
			console.log(`Erfolgreich aktualisiert: ${books_found.modifiedCount} Dokument(e)`);
			const res_update = await myDataBase.findOne({_id : bookid});
			return res.json({ _id: res_update._id, title:  res_update.title, comments: res_update.comments });
		} else {
			console.log("Kein Dokument gefunden, das dem Filter entspricht.");
	 	    res.setHeader('Content-Type', 'text/plain');
	        res.end('no book exists');
		}
		return;
          });	
    } catch (e) {
		console.error("Fehler:", e);
		return res.json({error: "keine Datenbankverbindung"});
	} finally {
		// Verbindung schließen
			//await client.close();
		}
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
	  try {
	  myDB(async client => {
		const myDataBase = await client.db('database').collection('books');
		const books_deleted = await myDataBase.deleteOne({_id : bookid});
		if (books_deleted.deletedCount > 0) {
	 	   res.setHeader('Content-Type', 'text/plain');
	       return res.end('delete successful');
		} else  {
		   res.setHeader('Content-Type', 'text/plain');
	       return res.end('no book exists');	
		}
          });	
    } catch (e) {
		console.error("Fehler:", e);
		return res.json({error: "keine Datenbankverbindung"});
	}finally {
		// Verbindung schließen
			//await client.close();
		}
    });
  
};
