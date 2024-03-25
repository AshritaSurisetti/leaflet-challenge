//Fetching the data
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Creating the map object
let myMap = L.map("map", {
    center: [61.06,-107.99], 
    zoom: 3
});

// Adding the tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(myMap);

// Setting the marker color based on depth 
let markerColor = (depth) => {
    if (depth > 90) {
      return "#333366";
    } else if (depth > 70 && depth <= 90) {
      return "#663366";
    } else if (depth > 50 && depth <= 70) {
      return "#CC6666";
    } else if (depth > 30 && depth <= 50) {
      return "#996666";
    } else if (depth > 10 && depth <= 30) {
      return "#CC9966";
    } else if (depth >-10 && depth <= 10) {
      return "#FFCC66";
    } else {
      return "#CC0099";
    }
};
  
// Creating a circle marker 
let mapMarker = (feature) => {
    return {
    fillOpacity: 0.70,
    fillColor: markerColor(feature.geometry.coordinates[2]),
    color: "black",
    radius: feature.properties.mag *6,
    weight: 0.5,
    stroke: true,
    };
};
  
// connecting to the geoJson API using d3
d3.json(link).then(function(data) {
 
  // Adding the earthquake data to the map.
  L.geoJson(data, {
    pointToLayer: (feature, latlng) => {
      return L.circleMarker(latlng, {
        style: mapMarker(feature),
      });
    },
    style: mapMarker,
    onEachFeature: (feature, layer) => {
      
      // Adding popup to the markers
      layer.bindPopup(`Location: <h3>${feature.properties.place} </h3><hr> \
           Magnitude: <b>${feature.properties.mag} </b><br> \
           Depth: <b>${feature.geometry.coordinates[2]} </b>`);

      layer.closePopup();
    },
  }).addTo(myMap);
});

// Creating legend for the earthquake markers..
function createLegend() {
    let legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
        let div = L.DomUtil.create('div', 'info legend');
        let depthColors = ["#FFCC66", "#CC9966", "#996666","#CC6666", "#663366", "#333366"];  
        let categories = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+']; 
        
        // Looping through the categories and add them to the legend with colors
        for (let i = 0; i < categories.length; i++) {
            div.innerHTML += `
                <div style="background-color: ${depthColors[i]}; width: 20px; height: 20px; float: left; margin-right: 5px;"></div>
                <div style="float: left; margin-right: 5px;">${categories[i]}</div>
                <br>
            `;
        }
        
        // Styling the legend container
        div.style.backgroundColor = 'white';
        div.style.padding = '10px';
        div.style.fontFamily = 'Arial, sans-serif';
        div.style.fontSize = '14px';
        
        return div;
    };
    legend.addTo(myMap);
}

// Calling the function to create the legend
createLegend();





