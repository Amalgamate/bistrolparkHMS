# Bristol Park Hospital Management System - Repository Structure

## 📁 **RECOMMENDED CLEAN REPOSITORY STRUCTURE**

```
bristol-park-hms/
├── 📁 src/                           # Frontend React/TypeScript Application
│   ├── 📁 components/                # Reusable React components
│   │   ├── 📁 admissions/           # Admissions module components
│   │   ├── 📁 clinical/             # Clinical workflow components
│   │   ├── 📁 pharmacy/             # Pharmacy management components
│   │   ├── 📁 lab/                  # Laboratory components
│   │   ├── 📁 radiology/            # Radiology services components
│   │   ├── 📁 emergency/            # Emergency services components
│   │   ├── 📁 maternity/            # Maternity care components
│   │   ├── 📁 ambulance/            # Ambulance services components
│   │   ├── 📁 blood-bank/           # Blood bank components
│   │   ├── 📁 mortuary/             # Mortuary services components
│   │   ├── 📁 physiotherapy/        # Physiotherapy components
│   │   ├── 📁 procedures/           # Medical procedures components
│   │   ├── 📁 patients/             # Patient management components
│   │   ├── 📁 auth/                 # Authentication components
│   │   ├── 📁 layout/               # Layout and navigation components
│   │   ├── 📁 ui/                   # Reusable UI components
│   │   └── 📁 dashboard/            # Dashboard components
│   ├── 📁 pages/                    # Page-level components
│   │   ├── 📁 admissions/           # Admissions pages
│   │   ├── 📁 clinical/             # Clinical pages
│   │   ├── 📁 pharmacy/             # Pharmacy pages
│   │   ├── 📁 lab/                  # Laboratory pages
│   │   ├── 📁 radiology/            # Radiology pages
│   │   ├── 📁 emergency/            # Emergency pages
│   │   ├── 📁 maternity/            # Maternity pages
│   │   ├── 📁 ambulance/            # Ambulance pages
│   │   ├── 📁 blood-bank/           # Blood bank pages
│   │   ├── 📁 mortuary/             # Mortuary pages
│   │   ├── 📁 physiotherapy/        # Physiotherapy pages
│   │   ├── 📁 procedures/           # Procedures pages
│   │   ├── 📁 back-office/          # Back office pages
│   │   └── 📁 settings/             # Settings pages
│   ├── 📁 context/                  # React Context providers
│   ├── 📁 hooks/                    # Custom React hooks
│   ├── 📁 services/                 # API service functions
│   ├── 📁 types/                    # TypeScript type definitions
│   ├── 📁 utils/                    # Utility functions
│   ├── 📁 styles/                   # CSS and styling files
│   ├── 📁 lib/                      # Third-party library configurations
│   ├── 📁 routes/                   # Application routing
│   ├── App.tsx                      # Main React application component
│   ├── main.tsx                     # Application entry point
│   └── index.css                    # Global CSS styles
│
├── 📁 api/                          # Backend Node.js/Express API
│   ├── 📁 src/                      # API source code
│   │   ├── 📁 controllers/          # Business logic controllers
│   │   ├── 📁 routes/               # API route definitions
│   │   ├── 📁 middleware/           # Express middleware
│   │   ├── 📁 validations/          # Input validation schemas
│   │   ├── 📁 utils/                # Backend utility functions
│   │   └── index.js                 # API server entry point
│   ├── package.json                 # Backend dependencies
│   └── README.md                    # API documentation
│
├── 📁 public/                       # Static frontend assets
│   ├── 📁 docs/                     # Public documentation
│   ├── 📁 document-templates/       # Document templates
│   ├── bristol-logo.png             # Hospital logo
│   ├── favicon.png                  # Favicon
│   └── index.html                   # HTML template
│
├── 📁 docker/                       # Docker configuration (MOVED)
│   ├── 📁 api/                      # API Docker files
│   │   ├── Dockerfile               # Production API Dockerfile
│   │   ├── Dockerfile.dev           # Development API Dockerfile
│   │   └── Dockerfile.simple        # Simple API Dockerfile
│   ├── Dockerfile                   # Production frontend Dockerfile
│   ├── Dockerfile.dev               # Development frontend Dockerfile
│   ├── Dockerfile.simple            # Simple frontend Dockerfile
│   ├── docker-compose.yml           # Production compose
│   ├── docker-compose.dev.yml       # Development compose
│   ├── docker-compose.production.yml # Production compose
│   ├── docker-compose.minimal.yml   # Minimal compose
│   ├── docker-compose.simple.yml    # Simple compose
│   └── nginx.conf                   # Nginx configuration
│
├── 📁 docs/                         # Project documentation (MOVED)
│   ├── BACKEND_MIGRATION.md         # Backend migration guide
│   ├── DEVELOPMENT.md               # Development guide
│   ├── DEVELOPMENT_WORKFLOW.md      # Development workflow
│   ├── DOCKER_README.md             # Docker setup guide
│   ├── FINANCIAL_SYSTEM_IMPLEMENTATION.md # Financial system docs
│   ├── PORTAINER_DEPLOYMENT.md      # Portainer deployment
│   ├── PRODUCTION_SETUP.md          # Production setup guide
│   └── API_README.md                # API documentation
│
├── 📁 smart-integrations/           # External integrations
│   ├── Bristol_Park.postman_collection # Postman collection
│   ├── SMART & HMIS PROVIDER API INTEGRATION DOCUMENTATION 2024.pdf
│   ├── SMART API ENDPOINT CLARIFICATION.pdf
│   └── Sampled Claim data 23092022 (2).txt
│
├── 📄 **Configuration Files**
├── package.json                     # Frontend dependencies
├── tsconfig.json                    # TypeScript configuration
├── tsconfig.app.json                # App-specific TypeScript config
├── tsconfig.node.json               # Node-specific TypeScript config
├── vite.config.ts                   # Vite build configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── postcss.config.js                # PostCSS configuration
├── eslint.config.js                 # ESLint configuration
├── .gitignore                       # Git ignore rules
├── README.md                        # Main project documentation
├── CHANGELOG.md                     # Version history
├── REPOSITORY_STRUCTURE.md          # This file
└── index.html                       # Main HTML template
```

## 🗑️ **FILES TO DELETE** (Security & Cleanup)

### **Database & Sensitive Files**
```
❌ DELETE IMMEDIATELY:
db-scripts/                          # Contains sensitive hospital data
database/                            # Database files
DB scripts/                          # Database scripts folder
backup.backup                        # Database backup
bristol-park-hmis/                   # Duplicate project folder
server/                              # Duplicate server folder
*.sql files                          # SQL files with data
*.py files                           # Python migration scripts
```

### **Temporary & Development Files**
```
❌ DELETE:
test-*.js                            # Temporary test scripts
create-*.js                          # Creation scripts
cleanup-*.js                         # Cleanup scripts
count-*.js                           # Counting scripts
check-*.js                           # Check scripts
migrate_patients_users.py            # Migration scripts
clean_and_migrate.py                 # Migration scripts
migration.log                        # Migration logs
testing-flow.md                      # Temporary documentation
```

### **Build Artifacts**
```
❌ DELETE:
dist/                                # Built assets
node_modules/                        # Dependencies (all instances)
api/node_modules/                    # API dependencies
server/node_modules/                 # Server dependencies
```

## 🔄 **FILES TO MOVE**

### **Docker Files → /docker folder**
```
🔄 MOVE:
Dockerfile                           → docker/Dockerfile
Dockerfile.dev                       → docker/Dockerfile.dev
Dockerfile.simple                    → docker/Dockerfile.simple
api/Dockerfile                       → docker/api/Dockerfile
api/Dockerfile.dev                   → docker/api/Dockerfile.dev
api/Dockerfile.simple                → docker/api/Dockerfile.simple
docker-compose.yml                   → docker/docker-compose.yml
docker-compose.dev.yml               → docker/docker-compose.dev.yml
docker-compose.production.yml        → docker/docker-compose.production.yml
docker-compose.minimal.yml           → docker/docker-compose.minimal.yml
docker-compose.simple.yml            → docker/docker-compose.simple.yml
nginx.conf                           → docker/nginx.conf
```

### **Documentation → /docs folder**
```
🔄 MOVE:
BACKEND_MIGRATION.md                 → docs/BACKEND_MIGRATION.md
DEVELOPMENT.md                       → docs/DEVELOPMENT.md
DEVELOPMENT_WORKFLOW.md              → docs/DEVELOPMENT_WORKFLOW.md
DOCKER_README.md                     → docs/DOCKER_README.md
FINANCIAL_SYSTEM_IMPLEMENTATION.md  → docs/FINANCIAL_SYSTEM_IMPLEMENTATION.md
PORTAINER_DEPLOYMENT.md             → docs/PORTAINER_DEPLOYMENT.md
PRODUCTION_SETUP.md                  → docs/PRODUCTION_SETUP.md
api/README.md                        → docs/API_README.md
```

## ✅ **PRODUCTION READINESS ASSESSMENT**

### **🔴 CRITICAL FOR PRODUCTION**
- ✅ Core hospital modules (admissions, clinical, pharmacy, lab, etc.)
- ✅ Patient management system
- ✅ Authentication and authorization
- ✅ API endpoints and business logic
- ✅ Database schema (separate from repository)
- ✅ Security configurations

### **🟡 REQUIRED FOR DEPLOYMENT**
- ✅ Build configurations (Vite, TypeScript, Tailwind)
- ✅ Docker configurations (moved to /docker)
- ✅ Environment templates (.env.example)
- ✅ Package.json files
- ✅ Production documentation

### **🟢 DEVELOPMENT ONLY**
- ✅ Development tools and testing utilities
- ✅ HMR helpers and dev components
- ✅ Design system and icon testing
- ✅ Development documentation

### **🔒 SECURITY & COMPLIANCE**
- ✅ Enhanced .gitignore with HIPAA considerations
- ✅ Database scripts excluded (contain patient data)
- ✅ Environment files excluded
- ✅ Temporary scripts excluded
- ✅ Build artifacts excluded

## 🎯 **NEXT STEPS**

1. **Immediate Cleanup**: Delete sensitive database files and temporary scripts
2. **Reorganization**: Move Docker and documentation files to appropriate folders
3. **Security Review**: Ensure no patient data or credentials in repository
4. **Documentation**: Update README.md with new structure
5. **Testing**: Verify application works after cleanup
6. **Deployment**: Use cleaned repository for production deployment

This structure provides a clean, professional, HIPAA-compliant repository ready for production deployment while maintaining all essential Bristol Park Hospital Management System functionality.
