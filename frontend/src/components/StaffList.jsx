import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

const StaffList = () => {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaffs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("/staffs/");
        setStaffs(res.data);
      } catch (err) {
        setError("Failed to load staff members.");
        console.error("Error fetching Staff:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await axios.delete(`/staffs/${id}/`);
        setStaffs((prev) => prev.filter((s) => s.id !== id));
      } catch (err) {
        setError("Failed to delete staff. Please try again.");
        console.error("Error deleting staff:", err);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/staffs/edit/${id}`);
  };

  return (
    <div className="container my-4">
      <h2 className="text-primary fw-bold mb-4 border-bottom pb-2 shadow-sm">
        Staff List
      </h2>

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

      {/* Loading Spinner */}
      {loading && (
        <div className="d-flex justify-content-center my-4">
          <div className="spinner-border text-primary" role="status" aria-hidden="true" />
          <span className="ms-2">Loading staff members...</span>
        </div>
      )}

      {!loading && (
        <div className="table-responsive shadow rounded">
          <table className="table table-striped table-hover align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Position</th>
                <th>Groups</th>
                <th>Volunteer</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffs.length > 0 ? (
                staffs.map((staff) => (
                  <tr key={staff.id}>
                    <td>{staff.id}</td>
                    <td className="text-start">{staff.username}</td>
                    <td className="text-start">{staff.email || "N/A"}</td>
                    <td classname="text-start">{staff.position}</td>
                    <td className="text-start">
                      {staff.groups && staff.groups.length > 0
                        ? staff.groups.join(", ")
                        : "No Group"}
                    </td>
                    <td>{staff.is_volunteer ? "Yes" : "No"}</td>
                    <td className="text-start">{staff.phone}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-warning me-2"
                        onClick={() => handleEdit(staff.id)}
                        title="Edit Staff"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(staff.id)}
                        title="Delete Staff"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-muted fst-italic py-4">
                    No staff members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffList;
