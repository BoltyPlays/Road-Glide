console.log("Map script is starting...");

const map = L.map('map').setView([45.4215, -75.6972], 13);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(map);

L.marker([45.4235, -75.7009]).addTo(map)
    .bindPopup('Parliment Hill')
    .openPopup();

setTimeout(() => {
   map.invalidateSize();
   console.log("Map resize triggered");
}, 200);