import { Route, Routes } from "react-router-dom";
import AuthForm from "../features/auth/AuthForm";
import { useMeQuery } from "../features/auth/authSlice";
import Dashboard from "../features/dashboard/Dashboard";
import "./App.css";
import React, { useState, useEffect } from "react";

/**
 * App is the root component of our application.
 * It will render either a login form or the dashboard
 * depending on whether the user is logged in or not.
 */
function App() {
  const [user, setUser] = useState(null); 

  useEffect(() => {
    // Get the user_id from the URL query params after redirect
    const queryParams = new URLSearchParams(window.location.search);
    const userId = queryParams.get("user_id");

    if (userId) {
      // Fetch the user data from the backend
      fetch(`http://localhost:8080/api/github/user/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
        })
        .catch((err) => console.error("Error fetching user:", err));

      // Clean up the URL (remove query params)
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleLogin = () => {
    window.location.href = "http://localhost:8080/auth/github";
  };

  const handleLogout = () => {
    setUser(null);
  };



  const guestRouter = (
    <Routes>
      <Route path="/*" element={<AuthForm />} />
    </Routes>
  );
  const userRouter = (
    <Routes>
      <Route path="/*" element={<Dashboard />} />
    </Routes>
  );

  const { data: me } = useMeQuery();
  const loggedIn = !!me?.id;
  loggedIn ? userRouter : guestRouter;
 
  return (
    
    <div className="App">
      <h1>GitHub OAuth with PostgreSQL Demo</h1>
      {user ? (
        <div>
          <p>Welcome, {user.login}!</p>
          <img src={user.avatar_url} alt="Avatar" width="100" />
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={handleLogin}>Login with GitHub</button>
        </div>
      )}
      
    </div>
  );

}

export default App;