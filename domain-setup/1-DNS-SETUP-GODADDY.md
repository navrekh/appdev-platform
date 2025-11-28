# DNS Setup Instructions for GoDaddy

## 🌐 Configure api.appdev.co.in to Point to Your EC2

Follow these steps to add the API subdomain while keeping your main site on Google Cloud.

---

## 📋 Step-by-Step Instructions:

### 1. Login to GoDaddy
Go to: https://dcc.godaddy.com/
- Login with your credentials
- Navigate to "My Products"
- Click "DNS" next to appdev.co.in

---

### 2. Add A Record for API Subdomain

Click **"Add"** button and create a new record:

```
Type: A
Name: api
Data: 3.108.254.127
TTL: 600 seconds (10 minutes)
```

**Important:** 
- Name should be just "api" (not "api.appdev.co.in")
- GoDaddy will automatically append .appdev.co.in

---

### 3. Verify Current Records

Make sure your existing records for the main domain remain:
- Keep any A records pointing to Google Cloud IP
- Keep any CNAME records
- Keep MX records (email)
- Don't delete anything!

**We're ONLY adding the "api" subdomain.**

---

### 4. Save Changes

Click **"Save"** button.

DNS changes typically propagate in:
- **Minimum:** 10 minutes (TTL setting)
- **Average:** 30 minutes - 1 hour
- **Maximum:** 24-48 hours (rare)

---

### 5. Verify DNS Propagation

After 10-15 minutes, test if DNS is working:

**On your Mac:**
```bash
# Check if api.appdev.co.in points to your EC2
nslookup api.appdev.co.in

# Should show:
# Name: api.appdev.co.in
# Address: 3.108.254.127
```

Or use online tool:
https://dnschecker.org/#A/api.appdev.co.in

---

## ✅ Expected Result:

After DNS propagates:
- `appdev.co.in` → Still points to Google Cloud (unchanged)
- `api.appdev.co.in` → Points to your EC2 (new)

---

## 📊 Summary:

**What You're Adding:**
```
Subdomain: api.appdev.co.in
Type: A Record
IP Address: 3.108.254.127
```

**What Stays The Same:**
```
Main domain: appdev.co.in
Existing Google Cloud setup: Unchanged
Email records: Unchanged
```

---

## 🚨 Important Notes:

1. **Don't delete existing records** - Only ADD the new api subdomain
2. **Wait for propagation** - DNS changes take time
3. **Test before SSL** - Make sure DNS works before running SSL setup
4. **Keep Google Cloud running** - Your main site stays there

---

## 🎯 Next Steps:

After DNS propagates (10-30 minutes):

1. Verify DNS with `nslookup api.appdev.co.in`
2. Run the Nginx + SSL setup script on EC2
3. Your API will be live at https://api.appdev.co.in

---

## 💡 Troubleshooting:

**If DNS doesn't work after 1 hour:**
- Double-check the A record in GoDaddy
- Make sure Type is "A" not "CNAME"
- Make sure Name is exactly "api"
- Clear your DNS cache: `sudo dscacheutil -flushcache` (Mac)

**Need help?**
Check current DNS: https://dnschecker.org/#A/api.appdev.co.in
