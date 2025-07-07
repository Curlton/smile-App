import React, { useEffect, useState, useContext } from "react";
import axios from "../utils/axios.js";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const BASE_URL = "http://localhost:8000";

const ChildList = () => {
  const { user } = useContext(UserContext);
  const userRole = user?.role;

  const [children, setChildren] = useState([]);
  const [filteredChildren, setFilteredChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    handleSearch(search);
  }, [search, children]);

  const fetchChildren = () => {
    axios
      .get("/children-summary/")
      .then((res) => {
        setChildren(res.data);
        setFilteredChildren(res.data);
      })
      .catch((err) => console.error("Error fetching children summary:", err));
  };

  const fetchChildDetail = (childId) => {
    if (selectedChild?.id === childId) {
      setSelectedChild(null);
      return;
    }

    setLoading(true);
    axios
      .get(`/children-detail/${childId}/`)
      .then((res) => {
        setSelectedChild(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching child detail:", err);
        setLoading(false);
      });
  };

  const handleDelete = (childId) => {
    if (window.confirm("Are you sure you want to delete this child?")) {
      axios
        .delete(`/children/${childId}/`)
        .then(() => {
          fetchChildren();
          setSelectedChild(null);
        })
        .catch((err) => {
          console.error("Error deleting child:", err);
          alert("Failed to delete child.");
        });
    }
  };

  const handleSearch = (value) => {
    const searchTerm = value.toLowerCase();
    const filtered = children.filter(
      (child) =>
        child.first_name.toLowerCase().includes(searchTerm) ||
        child.last_name.toLowerCase().includes(searchTerm)
    );
    setFilteredChildren(filtered);
  };

  return (
    <div className="container my-4">
      <h2 className="fw-bold mb-4 pb-2 border-bottom text-center text-warning">Children Records</h2>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="🔍 Search by first or last name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle text-center">
          <thead className="text-white" style={{ backgroundColor: "#ff7f00" }}>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredChildren.map((child) => (
              <tr key={child.id}>
                <td>{child.id}</td>
                <td>{child.first_name}</td>
                <td>{child.last_name}</td>
                <td>
                  <button
                    onClick={() => fetchChildDetail(child.id)}
                    className="btn btn-sm btn-outline-primary me-2"
                  >
                    {selectedChild?.id === child.id ? "Hide" : "View"}
                  </button>

                  {(userRole === "admin" || userRole === "manager") && (
                    <Link
                      to={`/children/edit/${child.id}`}
                      className="btn btn-sm btn-outline-success me-2"
                    >
                      Edit
                    </Link>
                  )}

                  {userRole === "admin" && (
                    <button
                      onClick={() => handleDelete(child.id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loader */}
      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-warning" role="status" />
          <p className="mt-2">Loading child details...</p>
        </div>
      )}

      {/* Details */}
      {selectedChild && (
        <div className="card shadow mt-4">
          <div className="card-header d-flex justify-content-between align-items-center bg-warning text-white">
            <h5 className="mb-0">{selectedChild.first_name} {selectedChild.last_name} Details</h5>
            <button
              className="btn btn-sm btn-light"
              onClick={() => setSelectedChild(null)}
            >
              Close
            </button>
          </div>

          <div className="card-body">
            <div className="row">
              <div className="col-md-8">
                <table className="table table-bordered">
                  <tbody>
                    <tr><th>Gender</th><td>{selectedChild.gender}</td></tr>
                    <tr><th>Birth Date</th><td>{selectedChild.birth_date}</td></tr>
                    <tr><th>Status</th><td>{selectedChild.status}</td></tr>
                    <tr><th>Entry Date</th><td>{selectedChild.entry_date}</td></tr>
                    <tr><th>Address</th><td>{selectedChild.address}</td></tr>
                    <tr><th>Reason</th><td>{selectedChild.reason}</td></tr>
                    <tr><th>Guardian Name</th><td>{selectedChild.guardian_name}</td></tr>
                    <tr><th>Guardian Contact</th><td>{selectedChild.guardian_contact}</td></tr>
                  </tbody>
                </table>

                <h5 className="mt-4 text-warning">Enrolled Programs</h5>
                {selectedChild.childprogram?.length > 0 ? (
                  <table className="table table-sm table-bordered mt-2">
                    <thead className="table-light">
                      <tr>
                        <th>Program</th>
                        <th>Level</th>
                        <th>Location</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Fees/Term</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedChild.childprogram.map((prog, index) => (
                        <tr key={index}>
                          <td>{prog.program?.title || "N/A"}</td>
                          <td>{prog.level}</td>
                          <td>{prog.location}</td>
                          <td>{prog.start_date}</td>
                          <td>{prog.end_date}</td>
                          <td>{prog.fees_per_term}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-muted">No programs assigned.</p>
                )}

                {(userRole === "admin" || userRole === "manager") && (
                  <div className="text-end mt-3">
                    <Link
                      to={`/children/edit/${selectedChild.id}`}
                      className="btn btn-warning"
                    >
                      Edit Child
                    </Link>
                  </div>
                )}
              </div>

              {selectedChild.photo && (
                <div className="col-md-4 text-center">
                  <img
                    src={`${BASE_URL}${selectedChild.photo}`}
                    alt="Child"
                    className="img-fluid rounded shadow"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChildList;
