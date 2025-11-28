#!/bin/bash
#
# AppDev Platform - Mac to Production Sync Script
# Run this on your Mac to deploy changes to production
#
# Usage: ./sync.sh "commit message"

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
EC2_HOST="3.108.254.127"
EC2_USER="ubuntu"
EC2_KEY="$HOME/Desktop/appdev-backend-key.pem"
PROJECT_DIR="$HOME/Desktop/appdev-platform"

echo -e "${BLUE}🚀 AppDev Sync - Mac → GitHub → EC2${NC}"
echo ""

# Get commit message
COMMIT_MSG="${1:-Update: $(date +'%Y-%m-%d %H:%M')}"

# Step 1: Check for changes
echo -e "${BLUE}📝 Step 1: Checking for changes...${NC}"
cd "$PROJECT_DIR"

if [[ -z $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  No changes to commit${NC}"
else
    echo -e "${GREEN}✅ Changes detected${NC}"
    git status -s
    echo ""
    
    # Step 2: Commit changes
    echo -e "${BLUE}💾 Step 2: Committing changes...${NC}"
    git add .
    git commit -m "$COMMIT_MSG"
    echo -e "${GREEN}✅ Changes committed${NC}"
    echo ""
fi

# Step 3: Pull and rebase
echo -e "${BLUE}🔄 Step 3: Syncing with GitHub...${NC}"
git pull origin main --rebase
echo -e "${GREEN}✅ Synced with GitHub${NC}"
echo ""

# Step 4: Push to GitHub
echo -e "${BLUE}📤 Step 4: Pushing to GitHub...${NC}"
git push origin main
echo -e "${GREEN}✅ Pushed to GitHub${NC}"
echo ""

# Step 5: Deploy to EC2
echo -e "${BLUE}🚀 Step 5: Deploying to EC2...${NC}"
echo ""

ssh -i "$EC2_KEY" "$EC2_USER@$EC2_HOST" << 'ENDSSH'
#!/bin/bash
set -e

cd ~/appdev-platform

echo "📥 Pulling latest code..."
git pull origin main

echo "📦 Installing dependencies..."
cd backend/api
npm install --production

echo "🗄️  Running migrations..."
cd ../shared/database
npx prisma migrate deploy
npx prisma generate

echo "🔄 Restarting server..."
pm2 restart appdev-api

echo "⏳ Waiting for server..."
sleep 3

echo "🏥 Health check..."
curl -s http://localhost:3000/health | jq '.'

echo "✅ Deployment complete!"
pm2 list

ENDSSH

echo ""
echo -e "${GREEN}🎉 Deployment successful!${NC}"
echo ""
echo "📊 Your API is live at:"
echo "  🌐 http://$EC2_HOST:3000/health"
echo ""
echo "📋 Quick commands:"
echo "  View logs: ssh -i $EC2_KEY $EC2_USER@$EC2_HOST 'pm2 logs appdev-api'"
echo "  Restart:   ssh -i $EC2_KEY $EC2_USER@$EC2_HOST 'pm2 restart appdev-api'"
echo "  Status:    ssh -i $EC2_KEY $EC2_USER@$EC2_HOST 'pm2 list'"
echo ""
