#!/bin/bash

###############################################################################
# Android Bare Workflow Build Script
# Builds APK and AAB files for AppDev platform
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

clear
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "🤖 Android Bare Workflow Build"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Configuration
BUILD_TYPE=${1:-debug}
OUTPUT_DIR="./output"
BUILD_DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p "$OUTPUT_DIR"

log_info "Build Configuration:"
log_info "  Type: $BUILD_TYPE"
log_info "  Output: $OUTPUT_DIR"
log_info "  Date: $BUILD_DATE"
echo ""

# Check requirements
log_info "Step 1/5: Checking requirements..."

if ! command -v node &> /dev/null; then
    log_error "Node.js not found!"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    log_error "npm not found!"
    exit 1
fi

log_success "✓ Requirements met"

# Install dependencies
log_info "Step 2/5: Installing dependencies..."
npm install
log_success "✓ Dependencies installed"

# Generate Android project (if bare workflow)
log_info "Step 3/5: Preparing Android project..."

if [ ! -d "android" ]; then
    log_info "  Creating Android project structure..."
    npx expo prebuild --platform android
fi

log_success "✓ Android project ready"

# Build APK/AAB
log_info "Step 4/5: Building Android app..."

cd android

if [ "$BUILD_TYPE" = "release" ]; then
    log_info "  Building release AAB..."
    ./gradlew bundleRelease
    
    log_info "  Building release APK..."
    ./gradlew assembleRelease
    
    # Copy outputs
    cp app/build/outputs/bundle/release/*.aab "../$OUTPUT_DIR/app-release-${BUILD_DATE}.aab"
    cp app/build/outputs/apk/release/*.apk "../$OUTPUT_DIR/app-release-${BUILD_DATE}.apk"
    
    log_success "✓ Release build complete"
else
    log_info "  Building debug APK..."
    ./gradlew assembleDebug
    
    # Copy output
    cp app/build/outputs/apk/debug/*.apk "../$OUTPUT_DIR/app-debug-${BUILD_DATE}.apk"
    
    log_success "✓ Debug build complete"
fi

cd ..

# Upload to S3 (optional)
log_info "Step 5/5: Uploading to S3..."

if command -v aws &> /dev/null; then
    S3_BUCKET="appdev-production-artifacts-347197239482"
    
    for file in "$OUTPUT_DIR"/*.{apk,aab} 2>/dev/null; do
        if [ -f "$file" ]; then
            aws s3 cp "$file" "s3://${S3_BUCKET}/android-builds/" --region ap-south-1
            log_success "✓ Uploaded: $(basename $file)"
        fi
    done
else
    log_info "  AWS CLI not found, skipping upload"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_success "🎉 BUILD COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
log_info "Output files:"
ls -lh "$OUTPUT_DIR"
echo ""

if [ "$BUILD_TYPE" = "release" ]; then
    log_info "Next steps:"
    log_info "  1. Test the APK: adb install $OUTPUT_DIR/app-release-*.apk"
    log_info "  2. Upload AAB to Play Store"
    log_info "  3. Or distribute APK directly"
else
    log_info "Next steps:"
    log_info "  1. Install on device: adb install $OUTPUT_DIR/app-debug-*.apk"
    log_info "  2. Or scan QR code for testing"
fi

echo ""
