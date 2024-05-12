require('dotenv').config();
const express = require("express");
const app = express()
const mongoose = require("mongoose");

//Recipe route
const recipeRoute = require('./routes/recipeRoute');

app.use(express.static(__dirname + '/'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/recipe',recipeRoute);

let MONGO_URL = process.env.MONGO_URL; 
let PORT = process.env.PORT || 3000; 

mongoose.set("strictQuery", false)
mongoose.
connect(MONGO_URL)
.then(() => {
    console.log('connected to MongoDB')
    app.listen(PORT, ()=> {
        console.log(`Node API app is running on port 3000`)
    });
}).catch((error) => {
    console.log(error)
})

// app.listen(PORT, () => {
//     console.log(`Node API app is running on port ${PORT}`);
//   });