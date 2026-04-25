# 🔐 GitHub OAuth Setup Instructions

## 📋 Required OAuth App Configuration

Your backend is deployed at: `https://readme-maker-ai.onrender.com`

### 1. Update GitHub OAuth App Settings

Go to: https://github.com/settings/applications

#### For your existing OAuth app, update these settings:

**Homepage URL:**
```
https://readme-maker-ai-frontend.onrender.com
```

**Authorization callback URL:**
```
https://readme-maker-ai-frontend.onrender.com/callback
```

### 2. Environment Variables Already Updated

✅ **Frontend (.env):**
- `VITE_API_URL=https://readme-maker-ai.onrender.com/api`

✅ **Backend (.env):**
- `FRONTEND_URL=https://readme-maker-ai-frontend.onrender.com`

✅ **OAuth Redirect:**
- Now uses `${window.location.origin}/callback` (dynamic)

### 3. Deploy Frontend

1. Go to Render dashboard
2. Create new Static Site service
3. Connect to your GitHub repository
4. Root directory: `.`
5. Build command: `npm install && npm run build`
6. Publish directory: `dist`
7. Add environment variables:
   - `VITE_API_URL=https://readme-maker-ai.onrender.com/api`
   - `VITE_GITHUB_CLIENT_ID=Ov23liGaCm4tZzANB4lt`

### 4. Test the Application

After deploying frontend:

1. **Visit:** `https://readme-maker-ai-frontend.onrender.com`
2. **Click:** "Connect GitHub"
3. **Verify:** OAuth redirect works correctly
4. **Test:** Repository fetching and README generation

### 5. Troubleshooting

#### If OAuth fails:
- Check GitHub OAuth app callback URL matches deployed frontend
- Verify environment variables in both services
- Check Render logs for errors

#### If CORS issues:
- Verify `FRONTEND_URL` in backend environment
- Check CORS configuration in server.js

#### If API calls fail:
- Verify `VITE_API_URL` in frontend environment
- Check backend is running and accessible

### 6. Complete Flow

```
User → Frontend (Render) → GitHub OAuth → Backend (Render) → MongoDB → Gemini API → Response
```

All services are now configured for production deployment! 🚀
