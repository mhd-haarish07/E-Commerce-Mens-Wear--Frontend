import { Routes, Route } from "react-router-dom";
import Home          from "./pages/Home";
import Shop          from "./pages/Shop";
import Contact       from "./pages/Contact";
import SingleProduct from "./pages/Singleproduct";
import Cart          from "./pages/Cart";
import Checkout      from "./pages/Checkout";
import Login         from "./pages/Login";
import Register      from "./pages/Register";
import Profile       from "./pages/Profile";
import Admin         from "./pages/Admin";
import NotFound      from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/"            element={<Home />} />
      <Route path="/shop"        element={<Shop />} />
      <Route path="/contact"     element={<Contact />} />
      <Route path="/product/:id" element={<SingleProduct />} />
      <Route path="/cart"        element={<Cart />} />
      <Route path="/checkout"    element={<Checkout />} />
      <Route path="/login"       element={<Login />} />
      <Route path="/register"    element={<Register />} />
      <Route path="/profile"     element={<Profile />} />
      <Route path="/admin"       element={<Admin />} />
      <Route path="*"            element={<NotFound />} />
    </Routes>
  );
}

export default App;
