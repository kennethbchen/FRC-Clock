const apiKey = "vFH9oG43F0qZFQCGWOGIhXe53yDLf0qZVeg0EjfYrSzEiNbSZYBNXZzNLj8JKtiL"; //Very unsafe
const baseURL = "https://www.thebluealliance.com/api/v3";
const teamURL = "/team/frc";
const mediaURL = "/media/2018"
const cdBase = "https://www.chiefdelphi.com/media/img/";
const imgurBase = "https://i.imgur.com/"
const youtubeBase = "https://youtube.com/embed/"
const teamHTTP = new XMLHttpRequest();
const mediaHTTP = new XMLHttpRequest();

const timeHeader = document.getElementById("24HrTime");
const twelveTimeHeader = document.getElementById("12HrTime")
const teamDataHeader = document.getElementById("data");
const images = document.getElementById("images");

const imgStyle = ("border: 3px solid #C41720; border-radius: 5px; margin: 4px;"); //ED1B24

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

function removeTrailingZeros(value){
	if(value[0] === "0"){
		return removeTrailingZeros(value.substring(1));
	} else {
		return value;
	}
}

setInterval(function(){
	twelveTimeHeader.innerHTML = getTwelveTime();	
	if(getTime() != time){
		time = getTime();
		if(time.length == 4){
			team = getTime().substring(0,1) + getTime().substring(2);
		} else {
			team = getTime().substring(0,2) + getTime().substring(3,5);
		}

		team = removeTrailingZeros(team);

		var url = baseURL + teamURL + team + '?X-TBA-Auth-Key=' + apiKey;
		getTeam(url);

		url = baseURL + teamURL + 1433 + mediaURL + '?X-TBA-Auth-Key=' + apiKey;
		console.log(url);
		getMedia(url);
		
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
		
		setTimeWithTeam(getTime(), obj.nickname + city + state);
		
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
					img.setAttribute("height", 300);
					img.setAttribute("src", imgurBase + obj[i].foreign_key + ".png");
					img.setAttribute("style", imgStyle);
					images.appendChild(img);
				} else if(obj[i].type === "cdphotothread") {
					var img = document.createElement("img");
					img.setAttribute("id", "chief" + i);
					img.setAttribute("height", 300);
					img.setAttribute("src", cdBase + obj[i].details.image_partial);
					img.setAttribute("style", imgStyle);
					images.appendChild(img);
				} else if(obj[i].type === "youtube"){
					console.log(youtubeBase + obj[i].foreign_key);
					var vid = document.createElement("iframe");
					vid.setAttribute("id", "you"+1);
					vid.setAttribute("height", 300);
					vid.setAttribute("src", youtubeBase + obj[i].foreign_key);
					vid.setAttribute("style", imgStyle);
					images.appendChild(vid);
				}


			}
		} else {
			images.innerHTML = "No Imgur or Chief Delphi Images Found";
			var img = document.createElement("img");
					img.setAttribute("id", "pikachu");
					img.setAttribute("height", 75);
					img.setAttribute("src", "resources/noTeam.png");
					img.setAttribute("style", imgStyle);
					images.appendChild(img);
		}
	}
}
console.log(document.body.style.backgroundColor);

var backgroundToggle = false;
document.body.addEventListener("click", function(){
		if(backgroundToggle === true){
			document.body.style.backgroundColor = "#C41720";
			backgroundToggle = false;
		} else {
			document.body.style.backgroundColor = "#0065B3";
			backgroundToggle = true;
		}
	});





