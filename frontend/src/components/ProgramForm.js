import React, { useState, useEffect, useContext } from "react";
import axios from "../utils/axios";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const ProgramForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useContext(UserContext);
  const userRole = user?.role;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
  });

  useEffect(() => {
    if (id) {
      axios.get(`/programs/${id}/`)
        .then(res => {
          setFormData(res.data);
        })
        .catch(err => {
          console.error("Failed to fetch program data:", err);
          alert("Failed to load program data.");
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        await axios.put(`/programs/${id}/`, formData);
        alert("Program updated successfully.");
      } else {
        await axios.post("/programs/", formData);
        alert("Program created successfully.");
      }
      navigate("/programs/list");
    } catch (err) {
      console.error("Error saving program:", err);
      alert("Failed to save program.");
    }
  };

  const handleCancel = () => {
    navigate("/programs/list");
  };

  // Restrict viewers from accessing this form
  if (userRole === "viewer") {
    return (
      <div className="alert alert-warning p-4">
        <h3>Access Denied</h3>
        <p>You do not have permission to {id ? "edit" : "add"} programs.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-3 mb-4">
      <h5>{id ? "Edit Program" : "Add Program"}</h5>

      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          type="text"
          className="form-control"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={2}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Location</label>
        <textarea
          className="form-control"
          name="location"
          value={formData.location}
          onChange={handleChange}
          rows={2}
        />
      </div>

      <div>
        <button type="submit" className="btn btn-primary me-2">
          {id ? "Update" : "Add"}
        </button>
        {id && (
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ProgramForm;
