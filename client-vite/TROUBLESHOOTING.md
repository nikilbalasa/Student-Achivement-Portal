# Troubleshooting Guide

## Registration Error: "Something went wrong. Please try again."

If you're getting this error when trying to register, check the following:

### 1. Backend Server Status
Make sure your backend server is running:
```bash
cd Studentportal-main
npm run dev
```

The server should start on `http://localhost:5000` and show:
```
Server listening on port 5000
```

### 2. Check Browser Console
Open your browser's Developer Tools (F12) and check the Console tab for detailed error messages.

### 3. Check Network Tab
In Developer Tools, go to the Network tab and look for the registration request:
- Status should be 200 (success) or show the actual error code
- Check the Response tab to see the server's error message

### 4. Common Issues

#### Backend Not Running
**Error**: "Cannot connect to server. Please check if the backend is running."
**Solution**: Start the backend server first

#### MongoDB Connection Issue
**Error**: Backend crashes or shows MongoDB connection error
**Solution**: 
- Check your `.env` file in the backend root
- Verify `MONGO_URI` is correct
- Make sure MongoDB Atlas allows connections from your IP

#### CORS Error
**Error**: CORS policy error in browser console
**Solution**: Backend should have CORS enabled (already configured in `app.js`)

#### Email Already Exists
**Error**: "Email already registered"
**Solution**: Use a different email address or login with existing account

#### Validation Error
**Error**: Missing required fields
**Solution**: Make sure all required fields are filled:
- Name (required)
- Email (required)
- Password (required, min 6 characters)

### 5. Test Backend Connection

Test if backend is accessible:
```bash
curl http://localhost:5000/health
```

Should return: `{"status":"ok"}`

### 6. Environment Variables

Make sure your frontend `.env` file (in `client-vite` folder) has:
```env
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
```

### 7. Clear Browser Cache

Sometimes cached data can cause issues:
- Clear browser cache
- Clear localStorage: In console, run `localStorage.clear()`
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### 8. Check Backend Logs

Look at your backend terminal for error messages. Common errors:
- MongoDB connection failed
- Missing environment variables
- Port already in use

### Still Having Issues?

1. Check the browser console for the exact error message
2. Check the backend terminal for server errors
3. Verify MongoDB connection is working
4. Make sure all dependencies are installed in both frontend and backend

