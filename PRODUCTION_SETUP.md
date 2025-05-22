# 🏥 Bristol Park Hospital - Production Environment Setup

## 🚀 **Production Deployment Checklist**

### **1. Server Requirements**
- **OS**: Ubuntu 20.04+ or similar
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: 50GB+ SSD
- **Network**: Public IP with ports 80, 443, 9000 open

### **2. Required Services**
- ✅ Docker & Docker Compose
- ✅ Portainer (Container Management)
- ✅ Nginx (Reverse Proxy)
- ✅ PostgreSQL (Database)
- ✅ SSL Certificate (Let's Encrypt)

## 🔧 **Production Environment Variables**

### **Required Variables for Portainer Stack**
```env
# Database Configuration (CRITICAL - Use Strong Passwords)
DB_PASSWORD=your_very_secure_database_password_here_min_16_chars
DB_NAME=bristol_park_hmis
DB_USER=postgres

# JWT Security (CRITICAL - Use Strong Secret)
JWT_SECRET=your_very_secure_jwt_secret_key_minimum_32_characters_long_random_string
JWT_EXPIRES_IN=24h

# Application Configuration
NODE_ENV=production
PORT=3001

# Database Connection
DB_HOST=db
DB_PORT=5432
DB_SSL=false

# Optional: Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Optional: File Upload Configuration
MAX_FILE_SIZE=10MB
UPLOAD_PATH=/app/uploads
```

## 🐳 **Portainer Stack Configuration**

### **Stack Name**: `bristol-park-hospital`
### **Repository**: `https://github.com/Amalgamate/bistrolparkHMS`
### **Compose File**: `docker-compose.production.yml`

### **Deployment Steps**:
1. **Access Portainer**: `http://YOUR_SERVER_IP:9000`
2. **Create Stack**: Stacks → Add Stack
3. **Configure**:
   - Name: `bristol-park-hospital`
   - Build method: Repository
   - Repository URL: `https://github.com/Amalgamate/bistrolparkHMS`
   - Reference: `refs/heads/master`
   - Compose path: `docker-compose.production.yml`
4. **Add Environment Variables** (see above)
5. **Deploy Stack**

## 🔒 **Security Configuration**

### **1. Database Security**
```sql
-- Connect to PostgreSQL and run:
-- Create application user with limited privileges
CREATE USER bristol_app WITH PASSWORD 'secure_app_password';
GRANT CONNECT ON DATABASE bristol_park_hmis TO bristol_app;
GRANT USAGE ON SCHEMA public TO bristol_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO bristol_app;
```

### **2. Firewall Configuration**
```bash
# Ubuntu UFW firewall rules
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw allow 9000/tcp    # Portainer (restrict to admin IPs)
sudo ufw enable
```

### **3. SSL Certificate Setup**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 **Monitoring & Health Checks**

### **1. Application Health**
- **Frontend**: `http://YOUR_DOMAIN/`
- **API Health**: `http://YOUR_DOMAIN:3001/health`
- **Database**: Check via Portainer logs

### **2. Container Monitoring**
```bash
# Check container status
docker ps

# View logs
docker logs bristol-park-hospital_frontend_1
docker logs bristol-park-hospital_api_1
docker logs bristol-park-hospital_db_1

# Resource usage
docker stats
```

### **3. Database Monitoring**
```sql
-- Check database connections
SELECT * FROM pg_stat_activity WHERE datname = 'bristol_park_hmis';

-- Check database size
SELECT pg_size_pretty(pg_database_size('bristol_park_hmis'));

-- Check table sizes
SELECT schemaname,tablename,pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## 🔄 **Backup Strategy**

### **1. Database Backups**
```bash
# Create backup script: /opt/backup-db.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"
mkdir -p $BACKUP_DIR

# Database backup
docker exec bristol-park-hospital_db_1 pg_dump -U postgres bristol_park_hmis > $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "db_backup_*.sql" -mtime +7 -delete

# Cron job (daily at 2 AM)
# 0 2 * * * /opt/backup-db.sh
```

### **2. Application Backups**
```bash
# Backup uploaded files and configurations
tar -czf /opt/backups/app_backup_$(date +%Y%m%d).tar.gz \
  /var/lib/docker/volumes/bristol-park-hospital_uploads \
  /opt/bristol-park-hospital/
```

## 🚨 **Disaster Recovery**

### **1. Database Recovery**
```bash
# Stop application
docker-compose -f docker-compose.production.yml down

# Restore database
docker-compose -f docker-compose.production.yml up -d db
docker exec -i bristol-park-hospital_db_1 psql -U postgres bristol_park_hmis < backup.sql

# Start application
docker-compose -f docker-compose.production.yml up -d
```

### **2. Full System Recovery**
```bash
# 1. Install Docker and Portainer
# 2. Restore from Git repository
git clone https://github.com/Amalgamate/bistrolparkHMS.git
cd bristrolparkHMS

# 3. Deploy via Portainer with backed up environment variables
# 4. Restore database from backup
# 5. Restore uploaded files
```

## 📈 **Performance Optimization**

### **1. Database Optimization**
```sql
-- Add indexes for common queries
CREATE INDEX idx_patients_created_at ON patients(created_at);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_users_email ON users(email);

-- Analyze tables
ANALYZE;
```

### **2. Application Optimization**
- Enable gzip compression in Nginx
- Configure proper caching headers
- Optimize Docker images
- Use connection pooling for database

### **3. Resource Limits**
```yaml
# In docker-compose.production.yml
services:
  frontend:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
  
  api:
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
```

## 🔍 **Troubleshooting**

### **Common Issues**
1. **Container won't start**: Check logs and environment variables
2. **Database connection failed**: Verify DB credentials and network
3. **502 Bad Gateway**: API container not responding
4. **Out of disk space**: Clean up old Docker images and logs

### **Log Locations**
- **Application logs**: Portainer → Containers → Logs
- **Nginx logs**: `/var/log/nginx/`
- **System logs**: `journalctl -u docker`

## 📞 **Support Contacts**

- **System Admin**: system@bristolparkhospital.com
- **Development Team**: dev@bristolparkhospital.com
- **Emergency**: +254-XXX-XXXX
