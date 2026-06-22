import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const StockContext = createContext();
const API = "http://localhost:5000/api";

export const StockProvider = ({ children }) => {
  const { authFetch } = useAuth();
  const [stockMap, setStockMap] = useState({});
  const [loaded, setLoaded] = useState(false);

  const loadStock = useCallback(async () => {
    try {
      const r = await fetch(`${API}/stock`);
      const d = await r.json();
      setStockMap(d.stock || {});
    } catch {
      /* network/back-end down — fall back to static stock */
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => { loadStock(); }, [loadStock]);

  // Resolve a product's stock: live DB value if present, else its static fallback
  const getStock = useCallback(
    (productId, fallback = 99) => {
      const v = stockMap[productId];
      return v === undefined ? fallback : v;
    },
    [stockMap]
  );

  // Admin: set one product's stock
  const setStock = useCallback(
    async (productId, stock) => {
      const r = await authFetch(`/stock/${productId}`, {
        method: "PUT",
        body: JSON.stringify({ stock }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "Update failed");
      setStockMap((prev) => ({ ...prev, [productId]: d.stock.stock }));
      return d.stock.stock;
    },
    [authFetch]
  );

  // Admin: push a full catalog of {productId, stock} into the DB (one-time init)
  const seedStock = useCallback(
    async (items, overwrite = false) => {
      const r = await authFetch(`/stock/seed`, {
        method: "POST",
        body: JSON.stringify({ items, overwrite }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "Seed failed");
      setStockMap(d.stock || {});
      return d;
    },
    [authFetch]
  );

  return (
    <StockContext.Provider value={{ stockMap, loaded, getStock, setStock, seedStock, loadStock }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => useContext(StockContext);
