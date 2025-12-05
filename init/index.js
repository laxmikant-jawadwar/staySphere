const mongoose = require("mongoose");
const Listing = require("../models/listings.js");
const initData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust" ;

async function main(){
   await mongoose.connect(MONGO_URL);
}

main()
    .then(()=>{
    console.log("Db is connected");
    })
    .catch((err)=>{
        console.log(err);
    });

const initDB = async ()=>{
    await Listing.deleteMany({});
    //this never update data.js but iupdate here local object 
    // and insert as desired in Listing. 
    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner : "692e8dc360fbddc1cc095ec6"
    }));
    await Listing.insertMany(initData.data);

    console.log("data was initialized ")
}    

initDB() ;