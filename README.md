# 🚀 Influencer Affiliate Sales & Payment Tracking Platform

A full-stack web dashboard for brands to track influencer-driven sales, commissions, and payments in real time.

## ⚡ Quick Start (Easiest Way)

**Double-click `START.bat`** in this folder — it opens both servers automatically.

Then open: **http://localhost:5173**

---

## 🔑 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin (Brand) | admin@test.com | admin123 |
| Influencer | influencer@test.com | pass123 |

---

## 🛠️ Manual Start (if needed)

### Backend (Node.js + Express — port 5000)
```bash
cd backend
node server.js
```

### Frontend (React + Vite — port 5173)
```bash
cd frontend
npm run dev
```

> ⚠️ **IMPORTANT:** This is a **Node.js** backend, NOT Spring Boot / Java / Maven.
> Do NOT run `mvn spring-boot:run` in this folder.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript (Vite) |
| Backend | Node.js + Express |
| Database | SQLite (via Prisma ORM) |
| Auth | JWT |
| Charts | Recharts |
| Styling | Vanilla CSS (Glassmorphism) |

---

## 📊 Features

- ✅ Role-based auth (Admin / Influencer)
- ✅ Unique referral link generation per influencer
- ✅ Click & conversion tracking
- ✅ Commission calculation (10% per sale)
- ✅ Payment status management (Pending → Paid)
- ✅ Visual dashboards with charts
- ✅ AI performance insights
- ✅ Mobile responsive

## 🔗 Demo Flow

1. Login as **Influencer** → copy your referral link
2. Paste link in browser → click **Buy Now** on product page
3. Login as **Admin** → see sale on dashboard, approve payment
4. Switch back to Influencer → payout shows as PAID
