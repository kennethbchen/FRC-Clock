const apiKey = "vFH9oG43F0qZFQCGWOGIhXe53yDLf0qZVeg0EjfYrSzEiNbSZYBNXZzNLj8JKtiL"; //Very unsafe
const baseURL = "https://www.thebluealliance.com/api/v3";
const teamURL = "/team/frc";
const cdBase = "https://www.chiefdelphi.com/media/img/";
const imgurBase = "https://i.imgur.com/"
const teamHTTP = new XMLHttpRequest();
const mediaHTTP = new XMLHttpRequest();
const content = document.getElementById("display");
const images = document.getElementById("images");

content.innerHTML = getTime();
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


function getTime()  {
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

function setTimeWithTeam(teamData){
	content.innerHTML = "The time is " + teamData;
}

function setTime(){
	content.innerHTML = "The time is just " + getTime() + ". No team found :(";
}

setInterval(function(){
	if(getTime() != time){
		time = getTime();
		if(time.length == 4){
			team = getTime().substring(0,1) + getTime().substring(2);
		} else {
			team = getTime().substring(0,2) + getTime().substring(3,56);
		}
		var url = baseURL + teamURL + team + '?X-TBA-Auth-Key=' + apiKey;
		//console.log( "Team URL" + url);
		getTeam(url);
		url = baseURL + "/team/frc" + team + "/media/2018" + '?X-TBA-Auth-Key=' + apiKey;
		console.log(url);
		getMedia(url);
		
	}
}, 500);

teamHTTP.onreadystatechange = function(){
	if(this.readyState == 4 && this.status==200){
		var response = teamHTTP.responseText.toString();
		var obj = JSON.parse(response);
			setTimeWithTeam(getTime() + " - " + obj.nickname + " from " + obj.city + ", " + obj.state_prov);
		
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
				if(obj[i].type === "imgur"){
					var img = document.createElement("img");
					img.setAttribute("id", "imgur" + i);
					img.setAttribute("height", 400);
					img.setAttribute("src", imgurBase + obj[i].foreign_key + ".png");
					images.appendChild(img);
				} else if(obj[i].type === "cdphotothread") {
					var img = document.createElement("img");
					img.setAttribute("id", "chief" + i);
					img.setAttribute("height", 400);
					img.setAttribute("src", cdBase + obj[i].details.image_partial);
					images.appendChild(img);
					console.log(cdBase + obj[i].details.image_partail);
				}


			}



		} else {
			images.innerHTML = "No Imgur or CD Images Found :(";
		}
	}
}





