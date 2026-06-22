import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const API = "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [token, setToken]   = useState(() => localStorage.getItem("tn91_token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then((d) => { if (d.user) setUser(d.user); else logout(); })
        .catch(logout)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const r = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    localStorage.setItem("tn91_token", d.token);
    setToken(d.token);
    setUser(d.user);
    return d.user;
  };

  const register = async (name, email, password) => {
    const r = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    localStorage.setItem("tn91_token", d.token);
    setToken(d.token);
    setUser(d.user);
    return d.user;
  };

  const logout = () => {
    localStorage.removeItem("tn91_token");
    setToken(null);
    setUser(null);
  };

  const authFetch = (url, opts = {}) =>
    fetch(`${API}${url}`, {
      ...opts,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...opts.headers },
    });

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, authFetch, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
