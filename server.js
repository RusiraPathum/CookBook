const express = require("express");
const mongoose = require("mongoose");

let app = express();
let port = process.env.PORT || 3000; 


const bodyParser = require('body-parser');


const recipes = [
    { id: 1, name: 'Spaghetti Carbonara', ingredients: ['spaghetti', 'eggs', 'bacon', 'parmesan cheese'] },
    { id: 2, name: 'Chicken Alfredo', ingredients: ['chicken', 'fettuccine', 'cream', 'parmesan cheese'] },
    { id: 3, name: 'Vegetable Stir Fry', ingredients: ['vegetables', 'soy sauce', 'rice', 'garlic', 'ginger'] }
];


app.use(bodyParser.json());

app.get('/recipes', (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Missing query parameter' });
    }

    
    const results = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(query.toLowerCase()) ||
        recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(query.toLowerCase()))
    );

    res.json(results);
});

app.listen(port, () => {
    console.log("server started");
  });