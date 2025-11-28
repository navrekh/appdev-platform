#!/bin/bash
#
# AppDev Platform - API Testing Script
# Tests all endpoints and generates report
#
# Usage: ./test.sh [ec2|local]

MODE="${1:-local}"

if [ "$MODE" = "ec2" ]; then
    API_URL="http://3.108.254.127:3000"
else
    API_URL="http://localhost:3000"
fi

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASSED=0
FAILED=0

echo -e "${BLUE}🧪 AppDev API Test Suite${NC}"
echo "Testing: $API_URL"
echo ""

# Test function
test_endpoint() {
    local name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    local expected="$5"
    
    echo -n "Testing: $name... "
    
    if [ -z "$data" ]; then
        response=$(curl -s -X $method "$API_URL$endpoint")
    else
        response=$(curl -s -X $method "$API_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    if echo "$response" | grep -q "$expected"; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "  Expected: $expected"
        echo "  Got: $response"
        ((FAILED++))
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Health & Status Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_endpoint "Health check" "GET" "/health" "" "ok"
test_endpoint "404 handler" "GET" "/invalid-route" "" "not found"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Authentication Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Generate random email for testing
TEST_EMAIL="test$(date +%s)@appdev.com"
TEST_PASSWORD="password123"

# Register user
echo -n "Testing: User registration... "
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"name\":\"Test User\"}")

if echo "$REGISTER_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
    TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token')
else
    echo -e "${RED}❌ FAIL${NC}"
    echo "  Response: $REGISTER_RESPONSE"
    ((FAILED++))
    TOKEN=""
fi

# Login
echo -n "Testing: User login... "
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}"
    echo "  Response: $LOGIN_RESPONSE"
    ((FAILED++))
fi

# Get current user (if token exists)
if [ -n "$TOKEN" ]; then
    echo -n "Testing: Get current user... "
    ME_RESPONSE=$(curl -s -X GET "$API_URL/api/auth/me" \
        -H "Authorization: Bearer $TOKEN")
    
    if echo "$ME_RESPONSE" | grep -q "$TEST_EMAIL"; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "  Response: $ME_RESPONSE"
        ((FAILED++))
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Prompt & App Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -n "$TOKEN" ]; then
    # Submit prompt
    echo -n "Testing: Submit prompt... "
    PROMPT_RESPONSE=$(curl -s -X POST "$API_URL/api/prompts" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d '{"text":"Build me a test app"}')
    
    if echo "$PROMPT_RESPONSE" | grep -q "App"; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
        APP_ID=$(echo "$PROMPT_RESPONSE" | jq -r '.app.id')
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "  Response: $PROMPT_RESPONSE"
        ((FAILED++))
        APP_ID=""
    fi
    
    # Get prompts
    echo -n "Testing: Get all prompts... "
    PROMPTS_RESPONSE=$(curl -s -X GET "$API_URL/api/prompts" \
        -H "Authorization: Bearer $TOKEN")
    
    if echo "$PROMPTS_RESPONSE" | grep -q "prompts"; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((FAILED++))
    fi
    
    # Get apps
    echo -n "Testing: Get all apps... "
    APPS_RESPONSE=$(curl -s -X GET "$API_URL/api/apps" \
        -H "Authorization: Bearer $TOKEN")
    
    if echo "$APPS_RESPONSE" | grep -q "apps"; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((FAILED++))
    fi
    
    # Get single app (if exists)
    if [ -n "$APP_ID" ]; then
        echo -n "Testing: Get single app... "
        APP_RESPONSE=$(curl -s -X GET "$API_URL/api/apps/$APP_ID" \
            -H "Authorization: Bearer $TOKEN")
        
        if echo "$APP_RESPONSE" | grep -q "app"; then
            echo -e "${GREEN}✅ PASS${NC}"
            ((PASSED++))
        else
            echo -e "${RED}❌ FAIL${NC}"
            ((FAILED++))
        fi
    fi
else
    echo -e "${YELLOW}⚠️  Skipped (no auth token)${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "  ${GREEN}Passed: $PASSED${NC}"
echo -e "  ${RED}Failed: $FAILED${NC}"
echo -e "  Total:  $((PASSED + FAILED))"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed${NC}"
    exit 1
fi
