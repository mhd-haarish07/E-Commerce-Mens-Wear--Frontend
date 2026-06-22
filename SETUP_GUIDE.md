# ✅ TN91 FULLSTACK SETUP GUIDE
# Follow these steps exactly — takes about 10 minutes

═══════════════════════════════════════
 PART 1 — MONGODB DATABASE SETUP (FREE)
═══════════════════════════════════════

Step 1: Create Free MongoDB Atlas Account
  → Go to: https://cloud.mongodb.com
  → Click "Try Free" → Sign up with Google or email

Step 2: Create a Cluster
  → Click "Build a Database"
  → Choose "M0 FREE" (the free tier)
  → Select a region close to you (e.g. Mumbai)
  → Click "Create"

Step 3: Create Database User
  → Under "Security" → "Database Access" → "Add New Database User"
  → Username: tn91user
  → Password: (choose something strong, e.g. Tn91@2025)
  → Role: "Atlas admin"
  → Click "Add User"

Step 4: Allow Your IP
  → Under "Security" → "Network Access" → "Add IP Address"
  → Click "Allow Access from Anywhere" → "0.0.0.0/0"
  → Click "Confirm"

Step 5: Get Your Connection String
  → Go to "Database" → Click "Connect" on your cluster
  → Choose "Drivers" → Driver: Node.js
  → Copy the connection string. It looks like:
    mongodb+srv://tn91user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
  → Replace <password> with your actual password


═══════════════════════════════════════
 PART 2 — BACKEND .ENV FILE SETUP
═══════════════════════════════════════

Step 6: Create the .env file
  → Open the "backend" folder
  → You will see ".env.example" file
  → COPY that file and rename the copy to ".env"
  → Open ".env" and fill it in like this:

  ┌─────────────────────────────────────────────────┐
  │  PORT=5000                                       │
  │  MONGO_URI=mongodb+srv://tn91user:Tn91@2025@    │
  │            cluster0.xxxxx.mongodb.net/tn91shop   │
  │  JWT_SECRET=tn91_any_random_secret_here_2025     │
  │  JWT_EXPIRE=7d                                   │
  │  NODE_ENV=development                            │
  └─────────────────────────────────────────────────┘

  IMPORTANT:
  - Replace the MONGO_URI with YOUR actual connection string from Step 5
  - Add /tn91shop before the ? in the URI (this is your database name)
  - JWT_SECRET can be any random long text — keep it secret!


═══════════════════════════════════════
 PART 3 — RUNNING THE PROJECT
═══════════════════════════════════════

You need TWO terminal windows open at the same time.

─── TERMINAL 1: Backend ───────────────
  cd menswear-fullstack/backend
  npm install
  npm run dev

  ✅ You should see:
     MongoDB connected
     Server running on port 5000

─── TERMINAL 2: Frontend ──────────────
  cd menswear-fullstack
  npm install
  npm run dev

  ✅ You should see:
     VITE ready in 334ms
     Local: http://localhost:5173

→ Open browser: http://localhost:5173
→ Backend API: http://localhost:5000/api/health


═══════════════════════════════════════
 PART 4 — TEST IT WORKS
═══════════════════════════════════════

1. Open http://localhost:5173
2. Click "Sign Up" in top-right corner
3. Create an account
4. Go to any product → scroll down → write a review & give stars
5. The star rating on the product card will update!
6. Go to cart → add products → test coupon codes:
   TN91 (10% off) | WELCOME20 (20% off) | SAVE15 (15% off)


═══════════════════════════════════════
 TROUBLESHOOTING
═══════════════════════════════════════

❌ "MongoServerError: bad auth"
   → Your MONGO_URI password is wrong. Re-check Step 3 & 6.

❌ "ECONNREFUSED 5000"
   → Backend is not running. Start it in Terminal 1.

❌ Stars show 0 / no reviews
   → This is normal until users submit reviews.
   → Make sure backend is running on port 5000.

❌ "Network Access" error from MongoDB
   → Add your IP in MongoDB Atlas → Network Access (Step 4).
