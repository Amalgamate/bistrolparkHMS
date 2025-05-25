# 🏥 Bristol Park Hospital Management System (HMS)

A comprehensive, modern hospital management system built with React, TypeScript, Node.js, and PostgreSQL. Designed specifically for Bristol Park Hospital's multi-branch operations with HIPAA compliance and advanced medical workflow management.

## 🌟 **Key Features**

### **🏥 Hospital Modules**
- **👥 Patient Management** - Complete patient registration, records, and history
- **🏨 Admissions & Ward Management** - Bed allocation, patient admissions, transfers
- **⚕️ Clinical Workflows** - Doctor consultations, medical procedures, treatment plans
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
- **💰 Financial Management** - Billing, payments, insurance claims
- **📊 Analytics & Reporting** - Comprehensive hospital analytics
- **👨‍💼 Staff Management** - Employee records, scheduling, permissions
- **🏢 Multi-Branch Support** - Fedha, Utawala, Tassia, Machakos, Kitengela
- **🔐 Role-Based Access Control** - Granular permissions and security

### **🔗 External Integrations**
- **🏥 SMART API** - Insurance verification and claims
- **🏥 Slade360** - Healthcare provider integration
- **🏛️ SHA (Social Health Authority)** - Government health insurance
- **🔬 CityScan & ScanLab** - External laboratory integrations

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Docker & Docker Compose (optional)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/bristol-park-hms.git
   cd bristol-park-hms
   ```

2. **Install dependencies**
   ```bash
   # Frontend dependencies
   npm install
   
   # Backend dependencies
   cd api && npm install && cd ..
   ```

3. **Environment setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Database setup**
   ```bash
   # Create PostgreSQL database
   createdb bristol_park_hmis
   
   # Run migrations (contact admin for schema)
   ```

5. **Start development servers**
   ```bash
   # Start frontend (port 5173)
   npm run dev
   
   # Start backend API (port 5174)
   cd api && npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - API: http://localhost:5174

## 🐳 **Docker Deployment**

### **Development with Docker**
```bash
# Start all services
docker-compose -f docker/docker-compose.dev.yml up

# Access application
# Frontend: http://localhost:5173
# API: http://localhost:5174
# Database: localhost:5432
```

### **Production Deployment**
```bash
# Build and start production services
docker-compose -f docker/docker-compose.production.yml up -d

# View logs
docker-compose -f docker/docker-compose.production.yml logs -f
```

## 📁 **Project Structure**

```
bristol-park-hms/
├── 📁 src/                          # Frontend React/TypeScript application
│   ├── 📁 components/               # Reusable React components
│   │   ├── 📁 admissions/          # Admissions module components
│   │   ├── 📁 clinical/            # Clinical workflow components
│   │   ├── 📁 pharmacy/            # Pharmacy management components
│   │   ├── 📁 lab/                 # Laboratory components
│   │   ├── 📁 radiology/           # Radiology services components
│   │   ├── 📁 emergency/           # Emergency services components
│   │   ├── 📁 maternity/           # Maternity care components
│   │   ├── 📁 ambulance/           # Ambulance services components
│   │   ├── 📁 blood-bank/          # Blood bank components
│   │   ├── 📁 mortuary/            # Mortuary services components
│   │   ├── 📁 physiotherapy/       # Physiotherapy components
│   │   ├── 📁 procedures/          # Medical procedures components
│   │   ├── 📁 patients/            # Patient management components
│   │   ├── 📁 auth/                # Authentication components
│   │   ├── 📁 layout/              # Layout and navigation
│   │   ├── 📁 ui/                  # Reusable UI components
│   │   └── 📁 dashboard/           # Dashboard components
│   ├── 📁 pages/                   # Page-level components
│   ├── 📁 context/                 # React Context providers
│   ├── 📁 hooks/                   # Custom React hooks
│   ├── 📁 services/                # API service functions
│   ├── 📁 types/                   # TypeScript type definitions
│   ├── 📁 utils/                   # Utility functions
│   └── 📁 routes/                  # Application routing
├── 📁 api/                         # Backend Node.js/Express API
│   ├── 📁 src/                     # API source code
│   │   ├── 📁 controllers/         # Business logic controllers
│   │   ├── 📁 routes/              # API route definitions
│   │   ├── 📁 middleware/          # Express middleware
│   │   ├── 📁 validations/         # Input validation schemas
│   │   └── 📁 utils/               # Backend utility functions
│   └── package.json                # Backend dependencies
├── 📁 docker/                      # Docker configuration files
├── 📁 docs/                        # Project documentation
├── 📁 public/                      # Static frontend assets
└── 📁 smart-integrations/          # External API integrations
```

## ⚙️ **Configuration**

### **Environment Variables**
Key configuration options in `.env`:

```bash
# API Configuration
VITE_API_BASE_URL="http://localhost:5174/api"

# Database
DB_HOST="localhost"
DB_NAME="bristol_park_hmis"
DB_USER="postgres"
DB_PASSWORD="your_password"

# Hospital Configuration
HOSPITAL_NAME="Bristol Park Hospital"
REACT_APP_DEFAULT_BRANCH="fedha"

# External Integrations
SMART_API_KEY="your_smart_api_key"
SHA_API_KEY="your_sha_api_key"

# Security
JWT_SECRET="your_jwt_secret"
HIPAA_COMPLIANCE="true"
```

### **Hospital Branches**
The system supports multiple Bristol Park Hospital locations:
- **Main Campus** (Hospital ID: 18)
- **Fedha Branch** (Hospital ID: 19)
- **Utawala Branch** (Hospital ID: 20)
- **Tassia Branch** (Hospital ID: 21)
- **Machakos Branch** (Hospital ID: 22)
- **Kitengela Branch** (Hospital ID: 23)

## 🔐 **Security & Compliance**

### **HIPAA Compliance**
- ✅ Patient data encryption at rest and in transit
- ✅ Audit logging for all patient data access
- ✅ Role-based access control (RBAC)
- ✅ Secure authentication with JWT tokens
- ✅ Data anonymization for analytics

### **Security Features**
- 🔒 Multi-factor authentication (MFA)
- 🛡️ SQL injection prevention
- 🔐 XSS protection
- 🚫 CSRF protection
- 📝 Comprehensive audit trails
- 🔑 Encrypted sensitive data storage

## 🧪 **Development**

### **Available Scripts**
```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Backend
cd api
npm run dev          # Start development API server
npm run start        # Start production API server
npm run test         # Run API tests
```

### **Code Quality**
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Tailwind CSS** for styling
- **React Hook Form** for form management
- **Zod** for runtime validation

## 📚 **Documentation**

- [Development Guide](docs/DEVELOPMENT.md)
- [API Documentation](docs/API_README.md)
- [Docker Setup](docs/DOCKER_README.md)
- [Production Deployment](docs/PRODUCTION_SETUP.md)
- [Financial System](docs/FINANCIAL_SYSTEM_IMPLEMENTATION.md)
- [Backend Migration](docs/BACKEND_MIGRATION.md)

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Write comprehensive tests
- Maintain HIPAA compliance
- Document API changes
- Follow existing code patterns

## 📄 **License**

This project is proprietary software developed for Bristol Park Hospital. All rights reserved.

## 📞 **Support**

For technical support or questions:
- **Email**: support@bristolparkhospital.com
- **System Admin**: admin@bristolparkhospital.com
- **Emergency**: Contact hospital IT department

## 🏥 **About Bristol Park Hospital**

Bristol Park Hospital is a leading healthcare provider in Kenya, operating multiple branches across Nairobi and surrounding areas. This HMS system supports our commitment to providing excellent patient care through modern technology and efficient workflows.

---

**Built with ❤️ for Bristol Park Hospital**
