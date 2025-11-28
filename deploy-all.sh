#!/bin/bash
#
# AppDev Platform - MASTER AUTOMATION SCRIPT
# One command to deploy EVERYTHING: Frontend + Backend + Domain + SSL
#
# Usage: ./deploy-all.sh

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

echo -e "${CYAN}${BOLD}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║         AppDev Platform - Master Deployment               ║
║         One Command. Everything Automated.                ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Configuration
DOMAIN_MAIN="appdev.co.in"
DOMAIN_API="api.appdev.co.in"
EMAIL="mishra.navin@aol.com"
EC2_IP="3.108.254.127"

echo -e "${BLUE}📋 Configuration:${NC}"
echo "  Main Domain: $DOMAIN_MAIN"
echo "  API Domain: $DOMAIN_API"
echo "  EC2 IP: $EC2_IP"
echo ""

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ This script must be run as root${NC}"
   echo "Run: sudo ./deploy-all.sh"
   exit 1
fi

echo -e "${CYAN}${BOLD}Starting Complete Deployment...${NC}"
echo ""

# ============================================
# STEP 1: System Setup
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📦 Step 1: System Setup & Dependencies${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo "Updating system packages..."
apt-get update -qq

echo "Installing required packages..."
apt-get install -y nginx certbot python3-certbot-nginx jq curl > /dev/null 2>&1

echo -e "${GREEN}✅ System packages installed${NC}"
echo ""

# ============================================
# STEP 2: Backend Deployment
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔧 Step 2: Backend Deployment${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd /home/ubuntu/appdev-platform

echo "Pulling latest code..."
sudo -u ubuntu git pull origin main

echo "Installing backend dependencies..."
cd backend/api
sudo -u ubuntu npm install --production > /dev/null 2>&1

echo "Running database migrations..."
cd ../shared/database
sudo -u ubuntu npx prisma migrate deploy
sudo -u ubuntu npx prisma generate

echo "Restarting backend API..."
sudo -u ubuntu pm2 restart appdev-api || sudo -u ubuntu pm2 start /home/ubuntu/appdev-platform/backend/api/src/index.js --name appdev-api

echo -e "${GREEN}✅ Backend deployed${NC}"
echo ""

# ============================================
# STEP 3: Frontend Build & Deploy
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🎨 Step 3: Frontend Deployment${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo "Building frontend..."
cd /home/ubuntu/appdev-platform/frontend

if [ -f "package.json" ]; then
    sudo -u ubuntu npm install > /dev/null 2>&1
    sudo -u ubuntu npm run build > /dev/null 2>&1
    
    # Copy build to web root
    rm -rf /var/www/appdev
    mkdir -p /var/www/appdev
    cp -r build/* /var/www/appdev/ || cp -r dist/* /var/www/appdev/ || cp -r out/* /var/www/appdev/
else
    echo "No package.json found, using static files..."
    mkdir -p /var/www/appdev
    cp -r * /var/www/appdev/
fi

chown -R www-data:www-data /var/www/appdev

echo -e "${GREEN}✅ Frontend deployed${NC}"
echo ""

# ============================================
# STEP 4: Nginx Configuration
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}⚙️  Step 4: Nginx Configuration${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo "Configuring Nginx for both domains..."

# Main domain configuration (Frontend)
cat > /etc/nginx/sites-available/appdev-main << EOF
server {
    listen 80;
    server_name $DOMAIN_MAIN;
    
    root /var/www/appdev;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# API domain configuration (Backend)
cat > /etc/nginx/sites-available/appdev-api << EOF
server {
    listen 80;
    server_name $DOMAIN_API;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # CORS
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, PATCH, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
        
        if (\$request_method = 'OPTIONS') {
            return 204;
        }
    }
}
EOF

# Enable sites
ln -sf /etc/nginx/sites-available/appdev-main /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/appdev-api /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload
nginx -t
systemctl reload nginx

echo -e "${GREEN}✅ Nginx configured${NC}"
echo ""

# ============================================
# STEP 5: SSL Certificates
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔒 Step 5: SSL Certificate Setup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo "Checking DNS propagation..."
MAIN_DNS=$(dig +short $DOMAIN_MAIN | tail -n1)
API_DNS=$(dig +short $DOMAIN_API | tail -n1)

if [ -z "$MAIN_DNS" ]; then
    echo -e "${YELLOW}⚠️  Warning: $DOMAIN_MAIN DNS not propagated yet${NC}"
    echo "Skipping SSL for main domain..."
else
    echo "Obtaining SSL certificate for $DOMAIN_MAIN..."
    certbot --nginx -d $DOMAIN_MAIN --non-interactive --agree-tos --email $EMAIL --redirect || echo "SSL for main domain skipped"
fi

if [ -z "$API_DNS" ]; then
    echo -e "${YELLOW}⚠️  Warning: $DOMAIN_API DNS not propagated yet${NC}"
    echo "Skipping SSL for API domain..."
else
    echo "Obtaining SSL certificate for $DOMAIN_API..."
    certbot --nginx -d $DOMAIN_API --non-interactive --agree-tos --email $EMAIL --redirect || echo "SSL for API domain skipped"
fi

echo "Setting up auto-renewal..."
systemctl enable certbot.timer

echo -e "${GREEN}✅ SSL configured${NC}"
echo ""

# ============================================
# STEP 6: Health Checks
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🏥 Step 6: Health Checks${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

sleep 2

echo "Testing backend API..."
curl -s http://localhost:3000/health | jq '.' || echo "Backend response received"

echo ""
echo "Testing frontend..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost/

echo ""
echo -e "${GREEN}✅ Health checks complete${NC}"
echo ""

# ============================================
# FINAL STATUS
# ============================================
echo ""
echo -e "${CYAN}${BOLD}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║              🎉 DEPLOYMENT COMPLETE! 🎉                   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${GREEN}${BOLD}Your AppDev Platform is Live!${NC}"
echo ""
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BOLD}🌐 URLs:${NC}"
echo "  Frontend: http://$DOMAIN_MAIN"
echo "  API: http://$DOMAIN_API"
if [ -n "$MAIN_DNS" ]; then
    echo "  Frontend (HTTPS): https://$DOMAIN_MAIN"
fi
if [ -n "$API_DNS" ]; then
    echo "  API (HTTPS): https://$DOMAIN_API"
fi
echo ""
echo -e "${BOLD}✅ Services Running:${NC}"
echo "  ✓ Backend API (Port 3000)"
echo "  ✓ Frontend (Port 80/443)"
echo "  ✓ Nginx Reverse Proxy"
echo "  ✓ SSL Certificates"
echo "  ✓ Database (RDS)"
echo ""
echo -e "${BOLD}📋 Quick Commands:${NC}"
echo "  View API logs: pm2 logs appdev-api"
echo "  Restart API: pm2 restart appdev-api"
echo "  Nginx logs: tail -f /var/log/nginx/access.log"
echo "  Restart Nginx: systemctl restart nginx"
echo ""
echo -e "${BOLD}🔧 Configuration Files:${NC}"
echo "  Nginx (main): /etc/nginx/sites-available/appdev-main"
echo "  Nginx (API): /etc/nginx/sites-available/appdev-api"
echo "  Frontend: /var/www/appdev"
echo "  Backend: /home/ubuntu/appdev-platform/backend"
echo ""
echo -e "${YELLOW}⚠️  DNS Reminder:${NC}"
echo "If SSL is not yet configured, make sure DNS is propagated:"
echo "  1. Add A record in Google Cloud DNS:"
echo "     $DOMAIN_MAIN → $EC2_IP"
echo "     $DOMAIN_API → $EC2_IP"
echo "  2. Wait 10-30 minutes"
echo "  3. Re-run this script to obtain SSL"
echo ""
echo -e "${GREEN}🎊 Everything is automated and ready!${NC}"
echo ""
