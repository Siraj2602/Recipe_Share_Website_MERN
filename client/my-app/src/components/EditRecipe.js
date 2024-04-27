import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/EditRecipe.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* Component for Editing the existing recipe by the user who has added the recipe. */

const EditRecipe = () => {
  const { id } = useParams();

  /* State for the recipe with all its components */
  const [recipe, setRecipe] = useState({
    title: "",
    ingredients: [],
    instructions: "",
    imageUrl: "",
  });

  /* Fetch the current recipe state */

  useEffect(() => {
    // Fetch the recipe details from the server
    const fetchRecipe = async () => {
      try {
        console.log("Recipe Id:", id);
        const response = await fetch(
          `https://localhost:2000/auth/recipe/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        toast.error("Failed to load recipe!");
      }
    };
    fetchRecipe();
  }, [id]);

  /* Each change in the character of a input is updated in the state of the recipe */

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRecipe({
      ...recipe,
      [name]: value,
    });
  };

  /* Each change in the added ingredient the state is updated  */

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    setRecipe({
      ...recipe,
      ingredients: newIngredients,
    });
  };

  /* Handler triggered when add an ingredient is pressed. It updates the ingredient state with newly added ingredient.*/

  const handleAddIngredient = () => {
    const lastIngredient = recipe.ingredients[recipe.ingredients.length - 1];
    if (lastIngredient !== "") {
      setRecipe({
        ...recipe,
        ingredients: [...recipe.ingredients, ""],
      });
    }
  };

  /* Handler triggered when an ingredient is removed by pressing the button. Removes the ingredient from the state that was present.*/

  const handleRemoveIngredient = (index) => {
    setRecipe({
      ...recipe,
      ingredients: recipe.ingredients.filter((_, i) => i !== index),
    });
  };

  /* Handler triggered when the submit button is pressed after editing the recipe. The formatting of the recipe is done and sent to the server for the updation of the recipe.*/

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Update the recipe on the server

    const nonEmptyIngredients = recipe.ingredients.filter(
      (ingredient) => ingredient.trim() !== ""
    );

    if (nonEmptyIngredients.length === 0) {
      toast.warn("Please provide at least one non-empty ingredient.");
      return;
    }

    try {
      const response = await fetch(`https://localhost:2000/auth/recipe/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipe),
      });
      if (response.ok) {
        toast.success("Recipe updated successfully!");

        setTimeout(() => {
          window.location.href = "/recipes";
        }, 4000);
      } else {
        toast.error("Failed to update recipe:", response.status);
      }
    } catch (error) {
      toast.error("Failed to update recipe:", error);
    }
  };

  /* The return value of the EditRecipe component which has the form for editing the recipe with ingredients and steps for the recipe. */

  return (
    <div className="edit-recipe">
      <h2>Edit Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={recipe.title}
            onChange={handleInputChange}
          />
        </div>
        <div className="ingredient-inputs">
          <label>Ingredients:</label>
          {recipe.ingredients.map((ingredient, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                marginBottom: "5px",
              }}
            >
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={() => handleRemoveIngredient(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddIngredient}>
            Add Ingredient
          </button>
        </div>
        <div>
          <label>Instructions:</label>
          <textarea
            name="instructions"
            value={recipe.instructions}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            name="imageUrl"
            value={recipe.imageUrl}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <button type="submit">Update Recipe</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditRecipe;
