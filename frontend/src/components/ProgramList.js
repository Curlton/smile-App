import React, { useState, useEffect, useContext } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const ProgramList = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const userRole = user?.role;

  const fetchPrograms = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/programs/");
      setPrograms(res.data);
    } catch (err) {
      setError("Error fetching programs. Please try again.");
      console.error("Error fetching programs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      try {
        await axios.delete(`/programs/${id}/`);
        fetchPrograms();
      } catch (err) {
        setError("Failed to delete program. Please try again.");
        console.error("Delete failed:", err);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/programs/edit/${id}`);
  };

  return (
    <div className="container my-4">
      {/* Title */}
      <h3 className="mb-4 fw-bold text-center text-white py-3 rounded shadow" style={{ backgroundColor: "#ff7f00" }}>
        🎯 Programs List
      </h3>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setError(null)}
          />
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-warning" role="status" />
          <span className="ms-2">Loading programs...</span>
        </div>
      ) : (
        <>
          {programs.length > 0 ? (
            <div className="table-responsive shadow rounded">
              <table className="table table-striped table-hover align-middle text-center">
                <thead style={{ backgroundColor: "#ffa94d", color: "white" }}>
                  <tr>
                    <th className="text-uppercase">#</th>
                    <th className="text-uppercase">Title</th>
                    <th className="text-uppercase">Description</th>
                    <th className="text-uppercase">Location</th>
                    {(userRole === "admin" || userRole === "manager") && (
                      <th className="text-uppercase">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {programs.map((program) => (
                    <tr key={program.id}>
                      <td className="fw-bold">{program.id}</td>
                      <td>{program.title}</td>
                      <td className="text-truncate" style={{ maxWidth: "300px" }}>{program.description}</td>
                      <td>{program.location}</td>
                      {(userRole === "admin" || userRole === "manager") && (
                        <td>
                          <button
                            className="btn btn-sm btn-outline-warning me-2"
                            onClick={() => handleEdit(program.id)}
                          >
                            <i className="bi bi-pencil-square"></i> Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(program.id)}
                          >
                            <i className="bi bi-trash"></i> Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted fst-italic text-center mt-5">
              No programs found. Please add a new one.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default ProgramList;
