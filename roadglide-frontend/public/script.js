console.log("Map script is starting...");

const bounds = L.latLngBounds(
    L.latLng(45.12, -76.35),
    L.latLng(45.75, -75.05)
);

const map = L.map('map', {
    center: [45.4215, -75.6972],
    zoom: 13,
    minZoom: 10,
    maxBounds: bounds,
    maxBoundsViscosity: 1.0
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

const routingControl = L.Routing.control({
    waypoints: [],
    lineOptions: {
        styles: [{ color: 'blue', weight: 6.7 }]
    },
    addWaypoints: false,
    draggableWaypoints: false,
    show: false
}).addTo(map);

const geocoder = L.Control.geocoder({ 
    defaultMarkGeocode: false,
    geocoder: L.Control.Geocoder.nominatim({
        geocodingQueryParams: {
            viewbox: '-76.35,45.75,-75.05,45.12',
            bounded: 1
        }
    })
})
.on('markgeocode', function(e) {
    const destination = e.geocode.center;
    const startPoint = L.latLng(45.4215, -75.6972);

    map.fitBounds(L.latLngBounds([startPoint, destination]));
    routingControl.setWaypoints([startPoint, destination]);
    
    L.marker(destination).addTo(map)
        .bindPopup(`
            <b>${e.geocode.name}</b><br> <span style="color: green">$4.00</span><br> <span style="color: red">Next Bus: 4m delay</span> `)
        .openPopup();
})
.addTo(map);

setTimeout(() => {
    map.invalidateSize();
    console.log("Map resize triggered");
}, 367);