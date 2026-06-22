# TN91 SILKS & READYMADES — Fullstack Ecommerce

## Project Structure
```
menswear-fullstack/
├── src/                  ← React frontend
│   ├── components/       ← Navbar, Footer, StarRating, ReviewSection
│   ├── context/          ← CartContext, AuthContext
│   ├── data/             ← products.js
│   ├── pages/            ← Home, Shop, Cart, SingleProduct, Contact, Login, Register, Profile
│   └── css/style.css
├── backend/              ← Node.js + Express + MongoDB
│   ├── models/           ← User, Review, Order
│   ├── routes/           ← auth, reviews, orders
│   ├── middleware/        ← auth.js (JWT)
│   └── server.js
└── package.json

## Quick Start

### 1. Frontend
npm install
npm run dev
→ http://localhost:5173

### 2. Backend
cd backend
cp .env.example .env      ← add your MONGO_URI
npm install
npm run dev
→ http://localhost:5000

## Features
✅ Login / Register with JWT
✅ User avatar dropdown in navbar
✅ Dynamic star ratings from real reviews
✅ Write, view, delete reviews (per product)
✅ Working cart with qty controls, coupons, order summary
✅ Profile page with orders & password change
✅ Shop with search + category filter
✅ Responsive design
