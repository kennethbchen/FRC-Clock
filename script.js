const apiKey = "vFH9oG43F0qZFQCGWOGIhXe53yDLf0qZVeg0EjfYrSzEiNbSZYBNXZzNLj8JKtiL"; //Very unsafe
const baseURL = "https://www.thebluealliance.com/api/v3";
const cdBase = "https://www.chiefdelphi.com/media/img/";
const teamURL = "/team/frc";
const mediaURL = "/media/2018";
const imgurBase = "https://i.imgur.com/";
const youtubeBase = "https://youtube.com/embed/";
const avatarBase = "data:image/png;base64,";
const teamHTTP = new XMLHttpRequest();
const mediaHTTP = new XMLHttpRequest();

const timeHeader = document.getElementById("24HrTime");
const twelveTimeHeader = document.getElementById("12HrTime")
const teamDataHeader = document.getElementById("data");
const images = document.getElementById("images");

const FRCBlue = "#0065B3";
const FRCRed = "#C41720";

var backgroundToggle = false;


timeHeader.innerHTML = getTime();
var time = getTime() + " ";
var team;

function getTeam(url){
	teamHTTP.open("GET", url);
	teamHTTP.send();
}

function getMedia(url){
	mediaHTTP.open("GET", url);
	mediaHTTP.send();
}


function getTime() {
	var d = new Date();
	var hours = d.getHours();
	var minutes = d.getMinutes();
	if(minutes < 10){
		minutes = "0" + minutes;
	}
	var parse = hours + ":" + minutes;

	if(parse.lastIndexOf(":") === 4){
		return (parse.substring(0,4));
	} else {
		return (parse.substring(0,5));
	}
	
  }

function getTwelveTime(){
	var d = new Date();

	return d.toLocaleTimeString();
}

function setTimeWithTeam(teamData,localeData){
	timeHeader.innerHTML = teamData;
	teamDataHeader.innerHTML = localeData;
}

function setTime(){
	timeHeader.innerHTML = getTime();
	teamDataHeader.innerHTML = "No team found :(";
}

function parseTime(){
	var time = getTime();
	if(time.length == 4){
		team = getTime().substring(0,1) + getTime().substring(2);
	} else {
		team = getTime().substring(0,2) + getTime().substring(3,5);
	}
	return removeTrailingZeros(team);
}

function removeTrailingZeros(value){
	if(value[0] === "0"){
		return removeTrailingZeros(value.substring(1));
	} else {
		return value;
	}
}

function invertColors(){
	var images = document.querySelectorAll(".imgStyle");
	var imagesInv = document.querySelectorAll(".imgStyleInvert");

		images.forEach(element => {
			element.setAttribute("class", "imgStyleInvert");
		});

		imagesInv.forEach(element => {
			element.setAttribute("class", "imgStyle");
	});


	var video = document.querySelectorAll(".videoStyle");
	var videoInv = document.querySelectorAll(".videoStyleInvert");
	video.forEach(element => {
		element.setAttribute("class", "videoStyleInvert");
	});

	videoInv.forEach(element => {
		element.setAttribute("class", "videoStyle");
	});

	var pikachu = document.querySelectorAll(".pikachu");
	var pikachuInv = document.querySelectorAll(".pikachuInvert");


	pikachu.forEach(element => {
		element.setAttribute("class", "pikachuInvert");
	});
	pikachuInv.forEach(element => {
		element.setAttribute("class", "pikachu");
	});
}


setInterval(function(){
	twelveTimeHeader.innerHTML = getTwelveTime();	
	if(getTime() != time){
		time = getTime();
		
		team = parseTime();
		
		var url = baseURL + teamURL + team + '?X-TBA-Auth-Key=' + apiKey;
		getTeam(url);

		url = baseURL + teamURL + team + mediaURL + '?X-TBA-Auth-Key=' + apiKey;
		getMedia(url);

		console.log(url);

	}
}, 1000);

teamHTTP.onreadystatechange = function(){
	if(this.readyState == 4 && this.status==200){
		var response = teamHTTP.responseText.toString();
		var obj = JSON.parse(response);
		
		var city = " from " + obj.city + ", ";
		var state = obj.state_prov;
		if(city.includes(null)){
			city = "";
			state = " from " + obj.state_prov;
		}

		if(state.includes(null)){
			state = "";
		}
		
		setTimeWithTeam( getTime(), obj.nickname + city + state);
		
	} else {
		setTime();
	}
}

mediaHTTP.onreadystatechange = function(){
	if(this.readyState == 4 && this.status==200){
		var response = mediaHTTP.responseText.toString();
		var obj = JSON.parse(response);
		images.innerHTML = "";
		if(obj.length > 0){
	
			for(var i = 0; i < obj.length; i++){
				if(obj[i].type === "avatar"){

					var img = document.createElement("img");
					img.setAttribute("src", avatarBase + obj[i].details.base64Image); 
					img.setAttribute("class", "avatarStyle");

					var temp = teamDataHeader.innerHTML;
					teamDataHeader.innerHTML = "";
					teamDataHeader.appendChild(img);
					teamDataHeader.innerHTML += temp;
					teamDataHeader.appendChild(img);

				} else if(obj[i].type === "imgur"){

					var img = document.createElement("img");
					img.setAttribute("src", imgurBase + obj[i].foreign_key + ".png");
					img.setAttribute("class", "imgStyle");
					img.setAttribute("alt", "imgur image");
					images.appendChild(img);

				} else if(obj[i].type === "cdphotothread") {

					var img = document.createElement("img");
					img.setAttribute("src", cdBase + obj[i].details.image_partial);
					img.setAttribute("class", "imgStyle");
					img.setAttribute("alt", "Chief Delphi image");

					images.appendChild(img);

				} else if(obj[i].type === "youtube"){

					var vid = document.createElement("iframe");
					vid.setAttribute("src", youtubeBase + obj[i].foreign_key);
					vid.setAttribute("class", "videoStyle");
					images.appendChild(vid);

				}


			}

		} else {
				images.innerHTML = "";
				images.innerHTML = "No media found <br>";
				var img = document.createElement("img");
				img.setAttribute("class", "pikachu");
				img.setAttribute("src", "resources/noteam.png");
				images.appendChild(img);
		}
	}
}

document.body.addEventListener("click", function(){
		if(backgroundToggle === false){
			document.body.style.backgroundColor = FRCRed;
			invertColors();
			backgroundToggle = true;
		} else {
			document.body.style.backgroundColor = FRCBlue;
			invertColors();
			backgroundToggle = false;
		}
	});





