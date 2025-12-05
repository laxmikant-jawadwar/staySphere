//public folder dont have acess to .env file or its variables.
//mapToken came from show.ejs script file upper side wriiten
mapboxgl.accessToken = mapToken; 

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/standard', // Use the standard style for the map
    projection: 'globe', // display the map as a globe
    zoom: 9, // initial zoom level, 0 is the world view, higher values zoom in
    center: listing.geometry.coordinates // starting posn [lng,lt]
});


// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker({color:"red"})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(`<h4>${listing.title}</h4><p>Exact Location will be provided after booking </p>`))
    .addTo(map);

map.scrollZoom.disable(); 
const nav = new mapboxgl.NavigationControl({
    visualizePitch: true
});
map.addControl(nav, 'top-right'); 