// Value Constants
const apiKey = "vFH9oG43F0qZFQCGWOGIhXe53yDLf0qZVeg0EjfYrSzEiNbSZYBNXZzNLj8JKtiL"; // Please dont steal
const baseURL = "https://www.thebluealliance.com/api/v3";
const cdBase = "https://www.chiefdelphi.com/media/img/";
const teamURL = "/team/frc";
const mediaURL = "/media/";
const imgurBase = "https://i.imgur.com/";
const youtubeBase = "https://youtube.com/embed/";
const avatarBase = "data:image/png;base64,";
const teamHTTP = new XMLHttpRequest();
const mediaHTTP = new XMLHttpRequest();

// HTML Element Constants
const timeHeader = document.getElementById("24HrTime");
const twelveTimeHeader = document.getElementById("12HrTime")
const teamDataHeader = document.getElementById("data");
const media = document.getElementById("images");

const FRCBlue = "#0065B3";
const FRCRed = "#C41720";

// Variables
var backgroundInvert = false;

var lastRecordedTime = getTime() + " ";
var team;

//
timeHeader.innerHTML = getTime();



function getTeam(url) {
	teamHTTP.open("GET", url);
	teamHTTP.send();
}

function getMedia(url) {
	mediaHTTP.open("GET", url);
	mediaHTTP.send();
}

// Gives a string that represents the current time in 24-hour HH:MM format
function getTime() {
	var d = new Date();

	// Get the date and record the hours and minutes
	var hours = d.getHours();
	var minutes = d.getMinutes();

	// If the minutes is less than 10, it will be a single digit value
	// Add in a leading zero
	// For example, 9 -> 09
	if(minutes < 10){
		minutes = "0" + minutes;
	}

	// Assemble the output in the form HH:MM
	var output = hours + ":" + minutes;

	// I don't actually know why this part exists
	if(output.lastIndexOf(":") === 4){
		return (output.substring(0,4));
	} else {
		return (output.substring(0,5));
	}
	
  }

// Gives a string that represents the time in 12-hour format
function getTwelveTime() {
	var d = new Date();

	return d.toLocaleTimeString();
}

// Gives a number that represents the current year
function getCurrentYear() {
	var d = new Date();
	var year = d.getFullYear();
	
	return year;
}

// Function that sets the appropriate HTML elements to represent the time if there
// Is no valid team with the current time
function setTime() {
	timeHeader.innerHTML = getTime();
	teamDataHeader.innerHTML = "No team found :(";
}

// Function that sets the appropriate HTML elements to represent the time if there
// is a valid team with the current time
function setTeamTime(teamData,localeData){
	timeHeader.innerHTML = teamData;
	teamDataHeader.innerHTML = localeData;
}


// Gives a number that represents an FRC team number that was created from the current 24-hour time
// In the format XXXX
function parseTime() {
	var time = getTime();
	
	if(time.length == 4){
		team = time.substring(0,1) + time.substring(2);
	} else {
		team = time.substring(0,2) + time.substring(3,5);
	}

	// In 24-hour time, the time can have a number of leading zeroes
	// For example, 0001, 0004, 0005
	// These can be valid teams, but we need to remove the leading zeroes for the API call
	return removeLeadingZeros(team);
}

// Recursive function that removes all of the leading zeroes of a number
function removeLeadingZeros(value) {
	if(value[0] === "0"){
		return removeLeadingZeros(value.substring(1));
	} else {
		return value;
	}
}

// Function that handles the process of inverting the colors of the webpage
function invertColors() {
	var elements;

	// If the background is in the default state, then all elements that are affected by the toggle
	// should have the class .colorNormal otherwise they have .colorInvert
	// get all of these elements
	
	if ( backgroundInvert == false) {
		elements = document.querySelectorAll(".colorNormal");
	} else {
		elements = document.querySelectorAll(".colorInvert");
	}

	// Toggle all of the element's classes so 
	// they swap between colorNormal and colorInvert
	elements.forEach(element => {
		element.classList.toggle("colorNormal");
		element.classList.toggle("colorInvert");
	});

}

// Returns a string
// colorNormal if backgroundInvert = false;
// colorInvert if backgroundInvert = true;
function getColorClassString() {
	if(backgroundInvert == false) {
		return "colorNormal";
	} else {
		return "colorInvert";
	}
}

// Function that is called at every second to track the time
setInterval(function(){
	
	// Update the 12-hour time display
	// It is not used in any calculations
	twelveTimeHeader.innerHTML = getTwelveTime();

	// If the current time has changed, then update
	if(getTime() != lastRecordedTime){
		lastRecordedTime = getTime();
		
		team = parseTime();
		
		// Assemble and send the url request for team information
		var url = baseURL + teamURL + team + '?X-TBA-Auth-Key=' + apiKey;
		getTeam(url);

		// Assemble and send the url request for media information
		url = baseURL + teamURL + team + mediaURL + getCurrentYear() + '?X-TBA-Auth-Key=' + apiKey;
		getMedia(url);

	}
}, 1000); // 1000ms = 1s

// Event handler for when the team API request is returned
teamHTTP.onreadystatechange = function() {

	// Ready state 4 means the request is DONE
	// Status 200 means the HTTP request was OK
	// If the request was successful, process the data
	if(this.readyState == 4 && this.status== 200){
		// Store the response which is in JSON format
		var response = teamHTTP.responseText.toString();

		// Convert the JSON reponse to a JS Object
		var requestData = JSON.parse(response);
		
		// The team data includes city and province.
		// Sometimes the city and state are null, so handle this situation

		var city = " from " + requestData.city + ", ";
		var state = requestData.state_prov;
		
		if(city.includes(null)){
			city = "";
			state = " from " + requestData.state_prov;
		}

		if(state.includes(null)){
			state = "";
		}
		
		// Update the display with the team information
		setTeamTime( getTime(), requestData.nickname + city + state);
		
	} else {

		// If the reponse was not successful or there was no team found
		setTime();
	}
}

// Event handler for when the media API request is returned
mediaHTTP.onreadystatechange = function() {

	// Ready state 4 means the request is DONE
	// Status 200 means the HTTP request was OK
	// If the request was successful, process the data
	if(this.readyState == 4 && this.status==200){
		// Store the response which is in JSON format
		var response = mediaHTTP.responseText.toString();

		// Convert the JSON reponse to a JS Object
		var obj = JSON.parse(response);

		// Clear the innerHTML of the media element
		media.innerHTML = "";

		// If there is recorded media
		if(obj.length > 0){
	
			// Go through all media
			for(var i = 0; i < obj.length; i++) {
				
				// The media can take different forms, handle each case
				
				if(obj[i].type === "avatar"){
					// Team Avatar Icon

					/* Disabled for now
					var img = document.createElement("img");
					
					img.setAttribute("src", avatarBase + obj[i].details.base64Image); 
					img.setAttribute("class", "avatarStyle");

					var temp = teamDataHeader.innerHTML;
					teamDataHeader.innerHTML = "";
					teamDataHeader.appendChild(img);
					teamDataHeader.innerHTML += temp;
					teamDataHeader.appendChild(img);
					*/
					

				} else if(obj[i].type === "imgur"){
					// Imgur Link

					var img = document.createElement("img");
					img.setAttribute("src", imgurBase + obj[i].foreign_key + ".png");
					img.setAttribute("class", "imgStyle " + getColorClassString());
					img.setAttribute("alt", "imgur image");
					media.appendChild(img);

				} else if(obj[i].type === "cdphotothread") {
					// Chief Delphi Photo Thread

					var img = document.createElement("img");
					img.setAttribute("src", cdBase + obj[i].details.image_partial);
					img.setAttribute("class", "imgStyle " + getColorClassString());
					img.setAttribute("alt", "Chief Delphi image");

					media.appendChild(img);

				} else if(obj[i].type === "youtube"){
					// YouTube Video
					
					var vid = document.createElement("iframe");
					vid.setAttribute("src", youtubeBase + obj[i].foreign_key);
					vid.setAttribute("class", "videoStyle " + getColorClassString());
					media.appendChild(vid);

				}


			}

			

		} else {
			// If there is no media found
				media.innerHTML = "";
				media.innerHTML = "No media found <br>";
				var img = document.createElement("img");
				img.setAttribute("class", "pikachu " + getColorClassString());
				img.setAttribute("src", "resources/noteam.png");
				media.appendChild(img);
		}
	}
}

// Click Listener to invert the colors
document.body.addEventListener("click", function(){
		if(backgroundInvert === true){
			document.body.style.backgroundColor = FRCBlue;
			invertColors();
			backgroundInvert = false;
		} else {
			document.body.style.backgroundColor = FRCRed;
			invertColors();
			backgroundInvert = true;
		}
	});





