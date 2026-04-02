console.log("Map script is starting...");

const map = L.map('map').setView([45.4215, -75.6972], 13);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri'
}).addTo(map);

L.marker([45.4235, -75.7009]).addTo(map)
    .bindPopup('Parliment Hill')
    .openPopup();

setTimeout(() => {
   map.invalidateSize();
   console.log("Map resize triggered");
}, 200);