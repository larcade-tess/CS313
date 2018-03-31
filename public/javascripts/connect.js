function allAp(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				var jobj = JSON.parse(this.responseText);
				console.log(this.responseText);
				var parent = document.getElementById('displayA');
				
				
				for(var i=0; i < jobj.length; i++){
					var element = document.createElement('div');
					var id = jobj[i].apartment_id;
					var location = jobj[i].location;
					var rented = jobj[i].rented;
					var price= jobj[i].price;
					var bed = jobj[i].bed;
					var bath = jobj[i].bath;
					var sqft = jobj[i].sqft;
					var text = document.createTextNode(location + " " + rented + " " + price + " " + bed + " " + bath + " " + sqft + " ");
					var link = document.createElement('a');
					var linkto = "/editApt?id="+ id;
					var edittxt = "Edit";
					link.setAttribute("href", linkto);
					link.append(edittxt);
					element.append(text);
					element.append(link);
					parent.append(element);
				}
			}
			else {
				console.log('not cool');
			}
		}
	}
	var requestURL = "all";
	xhttp.open("GET", requestURL, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send();
}

function apartment(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				var jobj = JSON.parse(this.responseText);
				console.log(this.responseText);
				var parent = document.getElementById('container');
				
				
				for(var i=0; i < jobj.length; i++){
					var element = document.createElement('div');
					var id = jobj[i].apartment_id;
					var location = jobj[i].location;
					var rented = jobj[i].rented;
					var price= jobj[i].price;
					var bed = jobj[i].bed;
					var bath = jobj[i].bath;
					var sqft = jobj[i].sqft;
					var link = document.createElement('a');
					var txtlocation = document.createTextNode(location);
					var linkto = "/apartment"+ id;
					link.setAttribute("href", linkto);
					link.append(txtlocation);
					element.append(link);
					var text = document.createTextNode(price + " " + bed + " " + bath + " " + sqft);
					element.append(text);
					parent.append(element);
				}
			}
			else {
				console.log('not cool');
			}
		}
	}
	var requestURL = "available";
	xhttp.open("GET", requestURL, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send();
}

function allContacts(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				var jobj = JSON.parse(this.responseText);
				console.log(this.responseText);
				var parent = document.getElementById('displayContacts');
				
				
				for(var i=0; i < jobj.length; i++){
					var element = document.createElement('div');
					var fName = jobj[i].first_name;
					var lName = jobj[i].last_name;
					var phone = jobj[i].phone;
					var email = jobj[i].email;

					var text = document.createTextNode(fName + " " + lName + " " + phone + " " + email);
					element.append(text);
					parent.append(element);
				}
			}
			else {
				console.log('not cool');
			}
		}
	}
	var requestURL = "getContact";
	xhttp.open("GET", requestURL, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send();
}

function apartmentsAvailable(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				var jobj = JSON.parse(this.responseText);
				console.log(this.responseText);
				var parent = document.getElementById('apartmentSelect');
				
				
				for(var i=0; i < jobj.length; i++){
					var element = document.createElement('option');
					var location = jobj[i].location;
					var id = jobj[i].apartment_id;
					element.setAttribute("value", id);
					var text = document.createTextNode(location);
					element.append(text);
					parent.append(element);
				}
			}
			else {
				console.log('not cool');
			}
		}
	}
	var requestURL = "showingList";
	xhttp.open("GET", requestURL, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send();
}

function apartmentNumber(id){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				var jobj = JSON.parse(this.responseText);
				console.log(this.responseText);
				var parent = document.getElementById('apartmentInfo');
				
				
				for(var i=0; i < jobj.length; i++){
					var element = document.createElement('div');
					var location = jobj[i].location;
					var rented = jobj[i].rented;
					var price= jobj[i].price;
					var bed = jobj[i].bed;
					var bath = jobj[i].bath;
					var sqft = jobj[i].sqft;
					var text = document.createTextNode("Location: "+ location + " Price: " + price + " Bed: " + bed + " Bath: " 
						+ bath + " Square feet: " + sqft);
					element.append(text);
					parent.append(element);
				}
			}
			else {
				console.log('not cool');
			}
		}
	}
	var requestURL = "apartmentNumber?id=" + id;
	xhttp.open("GET", requestURL, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send();
}
function getid(){
	var windowurl = window.location.href;
	console.log(window.location.search.substring(1));
	var id;
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0; i< vars.length; i++) {
		var pair = vars[i].split("=");
		if(pair[0] == 'id'){
			id = pair[1];
			editApart(id);
		}
	}
	return(false);
	console.log(id);
}
function editApart(id){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				var jobj = JSON.parse(this.responseText);
				console.log(this.responseText);
				var parent = document.getElementById('apartmentSelect');

				for(var i=0; i < jobj.length; i++){
					document.getElementById('addr').value = jobj[i].location;
					document.getElementById('price').value = jobj[i].price;
					document.getElementById('bed').value = jobj[i].bed;
					document.getElementById('bath').value = jobj[i].bath;
					document.getElementById('sqft').value = jobj[i].sqft;
					document.getElementById('rented').value = jobj[i].rented;
				}
			}
			else {
				console.log('not cool');
			}
		}
	}
	var requestURL = "apartmentNumber?id=" + id;
	xhttp.open("GET", requestURL, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send();
}

