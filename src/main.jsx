import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { LikesProvider } from "./context/LikesContext";
import { StockProvider } from "./context/StockContext";
import { ToastProvider } from "./context/ToastContext";
import "./index.css";
import "./css/style.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <StockProvider>
            <LikesProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </LikesProvider>
          </StockProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
