import React, { useState, useEffect } from "react";
import axios from "../utils/axios";

const SponsorForm = ({ mode = "create", sponsor = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    sponsor_type: "",
    preferred_contact: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && sponsor) {
      setFormData({
        name: sponsor.name || "",
        email: sponsor.email || "",
        phone: sponsor.phone || "",
        address: sponsor.address || "",
        sponsor_type: sponsor.sponsor_type || "",
        preferred_contact: sponsor.preferred_contact || "",
      });
    }
  }, [mode, sponsor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "edit") {
        await axios.put(`/sponsors/${sponsor.id}/`, formData);
        alert("Sponsor updated!");
      } else {
        await axios.post("/sponsors/", formData);
        alert("Sponsor created!");
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        sponsor_type: "",
        preferred_contact: "",
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error saving sponsor:", err.response?.data);
      alert(`Failed to save sponsor: ${JSON.stringify(err.response?.data, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded shadow-sm bg-white">
      <h4 className="mb-4">{mode === "edit" ? "Edit Sponsor" : "Add Sponsor"}</h4>

      <div className="mb-3">
        <label htmlFor="name" className="form-label">Name *</label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="form-control"
          required
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="form-control"
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="phone" className="form-label">Phone</label>
        <input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="form-control"
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="address" className="form-label">Address *</label>
        <input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="form-control"
          required
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="sponsor_type" className="form-label">Sponsor Type</label>
        <input
          id="sponsor_type"
          name="sponsor_type"
          value={formData.sponsor_type}
          onChange={handleChange}
          placeholder="e.g. Individual, Organization"
          className="form-control"
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="preferred_contact" className="form-label">Preferred Contact</label>
        <input
          id="preferred_contact"
          name="preferred_contact"
          value={formData.preferred_contact}
          onChange={handleChange}
          placeholder="Preferred Contact"
          className="form-control"
          disabled={loading}
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? (mode === "edit" ? "Updating..." : "Creating...") : (mode === "edit" ? "Update Sponsor" : "Create Sponsor")}
      </button>
    </form>
  );
};

export default SponsorForm;
