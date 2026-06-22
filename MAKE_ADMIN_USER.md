# 👑 How to Make a User an Admin

There's no signup option for "admin" (for security) — you make a user
admin manually in MongoDB Compass after they register normally.

## Steps

1. Register a normal account on your site (e.g. yourself) at /register
2. Open MongoDB Compass → connect to mongodb://localhost:27017
3. Click database: tn91shop → collection: users
4. Find your user document (search by email if needed)
5. Click the pencil/edit icon on that document
6. Find the field:  "role": "user"
7. Change it to:    "role": "admin"
8. Click Update

## After that

1. Log out and log back in on the site (so a fresh token is issued)
2. Click your avatar (top right) → you'll now see "Admin Panel" in red
3. Go to /admin to see the dashboard, all orders, and stock alerts

## Note
Only change YOUR OWN test account to admin. Don't expose an "admin
signup" option publicly — that's why this is a manual DB step.
