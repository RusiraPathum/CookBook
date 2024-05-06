const express = require("express");
const mongoose = require("mongoose");

let app = express();
let port = process.env.PORT || 3000; 

app.listen(port, () => {
    console.log("server started");
  });