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
					var location = jobj[i].location;
					var rented = jobj[i].rented;
					var price= jobj[i].price;
					var bed = jobj[i].bed;
					var bath = jobj[i].bath;
					var sqft = jobj[i].sqft;
					var text = document.createTextNode(location + " " + rented + " " + price + " " + bed + " " + bath + " " + sqft);
					element.append(text);
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