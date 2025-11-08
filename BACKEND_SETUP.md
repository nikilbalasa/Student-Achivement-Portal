# Backend Server Setup & Start Guide

## ⚠️ IMPORTANT: Backend Must Be Running First!

The frontend cannot connect to the backend if it's not running. Follow these steps:

## Step 1: Navigate to Backend Directory

Open a **NEW terminal window** and navigate to the backend:

```bash
cd "C:\Users\racha\Downloads\Studentportal-main\Studentportal-main"
```

## Step 2: Create .env File

Create a file named `.env` in the backend root directory with this content:

```env
PORT=5000
MONGO_URI=your-mongodb-atlas-connection-string-here
MONGO_DB_NAME=student_achievements
JWT_SECRET=my-super-secret-jwt-key-12345
JWT_EXPIRES_IN=7d
```

**Replace `your-mongodb-atlas-connection-string-here` with your actual MongoDB Atlas connection string.**

Example MongoDB URI format:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## Step 3: Install Dependencies (if needed)

```bash
npm install
```

## Step 4: Start the Backend Server

```bash
npm run dev
```

**You should see:**
```
Connected to MongoDB
Server listening on port 5000
```

## Step 5: Verify Backend is Running

1. Open your browser
2. Go to: `http://localhost:5000/health`
3. You should see: `{"status":"ok"}`

## Step 6: Now Start Frontend

In a **DIFFERENT terminal window**, start the frontend:

```bash
cd "C:\Users\racha\Downloads\Studentportal-main\Studentportal-main\client-vite"
npm run dev
```

## Common Issues

### ❌ "Cannot connect to server"
- **Solution**: Make sure backend is running (Step 4)
- Check terminal shows "Server listening on port 5000"

### ❌ MongoDB Connection Error
- **Solution**: 
  - Check your `.env` file has correct `MONGO_URI`
  - Verify MongoDB Atlas allows connections from your IP
  - Check username/password are correct

### ❌ Port 5000 Already in Use
- **Solution**: 
  - Change `PORT=5000` to `PORT=5001` in `.env`
  - Update frontend `.env` to match: `VITE_API_URL=http://localhost:5001/api`

### ❌ Missing Dependencies
- **Solution**: Run `npm install` in the backend directory

## Quick Test

Once backend is running, test the registration endpoint:
```bash
curl http://localhost:5000/api/auth/register -X POST -H "Content-Type: application/json" -d "{\"name\":\"Test\",\"email\":\"test@test.com\",\"password\":\"test123\"}"
```

---

**Remember**: Keep the backend terminal window open while developing!

