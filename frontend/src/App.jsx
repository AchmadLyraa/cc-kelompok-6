import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import FinancePage from "./components/FinancePage";
import LettersPage from "./components/LettersPage";
import AdminPanel from "./components/AdminPanel";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>
    );
  }

  return (
    <Router>
      <div className="App">
        {user && <Header user={user} setUser={setUser} />}
        <Routes>
          <Route
            path="/login"
            element={
              !user ? (
                <LoginPage setUser={setUser} />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              user ? <Dashboard user={user} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/finance"
            element={
              user ? <FinancePage user={user} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/letters"
            element={
              user ? <LettersPage user={user} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin"
            element={
              user && user.role === "ketua" ? (
                <AdminPanel user={user} />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/"
            element={<Navigate to={user ? "/dashboard" : "/login"} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
