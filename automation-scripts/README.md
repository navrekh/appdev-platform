# 🤖 AppDev Automation Scripts

Complete automation for deploying and managing your AppDev platform.

## 📦 Scripts Included

### 1. **sync.sh** - Mac to Production Sync
**Run on your Mac** - Automates entire deployment workflow

```bash
./sync.sh "Your commit message"
```

**What it does:**
1. ✅ Commits your changes
2. ✅ Pushes to GitHub
3. ✅ Deploys to EC2 automatically
4. ✅ Runs migrations
5. ✅ Restarts server
6. ✅ Tests endpoints
7. ✅ Shows status

**One command = Complete deployment!**

---

### 2. **deploy.sh** - EC2 Deployment Script  
**Run on EC2** - Deploys latest code from GitHub

```bash
./deploy.sh
```

**What it does:**
1. ✅ Pulls latest code
2. ✅ Installs dependencies
3. ✅ Runs database migrations
4. ✅ Restarts API server
5. ✅ Health checks
6. ✅ Shows status

---

### 3. **test.sh** - API Testing Suite
**Run anywhere** - Tests all API endpoints

```bash
# Test local
./test.sh

# Test production
./test.sh ec2
```

**Tests:**
- Health endpoint
- User registration
- User login
- Get current user
- Submit prompts
- Get apps
- And more!

---

## 🚀 Quick Setup

### On Your Mac:

```bash
cd ~/Desktop/appdev-platform

# Download scripts (already done if you downloaded)
# Make them executable
chmod +x sync.sh test.sh

# Use sync script for all deployments
./sync.sh "Add new feature"
```

### On EC2:

```bash
cd ~/appdev-platform

# Upload deploy script
# (Use sync.sh which does this automatically)

# Or manually:
chmod +x deploy.sh
./deploy.sh
```

---

## 💡 Usage Examples

### Deploy Changes (Most Common)
```bash
# On Mac - make code changes, then:
./sync.sh "Add authentication feature"

# That's it! Everything happens automatically
```

### Manual EC2 Deployment
```bash
# SSH to EC2
ssh -i ~/Desktop/appdev-backend-key.pem ubuntu@3.108.254.127

# Run deployment
cd ~/appdev-platform
./deploy.sh
```

### Run Tests
```bash
# Test production API
./test.sh ec2

# Test local development
./test.sh
```

---

## 🎯 What Gets Automated

### Before (Manual Process):
```bash
# On Mac
git add .
git commit -m "message"
git pull origin main --rebase
git push origin main

# SSH to EC2
ssh -i key.pem ubuntu@ip
cd ~/appdev-platform
git pull origin main
cd backend/api
npm install
cd ../shared/database
npx prisma migrate deploy
pm2 restart appdev-api
curl http://localhost:3000/health
pm2 logs
```

**~15 commands, 5+ minutes**

### After (Automated):
```bash
./sync.sh "message"
```

**1 command, 30 seconds!** ✨

---

## 🔧 Configuration

### Update EC2 IP
Edit `sync.sh`:
```bash
EC2_HOST="YOUR_EC2_IP"
```

### Update Paths
```bash
EC2_KEY="$HOME/Desktop/appdev-backend-key.pem"
PROJECT_DIR="$HOME/Desktop/appdev-platform"
```

---

## 📊 Script Output

### sync.sh Output:
```
🚀 AppDev Sync - Mac → GitHub → EC2

📝 Step 1: Checking for changes...
✅ Changes detected

💾 Step 2: Committing changes...
✅ Changes committed

🔄 Step 3: Syncing with GitHub...
✅ Synced with GitHub

📤 Step 4: Pushing to GitHub...
✅ Pushed to GitHub

🚀 Step 5: Deploying to EC2...
📥 Pulling latest code...
📦 Installing dependencies...
🗄️  Running migrations...
🔄 Restarting server...
✅ Deployment complete!

🎉 Deployment successful!

📊 Your API is live at:
  🌐 http://3.108.254.127:3000/health
```

---

## 🐛 Troubleshooting

### "Permission denied" Error
```bash
chmod +x sync.sh deploy.sh test.sh
```

### "EC2 connection refused"
```bash
# Check EC2 is running
aws ec2 describe-instances --instance-ids i-00335e0dd8245a5be --region ap-south-1

# Start if stopped
aws ec2 start-instances --instance-ids i-00335e0dd8245a5be --region ap-south-1
```

### "Git push rejected"
Already handled automatically by sync.sh with rebase!

---

## 🎉 Benefits

✅ **Zero manual steps** - One command deployment
✅ **Error handling** - Stops on errors
✅ **Health checks** - Verifies deployment worked
✅ **Consistent** - Same process every time
✅ **Fast** - 30 seconds vs 5 minutes
✅ **Safe** - Commits everything, can rollback
✅ **Logs** - See exactly what happened

---

## 📝 Next Steps

1. **Run sync.sh** whenever you make changes
2. **Never manually deploy** - Let automation handle it
3. **Run test.sh** to verify everything works
4. **Enjoy** the extra time! ☕

---

## 🔒 Security Note

The scripts contain your EC2 IP and key path. Keep them private!

Don't commit automation scripts to public repos.

---

## 💪 You're Now Fully Automated!

**Before**: 15 commands, prone to errors, 5+ minutes
**After**: 1 command, consistent, 30 seconds

Enjoy your new superpower! 🚀
