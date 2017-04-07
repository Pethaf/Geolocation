window.onload = getMyLocation;
var targetLatitude = 32.627778
var targetLongitude = 129.738333
var map = null;
function getMyLocation()
{
	if (navigator.geolocation)
	{
		navigator.geolocation.getCurrentPosition(displayLocation,displayError);
	}
	else
	{
		alert("Geolocation not supported");
	}
}

function displayLocation(position)
{
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	var locationDiv = document.getElementById("location");
	locationDiv.innerHTML = "Current position: " + 
	"Latitude: " + latitude + ", Longitude: " + longitude;
	var distanceDiv = document.getElementById("distance");
	distanceDiv.innerHTML = "Distance to target: " + Math.round(calcDistance(latitude,longitude)) + " km";
	showMap(position.coords);
}
function calcDistance(latitude, longitude) 
{
	var startLatRads = latitude*Math.PI/180;
	var startLongRads = longitude*Math.PI/180;
	var destLatRads = targetLatitude*Math.PI/180;
	var destLongRads = targetLongitude*Math.PI/180;
	var radiusOfEarth = 6371; 
	var distance = Math.acos(Math.sin(startLatRads)*Math.sin(destLatRads) + 
	 			   Math.cos(startLatRads)*Math.cos(destLatRads) * 
	 			   Math.cos(startLongRads - destLongRads))*radiusOfEarth;
	return distance;
}

function showMap(coords)
{
	var googleCords = new google.maps.LatLng(coords.latitude, coords.longitude);
	var googleMapOptions = { zoom: 10, 
							 center: googleCords, 
							 mapTypeId: 'roadmap'};
	var mapDiv = document.getElementById("map");
	map = new google.maps.Map(mapDiv, googleMapOptions);
	addMarker(map, googleCords, "Starting", "Start of the yourney")
	addMarker(map, new google.maps.LatLng(targetLatitude, targetLongitude), "Goal", "The journey ends here");

}
function addMarker(map, latlong, title, content) {
	var markerOptions = {
		position: latlong,
		map: map,
		title: title,
		clickable: true
	};
	var marker = new google.maps.Marker(markerOptions);

	var infoWindowOptions = {
		content: content,
		position: latlong
	};

	var infoWindow = new google.maps.InfoWindow(infoWindowOptions);

	google.maps.event.addListener(marker, 'click', function() {
		infoWindow.open(map);
	});
}


function displayError(errorObject)
{
	var errorLookup = {
		0: "Unknow Error",
		1: "Permission denied by user",
		2: "Position is not available",
		3: "Request timed out"
	}; 
	var errorMsg = errorLookup[errorObject.code];
	if(errorMsg == 0 || errorMsg == 2) 
	{
		errorMsg = errorMsg + errorObject.message; 
	}

	var div = document.getElementById("location");
	div.innerHTML = errorMsg;
}