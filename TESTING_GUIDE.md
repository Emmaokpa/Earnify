# 🧪 Earnify Testing Guide - Step by Step

## 🚀 Quick Start Testing (Local Development)

Since you're running the app locally and Telegram WebApp SDK only works inside Telegram, we need to use the **development bypass** mode.

---

## ✅ Step 1: Verify Your Setup

### Check Server is Running
Your server should be running on `http://localhost:5000`

**Test the health endpoint:**
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{"status":"ok"}
```

### Check Client is Running
Your client should be running on `http://localhost:5173` (or similar Vite port)

Open your browser and navigate to: `http://localhost:5173`

---

## ✅ Step 2: Enable Development Mode

### Option A: Use the Development Bypass (Recommended for Local Testing)

The app is already configured to work in development mode with mock data.

**What happens automatically:**
1. `useTelegram` hook detects you're not in Telegram
2. Uses mock user data:
   - ID: `999999`
   - Name: `Dev User`
   - Username: `developer`
3. Sends `dev_bypass_token` as initData
4. Server accepts it in development mode

**To verify it's working:**
1. Open browser console (F12)
2. Look for: `⚠️ Telegram WebApp not detected. Using mock data for development.`
3. You should see the app load with mock user data

---

### Option B: Test Inside Telegram (Production-Like Testing)

To test the real Telegram integration:

1. **Create a Telegram Mini App:**
   - Go to @BotFather
   - Send `/newapp`
   - Follow the prompts
   - Upload an icon (512x512 PNG)
   - Set the Web App URL to your deployed frontend (or use ngrok for local testing)

2. **Use ngrok for local testing:**
   ```bash
   # Install ngrok: https://ngrok.com/download
   ngrok http 5173
   ```
   This gives you a public URL like: `https://abc123.ngrok.io`

3. **Update BotFather:**
   - Send `/myapps` to @BotFather
   - Select your app
   - Edit Web App URL
   - Paste your ngrok URL

4. **Open your bot in Telegram:**
   - Find your bot
   - Click the menu button or send `/start`
   - The Mini App should open

---

## ✅ Step 3: Test Authentication

### In Browser (Development Mode)

1. Open `http://localhost:5173`
2. Open browser console (F12)
3. Look for authentication logs:
   ```
   ✅ Telegram WebApp ready (mock)
   ✅ Authentication successful
   ```

4. Check Network tab:
   - Look for POST request to `/api/user/auth`
   - Should return `{"success": true, "user": {...}, "isNewUser": true}`

### Check Firebase

1. Go to Firebase Console: https://console.firebase.google.com
2. Navigate to Firestore Database
3. Check the `users` collection
4. You should see a document with ID `999999` (dev user)

---

## ✅ Step 4: Make Yourself an Admin

### Method 1: Manually in Firebase Console

1. Go to Firebase Console → Firestore
2. Find the `users` collection
3. Find your user document (ID: `999999` for dev mode)
4. Click "Edit"
5. Add a new field:
   - Field: `isAdmin`
   - Type: `boolean`
   - Value: `true`
6. Save

### Method 2: Using Firebase Admin SDK (Recommended)

Create a script to set admin status:

**File:** `server/scripts/setAdmin.ts`
```typescript
import { getFirestore } from '../src/config/firebase';

async function setAdmin(telegramId: string) {
    const db = getFirestore();
    await db.collection('users').doc(telegramId).update({
        isAdmin: true
    });
    console.log(`✅ Set ${telegramId} as admin`);
}

// For dev user
setAdmin('999999');

// For your real Telegram ID (replace with your actual ID)
// setAdmin('YOUR_TELEGRAM_ID');
```

Run it:
```bash
cd server
npx ts-node scripts/setAdmin.ts
```

---

## ✅ Step 5: Test Core Features

### Test 1: Dashboard
1. Navigate to Dashboard (should be default view)
2. Check if balance displays: `0 EC`
3. Check if Daily Streak section appears
4. Try clicking "Claim" (should show cooldown message)

### Test 2: Referral System
1. Go to Referrals tab
2. Copy your referral link
3. Open a new incognito window
4. Paste the link (it won't work in browser, but you can test the format)
5. Expected format: `https://t.me/YourBot?start=999999`

### Test 3: Social Nexus
1. Go to Social tab
2. Should fetch tasks from backend
3. If empty, create a task in Admin panel first

### Test 4: Admin Panel
1. Click Admin in bottom nav
2. If you set `isAdmin: true`, you should see the panel
3. Try creating a CPA offer or social task
4. Check Firebase to verify it was created

---

## ✅ Step 6: Test API Endpoints Manually

### Test Authentication
```bash
curl -X POST http://localhost:5000/api/user/auth \
  -H "Authorization: Bearer dev_bypass_token" \
  -H "Content-Type: application/json"
```

### Test Dashboard
```bash
curl http://localhost:5000/api/user/dashboard \
  -H "Authorization: Bearer dev_bypass_token"
```

### Test Daily Claim
```bash
curl -X POST http://localhost:5000/api/tasks/daily-claim \
  -H "Authorization: Bearer dev_bypass_token"
```

---

## ✅ Step 7: Test with Your Real Telegram Account

### Get Your Telegram ID

**Option 1: Use a bot**
1. Open @userinfobot in Telegram
2. Send `/start`
3. It will show your Telegram ID

**Option 2: Use @RawDataBot**
1. Open @RawDataBot
2. Send any message
3. Look for `"id": 123456789`

### Update Development Mock

Edit `client/src/hooks/useTelegram.ts`:
```typescript
const mockWebApp: TelegramWebApp = {
    initData: 'dev_bypass_token',
    initDataUnsafe: {
        user: {
            id: YOUR_REAL_TELEGRAM_ID, // Replace 999999 with your ID
            first_name: 'Your Name',
            username: 'your_username',
            // ...
        },
        // ...
    },
    // ...
};
```

Now when you test locally, it will use your real Telegram ID!

### Set Yourself as Admin
```bash
cd server
npx ts-node scripts/setAdmin.ts YOUR_TELEGRAM_ID
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "BOT_TOKEN is not configured"
**Solution:** 
- Check `server/.env` file exists
- Verify `BOT_TOKEN=your_token_here` is set
- Restart the server: `npm run dev`

### Issue 2: "Firebase not initialized"
**Solution:**
- Check `FIREBASE_SERVICE_ACCOUNT` in `server/.env`
- Make sure it's a valid JSON string
- Verify Firebase project is active

### Issue 3: "Authentication failed"
**Solution:**
- In development, make sure you're using `dev_bypass_token`
- Check server logs for specific error
- Verify middleware is allowing dev bypass

### Issue 4: "Admin panel not showing"
**Solution:**
- Check Firebase: user document should have `isAdmin: true`
- Check browser console for errors
- Verify you're logged in with the correct user

### Issue 5: "CORS errors"
**Solution:**
- Server should have CORS enabled (already configured)
- Check `client/src/config.ts` has correct API URL
- Verify both client and server are running

---

## 📊 Monitoring Your Tests

### Browser Console Logs to Look For:

**Good Signs:**
```
✅ Telegram WebApp ready (mock)
✅ Authentication successful
✅ Authenticated user: 999999 (Dev)
📱 Platform: web
👤 User: {id: 999999, first_name: "Dev", ...}
```

**Warning Signs:**
```
⚠️ Telegram WebApp not detected. Using mock data for development.
```
This is normal in browser testing!

**Bad Signs:**
```
❌ Authentication failed
❌ BOT_TOKEN is not configured
❌ Firebase not initialized
```
These need to be fixed!

### Server Console Logs to Look For:

**Good Signs:**
```
Server is running on port 5000
✅ Authenticated user: 999999 (Dev)
✅ New user 999999 referred by 123456
✅ Credited 20 EC to referrer 123456
```

**Bad Signs:**
```
❌ BOT_TOKEN is not configured in environment variables
⚠️ Invalid Telegram signature detected
Error in createOrGetUser: ...
```

---

## 🎯 Testing Checklist

- [ ] Server running on port 5000
- [ ] Client running on port 5173
- [ ] Health endpoint responds
- [ ] BOT_TOKEN configured in server/.env
- [ ] Firebase credentials configured
- [ ] User created in Firebase (ID: 999999)
- [ ] Admin status set (isAdmin: true)
- [ ] Dashboard loads and shows balance
- [ ] Admin panel visible
- [ ] Can create CPA offers
- [ ] Can create social tasks
- [ ] Daily claim works (or shows cooldown)
- [ ] Referral link generated correctly

---

## 🚀 Next Steps After Testing

Once everything works locally:

1. **Deploy Backend:**
   - Deploy to Railway, Render, or Heroku
   - Set environment variables
   - Note the production API URL

2. **Deploy Frontend:**
   - Deploy to Vercel or Netlify
   - Update `VITE_API_BASE_URL` to production API
   - Note the production URL

3. **Configure Telegram Bot:**
   - Go to @BotFather
   - Send `/myapps`
   - Set Web App URL to your production frontend URL
   - Test in real Telegram app

4. **Test Referral Flow:**
   - Share referral link with a friend
   - Verify they get added to your referrals
   - Verify you receive 20 EC bonus

---

## 📞 Need Help?

Check these in order:
1. Browser console (F12)
2. Server terminal logs
3. Firebase Console (check if data is being written)
4. Network tab (check API requests/responses)

**Common Commands:**
```bash
# Restart server
cd server
npm run dev

# Restart client
cd client
npm run dev

# Check if ports are in use
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

**Last Updated:** February 14, 2026
**Status:** Ready for Testing 🧪
