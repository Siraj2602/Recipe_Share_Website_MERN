import React, { useState } from "react";
import "../App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling

/* This Component is for registering a new user for the Recipe Sharing Website */

const Register = () => {
  /* This sets up the use state for the user with Username, Email and Password. */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false); // State to control the error message visibility
  const Email = email.toLowerCase();
  const handleSubmit = async (e) => {
    e.preventDefault();

    /* Raise an error if any of the email, username or the password is empty. */

    if (!email || !password || !name) {
      // If any of the fields are empty, show the error message
      setShowError(true);
      return; // Prevent further execution
    }

    /* This section has logic for sending the information for registering the new user.*/

    try {
      const response = await fetch("https://localhost:2000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: Email, password }),
      });

      if (response.ok) {
        const user = await response.json();

        if (user.error) {
          toast.warn("User already exists. Try with different email");
        } else {
          toast.success("Registration successful.");
          console.log(user);
          localStorage.setItem("token", user.token);
          localStorage.setItem("user_id", user.newUser.userId);
          setTimeout(() => {
            window.location.href = "/";
          }, 4000);
        }
      } else {
        console.error("Failed to register user:", response.status);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while registering user:", error);
    }
  };

  /* This is the return value of the Register Component which has the form of Username, EmailID, and Password. */

  return (
    <div className="SignupContainer">
      <form action="" onSubmit={(e) => handleSubmit(e)}>
        <h2>SignUp</h2>
        <input
          type="text"
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Enter Your email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Your password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      {showError && (
        <span className="fill-fields-error">Please Fill all the fields</span>
      )}
      <ToastContainer />
    </div>
  );
};

export default Register;
