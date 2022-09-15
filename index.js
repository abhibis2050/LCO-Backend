//cd LCO\LCO_PROJECT

const app = require("./app")
const { connectWithDb } = require("./config/db")
require('dotenv').config()
const cloudinary = require("cloudinary")


//connection with Database
connectWithDb()

// CLOUDINARY CONFIG DONE HEREm 
//cloudinary configuration can be done anywhere even in controller
// but its better to be done after connecting with the db

cloudinary.config({
    cloud_name:process.env.CLOUDNARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})


app.listen(process.env.PORT||4000, () => {
    console.log(`Server is running at port : ${process.env.PORT}`) 
})