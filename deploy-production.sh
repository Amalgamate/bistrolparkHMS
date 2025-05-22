#!/bin/bash

# Bristol Park Hospital - Production Deployment Script for Digital Ocean

set -e

echo "🏥 Bristol Park Hospital - Production Deployment"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if required files exist
check_files() {
    print_info "Checking required files..."
    
    required_files=(
        "docker-compose.production.yml"
        "Dockerfile"
        "api/Dockerfile"
        "nginx.conf"
    )
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            print_error "Required file missing: $file"
            exit 1
        fi
    done
    
    print_status "All required files found"
}

# Validate environment variables
check_env() {
    print_info "Checking environment variables..."
    
    if [[ ! -f ".env.production" ]]; then
        print_warning ".env.production file not found"
        print_info "Creating template .env.production file..."
        
        cat > .env.production << EOF
# Database Configuration
DB_NAME=bristol_park_hmis
DB_USER=postgres
DB_PASSWORD=CHANGE_THIS_PASSWORD

# JWT Configuration
JWT_SECRET=CHANGE_THIS_JWT_SECRET

# Domain Configuration
DOMAIN=your-domain.com
EOF
        
        print_warning "Please edit .env.production with your actual values before deploying!"
        return 1
    fi
    
    # Check if default values are still present
    if grep -q "CHANGE_THIS" .env.production; then
        print_error "Please update the default values in .env.production"
        return 1
    fi
    
    print_status "Environment variables configured"
}

# Test Docker build locally
test_build() {
    print_info "Testing Docker build locally..."
    
    if ! command -v docker &> /dev/null; then
        print_warning "Docker not found locally, skipping build test"
        return 0
    fi
    
    # Test frontend build
    print_info "Testing frontend build..."
    if docker build -t bristol-park-frontend-test .; then
        print_status "Frontend build successful"
        docker rmi bristol-park-frontend-test
    else
        print_error "Frontend build failed"
        return 1
    fi
    
    # Test API build
    print_info "Testing API build..."
    if docker build -t bristol-park-api-test ./api; then
        print_status "API build successful"
        docker rmi bristol-park-api-test
    else
        print_error "API build failed"
        return 1
    fi
}

# Generate deployment instructions
generate_instructions() {
    print_info "Generating deployment instructions..."
    
    cat > DEPLOYMENT_INSTRUCTIONS.md << EOF
# Deployment Instructions for Portainer

## 1. Access Portainer
- URL: http://your-droplet-ip:9000
- Login with your Portainer credentials

## 2. Create Stack
1. Go to **Stacks** → **Add Stack**
2. Name: \`bristol-park-hospital\`
3. Build method: **Repository**
4. Repository URL: \`$(git config --get remote.origin.url)\`
5. Repository reference: \`refs/heads/$(git branch --show-current)\`
6. Compose path: \`docker-compose.production.yml\`

## 3. Environment Variables
Add these environment variables in Portainer:

\`\`\`
$(cat .env.production | grep -v '^#' | grep -v '^$')
\`\`\`

## 4. Deploy
Click **Deploy the stack**

## 5. Access Application
- Frontend: http://your-droplet-ip
- API: http://your-droplet-ip:3001
- Database: your-droplet-ip:5432

## 6. Post-Deployment
1. Check all containers are running
2. Test application functionality
3. Set up SSL certificate if using custom domain
4. Configure backups
EOF
    
    print_status "Deployment instructions generated: DEPLOYMENT_INSTRUCTIONS.md"
}

# Main deployment preparation
main() {
    print_info "Starting deployment preparation..."
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Not in a git repository. Please initialize git first."
        exit 1
    fi
    
    # Run checks
    check_files
    
    if ! check_env; then
        print_error "Environment configuration incomplete"
        exit 1
    fi
    
    # Test build if Docker is available
    if command -v docker &> /dev/null; then
        test_build
    fi
    
    # Generate instructions
    generate_instructions
    
    print_status "Deployment preparation complete!"
    print_info "Next steps:"
    echo "1. Review DEPLOYMENT_INSTRUCTIONS.md"
    echo "2. Push changes to GitHub: git add . && git commit -m 'Production deployment' && git push"
    echo "3. Follow the instructions in Portainer"
    
    # Ask if user wants to push to git
    read -p "Do you want to push changes to GitHub now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Pushing to GitHub..."
        git add .
        git commit -m "Production deployment configuration - $(date)"
        git push origin $(git branch --show-current)
        print_status "Changes pushed to GitHub"
    fi
}

# Run main function
main "$@"
