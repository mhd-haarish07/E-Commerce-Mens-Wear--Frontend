# 🍃 LOCAL MONGODB SETUP GUIDE (Windows)
# No internet needed, completely free forever

═══════════════════════════════════════════════
 STEP 1 — DOWNLOAD MONGODB
═══════════════════════════════════════════════

1. Go to: https://www.mongodb.com/try/download/community

2. Select:
   Platform  → Windows
   Package   → msi
   Version   → Latest (e.g. 7.0.x)

3. Click Download (file is ~500MB)


═══════════════════════════════════════════════
 STEP 2 — INSTALL MONGODB
═══════════════════════════════════════════════

1. Double-click the downloaded .msi file
2. Click Next → Accept License → Next
3. Choose "Complete" (not Custom)
4. ✅ CHECK "Install MongoDB as a Service"  ← IMPORTANT
5. ✅ CHECK "Install MongoDB Compass" (visual UI tool)
6. Click Install → Yes to UAC prompt → Finish

MongoDB will start automatically as a Windows Service.


═══════════════════════════════════════════════
 STEP 3 — VERIFY MONGODB IS RUNNING
═══════════════════════════════════════════════

Open Command Prompt (Win + R → type cmd → Enter)

Type:
  mongod --version

You should see something like:
  db version v7.0.2

If you see 'mongod' is not recognized:
  → Add MongoDB to PATH:
  → Right-click My Computer → Properties → Advanced System Settings
  → Environment Variables → Path → Edit → New
  → Add: C:\Program Files\MongoDB\Server\7.0\bin
  → Click OK → Restart Command Prompt


═══════════════════════════════════════════════
 STEP 4 — CREATE YOUR DATABASE
═══════════════════════════════════════════════

Method A — Using MongoDB Compass (Visual, Easy):
  1. Open "MongoDB Compass" from Start Menu
  2. Connection string is already filled: mongodb://localhost:27017
  3. Click Connect
  4. Click "+" next to Databases
  5. Database Name: tn91shop
  6. Collection Name: users
  7. Click Create Database
  ✅ Your database is created!

Method B — Using Command Line:
  Open Command Prompt and type:
    mongosh
  Then type:
    use tn91shop
    db.createCollection("users")
    exit
  ✅ Database created!

NOTE: MongoDB will also AUTO-CREATE the database when
your backend connects for the first time. So you don't
even need to do this step manually!


═══════════════════════════════════════════════
 STEP 5 — CONFIGURE YOUR .ENV FILE
═══════════════════════════════════════════════

1. Open the "backend" folder in your project
2. Copy ".env.example" → rename copy to ".env"
3. Open ".env" and paste exactly this:

┌──────────────────────────────────────────┐
│  PORT=5000                               │
│  MONGO_URI=mongodb://localhost:27017/    │
│            tn91shop                      │
│  JWT_SECRET=tn91_secret_key_2025_abc123  │
│  JWT_EXPIRE=7d                           │
│  NODE_ENV=development                    │
└──────────────────────────────────────────┘

The full MONGO_URI on one line:
  mongodb://localhost:27017/tn91shop


═══════════════════════════════════════════════
 STEP 6 — RUN THE PROJECT
═══════════════════════════════════════════════

Open TWO Command Prompt windows:

── Window 1 (Backend) ──────────────────────
  cd path\to\menswear-fullstack\backend
  npm install
  npm run dev

  ✅ Should show:
     MongoDB connected
     Server running on port 5000

── Window 2 (Frontend) ─────────────────────
  cd path\to\menswear-fullstack
  npm install
  npm run dev

  ✅ Should show:
     VITE ready
     Local: http://localhost:5173

Open browser: http://localhost:5173


═══════════════════════════════════════════════
 VIEWING YOUR DATABASE (MongoDB Compass)
═══════════════════════════════════════════════

After users register or orders are placed:
1. Open MongoDB Compass
2. Connect to: mongodb://localhost:27017
3. Click "tn91shop" database
4. You will see collections: users, reviews, orders
5. Click any collection to see the documents (data)

This is like phpMyAdmin but for MongoDB!


═══════════════════════════════════════════════
 TROUBLESHOOTING
═══════════════════════════════════════════════

❌ "connect ECONNREFUSED 127.0.0.1:27017"
   → MongoDB service is not running
   → Press Win + R → services.msc → Find "MongoDB"
   → Right-click → Start

❌ "mongod is not recognized"
   → Add C:\Program Files\MongoDB\Server\7.0\bin to PATH (see Step 3)

❌ Port 27017 already in use
   → Another MongoDB instance is running — that's fine!
   → Your .env MONGO_URI will still work.

❌ "Authentication failed"
   → Local MongoDB has no auth by default
   → Make sure MONGO_URI is: mongodb://localhost:27017/tn91shop
   → No username/password needed for local!
