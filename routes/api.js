'use strict';
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

module.exports = function (app) {
	
	// Dateipfad zur JSON-Datei
const jsonFilePath = path.join(__dirname, 'issues.json');

// Hilfsfunktion zum Laden der Daten aus der JSON-Datei
function loadIssues() {
  if (!fs.existsSync(jsonFilePath)) {
    return [];
  }
  const fileData = fs.readFileSync(jsonFilePath, 'utf-8');
  return JSON.parse(fileData || '[]'); // Leeres Array, falls die Datei leer ist
}

// Hilfsfunktion zum Speichern der Daten in der JSON-Datei
function saveIssues(issues) {
  fs.writeFileSync(jsonFilePath, JSON.stringify(issues, null, 2)); // Speichern mit 2er Einrückung für bessere Lesbarkeit
}

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      //let open_proj = req.params.open;
		/*
		
      project: project,
      issue_title: issue_title,
      issue_text: issue_text,
      created_by: created_by,
      assigned_to: assigned_to,
      status_text: status_text,
      created_on: time.toISOString(),
      updated_on: time.toISOString(),
      open: true,
      _id: uuidv4() 
	  */
		
		
    // Laden der vorhandenen Issues aus der JSON-Datei
    let issues = loadIssues();
	//console.log(issues);
    // Prüfen, ob ein Issue mit demselben Titel bereits existiert
    //let existingIssue = issues.find(issue => issue.project === project);
	let found = [];
	for (const ent in issues){
	//console.log(ent);
		if(issues[ent].project === project){
			found.push(issues[ent]);
		}
	}
	
	// Dynamische Filterung basierend auf den Query-Parametern
    const query = req.query; // Enthält alle Query-Parameter wie ?issue_title=xyz&created_by=abc

    found = found.filter(proj => {
      // Überprüfe alle Query-Parameter dynamisch
      for (let key in query) {
        if (query[key] && proj[key] !== query[key]) {
          return false; // Wenn ein Query-Parameter nicht übereinstimmt, schließe es aus
        }
      }
      return true; // Alle Bedingungen erfüllt
    });

    //console.log(`Gefundene Ergebnisse: ${JSON.stringify(found)}`);
	
	return res.json(found);

    })

   .post(function (req, res) {
    let project = req.params.project;
    console.log(project);
    console.log(req.body);

    let issue_title = req.body.issue_title;
    let issue_text = req.body.issue_text;
    let created_by = req.body.created_by;

    // Überprüfen auf fehlende Felder
    if ((issue_title == "" || issue_title == null) || (issue_text == "" || issue_text == null) || ( created_by == "" || created_by == null) ) {
      return res.json({ error: 'required field(s) missing' });
    }

    // Optionale Felder
	//Issue Text test
    let assigned_to = req.body.assigned_to || "";
    let status_text = req.body.status_text || "";

    let time = new Date(); // Aktuelle Zeit als Date-Objekt
    console.log("Zeit: ", time);

	let unique_id = uuidv4();
    // Erstellen des input_obj mit allen relevanten Feldern
    let input_obj = {
      project: project,
      issue_title: issue_title,
      issue_text: issue_text,
      created_by: created_by,
      assigned_to: assigned_to,
      status_text: status_text,
      created_on: time.toISOString(),
      updated_on: time.toISOString(),
      open: true,
      _id: unique_id // UUID für _id generieren
    };
    console.log("Eingabeobjekt1: ", input_obj);
	//return res.json(input_obj)

    console.log("Eingabeobjekt: ", input_obj);

    // Laden der vorhandenen Issues aus der JSON-Datei
    let issues = loadIssues();

    // Prüfen, ob ein Issue mit demselben Titel bereits existiert
    /*let existingIssue = issues.find(issue => issue.issue_title === issue_title);
	console.log("existiert:", existingIssue);
    if (existingIssue) {
      console.log("Eintrag bereits vorhanden: ", existingIssue);
      return res.status(400).json({ error: 'issue_title already exists' });
    }
	*/

    // Neuen Issue zum Array hinzufügen
    issues.push(input_obj);

    // Das Array wieder in der JSON-Datei speichern
    saveIssues(issues);

    console.log("Issue erfolgreich gespeichert: ", input_obj);

    // Erfolgreich -> input_obj als JSON zurückgeben
    return res.status(200).json({
      assigned_to: assigned_to,
      status_text: status_text,
      open: true,
      _id: unique_id, // UUID für _id generieren
      issue_title: issue_title,
      issue_text: issue_text,
      created_by: created_by,
      created_on: time.toISOString(),
      updated_on: time.toISOString()
    });
    })
    //})
    
    .put(function (req, res){
      let project = req.params.project;
      //console.log("proj", project);
      //console.log(req);
		const query = req.body; // Enthält alle Query-Parameter wie ?issue_title=xyz&created_by=abc
		//console.log("query", query);
		if(query._id == "" || query._id == null ){
			return res.json({ error: 'missing _id' });
		}
		let _id = query._id;
		if((query.issue_text == "" || query.issue_text == null) && (query.issue_title == "" || query.issue_title == null) && (query.created_by == "" || query.created_by == null) && (query.assigned_to == "" || query.assigned_to == null) && (query.status_text == "" || query.status_text == null) && (query.open == "" || query.open == null)){
			return res.json({ error: 'no update field(s) sent', '_id': _id  });
		}                                      		
	  
		let issues = loadIssues();
		// Dynamische Filterung basierend auf den Query-Parametern
		let updated = false;
		for (const ent in issues){
	    //console.log(ent);
		if(issues[ent]._id === query._id){
				//console.log(issues[ent]);
			if (query.issue_title != ''){
				issues[ent].issue_title = query.issue_title;
				updated = true;
			}
  		if (query.issue_text != ''){
				issues[ent].issue_text  = query.issue_text ;
				updated = true;
			}
  		if (query.created_by != ''){
				issues[ent].created_by = query.created_by;
				updated = true;
			}
  		if (query.assigned_to != ''){
				issues[ent].assigned_to = query.assigned_to;
				updated = true;
			}
  		if (query.status_text != ''){
				issues[ent].status_text = query.status_text;
				updated = true;
			}
  		if (query.open == 'false'){
				issues[ent].open = false;
				updated = true;
			} 
			//found.push(issues[ent]);
			/*if (query.open){
				issues[ent].open = false;
			}*/
				if (updated){
					let time = new Date(); // Aktuelle Zeit als Date-Objekt
					issues[ent].updated_on = time.toISOString();
					//console.log("change", issues[ent]);
				}
			}
		}
	
	if(updated){
		//console.log(`Gefundene Ergebnisse: ${JSON.stringify(issues)}`);
		// Das Array wieder in der JSON-Datei speichern
		saveIssues(issues);
		return res.json({  result: 'successfully updated', '_id': _id });
    } else {
		return res.json({  error: 'could not update', '_id': _id  });	
	}
	})
    
    .delete(function (req, res){
      let project = req.params.project;
      console.log(project);
		const query = req.body; // Enthält alle Query-Parameter wie ?issue_title=xyz&created_by=abc
      
		if(query._id == "" || query._id == null ){
			console.log("id missing");
			return res.json({ error: 'missing _id' });
		}
		let _id = query._id;
		// Laden der vorhandenen Issues aus der JSON-Datei
		let issues = loadIssues();
		let deleted = false;
		for (const ent in issues){
			//console.log(ent);
			if(issues[ent]._id === query._id){
				console.log(issues[ent]);
				issues.splice(ent, 1);
				deleted = true;
			}
		}
		saveIssues(issues);
	if(deleted){
		//console.log(`Gefundene Ergebnisse: ${JSON.stringify(issues)}`);
		return res.json({  result: 'successfully deleted', '_id': _id });
    } else {
		return res.json({  error: 'could not delete', '_id': _id  });	
	}
	
    });
    
};
