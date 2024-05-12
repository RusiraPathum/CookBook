require('dotenv').config();
const express = require("express");
// const mongoose = require("mongoose");

//Recipe route
let recipeRoute = require('./routes/recipeRoute');

app.use(express.static(__dirname + '/'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/recipe',recipeRoute);

let app = express();
let PORT = process.env.PORT || 3000; 


app.listen(PORT, () => {
    console.log(`Node API app is running on port ${PORT}`);
  });