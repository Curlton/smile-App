import React, { useContext, useEffect, useState } from "react";
import axios from "../utils/axios";
import DonationForm from "./DonationForm";
import { UserContext } from "../context/UserContext";

const DonationList = () => {
  const { user } = useContext(UserContext);
  const userRole = user?.role;

  const [donations, setDonations] = useState([]);
  const [editDonation, setEditDonation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const canEditDelete = userRole === "admin";  // Only admins can edit/delete

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/donations/");
      setDonations(res.data);
    } catch (err) {
      console.error("Error fetching donations:", err);
      alert("Failed to load donations.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (donation) => {
    if (!canEditDelete) return; // extra guard
    setEditDonation(donation);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!canEditDelete) return; // extra guard
    if (!window.confirm("Are you sure you want to delete this donation?")) return;

    setDeletingId(id);
    try {
      await axios.delete(`/donations/${id}/`);
      await fetchDonations();
      if (editDonation?.id === id) setEditDonation(null);
    } catch (err) {
      console.error("Failed to delete donation", err);
      alert("Failed to delete donation.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container-fluid">
      <div className="bg-light border rounded p-4 mb-4 shadow-sm">
        <h2 className="text-center text-primary fw-bold mb-4">🎁 Donations Management</h2>

        {/* Edit Form Section */}
        {editDonation && canEditDelete && (
          <div className="mb-4 border rounded p-3 bg-white shadow-sm">
            <h5 className="mb-3 text-secondary">Edit Donation ID #{editDonation.id}</h5>
            <DonationForm
              mode="edit"
              donation={editDonation}
              onSuccess={() => {
                fetchDonations();
                setEditDonation(null);
              }}
              onCancel={() => setEditDonation(null)}
            />
          </div>
        )}

        {/* Table Section */}
        {loading ? (
          <p className="text-center">Loading donations...</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle">
              <thead className="table-dark text-center">
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Sponsor</th>
                  <th>Payment Method</th>
                  <th>Purpose</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.length > 0 ? (
                  donations.map((donation) => (
                    <tr key={donation.id}>
                      <td className="text-center">{donation.id}</td>
                      <td>${parseFloat(donation.amount).toFixed(2)}</td>
                      <td>{new Date(donation.donation_date).toLocaleDateString()}</td>
                      <td>{donation.sponsor?.name || donation.sponsor}</td>
                      <td>{donation.payment_method}</td>
                      <td>{donation.purpose}</td>
                      <td className="text-center">
                        {canEditDelete ? (
                          <>
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => handleEdit(donation)}
                              disabled={deletingId === donation.id}
                            >
                              ✏ Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(donation.id)}
                              disabled={deletingId === donation.id}
                            >
                              {deletingId === donation.id ? "Deleting..." : "🗑 Delete"}
                            </button>
                          </>
                        ) : (
                          <span className="text-muted">View only</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      No donations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationList;
