const mongoose = require("mongoose");

const DB = process.env.DATABASE;

mongoose.connect("mongodb+srv://admin:admin@cluster0.njfwhse.mongodb.net/",{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>console.log("database connected")).catch((err)=>console.log("errr",err))