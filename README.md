# 💰 Earnify - Telegram Task & Earn Mini App

A Telegram Mini App that allows users in Nigeria to earn ₦ (Naira) by completing tasks, watching ads, and referring friends.

## 🎯 Project Overview

**Earnify** is a task-based earning platform built as a Telegram Mini App targeting the Nigerian market. Users can earn money through:
- 📺 Watching rewarded ads (Monetag)
- 🎯 Completing CPA offers (AdGate, OfferToro, OGAds, Wannads, CPAGrip)
- 📅 Daily login streaks
- 👥 Referring friends

## 🛠 Tech Stack

### Frontend
- **React** with **Vite** (TypeScript)
- **Tailwind CSS** for styling
- **Telegram WebApp SDK** for integration
- **Axios** for API calls

### Backend
- **Node.js** with **Express**
- **TypeScript**
- **Firebase Firestore** (Database)
- **JWT** for authentication
- **Telegram Bot API** for user verification

## 📁 Project Structure

```
Earnify/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API integration
│   │   ├── components/    # Reusable components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── layouts/       # Layout components
│   │   ├── pages/         # Page components
│   │   └── config.ts      # Frontend configuration
│   └── package.json
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   └── index.ts       # Server entry point
│   └── package.json
│
└── PLAN.md               # Development roadmap
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Telegram Bot Token

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Emmaokpa/Earnify.git
cd Earnify
```

2. **Install dependencies**

For the client:
```bash
cd client
npm install
```

For the server:
```bash
cd server
npm install
```

3. **Environment Setup**

Create a `.env` file in the `server` directory:
```env
PORT=5000
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_BOT_USERNAME=your_bot_username
JWT_SECRET=your_jwt_secret
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
CPA_POSTBACK_SECRET=your_cpa_secret
ADMIN_API_KEY=your_admin_key
```

4. **Run the development servers**

Frontend:
```bash
cd client
npm run dev
```

Backend:
```bash
cd server
npm run dev
```

## 📊 Database Schema (Firestore)

### Collections

#### `users`
```typescript
{
  telegramId: string,
  username: string,
  firstName: string,
  lastName: string,
  referralCode: string,
  referredBy: string | null,
  balance: number,
  pendingBalance: number,
  totalEarned: number,
  referralEarnings: number,
  dailyStreak: number,
  lastLogin: timestamp,
  level: number,
  isBlocked: boolean,
  deviceFingerprint: string,
  ipHistory: string[],
  flags: string[],
  createdAt: timestamp
}
```

#### `transactions`
```typescript
{
  userId: string,
  type: "CPA" | "AD" | "REFERRAL" | "DAILY",
  amount: number,
  networkAmount: number,
  transactionId: string,
  status: "pending" | "confirmed" | "rejected",
  createdAt: timestamp
}
```

#### `withdrawals`
```typescript
{
  userId: string,
  amount: number,
  accountDetails: object,
  status: "pending" | "approved" | "rejected",
  createdAt: timestamp,
  processedAt: timestamp
}
```

## 🔐 Security Features

- **Device Fingerprinting**: Prevents multi-account abuse
- **IP Tracking**: Monitors suspicious activity
- **Daily Earning Caps**: Limits maximum earnings per day
- **Pending Balance System**: 24-72h validation window
- **Telegram Authentication**: Secure HMAC-SHA256 verification

## 💰 Earning System

| Activity | Reward | Limit |
|----------|--------|-------|
| Daily Login | ₦20 | Once per day |
| 7-Day Streak Bonus | ₦200 | Weekly |
| Watch Ad | ₦5 | 20 ads/day |
| Referral Bonus | ₦100 | Per confirmed referral |
| Referral Commission | 10% | Lifetime on CPA earnings |

**Minimum Withdrawal**: ₦2,000

## 📈 Development Phases

- [x] **Phase 1**: Core Setup & Architecture
- [ ] **Phase 2**: User Dashboard & Layout
- [ ] **Phase 3**: Earnings & Task System
- [ ] **Phase 4**: Referral System
- [ ] **Phase 5**: Wallet & Withdrawals
- [ ] **Phase 6**: Fraud Prevention & Security
- [ ] **Phase 7**: Deployment & Polish

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy to Vercel
```

### Backend (Render/Railway)
```bash
cd server
npm run build
# Deploy to Render or Railway
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/verify` - Verify Telegram user

### User
- `GET /api/user/dashboard` - Get user dashboard data
- `GET /api/user/profile` - Get user profile

### Tasks
- `POST /api/tasks/daily-login` - Claim daily login reward
- `POST /api/tasks/ad-completed` - Log ad completion
- `POST /api/postback/cpa` - CPA network postback

### Withdrawals
- `POST /api/withdraw/request` - Request withdrawal
- `GET /api/withdraw/status/:id` - Check withdrawal status

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Emmanuel Nwakosu**
- GitHub: [@Emmaokpa](https://github.com/Emmaokpa)

## 🙏 Acknowledgments

- Telegram Bot API
- Firebase
- Monetag
- CPA Networks (AdGate, OfferToro, OGAds, Wannads, CPAGrip)

---

**Note**: This is a real-money earning platform. Users are only paid after confirmed revenue is received from advertisers.
