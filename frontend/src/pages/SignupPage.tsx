import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Job-Tracker - Sign Up";
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authContext?.signup(username, email, password);
      navigate("/login");
    } catch (err: unknown) {
      // 'err' is of type 'unknown'
      if (axios.isAxiosError(err)) {
        // Check if it's an AxiosError
        // AxiosError has response and request properties
        if (err.response) {
          // Display specific error message from the server, if available
          setError(
            err.response.data.detail ||
              err.response.data.message ||
              "Signup failed."
          );
        } else if (err.request) {
          // The request was made but no response was received
          setError("No response from server. Please try again.");
        } else {
          // Some error occurred while setting up the request
          setError("Error in sending request. Please try again.");
        }
      } else {
        // Handle any other errors (non-Axios errors)
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="login-signup-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup} className="login-signup">
        {error && <p className="error">{error}</p>}
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
        <p>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
