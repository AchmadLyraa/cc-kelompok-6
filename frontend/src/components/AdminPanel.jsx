import { useState, useEffect } from "react";
import { userAPI } from "../services/api";

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return dateString || "N/A";
  }
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
  form: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "30px",
    display: "none",
  },
  formActive: {
    display: "block",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    marginRight: "10px",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  th: {
    backgroundColor: "#f5f5f5",
    padding: "12px",
    textAlign: "left",
    fontWeight: "bold",
    borderBottom: "2px solid #ddd",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
  },
  roleBadge: {
    padding: "4px 12px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "bold",
    display: "inline-block",
  },
  roleKetua: {
    backgroundColor: "#e3f2fd",
    color: "#1976d2",
  },
  roleBendahara: {
    backgroundColor: "#f3e5f5",
    color: "#7b1fa2",
  },
  roleSekretaris: {
    backgroundColor: "#ede7f6",
    color: "#512da8",
  },
  roleAnggota: {
    backgroundColor: "#e8f5e9",
    color: "#388e3c",
  },
  actionButton: {
    padding: "6px 12px",
    margin: "0 5px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    color: "white",
  },
  error: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    padding: "12px",
    borderRadius: "4px",
    marginBottom: "20px",
  },
  success: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    padding: "12px",
    borderRadius: "4px",
    marginBottom: "20px",
  },
};

function AdminPanel({ user }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "anggota",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getAllUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.email || !formData.password || !formData.full_name) {
        setError("All fields are required");
        return;
      }

      await userAPI.createUser(
        formData.email,
        formData.password,
        formData.full_name,
        formData.role,
      );

      setFormData({
        email: "",
        password: "",
        full_name: "",
        role: "anggota",
      });
      setShowForm(false);
      setSuccess("User created successfully");
      setTimeout(() => setSuccess(null), 3000);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await userAPI.deleteUser(id);
        setSuccess("User deleted successfully");
        setTimeout(() => setSuccess(null), 3000);
        loadUsers();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case "ketua":
        return styles.roleKetua;
      case "bendahara":
        return styles.roleBendahara;
      case "sekretaris":
        return styles.roleSekretaris;
      case "anggota":
        return styles.roleAnggota;
      default:
        return {};
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Admin Panel - User Management</h2>
        <button style={styles.button} onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Create User"}
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      {showForm && (
        <form
          style={{ ...styles.form, ...styles.formActive }}
          onSubmit={handleSubmit}
        >
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
              placeholder="Min 8 chars, 1 uppercase, 1 lowercase, 1 digit"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="anggota">Anggota</option>
              <option value="bendahara">Bendahara</option>
              <option value="sekretaris">Sekretaris</option>
            </select>
          </div>

          <button type="submit" style={styles.submitButton}>
            Create User
          </button>
          <button
            type="button"
            style={styles.cancelButton}
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
        </form>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Full Name</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Created At</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={styles.td}>{u.email}</td>
                <td style={styles.td}>{u.full_name}</td>
                <td style={styles.td}>
                  <div
                    style={{
                      ...styles.roleBadge,
                      ...getRoleBadgeStyle(u.role),
                    }}
                  >
                    {u.role.toUpperCase()}
                  </div>
                </td>
                <td style={styles.td}>{formatDate(u.created_at)}</td>
                <td style={styles.td}>
                  {u.id !== user.id && u.role !== "ketua" && (
                    <button
                      style={{ ...styles.actionButton, ...styles.deleteButton }}
                      onClick={() => handleDelete(u.id)}
                    >
                      Delete
                    </button>
                  )}
                  {u.role === "ketua" && (
                    <span style={{ fontSize: "12px", color: "#999" }}>
                      Protected
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPanel;
