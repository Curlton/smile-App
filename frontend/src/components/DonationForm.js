import React, { useEffect, useState, useContext } from "react";
import axios from "../utils/axios";
import { UserContext } from "../context/UserContext";

const DonationForm = ({ mode = "create", donation = {}, onSuccess, onCancel }) => {
  const { user, loading: userLoading } = useContext(UserContext);
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState({
    sponsor: "",
    amount: "",
    donation_date: "",
    payment_method: "",
    purpose: "",
  });

  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("/sponsors/")
      .then((res) => setSponsors(res.data))
      .catch(() => alert("Failed to load sponsors"));
  }, []);

  useEffect(() => {
    if (isEdit && donation.id) {
      setFormData({
        sponsor: donation.sponsor?.id || donation.sponsor || "",
        amount: donation.amount || "",
        donation_date: donation.donation_date || "",
        payment_method: donation.payment_method || "",
        purpose: donation.purpose || "",
      });
    }
  }, [donation, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const parseErrors = (errorData) => {
    if (!errorData) return "Unknown error";
    if (typeof errorData === "string") return errorData;
    if (typeof errorData === "object") {
      return Object.entries(errorData)
        .map(([field, messages]) =>
          Array.isArray(messages) ? `${field}: ${messages.join(", ")}` : `${field}: ${messages}`
        )
        .join("\n");
    }
    return "Validation error";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.sponsor || !formData.amount || !formData.donation_date) {
      alert("Please fill in all required fields (Sponsor, Amount, Donation Date).");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        sponsor_id: Number(formData.sponsor),
      };
      delete payload.sponsor;

      if (isEdit && donation.id) {
        await axios.put(`/donations/${donation.id}/`, payload);
        alert("Donation updated successfully.");
      } else {
        await axios.post("/donations/", payload);
        alert("Donation created successfully.");
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Validation errors:", error.response?.data);
      alert("Failed to save donation:\n" + parseErrors(error.response?.data));
    } finally {
      setLoading(false);
    }
  };

  // Only allow admins to see/use this form
  if (userLoading) return <p>Loading user info...</p>;
  if (!user || !(user.role === "admin" || user.is_superuser)) {
    return (
      <div className="alert alert-danger" role="alert">
        You do not have permission to access this form.
      </div>
    );
  }

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-primary text-white fw-bold">
        {isEdit ? "✏ Edit Donation" : "➕ Add New Donation"}
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <fieldset disabled={loading}>
            <div className="mb-3">
              <label className="form-label">Sponsor *</label>
              <select
                name="sponsor"
                value={formData.sponsor}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">-- Select Sponsor --</option>
                {sponsors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="row">
              <div className="mb-3 col-md-6">
                <label className="form-label">Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3 col-md-6">
                <label className="form-label">Donation Date *</label>
                <input
                  type="date"
                  name="donation_date"
                  value={formData.donation_date}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Payment Method</label>
              <input
                type="text"
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., Mobile Money, Bank Transfer"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Purpose</label>
              <textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className="form-control"
                rows={3}
                placeholder="Reason or notes about this donation"
              />
            </div>

            <div className="d-flex justify-content-between">
              <button
                type="submit"
                className={`btn ${isEdit ? "btn-warning" : "btn-success"} px-4`}
                disabled={loading}
              >
                {loading
                  ? isEdit
                    ? "Updating..."
                    : "Saving..."
                  : isEdit
                  ? "Update Donation"
                  : "Add Donation"}
              </button>

              {isEdit && onCancel && (
                <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
                  Cancel
                </button>
              )}
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default DonationForm;
