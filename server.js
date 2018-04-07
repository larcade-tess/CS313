var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer(); // for parsing multipart/form-data
var session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcrypt');


var pg = require("pg"); // This is the postgres database connection module.

const connectionString = process.env.DATABASE_URL || "postgres://readonly:readonly@localhost:5433/japdb";
console.log('Connecting to DB : ', connectionString);
var v = path.join(__dirname, 'public', 'views');

app.use(session({
	secret: 'Ill never tell',
	resave: false,
	saveUninitialized: true
}));


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(passport.initialize());
app.use(passport.session());

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', v);
app.set('view engine', 'ejs');


app.use(logRequest);

// Setup our routes
app.post('/login', handleLogin);
app.post('/logout', handleLogout);



app.get('/userinfo', function(request, response) {
	response.render(path.join('pages', 'userinfo'));
});
app.get('/addUser', verifyLogin, function(request, response, next) {
		if (response.locals.isAuthed) {
		response.render(path.join('pages', 'addUser'));
	} 
	else {
		response.render(path.join('pages', 'all'));
	}
});
app.post('/getNewUser', function (request, response) {
	getNewUser(request, response);
});




app.get('/getContact', function(request, response) {
	getContact(request, response);
});
app.get('/insertContact', function(request, response) {
	insertContact(request, response);
});
app.get('/contacts', verifyLogin, function(request, response, next) {
	if (response.locals.isAuthed) {
		response.render(path.join('pages', 'contacts'));
	} 
	else {
		response.render(path.join('pages', 'all'));
	}
});
app.post('/newContact', function (request, response) {
	addContact(request, response);
});
app.post('/settings', verifyLogin, function(request, response, next){
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
app.get('/addApartment', verifyLogin, function(request, response, next){
	if (response.locals.isAuthed) {
		response.render(path.join('pages', 'addApartment'));
	} 
	else {
		response.render(path.join('pages', 'all'));
	}
});
app.post('/newApartment', function (request, response) {
	addApartment(request, response);
});
app.get('/all', function(request, response) {
	all(request, response);
});
app.get('/allApartments', verifyLogin, function(request, response, next) {
	if (response.locals.isAuthed) {
		response.render(path.join('pages', 'allApartments'));
	} 
	else {
		response.render(path.join('pages', 'all'));
	}
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

function getNewUser(request, response) {
	var user = request.body.username;
	var pass = request.body.password;
	var pass1 = request.body.password1;
	console.log("Password is: " + pass);

	console.log("Password1 is: " + pass1);

	if (pass == pass1){

		newUser(user, pass, function(error, result) {
			if (error || result == null ) {
				response.status(500).json({success: false, data: error});
			} else {
				response.status(200).json(result);
			}
		});
	}
	else
	{
		result = {success: false, message: error};
	}
}
function newUser (user, pass, callback){
	var client = new pg.Client(connectionString);
	console.log("newUser Password is: " + pass);
	client.connect(function(err) {
		if (err) {
			console.log("Error connecting to DB: ");
			console.log(err);
			callback(err, null);
		}
		// console.log("Pass is: " + pass);

		// var salt = bcrypt.genSaltSync(10);
		// console.log("Salt is: " + salt);
		// var hash = bcrypt.hashSync(pass, salt);

		// console.log("Hash is: "+hash);

		bcrypt.hash(pass, 10, function(err, hash) {

			var sql = "INSERT INTO login (username, hash) VALUES ($1, $2)";
			var params = [user, hash];

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
	});
}

function handleLogin(request, response) {
	var user = request.body.username;
	var pass = request.body.password;

	verifyUser(user, pass, request, response, function(error, result, response) {
		if (error || result == null ) {
			response.status(500).json({success: false, data: error});
		} else {
			response.status(200).json(result);
		}
	});
}

function verifyUser (user, pass, request, response, callback){
	var client = new pg.Client(connectionString);

	client.connect(function(err) {
		if (err) {
			console.log("Error connecting to DB: ")
			console.log(err);
			callback(err, null);
		}

		var sql = "SELECT username, hash FROM login WHERE username = $1::varchar";
		var params = [user];

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

			console.log("Found result: " + JSON.stringify(result));
			console.log("username is: " + result.rows[0].username);
			console.log("password is: " + pass);
			console.log("hash is: " + result.rows[0].hash);
			
			var hash = result.rows[0].hash;

			bcrypt.compare(pass, hash, function(err, res) {
				console.log("Hash is: " + hash);
				console.log("pass is: " + pass);
				var stat = {success:false};

				if(res) {
					request.session.user = user;
					console.log("session user is: " + request.session.user + " " + res);
					stat = {success: true};
					console.log("Stat is: "+ stat.success );
				} else {
					console.log("No session user: " + user);
					console.log(err);
				}
				callback(err, stat, response);
			});
		});
	});
}


function handleLogout(request, response) {
	var result = {success: false};

	// We should do better error checking here to make sure the parameters are present
	if (request.session.user) {
		request.session.destroy();
		result = {success: true};
	}

	response.json(result);
}

function verifyLogin(request, response, next) {
	if (request.session.user) {

		// pass things along to the next function
		response.locals.isAuthed = true;
		// next();
	} else {

		response.locals.isAuthed = false;
	}

	next();
}


function logRequest(request, response, next) {
	console.log("Received a request for: " + request.url);

	// don't forget to call next() to allow the next parts of the pipeline to function
	next();
}

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