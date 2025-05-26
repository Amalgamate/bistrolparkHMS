# 🚀 Bristol Park Hospital - Development Workflow

## 📋 **Quick Start for Developers**

### **1. Repository Setup**
```bash
# Clone the repository
git clone https://github.com/Amalgamate/bistrolparkHMS.git
cd bistrolparkHMS

# Install dependencies
npm install
```

### **2. Environment Configuration**
```bash
# Copy environment template
cp .env.production.template .env.development

# Edit development environment variables
# Update database credentials, API URLs, etc.
```

### **3. Development Commands**
```bash
# Start development environment
npm run docker:dev          # Full Docker development stack
npm run dev                  # Frontend only (requires separate API)

# Production testing
npm run docker:prod          # Full production stack locally

# Utilities
npm run docker:stop          # Stop all containers
npm run docker:logs          # View container logs
npm run lint                 # Code linting
npm run build               # Production build
npm run deploy              # Build and deploy
```

## 🌿 **Branch Strategy**

### **Branch Types**
- `master` - Production-ready code
- `develop` - Integration branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical production fixes

### **Workflow Process**
1. **Create Feature Branch**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/new-hospital-module
   ```

2. **Development**:
   ```bash
   # Make changes
   git add .
   git commit -m "feat: add new hospital module"
   git push origin feature/new-hospital-module
   ```

3. **Pull Request**:
   - Create PR to `develop` branch
   - Request code review
   - Merge after approval

4. **Release**:
   - Merge `develop` to `master`
   - Deploy to production

## 🐳 **Docker Development**

### **Development Stack**
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Services available:
# - Frontend: http://localhost:3000
# - API: http://localhost:3001
# - Database: localhost:5433
```

### **Production Testing**
```bash
# Test production build locally
docker-compose -f docker-compose.production.yml up -d

# Services available:
# - Application: http://localhost
# - API: http://localhost:3001
# - Database: localhost:5432
```

## 🔧 **Development Environment Variables**

Create `.env.development`:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5433
DB_NAME=bristol_park_hmis_dev
DB_USER=postgres
DB_PASSWORD=password

# API Configuration
NODE_ENV=development
PORT=3001
VITE_API_URL=http://localhost:3001

# JWT Configuration
JWT_SECRET=development_jwt_secret_for_local_use_only
JWT_EXPIRES_IN=24h
```

## 🧪 **Testing Guidelines**

### **Running Tests**
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in Docker
docker-compose -f docker-compose.dev.yml exec frontend npm test
```

### **Test Structure**
- Unit tests: `src/**/*.test.ts`
- Integration tests: `tests/integration/`
- E2E tests: `tests/e2e/`

## 📝 **Code Standards**

### **Commit Messages**
Follow conventional commits:
```
feat: add new hospital module
fix: resolve patient registration bug
docs: update API documentation
style: format code with prettier
refactor: restructure database queries
test: add unit tests for appointments
```

### **Code Review Checklist**
- [ ] Code follows project conventions
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No console.log statements
- [ ] Error handling is implemented
- [ ] Security considerations addressed

## 🚀 **Deployment Process**

### **Development Deployment**
1. Push to `develop` branch
2. Automatic testing (if CI/CD configured)
3. Deploy to staging environment

### **Production Deployment**
1. Merge to `master` branch
2. Create release tag
3. Deploy to production via Portainer
4. Monitor deployment health

## 🔍 **Debugging**

### **Local Debugging**
```bash
# View container logs
docker-compose logs -f [service-name]

# Access container shell
docker-compose exec frontend bash
docker-compose exec api bash
docker-compose exec db psql -U postgres -d bristol_park_hmis
```

### **Common Issues**
- **Port conflicts**: Change ports in docker-compose.dev.yml
- **Database connection**: Check DB_HOST and credentials
- **API not responding**: Verify backend container is running

## 📚 **Resources**

- **Repository**: https://github.com/Amalgamate/bistrolparkHMS
- **Portainer**: http://YOUR_DROPLET_IP:9000
- **Production**: http://YOUR_DROPLET_IP
- **Documentation**: See `/docs` folder
