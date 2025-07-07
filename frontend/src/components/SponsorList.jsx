import React, { useEffect, useState, useContext } from "react";
import axios from "../utils/axios";
import SponsorForm from "./SponsorForm";
import { UserContext } from "../context/UserContext";

const SponsorList = () => {
  const { user } = useContext(UserContext);
  const userRole = user?.role;

  const [sponsors, setSponsors] = useState([]);
  const [editingSponsor, setEditingSponsor] = useState(null);

  const fetchSponsors = () => {
    axios
      .get("/sponsors/")
      .then((res) => setSponsors(res.data))
      .catch((err) => console.error("Error fetching sponsors:", err));
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this sponsor?")) {
      axios
        .delete(`/sponsors/${id}/`)
        .then(() => fetchSponsors())
        .catch((err) => {
          console.error("Error deleting sponsor:", err);
          alert("Failed to delete sponsor.");
        });
    }
  };

  const canEditDelete = userRole === "admin";

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white fw-bold">
          👥 Sponsor List
        </div>
        <div className="card-body">
          {/* Edit Form */}
          {editingSponsor && canEditDelete && (
            <div className="mb-4">
              <SponsorForm
                mode="edit"
                sponsor={editingSponsor}
                onSuccess={() => {
                  setEditingSponsor(null);
                  fetchSponsors();
                }}
                onCancel={() => setEditingSponsor(null)}
              />
            </div>
          )}

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr className="text-center">
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Type</th>
                  <th>Preferred Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sponsors.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-3">
                      No sponsors found.
                    </td>
                  </tr>
                ) : (
                  sponsors.map((sponsor) => (
                    <tr key={sponsor.id}>
                      <td>{sponsor.id}</td>
                      <td>{sponsor.name}</td>
                      <td>{sponsor.email}</td>
                      <td>{sponsor.phone}</td>
                      <td>{sponsor.address}</td>
                      <td>{sponsor.sponsor_type}</td>
                      <td>{sponsor.preferred_contact}</td>
                      <td className="text-center">
                        {canEditDelete ? (
                          <>
                            <button
                              className="btn btn-sm btn-warning me-2"
                              onClick={() => setEditingSponsor(sponsor)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(sponsor.id)}
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <span className="text-muted">View only</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorList;
