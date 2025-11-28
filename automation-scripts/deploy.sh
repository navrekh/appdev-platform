#!/bin/bash
#
# AppDev Platform - Automated Deployment Script
# Run this on EC2 to deploy latest changes
#
# Usage: ./deploy.sh

set -e  # Exit on error

echo "🚀 Starting AppDev deployment..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
APP_DIR=~/appdev-platform
API_DIR=$APP_DIR/backend/api
DB_DIR=$APP_DIR/backend/shared/database

echo -e "${BLUE}📍 Working directory: $APP_DIR${NC}"
echo ""

# Step 1: Pull latest code
echo -e "${BLUE}📥 Step 1: Pulling latest code from GitHub...${NC}"
cd $APP_DIR
git pull origin main
echo -e "${GREEN}✅ Code updated${NC}"
echo ""

# Step 2: Install API dependencies
echo -e "${BLUE}📦 Step 2: Installing API dependencies...${NC}"
cd $API_DIR
npm install --production
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 3: Run database migrations
echo -e "${BLUE}🗄️  Step 3: Running database migrations...${NC}"
cd $DB_DIR
npx prisma migrate deploy
npx prisma generate
echo -e "${GREEN}✅ Database migrated${NC}"
echo ""

# Step 4: Restart API server
echo -e "${BLUE}🔄 Step 4: Restarting API server...${NC}"
pm2 restart appdev-api
echo -e "${GREEN}✅ Server restarted${NC}"
echo ""

# Step 5: Wait for server to start
echo -e "${BLUE}⏳ Waiting for server to start...${NC}"
sleep 3

# Step 6: Health check
echo -e "${BLUE}🏥 Step 5: Running health check...${NC}"
HEALTH_RESPONSE=$(curl -s http://localhost:3000/health)
if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
    echo -e "${GREEN}✅ Server is healthy!${NC}"
    echo "$HEALTH_RESPONSE" | jq '.' 2>/dev/null || echo "$HEALTH_RESPONSE"
else
    echo -e "${RED}❌ Health check failed!${NC}"
    echo "$HEALTH_RESPONSE"
    pm2 logs appdev-api --lines 20
    exit 1
fi
echo ""

# Step 7: Show server status
echo -e "${BLUE}📊 Step 6: Server status:${NC}"
pm2 list
echo ""

# Step 8: Test API endpoints
echo -e "${BLUE}🧪 Step 7: Testing API endpoints...${NC}"
echo ""

# Test health
echo "Testing: GET /health"
curl -s http://localhost:3000/health | jq '.' 2>/dev/null || curl -s http://localhost:3000/health
echo ""

# Test 404
echo "Testing: GET /invalid-route (should return 404)"
curl -s http://localhost:3000/invalid-route | jq '.' 2>/dev/null || curl -s http://localhost:3000/invalid-route
echo ""

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "📋 Summary:"
echo "  - API URL: http://$(curl -s ifconfig.me):3000"
echo "  - Health: http://$(curl -s ifconfig.me):3000/health"
echo "  - Logs: pm2 logs appdev-api"
echo ""
echo "🎉 All systems operational!"
