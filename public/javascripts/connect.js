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


					// var text = document.createTextNode(location + " " + rented + " " + price + " " + bed + " " + bath + " " + sqft + " ");
					var link = document.createElement('a');
					var linkto = "/editApt?id="+ id;
					var edittxt = "Edit";
					var p = document.createElement('p');
					var p1 = document.createElement('p');
					var p2 = document.createElement('p');
					var p3 = document.createElement('p');
					var p4 = document.createElement('p');
					var p5 = document.createElement('p');

					var text = document.createTextNode(location);
					var text1 = document.createTextNode(rented);
					var text2 = document.createTextNode(price);
					var text3 = document.createTextNode(bed);
					var text4 = document.createTextNode(bath);
					var text5 = document.createTextNode(sqft);

					p.classList.add('column1');
					p1.classList.add('column2');
					p2.classList.add('column3');
					p3.classList.add('column4');
					p4.classList.add('column5');
					p5.classList.add('column6');
					link.classList.add('column7');


					p.append(text);
					p1.append(text1);
					p2.append(text2);
					p3.append(text3);
					p4.append(text4);
					p5.append(text5);

					link.setAttribute("href", linkto);
					link.append(edittxt);

					// element.append(text);
					// element.append(link);
					// parent.append(element);
					parent.append(p, p1, p2, p3, p4, p5, link);
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
					var h4 = document.createElement('h4');
					var div = document.createElement('div');
					var info = document.createElement('div');
					var p = document.createElement('p');
					var txtlocation = document.createTextNode(location);
					var linkto = "/apartment"+ id;
					

					link.setAttribute("href", linkto);
					link.classList.add("nodecor");
					div.id="apartment" + id;
					div.classList.add("apartmentimg");
					info.classList.add("info");
					element.classList.add("containapart");


					
					h4.append(txtlocation);
					element.append(div);
					var text = document.createTextNode(price);
					p.append(text);
					info.append(h4, p)
					element.append(info);
					link.append(element)
					parent.append(link);
					

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
					var fName = jobj[i].first_name;
					var lName = jobj[i].last_name;
					var ph = jobj[i].phone;
					var em = jobj[i].email;

					var element = document.createElement('div');
					var first = document.createElement('div');
					var last = document.createElement('div');
					var phone = document.createElement('div');
					var email = document.createElement('div');


					first.classList.add('column1');
					last.classList.add('column2');
					phone.classList.add('column3');
					email.classList.add('column4');
					parent.classList.add('apartments');

					var textfirst = document.createTextNode(fName);
					var textlast = document.createTextNode(lName);
					var textphone = document.createTextNode(ph);
					var textemail = document.createTextNode(em);

					first.append(textfirst);
					last.append(textlast);
					phone.append(textphone);
					email.append(textemail);

					parent.append(first, last, phone, email);
					// parent.append(element);
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
				var detail = document.getElementById('detail');
				
				for(var i=0; i < jobj.length; i++){
					var element = document.createElement('div');
					var location = jobj[i].location;
					var rented = jobj[i].rented;
					var price= jobj[i].price;
					var bed = jobj[i].bed;
					var bath = jobj[i].bath;
					var sqft = jobj[i].sqft;
					var address = document.createElement('h2');
					var textAddr = document.createTextNode(location);
					var div = document.createElement('div');
					var p = document.createElement('p');
					var p1 = document.createElement('p');
					var p2 = document.createElement('p');
					var p3 = document.createElement('p');
					var text1 = document.createTextNode("Price: " + price);
					var text2 = document.createTextNode("Bed: " + bed); 
					var text3 = document.createTextNode("Bath: "+ bath);
					var text4 = document.createTextNode("Square feet: " + sqft);

					p.append(text1);
					p1.append(text2);
					p2.append(text3);
					p3.append(text4);
					address.classList.add('indent');
					address.classList.add('pad-h2');
					address.append(textAddr);
					element.append(address);
					parent.append(element);
					detail.append(p, p1, p2, p3);
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
function login() {
	var username = $("#username").val();
	var password = $("#password").val();
	console.log(username + " " + password);
	var params = {
		username: username,
		password: password
	};

	$.post("/login", params, function(result) {
		if (result && result.success) {
			$("#status").text("Successfully logged in.");
			window.location = '/contacts'; // load logged in page
		} else {
			$("#status").text("Error logging in.");
		}
	});
}

function logout() {
	$.post("/logout", function(result) {
		if (result && result.success) {
			$("#status").text("Successfully logged out.");
			window.location = '/';
		} else {
			$("#status").text("Error logging out.");
		}
	});
}
