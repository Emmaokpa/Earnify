# Telegram Native Authentication - Implementation Guide

## Overview
Earnify now uses **Telegram-native authentication** with zero passwords or email requirements. Users authenticate purely through their Telegram identity, making onboarding seamless and secure.

---

## 🔐 Authentication Flow

### 1. **Client-Side (Telegram WebApp SDK)**
- The Telegram Mini App automatically provides `initData` containing:
  - User ID (Telegram ID)
  - First name, last name, username
  - Authentication hash (cryptographic signature)
  - Auth date (timestamp)
  - Start parameter (for referral tracking)

### 2. **Server-Side Verification**
- Backend validates the `initData` using the `BOT_TOKEN`
- Cryptographic verification ensures data hasn't been tampered with
- Session expires after 24 hours to prevent replay attacks

---

## 🚀 Key Features Implemented

### ✅ Enhanced Telegram Hook (`useTelegram.ts`)
**Location:** `client/src/hooks/useTelegram.ts`

**New Features:**
- Full TypeScript interface for Telegram WebApp SDK
- Theme detection (dark/light mode)
- Haptic feedback support
- Main button control
- Viewport management
- Referral tracking via `start_param`

**Usage Example:**
```typescript
const { webApp, user, initData, startParam, isReady } = useTelegram();

// Access user data
console.log(user.id); // Telegram ID
console.log(user.first_name); // User's name
console.log(startParam); // Referral code from deep link

// Use Telegram UI features
webApp.showAlert('Welcome!');
webApp.HapticFeedback.notificationOccurred('success');
```

---

### ✅ Secure Authentication Middleware (`auth.ts`)
**Location:** `server/src/middleware/auth.ts`

**Security Features:**
- Validates Telegram signature using HMAC-SHA256
- Checks auth_date to prevent replay attacks (24-hour window)
- Extracts and parses user data from initData
- Comprehensive error handling with detailed messages

**Environment Variable:**
```env
BOT_TOKEN=your_bot_token_from_botfather
```

**How It Works:**
1. Client sends `initData` in Authorization header
2. Server extracts hash and parameters
3. Recreates hash using BOT_TOKEN
4. Compares hashes - if match, user is authenticated
5. User data is attached to `req.user`

---

### ✅ Automatic Referral Tracking
**Location:** `client/src/App.tsx` + `server/src/controllers/userController.ts`

**Flow:**
1. User clicks referral link: `t.me/YourBot?start=123456`
2. Telegram opens app with `start_param=123456`
3. Frontend extracts referrer ID from `start_param`
4. Sends referrer ID during authentication
5. Backend creates user and credits referrer with 20 EC
6. Transaction logged in Firestore

**Referral Link Format:**
```
https://t.me/YourBot?start=<TELEGRAM_ID>
```

**Backend Response:**
```json
{
  "success": true,
  "user": { ... },
  "isNewUser": true,
  "referralBonus": 20
}
```

---

## 📋 Environment Variables Guide

### Server (.env)
```env
# Required for authentication
BOT_TOKEN=123456789:ABCDefghIJKLmnOpq-rstuvwxyZ

# Firebase Admin SDK (JSON string)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}

# JWT for additional security (optional)
JWT_SECRET=your_random_secret_key

# Server configuration
PORT=5000
NODE_ENV=production

# ImageKit (for image uploads)
IMAGEKIT_PRIVATE_KEY=private_xxx
IMAGEKIT_PUBLIC_KEY=public_xxx
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

### Client (.env)
```env
# API endpoint
VITE_API_BASE_URL=http://localhost:5000/api

# ImageKit (public keys only)
VITE_IMAGEKIT_PUBLIC_KEY=public_xxx
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

---

## 🔧 How to Get Your BOT_TOKEN

1. Open Telegram and search for **@BotFather**
2. Send `/newbot`
3. Choose a name (e.g., "Earnify Protocol")
4. Choose a username ending in "bot" (e.g., "EarnifyWebappBot")
5. Copy the token provided
6. Paste into `server/.env` as `BOT_TOKEN=...`

---

## 🎯 Referral System Architecture

### Database Structure

**users collection:**
```typescript
{
  telegramId: "123456789",
  username: "john_doe",
  firstName: "John",
  lastName: "Doe",
  isPremium: false,
  referralCode: "ABC123", // Legacy (not used)
  referredBy: "987654321", // Telegram ID of referrer
  balance: 0,
  referralEarnings: 0,
  // ... other fields
}
```

**referrals collection:**
```typescript
{
  userId: "987654321", // Referrer's Telegram ID
  totalReferrals: 5,
  activeReferrals: 5,
  totalEarned: 100, // 5 referrals × 20 EC
  referrals: [
    {
      userId: "123456789",
      joinedAt: Timestamp,
      isActive: true,
      bonusEarned: 20
    }
  ]
}
```

**transactions collection:**
```typescript
{
  userId: "987654321",
  amount: 20,
  type: "credit",
  category: "referral_bonus",
  description: "Referral bonus for user 123456789",
  status: "completed",
  createdAt: Timestamp
}
```

---

## 🧪 Testing

### Development Mode
The app includes a development bypass for testing without Telegram:

**Client Mock User:**
```typescript
{
  id: 999999,
  first_name: "Dev",
  username: "developer"
}
```

**Server Bypass:**
Set `initData` to `dev_bypass_token` in development mode.

### Production Testing
1. Deploy your bot to a test server
2. Set up webhook or use polling
3. Create a test Telegram Mini App
4. Test referral flow with multiple accounts

---

## 🛡️ Security Best Practices

### ✅ DO:
- Always validate `initData` on the server
- Use HTTPS in production
- Keep `BOT_TOKEN` secret (never commit to git)
- Implement rate limiting on auth endpoints
- Log suspicious authentication attempts

### ❌ DON'T:
- Never trust client-side data without verification
- Don't expose `BOT_TOKEN` in client code
- Don't skip auth_date validation
- Don't use the same token for multiple bots

---

## 📊 Monitoring & Logging

The implementation includes comprehensive logging:

**Authentication Success:**
```
✅ Authenticated user: 123456789 (John)
```

**Referral Tracking:**
```
📎 Referral detected: 987654321
✅ New user 123456789 referred by 987654321
✅ Credited 20 EC to referrer 987654321
```

**Errors:**
```
❌ BOT_TOKEN is not configured in environment variables
⚠️ Invalid Telegram signature detected
⚠️ Referrer 987654321 not found
```

---

## 🚀 Next Steps

1. **Set up your Telegram Bot:**
   - Get BOT_TOKEN from @BotFather
   - Configure webhook or polling
   - Set up Menu Button with your web app URL

2. **Configure Environment:**
   - Add BOT_TOKEN to server/.env
   - Set up Firebase Service Account
   - Configure API base URL in client/.env

3. **Deploy:**
   - Deploy backend to your server
   - Deploy frontend to Vercel/Netlify
   - Update Telegram bot settings with production URL

4. **Test Referral Flow:**
   - Create a test account
   - Generate referral link
   - Share with another account
   - Verify 20 EC bonus is credited

---

## 📞 Support

For issues or questions:
- Check server logs for authentication errors
- Verify BOT_TOKEN is correct
- Ensure Telegram WebApp SDK is loaded
- Test with development bypass first

---

**Last Updated:** February 14, 2026
**Version:** 1.0.0
**Status:** ✅ Production Ready
