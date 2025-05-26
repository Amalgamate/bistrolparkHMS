# 🚀 Bristol Park HMS - Unified Startup Guide

This guide explains how to use the unified startup system that launches all Bristol Park HMS services with a single command and provides immediate visual feedback.

## 🎯 **Quick Start Commands**

### **Windows (Recommended)**
```bash
# Double-click the batch file (simplest method)
start-bristol-hms.bat

# Or run from command line
npm run start:all
npm run start:full
npm run dev:full
```

### **PowerShell (Advanced)**
```powershell
# Run PowerShell script directly
.\scripts\unified-startup.ps1

# With options
.\scripts\unified-startup.ps1 -SkipBrowser -Verbose
```

### **Node.js (Cross-platform)**
```bash
# Using npm scripts
npm run start:all

# Direct execution
node scripts/unified-startup.js
```

---

## 🔧 **What the Unified Startup Does**

### **1. Service Dependency Management**
- ✅ **PostgreSQL Database** (Port 5432) - Verifies running
- ✅ **API Server** (Port 3001) - Starts if needed
- ✅ **Frontend Server** (Port 5173) - Starts if needed

### **2. Immediate Visual Feedback**
- 🔍 **Real-time status checking** with colored terminal output
- ⏳ **Progress indicators** for each service startup
- ✅ **Success confirmations** when services are ready
- ❌ **Error reporting** with troubleshooting guidance

### **3. Automatic Navigation Flow**
- 🌐 **Auto-opens browser** to Bristol Park HMS
- 📊 **Shows startup progress modal** with service status
- 🔐 **Redirects to login** when all services are ready
- 🎯 **Pre-populates credentials** (bristoladmin/Bristol2024!)

---

## 📱 **Startup Progress Modal Features**

The unified startup automatically displays a progress modal that shows:

### **Service Status Indicators**
- 🗄️ **PostgreSQL Database** - Connection verification
- 🚀 **API Server** - Health check and startup
- 🌐 **Frontend Server** - Availability confirmation

### **Visual Status States**
- 🔍 **Checking** - Verifying service status
- ⏳ **Starting** - Launching service process
- ✅ **Running** - Service is active
- 🎉 **Ready** - Service responding to requests
- ❌ **Error** - Service failed to start

### **Interactive Elements**
- 🔄 **Retry Button** - Restart failed services
- 🌐 **Quick Links** - Direct access to app and dashboard
- ❌ **Close Button** - Dismiss modal manually

---

## 🛠️ **Error Handling & Troubleshooting**

### **Common Issues & Solutions**

#### **PostgreSQL Not Running**
```
❌ PostgreSQL Database: FAILED
   Cannot connect to port 5432
```
**Solution**: Start PostgreSQL service manually
- Windows: `net start postgresql-x64-13`
- Or use pgAdmin/Services panel

#### **Port Already in Use**
```
❌ API Server: FAILED
   Port 3001 is already in use
```
**Solution**: Kill existing process or change port
```bash
# Find process using port
netstat -ano | findstr :3001
# Kill process (replace PID)
taskkill /PID <PID> /F
```

#### **Node.js/npm Not Found**
```
❌ Node.js is not installed or not in PATH
```
**Solution**: Install Node.js from https://nodejs.org/

### **Manual Fallback**
If unified startup fails, start services manually:
```bash
# Terminal 1: API Server
cd server
node server.js

# Terminal 2: Frontend
npm run dev
```

---

## ⚙️ **Configuration Options**

### **PowerShell Script Options**
```powershell
# Skip automatic browser opening
.\scripts\unified-startup.ps1 -SkipBrowser

# Enable verbose logging
.\scripts\unified-startup.ps1 -Verbose

# Combine options
.\scripts\unified-startup.ps1 -SkipBrowser -Verbose
```

### **Environment Variables**
```bash
# Custom ports (if needed)
set API_PORT=3001
set FRONTEND_PORT=5173
set DB_PORT=5432
```

---

## 🎯 **Expected Startup Flow**

### **1. Command Execution**
```
🏥 Bristol Park HMS - Unified Startup
==================================================
Starting all services with dependency management...
```

### **2. Service Checking**
```
🔍 🗄️ PostgreSQL Database (Port 5432): CHECKING
✅ 🗄️ PostgreSQL Database (Port 5432): READY
   Service is already running

🔍 🚀 API Server (Port 3001): CHECKING
⏳ 🚀 API Server (Port 3001): STARTING
   Launching service...
✅ 🚀 API Server (Port 3001): READY
   Service is ready and responding
```

### **3. Browser Launch**
```
🌐 Opening Bristol Park HMS with startup progress...
🔐 Ready for login...
```

### **4. Success Summary**
```
🎯 Startup Summary
==============================
🗄️ PostgreSQL Database: READY
🚀 API Server: READY
🌐 Frontend Server: READY

🎉 All services are ready!
✨ Bristol Park HMS is ready for use!
📱 Access the application at: http://localhost:5173
🔐 Login credentials: bristoladmin / Bristol2024!
```

---

## 🔗 **Quick Access URLs**

After successful startup, these URLs are available:

- **🏠 Main Application**: http://localhost:5173
- **🔐 Login Page**: http://localhost:5173 (auto-redirects)
- **📊 Dashboard**: http://localhost:5173/dashboard
- **🔧 Service Management**: http://localhost:5173/admin/services
- **🩺 API Health**: http://localhost:3001/api/health

---

## 💡 **Tips & Best Practices**

### **For Development**
- Use `npm run dev:full` for daily development startup
- Keep PostgreSQL running as a service for faster startups
- Use the service management dashboard to monitor system health

### **For Production**
- Use Docker containers for better service management
- Set up proper process managers (PM2, systemd)
- Configure automatic service recovery

### **For Troubleshooting**
- Check the service management dashboard first
- Use verbose mode for detailed logging
- Verify all prerequisites are installed

---

## 🎉 **Success!**

Once you see the startup progress modal and all services show as "READY", Bristol Park HMS is fully operational and ready for use!

**Login with**: `bristoladmin` / `Bristol2024!`
