/* This is the Controller for the Recipe related Requests like Add New Recipe, Edit Recipe, Add the recipe for the favorites.  */

const Recipe = require("../Schema/RecipeSchema");
const Liked = require("../Schema/LikedRecipeSchema");

/* This is the function which handles the creation of the new recipe*/

const createRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, imageUrl, user_id } = req.body;

    /* Create a new entry in the Recipe document with all the details of the new recipe. */

    const newRecipe = await Recipe.create({
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
  console.log("Recipe Id: ", recipeId);
  try {
    let recipe = await Recipe.findOne({ _id: recipeId });

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
  console.log("In here");

  const _id = req.params.id;
  console.log("Recipe Id: ", _id);
  updated_data = {
    title: title,
    ingredients: ingredients,
    instructions: instructions,
    imageUrl: imageUrl,
  };

  try {
    const result = await Recipe.findByIdAndUpdate(_id, updated_data, {
      new: true,
      runValidators: true,
    });
    console.log("Result: ", result);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    console.log("Result: ", result);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* This function is for deleting the recipe from the all recipes only if the author is the user. */

const deleteRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;

    const deletedRecipe = await Recipe.deleteOne({ _id: recipeId });

    if (!deletedRecipe.deletedCount) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    const recipes = await Recipe.find();

    res.status(200).json({ message: "Recipe deleted successfully", recipes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const LikedList = async (req, res) => {
  try {
    const { user_id, recipeId } = req.body;
    console.log("Recipe Id :", recipeId);
    // Find the recipe by ID in the database
    let recipe = await Recipe.findOne({
      _id: recipeId,
    });

    // Check if the recipe exists in the user's favorites
    const existingFavorite = await Liked.findOne({
      title: recipe.title,
      user_id: user_id,
    });

    if (existingFavorite) {
      // Recipe already exists in favorites
      return res
        .status(400)
        .json({ error: "Recipe already exists in your favorites" });
    } else {
      // Create a new favorite recipe entry
      const { title, instructions, imageUrl, ingredients } = recipe;
      const newFavorite = await Liked.create({
        title,
        instructions,
        imageUrl,
        ingredients,
        user_id,
      });

      // Respond with the newly added favorite recipe
      return res.status(201).json({ favoriteRecipe: newFavorite });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error in Liked:", error);
    return res.status(500).json({ error: "An internal server error occurred" });
  }
};

const getAllLikedRecipes = async (req, res) => {
  const user_id = req.params.id;
  try {
    const allLikedRecipes = await Liked.find({ user_id: user_id });
    res.status(200).json(allLikedRecipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const removeFromLikedRecipes = async (req, res) => {
  try {
    const recipeId = req.params.id;

    // Find and delete the liked recipe by ID
    const deletedLikedRecipe = await Liked.deleteOne({ _id: recipeId });

    if (!deletedLikedRecipe.deletedCount) {
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
};
