# Deployment Guide - Learning Assistant

## 🚨 Critical Issues Fixed

### Issue 1: Wrong CLIENT_URL
**Problem:** CLIENT_URL was set to Vercel settings page instead of actual app URL
**Solution:** Update to your actual frontend deployment URL

### Issue 2: Missing GEMINI_MODEL
**Problem:** Model wasn't explicitly set, defaulting to wrong version
**Solution:** Added `GEMINI_MODEL=gemini-2.5-flash-lite`

---

## 📋 Environment Variables for Production

### Backend Environment Variables (Required)

Copy these to your backend deployment platform (Render/Railway/Heroku/etc.):

```env
PORT=3400
NODE_ENV=production

# Database
MONGO_URI=mongodb://anirudh0465:8s1eWaxIea9MkK3q@ac-8uiode8-shard-00-00.zhgi6lk.mongodb.net:27017,ac-8uiode8-shard-00-01.zhgi6lk.mongodb.net:27017,ac-8uiode8-shard-00-02.zhgi6lk.mongodb.net:27017/learningapp?ssl=true&replicaSet=atlas-4vphpk-shard-0&authSource=admin&retryWrites=true&w=majority

# JWT
JWT_SECRET=super_secret_key123
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=drh9vpgsp
CLOUDINARY_API_KEY=194659468183659
CLOUDINARY_API_SECRET=9QPj2thP7iZsr_SRaX2n3IB7FCw

# Gemini AI
GEMINI_API_KEY=AIzaSyBuwhecwecEr12jCwFYpRgKyw4iA3PXqOU
GEMINI_MODEL=gemini-2.5-flash-lite

# Frontend URL (UPDATE THIS!)
CLIENT_URL=https://your-frontend-app.vercel.app
```

### Frontend Environment Variables (Required)

Copy these to your frontend deployment (Vercel):

```env
# Backend API URL (UPDATE THIS!)
VITE_API_BASE_URL=https://your-backend-app.onrender.com/api
```

---

## 🔧 Step-by-Step Deployment

### Step 1: Get Your Actual Deployment URLs

1. **Frontend URL** (Vercel):
   - Go to your Vercel dashboard
   - Find your project: `learning-assistant-ojt`
   - Copy the actual deployment URL (e.g., `https://learning-assistant-ojt.vercel.app`)

2. **Backend URL** (Render/Railway/etc.):
   - Go to your backend hosting dashboard
   - Copy your backend API URL (e.g., `https://learning-assistant-backend.onrender.com`)

### Step 2: Update Backend Environment Variables

1. Go to your backend hosting platform (Render/Railway/Heroku)
2. Navigate to Environment Variables section
3. Add/Update these variables:
   - `CLIENT_URL` = Your actual frontend URL from Step 1
   - `GEMINI_API_KEY` = AIzaSyBuwhecwecEr12jCwFYpRgKyw4iA3PXqOU
   - `GEMINI_MODEL` = gemini-2.5-flash-lite
   - `NODE_ENV` = production
   - (Add all other variables from the list above)

### Step 3: Update Frontend Environment Variables

1. Go to Vercel dashboard
2. Navigate to your project settings → Environment Variables
3. Add/Update:
   - `VITE_API_BASE_URL` = Your backend URL from Step 1 + `/api`
   - Example: `https://learning-assistant-backend.onrender.com/api`

### Step 4: Redeploy Both Apps

1. **Backend**: Trigger a redeploy or it will auto-redeploy after env changes
2. **Frontend**: Redeploy from Vercel dashboard or push to trigger auto-deploy

---

## 🧪 Testing Gemini API in Production

After deployment, test the Gemini API:

1. Login to your deployed app
2. Upload a PDF document
3. Try generating:
   - ✅ Quiz from document
   - ✅ Flashcards from document
   - ✅ Ask questions about document

### If You Still Get Errors:

**Check Backend Logs:**
- Look for Gemini API errors
- Common issues:
  - `429 Too Many Requests` = API quota exceeded
  - `401 Unauthorized` = Invalid API key
  - `404 Not Found` = Wrong model name

**Verify Environment Variables:**
```bash
# SSH into your backend server or check logs
echo $GEMINI_API_KEY
echo $GEMINI_MODEL
echo $CLIENT_URL
```

---

## 🔑 Gemini API Quota Issues

If you see `429 Too Many Requests`:

1. **Free Tier Limits:**
   - 15 requests per minute
   - 1,500 requests per day
   - Model: `gemini-2.5-flash-lite` has better limits

2. **Solutions:**
   - Wait for quota to reset (per minute/day)
   - Use a different API key
   - Upgrade to paid plan at https://ai.google.dev/pricing

3. **Fallback Behavior:**
   - App automatically uses fallback quiz/flashcard generation
   - Users still get functionality, just not AI-powered

---

## 📝 Quick Checklist

- [ ] Backend deployed with all environment variables
- [ ] Frontend deployed with correct `VITE_API_BASE_URL`
- [ ] `CLIENT_URL` in backend points to actual frontend URL
- [ ] `GEMINI_MODEL` is set to `gemini-2.5-flash-lite`
- [ ] `GEMINI_API_KEY` is valid and has quota remaining
- [ ] CORS is configured correctly (CLIENT_URL)
- [ ] Both apps redeployed after env changes
- [ ] Tested PDF upload and AI features

---

## 🆘 Common Deployment Errors

### Error: "CORS policy blocked"
**Fix:** Update `CLIENT_URL` in backend to match your actual frontend URL

### Error: "Gemini API not responding"
**Fix:** Check `GEMINI_API_KEY` and `GEMINI_MODEL` are set correctly

### Error: "Cannot connect to database"
**Fix:** Verify `MONGO_URI` is correct and MongoDB Atlas allows connections from your backend IP

### Error: "Environment variable undefined"
**Fix:** Ensure all env vars are set in deployment platform, not just in .env file

---

## 📞 Need Help?

1. Check backend logs for specific error messages
2. Verify all environment variables are set correctly
3. Test API endpoints directly using Postman/curl
4. Check Gemini API quota at https://ai.dev/rate-limit
