import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import { UserContext } from "../context/UserContext";

const ChildForm = ({ mode = "create", onSuccess }) => {
  const { id } = useParams();
  const isEdit = mode === "edit" || Boolean(id);
  const fileInputRef = useRef(null);

  const { user } = useContext(UserContext);
  const userRole = user?.role;

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "Male",
    birth_date: "",
    entry_date: "",
    address: "",
    guardian_name: "",
    guardian_contact: "",
    reason: "",
    status: "Full",
    image_data: null,
  });

  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (isEdit && id) {
      axios
        .get(`/children/${id}/`)
        .then((res) => {
          const data = { ...res.data };
          delete data.photo; // remove photo field if present
          data.image_data = null; // reset image input
          setFormData(data);
        })
        .catch(() => {
          setError("Failed to load child info.");
        });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!e.currentTarget.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);

    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        if (key === "gender" || key === "status") {
          const fixed = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
          payload.append(key, fixed);
        } else if (key === "image_data") {
          if (value instanceof File) {
            payload.append("image_data", value);
          }
        } else {
          payload.append(key, value);
        }
      }
    });

    try {
      if (isEdit && id) {
        await axios.put(`/children/${id}/`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccessMsg("Child updated successfully!");
      } else {
        await axios.post("/children/", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccessMsg("Child added successfully!");
        // Reset form for new entry
        setFormData({
          first_name: "",
          last_name: "",
          gender: "Male",
          birth_date: "",
          entry_date: "",
          address: "",
          guardian_name: "",
          guardian_contact: "",
          reason: "",
          status: "Full",
          image_data: null,
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        setValidated(false);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data || "Failed to save child data.");
    } finally {
      setLoading(false);
    }
  };

  // Restrict access for viewers
  if (userRole === "viewer") {
    return (
      <div className="alert alert-warning p-4" role="alert">
        <h3>Access Denied</h3>
        <p>You do not have permission to {isEdit ? "edit" : "add"} child information.</p>
      </div>
    );
  }

  return (
    <>
      {/* Success Message */}
      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMsg}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setSuccessMsg(null)}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {typeof error === "string" ? error : JSON.stringify(error)}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setError(null)}
          />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className={`p-4 border rounded shadow bg-white ${validated ? "was-validated" : ""}`}
      >
        <h2 className="mb-4">{isEdit ? "Edit Child Information" : "Add New Child"}</h2>

        {/* First Name */}
        <div className="mb-3">
          <label htmlFor="first_name" className="form-label">
            First Name <span className="text-danger">*</span>
          </label>
          <input
            id="first_name"
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="form-control"
            required
            autoComplete="given-name"
          />
          <div className="invalid-feedback">First name is required.</div>
        </div>

        {/* Last Name */}
        <div className="mb-3">
          <label htmlFor="last_name" className="form-label">
            Last Name <span className="text-danger">*</span>
          </label>
          <input
            id="last_name"
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="form-control"
            required
            autoComplete="family-name"
          />
          <div className="invalid-feedback">Last name is required.</div>
        </div>

        {/* Gender */}
        <div className="mb-3">
          <label htmlFor="gender" className="form-label">
            Gender <span className="text-danger">*</span>
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <div className="invalid-feedback">Please select a gender.</div>
        </div>

        {/* Birth Date */}
        <div className="mb-3">
          <label htmlFor="birth_date" className="form-label">
            Birth Date <span className="text-danger">*</span>
          </label>
          <input
            id="birth_date"
            type="date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
            className="form-control"
            required
          />
          <div className="invalid-feedback">Birth date is required.</div>
        </div>

        {/* Entry Date */}
        <div className="mb-3">
          <label htmlFor="entry_date" className="form-label">
            Entry Date <span className="text-danger">*</span>
          </label>
          <input
            id="entry_date"
            type="date"
            name="entry_date"
            value={formData.entry_date}
            onChange={handleChange}
            className="form-control"
            required
          />
          <div className="invalid-feedback">Entry date is required.</div>
        </div>

        {/* Address */}
        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="form-control"
            rows={3}
          />
        </div>

        {/* Guardian Name */}
        <div className="mb-3">
          <label htmlFor="guardian_name" className="form-label">
            Guardian Name
          </label>
          <input
            id="guardian_name"
            type="text"
            name="guardian_name"
            value={formData.guardian_name}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* Guardian Contact */}
        <div className="mb-3">
          <label htmlFor="guardian_contact" className="form-label">
            Guardian Contact
          </label>
          <input
            id="guardian_contact"
            type="text"
            name="guardian_contact"
            value={formData.guardian_contact}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* Reason */}
        <div className="mb-3">
          <label htmlFor="reason" className="form-label">
            Reason for Entry
          </label>
          <input
            id="reason"
            type="text"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* Status */}
        <div className="mb-3">
          <label htmlFor="status" className="form-label">
            Status <span className="text-danger">*</span>
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="Full">Full</option>
            <option value="Half">Half</option>
            <option value="Inactive">Inactive</option>
          </select>
          <div className="invalid-feedback">Please select a status.</div>
        </div>

        {/* Photo */}
        <div className="mb-4">
          <label htmlFor="image_data" className="form-label">
            Photo
          </label>
          <input
            id="image_data"
            type="file"
            name="image_data"
            accept="image/*"
            onChange={handleChange}
            className="form-control"
            ref={fileInputRef}
          />
        </div>

        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? (isEdit ? "Updating..." : "Saving...") : isEdit ? "Update" : "Add Child"}
        </button>
      </form>
    </>
  );
};

export default ChildForm;
