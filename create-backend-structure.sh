#!/bin/bash

# AppDev Backend Structure Creator
# Run this in your appdev-platform directory

set -e

echo "🏗️  Creating AppDev Backend Structure..."

# Create main directories
mkdir -p backend/{api,ai-services,codegen-services,build-services,shared}
mkdir -p backend/shared/{database,storage,queues,events,auth,utils}
mkdir -p backend/ai-services/{planner,schema-validator,auto-fixer}
mkdir -p backend/codegen-services/{frontend-generator,backend-generator,integrator}
mkdir -p backend/build-services/{android-builder,ios-builder}

# Create API structure
mkdir -p backend/api/src/{auth,apps,prompts,builds,billing,webhooks,config}

# Create shared structure
mkdir -p backend/shared/database/{migrations,seeds}

echo "✅ Directory structure created!"
echo ""
echo "📁 Structure:"
tree -L 3 backend/ 2>/dev/null || find backend -type d | head -20

