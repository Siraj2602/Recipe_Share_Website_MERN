import React, { useEffect, useState } from "react";
import "../styles/RecipeDetailsStyle.css";
import { Link } from "react-router-dom";
import "../styles/Searchbar.css";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling

const RecipeDetails = () => {

  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState({
    title: "",
    ingredients: [],
    instructions: "",
    imageUrl: "",
  });

  const [isfavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(
          `https://localhost:2000/auth/recipe/${recipeId}`,
          {
            method: "GET",
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Fetch recipe");
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        toast.error("Failed to load recipe!");
      }
    };
    const checkIfFavorite = async () => {
        
        const dataToSend = {
            user_id: localStorage.getItem("user_id"),
            recipeId: recipeId,
        };
        
        try {
          const response = await fetch(`https://localhost:2000/auth/checkFavorite`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(dataToSend)
          });
          console.log("Requesting going");
          console.log(response);
          if (response.ok) {
            const data = await response.json();
            console.log("Response Data : ",data);
            setIsFavorite(data.isFavorite); // Set favorite state based on response
          }
        } catch (error) {
          console.error("Error checking favorite status:", error);
        }
      };
    fetchRecipe();
    checkIfFavorite();
  }, [recipeId]);

  const handleDeleteRecipe = async (recipeId) => {
    try {
      if (window.confirm("Are you sure you want to delete this recipe?")) {
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
          toast.error("Failed to delete recipe");
        }
      }
    } catch (error) {
      toast.error("An error occurred while deleting the recipe:", error);

      setTimeout(() => {
        window.location.href = "/recipes";
      }, 3000);
    }
  };

  const handleAddToFavorites = async (recipeId) => {
    try {
      const dataToSend = {
        user_id: localStorage.getItem("user_id"),
        recipeId: recipeId,
      };
      const response = await fetch("https://localhost:2000/auth/likedRecipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        toast.success("Recipe added to favorites successfully");
        setIsFavorite(true);
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

  const handleRemoveFromFavorites = async (recipeId) => {
    try {
        if (
          window.confirm(
            "Are you sure you wanna remove this recipe from favourites??"
          )
        ) {
          const dataToSend = {
            user_id: localStorage.getItem("user_id"),
            recipeId: recipeId,
          };
          const response = await fetch(
            `https://localhost:2000/auth/removeLiked`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dataToSend),
            }
          );
  
          if (response.ok) {
            toast.success("Item Removed successfully");
            setIsFavorite(false);
            setTimeout(() => {
              window.location.href = "/favouriteRecipes";
            }, 4000);
          } else {
            const data = await response.json();
            toast.error(data.error);
          }
        } else {
          window.location.href = "/favouriteRecipes";
        }
      } catch (error) {
        toast.error("Error removing item from liked products:", error);
      }  
  }

  return (
    <div className="recipe-details-container">
      <div className="recipe-details-Recipe">
        <h2>{recipe.title}</h2>
        <img src={recipe.imageUrl} alt={recipe.title} />
        <h3>Ingredients:</h3>
        <ol className="recipe-details-ingredients-list">
          {recipe.ingredients.length > 0 && (
            recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))
          )}
        </ol>
        <div className="recipe-details-instructions-container">
          <h3>Instructions:</h3>
          {recipe.instructions.match(/^\d+\./) ? (
            <div className="recipe-details-instructions-text">
              {recipe.instructions.split("\n").map((step, index) => (
                <p key={index}>{step}</p>
              ))}
            </div>
          ) : (
            <ol className="recipe-details-instructions-list">
              {recipe.instructions.split("\n").map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          )}
        </div>
        <div className="recipe-details-buttons-container">
        {localStorage.getItem("user_id") === recipe.user_id ? (
          <>
            <button className="recipe-details-delete-button" onClick={() => handleDeleteRecipe(recipe.recipeId)}>
              Delete
            </button>
            <Link to={`/editRecipe/${recipe.recipeId}`} className="recipe-details-edit-button">
              <button className="recipe-details-edit-recipe-button">Edit</button>
            </Link>
          </>
        ) : (
          <div></div>
        )}
        {isfavorite === true ? (<button className="recipe-details-add-to-favorites-button" onClick={() => handleRemoveFromFavorites(recipe.recipeId)}>Remove From Favorites</button>) : (<button className="recipe-details-add-to-favorites-button" onClick={() => handleAddToFavorites(recipe.recipeId)}>
          Add to Favorites
        </button>)}
        
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RecipeDetails;
