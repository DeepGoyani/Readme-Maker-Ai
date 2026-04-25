# 🚀 Deployment Guide - Readme Maker AI

## 📋 Prerequisites

- **GitHub OAuth App** set up with proper callback URL
- **MongoDB Atlas** database
- **Google Gemini API** key (replacing OpenAI)
- **Render account** (free tier available)

## 🔧 Environment Variables

### Backend Environment Variables
```bash
NODE_ENV=production
PORT=5003
MONGODB_URI=mongodb+srv://your-db-url
JWT_SECRET=your-jwt-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
FRONTEND_URL=https://your-frontend-url.onrender.com
GEMINI_API_KEY=AIzaSyDaORd4QK-SPeVbtId_0ujR2VcJvsv5XDA
```

### Frontend Environment Variables
```bash
VITE_API_URL=https://your-backend-url.onrender.com
VITE_GITHUB_CLIENT_ID=your-github-client-id
```

## 🎯 Render Deployment Steps

### 1. Deploy Backend

1. **Create new Web Service** on Render
2. **Connect GitHub repository**
3. **Configure settings:**
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Root Directory: `backend`

4. **Add Environment Variables** (see above)
5. **Deploy**

### 2. Deploy Frontend

1. **Create new Web Service** on Render
2. **Connect GitHub repository**
3. **Configure settings:**
   - Environment: `Static Site`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Root Directory: `.` (root)

4. **Add Environment Variables** (see above)
5. **Deploy**

## 🔧 GitHub OAuth Setup

1. **Create GitHub OAuth App**
   - Homepage URL: `https://your-frontend-url.onrender.com`
   - Callback URL: `https://your-frontend-url.onrender.com/oauth/callback`

2. **Update Environment Variables**
   - Copy Client ID and Secret to Render

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failed - Missing Script**
   - ✅ Fixed: Added `build` script to backend package.json

2. **Port Conflicts**
   - Backend uses port 5003
   - Frontend uses port 8083 (dev) / 80 (production)

3. **CORS Issues**
   - Ensure `FRONTEND_URL` matches deployed frontend URL
   - Check CORS configuration in backend

4. **OAuth Redirect Issues**
   - Verify GitHub callback URL matches deployed frontend
   - Check environment variables are correct

5. **Database Connection**
   - Ensure MongoDB URI is accessible from Render
   - Check network access in MongoDB Atlas

## 🎨 Features Working

### ✅ Implemented Features

1. **GitHub OAuth Authentication**
   - Login with GitHub
   - Token management
   - User profile fetching

2. **Repository Management**
   - Fetch user repositories
   - Repository navigation
   - URL encoding for repo names

3. **README Generation**
   - 4 unique templates: Modern, Minimal, Detailed, Premium
   - Google Gemini API integration
   - Fallback templates for reliability

4. **Profile README**
   - Generate personal profile README
   - Comprehensive user stats
   - Professional formatting

5. **UI/UX**
   - Modern design with clay morphism
   - Responsive layout
   - Copy and download functionality

### 🔧 Template Differences

- **Modern**: Visual appeal, badges, emojis (800 words)
- **Minimal**: Ultra-concise, essential info only (200 words)
- **Detailed**: Comprehensive technical documentation (2000 words)
- **Premium**: Enterprise-grade, business focus (3000 words)

## 📱 Testing After Deployment

1. **Test OAuth Flow**
   - Visit deployed frontend
   - Click "Connect GitHub"
   - Verify redirect and authentication

2. **Test Repository Fetching**
   - Check repositories load correctly
   - Verify navigation to generate page

3. **Test README Generation**
   - Try all 4 templates
   - Verify unique content generation
   - Test copy and download features

4. **Test Profile README**
   - Generate profile README
   - Verify comprehensive stats
   - Test modal functionality

## 🚀 Performance Optimization

1. **Backend**
   - MongoDB connection pooling
   - Request caching
   - Error handling

2. **Frontend**
   - Lazy loading
   - Code splitting
   - Image optimization

3. **API**
   - Rate limiting
   - Request validation
   - Error responses

## 📊 Monitoring

1. **Render Dashboard**
   - Service health
   - Build logs
   - Performance metrics

2. **MongoDB Atlas**
   - Database performance
   - Query optimization
   - Connection monitoring

3. **GitHub API**
   - Rate limiting
   - Error handling
   - Token refresh

## 🔄 Continuous Deployment

Render automatically deploys on:
- Push to main branch
- Pull requests
- Manual deploys

## 📞 Support

For deployment issues:
1. Check Render logs
2. Verify environment variables
3. Test API endpoints
4. Check GitHub OAuth settings

---

**Last Updated**: ${new Date().toISOString().split('T')[0]}
**Version**: 2.0.0
