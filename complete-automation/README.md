# 🤖 AppDev Complete Automation

**One command to deploy EVERYTHING: Frontend + Backend + Domain + SSL**

---

## 🎯 What This Does

### **Single Command Deployment:**
```bash
./deploy-from-mac.sh
```

**Deploys:**
- ✅ React Frontend (Landing Page + Dashboard)
- ✅ Node.js Backend API
- ✅ Nginx Reverse Proxy
- ✅ SSL Certificates (HTTPS)
- ✅ Database Migrations
- ✅ PM2 Process Management
- ✅ Domain Configuration

**Time:** 5 minutes (after DNS is configured)

---

## 📦 What's Included

### **Scripts:**
1. **deploy-from-mac.sh** - Run from your Mac (master script)
2. **deploy-all.sh** - Runs on EC2 (automated by Mac script)

### **Frontend:**
- Beautiful React landing page
- User authentication UI
- App creation interface
- Responsive design (Tailwind CSS)
- Integrated with your API

### **Backend:**
- Already built and working!
- Just gets redeployed automatically

---

## 🚀 Quick Start

### **Prerequisites:**
1. ✅ EC2 instance running (you have this)
2. ✅ Backend API working (you have this)
3. ⏳ DNS configured in Google Cloud (need to do)

### **Setup (One Time):**

```bash
# On your Mac
cd ~/Desktop/appdev-platform

# Extract automation files
tar -xzf ~/Downloads/complete-automation.tar.gz

# Copy scripts
cp complete-automation/scripts/deploy-from-mac.sh .
cp complete-automation/scripts/deploy-all.sh .

# Copy frontend
cp -r complete-automation/frontend .

# Make scripts executable
chmod +x deploy-from-mac.sh deploy-all.sh

# Commit to GitHub
git add .
git commit -m "Add complete automation"
git push origin main
```

---

## 🌐 DNS Configuration (Required First)

### **In Google Cloud Console:**

1. Go to: **Cloud DNS** → Your Zone
2. Add TWO A records:

**Record 1 (Main Domain):**
```
Name: @
Type: A
TTL: 600
Data: 3.108.254.127
```

**Record 2 (API Subdomain):**
```
Name: api
Type: A
TTL: 600
Data: 3.108.254.127
```

3. **Save** and wait 10-30 minutes

4. **Verify DNS:**
```bash
nslookup appdev.co.in
nslookup api.appdev.co.in
# Both should show: 3.108.254.127
```

---

## 🎯 Deployment

### **After DNS is Configured:**

```bash
cd ~/Desktop/appdev-platform
./deploy-from-mac.sh
```

**That's it!** One command deploys everything!

---

## 📊 What Happens Automatically

### **On Your Mac:**
1. ✅ Commits any changes
2. ✅ Pushes to GitHub
3. ✅ Triggers EC2 deployment

### **On EC2 (Automatic):**
1. ✅ Pulls latest code
2. ✅ Installs dependencies
3. ✅ Builds frontend
4. ✅ Runs database migrations
5. ✅ Configures Nginx
6. ✅ Obtains SSL certificates
7. ✅ Restarts all services
8. ✅ Runs health checks

---

## 🎉 Result

### **After Deployment:**

**Your URLs:**
```
https://appdev.co.in          → Frontend (Landing Page)
https://api.appdev.co.in      → Backend API
```

**Services Running:**
- ✅ React Frontend on Nginx
- ✅ Node.js API on PM2
- ✅ PostgreSQL Database (RDS)
- ✅ SSL Certificates (Auto-renewing)

---

## 🔄 Making Changes

### **Update Frontend:**
```bash
# Edit files in frontend/
nano frontend/index.html

# Deploy
./deploy-from-mac.sh
```

### **Update Backend:**
```bash
# Edit files in backend/
nano backend/api/src/index.js

# Deploy
./deploy-from-mac.sh
```

### **Update Anything:**
```bash
# Make your changes
# Then just run:
./deploy-from-mac.sh
```

**ONE COMMAND UPDATES EVERYTHING!**

---

## 💰 Total Cost

### **Monthly:**
- EC2 (t3.micro): ~$8-10/month
- RDS (db.t3.micro): ~$15-20/month
- S3: ~$5/month
- **Total: ~$28-35/month**

### **One-Time:**
- Domain: Already paid
- SSL: $0 (Let's Encrypt - Free)
- Setup: $0 (Automated)

---

## 🐛 Troubleshooting

### **DNS Not Working:**
```bash
# Check DNS propagation
nslookup appdev.co.in
nslookup api.appdev.co.in

# If not showing 3.108.254.127, wait longer or check Google Cloud DNS
```

### **SSL Fails:**
```bash
# Make sure DNS is working first!
# Then re-run deployment:
./deploy-from-mac.sh
```

### **Frontend Not Loading:**
```bash
# SSH to EC2 and check
ssh -i ~/Desktop/appdev-backend-key.pem ubuntu@3.108.254.127
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### **API Not Working:**
```bash
# Check PM2
ssh -i ~/Desktop/appdev-backend-key.pem ubuntu@3.108.254.127
pm2 logs appdev-api
pm2 restart appdev-api
```

---

## 📋 Manual Commands (If Needed)

### **Restart Everything:**
```bash
ssh -i ~/Desktop/appdev-backend-key.pem ubuntu@3.108.254.127
sudo systemctl restart nginx
pm2 restart all
```

### **View Logs:**
```bash
# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# API logs
pm2 logs appdev-api

# SSL logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

### **Update SSL:**
```bash
sudo certbot renew
sudo systemctl reload nginx
```

---

## ✅ Checklist

### **Before First Deployment:**
- [ ] EC2 instance running
- [ ] Backend API working (port 3000)
- [ ] DNS configured in Google Cloud
- [ ] DNS propagated (10-30 min wait)
- [ ] Automation scripts in place

### **After First Deployment:**
- [ ] Frontend loads at https://appdev.co.in
- [ ] API works at https://api.appdev.co.in/health
- [ ] Can register/login on frontend
- [ ] Can submit prompts
- [ ] SSL certificate valid

---

## 🎊 Future Deployments

**Every time you make changes:**

```bash
./deploy-from-mac.sh
```

**That's it!** 

- No manual steps
- No SSH commands
- No configuration
- Just ONE command

---

## 💪 What You've Achieved

### **Before (Manual):**
```
1. Edit files
2. git add, commit, push
3. SSH to EC2
4. git pull
5. npm install
6. Build frontend
7. Copy files to /var/www
8. Restart nginx
9. Restart PM2
10. Test manually
```
**~20 steps, 15+ minutes, error-prone**

### **After (Automated):**
```
1. Edit files
2. ./deploy-from-mac.sh
```
**2 steps, 5 minutes, perfect every time** ✨

---

## 🚀 You're Now Fully Automated!

**Complete platform with:**
- ✅ Beautiful frontend
- ✅ Powerful backend
- ✅ Custom domains
- ✅ HTTPS/SSL
- ✅ ONE-COMMAND deployment

**From idea to production in 5 minutes!**

---

## 📞 Need Help?

**Check:**
1. DNS is configured and propagated
2. EC2 is running
3. GitHub has latest code
4. Run ./deploy-from-mac.sh

**99% of issues are DNS-related!**

---

## 🎉 Congratulations!

You now have a **production-grade, fully automated, AI-powered app development platform!**

**Enjoy your superpower!** 🚀✨
