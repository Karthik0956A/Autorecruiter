# Quick MongoDB Setup for TalentSense AI

## Option 1: Install MongoDB Locally (Easiest)

### Download & Install
1. Go to: https://www.mongodb.com/try/download/community
2. Click "Download" for Windows
3. Run the installer
4. Choose "Complete" installation
5. Install MongoDB Compass (GUI tool) - check the box

### Start MongoDB
After installation, MongoDB should start automatically as a Windows service.

To verify:
\`\`\`powershell
# Check if service is running
Get-Service -Name MongoDB

# If not running, start it:
net start MongoDB
\`\`\`

### Verify Connection
1. Open MongoDB Compass (installed with MongoDB)
2. Connect to: `mongodb://localhost:27017`
3. You should see "Connected" status

---

## Option 2: MongoDB Atlas (Free Cloud - No Install)

### Setup (5 minutes)
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google or Email (FREE)
3. Create FREE M0 cluster (shared tier)
4. Choose AWS, any region near you
5. Create cluster (takes 1-3 minutes)

### Get Connection String
1. Click "Connect" button on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like):
   \`\`\`
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   \`\`\`

### Add to Backend
1. Open `backend/.env` file
2. Replace MONGODB_URI:
   \`\`\`env
   MONGODB_URI=mongodb+srv://username:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/talentsense?retryWrites=true&w=majority
   \`\`\`
3. Replace `<password>` with your actual password
4. Add `/talentsense` before `?retryWrites`

### Whitelist IP
1. In Atlas, go to "Network Access"
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (for development)
4. Click "Confirm"

---

## Option 3: Quick Test Without MongoDB

If you want to test quickly without installing MongoDB, I can create an in-memory mock database. Would you like me to do that?

---

## After MongoDB is Running

### Restart Backend
\`\`\`powershell
cd C:\\Users\\vsman\\Autorecruiter\\backend
node server.js
\`\`\`

You should see:
\`\`\`
╔═══════════════════════════════════════╗
║   TalentSense AI Backend Server       ║
║   Running on port 5000                ║
║   Environment: development          ║
╚═══════════════════════════════════════╝

MongoDB Connected: localhost
\`\`\`

---

## Testing Connection

### Test API Health
Open browser or run:
\`\`\`powershell
curl http://localhost:5000/api/health
\`\`\`

Should return:
\`\`\`json
{
  "success": true,
  "status": "ok",
  "uptime_seconds": 10
}
\`\`\`

---

## Troubleshooting

### Port 27017 Already in Use
MongoDB is already running! Just connect.

### Can't Connect After Install
\`\`\`powershell
# Restart MongoDB service
net stop MongoDB
net start MongoDB
\`\`\`

### Still Having Issues
Use MongoDB Atlas (cloud option) - it's easier and free!

---

## Which Option Should You Choose?

- **Local MongoDB**: If you have admin rights and want full control
- **MongoDB Atlas**: If you want zero-setup, cloud-based (RECOMMENDED)
- **Mock Database**: For quick testing only (not persistent)

Let me know which option you'd like to use!
