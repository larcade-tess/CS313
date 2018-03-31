var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer(); // for parsing multipart/form-data
var session = require('express-session');

var pg = require("pg"); // This is the postgres database connection module.

const connectionString = process.env.DATABASE_URL || "postgres://admin:1234pass@localhost:5433/japdb";
console.log('Connecting to DB : ', connectionString);
var v = path.join(__dirname, 'public', 'views');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', v);
app.set('view engine', 'ejs');


app.use(session({
	name: 'test-session',
	secret: 'Ill never tell',
	saveUninitialized: true
}));

app.get('/getContact', function(request, response) {
	getContact(request, response);
});
app.get('/insertContact', function(request, response) {
	insertContact(request, response);
});
app.get('/contacts', function(request, response) {
	response.render(path.join('pages', 'contacts'));
});
app.post('/newContact', function (request, response) {
	addContact(request, response);
});
app.post('/settings', function (request, response) {
	settings(request, response);
});


app.get('/getApartment', function(request, response) {
	getApartment(request, response);
});
app.get('/updateApartment', function(request, response) {
	updateApartment(request, response);
});
app.get('/editApartment', function(request, response) {
	editApartment(request, response);
});
app.get('/editApt', function(request, response){
	response.render(path.join('pages', 'editApt'));
});
app.get('/addApartment', function(request, response){
	response.render(path.join('pages', 'addApartment'));
});
app.post('/newApartment', function (request, response) {
	addApartment(request, response);
	// response.render(path.join('pages', 'allApartments'));
});
app.get('/all', function(request, response) {
	all(request, response);
});
app.get('/allApartments', function(request, response) {
	response.render(path.join('pages', 'allApartments'));
});

app.get('/', function(request, response) {
	response.render(path.join('pages', 'apartments'));
});
app.get('/available', function(request, response) {
	available(request, response);
});
app.get('/apartment1', function(request, response) {
	response.render(path.join('pages', 'apartment1'));
});
app.get('/apartment2', function(request, response) {
	response.render(path.join('pages', 'apartment2'));
});
app.get('/apartmentNumber', function(request, response) {
	apartmentNumber(request, response);
});


app.get('/showing', function(request, response) {
	response.render(path.join('pages', 'showing'));
});
app.get('/showingList', function(request, response) {
	showingList(request, response);
});

app.get('/settings', function(request, response) {
	response.render(path.join('pages', 'settings'));
});



app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});

function getContact(request, response) {
	getPeople(function(error, result) {
		if (error || result == null ) {
			response.status(500).json({success: false, data: error});
		} else {
			response.status(200).json(result);
		}
	});
}

function getPeople(callback) {
	var client = new pg.Client(connectionString);

	client.connect(function(err) {
		if (err) {
			console.log("Error connecting to DB: ")
			console.log(err);
			callback(err, null);
		}

		var sql = "SELECT * FROM contact";

		var query = client.query(sql, function(err, result) {
			client.end(function(err) {
				if (err) throw err;
			});

			if (err) {
				console.log("Error in query: ")
				console.log(err);
				callback(err, null);
			}
			console.log(result.rows);
			callback(null, result.rows);
		});
	});
} 

function insertContact(request, response) {
	var first = request.query.first_name;
	var last = request.query.last_name;
	var phone = request.query.phone;
	var email = request.query.email;

	insertContactToDb(first, last, phone, email, function(error, result) {

		if (error || result == null || result.length != 1) {
			response.status(500).json({success: false, data: error});
		} else {
			var person = result[0];
			response.status(200).json(result[0]);
		}
	});
}

function insertContactToDb(first, last, phone, email, callback) {

	var client = new pg.Client(connectionString);

	client.connect(function(err) {
		if (err) {
			console.log("Error connecting to DB: ")
			console.log(err);
			callback(err, null);
		}

		var sql = "INSERT INTO contact (first_name, last_name, phone, email) VALUES ($1, $2, $3, $4)";
		var params = [first, last, phone, email];

		var query = client.query(sql, params, function(err, result) {
			// we are now done getting the data from the DB, disconnect the client
			client.end(function(err) {
				if (err) throw err;
			});

			if (err) {
				console.log("Error in query: ")
				console.log(err);
				callback(err, null);
			}

			console.log("Found result: " + JSON.stringify(result.rows));

			// call whatever function the person that called us wanted, giving it
			// the results that we have been compiling
			callback(null, result.rows);
		});
	});

}


function getApartment(request, response) {
	// First get the person's id
	var id = request.query.id;

	// TODO: It would be nice to check here for a valid id before continuing on...

	// use a helper function to query the DB, and provide a callback for when it's done
	getApartmentFromDb(id, function(error, result) {
		// This is the callback function that will be called when the DB is done.
		// The job here is just to send it back.

		// Make sure we got a row with the person, then prepare JSON to send back
		if (error || result == null || result.length != 1) {
			response.status(500).json({success: false, data: error});
		} else {
			var person = result[0];
			response.status(200).json(result[0]);
		}
	});
}

function getApartmentFromDb(id, callback) {
	console.log("Apartment Info" + id);

	var client = new pg.Client(connectionString);

	client.connect(function(err) {
		if (err) {
			console.log("Error connecting to DB: ")
			console.log(err);
			callback(err, null);
		}

		var sql = "SELECT apartment_id, rented, location, price, bed, bath, sqft FROM apartment WHERE apartment_id = $1::int";
		var params = [id];

		var query = client.query(sql, params, function(err, result) {
			// we are now done getting the data from the DB, disconnect the client
			client.end(function(err) {
				if (err) throw err;
			});

			if (err) {
				console.log("Error in query: ")
				console.log(err);
				callback(err, null);
			}

			console.log("Found result: " + JSON.stringify(result.rows));
			// call whatever function the person that called us wanted, giving it
			// the results that we have been compiling
			callback(null, result.rows);
		});
	});

}

function all (request, response) {
	allApartments(function(error, result) {
		if (error || result == null ) {
			response.status(500).json({success: false, data: error});
		} else {
			response.status(200).json(result);
		}
	});
}

function allApartments(callback){
	var client = new pg.Client(connectionString);

	client.connect(function(err) {
		if (err) {
			console.log("Error connecting to DB: ")
			console.log(err);
			callback(err, null);
		}

		var sql = "SELECT * FROM apartment";

		var query = client.query(sql, function(err, result) {
			client.end(function(err) {
				if (err) throw err;
			});

			if (err) {
				console.log("Error in query: ")
				console.log(err);
				callback(err, null);
			}
			console.log(result.rows);
			callback(null, result.rows);
		});
	});
}
function showingList (request, response) {
	apartmentShow(function(error, result) {
		if (error || result == null ) {
			response.status(500).json({success: false, data: error});
		} else {
			response.status(200).json(result);
		}
	});
}

function apartmentShow(callback){
	var client = new pg.Client(connectionString);

	client.connect(function(err) {
		if (err) {
			console.log("Error connecting to DB: ")
			console.log(err);
			callback(err, null);
		}

		var sql = "SELECT apartment_id, location FROM apartment WHERE rented = false";

		var query = client.query(sql, function(err, result) {
			client.end(function(err) {
				if (err) throw err;
			});

			if (err) {
				console.log("Error in query: ")
				console.log(err);
				callback(err, null);
			}
			console.log(result.rows);
			callback(null, result.rows);
		});
	});
}

function addContact (request, response) {
	var fName = request.body.fName;
	var lName = request.body.lName;
	var phone = request.body.phone;
	var email = request.body.email;

	newContact(fName, lName, phone, email, (function(error, result) {
		if (error || result == null ) {
			response.status(500).json({success: false, data: error}); //make Error page
		} else {
			response.render(path.join('pages', 'thanks'));
		}
	}));
}

function newContact(fName, lName, phone, email, callback){
	var client = new pg.Client(connectionString);

	client.connect(function(err) {
		if (err) {
			console.log("Error connecting to DB: ")
			console.log(err);
			callback(err, null);
		}
		var sql = "INSERT INTO contact (first_name, last_name, phone, email) Values ($1, $2, $3, $4)";
		var params = [fName, lName, phone, email];

		var query = client.query(sql, params, function(err, result) {
			client.end(function(err) {
				if (err) throw err;
			});

			if (err) {
				console.log("Error in query: ")
				console.log(err);
				callback(err, null);
			}
			console.log(result.rows);
			callback(null, result.rows);
		});
	});
}

function addApartment (request, response) {

	var rented = request.body.rented;
	var location = request.body.location;
	var price = request.body.price;
	var bed = request.body.bed;
	var bath = request.body.bath;
	var sqft = request.body.sqft;

	newApart(rented, location, price, bed, bath, sqft, (function(error, result) {
		if (error || result == null ) {
			response.status(500).json({success: false, data: error});
		} else {
			response.status(200).json(result);
		}
	}));
}

function newApart(rented, location, price, bed, bath, sqft, callback){
	var client = new pg.Client(connectionString);

	client.connect(function(err) {
		if (err) {
			console.log("Error connecting to DB: ")
			console.log(err);
			callback(err, null);
		}
		var sql = "INSERT INTO apartment (rented, location, price, bed, bath, sqft) Values ($1, $2, $3, $4, $5, $6)";
		var params = [rented, location, price, bed, bath, sqft];

		var query = client.query(sql, params, function(err, result) {
			client.end(function(err) {
				if (err) throw err;
			});

			if (err) {
				console.log("Error in query: ")
				console.log(err);
				callback(err, null);
			}
			console.log(result.rows);
			callback(null, result.rows);
		});
	});
}
function available (request, response) {
	availableApartments(function(error, result) {
		if (error || result == null ) {
			response.status(500).json({success: false, data: error});
		} else {
			response.status(200).json(result);
		}
	});
}

function availableApartments(callback){
	var client = new pg.Client(connectionString);

	client.connect(function(err) {
		if (err) {
			console.log("Error connecting to DB: ")
			console.log(err);
			callback(err, null);
		}

		var sql = "SELECT * FROM apartment WHERE rented = false";

		var query = client.query(sql, function(err, result) {
			client.end(function(err) {
				if (err) throw err;
			});

			if (err) {
				console.log("Error in query: ")
				console.log(err);
				callback(err, null);
			}
			console.log(result.rows);
			callback(null, result.rows);
		});
	});
}
function apartmentNumber (request, response) {
	var id = request.query.id;
	apartmentSpecific(id, function(error, result) {
		if (error || result == null ) {
			response.status(500).json({success: false, data: error});
		} else {
			response.status(200).json(result);
		}
	});
}
function apartmentSpecific(id, callback){
	var client = new pg.Client(connectionString);
	client.connect(function(err) {
		if (err) {
			console.log("Error connecting to DB: ")
			console.log(err);
			callback(err, null);
		}

		var sql = "SELECT * FROM apartment WHERE apartment_id = $1::int";
		console.log(id);
		var params = [id];

		var query = client.query(sql, params, function(err, result) {
			client.end(function(err) {
				if (err) throw err;
			});

			if (err) {
				console.log("Error in query: ")
				console.log(err);
				callback(err, null);
			}
			console.log(result.rows);
			callback(null, result.rows);
		});
	});
}
function editApartment (request, response) {
	var id = request.body.id;
	var rented = request.body.rented;
	var location = request.body.location;
	var price = request.body.price;
	var bed = request.body.bed;
	var bath = request.body.bath;
	var sqft = request.body.sqft;

	updateApart(id, rented, location, price, bed, bath, sqft, (function(error, result) {
		if (error || result == null ) {
			response.status(500).json({success: false, data: error});
		} else {
			response.status(200).json(result);
		}
	}));
}
function updateApart(id, rented, location, price, bed, bath, sqft, callback){
	var client = new pg.Client(connectionString);

	client.connect(function(err) {
		if (err) {
			console.log("Error connecting to DB: ")
			console.log(err);
			callback(err, null);
		}
		var sql = "UPDATE apartment SET rented = $2, location =$3, price=$4, bed=$5, bath=$6, sqft=$7 WHERE apartment_id = $1::int";
		var params = [id, rented, location, price, bed, bath, sqft];

		var query = client.query(sql, params, function(err, result) {
			client.end(function(err) {
				if (err) throw err;
			});

			if (err) {
				console.log("Error in query: ")
				console.log(err);
				callback(err, null);
			}
			console.log(result.rows);
			callback(null, result.rows);
		});
	});
}