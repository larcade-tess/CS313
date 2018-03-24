function findmovie (){
	var name = document.getElementById('movietitle').value; 
	console.log(name);
	movieAPI(name);
}
function movieAPI(name) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				var jobj = JSON.parse(this.responseText);
				console.log(this.responseText);
				addMovie(jobj);
			}
			else {
				console.log('not cool');
			}
		}
	}
	var requestURL = "http://www.omdbapi.com/?t="+ name + "&apikey=57339cb5";
	xhttp.open("GET", requestURL, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send();

}
function addMovie(jobj){
	var parent = document.getElementById('movieinfo');
	var element = document.createElement('div');
	var text = document.createTextNode("Title: " + jobj.Title + ", Year: " + jobj.Year + ", Rated: " + jobj.Rated );
	var button = document.createElement('button');
	var buttontext = document.createTextNode('Log ID');
	button.id = "logid";
	element.appendChild(text);
	button.appendChild(buttontext);
	parent.insertBefore(element, null);
	parent.insertBefore(button, null);
	button.setAttribute("onClick", "logID()");
}
function logID(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				var jobj = JSON.parse(this.responseText);
				var imdb = jobj.imdbID;
				console.log(imdb);
			}
			else {
				console.log('not cool');
			}
		}
	}
	var name = document.getElementById('movietitle').value
	var requestURL = "http://www.omdbapi.com/?t="+ name + "&apikey=57339cb5";
	xhttp.open("GET", requestURL, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send();
}
