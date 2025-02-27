let mapToken = "<%= process.env.MAP_TOKEN %>";
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: "mapbox://styles/mapbox/streets-v12", //style URL
  center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});

console.log(coordinates);

const marker = new mapboxgl.Marker({color:"black"})
  .setLngLat(coordinates) //Listing.geometry,coordinates
  .addTo(map);