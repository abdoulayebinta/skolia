# Deployment Guide

## Backend Deployment (Render)

### Option 1: Using Render Dashboard (Recommended)

1. **Go to Render Dashboard** (https://dashboard.render.com)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository: `snapdev-support/app-cf7a10f4`

3. **Configure the Service**
   - **Name**: `idellia-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable" and add:

   ```
   APP_ENV=production
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key_min_32_characters_long
   JWT_EXPIRES_IN=86400
   CORS_ORIGINS=https://your-frontend-url.vercel.app,http://localhost:3000
   ```

   **Important**:
   - Replace `your_mongodb_connection_string` with your actual MongoDB Atlas connection string
   - Replace `your_super_secret_key_min_32_characters_long` with a secure random string (min 32 chars)
   - Replace `https://your-frontend-url.vercel.app` with your actual frontend URL

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your backend will be available at: `https://your-service-name.onrender.com`

### Option 2: Using render.yaml (Blueprint)

If you have a `render.yaml` file in your repository:

1. Go to Render Dashboard
2. Click "New +" → "Blueprint"
3. Connect your repository
4. Render will automatically detect the `render.yaml` and configure everything
5. You'll still need to add the environment variables manually

### Verifying Backend Deployment

Once deployed, test these endpoints:

1. **Health Check**: `https://your-backend-url.onrender.com/healthz`
   - Should return: `{"status": "ok", "database": "connected", ...}`

2. **API Docs**: `https://your-backend-url.onrender.com/docs`
   - Should show the FastAPI interactive documentation

3. **Root**: `https://your-backend-url.onrender.com/`
   - Should return API information

### Common Issues & Solutions

#### Issue: "Application exited early"

**Solution**: Make sure the start command is correct:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

#### Issue: "Port scan timeout"

**Solution**: Ensure your app binds to `0.0.0.0` and uses the `$PORT` environment variable

#### Issue: "Database disconnected"

**Solution**:

- Check your MongoDB connection string is correct
- Ensure your MongoDB Atlas allows connections from Render's IP addresses (0.0.0.0/0 for testing)
- Verify the database user has proper permissions

#### Issue: CORS errors

**Solution**: Add your frontend URL to `CORS_ORIGINS` environment variable

---

## Frontend Deployment (Vercel)

### Deploy to Vercel

1. **Install Vercel CLI** (optional)

   ```bash
   npm install -g vercel
   ```

2. **Deploy via Vercel Dashboard** (Recommended)
   - Go to https://vercel.com
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select the `frontend` directory as the root
   - Vercel will auto-detect Next.js settings

3. **Add Environment Variable**
   - In Vercel project settings → "Environment Variables"
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-url.onrender.com`

4. **Deploy**
   - Click "Deploy"
   - Your frontend will be available at: `https://your-project.vercel.app`

### Update Backend CORS

After deploying frontend, update your backend's `CORS_ORIGINS` environment variable:

```
CORS_ORIGINS=https://your-project.vercel.app,http://localhost:3000
```

Then redeploy the backend.

---

## MongoDB Atlas Setup

If you haven't set up MongoDB Atlas yet:

1. **Create Account**: https://www.mongodb.com/cloud/atlas/register
2. **Create Cluster**:
   - Choose free tier (M0)
   - Select region closest to your backend
3. **Create Database User**:
   - Database Access → Add New Database User
   - Choose password authentication
   - Save username and password
4. **Whitelist IP Addresses**:
   - Network Access → Add IP Address
   - For testing: Allow access from anywhere (0.0.0.0/0)
   - For production: Add Render's IP ranges
5. **Get Connection String**:
   - Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `idellia` (or your preferred name)

---

## Testing the Full Stack

1. **Test Backend Health**:

   ```bash
   curl https://your-backend-url.onrender.com/healthz
   ```

2. **Test Frontend**:
   - Visit `https://your-project.vercel.app`
   - Try signing up as an educator
   - Create a test journey

3. **Test Integration**:
   - Open browser console (F12)
   - Check Network tab for API calls
   - Verify no CORS errors
   - Verify successful API responses

---

## Monitoring & Logs

### Backend Logs (Render)

- Dashboard → Your Service → Logs tab
- View real-time logs and errors

### Frontend Logs (Vercel)

- Dashboard → Your Project → Deployments → View Function Logs
- Check for build errors or runtime issues

---

## Updating Deployments

### Backend Updates

1. Push changes to GitHub
2. Render will automatically redeploy (if auto-deploy is enabled)
3. Or manually trigger deploy from Render dashboard

### Frontend Updates

1. Push changes to GitHub
2. Vercel will automatically redeploy
3. Or manually trigger deploy from Vercel dashboard

---

## Production Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Backend deployed to Render
- [ ] Backend environment variables set
- [ ] Backend health check returns "ok"
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variable set (NEXT_PUBLIC_API_URL)
- [ ] CORS configured with frontend URL
- [ ] Test user signup/login works
- [ ] Test journey creation works
- [ ] Test student journey access works
- [ ] Monitor logs for errors
- [ ] Set up custom domain (optional)

---

## Support

If you encounter issues:

1. Check the logs in Render/Vercel dashboards
2. Verify all environment variables are set correctly
3. Test each component individually (database, backend, frontend)
4. Check CORS configuration
5. Ensure MongoDB allows connections from your backend
