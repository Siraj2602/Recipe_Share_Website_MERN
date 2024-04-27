import React, { useEffect, useState } from "react";
import "../styles/RecipeStyle.css";
import { Link } from "react-router-dom";
import "../styles/Searchbar.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling

/* This Component is for listing all the recipes interface. */

const Recipes = () => {
  /* This is used for setting a use state for the recipes. */
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    getRecipes();
  }, []);

  /* This section is for getting all the avaiable recipes in the database.*/

  const getRecipes = () => {
    fetch("https://localhost:2000/auth/recipe", {
      method: "GET",
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch recipe data");
        }
        return response.json();
      })
      .then((data) => {
        setRecipes(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  /* This section is used for deleting the recipe created by the user. Cannot delete the recipe if the user is no tthe author. */

  const handleDeleteRecipe = async (recipeId) => {
    try {
      // Confirm the deletion with the user
      if (window.confirm("Are you sure you want to delete this recipe?")) {
        // Send a DELETE request to the server
        const response = await fetch(
          `https://localhost:2000/auth/recipe/${recipeId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          toast.success("Recipe deleted successfully");

          setTimeout(() => {
            window.location = "/recipes";
          }, 4000);
        } else {
          getRecipes();
          window.location = "/recipes";
        }
      }
    } catch (error) {
      toast.error("An error occurred while deleting the recipe:", error);

      setTimeout(() => {
        window.location.href = "/recipes";
      }, 3000);
    }
  };

  /* This section handles the logic to add an recipe to the favorite recipes of the user. */

  const handleAddToFavorites = async (recipeId) => {
    try {
      // Send a POST request to the LikedList controller
      const dataToSend = {
        user_id: localStorage.getItem("user_id"),
        recipeId: recipeId,
      };
      console.log("Data to send", dataToSend);
      const response = await fetch("https://localhost:2000/auth/likedRecipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        toast.success("Recipe added to favorites successfully");

        setTimeout(() => {
          window.location.href = "/favouriteRecipes";
        }, 4000);
      } else {
        const data = await response.json();
        if (data.error === "Recipe already exists in your favorites") {
          toast.warn("Recipe already exists in your favorites");
        } else {
          toast.error(data.error);
        }
      }
    } catch (error) {
      console.error("An error occurred while adding to favorites:", error);
    }
  };

  /* This section implements the dynamic search of the recipes which filters out the recipes based on the name */

  const SearchRecipes = async (e) => {
    try {
      if (e.target.value) {
        let Searchedrecipes = await fetch(
          `https://localhost:2000/auth/searchRecipes/${e.target.value}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        Searchedrecipes = await Searchedrecipes.json();

        if (!Searchedrecipes.message) {
          setRecipes(Searchedrecipes);
        } else {
          setRecipes([]);
        }
      } else {
        getRecipes();
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  /* This is the return value of the Recipe Component which gives out various Recipes available in the database each with an option to add to the favorite. It also has the Edit and Delete functionality if the user is the author. */

  return (
    <div className="container">
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search recipes"
          onChange={(e) => SearchRecipes(e)}
        />
      </div>
      <div className="Recipes">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div key={recipe._id} className="Recipe">
              <h2>{recipe.title}</h2>
              <img src={recipe.imageUrl} alt={recipe.title} />
              <h3>Ingredients:</h3>
              <ul>
                {recipe.ingredients.length > 0 && (
                  <ul>
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                )}
              </ul>
              <div className="instructions-container">
                <h3>Instructions:</h3>
                {recipe.instructions.match(/^\d+\./) ? (
                  <div className="instructions-text">
                    {recipe.instructions.split("\n").map((step, index) => (
                      <p key={index}>{step}</p>
                    ))}
                  </div>
                ) : (
                  <ol className="instructions-list">
                    {recipe.instructions.split("\n").map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                )}
              </div>
              {localStorage.getItem("user_id") === recipe.user_id ? (
                <button
                  className="delete-button"
                  onClick={() => handleDeleteRecipe(recipe._id)}
                >
                  Delete
                </button>
              ) : (
                console.log("Cannot Delete")
              )}
              {localStorage.getItem("user_id") === recipe.user_id ? (
                <Link to={`/editRecipe/${recipe._id}`} className="edit-button">
                  <button className="edit-recipe-button">Edit</button>
                </Link>
              ) : (
                console.log("Cannot Edit")
              )}
              <button
                className="add-to-favorites-button"
                onClick={() => handleAddToFavorites(recipe._id)}
              >
                Add to Favorites
              </button>
            </div>
          ))
        ) : (
          <h2 className="no-recipes">No Recipes Found</h2>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default Recipes;
