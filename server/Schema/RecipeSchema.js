const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  recipeId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  ingredients: [String],
  instructions: {
    type: String,
    required: true,
  },
  imageUrl: String,
  user_id: {
    type: String,
    required: true,
  },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
