const express = require("express");
const router = express.Router();
const verifyToken = require("../Middleware/middleware");

const {
  getAllRecipes,
  getRecipe,
  updateRecipe,
  createRecipe,
  deleteRecipe,
  LikedList,
  getAllLikedRecipes,
  removeFromLikedRecipes,
  searchRecipes,
} = require("../controllers/RecipeController");

router.post("/recipe", createRecipe);
router.put("/recipe/:id", updateRecipe);
router.get("/recipe", verifyToken, getAllRecipes);
router.get("/recipe/:id", getRecipe);
router.get("/likedRecipes/:id", getAllLikedRecipes);
router.delete("/recipe/:id", deleteRecipe);
router.post("/likedRecipes", LikedList);
router.delete("/removeLiked/:id", removeFromLikedRecipes);
router.get("/searchRecipes/:key", searchRecipes);

module.exports = router;
