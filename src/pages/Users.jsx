import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import Navbar from "../components/Navbar";
import AsideBar from "../components/AsideBar";
import Footer from "../components/Footer";

const Users = ({ isDark, toggleTheme }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  async function fetchAllUsers() {
    try {
      const res = await axiosInstance.get("/user/getAllUsers");
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await axiosInstance.delete(`/user/deleteUser/${id}`);
        if (res.data.success) {
          alert(res.data.msg);
          fetchAllUsers();
        }
      } catch (err) {
        alert(err.response?.data?.msg || "Something went wrong");
      }
    }
  }

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const inputStyle = {
    backgroundColor: isDark ? "#0f0f1a" : "#fff",
    border: `1px solid ${isDark ? "#2e2e4f" : "#dee2e6"}`,
    color: isDark ? "#fff" : "#000",
  };

  // Search
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()),
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage,
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: isDark ? "#0f0f1a" : "#ffffff",
      }}
    >
      <Navbar toggleTheme={toggleTheme} isDark={isDark} />

      <div className="container-fluid">
        <div className="row">
          <div
            className="col-2"
            style={{
              backgroundColor: isDark ? "#1a1a2e" : "#f8f9fa",
              minHeight: "calc(100vh - 60px)",
              borderRight: `1px solid ${isDark ? "#2e2e4f" : "#dee2e6"}`,
            }}
          >
            <AsideBar isDark={isDark} />
          </div>

          <div
            className="col-10"
            style={{ padding: "30px", color: isDark ? "#fff" : "#000" }}
          >
            <h3 className="mb-4">All Users</h3>

            {/* Search */}
            <div className="row g-3 mb-4">
              <div className="col-md-5">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="form-control"
                  style={inputStyle}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="col-md-1">
                <button
                  className="btn w-100"
                  style={{ backgroundColor: "#dc3545", color: "#fff" }}
                  onClick={() => {
                    setSearch("");
                    setCurrentPage(1);
                  }}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <p>Loading...</p>
            ) : filteredUsers.length === 0 ? (
              <p>No users found!</p>
            ) : (
              <>
                <div className="table-responsive">
                  <table
                    className="table table-hover"
                    style={{ color: isDark ? "#fff" : "#000" }}
                  >
                    <thead>
                      <tr
                        style={{
                          backgroundColor: isDark ? "#2e2e4f" : "#f8f9fa",
                          color: isDark ? "#fff" : "#000",
                        }}
                      >
                        <th>#</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Contact</th>
                        <th>Role</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUsers.map((user, index) => (
                        <tr
                          key={index}
                          style={{
                            backgroundColor: isDark ? "#1a1a2e" : "#fff",
                            color: isDark ? "#fff" : "#000",
                          }}
                        >
                          <td>
                            {(currentPage - 1) * usersPerPage + index + 1}
                          </td>
                          <td>
                            <img
                              src={
                                user.img_path
                                  ? `http://localhost:5000/upload/${user.img_path}`
                                  : "https://via.placeholder.com/40"
                              }
                              alt="user"
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "2px solid #4e4edb",
                              }}
                            />
                          </td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.contactNumber}</td>
                          <td>
                            <span
                              className="badge"
                              style={{
                                backgroundColor:
                                  user.role === "admin" ? "#dc3545" : "#4e4edb",
                              }}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm"
                              style={{
                                backgroundColor: "#dc3545",
                                color: "#fff",
                                borderRadius: "8px",
                              }}
                              onClick={() => handleDelete(user.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="d-flex align-items-center justify-content-between mt-3">
                  <p
                    style={{ color: isDark ? "#aaa" : "#555", marginBottom: 0 }}
                  >
                    Showing {(currentPage - 1) * usersPerPage + 1} to{" "}
                    {Math.min(currentPage * usersPerPage, filteredUsers.length)}{" "}
                    of {filteredUsers.length} users
                  </p>
                  <nav>
                    <ul className="pagination mb-0">
                      <li
                        className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link"
                          style={inputStyle}
                          onClick={() => setCurrentPage(currentPage - 1)}
                        >
                          Previous
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, i) => (
                        <li
                          key={i}
                          className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                        >
                          <button
                            className="page-link"
                            style={
                              currentPage === i + 1
                                ? {
                                    backgroundColor: "#4e4edb",
                                    borderColor: "#4e4edb",
                                    color: "#fff",
                                  }
                                : inputStyle
                            }
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li
                        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link"
                          style={inputStyle}
                          onClick={() => setCurrentPage(currentPage + 1)}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer isDark={isDark} />
    </div>
  );
};

export default Users;
