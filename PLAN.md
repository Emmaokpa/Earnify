# Earnify - Project Plan

## 📌 Project Overview
**Earnify** is a Telegram Task & Earn Mini App targeting the Nigerian market.  
**Platform**: Telegram Mini App (TMA)  
**Stack**: React (Vite) + Node.js (Express) + Firebase Firestore

---

## 📅 Phased Development Plan

### Phase 1: Core Setup & Architecture 🚧 (Current Focus)
- [ ] Initialize Git repository
- [ ] Set up Project Structure (Monorepo: `client` + `server`)
- [ ] **Frontend**: Initialize Vite + React + Tailwind CSS
- [ ] **Backend**: Initialize Node.js + Express + TypeScript
- [ ] **Database**: Setup Firebase Admin SDK & Connect to Firestore
- [ ] **Auth**: Implement Telegram WebApp `initData` verification (JWT)

### Phase 2: User Dashboard & Layout 🎨
- [ ] Design App Shell (Bottom Navigation: Home, Earn, Referrals, Withdraw)
- [ ] **Dashboard Component**:
    - Display Balances (Available, Pending, Total)
    - Show User Stats (Referrals, Daily Streak)
- [ ] **User Profile**: Display User ID, Level, and Settings

### Phase 3: Earnings & Task System 💰
- [ ] **Daily Login System**:
    - Endpoint: `POST /api/tasks/daily-login`
    - Logic: Streak tracking + 24h cooldown
- [ ] **Watch Ads (Monetag)**:
    - Frontend: Integrate Monetag SDK
    - Backend: `POST /api/tasks/ad-completed` (Validation & Logging)
- [ ] **CPA Offer Wall**:
    - Integrate Postback endpoints for AdGate, OfferToro, etc.
    - Logic: Credit `pendingBalance` upon postback receipt

### Phase 4: Referral System 🤝
- [ ] Generate unique referral codes
- [ ] **Share Link**: `t.me/YourBot?start=ref_CODE`
- [ ] **Commission Logic**:
    - Track referrals in Firestore
    - Credit 10% commission on earnings
    - Unlock ₦100 bonus after first CPA task

### Phase 5: Wallet & Withdrawals 🏦
- [ ] **Withdrawal Page**:
    - Input: Bank/Opay/PalmPay details
    - Validation: Min balance (₦2,000) & Earning Cap
- [ ] **Backend Processing**:
    - Create withdrawal request in Firestore
    - Admin-triggered status updates (Pending -> Approved)

### Phase 6: Fraud Prevention & Security 🛡
- [ ] **Device Fingerprinting**: Collect & Hash user device data
- [ ] **IP Tracking**: Limit accounts per IP
- [ ] **Earning Caps**: Enforce daily limits (e.g., ₦3,000)
- [ ] **Pending Balance**: Hold earnings for 24-72h before unlocking

### Phase 7: Deployment & Polish 🚀
- [ ] Frontend: Deploy to Vercel
- [ ] Backend: Deploy to Render/Railway
- [ ] Telegram Bot: Link Menu Button to WebApp URL
- [ ] Final Testing: Load testing & Security audit

---

## 🛠 Tech Stack Details

| Component | Technology | Logic |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) | Fast SPA, optimized for Telegram WebView |
| **Styling** | Tailwind CSS | Utility-first, responsive design |
| **Backend** | Node.js + Express | Efficient API handling & async logic |
| **Database** | Firebase Firestore | Real-time, scalable NoSQL |
| **Auth** | Telegram + JWT | Secure, seamless login via Telegram |

---

## 📝 Next Steps
1. Initialize the project folders.
2. Install dependencies for Client and Server.
3. Configure Tailwind CSS.
4. Set up the Express server basic route.
