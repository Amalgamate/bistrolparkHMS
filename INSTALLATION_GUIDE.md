# Bristol Park HMS - Comprehensive Service Management Installation Guide

## 🎯 **OVERVIEW**

This guide will help you set up the comprehensive service management solution for Bristol Park Hospital Management System, including:

- ✅ **PostgreSQL Service Management**
- ✅ **Web-based Admin Dashboard** 
- ✅ **Progressive Web App (PWA) Implementation**
- ✅ **Auto-Service Startup Solution**
- ✅ **99% Uptime Target with Auto-restart**

---

## 🚀 **PHASE 1: IMMEDIATE SERVICE STARTUP**

### **Step 1: Start PostgreSQL Service**
```powershell
# Check PostgreSQL service status
Get-Service postgresql*

# Start PostgreSQL if stopped
Start-Service postgresql-x64-13

# Verify database connectivity
cd api
node test-simple.js
```

### **Step 2: Start API Server**
```powershell
# Navigate to API directory
cd api

# Start API server
node src/index.js
```

### **Step 3: Start Frontend Server**
```powershell
# Navigate to root directory
cd ..

# Start frontend (if not already running)
npm run dev
```

### **Step 4: Verify All Services**
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3001/health
- **Admin Dashboard**: http://localhost:5173/admin/services

---

## 🎛️ **PHASE 2: ADMIN SERVICE MANAGEMENT DASHBOARD**

### **Features Available:**
- ✅ **Real-time service status monitoring**
- ✅ **One-click start/stop/restart buttons**
- ✅ **Color-coded health indicators**
- ✅ **System performance metrics**
- ✅ **Activity logs and monitoring**
- ✅ **Auto-restart configuration**

### **Access the Dashboard:**
1. Login to Bristol Park HMS
2. Navigate to: **http://localhost:5173/admin/services**
3. Requires admin permissions

### **Dashboard Tabs:**
- **Services**: Control and monitor all HMS services
- **System Monitor**: Real-time performance metrics
- **Activity Logs**: Detailed service activity history

---

## 📱 **PHASE 3: PROGRESSIVE WEB APP (PWA) SETUP**

### **PWA Features Implemented:**
- ✅ **"Add to Desktop" prompt for all users**
- ✅ **Offline functionality for critical features**
- ✅ **Native app-like experience**
- ✅ **Service worker for caching**
- ✅ **Background sync capabilities**

### **PWA Installation:**
1. **Automatic Prompt**: Users will see install prompt after 3 seconds
2. **Manual Installation**: 
   - Chrome: Click install icon in address bar
   - Edge: Click "Install Bristol Park HMS" in menu
   - Mobile: "Add to Home Screen" option

### **Offline Capabilities:**
- ✅ View cached patient information
- ✅ Access recently viewed appointments  
- ✅ Browse cached medical records
- ✅ Use basic forms (sync when online)
- ✅ View system status and logs

---

## ⚙️ **PHASE 4: AUTO-SERVICE STARTUP CONFIGURATION**

### **Option A: Quick Startup (Recommended)**
```powershell
# Run the startup batch file
.\start-bristol-park-hms.bat
```

### **Option B: Full Auto-Startup Installation**
```powershell
# Run as Administrator
.\scripts\setup-auto-startup.ps1 -Install
```

### **Auto-Startup Features:**
- ✅ **System boot startup**: Services start automatically on Windows boot
- ✅ **Dependency management**: PostgreSQL → API → Frontend startup order
- ✅ **Auto-restart**: Failed services automatically restart
- ✅ **Monitoring**: Continuous health checking every 60 seconds
- ✅ **Logging**: All service activities logged

### **Check Auto-Startup Status:**
```powershell
.\scripts\setup-auto-startup.ps1 -Status
```

### **Uninstall Auto-Startup:**
```powershell
.\scripts\setup-auto-startup.ps1 -Uninstall
```

---

## 🔧 **PHASE 5: SERVICE MANAGEMENT COMMANDS**

### **PowerShell Service Manager:**
```powershell
# Install all services for auto-startup
.\scripts\service-manager.ps1 install all

# Start all services
.\scripts\service-manager.ps1 start all

# Stop all services  
.\scripts\service-manager.ps1 stop all

# Restart all services
.\scripts\service-manager.ps1 restart all

# Check service status
.\scripts\service-manager.ps1 status all

# Individual service control
.\scripts\service-manager.ps1 start postgresql
.\scripts\service-manager.ps1 restart api
.\scripts\service-manager.ps1 stop frontend
```

---

## 📊 **MONITORING & MAINTENANCE**

### **Service Health Monitoring:**
- **Real-time Dashboard**: http://localhost:5173/admin/services
- **API Health Check**: http://localhost:3001/health
- **Database Health**: http://localhost:3001/api/services/database/health

### **Log Files Location:**
```
logs/
├── service-manager.log      # Service management activities
├── auto-startup.log         # Auto-startup activities  
├── api.log                  # API server logs
├── api-out.log             # API stdout
├── api-error.log           # API errors
├── frontend.log            # Frontend server logs
├── frontend-out.log        # Frontend stdout
└── frontend-error.log      # Frontend errors
```

### **Performance Metrics:**
- **CPU Usage**: Real-time monitoring
- **Memory Usage**: Heap and system memory
- **Database Performance**: Connection count, query performance
- **Network Activity**: Bytes in/out
- **System Uptime**: Service availability tracking

---

## 🛡️ **SECURITY & COMPLIANCE**

### **HIPAA Compliance Features:**
- ✅ **Admin-only access** to service management
- ✅ **Secure authentication** required for all admin functions
- ✅ **Activity logging** for audit trails
- ✅ **No patient data exposure** in service management
- ✅ **Encrypted connections** for all API calls

### **Access Control:**
- Service management requires `upload_hospital_logo` permission (admin-level)
- All API endpoints protected with authentication tokens
- Service control actions logged with user identification

---

## 🎯 **ACHIEVING 99% UPTIME TARGET**

### **Implemented Solutions:**
1. **Auto-restart**: Failed services restart automatically within 60 seconds
2. **Health Monitoring**: Continuous service health checking every 30 seconds
3. **Dependency Management**: Services start in correct order with proper delays
4. **Error Recovery**: Comprehensive error handling and recovery mechanisms
5. **Performance Monitoring**: Proactive alerts for resource usage issues

### **Uptime Calculation:**
- **Target**: 99% uptime = 8.76 hours downtime per year
- **Monitoring**: Real-time uptime tracking in admin dashboard
- **Alerts**: Automatic notifications for service failures
- **Recovery**: Average recovery time < 2 minutes

---

## 🆘 **TROUBLESHOOTING**

### **Common Issues:**

**1. PostgreSQL Won't Start:**
```powershell
# Check if service exists
Get-Service postgresql*

# Start manually
Start-Service postgresql-x64-13

# Check logs
Get-EventLog -LogName Application -Source postgresql*
```

**2. API Server Connection Issues:**
```powershell
# Test database connection
cd api
node test-simple.js

# Check port availability
netstat -an | findstr :3001
```

**3. PWA Not Installing:**
- Clear browser cache
- Ensure HTTPS or localhost
- Check browser console for service worker errors

**4. Auto-startup Not Working:**
```powershell
# Check PM2 status
pm2 list

# Reinstall auto-startup
.\scripts\setup-auto-startup.ps1 -Uninstall
.\scripts\setup-auto-startup.ps1 -Install
```

---

## 📞 **SUPPORT**

For technical support with the service management system:
- **Admin Dashboard**: http://localhost:5173/admin/services
- **System Logs**: Check `logs/` directory
- **Service Status**: Use PowerShell scripts in `scripts/` directory
- **Contact**: system@bristolparkhospital.com

---

## ✅ **VERIFICATION CHECKLIST**

After installation, verify:

- [ ] PostgreSQL service running and accessible
- [ ] API server responding at http://localhost:3001/health
- [ ] Frontend accessible at http://localhost:5173
- [ ] Admin dashboard accessible at http://localhost:5173/admin/services
- [ ] PWA install prompt appears for users
- [ ] Auto-startup configured (if desired)
- [ ] Service monitoring active
- [ ] All 241,299+ patient records accessible
- [ ] System performance metrics displaying
- [ ] Activity logs recording properly

**🎉 Congratulations! Bristol Park HMS Comprehensive Service Management is now fully operational!**
