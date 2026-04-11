import { useState, useEffect } from "react";
import { financeAPI } from "../services/api";

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
    backgroundColor: "#2196F3",
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

function FinancePage({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expense: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: "income",
    category: "",
    amount: "",
    description: "",
  });

  const canCreate = user.role === "bendahara" || user.role === "ketua";

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const transData = await financeAPI.getTransactions();
      const summaryData = await financeAPI.getSummary();
      setTransactions(transData);
      setSummary(summaryData);
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
      if (!formData.category || !formData.amount || !formData.description) {
        setError("All fields are required");
        return;
      }

      if (editingId) {
        // Edit mode
        await financeAPI.updateTransaction(editingId, {
          type: formData.type,
          category: formData.category,
          amount: parseFloat(formData.amount),
          description: formData.description,
        });
        setSuccess("Transaction updated successfully");
      } else {
        // Create mode
        await financeAPI.createTransaction(
          formData.type,
          formData.category,
          parseFloat(formData.amount),
          formData.description,
        );
        setSuccess("Transaction added successfully");
      }

      setFormData({
        type: "income",
        category: "",
        amount: "",
        description: "",
      });
      setShowForm(false);
      setEditingId(null);
      setTimeout(() => setSuccess(null), 3000);
      loadTransactions();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingId(transaction.id);
    setFormData({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      description: transaction.description,
    });
    setShowForm(true);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await financeAPI.deleteTransaction(id);
        setSuccess("Transaction deleted successfully");
        setTimeout(() => setSuccess(null), 3000);
        loadTransactions();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Finance Management</h2>
        {canCreate && (
          <button style={styles.button} onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Add Transaction"}
          </button>
        )}
      </div>

      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      <div
        style={{
          display: "flex",
          gap: "30px",
          marginBottom: "30px",
          padding: "20px",
          backgroundColor: "#f0f7ff",
          borderRadius: "8px",
          borderLeft: "4px solid #2196F3",
        }}
      >
        <div>
          <div style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>
            Total Income
          </div>
          <div
            style={{ fontSize: "24px", fontWeight: "bold", color: "#4CAF50" }}
          >
            ${summary.total_income.toFixed(2)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>
            Total Expense
          </div>
          <div
            style={{ fontSize: "24px", fontWeight: "bold", color: "#f44336" }}
          >
            ${summary.total_expense.toFixed(2)}
          </div>
        </div>
        <div style={{ borderLeft: "2px solid #ddd", paddingLeft: "30px" }}>
          <div style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>
            Balance
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: summary.balance >= 0 ? "#4CAF50" : "#f44336",
            }}
          >
            ${summary.balance.toFixed(2)}
          </div>
        </div>
      </div>

      {canCreate && showForm && (
        <form
          style={{ ...styles.form, ...styles.formActive }}
          onSubmit={handleSubmit}
        >
          <div style={styles.formGroup}>
            <label style={styles.label}>Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="">Select Category</option>
              <option value="Salary">Salary</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Utilities">Utilities</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              style={styles.input}
              required
              step="0.01"
              min="0"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.submitButton}>
            {editingId ? "Update Transaction" : "Add Transaction"}
          </button>
          {editingId && (
            <button
              type="button"
              style={styles.cancelButton}
              onClick={() => {
                setEditingId(null);
                setShowForm(false);
                setFormData({
                  type: "income",
                  category: "",
                  amount: "",
                  description: "",
                });
              }}
            >
              Cancel Edit
            </button>
          )}
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
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Date</th>
              {canCreate && <th style={styles.th}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td style={styles.td}>
                  <span
                    style={{
                      color:
                        transaction.type === "income" ? "#4CAF50" : "#f44336",
                      fontWeight: "bold",
                    }}
                  >
                    {transaction.type === "income" ? "+" : "-"}{" "}
                    {transaction.type}
                  </span>
                </td>
                <td style={styles.td}>{transaction.category}</td>
                <td style={styles.td}>${transaction.amount.toFixed(2)}</td>
                <td style={styles.td}>{transaction.description}</td>
                <td style={styles.td}>
                  {new Date(transaction.created_at).toLocaleDateString()}
                </td>
                {canCreate && (
                  <td style={styles.td}>
                    <button
                      style={{
                        ...styles.actionButton,
                        backgroundColor: "#FF9800",
                        color: "white",
                      }}
                      onClick={() => handleEditTransaction(transaction)}
                    >
                      Edit
                    </button>
                    <button
                      style={{ ...styles.actionButton, ...styles.deleteButton }}
                      onClick={() => handleDelete(transaction.id)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FinancePage;
