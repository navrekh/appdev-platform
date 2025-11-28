#!/bin/bash
#
# AppDev Platform - Nginx + SSL Setup Script
# Configures Nginx reverse proxy and Let's Encrypt SSL
#
# Run this on EC2 AFTER DNS has propagated

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
DOMAIN="api.appdev.co.in"
EMAIL="mishra.navin@aol.com"  # For SSL certificate notifications
API_PORT="3000"

echo -e "${BLUE}🌐 AppDev Domain Setup - Nginx + SSL${NC}"
echo ""
echo "Domain: $DOMAIN"
echo "API Port: $API_PORT"
echo ""

# Check if running as root or with sudo
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ This script must be run as root or with sudo${NC}"
   echo "Run: sudo ./setup-domain.sh"
   exit 1
fi

# Step 1: Verify DNS
echo -e "${BLUE}📍 Step 1: Verifying DNS...${NC}"
DNS_IP=$(dig +short $DOMAIN | tail -n1)

if [ -z "$DNS_IP" ]; then
    echo -e "${RED}❌ DNS not configured yet!${NC}"
    echo "Please wait for DNS to propagate (10-30 minutes)"
    echo "Check status: nslookup $DOMAIN"
    exit 1
fi

EXPECTED_IP="3.108.254.127"
if [ "$DNS_IP" != "$EXPECTED_IP" ]; then
    echo -e "${YELLOW}⚠️  Warning: DNS points to $DNS_IP but expected $EXPECTED_IP${NC}"
    echo "This might be okay if you're using a load balancer"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${GREEN}✅ DNS verified: $DOMAIN → $DNS_IP${NC}"
echo ""

# Step 2: Update system
echo -e "${BLUE}📦 Step 2: Updating system packages...${NC}"
apt-get update
echo -e "${GREEN}✅ System updated${NC}"
echo ""

# Step 3: Install Nginx
echo -e "${BLUE}🔧 Step 3: Installing Nginx...${NC}"
apt-get install -y nginx
systemctl start nginx
systemctl enable nginx
echo -e "${GREEN}✅ Nginx installed${NC}"
echo ""

# Step 4: Install Certbot
echo -e "${BLUE}🔒 Step 4: Installing Certbot (Let's Encrypt)...${NC}"
apt-get install -y certbot python3-certbot-nginx
echo -e "${GREEN}✅ Certbot installed${NC}"
echo ""

# Step 5: Configure Nginx
echo -e "${BLUE}⚙️  Step 5: Configuring Nginx...${NC}"

cat > /etc/nginx/sites-available/appdev << EOF
server {
    listen 80;
    server_name $DOMAIN;

    # Redirect HTTP to HTTPS (will be configured by certbot)
    
    location / {
        proxy_pass http://localhost:$API_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, PATCH, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
        
        if (\$request_method = 'OPTIONS') {
            return 204;
        }
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/appdev /etc/nginx/sites-enabled/

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Test Nginx config
nginx -t

# Reload Nginx
systemctl reload nginx

echo -e "${GREEN}✅ Nginx configured${NC}"
echo ""

# Step 6: Obtain SSL Certificate
echo -e "${BLUE}🔐 Step 6: Obtaining SSL certificate from Let's Encrypt...${NC}"
echo "This will take a minute..."
echo ""

certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect

echo -e "${GREEN}✅ SSL certificate obtained and configured${NC}"
echo ""

# Step 7: Setup auto-renewal
echo -e "${BLUE}🔄 Step 7: Setting up automatic SSL renewal...${NC}"

# Test renewal
certbot renew --dry-run

# Certbot automatically sets up a cron job, but let's verify
systemctl status certbot.timer || systemctl enable certbot.timer

echo -e "${GREEN}✅ Auto-renewal configured${NC}"
echo ""

# Step 8: Update security group if needed
echo -e "${BLUE}🔒 Step 8: Security reminder...${NC}"
echo "Make sure AWS Security Group allows:"
echo "  - Port 80 (HTTP)"
echo "  - Port 443 (HTTPS)"
echo ""
echo "Run this from your Mac if needed:"
echo "aws ec2 authorize-security-group-ingress --group-id sg-0ad249bc281e579bb --protocol tcp --port 80 --cidr 0.0.0.0/0 --region ap-south-1"
echo "aws ec2 authorize-security-group-ingress --group-id sg-0ad249bc281e579bb --protocol tcp --port 443 --cidr 0.0.0.0/0 --region ap-south-1"
echo ""

# Step 9: Test API
echo -e "${BLUE}🧪 Step 9: Testing API...${NC}"
sleep 2

echo "Testing HTTPS endpoint..."
curl -s https://$DOMAIN/health | jq '.' || curl -s https://$DOMAIN/health

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Your API is now live with HTTPS!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 API URL: https://$DOMAIN"
echo ""
echo "📋 Test endpoints:"
echo "  Health: https://$DOMAIN/health"
echo "  Register: https://$DOMAIN/api/auth/register"
echo "  Login: https://$DOMAIN/api/auth/login"
echo ""
echo "🔒 SSL Certificate:"
echo "  Issuer: Let's Encrypt"
echo "  Valid for: 90 days"
echo "  Auto-renewal: Enabled"
echo ""
echo "📊 Nginx Status:"
echo "  Config: /etc/nginx/sites-available/appdev"
echo "  Logs: /var/log/nginx/"
echo "  Restart: sudo systemctl restart nginx"
echo ""
echo "🎯 Next Steps:"
echo "  1. Test from your browser: https://$DOMAIN/health"
echo "  2. Update your app to use https://$DOMAIN"
echo "  3. Monitor logs: sudo tail -f /var/log/nginx/access.log"
echo ""
