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
  const { query, ingredient } = req.query;

  if (!query && !ingredient) {
      return res.status(400).json({ error: 'Missing query parameters' });
  }

  let results = recipes;

  // Search logic
  if (query) {
      results = results.filter(recipe =>
          recipe.name.toLowerCase().includes(query.toLowerCase()) ||
          recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(query.toLowerCase()))
      );
  }

  // Filter logic
  if (ingredient) {
      results = results.filter(recipe =>
          recipe.ingredients.includes(ingredient.toLowerCase())
      );
  }

  res.json(results);
});

app.listen(port, () => {
    console.log("server started");
  });