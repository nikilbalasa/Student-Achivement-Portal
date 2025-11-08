# Quick Start Guide - Backend Server

## Step 1: Create .env File

Create a `.env` file in the backend root directory (`Studentportal-main/Studentportal-main/`) with your MongoDB connection string:

```env
PORT=5000
MONGO_URI=your-mongodb-atlas-connection-string
MONGO_DB_NAME=student_achievements
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

**Important**: Replace `your-mongodb-atlas-connection-string` with your actual MongoDB Atlas connection string.

## Step 2: Install Dependencies (if not already done)

```bash
cd Studentportal-main/Studentportal-main
npm install
```

## Step 3: Start the Backend Server

```bash
npm run dev
```

You should see:
```
Connected to MongoDB
Server listening on port 5000
```

## Step 4: Verify Backend is Running

Open your browser and go to: `http://localhost:5000/health`

You should see: `{"status":"ok"}`

## Troubleshooting

### MongoDB Connection Error
- Check your MongoDB Atlas connection string
- Make sure your IP is whitelisted in MongoDB Atlas
- Verify the username and password are correct

### Port Already in Use
- Change PORT in .env file to a different port (e.g., 5001)
- Or stop the process using port 5000

### Missing Dependencies
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then run `npm install`

