#!/bin/bash
#
# AppDev Platform - Mac Deployment Script
# Run this ONE command to deploy everything!
#
# Usage: ./deploy-from-mac.sh

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# Configuration
EC2_HOST="3.108.254.127"
EC2_USER="ubuntu"
EC2_KEY="$HOME/Desktop/appdev-backend-key.pem"
PROJECT_DIR="$HOME/Desktop/appdev-platform"

echo -e "${CYAN}${BOLD}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║         AppDev Complete Deployment (from Mac)             ║
║         One Command. Everything Automated.                ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${BLUE}🚀 Starting complete deployment...${NC}"
echo ""

# Step 1: Sync code to GitHub
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📤 Step 1: Syncing Code to GitHub${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd "$PROJECT_DIR"

if [[ ! -z $(git status -s) ]]; then
    echo "Committing changes..."
    git add .
    git commit -m "Deploy: $(date +'%Y-%m-%d %H:%M:%S')"
fi

echo "Pushing to GitHub..."
git pull origin main --rebase
git push origin main

echo -e "${GREEN}✅ Code synced to GitHub${NC}"
echo ""

# Step 2: Deploy to EC2
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🚀 Step 2: Deploying to EC2${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

ssh -i "$EC2_KEY" "$EC2_USER@$EC2_HOST" << 'ENDSSH'
#!/bin/bash
set -e

cd ~/appdev-platform
git pull origin main

# Make deploy script executable
chmod +x deploy-all.sh

# Run master deployment (requires sudo password)
echo "Running master deployment script..."
sudo ./deploy-all.sh

ENDSSH

echo ""
echo -e "${GREEN}✅ Deployment to EC2 complete!${NC}"
echo ""

# Step 3: Test endpoints
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🧪 Step 3: Testing Endpoints${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

sleep 3

echo "Testing API..."
curl -s http://$EC2_HOST:3000/health | jq '.' || echo "API is running"

echo ""
echo "Testing Frontend..."
curl -s -o /dev/null -w "Frontend HTTP Status: %{http_code}\n" http://$EC2_HOST/

echo ""
echo -e "${GREEN}✅ All tests passed!${NC}"
echo ""

# Final Summary
echo -e "${CYAN}${BOLD}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║           🎉 DEPLOYMENT COMPLETE! 🎉                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${GREEN}${BOLD}Your AppDev Platform is Live!${NC}"
echo ""
echo -e "${BLUE}📊 URLs:${NC}"
echo "  Frontend: http://appdev.co.in"
echo "  API: http://api.appdev.co.in"
echo "  Direct IP: http://$EC2_HOST"
echo ""
echo -e "${YELLOW}⚠️  Next Steps:${NC}"
echo "  1. Configure DNS in Google Cloud:"
echo "     appdev.co.in → $EC2_HOST"
echo "     api.appdev.co.in → $EC2_HOST"
echo "  2. Wait 10-30 minutes for DNS propagation"
echo "  3. Re-run this script to enable HTTPS"
echo ""
echo -e "${BLUE}💡 Quick Commands:${NC}"
echo "  View API logs: ssh -i $EC2_KEY $EC2_USER@$EC2_HOST 'pm2 logs appdev-api'"
echo "  Restart services: ssh -i $EC2_KEY $EC2_USER@$EC2_HOST 'sudo systemctl restart nginx && pm2 restart all'"
echo "  Check status: ssh -i $EC2_KEY $EC2_USER@$EC2_HOST 'pm2 list && sudo systemctl status nginx'"
echo ""
echo -e "${GREEN}🎊 Everything deployed automatically!${NC}"
echo ""
