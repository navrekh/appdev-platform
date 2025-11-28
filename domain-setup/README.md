# 🌐 Custom Domain Setup for AppDev Platform

Complete guide to configure `api.appdev.co.in` with HTTPS for your API.

---

## 📋 Overview

**What You'll Get:**
- ✅ `https://api.appdev.co.in` → Your Backend API (EC2)
- ✅ `https://appdev.co.in` → Your Main Site (Google Cloud) - unchanged
- ✅ Free SSL certificate (Let's Encrypt)
- ✅ Auto-renewal of SSL
- ✅ Nginx reverse proxy
- ✅ CORS configured

---

## 🎯 3-Step Process

### **Step 1: Open AWS Ports** (2 minutes)
**On your Mac:**
```bash
chmod +x 0-open-ports.sh
./0-open-ports.sh
```

This opens ports 80 (HTTP) and 443 (HTTPS) in your EC2 security group.

---

### **Step 2: Configure DNS** (5 minutes + 10-30 min wait)
**Follow instructions in:** `1-DNS-SETUP-GODADDY.md`

**Quick summary:**
1. Login to GoDaddy DNS management
2. Add A Record:
   - Type: A
   - Name: api
   - Data: 3.108.254.127
   - TTL: 600
3. Save
4. Wait 10-30 minutes for DNS propagation

**Verify DNS:**
```bash
nslookup api.appdev.co.in
# Should show: 3.108.254.127
```

---

### **Step 3: Setup Nginx + SSL** (5 minutes)
**After DNS propagates, on EC2:**

```bash
# Upload the script
# (Use sync.sh to sync all files, or scp manually)

# Make executable
chmod +x 2-setup-domain.sh

# Run as root
sudo ./2-setup-domain.sh
```

**This script automatically:**
- ✅ Installs Nginx
- ✅ Configures reverse proxy
- ✅ Obtains SSL certificate
- ✅ Configures HTTPS redirect
- ✅ Sets up auto-renewal
- ✅ Tests everything

---

## ⏱️ Total Time

- **Active work:** 12 minutes
- **Waiting for DNS:** 10-30 minutes
- **Total:** ~30-45 minutes

---

## 🎉 Result

After completion:

**Your API will be accessible at:**
```
https://api.appdev.co.in/health
https://api.appdev.co.in/api/auth/register
https://api.appdev.co.in/api/auth/login
https://api.appdev.co.in/api/prompts
https://api.appdev.co.in/api/apps
https://api.appdev.co.in/api/builds
```

**Your main site stays unchanged:**
```
https://appdev.co.in → Google Cloud (unchanged)
```

---

## 🔒 Security

- ✅ Free SSL certificate from Let's Encrypt
- ✅ Automatic HTTPS redirect
- ✅ Certificate auto-renews every 90 days
- ✅ CORS properly configured
- ✅ Security headers enabled

---

## 📊 What Gets Configured

### Nginx Configuration
```
Location: /etc/nginx/sites-available/appdev
Proxy: localhost:3000 → api.appdev.co.in
Ports: 80 (HTTP) → redirects to 443 (HTTPS)
```

### SSL Certificate
```
Provider: Let's Encrypt
Validity: 90 days
Auto-renewal: Yes (via certbot timer)
Location: /etc/letsencrypt/live/api.appdev.co.in/
```

### Reverse Proxy
```
External: https://api.appdev.co.in
Internal: http://localhost:3000
```

---

## 🐛 Troubleshooting

### DNS Not Propagating
```bash
# Check DNS status
nslookup api.appdev.co.in

# Check globally
https://dnschecker.org/#A/api.appdev.co.in

# Clear local DNS cache (Mac)
sudo dscacheutil -flushcache
```

### SSL Certificate Fails
```bash
# Make sure DNS is working first!
nslookup api.appdev.co.in

# Check if ports are open
curl http://api.appdev.co.in

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Nginx Issues
```bash
# Check Nginx status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# View logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### SSL Renewal Issues
```bash
# Test renewal
sudo certbot renew --dry-run

# Force renewal
sudo certbot renew --force-renewal

# Check timer status
sudo systemctl status certbot.timer
```

---

## 🔄 Maintenance

### Renew SSL Manually (if needed)
```bash
sudo certbot renew
sudo systemctl reload nginx
```

### Update Nginx Config
```bash
sudo nano /etc/nginx/sites-available/appdev
sudo nginx -t
sudo systemctl reload nginx
```

### Check SSL Status
```bash
sudo certbot certificates
```

---

## 💡 Useful Commands

### Nginx
```bash
sudo systemctl start nginx      # Start
sudo systemctl stop nginx       # Stop
sudo systemctl restart nginx    # Restart
sudo systemctl reload nginx     # Reload config
sudo systemctl status nginx     # Check status
sudo nginx -t                   # Test config
```

### SSL/Certbot
```bash
sudo certbot certificates       # List certificates
sudo certbot renew             # Renew all certificates
sudo certbot delete            # Delete certificate
```

### Logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
sudo journalctl -u nginx -f
```

---

## 🎯 After Setup

1. **Test your API:**
   ```bash
   curl https://api.appdev.co.in/health
   ```

2. **Update your apps:**
   Change API URL from:
   ```
   http://3.108.254.127:3000
   ```
   To:
   ```
   https://api.appdev.co.in
   ```

3. **Monitor:**
   ```bash
   sudo tail -f /var/log/nginx/access.log
   ```

---

## 📞 Support

**If you need help:**
1. Check the troubleshooting section
2. Review logs for errors
3. Verify DNS is propagated
4. Make sure ports 80 and 443 are open

---

## ✅ Checklist

Before starting:
- [ ] Domain ownership confirmed
- [ ] Access to GoDaddy DNS
- [ ] EC2 instance running
- [ ] API working on port 3000

Step 1:
- [ ] Ports 80 and 443 opened in AWS
- [ ] Security group updated

Step 2:
- [ ] A record added in GoDaddy
- [ ] DNS propagated (nslookup works)
- [ ] api.appdev.co.in points to 3.108.254.127

Step 3:
- [ ] Nginx installed
- [ ] SSL certificate obtained
- [ ] HTTPS working
- [ ] API accessible via domain

---

## 🎉 Success!

Once complete, your API is production-ready with:
- ✅ Custom domain
- ✅ HTTPS encryption
- ✅ Auto-renewing certificate
- ✅ Professional setup

**Congratulations!** 🚀
