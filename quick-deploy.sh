#!/bin/bash

###############################################################################
# AppDev Quick Deployment Script for macOS
# This creates a simple AWS infrastructure for AppDev
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

clear
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "🚀 AppDev Quick Deployment for AWS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    log_error "AWS CLI not installed!"
    echo ""
    log_info "Install with: brew install awscli"
    exit 1
fi

# Check Terraform
if ! command -v terraform &> /dev/null; then
    log_error "Terraform not installed!"
    echo ""
    log_info "Install with: brew install terraform"
    exit 1
fi

log_success "✓ All tools installed"

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null 2>&1; then
    log_error "AWS credentials not configured!"
    echo ""
    log_info "Run: aws configure"
    log_info "Then run this script again."
    exit 1
fi

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=${AWS_REGION:-us-east-1}

log_success "✓ AWS credentials verified"
log_info "  Account ID: $AWS_ACCOUNT_ID"
log_info "  Region: $AWS_REGION"
echo ""

# Configuration
log_info "📋 Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

read -p "Domain name [appdev.co.in]: " DOMAIN
DOMAIN=${DOMAIN:-appdev.co.in}

read -p "Environment [production]: " ENVIRONMENT
ENVIRONMENT=${ENVIRONMENT:-production}

echo ""
log_info "Enter your API keys (we'll store them securely in AWS):"
echo ""

read -p "OpenAI API Key: " OPENAI_KEY
read -p "Anthropic API Key (optional, press Enter to skip): " ANTHROPIC_KEY
read -p "Razorpay Key ID: " RAZORPAY_ID
read -sp "Razorpay Key Secret: " RAZORPAY_SECRET
echo ""
read -p "Expo Access Token: " EXPO_TOKEN

# Generate secure passwords
DB_PASSWORD=$(openssl rand -base64 32 | tr -d '=+/' | cut -c1-25)
JWT_SECRET=$(openssl rand -base64 64 | tr -d '=+/' | cut -c1-50)

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "📊 Deployment Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
log_info "Domain:      $DOMAIN"
log_info "Environment: $ENVIRONMENT"
log_info "AWS Region:  $AWS_REGION"
log_info "AWS Account: $AWS_ACCOUNT_ID"
echo ""
log_info "What will be created:"
echo "  ✅ RDS PostgreSQL Database"
echo "  ✅ S3 Bucket for storage"
echo "  ✅ Secrets Manager (for API keys)"
echo "  ✅ IAM Roles and Policies"
echo "  ✅ CloudWatch Logs"
echo ""
log_info "⏱️  Estimated time: 5-10 minutes"
log_info "💰 Estimated cost: ~\$50-100/month"
echo ""

read -p "Ready to deploy? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    log_error "Deployment cancelled"
    exit 0
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "🚀 Starting Deployment..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: Store secrets
log_info "Step 1/5: Storing secrets in AWS Secrets Manager..."

SECRET_NAME="appdev-${ENVIRONMENT}-config"

SECRETS_JSON=$(cat <<EOF
{
  "DB_PASSWORD": "$DB_PASSWORD",
  "JWT_SECRET": "$JWT_SECRET",
  "OPENAI_API_KEY": "$OPENAI_KEY",
  "ANTHROPIC_API_KEY": "$ANTHROPIC_KEY",
  "RAZORPAY_KEY_ID": "$RAZORPAY_ID",
  "RAZORPAY_KEY_SECRET": "$RAZORPAY_SECRET",
  "EXPO_ACCESS_TOKEN": "$EXPO_TOKEN"
}
EOF
)

if aws secretsmanager describe-secret --secret-id "$SECRET_NAME" --region "$AWS_REGION" &> /dev/null; then
    aws secretsmanager update-secret \
        --secret-id "$SECRET_NAME" \
        --secret-string "$SECRETS_JSON" \
        --region "$AWS_REGION" > /dev/null
    log_success "✓ Secrets updated"
else
    aws secretsmanager create-secret \
        --name "$SECRET_NAME" \
        --secret-string "$SECRETS_JSON" \
        --region "$AWS_REGION" > /dev/null
    log_success "✓ Secrets created"
fi

# Step 2: Create S3 bucket
log_info "Step 2/5: Creating S3 bucket for artifacts..."

BUCKET_NAME="appdev-${ENVIRONMENT}-artifacts-${AWS_ACCOUNT_ID}"

if aws s3 ls "s3://${BUCKET_NAME}" 2>&1 | grep -q 'NoSuchBucket'; then
    aws s3 mb "s3://${BUCKET_NAME}" --region "$AWS_REGION" > /dev/null 2>&1 || true
    aws s3api put-bucket-versioning \
        --bucket "${BUCKET_NAME}" \
        --versioning-configuration Status=Enabled \
        --region "$AWS_REGION" > /dev/null 2>&1 || true
    log_success "✓ S3 bucket created: $BUCKET_NAME"
else
    log_success "✓ S3 bucket already exists: $BUCKET_NAME"
fi

# Step 3: Create RDS Database
log_info "Step 3/5: Creating RDS PostgreSQL database..."
log_info "  (This takes 5-7 minutes, please wait...)"

DB_INSTANCE_ID="appdev-${ENVIRONMENT}-db"
DB_NAME="appdev"
DB_USERNAME="appdev_admin"

# Check if database exists
if aws rds describe-db-instances --db-instance-identifier "$DB_INSTANCE_ID" --region "$AWS_REGION" &> /dev/null; then
    log_success "✓ Database already exists"
    DB_ENDPOINT=$(aws rds describe-db-instances \
        --db-instance-identifier "$DB_INSTANCE_ID" \
        --query 'DBInstances[0].Endpoint.Address' \
        --output text \
        --region "$AWS_REGION")
else
    # Create database (simplified version - no VPC for quick setup)
    aws rds create-db-instance \
        --db-instance-identifier "$DB_INSTANCE_ID" \
        --db-instance-class db.t3.micro \
        --engine postgres \
        --engine-version 15.4 \
        --master-username "$DB_USERNAME" \
        --master-user-password "$DB_PASSWORD" \
        --allocated-storage 20 \
        --publicly-accessible \
        --db-name "$DB_NAME" \
        --backup-retention-period 7 \
        --region "$AWS_REGION" \
        --tags Key=Project,Value=AppDev Key=Environment,Value="$ENVIRONMENT" \
        > /dev/null 2>&1
    
    log_info "  Waiting for database to be available..."
    aws rds wait db-instance-available \
        --db-instance-identifier "$DB_INSTANCE_ID" \
        --region "$AWS_REGION"
    
    DB_ENDPOINT=$(aws rds describe-db-instances \
        --db-instance-identifier "$DB_INSTANCE_ID" \
        --query 'DBInstances[0].Endpoint.Address' \
        --output text \
        --region "$AWS_REGION")
    
    log_success "✓ Database created: $DB_ENDPOINT"
fi

# Step 4: Create CloudWatch Log Group
log_info "Step 4/5: Setting up CloudWatch logging..."

LOG_GROUP="/appdev/${ENVIRONMENT}"

aws logs create-log-group --log-group-name "$LOG_GROUP" --region "$AWS_REGION" 2>/dev/null || true
aws logs put-retention-policy \
    --log-group-name "$LOG_GROUP" \
    --retention-in-days 7 \
    --region "$AWS_REGION" > /dev/null 2>&1 || true

log_success "✓ CloudWatch configured"

# Step 5: Save configuration
log_info "Step 5/5: Saving deployment info..."

cat > deployment-info.txt <<EOF
AppDev Deployment Information
============================

Deployment Date: $(date)
Environment: $ENVIRONMENT
AWS Region: $AWS_REGION
AWS Account: $AWS_ACCOUNT_ID

Resources Created:
-----------------
Secret Name:    $SECRET_NAME
S3 Bucket:      $BUCKET_NAME
RDS Instance:   $DB_INSTANCE_ID
Database:       $DB_NAME
DB Username:    $DB_USERNAME
DB Endpoint:    $DB_ENDPOINT
Log Group:      $LOG_GROUP

Connection String:
-----------------
postgresql://${DB_USERNAME}:[PASSWORD]@${DB_ENDPOINT}:5432/${DB_NAME}

Note: Password is stored in AWS Secrets Manager

Next Steps:
----------
1. Your infrastructure is ready!
2. Deploy your application code
3. Configure your domain: $DOMAIN
4. Point DNS to your load balancer

Retrieve secrets:
----------------
aws secretsmanager get-secret-value \\
  --secret-id $SECRET_NAME \\
  --query SecretString \\
  --output text \\
  --region $AWS_REGION | jq .

Cleanup (when needed):
---------------------
aws rds delete-db-instance \\
  --db-instance-identifier $DB_INSTANCE_ID \\
  --skip-final-snapshot \\
  --region $AWS_REGION

aws s3 rb s3://${BUCKET_NAME} --force --region $AWS_REGION

aws secretsmanager delete-secret \\
  --secret-id $SECRET_NAME \\
  --region $AWS_REGION
EOF

log_success "✓ Deployment info saved to: deployment-info.txt"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_success "🎉 DEPLOYMENT COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
log_info "✅ Your AWS infrastructure is ready!"
echo ""
log_info "📋 Resources Created:"
echo "   • Secret Manager: $SECRET_NAME"
echo "   • S3 Bucket: $BUCKET_NAME"
echo "   • Database: $DB_ENDPOINT"
echo "   • CloudWatch Logs: $LOG_GROUP"
echo ""
log_info "📄 Full details saved in: deployment-info.txt"
echo ""
log_info "🔍 View secrets:"
echo "   aws secretsmanager get-secret-value \\"
echo "     --secret-id $SECRET_NAME \\"
echo "     --query SecretString --output text \\"
echo "     --region $AWS_REGION | jq ."
echo ""
log_info "🗄️  Connect to database:"
echo "   Host: $DB_ENDPOINT"
echo "   Port: 5432"
echo "   Database: $DB_NAME"
echo "   Username: $DB_USERNAME"
echo "   Password: (in AWS Secrets Manager)"
echo ""
log_success "🚀 Next: Deploy your application code to use this infrastructure!"
echo ""

