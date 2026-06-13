import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

function DashboardPage() {

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="dashboard-page">

      <div className="dashboard-card">

        <div className="dashboard-header">

          <h1 className="dashboard-title">
            Live Classroom Platform
          </h1>

          <p className="dashboard-subtitle">
            Real-time collaborative learning environment
          </p>

        </div>

        <div className="user-info">

          <div className="info-card">
            <div className="info-label">
              Name
            </div>

            <div className="info-value">
              {user?.name}
            </div>
          </div>

          <div className="info-card">
            <div className="info-label">
              Email
            </div>

            <div className="info-value">
              {user?.email}
            </div>
          </div>

          <div className="info-card">
            <div className="info-label">
              Role
            </div>

            <div className="info-value">
              {user?.role}
            </div>
          </div>

        </div>

        <div className="action-grid">

          <div
            className="action-card"
            onClick={() =>
              navigate("/session")
            }
          >

            <div className="action-title">
              Session Management
            </div>

            <div className="action-description">
              Create, join and manage classroom sessions.
            </div>

            <button className="primary-btn">
              Open
            </button>

          </div>

          <div
            className="action-card"
            onClick={() =>
              navigate("/classroom")
            }
          >

            <div className="action-title">
              Classroom
            </div>

            <div className="action-description">
              Access notes, polls and chat in real time.
            </div>

            <button className="primary-btn">
              Enter Classroom
            </button>

          </div>

        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default DashboardPage;