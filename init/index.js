const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";

main().then(()=>{
    console.log("Connected to db");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj) => ({
    ...obj , 
    owner : '678fba22069033c040b6a50f',
    }));
    console.log(initdata.data);
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
}

initDB();