import { useState, useEffect } from "react";
import { userAPI } from "../services/api";

const formatDate = (dateString) => {
  try {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    // Cek jika date invalid
    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return "N/A";
  }
};

const styles = {
  container: {
    maxWidth: "1100px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "'Inter', system-ui, sans-serif",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#1e293b",
    margin: 0,
    letterSpacing: "-0.025em",
  },
  // --- FILTER BAR FIXED ---
  filterBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    alignItems: "center",
    marginBottom: "24px",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
  },
  filterInput: {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    flex: "2",
    minWidth: "250px",
    outline: "none",
    backgroundColor: "#ffffff", // Pastikan putih
    color: "#1e293b", // Pastikan teks gelap
    transition: "border-color 0.2s",
  },
  filterSelect: {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    backgroundColor: "#ffffff",
    color: "#1e293b",
    cursor: "pointer",
    flex: "1",
    minWidth: "160px",
    outline: "none",
  },
  resetButton: {
    padding: "10px 20px",
    backgroundColor: "#f1f5f9",
    color: "#475569",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "background 0.2s",
  },
  // --- END FILTER BAR ---
  button: {
    padding: "12px 24px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.3)",
  },
  tableCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    backgroundColor: "#f8fafc",
    padding: "16px",
    textAlign: "left",
    fontWeight: "600",
    color: "#64748b",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px solid #e2e8f0",
  },
  td: {
    padding: "20px 16px",
    borderBottom: "1px solid #f1f5f9",
    color: "#334155",
    fontSize: "14px",
  },
  roleBadge: {
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "700",
    display: "inline-block",
    letterSpacing: "0.025em",
  },
  roleKetua: { backgroundColor: "#fef3c7", color: "#92400e" },
  roleBendahara: { backgroundColor: "#dcfce7", color: "#166534" },
  roleSekretaris: { backgroundColor: "#e0e7ff", color: "#3730a3" },
  roleAnggota: { backgroundColor: "#f1f5f9", color: "#475569" },
  deleteButton: {
    padding: "6px 14px",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },
};

function AdminPanel({ user }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getAllUsers();
      setUsers(data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus user?")) {
      try {
        await userAPI.deleteUser(id);
        loadUsers();
      } catch (err) { alert(err.message); }
    }
  };

  const getRoleStyle = (role) => {
    switch (role?.toLowerCase()) {
      case "ketua": return styles.roleKetua;
      case "bendahara": return styles.roleBendahara;
      case "sekretaris": return styles.roleSekretaris;
      default: return styles.roleAnggota;
    }
  };

  // LOGIKA DUAL FILTER: Nama DAN Role
  const filteredUsers = users.filter((u) => {
    const nameMatch = u.full_name.toLowerCase().includes(searchName.toLowerCase());
    const roleMatch = filterRole === "all" || u.role.toLowerCase() === filterRole.toLowerCase();
    return nameMatch && roleMatch; // Harus kena dua-duanya
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>User Management</h2>
        <button style={styles.button}>+ Create User</button>
      </div>

      {/* FILTER BAR - SEKARANG JELAS & TERANG */}
      <div style={styles.filterBar}>
        <input 
          type="text" 
          placeholder="Cari berdasarkan nama..." 
          style={styles.filterInput}
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <select 
          style={styles.filterSelect}
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">Semua Jabatan</option>
          <option value="ketua">Ketua</option>
          <option value="bendahara">Bendahara</option>
          <option value="sekretaris">Sekretaris</option>
          <option value="anggota">Anggota</option>
        </select>
        
        {(searchName !== "" || filterRole !== "all") && (
          <button 
            style={styles.resetButton} 
            onClick={() => {setSearchName(""); setFilterRole("all");}}
          >
            Reset
          </button>
        )}

        <div style={{ marginLeft: "auto", color: "#64748b", fontSize: "14px", fontWeight: "500" }}>
          {filteredUsers.length} Anggota ditemukan
        </div>
      </div>

      <div style={styles.tableCard}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Full Name</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Created At</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td style={styles.td}>{u.email}</td>
                  <td style={{ ...styles.td, fontWeight: "600", color: "#1e293b" }}>{u.full_name}</td>
                  <td style={styles.td}>
                    <div style={{ ...styles.roleBadge, ...getRoleStyle(u.role) }}>
                      {u.role.toUpperCase()}
                    </div>
                  </td>
                  <td style={styles.td}>{formatDate(u.created_at)}</td>
                  <td style={{ ...styles.td, textAlign: "right" }}>
                    {u.role !== "ketua" ? (
                      <button style={styles.deleteButton} onClick={() => handleDelete(u.id)}>Delete</button>
                    ) : (
                      <span style={{ fontSize: "12px", color: "#cbd5e1", fontStyle: "italic" }}>Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;