import React, { useState, useEffect } from "react";
import "../styles/likedProducts.css";
import { toast, ToastContainer } from "react-toastify";

/* This Component is for Updating the Liked Recipes */

const LikedProducts = () => {
  const [likedProducts, setLikedProducts] = useState([]);

  useEffect(() => {
    // Call the async function to fetch liked products when the component mounts
    fetchLikedProducts();
  }, []);

  /* This callback function is used to fetch the liked recipes */

  const fetchLikedProducts = async () => {
    const user_id = localStorage.getItem("user_id");
    try {
      // Make a GET request to the /api/liked-products endpoint
      const response = await fetch(
        `https://localhost:2000/auth/likedRecipes/${user_id}`
      );

      if (!response.ok) {
        toast.error("Failed to fetch liked products");
      }

      const data = await response.json();
      console.log("Liked Products : ", data.likedRecipes);

      // Set the fetched data to the state
      setLikedProducts(data.likedRecipes);
    } catch (error) {
      toast.error("Error fetching liked products:", error);
    }
  };

  /* This callback function is used to remove an item from the liked recipes. */

  const handleRemoveItem = async (recipeId) => {
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
          fetchLikedProducts();
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
  };

  /* The return value of the likedRecipe component which has functionality for adding an recipe for the liked recipe list and remove an recipe from it. */

  return (
    <div className="likedRecipes">
      <h2>Favourites</h2>
      <ul>
        {likedProducts.map((product) => (
          <li key={product.recipeId} className="list">
            <div>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <img src={product.imageUrl} alt={product.title} />
              <h4>Ingredients:</h4>
              <ul>
                {product.ingredients.length > 0 && (
                  <ul className="ingredients-list">
                    {product.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                )}
              </ul>

              <div className="instructions-container">
                <h4>Instructions:</h4>
                <div className="instructions-list">
                  {product.instructions.split("\n").map((step, index) => (
                    <p key={index}>{step}</p>
                  ))}
                </div>
              </div>

              <button
                className="remove-item-button"
                onClick={() => handleRemoveItem(product.recipeId)}
              >
                Remove Item
              </button>
            </div>
          </li>
        ))}
      </ul>
      <ToastContainer />
    </div>
  );
};

export default LikedProducts;
