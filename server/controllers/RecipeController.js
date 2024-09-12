/* This is the Controller for the Recipe related Requests like Add New Recipe, Edit Recipe, Add the recipe for the favorites.  */

const Recipe = require("../Schema/RecipeSchema");
const Liked = require("../Schema/LikedRecipeSchema");
const User = require("../Schema/UserSchema");
const mongoose = require("mongoose");

const { v4: uuidv4 } = require("uuid");

/* This is the function which handles the creation of the new recipe*/

const createRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, imageUrl, user_id } = req.body;
    const recipeId = uuidv4();

    /* Create a new entry in the Recipe document with all the details of the new recipe. */

    const newRecipe = await Recipe.create({
      recipeId,
      title,
      ingredients,
      instructions,
      imageUrl,
      user_id,
    });

    res.status(201).json(newRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* This is the function for getting a particular recipe from the database based on the recipe ID. */

const getRecipe = async (req, res) => {
  const recipeId = req.params.id;
  try {
    let recipe = await Recipe.findOne({ recipeId: recipeId });

    res.status(200).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server error" });
  }
};

/* This is the function for getting the all the recipes present in the database. */

const getAllRecipes = async (req, res) => {
  try {
    const allRecipes = await Recipe.find();

    res.status(200).json(allRecipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* This is the function for updating the recipe with the new information updated by the user. */

const updateRecipe = async (req, res) => {
  const { title, ingredients, instructions, imageUrl, user_id } = req.body;

  const recipeId = req.params.id;
  console.log("Recipe Id: ", recipeId);
  updated_data = {
    title: title,
    ingredients: ingredients,
    instructions: instructions,
    imageUrl: imageUrl,
  };

  try {
    const result = await Recipe.findOneAndUpdate({recipeId : recipeId}, updated_data, {
      new: true,
      runValidators: true,
    });
    console.log("Result: ", result);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* This function is for deleting the recipe from the all recipes only if the author is the user. */

const deleteRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;


    // Step 1: Delete the recipe from the Recipe collection
    const deletedRecipe = await Recipe.deleteOne({ 'recipeId': recipeId });

    // If the recipe is not found, return a 404 error
    if (!deletedRecipe.deletedCount) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Step 2: Remove the recipe from all users' favorites
    await User.updateMany(
      { favorites: recipeId }, // Find all users who have this recipe in their favorites
      { $pull: { favorites: recipeId } } // Remove the recipe from their favorites array
    );

    // Step 3: Return the updated list of recipes after deletion
    const recipes = await Recipe.find();

    res.status(200).json({ message: "Recipe deleted successfully", recipes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const LikedList = async (req, res) => {
  try {
    const { user_id, recipeId } = req.body; // Get user ID and recipe ID from the request body
    console.log(req.body);
    console.log("Recipe Id:", recipeId);

    // Check if the recipe exists in the database
    const recipe = await Recipe.findOne({recipeId : recipeId});
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Add the recipeId to the user's favorites list, using $addToSet to prevent duplicates
    const updatedUser = await User.findOneAndUpdate(
      { userId : user_id }, // Find user by ID
      { $addToSet: { favorites: recipeId } }, // Add recipeId to the favorites array
      { new: true } // Return the updated user document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the updated user document with the new favorites list
    res.status(200).json({ message: "Recipe added to favorites", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllLikedRecipes = async (req, res) => {
  try {
    const user_id = req.params.id; // Get the user ID from the request parameters

    // Step 1: Find the user by their ID and retrieve the `favorites` array
    const user = await User.findOne({userId : user_id});

    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Step 2: Use the favorites array to find all recipes from the Recipe schema
    const likedRecipes = await Recipe.find({ recipeId: { $in: user.favorites } });

    // Step 3: Return the list of liked recipes
    res.status(200).json({ likedRecipes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const removeFromLikedRecipes = async (req, res) => {
  try {
    const recipeId = req.body.recipeId;
    const user_id = req.body.user_id;  
    
    console.log("Recipe Id : " , recipeId);
    console.log("User Id : " , user_id);

    const deletedLikedRecipe = await User.updateMany(
      { userId: user_id }, // Find all users who have this recipe in their favorites
      { $pull: { favorites: recipeId } } // Remove the recipe from their favorites array
    );

    console.log(deletedLikedRecipe);

    if (!deletedLikedRecipe) {
      return res.status(404).json({ error: "Liked recipe not found" });
    }

    res.status(200).json({ message: "Recipe removed from liked recipes" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const searchRecipes = async (req, res) => {
  const searchKey = req.params.key;

  try {
    // Use a case-insensitive regular expression to search for recipes by title
    const recipes = await Recipe.find({
      title: { $regex: new RegExp(searchKey, "i") },
    });

    // If no matching recipes found, return a meaningful message
    if (recipes.length === 0) {
      return res.status(404).json({ message: "No recipes found" });
    }

    // If matching recipes found, return them in the response
    res.status(200).json(recipes);
  } catch (error) {
    // Handle any server error and return a proper error response
    console.error("Error searching recipes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const checkFavorite = async (req, res) => {
  const { user_id, recipeId } = req.body;
  console.log("Checking Favorite");
  try{
  const user = await User.findOne({ userId : user_id, favorites: { $in: [recipeId] } });

  console.log(user)
    // If user is found and recipeId is in favorites array
    if (user) {
      console.log("Returning Favorite as True");
      return res.status(200).json({ isFavorite: true });
    } else {
      return res.status(200).json({ isFavorite: false });
    }
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return { isFavorite: false, error: 'An error occurred while checking favorite status.' };
  }

}

module.exports = {
  getAllRecipes,
  getRecipe,
  updateRecipe,
  createRecipe,
  deleteRecipe,
  getAllLikedRecipes,
  LikedList,
  removeFromLikedRecipes,
  searchRecipes,
  checkFavorite,
};
