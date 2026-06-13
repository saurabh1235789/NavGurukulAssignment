import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/auth.css";

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);

      alert("Registration successful");

      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
  <div className="auth-page">

    <div className="auth-card">

      <div className="auth-logo">
        <h1> Classroom Platform</h1>

        <p className="auth-subtitle">
          Create your account
        </p>
      </div>

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >

        <input
          className="auth-input"
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value
            })
          }
          required
        />

        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value
            })
          }
          required
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value
            })
          }
          required
        />

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
            }}
          >
            Select Role
          </label>

          <select
            className="auth-input"
            value={form.role}
            onChange={(e) =>
              setForm({
                ...form,
                role: e.target.value
              })
            }
          >
            <option value="STUDENT">
              Student
            </option>

            <option value="TEACHER">
              Teacher
            </option>
          </select>
        </div>

        <button
          type="submit"
          className="auth-btn"
        >
          Create Account
        </button>

      </form>

      <div className="auth-link">

        <span>
          Already have an account?
        </span>

        {" "}

        <a
          href="/login"
        >
          Login
        </a>

      </div>

    </div>

  </div>
  );
}

export default RegisterPage;