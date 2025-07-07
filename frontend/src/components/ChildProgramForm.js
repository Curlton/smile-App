import React, { useState, useEffect, useContext } from "react";
import axios from "../utils/axios";
import { UserContext } from "../context/UserContext";

const ChildProgramForm = ({ fetchPrograms, editingProgram, setEditingProgram }) => {
  const { user } = useContext(UserContext);
  const userRole = user?.role;

  const [formData, setFormData] = useState({
    child_id: "",
    program_id: "",
    level: "",
    location: "",
    start_date: "",
    end_date: "",
    fees_per_term: "",
  });

  const [children, setChildren] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("/children/")
      .then(res => setChildren(res.data))
      .catch(err => console.error("Error fetching children:", err));

    axios.get("/programs/")
      .then(res => setPrograms(res.data))
      .catch(err => console.error("Error fetching programs:", err));
  }, []);

  useEffect(() => {
    if (editingProgram) {
      setFormData({
        child_id: editingProgram.child?.id || "",
        program_id: editingProgram.program?.id || "",
        level: editingProgram.level || "",
        location: editingProgram.location || "",
        start_date: editingProgram.start_date || "",
        end_date: editingProgram.end_date || "",
        fees_per_term: editingProgram.fees_per_term || "",
      });
      setMessage(null);
      setError(null);
    } else {
      setFormData({
        child_id: "",
        program_id: "",
        level: "",
        location: "",
        start_date: "",
        end_date: "",
        fees_per_term: "",
      });
      setMessage(null);
      setError(null);
    }
  }, [editingProgram]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = ["child_id", "program_id"].includes(name) ? parseInt(value) : value;
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      if (editingProgram) {
        await axios.put(`/childprograms/${editingProgram.id}/`, formData);
        setMessage("✅ Child program updated successfully.");
      } else {
        await axios.post("/childprograms/", formData);
        setMessage("✅ Child program created successfully.");
      }

      if (fetchPrograms) fetchPrograms();
      if (setEditingProgram) setEditingProgram(null);

      setFormData({
        child_id: "",
        program_id: "",
        level: "",
        location: "",
        start_date: "",
        end_date: "",
        fees_per_term: "",
      });
    } catch (err) {
      console.error("Form error:", err.response?.data || err.message);
      setError("❌ Failed to save child program. Please check your data.");
    }
  };

  // Role restriction
  if (userRole !== "admin" && userRole !== "manager") {
    return (
      <div className="alert alert-warning p-3">
        <strong>Access Denied:</strong> You do not have permission to {editingProgram ? "edit" : "add"} child programs.
      </div>
    );
  }

  return (
    <div className="container mb-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-primary text-white fw-bold">
          {editingProgram ? "Edit Child Program" : "Add Child Program"}
        </div>
        <div className="card-body">
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Child *</label>
                <select
                  name="child_id"
                  value={formData.child_id}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Child</option>
                  {children.map(child => (
                    <option key={child.id} value={child.id}>
                      {child.first_name} {child.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Program *</label>
                <select
                  name="program_id"
                  value={formData.program_id}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Program</option>
                  {programs.map(program => (
                    <option key={program.id} value={program.id}>
                      {program.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Level *</label>
                <input
                  type="text"
                  name="level"
                  className="form-control"
                  placeholder="e.g. Primary 4"
                  value={formData.level}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Location *</label>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  placeholder="e.g. Kampala"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Start Date *</label>
                <input
                  type="date"
                  name="start_date"
                  className="form-control"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">End Date *</label>
                <input
                  type="date"
                  name="end_date"
                  className="form-control"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Fees per Term (UGX) *</label>
              <input
                type="number"
                name="fees_per_term"
                className="form-control"
                placeholder="e.g. 250000"
                value={formData.fees_per_term}
                onChange={handleChange}
                required
              />
            </div>

            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-success">
                {editingProgram ? "Update Program" : "Create Program"}
              </button>
              {editingProgram && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingProgram(null)}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChildProgramForm;
