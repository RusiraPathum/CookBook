require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");

let app = express();
let PORT = process.env.PORT || 3000; 


app.listen(PORT, () => {
    console.log(`Node API app is running on port ${PORT}`);
  });