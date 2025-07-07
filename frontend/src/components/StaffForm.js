import React, { useState, useEffect } from "react";
import axios from "../utils/axios";
import { useNavigate, useParams } from "react-router-dom";

const StaffForm = ({ mode = "add" }) => {
  const [staffData, setStaffData] = useState({
    name_id: "",
    username: "",
    email: "",
    phone: "",
    groups: [],  // Changed from 'role' to 'groups'
    is_volunteer: false,
    position: ""
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch staff for edit
  useEffect(() => {
    if (mode === "edit" && id) {
      setLoading(true);
      axios.get(`/staffs/${id}/`)
        .then(res => {
          const data = res.data;
          setStaffData({
            name_id: data.name_id || "",
            username: data.username || "",
            email: data.email || "",
            phone: data.phone || "",
            groups: data.groups || [],
            is_volunteer: data.is_volunteer || false,
            position: data.position || "",
          });
        })
        .catch(err => {
          console.error("Error fetching staff:", err);
          alert("Failed to load staff data");
          navigate("/staff");
        })
        .finally(() => setLoading(false));
    }
  }, [mode, id, navigate]);

  // Fetch users (for 'add' mode)
  useEffect(() => {
    if (mode === "add") {
      Promise.all([
        axios.get("/users/"),
        axios.get("/staffs/")
      ])
      .then(([usersRes, staffsRes]) => {
        const staffUserIds = new Set(staffsRes.data.map(s => s.name_id));
        const availableUsers = usersRes.data.filter(u => !staffUserIds.has(u.id));
        setUsers(availableUsers);
      })
      .catch(err => {
        console.error("Error fetching users/staffs:", err);
        setUsers([]);
      });
    }
  }, [mode]);

  useEffect(() => {
    if (staffData.name_id) {
      const user = users.find(u => String(u.id) === String(staffData.name_id));
      if (user) {
        setStaffData(prev => ({ ...prev, username: user.username, email: user.email }));
      }
    }
  }, [staffData.name_id, users]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "groups") {
      setStaffData(prev => ({ ...prev, groups: [value] })); // store group as array
    } else {
      setStaffData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name_id: staffData.name_id,
      phone: staffData.phone,
      groups: staffData.groups,
      is_volunteer: staffData.is_volunteer,
      position: staffData.position,
    };

    const request = mode === "add"
      ? axios.post("/staffs/", payload)
      : axios.put(`/staffs/${id}/`, payload);

    request
      .then(() => {
        alert(mode === "add" ? "Staff added successfully" : "Staff updated successfully");
        navigate("/staff");
      })
      .catch(err => {
        console.error(`Error ${mode === "add" ? "adding" : "updating"} staff:`, err);
        alert(`Failed to ${mode === "add" ? "add" : "update"} staff`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="container">
      <h2>{mode === "add" ? "Add Staff" : "Edit Staff"}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {mode === "add" ? (
            <div className="mb-3">
              <label className="form-label">Select User</label>
              <select
                name="name_id"
                value={staffData.name_id}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">-- Select a User --</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.username} ({u.email})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input className="form-control" value={staffData.username} readOnly />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input className="form-control" value={staffData.email} readOnly />
              </div>
            </>
          )}

          <div className="mb-3">
            <label className="form-label">Position</label>
            <input
              name="position"
              value={staffData.position}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Role (Group)</label>
            <select
              name="groups"
              value={staffData.groups[0] || ""}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">-- Select Role --</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              name="is_volunteer"
              checked={staffData.is_volunteer}
              onChange={handleChange}
              className="form-check-input"
            />
            <label className="form-check-label">Is Volunteer</label>
          </div>

          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              name="phone"
              value={staffData.phone}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : mode === "add" ? "Add Staff" : "Update Staff"}
          </button>
        </form>
      )}
    </div>
  );
};

export default StaffForm;
