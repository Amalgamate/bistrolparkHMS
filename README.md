# 🏥 Bristol Park Hospital Management System (HMS)

A comprehensive, production-ready hospital management system built with React, TypeScript, Node.js, and PostgreSQL. Designed for Bristol Park Hospital's multi-branch operations with enterprise-grade Docker deployment, HIPAA compliance, and advanced medical workflow management.

## 🚀 **Production Features**

### **🐳 Enterprise Deployment**
- **Docker & Portainer Integration** - Production-ready containerized deployment
- **Multi-Environment Support** - Development, staging, and production configurations
- **Service Management Dashboard** - Real-time monitoring and control
- **Automated Backups** - HIPAA-compliant data protection with retention policies
- **High Availability** - Load balancing and health monitoring
- **PWA Capabilities** - Offline support and mobile-first design

### **🔐 Security & Compliance**
- **HIPAA-Compliant Architecture** - End-to-end data protection
- **Role-Based Access Control** - Super Admin, Bristol Admin, and Admin tiers
- **Audit Logging** - Comprehensive activity tracking for compliance
- **Data Encryption** - At rest and in transit protection
- **Session Management** - Secure authentication with JWT tokens
- **Network Isolation** - Containerized security boundaries

### **🏥 Hospital Modules**
- **👥 Patient Management** - Complete patient registration, records, and history
- **🏨 Admissions & Ward Management** - Multi-branch bed allocation and transfers
- **⚕️ Clinical Workflows** - Doctor consultations, queue management, treatment plans
- **💊 Pharmacy Management** - Prescription management, inventory, dispensing
- **🔬 Laboratory Services** - Lab tests, results management, reporting
- **📡 Radiology Services** - Imaging requests, results, DICOM integration
- **🚑 Emergency Services** - Emergency patient management, triage
- **👶 Maternity Care** - Prenatal, delivery, postnatal care management
- **🚑 Ambulance Services** - Ambulance dispatch, tracking, coordination
- **🩸 Blood Bank** - Blood inventory, donation, transfusion management
- **🏥 Mortuary Services** - Deceased patient management, documentation
- **🏃 Physiotherapy** - Treatment plans, session management, progress tracking
- **⚕️ Medical Procedures** - Procedure scheduling, documentation, billing

### **💼 Back Office Operations**
- **💰 Enhanced Financial System** - Billing, payments, insurance claims processing
- **📊 Analytics & Reporting** - Real-time hospital analytics and dashboards
- **👨‍💼 User Management** - Role-based staff management with permissions
- **🏢 Multi-Branch Support** - Fedha, Utawala, Tassia, Machakos, Kitengela locations
- **🔧 Service Management** - System monitoring and maintenance tools

### **🔗 External Integrations**
- **🏥 SMART API** - Insurance verification and claims processing
- **🏥 Slade360** - Healthcare provider integration
- **🏛️ SHA (Social Health Authority)** - Government health insurance
- **🔬 CityScan & ScanLab** - External laboratory integrations

## 🚀 **Deployment Options**

### **🐳 Production Deployment (Recommended)**

#### **Prerequisites**
- Docker & Docker Compose
- Portainer (for production management)
- PostgreSQL 15+ (or use containerized version)
- SSL certificates (for production)

#### **Quick Production Setup**
1. **Clone and prepare repository**
   ```bash
   git clone https://github.com/Amalgamate/bistrolparkHMS.git
   cd bistrolparkHMS
   ```

2. **Deploy with Portainer**
   - Access Portainer: `http://your-server:9000`
   - Create new stack: `bristol-park-hms-production`
   - Repository: `https://github.com/Amalgamate/bistrolparkHMS`
   - Compose file: `docker/portainer-stack.yml`
   - Configure environment variables (see [Portainer Guide](docs/PORTAINER_DEPLOYMENT_GUIDE.md))

3. **Access the system**
   - Frontend: `http://your-domain`
   - API: `http://your-domain:3001/api/health`
   - Service Management: Available to Super Admin users

### **🛠️ Development Setup**

#### **Prerequisites**
- Node.js 20+ and npm
- PostgreSQL 15+
- Docker (optional)

#### **Local Development**
1. **Clone and install**
   ```bash
   git clone https://github.com/Amalgamate/bistrolparkHMS.git
   cd bistrolparkHMS
   npm install
   cd api && npm install && cd ..
   ```

2. **Environment configuration**
   ```bash
   cp .env.example .env
   # Configure database and API settings
   ```

3. **Start development servers**
   ```bash
   # Frontend (port 5173)
   npm run dev

   # API (port 3001)
   cd api && npm run dev
   ```

#### **Docker Development**
```bash
# Start all services with hot reload
docker-compose -f docker/docker-compose.dev.yml up
```

## 🏗️ **Architecture & Configuration**

### **🐳 Container Architecture**
```
Bristol Park HMS Production Stack:
├── 🌐 Frontend (React/TypeScript) - Port 80
├── 🔧 API Server (Node.js/Express) - Port 3001
├── 🗄️ PostgreSQL Database - Port 5432
├── 🚀 Redis Cache - Port 6379
└── 💾 Automated Backup Service
```

### **🔐 Role-Based Access Control**
- **Super Admin** - Full system access including Service Management
- **Bristol Admin** - Hospital operations and limited administration
- **Admin** - Department-specific access and permissions
- **Clinical Staff** - Patient care and medical workflows
- **Front Office** - Patient registration and scheduling

### **🏢 Multi-Branch Configuration**
Bristol Park Hospital operates across multiple locations:
- **Fedha** - 1st Floor Operations
- **Utawala** - 1st & 2nd Floor Operations
- **Tassia** - 1st Floor Operations
- **Machakos** - 2nd Floor Operations
- **Kitengela** - 2nd & 3rd Floor Operations

### **📊 Service Management Dashboard**
Available to Super Admin users for:
- Real-time service monitoring (PostgreSQL, API, Frontend)
- Service start/stop controls
- System health checks
- Performance metrics
- Automated backup status

## 📁 **Project Structure**

```
bristol-park-hms/
├── 📁 src/                          # Frontend React/TypeScript application
│   ├── 📁 components/               # Reusable React components
│   │   ├── 📁 admin/               # Service management & user administration
│   │   ├── 📁 admissions/          # Ward management & patient admissions
│   │   ├── 📁 clinical/            # Clinical workflows & consultations
│   │   ├── 📁 financial/           # Billing & payment processing
│   │   ├── 📁 patients/            # Patient registration & records
│   │   ├── 📁 auth/                # Authentication & authorization
│   │   ├── 📁 layout/              # Navigation & page layouts
│   │   ├── 📁 ui/                  # Enhanced UI components & transitions
│   │   └── 📁 [modules]/           # Hospital module components
│   ├── 📁 pages/                   # Page-level components & routing
│   │   ├── 📁 admin/               # Administration pages
│   │   ├── 📁 admissions/          # Ward management pages
│   │   └── 📁 [modules]/           # Module-specific pages
│   ├── 📁 context/                 # React Context providers
│   ├── 📁 hooks/                   # Custom React hooks
│   ├── 📁 services/                # API service functions
│   ├── 📁 utils/                   # Utility functions & helpers
│   └── 📁 styles/                  # CSS modules & themes
├── 📁 api/                         # Backend Node.js/Express API
│   ├── 📁 src/                     # API source code
│   │   ├── 📁 controllers/         # Business logic controllers
│   │   ├── 📁 routes/              # API route definitions
│   │   ├── 📁 middleware/          # Authentication & validation
│   │   └── 📁 utils/               # Backend utilities
│   └── package.json                # Backend dependencies
├── 📁 docker/                      # Docker & Portainer configuration
│   ├── 📄 portainer-stack.yml     # Production Portainer stack
│   ├── 📄 docker-compose.*.yml    # Multi-environment configurations
│   └── 📁 api/                     # API container configurations
├── 📁 docs/                        # Comprehensive documentation
│   ├── 📄 PORTAINER_DEPLOYMENT_GUIDE.md
│   ├── 📄 DEPLOYMENT_WORKFLOW.md
│   └── 📄 [additional guides]
├── 📁 scripts/                     # Automation & startup scripts
└── 📁 public/                      # Static assets & PWA manifest
```

## ⚙️ **Configuration**

### **Environment Variables**
Configuration is managed through environment files:

- **`.env.example`** - Template with all available options
- **`docker/portainer.env`** - Production environment template for Portainer
- **`.env.production.template`** - Production-specific configuration

Key configuration areas:
- **Database Connection** - PostgreSQL settings and credentials
- **JWT Authentication** - Secure token configuration
- **Hospital Settings** - Multi-branch configuration
- **External APIs** - SMART, SHA, Slade360 integration keys
- **Security Settings** - HIPAA compliance and encryption
- **Service Management** - Monitoring and health check settings

### **Default User Credentials**
- **Super Admin**: Contact system administrator
- **Bristol Admin**: `bristoladmin` / `Bristol2024!` (change in production)

### **Multi-Branch Support**
Bristol Park Hospital locations with ward management:
- **Fedha** - 1st Floor Operations
- **Utawala** - 1st & 2nd Floor Operations
- **Tassia** - 1st Floor Operations
- **Machakos** - 2nd Floor Operations
- **Kitengela** - 2nd & 3rd Floor Operations

## 🔐 **Security & Compliance**

### **HIPAA Compliance Features**
- ✅ **End-to-End Encryption** - Data encrypted at rest and in transit
- ✅ **Comprehensive Audit Logging** - All patient data access tracked
- ✅ **Role-Based Access Control** - Granular permission system
- ✅ **Secure Authentication** - JWT tokens with session management
- ✅ **Data Backup & Recovery** - Automated encrypted backups
- ✅ **Network Isolation** - Containerized security boundaries
- ✅ **Access Controls** - Multi-tier user permission system

### **Production Security**
- 🔒 **Container Security** - Non-root users, read-only filesystems
- 🛡️ **Network Security** - Isolated Docker networks, firewall rules
- 🔐 **Data Protection** - PostgreSQL encryption, secure connections
- 🚫 **Attack Prevention** - SQL injection, XSS, CSRF protection
- 📝 **Audit Trails** - Comprehensive activity logging
- 🔑 **Secret Management** - Environment-based credential handling
- 🚨 **Monitoring** - Real-time security monitoring and alerts

## 🧪 **Development & Maintenance**

### **Available Scripts**
```bash
# Frontend Development
npm run dev          # Start development server (port 5173)
npm run build        # Build for production
npm run preview      # Preview production build

# Backend Development
cd api
npm run dev          # Start development API server (port 3001)
npm run start        # Start production API server

# Docker Operations
docker-compose -f docker/docker-compose.dev.yml up      # Development
docker-compose -f docker/docker-compose.production.yml up -d  # Production
```

### **Technology Stack**
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, PostgreSQL, JWT
- **Deployment**: Docker, Portainer, Nginx
- **Security**: HIPAA-compliant architecture, role-based access
- **Monitoring**: Health checks, audit logging, service management

## 📚 **Documentation**

### **Deployment & Operations**
- [🚀 Portainer Deployment Guide](docs/PORTAINER_DEPLOYMENT_GUIDE.md)
- [🔄 Deployment Workflow](docs/DEPLOYMENT_WORKFLOW.md)
- [🐳 Docker Configuration](docs/DOCKER_README.md)
- [🏭 Production Setup](docs/PRODUCTION_SETUP.md)

### **Development & Integration**
- [💻 Development Guide](docs/DEVELOPMENT.md)
- [🔌 API Documentation](docs/API_README.md)
- [💰 Financial System](docs/FINANCIAL_SYSTEM_IMPLEMENTATION.md)
- [🔄 Backend Migration](docs/BACKEND_MIGRATION.md)

### **Security & Compliance**
- [🔒 Security Audit Checklist](SECURITY_AUDIT_CHECKLIST.md)
- [📋 Installation Guide](INSTALLATION_GUIDE.md)
- [🏗️ Repository Structure](REPOSITORY_STRUCTURE.md)

## 🚀 **Getting Started Checklist**

### **For Hospital Administrators**
- [ ] Review [Security Audit Checklist](SECURITY_AUDIT_CHECKLIST.md)
- [ ] Configure environment variables using templates
- [ ] Set up Portainer for production deployment
- [ ] Create user accounts with appropriate roles
- [ ] Configure multi-branch settings
- [ ] Test backup and recovery procedures

### **For Technical Staff**
- [ ] Follow [Portainer Deployment Guide](docs/PORTAINER_DEPLOYMENT_GUIDE.md)
- [ ] Set up monitoring and health checks
- [ ] Configure SSL certificates for production
- [ ] Implement backup retention policies
- [ ] Test service management dashboard
- [ ] Verify HIPAA compliance settings

## 🔧 **Maintenance & Support**

### **Regular Maintenance Tasks**
- **Daily**: Monitor service health and backup status
- **Weekly**: Review audit logs and security alerts
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Full system backup and recovery testing

### **Support Contacts**
- **System Administration**: system@bristolparkhospital.com
- **Technical Support**: Contact hospital IT department
- **Emergency Issues**: Use service management dashboard

## 📄 **License & Compliance**

This project is proprietary software developed for Bristol Park Hospital. All rights reserved.

**HIPAA Compliance**: This system is designed to meet HIPAA requirements for healthcare data protection. Ensure proper configuration and maintenance of security features.

## 🏥 **About Bristol Park Hospital**

Bristol Park Hospital is a leading healthcare provider in Kenya, operating multiple branches across Nairobi and surrounding areas. This HMS system supports our commitment to providing excellent patient care through modern technology, efficient workflows, and HIPAA-compliant data management.

### **System Capabilities**
- **Multi-Branch Operations** - Unified management across all locations
- **Real-Time Monitoring** - Service health and performance tracking
- **Scalable Architecture** - Docker-based deployment for growth
- **Security-First Design** - HIPAA compliance and data protection

---

**🏥 Built with ❤️ for Bristol Park Hospital | Production-Ready HMS Solution**
