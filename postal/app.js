var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var postage = require('./routes/calcPostage');
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/getPost', function(request, response) {
	getinfo(request, response);
});

app.use('/calcPostage', )
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


function getinfo (request, response) {
	var requestUrl = url.parse(request.url, true);

	var pkg;
	var pkgstr = requestUrl.query.pkgType;

	if (requestUrl.query.pkgType = "Letters (Stamped)") {
		pkg = 1;
	}
	else if (requestUrl.query.pkgType = "Letters (Metered)") {
		pkg = 2;
	}
	else if (requestUrl.query.pkgType = "Large Envelopes (Flats)") {
		pkg = 3;
	}
	else if (requestUrl.query.pkgType = "Parcels") {
		pkg = 4;
	}
	else {

	}

	var weight = Number (requestUrl.query.postWeight);

	calcPost(response, pkg, weight, pkgstr);
}

function calcPost (response, pkg, weight, pkgstr) {
	var total;

	if (pkg = 1){
		if (weight <= 1){
			total = ".50";
		}
		else if (weight <= 2){
			total = ".71";
		}
		else if (weight <= 3){
			total = ".92";
		}
		else if (weight <= 3.5){
			total = "1.13";
		}
	}
	else if (pkg = 2){
		if (weight <= 1){
			total = ".47";
		}
		else if (weight <= 2){
			total = ".68";
		}
		else if (weight <= 3){
			total = ".89";
		}
		else if (weight <= 3.5){
			total = "1.10";
		}	
	}
	else if (pkg = 3){
		if (weight <= 1){
			total = "1.00";
		}
		else if (weight <= 2){
			total = "1.21";
		}
		else if (weight <= 3){
			total = "1.42";
		}
		else if (weight <= 4){
			total = "1.63";
		}	
		else if (weight <= 5){
			total = "1.84";
		}	
		else if (weight <= 6){
			total = "2.05";
		}	
		else if (weight <= 7){
			total = "2.26";
		}
		else if (weight <= 8){
			total = "2.47";
		}	
		else if (weight <= 9){
			total = "2.68";
		}
		else if (weight <= 10){
			total = "2.89";
		}
		else if (weight <= 11){
			total = "3.10";
		}
		else if (weight <= 12){
			total = "3.31";
		}	
		else if (weight <= 13){
			total = "3.52";
		}							
	}

	else if (pkg = 4){
		if (weight <= 1){
			total = "3.50";
		}
		else if (weight <= 2){
			total = "3.50";
		}
		else if (weight <= 3){
			total = "3.50";
		}
		else if (weight <= 4){
			total = "3.50";
		}	
		else if (weight <= 5){
			total = "3.75";
		}	
		else if (weight <= 6){
			total = "3.75";
		}	
		else if (weight <= 7){
			total = "3.75";
		}
		else if (weight <= 8){
			total = "3.75";
		}	
		else if (weight <= 9){
			total = "4.10";
		}
		else if (weight <= 10){
			total = "4.45";
		}
		else if (weight <= 11){
			total = "4.80";
		}
		else if (weight <= 12){
			total = "5.15";
		}	
		else if (weight <= 13){
			total = "5.50";
		}							
	}

var per = {weight: weight, total: total, package: pkgstr};
response.render('pages/total', per);
}


module.exports = app;