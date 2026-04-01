const map = L.map('map').setView([45.4215, -75.6972], 13)
L.titelayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

const testMarker = L.marker ([45.4235, -75.7009]).addTo(map);
testMarker.bindPopup("test")