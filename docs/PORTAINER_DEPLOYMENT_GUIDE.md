# 🚀 Bristol Park HMS - Portainer Deployment Guide

## **Prerequisites**

### ✅ **Before You Start**
- [ ] Portainer CE/EE installed and running
- [ ] Docker Swarm initialized (for production) OR Docker Compose available
- [ ] GitHub repository: `https://github.com/Amalgamate/bistrolparkHMS`
- [ ] SSL certificates ready (for production)
- [ ] Backup storage configured

---

## **🔧 Step 1: Portainer Stack Setup**

### **1.1 Access Portainer**
1. Open Portainer: `http://your-server:9000`
2. Login with admin credentials
3. Navigate to **Stacks** → **Add Stack**

### **1.2 Create New Stack**
- **Name**: `bristol-park-hms-production`
- **Build Method**: Choose **Git Repository**

### **1.3 Git Repository Configuration**
```
Repository URL: https://github.com/Amalgamate/bistrolparkHMS
Reference: refs/heads/main
Compose Path: docker/portainer-stack.yml
```

---

## **🔐 Step 2: Environment Variables**

### **2.1 Critical Security Variables**
Copy these to Portainer **Environment Variables** section:

```env
# Database (CHANGE THESE!)
DB_PASSWORD=YourSecurePassword123!
JWT_SECRET=YourSecureJWTSecret32CharactersMinimum!
REDIS_PASSWORD=YourSecureRedisPassword123!

# Domain Configuration
DOMAIN=yourhospital.com
FRONTEND_PORT=80
API_PORT=3001

# Database Settings
DB_NAME=bristol_park_hmis
DB_USER=postgres
DB_EXTERNAL_PORT=5433
```

### **2.2 HIPAA Compliance Variables**
```env
ENABLE_AUDIT_LOGS=true
ENABLE_ENCRYPTION_AT_REST=true
SESSION_TIMEOUT=3600
LOG_LEVEL=info
BACKUP_RETENTION_DAYS=30
```

---

## **🚀 Step 3: Deploy Stack**

### **3.1 Deploy**
1. Click **Deploy the Stack**
2. Wait for all services to start (2-3 minutes)
3. Check **Containers** tab for status

### **3.2 Verify Deployment**
```bash
# Check service status
docker ps

# Check logs
docker logs bristol-park-hms-production_api_1
docker logs bristol-park-hms-production_frontend_1
docker logs bristol-park-hms-production_db_1
```

### **3.3 Access Application**
- **Frontend**: `http://your-domain.com`
- **API Health**: `http://your-domain.com:3001/api/health`
- **Database**: `localhost:5433` (internal access only)

---

## **🔄 Step 4: Update Workflow**

### **4.1 Automatic Updates (Recommended)**
1. Push code to GitHub `main` branch
2. In Portainer: **Stacks** → **bristol-park-hms-production**
3. Click **Update the Stack**
4. Select **Pull and redeploy**

### **4.2 Manual Updates**
```bash
# Pull latest images
docker-compose -f docker/portainer-stack.yml pull

# Restart services
docker-compose -f docker/portainer-stack.yml up -d
```

---

## **📊 Step 5: Monitoring & Maintenance**

### **5.1 Health Checks**
Monitor these endpoints:
- Frontend: `http://your-domain/`
- API: `http://your-domain:3001/api/health`
- Database: Check Portainer container status

### **5.2 Backup Verification**
```bash
# Check backup files
docker exec bristol-park-hms-production_backup_1 ls -la /backups

# Manual backup
docker exec bristol-park-hms-production_db_1 pg_dump -U postgres bristol_park_hmis > backup.sql
```

### **5.3 Log Monitoring**
```bash
# View real-time logs
docker logs -f bristol-park-hms-production_api_1
docker logs -f bristol-park-hms-production_frontend_1
```

---

## **🔒 Security Checklist**

### **✅ Pre-Production Security**
- [ ] Changed all default passwords
- [ ] JWT secret is 32+ characters
- [ ] Database password is strong (16+ chars)
- [ ] SSL certificates installed
- [ ] Firewall configured (only 80, 443, 22 open)
- [ ] Backup encryption enabled
- [ ] Audit logging enabled

### **✅ HIPAA Compliance**
- [ ] Data encryption at rest enabled
- [ ] Audit logs configured
- [ ] Access controls implemented
- [ ] Backup retention policy set
- [ ] Incident response plan ready

---

## **🚨 Troubleshooting**

### **Common Issues**

**1. Database Connection Failed**
```bash
# Check database status
docker logs bristol-park-hms-production_db_1

# Verify environment variables
docker exec bristol-park-hms-production_api_1 env | grep DB_
```

**2. Frontend Not Loading**
```bash
# Check frontend logs
docker logs bristol-park-hms-production_frontend_1

# Verify nginx configuration
docker exec bristol-park-hms-production_frontend_1 nginx -t
```

**3. API Errors**
```bash
# Check API logs
docker logs bristol-park-hms-production_api_1

# Test API directly
curl http://localhost:3001/api/health
```

---

## **📞 Support**

For deployment issues:
1. Check container logs first
2. Verify environment variables
3. Ensure GitHub repository access
4. Contact system administrator

**Emergency Contact**: system@bristolparkhospital.com
