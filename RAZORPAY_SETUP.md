# 💳 Razorpay Test Payment — Setup Guide

Your checkout works in **two modes**:

| Mode | When | What happens |
|------|------|--------------|
| **Simulation** (default) | No Razorpay keys in `.env` | Online payments are mocked — order is marked **Paid** after a short delay. Great for testing the flow. |
| **Live test mode** | Razorpay test keys added | A real Razorpay window opens. You pay with test cards. No real money moves. |

You don't *need* keys to run the project. Add them only when you want the real gateway.

---

## Step 1 — Create a free Razorpay account
1. Go to **https://dashboard.razorpay.com/signup**
2. Sign up (no business/KYC needed for test mode).

## Step 2 — Get your TEST API keys
1. In the dashboard, make sure the toggle at the top-left says **Test Mode** (not Live).
2. Go to **Settings → API Keys** (or **Account & Settings → API Keys**).
3. Click **Generate Test Key**.
4. Copy the **Key ID** (starts with `rzp_test_...`) and the **Key Secret**.
   > ⚠️ The secret is shown only once — copy it now.

## Step 3 — Put the keys in your backend `.env`
Open `backend/.env` and fill in:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_here
```

## Step 4 — Install the package & restart
```bash
cd backend
npm install        # installs the new "razorpay" package
npm run dev        # you should see: 💳 Razorpay configured (live test mode)
```

If you **don't** see that line, the keys aren't being read — check there are no spaces/quotes around them in `.env`.

---

## Step 5 — Test a payment
1. Add items to cart → **Checkout** → fill address → choose **Card / UPI / Net Banking**.
2. Click **Pay ₹…** → the Razorpay window opens.
3. Use a **test card**:

| Field | Value |
|-------|-------|
| Card number | `4111 1111 1111 1111` |
| Expiry | any future date (e.g. `12 / 30`) |
| CVV | any 3 digits (e.g. `123`) |
| Name | anything |

For test UPI, use `success@razorpay`.

4. On success, the order is saved with **paymentStatus: "paid"** and the Razorpay payment ID — you can see it in MongoDB Compass under the `orders` collection.

---

## How it works (under the hood)
- `POST /api/payment/create-order` → backend asks Razorpay to create an order, returns its `id`.
- Frontend opens the Razorpay checkout with that `order_id`.
- After payment, Razorpay returns a **signature**.
- `POST /api/payment/verify` → backend recomputes the signature with your secret (HMAC-SHA256) and confirms it matches. Only then is the order saved as paid. This prevents fake "paid" requests.

**Cash on Delivery** skips Razorpay entirely and saves the order with `paymentStatus: "pending"`.
