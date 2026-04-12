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
  },
  formGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
  },
  th: {
    backgroundColor: "#f5f5f5",
    padding: "12px",
    borderBottom: "2px solid #ddd",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
  },
};

function FinancePage({ user, showToast }) {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expense: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);
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
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.category || !formData.amount || !formData.description) {
        showToast("Semua field harus diisi", "error");
        return;
      }

      if (editingId) {
        await financeAPI.updateTransaction(editingId, {
          ...formData,
          amount: parseFloat(formData.amount),
        });
        showToast("Berhasil update transaksi", "success");
      } else {
        await financeAPI.createTransaction(
          formData.type,
          formData.category,
          parseFloat(formData.amount),
          formData.description
        );
        showToast("Berhasil tambah transaksi", "success");
      }

      setFormData({
        type: "income",
        category: "",
        amount: "",
        description: "",
      });

      setShowForm(false);
      setEditingId(null);
      loadTransactions();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleEditTransaction = (t) => {
    setEditingId(t.id);
    setFormData({
      type: t.type,
      category: t.category,
      amount: t.amount,
      description: t.description,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin hapus data?")) {
      try {
        await financeAPI.deleteTransaction(id);
        showToast("Berhasil hapus transaksi", "success");
        loadTransactions();
      } catch (err) {
        showToast(err.message, "error");
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

      {/* SUMMARY */}
      <div style={{ marginBottom: "20px" }}>
        <p>Total Income: ${summary.total_income}</p>
        <p>Total Expense: ${summary.total_expense}</p>
        <p>Balance: ${summary.balance}</p>
      </div>

      {/* FORM */}
      {showForm && (
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <input
              placeholder="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <input
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              style={styles.input}
            />
          </div>

          <button type="submit">
            {editingId ? "Update" : "Add"}
          </button>
        </form>
      )}

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td style={styles.td}>{t.type}</td>
                <td style={styles.td}>{t.category}</td>
                <td style={styles.td}>${t.amount}</td>
                <td style={styles.td}>{t.description}</td>
                <td style={styles.td}>
                  <button onClick={() => handleEditTransaction(t)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(t.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FinancePage;