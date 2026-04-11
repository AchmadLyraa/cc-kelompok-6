import { useNavigate } from "react-router-dom";

export default function Header({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <h1 style={styles.title}>Organization Management</h1>
          {user && (
            <nav style={styles.nav}>
              <button
                style={styles.navBtn}
                onClick={() => handleNavClick("/dashboard")}
              >
                Dashboard
              </button>
              {(user.role === "bendahara" || user.role === "ketua") && (
                <button
                  style={styles.navBtn}
                  onClick={() => handleNavClick("/finance")}
                >
                  Finance
                </button>
              )}
              {(user.role === "sekretaris" || user.role === "ketua") && (
                <button
                  style={styles.navBtn}
                  onClick={() => handleNavClick("/letters")}
                >
                  Letters
                </button>
              )}
              {user.role === "ketua" && (
                <button
                  style={styles.navBtn}
                  onClick={() => handleNavClick("/admin")}
                >
                  Admin
                </button>
              )}
            </nav>
          )}
        </div>
        {user && (
          <div style={styles.userInfo}>
            <div style={styles.userDetails}>
              <div style={styles.userName}>{user.full_name}</div>
              <div style={styles.userRole}>{user.role.toUpperCase()}</div>
            </div>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: "#2c3e50",
    color: "white",
    padding: "15px 0",
    marginBottom: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
    flex: 1,
  },
  title: {
    margin: 0,
    fontSize: "22px",
    whiteSpace: "nowrap",
  },
  nav: {
    display: "flex",
    gap: "0",
    margin: 0,
    padding: 0,
  },
  navBtn: {
    backgroundColor: "transparent",
    color: "white",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.3s",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  userDetails: {
    textAlign: "right",
  },
  userName: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  userRole: {
    fontSize: "12px",
    color: "#bdc3c7",
    marginTop: "2px",
  },
  logoutBtn: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
};
