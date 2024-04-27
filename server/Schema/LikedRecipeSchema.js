const mongoose = require("mongoose");

const LikedRecipes = new mongoose.Schema({
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

const Liked = mongoose.model("LikedRecipe", LikedRecipes);

module.exports = Liked;
