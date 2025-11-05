# Deployment Guide for BlogHaven

## Frontend (Netlify)
- **Live URL**: https://bloghaven-draft.netlify.app/
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`

### Environment Variables to Set on Netlify:
```
VITE_API_URL=https://bloghaven-b8no.onrender.com/api
```

## Backend (Render)
- **Live URL**: https://bloghaven-b8no.onrender.com
- **Start Command**: `npm start` (from server directory)
- **Build Command**: `cd server && npm install`

### Environment Variables to Set on Render:
```
PORT=5000
MONGODB_URI=mongodb+srv://febink_db_user:febin@cluster0.z0b7oos.mongodb.net/bloghaven?retryWrites=true&w=majority
JWT_SECRET=bloghaven_super_secret_jwt_key_change_this_in_production_2024
JWT_EXPIRE=7d
FRONTEND_URL=https://bloghaven-draft.netlify.app
NODE_ENV=production
```

### Optional (if using):
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://bloghaven-b8no.onrender.com/api/auth/google/callback
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Testing After Deployment

1. **Backend Health Check**:
   - Visit: https://bloghaven-b8no.onrender.com/
   - Should return JSON with status "OK"

2. **Frontend**:
   - Visit: https://bloghaven-draft.netlify.app/
   - Check browser console for API URL
   - Try login/register

3. **CORS Check**:
   - Open Network tab in browser
   - Make API request from frontend
   - Verify no CORS errors

## Quick Deploy Steps

### Push Changes:
```bash
git add .
git commit -m "Configure for production deployment"
git push origin main
```

### Netlify will auto-deploy when you push to main.
### Render will auto-deploy when you push to main (if auto-deploy is enabled).

## Important Security Notes:
- Rotate MongoDB password (exposed in commit history)
- Change JWT_SECRET to a strong random string
- Enable MongoDB Atlas IP whitelist or use 0.0.0.0/0 for Render's dynamic IPs
- Consider using environment-specific secrets management
