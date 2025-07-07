// src/components/LoginPage.jsx
import React, { useState, useContext } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import logo from "../assets/smile_logo.png";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { setUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Login → get JWT + role + groups
      const res = await axios.post("/token/", { username, password });

      // Save tokens
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      const { role, username: userName, groups, is_superuser } = res.data;

      if (!role) {
        alert("User role not found. Please contact admin.");
        setLoading(false);
        return;
      }

      localStorage.setItem("role", role);

      // Update context
      setUser({
        username: userName,
        role,
        groups,
        is_superuser,
      });

      // Redirect
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      alert("Invalid credentials or server error.");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <img src={logo} alt="logo preload" style={{ display: "none" }} />
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          height: "100vh",
          backgroundColor: "#f8f9fa",
          backgroundImage: `url(${logo})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            zIndex: 0,
          }}
        />
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100%", position: "relative", zIndex: 1, width: "100%" }}
        >
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-5 col-lg-4">
                <form onSubmit={handleLogin} className="bg-white p-4 rounded shadow">
                  <h3 className="text-center mb-4">SmilePortal</h3>

                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>

                <p className="text-center mt-3 text-muted" style={{ fontSize: "0.9rem" }}>
                  &copy; {new Date().getFullYear()} CurlTech. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
