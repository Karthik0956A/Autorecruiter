# 🚀 Quick Fix - MongoDB Setup

## ⚠️ Current Issue
The backend is running but can't connect to MongoDB because it's not installed locally.

## ✅ Quick Solution - Use MongoDB Atlas (Cloud Database - FREE)

### Step 1: Create Free MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with your email (or Google account)
3. Choose **FREE M0 Cluster** (no credit card required)

### Step 2: Create a Cluster
1. After signing in, click **"Build a Database"**
2. Choose **FREE** (M0 Cluster)
3. Select any cloud provider (AWS, Google Cloud, or Azure)
4. Choose region closest to you
5. Click **"Create Cluster"** (takes 3-5 minutes)

### Step 3: Create Database User
1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `talentsense`
5. Password: `talentsense123` (or create your own)
6. Click **"Add User"**

### Step 4: Allow Network Access
1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### Step 5: Get Connection String
1. Go back to **"Database"** (left sidebar)
2. Click **"Connect"** button on your cluster
3. Click **"Connect your application"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://talentsense:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password

### Step 6: Update Backend .env File
Open: `C:\Users\vsman\Autorecruiter\backend\.env`

Replace this line:
```env
MONGODB_URI=mongodb://localhost:27017/talentsense
```

With your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://talentsense:talentsense123@cluster0.xxxxx.mongodb.net/talentsense?retryWrites=true&w=majority
```

### Step 7: Restart Backend Server
1. Stop the backend (Ctrl+C in the backend terminal)
2. Restart: `npm start`
3. You should see: "MongoDB Connected Successfully"

---

## 🎉 Done!

Now try registering again at: http://localhost:5175/register

Your servers are running:
- **Frontend**: http://localhost:5175
- **Backend**: http://localhost:5000

---

## 🐛 Alternative: Local MongoDB (If you prefer)

### Windows Installation:
1. Download: https://www.mongodb.com/try/download/community
2. Run installer with default settings
3. MongoDB service starts automatically
4. Keep `.env` file as is (mongodb://localhost:27017/talentsense)
5. Restart backend

---

## 📝 Notes

- **MongoDB Atlas** is recommended (easier, no installation)
- Free tier includes 512MB storage (plenty for development)
- Connection string must have database name at the end (`/talentsense`)
- If you change password, update it in connection string

---

**Need help? The registration error will go away once MongoDB is connected!**
