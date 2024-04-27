import React, { useState } from "react";
import "../styles/ForgotPassword.css";
import { toast, ToastContainer } from "react-toastify";

/* This Component is for Updating the forgotten password */

const UpdatePassword = () => {
  /* This is used to maintain the state of the password and email address. */
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(null);

  /* This callback handles the change in the value of the pasword */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /* This callback handles the submit of the updated password form.*/

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://localhost:2000/auth/forgotpassword",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        toast.success("Password Updated successfully");

        setTimeout(() => {
          window.location.href = "/login";
        }, 4000);
      } else {
        setMessage("An error occurred while updating the password.");
        toast.error("Error in Password update");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while updating the password.");
    }
  };

  /* The return value of the ForgotPassword component which has the form for updating the new password. */

  return (
    <div className="update-password-container">
      <h2>Update Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Update Password</button>
      </form>
      {message && <p className="error-message">{message}</p>}
      <ToastContainer />
    </div>
  );
};

export default UpdatePassword;
