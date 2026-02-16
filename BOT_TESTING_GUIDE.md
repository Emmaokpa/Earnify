# 🤖 Earnify Bot & Admin Testing Guide

This guide covers how to test the new **Telegram Bot Commands** and the **Protected Admin System**.

---

## 🔐 1. Admin Authentication Testing (Backend)

We've secured the backend so only admins can create tasks. Let's test this with `curl`.

### Step 1: Generate a Test Admin Token
Run the script I created to generate a valid Telegram auth token for a test admin user.
```bash
cd server
npx ts-node scripts/generate_token.ts
```
**Copy the token** (starts with `auth_date=...`).

### Step 2: Test Protected Route (Create Task)
Try to create a social task using the token.
```bash
curl -X POST http://localhost:5000/api/social/create \
  -H "Authorization: Bearer <PASTE_YOUR_TOKEN_HERE>" \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "telegram",
    "type": "channel",
    "title": "Test Channel",
    "description": "Join our test channel",
    "link": "https://t.me/test",
    "reward": 100,
    "icon": "telegram"
  }'
```
**Expected Result:**
- If user is admin: `{"success": true, ...}`
- If user is NOT admin: `{"success": false, "error": "Forbidden", "message": "Admin privileges required"}`

---

## 🤖 2. Telegram Bot Commands Testing

To test the bot commands, you need to have your bot running.

### Step 1: Set Up & Run
1. Ensure `BOT_TOKEN` is in `server/.env`.
2. Start the server:
   ```bash
   cd server
   npm run dev
   ```
3. Watch the logs. You should see: `🤖 Telegram Bot started successfully`

### Step 2: Test Commands in Telegram
Open your bot in Telegram and try these commands:

| Command | Expected Behavior |
|---------|-------------------|
| `/start` | Welcome message with "Launch App" button. |
| `/balance` | Shows your current EC balance (must have account). |
| `/referrals` | Shows total referrals, earnings, and your unique link. |
| `/help` | Lists all available commands. |
| `/admin` | Keep-alive check. Checks if you are an admin. |

### Step 3: Test Deep Linking (Referrals)
1. Get your referral link from `/referrals`.
   Example: `https://t.me/YourBot?start=123456`
2. Send this link to a second Telegram account (or friend).
3. Have them click "Start".
4. **Backend Log Check:** You should see `Referral detected` in the server logs.
5. **Bonus Check:** The referrer (you) should get +20 EC.

---

## 🛡️ 3. Frontend Admin Protection Testing

### Step 1: Verify Protection
1. Open the app in your browser (localhost:5173).
2. By default, the mock user (`ID: 999999`) is **NOT** an admin.
3. Try to access the Admin tab (if visible) or manually go to `/admin`.
4. **Expected:** You should see the "Access Restricted" lock screen.

### Step 2: Grant Admin Access
1. Run the admin script to promote the dev user:
   ```bash
   cd server
   npx ts-node scripts/setAdmin.ts 999999
   ```
2. Refresh the browser.
3. **Expected:** The Admin tab should appear in the bottom nav, and you can access the dashboard.

---

## 🐞 Troubleshooting

**Bot doesn't reply?**
- Check if `BOT_TOKEN` is correct.
- Check server console for errors.
- Ensure only *one* instance of the bot is running (stop other terminals).

**Admin route still 403 Forbidden?**
- Ensure you used the right Telegram ID in `setAdmin.ts`.
- Ensure the `generate_token.ts` script is using the same ID you promoted.

**"Web App URL is invalid"?**
- In `server/src/bot/index.ts`, update `WEBAPP_URL` to your actual deployed frontend URL (or ngrok URL for local testing).

---

**Last Updated:** February 14, 2026
**Status:** Ready for Testing 🧪
