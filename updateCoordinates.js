const mongoose = require("mongoose");
const Listing = require("./models/listing"); // Adjust path if needed
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/wanderLust")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Function to update listings with missing coordinates
const updateCoordinates = async () => {
    const listings = await Listing.find({ "geometry.coordinates": [0, 0] });

    for (let listing of listings) {
        // Fetch real coordinates using a geocoding API (like Mapbox)
        listing.geometry = {
            type: "Point",
            coordinates: [longitude, latitude] // Always store as [lng, lat]
        };
        
        await listing.save();
        console.log(`Updated: ${listing.title}`);
    }

    console.log("All listings updated!");
    mongoose.connection.close();
};

// Run the function
updateCoordinates();