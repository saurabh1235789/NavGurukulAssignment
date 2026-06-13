import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      login(
        response.data.user,
        response.data.token
      );

      console.log("Connecting socket...");

      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Login failed"
      );
    }
  };

  return (
    <div className="auth-page">
  <div className="auth-card">

    <div className="auth-logo">
      <h1>
        Classroom Platform
      </h1>

      <p className="auth-subtitle">
        Welcome Back
      </p>
    </div>

    <form className="auth-form">

      <input
        className="auth-input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="auth-input"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="auth-btn"
        onClick={handleSubmit}
      >
        Login
      </button>

    </form>
 <div className="auth-link">

        <span>
          Don't have an account?
        </span>

        {" "}

        <a
          href="/register"
        >
          Register
        </a>

      </div>
  </div>
 
  </div>
  );
}

export default LoginPage;