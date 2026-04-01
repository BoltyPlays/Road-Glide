var map = L.map('map').setView([45.4215, -75.6972], 13)
L.titleLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Parliment Hill marker test
L.marker([45.4235, -75.7009]).addTo(map)
    .bindPopup('RoadGlide Tracking: Parliment')
    .openPopup();