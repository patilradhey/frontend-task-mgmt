import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiList,
  FiUsers,
  FiCheckSquare,
  FiLogOut,
  FiUser,
} from "react-icons/fi";

const AsideBar = ({ isDark }) => {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  async function fetchUser() {
    const res = await axiosInstance.get("/user/getUserInfo");
    if (res.data.success) {
      setUser(res.data.user);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  function handleLogout() {
    localStorage.removeItem("b69");
    navigate("/");
  }

  const linkStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 15px",
    borderRadius: "10px",
    textDecoration: "none",
    color: isDark ? "#ccc" : "#333",
    marginBottom: "5px",
    fontSize: "15px",
    transition: "background 0.2s",
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: "#4e4edb",
    color: "#fff",
  };

  return (
    <div
      style={{
        padding: "20px 10px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* User Info */}
      <div className="text-center mb-4">
        <img
          src={
            user?.img_path ? user.img_path : "https://via.placeholder.com/60"
          }
          alt="profile"
          style={{
            width: "65px",
            height: "65px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #4e4edb",
          }}
        />
        <p
          style={{
            color: isDark ? "#fff" : "#000",
            marginTop: "8px",
            fontWeight: "600",
            marginBottom: "3px",
          }}
        >
          {user?.name}
        </p>
        <span
          className="badge"
          style={{ backgroundColor: "#4e4edb", fontSize: "11px" }}
        >
          {user?.role}
        </span>
      </div>

      {/* Nav Links */}
      <nav className="d-flex flex-column">
        <Link
          to="/profile"
          style={linkStyle}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#4e4edb")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <FiUser size={18} /> Profile
        </Link>
        <Link
          to="/protected"
          style={linkStyle}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#4e4edb")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <FiHome size={18} /> Dashboard
        </Link>

        {user?.role === "user" && (
          <Link
            to="/tasks"
            style={linkStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#4e4edb")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <FiList size={18} /> My Tasks
          </Link>
        )}

        {/* Admin only */}
        {user?.role === "admin" && (
          <>
            <Link
              to="/create-task"
              style={linkStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#4e4edb")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <FiCheckSquare size={18} /> Create Task
            </Link>
            <Link
              to="/all-tasks"
              style={linkStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#4e4edb")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <FiCheckSquare size={18} /> All Tasks
            </Link>

            <Link
              to="/users"
              style={linkStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#4e4edb")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <FiUsers size={18} /> Users
            </Link>
          </>
        )}
      </nav>

      {/* Logout at bottom */}
      {/* <div className="mt-auto">
                <button
                    onClick={handleLogout}
                    className="btn w-100"
                    style={{
                        backgroundColor: '#ff4d4d',
                        color: '#fff',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    <FiLogOut size={16} /> Logout
                </button>
            </div> */}
    </div>
  );
};

export default AsideBar;
