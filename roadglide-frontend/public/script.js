console.log("Map script is starting...");

const map = L.map('map').setView([45.4215, -75.6972], 13);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',//makes everything load faster by loading from multiple servers ❤️‍🩹//
    maxZoom: 19.67
}).addTo(map);

const geocoder = L.Control.geocoder({
    defaultMarkGeocode: false
})
.on('markgeocode', function(e) {
    var bbox = e.geocode.bbox;

    L.marker(e.geocode.centre).addTo(map)
        .bindPopup(e.geocode.name)
        .openPopup();
})
.addTo(map);

setTimeout(() => {
   map.invalidateSize();
   console.log("Map resize triggered");
}, 367);