#!/bin/bash
#
# Open ports 80 and 443 in AWS Security Group
# Run this on your Mac before setting up Nginx

set -e

echo "🔒 Opening HTTP and HTTPS ports in AWS Security Group..."
echo ""

SECURITY_GROUP="sg-0ad249bc281e579bb"
REGION="ap-south-1"

# Open port 80 (HTTP)
echo "Opening port 80 (HTTP)..."
aws ec2 authorize-security-group-ingress \
    --group-id $SECURITY_GROUP \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0 \
    --region $REGION 2>/dev/null && echo "✅ Port 80 opened" || echo "ℹ️  Port 80 already open"

# Open port 443 (HTTPS)
echo "Opening port 443 (HTTPS)..."
aws ec2 authorize-security-group-ingress \
    --group-id $SECURITY_GROUP \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0 \
    --region $REGION 2>/dev/null && echo "✅ Port 443 opened" || echo "ℹ️  Port 443 already open"

echo ""
echo "✅ Security group configured!"
echo ""
echo "Current open ports:"
aws ec2 describe-security-groups \
    --group-ids $SECURITY_GROUP \
    --region $REGION \
    --query 'SecurityGroups[0].IpPermissions[*].[IpProtocol,FromPort,ToPort]' \
    --output table

echo ""
echo "🎯 Next: Configure DNS in GoDaddy, then run setup on EC2"
