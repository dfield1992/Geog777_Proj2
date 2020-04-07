//Coordinates for Madeline Island, Wisconsin. 
var map = L.map('map', {zoomControl: false, center: [46.811336, -90.702438],zoom: 12.4});

//Call Drop Down Function 
let input;

populateDropDown()

// Configure to work on mobile
$( document ).ready(function() {
var isMobile = window.matchMedia("only screen and (max-width: 760px)");

    if (isMobile.matches) {
        var map = L.map('map').setView([46.811336, -90.702438], 12.4)
    }
});

//Mapbox Streets Basemap 
var streets = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
attribution: 'Map data &copy; <a href="https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?", <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 20,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZGZpZWxkMjMiLCJhIjoiY2pwZndmdDRxMGZqeDN3cGdya3VheDl2MSJ9.NBLdicPRyuC3tZx4E6WIPg'
    }).addTo(map);
 
//Mapbox Outdoors Basemap 
var outdoors = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
maxZoom: 20,
id: 'mapbox.outdoors',
accessToken: 'pk.eyJ1IjoiZGZpZWxkMjMiLCJhIjoiY2pwZndmdDRxMGZqeDN3cGdya3VheDl2MSJ9.NBLdicPRyuC3tZx4E6WIPg'
});


//Create Side Bar
var sidebar = L.control.sidebar('sidebar').addTo(map);

//Create Scale Bar
L.control.scale().addTo(map);

//Create Home Button
var zoomHome = L.Control.zoomHome({
    position: 'topleft'
});
zoomHome.addTo(map);


// Initialize Carto
var client = new carto.Client({
  apiKey: '97aa258f7b0b47a25b4f218d6f19e5b02bcdc7c6',
  username: 'defield'
});


//CARTO Datasets

// Map Extent Layers
var zoomSource = new carto.source.SQL("SELECT * FROM map_extent");
var zoomStyle = new carto.style.CartoCSS(`
#layer {
  polygon-fill: #ffffff;
  polygon-opacity: 0;
}
#layer::outline {
  line-width: 1;
  line-color: #ffffff;
  line-opacity: 0;
}   
`);
var zoomLayer = new carto.layer.Layer(zoomSource, zoomStyle); 

// Madeline Island Layer POLYGON
var MadelineSource = new carto.source.SQL("SELECT * FROM madeline_island");
var MadelineStyle = new carto.style.CartoCSS(`
#layer {
  polygon-fill: #ffffff;
  polygon-opacity: 0;
}
#layer::outline {
  line-width: 3;
  line-color: #333332;
  line-opacity: 1;
}

`);
var MadelineLayer = new carto.layer.Layer(MadelineSource, MadelineStyle);

// Park Boundary Layer POLYGON 
var boundarySource = new carto.source.SQL("SELECT * FROM park_boundary");
var boundaryStyle = new carto.style.CartoCSS(`
#layer {
  polygon-fill: #ffffff;
  polygon-opacity: 0;
}
#layer::outline {
  line-width: 2;
  line-color: #496347;
  line-opacity: 1;
}
#layer::labels {
  text-name: [prop_name];
  text-face-name: 'Old Standard TT Bold';
  text-size: 8;
  text-fill: #000000;
  text-label-position-tolerance: 0;
  text-halo-radius: 1;
  text-halo-fill: #ffffff;
  text-dy: 2;
  text-allow-overlap: true;
  text-placement: point;
  text-placement-type: dummy;
}
`);
var boundaryLayer = new carto.layer.Layer(boundarySource, boundaryStyle);

// Park Entrance Layer POINT
var EntranceSource = new carto.source.SQL("SELECT * FROM park_entrance_1");
var EntranceStyle = new carto.style.CartoCSS(`
#layer {
  marker-width: 16;
  marker-fill: #28CD47;
  marker-fill-opacity: 0.9;
  marker-file: url('https://s3.amazonaws.com/com.cartodb.users-assets.production/production/defield/assets/20200328170448entrance.png');
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
`);
var EntranceLayer = new carto.layer.Layer(EntranceSource, EntranceStyle, {featureOverColumns:['park_name','park_tel']});

// Parking Spots Layer  
var parkingSource = new carto.source.SQL("SELECT * FROM parking");
var parkingStyle = new carto.style.CartoCSS(`
#layer {
  marker-width: 16;
  marker-fill: #1c1c1c;
  marker-fill-opacity: 0.9;
  marker-file: url('https://s3.amazonaws.com/com.cartodb.users-assets.production/maki-icons/parking-18.svg');
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
#layer 
[zoom > 10] {
marker-width: 16;
}

#layer 
[zoom > 13] {
marker-width: 20;
}

#layer 
[zoom > 15] {
marker-width: 30;
}

`);

var parkingLayer = new carto.layer.Layer(parkingSource, parkingStyle);

// Picnic Layer POINT
var picnicSource = new carto.source.SQL("SELECT * FROM picnic_area_1");
var picnicStyle = new carto.style.CartoCSS(`
#layer {
  marker-width: 16;
  marker-fill: #6f4d26;
  marker-fill-opacity: 0.9;
  marker-file: url('https://s3.amazonaws.com/com.cartodb.users-assets.production/production/defield/assets/20200328170330picnic.png');
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
#layer 
[zoom > 10] {
marker-width: 16;
}

#layer 
[zoom > 13] {
marker-width: 20;
}

#layer 
[zoom > 15] {
marker-width: 30;
}
`);
var picnicLayer = new carto.layer.Layer(picnicSource, picnicStyle,{featureOverColumns:['pic_name']});

// Beach Layer POINT 
var beachSource = new carto.source.SQL("SELECT * FROM beach_1");
var beachStyle = new carto.style.CartoCSS(`
#layer {
  marker-width: 16;
  marker-fill: #0054fb;
  marker-fill-opacity: 0.9;
  marker-file: url('https://s3.amazonaws.com/com.cartodb.users-assets.production/production/defield/assets/20200328170704beach.png');
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
#layer 
[zoom > 10] {
marker-width: 16;
}

#layer 
[zoom > 13] {
marker-width: 20;
}

#layer 
[zoom > 15] {
marker-width: 30;
}
`);
var beachLayer = new carto.layer.Layer(beachSource, beachStyle,{featureOverColumns:['bea_name']});

// Trails Layer 
var trailSource = new carto.source.SQL("SELECT * FROM trails_1");
var trailStyle = new carto.style.CartoCSS(`
#layer {
  line-cap: butt;
  line-dasharray: 1, 3, 2;
  line-width: 3;
  line-color: #575454;
  line-opacity: 1;
}
#layer 
[zoom > 13] {
line-width: 5;
}
#layer 
[zoom > 15] {
line-width: 7;
}

`);
var trailLayer = new carto.layer.Layer(trailSource, trailStyle,{featureOverColumns:['trl_name','trl_dis']});

// Campingsites Layer 
var campSource = new carto.source.SQL("SELECT * FROM campground");
var campStyle = new carto.style.CartoCSS(`
#layer {
  marker-width: 16;
  marker-fill: #CF6F15;
  marker-fill-opacity: 0.9;
  marker-file: url('https://s3.amazonaws.com/com.cartodb.users-assets.production/maki-icons/campsite-18.svg');
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
#layer 
[zoom > 10] {
marker-width: 16;
}

#layer 
[zoom > 13] {
marker-width: 20;
}

#layer 
[zoom > 15] {
marker-width: 30;
}
`);
var campLayer = new carto.layer.Layer(campSource, campStyle,{featureOverColumns:['camp_name','lots']});

// Restrooms Layer
var restroomSource = new carto.source.SQL("SELECT * FROM restrooms");
var restroomStyle = new carto.style.CartoCSS(`
#layer {
  marker-width: 16;
  marker-fill: #2496d8;
  marker-fill-opacity: 0.9;
  marker-file: url('https://s3.amazonaws.com/com.cartodb.users-assets.production/maki-icons/toilets-18.svg');
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
#layer 
[zoom > 10] {
marker-width: 16;
}

#layer 
[zoom > 13] {
marker-width: 20;
}

#layer 
[zoom > 15] {
marker-width: 30;
}
`);
var restroomLayer = new carto.layer.Layer(restroomSource, restroomStyle);

// Kayak Rental Layer 
var kayakSource = new carto.source.SQL("SELECT * FROM kayak_rental_1");
var kayakStyle = new carto.style.CartoCSS(`
#layer {
  marker-width: 16;
  marker-fill: #374957;
  marker-fill-opacity: 0.9;
  marker-file: url('https://s3.amazonaws.com/com.cartodb.users-assets.production/production/defield/assets/20200322181255kayak%20%281%29.svg');
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
#layer 
[zoom > 10] {
marker-width: 16;
}

#layer 
[zoom > 13] {
marker-width: 20;
}

#layer 
[zoom > 15] {
marker-width: 30;
}
`);
var kayakLayer = new carto.layer.Layer(kayakSource, kayakStyle,{featureOverColumns:['boat_name','total','boat_tel']});

// Ferry Layer POINT
var ferrySource = new carto.source.SQL("SELECT * FROM ferry_1");
var ferryStyle = new carto.style.CartoCSS(`
#layer {
  marker-width: 16;
  marker-fill: #002bff;
  marker-fill-opacity: 0.9;
  marker-file: url('https://s3.amazonaws.com/com.cartodb.users-assets.production/production/defield/assets/20200328170553ferry.png');
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
#layer 
[zoom > 10] {
marker-width: 16;
}

#layer 
[zoom > 13] {
marker-width: 20;
}

#layer 
[zoom > 15] {
marker-width: 30;
}
`);
var ferryLayer = new carto.layer.Layer(ferrySource, ferryStyle, {featureOverColumns:['ferry_name','ferry_tel','ferry_time']});

// Ferry Route Layer LINE 
var ferryrouteSource = new carto.source.SQL("SELECT * FROM ferry_route");
var ferryrouteStyle = new carto.style.CartoCSS(`
#layer {
  line-cap: butt;
  line-dasharray: 1, 5, 2;
  line-width: 2;
  line-color: #2391ff;
  line-opacity: 1;
}
`);
var ferryrouteLayer = new carto.layer.Layer(ferryrouteSource, ferryrouteStyle); 

// Airport Layer POINT
var airportSource = new carto.source.SQL("SELECT * FROM airport_1");
var airportStyle = new carto.style.CartoCSS(`
#layer {
  marker-width: 16;
  marker-fill: #f80000;
  marker-fill-opacity: 0.9;
  marker-file: url('https://s3.amazonaws.com/com.cartodb.users-assets.production/maki-icons/airport-18.svg');
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
`);
var airportLayer = new carto.layer.Layer(airportSource, airportStyle, {featureOverColumns: ['air_name','air_tel']});
                       

// Park Review Layer POINT
var reviewSource = new carto.source.SQL("SELECT * FROM park_review");
var reviewStyle = new carto.style.CartoCSS(`
#layer {
  marker-width: 16;
  marker-fill: #EE4D5A;
  marker-fill-opacity: 0.9;
  marker-file: url('https://s3.amazonaws.com/com.cartodb.users-assets.production/production/defield/assets/20200401132328park.png');
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
#layer 
[zoom > 10] {
marker-width: 16;
}

#layer 
[zoom > 13] {
marker-width: 20;
}

#layer 
[zoom > 15] {
marker-width: 30;
}
`);
var reviewLayer = new carto.layer.Layer(reviewSource, reviewStyle, {featureOverColumns:['firstname','lastname','review_comment','review_date']});

// Add the data to the map as a layer
client.addLayers([zoomLayer,campLayer,MadelineLayer,boundaryLayer, parkingLayer,EntranceLayer,beachLayer,trailLayer,picnicLayer,restroomLayer,kayakLayer,ferryLayer,ferryrouteLayer,airportLayer,reviewLayer]);
client.getLeafletLayer().addTo(map);

function toggleLayer(toggleLayer,id) {
    if ($('#'+id).is(':checked')) {
        toggleLayer.show();
    } else {
        toggleLayer.hide();
    }
}

function toggleBase() {
    if (document.getElementById("outdoors").checked) {
        map.removeLayer(streets);
        outdoors.addTo(map).bringToBack();
    } else if (document.getElementById("streets").checked) {
        map.removeLayer(outdoors);
        streets.addTo(map).bringToBack();
    } else {alert("Basemap not found.")}
}

//Configure Popup
const popup = L.popup();
function openPopUp(featureEvent) {
  popup.setLatLng(featureEvent.latLng);
  if (!popup.isOpen()) {
    let content ='<div class="widget">';
    if (featureEvent.data.air_name) {
      content +=  ' <b> Airport </b><br> Name: ' + featureEvent.data.air_name + '<br>' + 'Telephone: ' + featureEvent.data.air_tel;
    }
      
    if (featureEvent.data.ferry_name) {
      content +=  ' <b> Ferry </b><br> Name: ' + featureEvent.data.ferry_name + '<br>' + 'Telephone: ' + featureEvent.data.ferry_tel + '<br>' + 'Time: ' + featureEvent.data.ferry_time;
    }
      
    if (featureEvent.data.bea_name) {
      content +=  ' <b> Beach </b><br> Name: ' + featureEvent.data.bea_name;
    }
   
    if (featureEvent.data.camp_name) {
      content +=  ' <b> Campground </b><br> Name: ' + featureEvent.data.camp_name + '<br>' + 'Number of Lots: ' + featureEvent.data.lots;
    }
      
    if (featureEvent.data.boat_name) {
      content +=  ' <b> Kayak Rentals </b><br> Name: ' + featureEvent.data.boat_name + '<br>' + 'Number of Rentals: ' + featureEvent.data.total + '<br>' + 'Telephone: ' + featureEvent.data.boat_tel;
    }
    
    if (featureEvent.data.review_comment) {
      content +=  ' <b> Park Review </b><br> Name: ' + featureEvent.data.firstname + " " + featureEvent.data.lastname + '<br>' + 'Review: ' + featureEvent.data.review_comment + '<br>' + 'Submitted: ' + featureEvent.data.review_date;
    }
    
    if (featureEvent.data.park_name) {
      content +=  ' <b> Park Entrance </b><br> Name: ' + featureEvent.data.park_name + '<br>' + 'Telephone: ' + featureEvent.data.park_tel;
    }
    
    if (featureEvent.data.pic_name) {
      content +=  ' <b> Picnic </b><br> Name: ' + featureEvent.data.pic_name;
    }
      
    if (featureEvent.data.trl_name) {
      content +=  ' <b> Trails </b><br> Name: ' + featureEvent.data.trl_name + '<br>' + 'Distance: ' + featureEvent.data.trl_dis;
    }
      
    content += '</p></div>'

    popup.setContent(content);
    popup.openOn(map);
  }
};

//Enable Popup
MadelineLayer.on('featureClicked', openPopUp);
boundaryLayer.on('featureClicked', openPopUp);
EntranceLayer.on('featureClicked', openPopUp);
parkingLayer.on('featureClicked', openPopUp);
picnicLayer.on('featureClicked', openPopUp);
beachLayer.on('featureClicked', openPopUp);
trailLayer.on('featureClicked', openPopUp);
campLayer.on('featureClicked', openPopUp);
restroomLayer.on('featureClicked', openPopUp);
kayakLayer.on('featureClicked', openPopUp);
ferryLayer.on('featureClicked', openPopUp);
ferryrouteLayer.on('featureClicked', openPopUp);
airportLayer.on('featureClicked', openPopUp);
reviewLayer.on('featureClicked', openPopUp);


// Create Drop Down to view map extents
function populateDropDown(){
    return fetch(
    `https://defield.carto.com/api/v2/sql?format=GeoJSON&q= SELECT the_geom, prop_name FROM map_extent`
    ).then((resp) => resp.json())
    .then((response) => {
        return response['features'].map(function(feature){
            option = document.createElement("option")
            option.setAttribute("value", feature.properties.prop_name)
            option.textContent = feature.properties.prop_name
            document.getElementById("selectDrop").appendChild(option);
        });
    }).catch((error) => {
        console.log(error)
    })
}


document.getElementById('selectDrop').addEventListener("change", function (e) {
    input = e.currentTarget.selectedOptions[0].attributes[0].value;
    return  fetch(`https://defield.carto.com/api/v2/sql?format=GeoJSON&q= SELECT * FROM map_extent where prop_name Ilike '${input}'`)
    .then((resp) => resp.json())
    .then((response) => {
        geojsonLayer = L.geoJson(response)
        map.fitBounds(geojsonLayer.getBounds());
    })
});


//Marker for location
var marker = L.marker({
  title: "Currnet Location",
  draggable: true
});

// Function to allow the user to click on the map to get coordinates
function findLocation() {
  map.on('click', function(e) {
    popup.removeFrom(map);

        marker.setLatLng(e.latlng).addTo(map);

        alert("Location Found");
    document.getElementById('lat').value = e.latlng.lat;
    document.getElementById('lng').value = e.latlng.lng;
    finish();
  })
}

// Function to find current location. 
function currentLocation() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude,
        lng = position.coords.longitude;
        marker.setLatLng([lat,lng]).addTo(map);
        document.getElementById('lat').value = lat;
        document.getElementById('lng').value = lng;

      })
    } else {
            // if browser doesn't support Geolocation
            alert("Geolocation is disabled. Please select location on the map instead.");
          }
}



function setData() {
  var firstName = fname.value;
  var lastName = lname.value;    
  var reviewDate = date.value;
  var reviewComment = comment.value;
  var gpslat = lat.value;
  var gpslng = lng.value;

  if (!firstName, !lastName, !reviewDate,!reviewComment, !gpslat, !gpslng) {
    alert("Please enter values for all fields")
  } else {  var sql = "INSERT INTO park_review (the_geom, firstname, lastname, review_date, review_comment, latitude, longitude) VALUES (ST_SetSRID(ST_GeomFromGeoJSON('";
      var sql2 = '{"type":"Point","coordinates":[' + gpslng + "," + gpslat + "]}'),4326),'" + firstName + "','" + lastName + "','" + reviewDate + "','" + reviewComment + "','"+ gpslat + "','" + gpslng +"')";
      var pURL = sql+sql2;
      submitToProxy(pURL);
      console.log("Feature has been submitted to the Proxy");
      alert("Your record has been submitted for review. Thank you!");
    }
}

var submitToProxy = function(q){
      $.post("php/callProxy.php", {
        qurl:q,
        cache: false,
        timeStamp: new Date().getTime()
      }, function(data) {
        console.log(data);
      });
    };


function openReview() {
    $("#review-panel").collapse('show');
    
}

    $("#review-btn").click(function () {
        openReview();
        return false;
    });

function radiusLocation() {
  alert('Choose your location on the map')
  map.on('click', function(e) {
    marker.setLatLng(e.latlng).addTo(map);

    var lat = e.latlng.lat;
    var lng = e.latlng.lng;

    document.getElementById('findlat').value = lat;
    document.getElementById('findlng').value = lng;

  })
}

function radiusLocation() {
  alert('Please choose your location on the map')
  map.on('click', function(e) {
    marker.setLatLng(e.latlng).addTo(map);

    var lat = e.latlng.lat;
    var lng = e.latlng.lng;

    document.getElementById('rlat').value = lat;
    document.getElementById('rlng').value = lng;

  })
}

//Find Features Near Me
function getUserRadiusLocation() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude,
        lng = position.coords.longitude;
        marker.setLatLng([lat,lng]).addTo(map);

        document.getElementById('rlat').value = lat;
        document.getElementById('rlng').value = lng;

        alert("Location found!");
      })
    } else {
            // if browser doesn't support Geolocation
            alert("Geolocation is disabled. Please select location on the map instead.");
          }
}

// Radius Circle
var fcircle;
function radiusSearch() {
  var circle;
  if (!document.getElementById('rlat').value, !document.getElementById('rlng').value) {
    alert('Please select your location first');
  } else if (!document.getElementById('radius_input').value) {
    alert('Please enter a radius distance');
    console.log(document.getElementById('radius_input').value);
  } else {
    if (fcircle) {
      map.clearLayers(fcircle);
    }
    var rinput = document.getElementById('radius_input').value;
    var rlat = document.getElementById('rlat').value;
    var rlng = document.getElementById('rlng').value;

    var final = rinput * 1609.34;
    var circle = L.circle([rlat,rlng], {
      color: 'gray',
      opacity: 10,
      radius: final
    }).addTo(map);
    map.fitBounds(circle.getBounds(), {paddingTopLeft:[200,0]});

  }
}

