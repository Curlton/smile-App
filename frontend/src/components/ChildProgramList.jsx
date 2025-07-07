import React, { useEffect, useState, useContext } from "react";
import axios from "../utils/axios";
import ChildProgramForm from "./ChildProgramForm";
import { UserContext } from "../context/UserContext";

const ChildProgramList = () => {
  const [childPrograms, setChildPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { user } = useContext(UserContext);
  const userRole = user?.role;

  const fetchChildPrograms = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/childprograms/");
      setChildPrograms(res.data);
    } catch (err) {
      console.error("Failed to fetch child programs:", err);
      setError("Failed to load child programs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildPrograms();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this child program?")) {
      try {
        await axios.delete(`/childprograms/${id}/`);
        fetchChildPrograms();
        setMessage("Child program deleted successfully.");
      } catch (err) {
        console.error("Delete failed:", err);
        setError("Failed to delete child program.");
      }
    }
  };

  const handleFormSuccess = (msg) => {
    setMessage(msg);
    setError("");
    setEditingProgram(null);
    fetchChildPrograms();
  };

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const canEditDelete = userRole === "admin" || userRole === "manager";

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-header bg-success text-white fw-bold">
          📘 Child Programs List
        </div>
        <div className="card-body">
          {/* Alerts */}
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Loader or Table */}
          {loading ? (
            <p className="text-muted">Loading child programs...</p>
          ) : childPrograms.length === 0 ? (
            <p className="text-muted">No child programs found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light text-center">
                  <tr>
                    <th>ID</th>
                    <th>Child</th>
                    <th>Program</th>
                    <th>Level</th>
                    <th>Location</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Fees/Term</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {childPrograms.map((cp) => (
                    <tr key={cp.id}>
                      <td>{cp.id}</td>
                      <td>{cp.child?.first_name} {cp.child?.last_name}</td>
                      <td>{cp.program?.title}</td>
                      <td>{cp.level}</td>
                      <td>{cp.location}</td>
                      <td>{cp.start_date}</td>
                      <td>{cp.end_date}</td>
                      <td>UGX {Number(cp.fees_per_term).toLocaleString()}</td>
                      <td className="text-center">
                        {canEditDelete ? (
                          <>
                            <button
                              className="btn btn-sm btn-warning me-2"
                              onClick={() => setEditingProgram(cp)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(cp.id)}
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <span className="text-muted">View only</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Edit Form */}
          {canEditDelete && editingProgram && (
            <div className="mt-4">
              <ChildProgramForm
                editingProgram={editingProgram}
                setEditingProgram={setEditingProgram}
                fetchPrograms={fetchChildPrograms}
                onSuccess={handleFormSuccess}
                onError={setError}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChildProgramList;
