# Gemini API Troubleshooting Guide

## ✅ Local Environment Status

**All Gemini API functions are working correctly in local development!**

- ✅ Direct API Connection
- ✅ Quiz Generation
- ✅ Flashcard Generation  
- ✅ Document Q&A

---

## 🚨 If Gemini API is NOT Working in Production

### Quick Diagnostic Steps

1. **Run the diagnostic tool on your production server:**
   ```bash
   node backend/diagnose-gemini.js
   ```

2. **Check environment variables are set:**
   ```bash
   node backend/verify-env.js
   ```

---

## Common Issues & Solutions

### Issue 1: Environment Variables Not Set in Production

**Symptoms:**
- API returns "AI is currently disabled or unavailable"
- Logs show `genAI is null`

**Solution:**
Go to your deployment platform and ensure these are set:

```env
GEMINI_API_KEY=AIzaSyBuwhecwecEr12jCwFYpRgKyw4iA3PXqOU
GEMINI_MODEL=gemini-2.5-flash-lite
```

**Platform-Specific Instructions:**

- **Render:** Dashboard → Environment → Add Environment Variable
- **Railway:** Project → Variables → Add Variable
- **Heroku:** Settings → Config Vars → Add
- **Vercel (Backend):** Settings → Environment Variables → Add

⚠️ **Important:** After adding env vars, you MUST redeploy!

---

### Issue 2: API Quota Exceeded (429 Error)

**Symptoms:**
- Error: "429 Too Many Requests"
- Logs show "Quota exceeded for metric"

**Explanation:**
Gemini API free tier has limits:
- **Per Minute:** 15 requests
- **Per Day:** 1,500 requests
- **Model-specific:** Different models have different quotas

**Solutions:**

1. **Wait for quota reset:**
   - Per-minute quotas reset every 60 seconds
   - Daily quotas reset at midnight UTC

2. **Use a different API key:**
   - Create a new project in Google AI Studio
   - Generate a new API key
   - Update `GEMINI_API_KEY` in production

3. **Upgrade to paid plan:**
   - Visit: https://ai.google.dev/pricing
   - Much higher quotas available

4. **Optimize API usage:**
   - Reduce text length sent to API (currently limited to 15,000 chars)
   - Implement caching for repeated requests
   - Add rate limiting on your backend

**Check your quota usage:**
https://ai.dev/rate-limit

---

### Issue 3: Wrong Model Name (404 Error)

**Symptoms:**
- Error: "404 Not Found"
- Logs show "model not found"

**Solution:**
Ensure `GEMINI_MODEL` is set to a valid model:

**Valid models (as of 2026):**
- `gemini-2.5-flash-lite` ✅ (Recommended - best quota)
- `gemini-1.5-flash` ✅
- `gemini-1.5-pro` ✅

**Invalid/Deprecated:**
- `gemini-2.0-flash` ❌ (Old, poor quota)
- `gemini-pro` ❌ (Deprecated)

---

### Issue 4: Invalid API Key (401/403 Error)

**Symptoms:**
- Error: "401 Unauthorized" or "403 Forbidden"
- Logs show authentication error

**Solutions:**

1. **Verify API key is correct:**
   - Check for typos
   - Ensure no extra spaces
   - Verify it's the full key (starts with `AIza`)

2. **Generate new API key:**
   - Go to: https://aistudio.google.com/app/apikey
   - Create new API key
   - Update in production environment

3. **Check API key restrictions:**
   - In Google Cloud Console, check if key has IP restrictions
   - Ensure key is enabled for Generative Language API

---

### Issue 5: Network/Firewall Issues

**Symptoms:**
- Timeout errors
- Connection refused
- No response from API

**Solutions:**

1. **Check outbound connections:**
   - Ensure your server can reach `generativelanguage.googleapis.com`
   - Test: `curl https://generativelanguage.googleapis.com`

2. **DNS issues:**
   - Your backend already has DNS configuration (Google DNS: 8.8.8.8)
   - If still issues, check server's DNS settings

3. **Firewall rules:**
   - Ensure outbound HTTPS (port 443) is allowed
   - Check cloud provider's firewall settings

---

### Issue 6: Response Format Errors

**Symptoms:**
- API responds but app crashes
- "Invalid JSON" errors
- Unexpected response format

**Solution:**
The app has fallback mechanisms, but if they're not working:

1. **Check aiService.js parsing:**
   - The `parseJson` function handles response cleaning
   - Logs will show "Invalid quiz/flashcards structure"

2. **Verify model output:**
   - Run `node backend/test-current-api.js` to see raw responses
   - Check if model is returning valid JSON

3. **Update prompt engineering:**
   - Prompts in `aiService.js` are designed for JSON output
   - If model changes behavior, prompts may need adjustment

---

## 🔧 Debugging Commands

### Test API Connection
```bash
node backend/test-current-api.js
```

### Run Full Diagnostics
```bash
node backend/diagnose-gemini.js
```

### Check Environment Variables
```bash
node backend/verify-env.js
```

### Check Recent Errors
```bash
# On your server
tail -n 50 backend/logs/ai.log
tail -n 50 backend/logs/error.log
```

### Test Specific Function
```javascript
// In Node.js REPL on server
import { generateAIQuiz } from './src/services/aiService.js';
const result = await generateAIQuiz("Test text about JavaScript", 2);
console.log(result);
```

---

## 📊 Monitoring API Usage

### Check Quota Status
Visit: https://ai.dev/rate-limit

### Monitor Logs
Your app logs all Gemini API errors to:
- `backend/logs/ai.log` - AI-specific logs
- `backend/logs/error.log` - General errors

### Set Up Alerts
Consider setting up monitoring for:
- 429 errors (quota exceeded)
- 401/403 errors (auth issues)
- High error rates

---

## 🆘 Still Not Working?

### Checklist:

- [ ] Environment variables set in production platform
- [ ] Redeployed after setting env vars
- [ ] API key is valid (test with `test-current-api.js`)
- [ ] API key has available quota
- [ ] Model name is correct (`gemini-2.5-flash-lite`)
- [ ] Server can reach Google APIs (no firewall blocking)
- [ ] Logs checked for specific error messages

### Get Help:

1. **Check logs first:**
   ```bash
   tail -n 100 backend/logs/ai.log
   ```

2. **Run diagnostics:**
   ```bash
   node backend/diagnose-gemini.js
   ```

3. **Test with curl:**
   ```bash
   curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
     "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=YOUR_API_KEY"
   ```

4. **Check Google AI Studio:**
   - Visit: https://aistudio.google.com
   - Test your API key there
   - Check quota usage

---

## 📝 Production Deployment Checklist

Before deploying to production:

- [ ] Set `GEMINI_API_KEY` in production environment
- [ ] Set `GEMINI_MODEL=gemini-2.5-flash-lite`
- [ ] Set `NODE_ENV=production`
- [ ] Set correct `CLIENT_URL` (your frontend URL)
- [ ] Run `verify-env.js` to confirm all vars are set
- [ ] Redeploy backend after setting env vars
- [ ] Test quiz generation with a real PDF
- [ ] Test flashcard generation
- [ ] Test document Q&A
- [ ] Monitor logs for first few hours
- [ ] Set up quota alerts if using heavily

---

## 💡 Best Practices

1. **Use environment-specific API keys:**
   - Development key for local testing
   - Production key for deployed app
   - Helps track usage separately

2. **Implement rate limiting:**
   - Prevent users from spamming API
   - Protects your quota

3. **Cache responses when possible:**
   - Same document = same quiz/flashcards
   - Reduces API calls

4. **Monitor quota usage:**
   - Check daily usage
   - Set up alerts before hitting limits

5. **Have fallback mechanisms:**
   - App already has fallback quiz/flashcard generation
   - Ensures app works even if API fails

---

## 🔗 Useful Links

- **Google AI Studio:** https://aistudio.google.com
- **API Documentation:** https://ai.google.dev/docs
- **Rate Limits:** https://ai.google.dev/gemini-api/docs/rate-limits
- **Pricing:** https://ai.google.dev/pricing
- **Quota Monitor:** https://ai.dev/rate-limit
