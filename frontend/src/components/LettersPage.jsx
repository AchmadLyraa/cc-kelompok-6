import { useState, useEffect } from "react";
import { letterAPI } from "../services/api";

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
    backgroundColor: "#FF9800",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
  filters: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  filterButton: {
    padding: "8px 16px",
    border: "2px solid #ddd",
    backgroundColor: "white",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
  filterButtonActive: {
    borderColor: "#FF9800",
    color: "#FF9800",
    backgroundColor: "#fff3e0",
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
  textarea: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    boxSizing: "border-box",
    minHeight: "150px",
    fontFamily: "Arial",
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
  letterCard: {
    backgroundColor: "white",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "15px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  letterHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    marginBottom: "12px",
  },
  letterTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
  },
  status: {
    padding: "4px 12px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  statusDraft: {
    backgroundColor: "#e0e0e0",
    color: "#333",
  },
  statusSubmitted: {
    backgroundColor: "#fff3e0",
    color: "#e65100",
  },
  statusApproved: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
  },
  statusRejected: {
    backgroundColor: "#ffebee",
    color: "#c62828",
  },
  letterType: {
    fontSize: "12px",
    color: "#999",
    marginBottom: "8px",
  },
  letterContent: {
    color: "#666",
    lineHeight: "1.6",
    marginBottom: "12px",
  },
  letterDate: {
    fontSize: "12px",
    color: "#999",
    marginBottom: "12px",
  },
  actions: {
    display: "flex",
    gap: "10px",
  },
  actionButton: {
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "bold",
  },
  submitButtonSmall: {
    backgroundColor: "#4CAF50",
    color: "white",
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

function LettersPage({ user }) {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    letterType: "",
    content: "",
  });

  const canCreate = user.role === "sekretaris" || user.role === "ketua";

  useEffect(() => {
    loadLetters();
  }, [statusFilter]);

  const loadLetters = async () => {
    try {
      setLoading(true);
      const data = await letterAPI.getLetters(statusFilter);
      setLetters(data);
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
      if (!formData.title || !formData.letterType || !formData.content) {
        setError("All fields are required");
        return;
      }

      if (editingId) {
        // Edit mode
        await letterAPI.updateLetter(editingId, {
          title: formData.title,
          letter_type: formData.letterType,
          content: formData.content,
        });
        setSuccess("Letter updated successfully");
      } else {
        // Create mode
        await letterAPI.createLetter(
          formData.title,
          formData.letterType,
          formData.content,
        );
        setSuccess("Letter created successfully");
      }

      setFormData({
        title: "",
        letterType: "",
        content: "",
      });
      setShowForm(false);
      setEditingId(null);
      setTimeout(() => setSuccess(null), 3000);
      loadLetters();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditLetter = (letter) => {
    setEditingId(letter.id);
    setFormData({
      title: letter.title,
      letterType: letter.letter_type,
      content: letter.content,
    });
    setShowForm(true);
    setError(null);
  };

  const handleApproveLetter = async (id) => {
    try {
      await letterAPI.approveLetter(id);
      setSuccess("Letter approved successfully");
      setTimeout(() => setSuccess(null), 3000);
      loadLetters();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRejectLetter = async (id) => {
    try {
      await letterAPI.rejectLetter(id);
      setSuccess("Letter rejected successfully");
      setTimeout(() => setSuccess(null), 3000);
      loadLetters();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmitLetter = async (id) => {
    try {
      await letterAPI.submitLetter(id);
      setSuccess("Letter submitted successfully");
      setTimeout(() => setSuccess(null), 3000);
      loadLetters();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this letter?")) {
      try {
        await letterAPI.deleteLetter(id);
        setSuccess("Letter deleted successfully");
        setTimeout(() => setSuccess(null), 3000);
        loadLetters();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "draft":
        return styles.statusDraft;
      case "submitted":
        return styles.statusSubmitted;
      case "approved":
        return styles.statusApproved;
      case "rejected":
        return styles.statusRejected;
      default:
        return styles.statusDraft;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Letters Management</h2>
        {canCreate && (
          <button style={styles.button} onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Create Letter"}
          </button>
        )}
      </div>

      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      <div style={styles.filters}>
        <button
          style={{
            ...styles.filterButton,
            ...(statusFilter === null ? styles.filterButtonActive : {}),
          }}
          onClick={() => setStatusFilter(null)}
        >
          All
        </button>
        <button
          style={{
            ...styles.filterButton,
            ...(statusFilter === "draft" ? styles.filterButtonActive : {}),
          }}
          onClick={() => setStatusFilter("draft")}
        >
          Draft
        </button>
        <button
          style={{
            ...styles.filterButton,
            ...(statusFilter === "submitted" ? styles.filterButtonActive : {}),
          }}
          onClick={() => setStatusFilter("submitted")}
        >
          Submitted
        </button>
        <button
          style={{
            ...styles.filterButton,
            ...(statusFilter === "approved" ? styles.filterButtonActive : {}),
          }}
          onClick={() => setStatusFilter("approved")}
        >
          Approved
        </button>
        <button
          style={{
            ...styles.filterButton,
            ...(statusFilter === "rejected" ? styles.filterButtonActive : {}),
          }}
          onClick={() => setStatusFilter("rejected")}
        >
          Rejected
        </button>
      </div>

      {canCreate && showForm && (
        <form
          style={{ ...styles.form, ...styles.formActive }}
          onSubmit={handleSubmit}
        >
          <div style={styles.formGroup}>
            <label style={styles.label}>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Letter Type</label>
            <select
              name="letterType"
              value={formData.letterType}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="">Select Type</option>
              <option value="leave">Leave Request</option>
              <option value="promotion">Promotion Request</option>
              <option value="complaint">Complaint</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              style={styles.textarea}
              required
            />
          </div>

          <button type="submit" style={styles.submitButton}>
            {editingId ? "Update Letter" : "Create Letter"}
          </button>
          <button
            type="button"
            style={styles.cancelButton}
            onClick={() => {
              setShowForm(false);
              setEditingId(null);
              setFormData({
                title: "",
                letterType: "",
                content: "",
              });
            }}
          >
            Cancel
          </button>
        </form>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : letters.length === 0 ? (
        <div style={{ textAlign: "center", color: "#999", padding: "40px" }}>
          No letters found
        </div>
      ) : (
        letters.map((letter) => (
          <div key={letter.id} style={styles.letterCard}>
            <div style={styles.letterHeader}>
              <div>
                <div style={styles.letterTitle}>{letter.title}</div>
                <div style={styles.letterType}>Type: {letter.letter_type}</div>
              </div>
              <div
                style={{ ...styles.status, ...getStatusStyle(letter.status) }}
              >
                {letter.status.toUpperCase()}
              </div>
            </div>
            <div style={styles.letterContent}>{letter.content}</div>
            <div style={styles.letterDate}>
              Created: {new Date(letter.created_at).toLocaleDateString()}
            </div>
            {canCreate && letter.status === "draft" && (
              <div style={styles.actions}>
                <button
                  style={{
                    ...styles.actionButton,
                    backgroundColor: "#FF9800",
                    color: "white",
                  }}
                  onClick={() => handleEditLetter(letter)}
                >
                  Edit
                </button>
                <button
                  style={{
                    ...styles.actionButton,
                    ...styles.submitButtonSmall,
                  }}
                  onClick={() => handleSubmitLetter(letter.id)}
                >
                  Submit
                </button>
                <button
                  style={{ ...styles.actionButton, ...styles.deleteButton }}
                  onClick={() => handleDelete(letter.id)}
                >
                  Delete
                </button>
              </div>
            )}
            {canCreate && letter.status === "submitted" && (
              <div style={styles.actions}>
                <button
                  style={{
                    ...styles.actionButton,
                    backgroundColor: "#4CAF50",
                    color: "white",
                  }}
                  onClick={() => handleApproveLetter(letter.id)}
                >
                  Approve
                </button>
                <button
                  style={{
                    ...styles.actionButton,
                    backgroundColor: "#f44336",
                    color: "white",
                  }}
                  onClick={() => handleRejectLetter(letter.id)}
                >
                  Reject
                </button>
                <button
                  style={{ ...styles.actionButton, ...styles.deleteButton }}
                  onClick={() => handleDelete(letter.id)}
                >
                  Delete
                </button>
              </div>
            )}
            {canCreate &&
              letter.status !== "draft" &&
              letter.status !== "submitted" && (
                <div style={styles.actions}>
                  <button
                    style={{ ...styles.actionButton, ...styles.deleteButton }}
                    onClick={() => handleDelete(letter.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
          </div>
        ))
      )}
    </div>
  );
}

export default LettersPage;
