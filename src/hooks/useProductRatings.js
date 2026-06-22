import { useState, useEffect } from "react";

const API = "http://localhost:5000/api";
const cache = {};

export const useProductRating = (productId) => {
  const [rating, setRating] = useState(0);
  const [total,  setTotal]  = useState(0);

  useEffect(() => {
    if (!productId) return;
    if (cache[productId] !== undefined) {
      setRating(cache[productId].avg);
      setTotal(cache[productId].total);
      return;
    }
    fetch(`${API}/reviews/${productId}`)
      .then((r) => r.json())
      .then((d) => {
        const avg = d.avgRating || 0;
        const tot = d.total    || 0;
        cache[productId] = { avg, total: tot };
        setRating(avg);
        setTotal(tot);
      })
      .catch(() => {});
  }, [productId]);

  return { rating, total };
};
