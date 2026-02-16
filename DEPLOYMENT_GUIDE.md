# 🚀 Earnify Deployment Guide

This guide will help you deploy your Earnify application for free using **Render** (Backend) and **Vercel** (Frontend).

---

## 📦 Part 1: Prepare Your Code

### 1. Push to GitHub
Ensure your code is pushed to a GitHub repository.
- If you haven't initialized git yet:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  # Create a repo on GitHub and follow instructions to push
  ```

---

## 🛠️ Part 2: Deploy Backend (Render)

**Service:** Render (Best free tier for Node.js)

1.  **Sign Up/Login**: Go to [render.com](https://render.com) and login with GitHub.
2.  **New Web Service**: Click "New +" -> "Web Service".
3.  **Connect Repo**: Select your `Earnify` repository.
4.  **Configure Service**:
    *   **Name**: `earnify-api` (or similar)
    *   **Region**: Closest to you (e.g., Frankfurt or Oregon)
    *   **Branch**: `main`
    *   **Root Directory**: `server` (Important! Check your folder structure)
    *   **Runtime**: Node
    *   **Build Command**: `npm install && npm run build`
    *   **Start Command**: `npm start`
5.  **Environment Variables**:
    Scroll down to "Environment Variables" and add these from your `server/.env` file:
    *   `PORT`: `5000`
    *   `BOT_TOKEN`: (Your Telegram Bot Token)
    *   `FIREBASE_SERVICE_ACCOUNT`: (The entire JSON string from your file)
    *   `IMAGEKIT_PUBLIC_KEY`: ...
    *   `IMAGEKIT_PRIVATE_KEY`: ...
    *   `IMAGEKIT_URL_ENDPOINT`: ...
6.  **Deploy**: Click "Create Web Service".
7.  **Wait**: It will take a few minutes. Once done, copy the URL (e.g., `https://earnify-api.onrender.com`).

**💡 Important Note on Free Tier:**
Render's free tier spins down after inactivity. The first request might take 30-60 seconds. This is normal for free hosting.

---

## ⚡ Part 3: Deploy Frontend (Vercel)

**Service:** Vercel (Best for React/Vite)

1.  **Sign Up/Login**: Go to [vercel.com](https://vercel.com) and login with GitHub.
2.  **Add New Project**: Click "Add New..." -> "Project".
3.  **Import Repo**: Select your `Earnify` repository.
4.  **Configure Project**:
    *   **Framework Preset**: Vite (should auto-detect)
    *   **Root Directory**: Edit this and select `client` (Important!)
5.  **Environment Variables**:
    Add the following variable:
    *   `VITE_API_BASE_URL`: Paste your **Render Backend URL** (e.g., `https://earnify-api.onrender.com/api`)
    *   (Add ImageKit public keys if needed)
6.  **Deploy**: Click "Deploy".
7.  **Done**: You will get a URL like `https://earnify.vercel.app`.

---

## 🤖 Part 4: Connect Telegram Bot

Now that you have live URLs:

1.  **Open Telegram**: Go to @BotFather.
2.  **Select App**: Send `/myapps` and select your bot.
3.  **Edit Web App URL**:
    *   Paste your **Vercel Frontend URL** (e.g., `https://earnify.vercel.app`).
4.  **Edit Menu Button**:
    *   Update the menu button URL to the same Vercel URL.

---

## 👑 Part 5: Set Yourself as Admin (Production)

Since you are now on a live database (Firestore), you need to make your user an admin.

1.  **Open the App**: Launch it in Telegram to create your user record.
2.  **Go to Firebase Console**:
    *   Find your user in `users` collection (by Telegram ID).
    *   Add field `isAdmin` (boolean) -> `true`.
3.  **Alternative (Script)**:
    *   Locally, update `.env` to point to production DB (it already does).
    *   Run: `npm run set-admin YOUR_TELEGRAM_ID` inside the `server` folder.

---

## ✅ Checklist

- [ ] Backend deployed to Render
- [ ] Backend URL copied
- [ ] Frontend deployed to Vercel (with VITE_API_BASE_URL set)
- [ ] BotFather updated with Vercel URL
- [ ] User opened app once
- [ ] User promoted to Admin in Firebase

**Congratulations! Your Earnify Protocol is now live! 🚀**
