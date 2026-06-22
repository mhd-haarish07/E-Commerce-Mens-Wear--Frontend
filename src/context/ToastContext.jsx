import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();
let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success", duration = 3000) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item toast-${t.type}`} onClick={() => removeToast(t.id)}>
            <i className={
              t.type === "success" ? "fas fa-check-circle" :
              t.type === "error"   ? "fas fa-times-circle"  :
              t.type === "warning" ? "fas fa-exclamation-triangle" :
              "fas fa-info-circle"
            }></i>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
