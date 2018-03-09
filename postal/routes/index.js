
var express = require('express');
var app = express();
var url = require('url');


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/getPost', function(request, response) {
	getinfo(request, response);
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
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

module.exports = router;
