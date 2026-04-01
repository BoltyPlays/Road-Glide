console.log("Map script is starting...")
const map = L.map('map').setView([45.4215, -75.6972], 13)
L.tilelayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
L.marker([45.4235, -75.7009]).addTo(map)

setTimeout(() => {
    map.invalidateSize();
    console.log()
}, 200);