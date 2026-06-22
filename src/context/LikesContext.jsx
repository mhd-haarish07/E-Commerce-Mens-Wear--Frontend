import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const LikesContext = createContext();

export const LikesProvider = ({ children }) => {
  const { user } = useAuth();
  const storageKey = user ? `tn91_likes_${user.id}` : "tn91_likes_guest";

  const [likes, setLikes] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey)) || []; }
    catch { return []; }
  });

  // reload likes when user changes (login/logout)
  useEffect(() => {
    try { setLikes(JSON.parse(localStorage.getItem(storageKey)) || []); }
    catch { setLikes([]); }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(likes));
  }, [likes, storageKey]);

  const toggleLike = (productId) => {
    setLikes((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isLiked = (productId) => likes.includes(productId);

  return (
    <LikesContext.Provider value={{ likes, toggleLike, isLiked }}>
      {children}
    </LikesContext.Provider>
  );
};

export const useLikes = () => useContext(LikesContext);
