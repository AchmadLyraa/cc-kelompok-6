import { useNavigate } from "react-router-dom";

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  header: {
    marginBottom: "40px",
    textAlign: "center",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
  },
  subtitle: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "20px",
  },
  roleInfo: {
    backgroundColor: "#e3f2fd",
    padding: "12px 16px",
    borderRadius: "4px",
    display: "inline-block",
    color: "#1976d2",
    fontWeight: "bold",
    marginBottom: "30px",
  },
  menuGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "30px",
  },
  menuCard: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "30px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  menuCardHover: {
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transform: "translateY(-2px)",
  },
  icon: {
    fontSize: "40px",
    marginBottom: "15px",
    display: "block",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "8px",
    color: "#333",
  },
  cardDescription: {
    fontSize: "14px",
    color: "#666",
  },
  disabledCard: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
};

function Dashboard({ user }) {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };

  const canAccessFinance = user.role === "bendahara" || user.role === "ketua";
  const canAccessLetters = user.role === "sekretaris" || user.role === "ketua";
  const canAccessAdmin = user.role === "ketua";

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Organization Management System</h1>
        <p style={styles.subtitle}>Welcome back, {user.full_name}!</p>
        <div style={styles.roleInfo}>Role: {user.role.toUpperCase()}</div>
      </div>

      <div style={styles.menuGrid}>
        {/* Finance Card */}
        <div
          style={{
            ...styles.menuCard,
            ...(canAccessFinance ? styles.menuCardHover : styles.disabledCard),
            opacity: 1,
          }}
          onClick={() => canAccessFinance && handleCardClick("/finance")}
          onMouseEnter={(e) =>
            canAccessFinance &&
            Object.assign(e.currentTarget.style, styles.menuCardHover)
          }
          onMouseLeave={(e) =>
            Object.assign(e.currentTarget.style, {
              boxShadow: "none",
              transform: "none",
            })
          }
        >
          <span style={styles.icon}>💰</span>
          <div style={styles.cardTitle}>Finance Management</div>
          <div style={styles.cardDescription}>
            {user.role === "bendahara"
              ? "Manage transactions"
              : user.role === "ketua"
                ? "View & manage transactions"
                : "View transactions"}
          </div>
        </div>

        {/* Letters Card */}
        <div
          style={{
            ...styles.menuCard,
            ...(canAccessLetters ? styles.menuCardHover : styles.disabledCard),
            opacity: 1,
          }}
          onClick={() => canAccessLetters && handleCardClick("/letters")}
          onMouseEnter={(e) =>
            canAccessLetters &&
            Object.assign(e.currentTarget.style, styles.menuCardHover)
          }
          onMouseLeave={(e) =>
            Object.assign(e.currentTarget.style, {
              boxShadow: "none",
              transform: "none",
            })
          }
        >
          <span style={styles.icon}>📝</span>
          <div style={styles.cardTitle}>Letters Management</div>
          <div style={styles.cardDescription}>
            {user.role === "sekretaris"
              ? "Manage letters"
              : user.role === "ketua"
                ? "View & manage letters"
                : "View letters"}
          </div>
        </div>

        {/* Admin Panel Card (Ketua only) */}
        {canAccessAdmin && (
          <div
            style={{
              ...styles.menuCard,
              ...styles.menuCardHover,
            }}
            onClick={() => handleCardClick("/admin")}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, styles.menuCardHover)
            }
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, {
                boxShadow: "none",
                transform: "none",
              })
            }
          >
            <span style={styles.icon}>👥</span>
            <div style={styles.cardTitle}>Admin Panel</div>
            <div style={styles.cardDescription}>Manage users & roles</div>
          </div>
        )}

        {/* Info Card */}
        <div
          style={{
            ...styles.menuCard,
            backgroundColor: "#f5f5f5",
          }}
        >
          <span style={styles.icon}>ℹ️</span>
          <div style={styles.cardTitle}>System Info</div>
          <div style={styles.cardDescription}>
            {user.role === "ketua"
              ? "Full system access"
              : user.role === "bendahara"
                ? "Finance management access"
                : user.role === "sekretaris"
                  ? "Letter management access"
                  : "Read-only access"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
