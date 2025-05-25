# 🔄 Bristol Park HMS - Deployment Workflow

## **Development → Production Pipeline**

### **🏗️ Phase 1: Development**
```bash
# 1. Local Development
npm run dev                    # Frontend development
cd api && npm run dev         # API development

# 2. Local Testing
npm run build                 # Test production build
docker-compose -f docker/docker-compose.simple.yml up  # Test containers
```

### **📤 Phase 2: Git Preparation**
```bash
# 1. Pre-commit cleanup
./cleanup-before-git.ps1      # Run cleanup script

# 2. Commit changes
git add .
git commit -m "feat: add new feature"
git push origin main
```

### **🐳 Phase 3: Docker Build**
```bash
# Automatic via Portainer Git integration
# OR Manual:
docker build -t bristol-park-hms-frontend:latest -f docker/Dockerfile.simple .
docker build -t bristol-park-hms-api:latest -f docker/api/Dockerfile.simple ./api
```

### **🚀 Phase 4: Portainer Deployment**
1. **Automatic**: Portainer pulls from Git and rebuilds
2. **Manual**: Update stack in Portainer UI

---

## **🌍 Environment Management**

### **Development Environment**
```yaml
# docker/docker-compose.dev.yml
services:
  frontend:
    build:
      context: .
      dockerfile: docker/Dockerfile.dev
    volumes:
      - ./src:/app/src  # Hot reload
    environment:
      - NODE_ENV=development
```

### **Staging Environment**
```yaml
# docker/docker-compose.staging.yml
services:
  frontend:
    image: bristol-park-hms-frontend:staging
    environment:
      - NODE_ENV=staging
      - API_URL=https://staging-api.bristolpark.com
```

### **Production Environment**
```yaml
# docker/portainer-stack.yml (already created)
services:
  frontend:
    image: bristol-park-hms-frontend:latest
    environment:
      - NODE_ENV=production
```

---

## **💾 Database Migration Strategy**

### **🔄 Migration Workflow**
```bash
# 1. Create migration
cd api/src/migrations
touch 001_add_new_table.sql

# 2. Test locally
npm run migrate:up

# 3. Deploy to staging
# (Portainer staging stack)

# 4. Deploy to production
# (Portainer production stack with migration)
```

### **📊 Data Persistence**
```yaml
# Persistent volumes for patient data
volumes:
  postgres_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /opt/bristol-park/data
  
  postgres_backups:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /opt/bristol-park/backups
```

---

## **🔐 Security & HIPAA Compliance**

### **🛡️ Security Layers**

**1. Network Security**
```yaml
networks:
  bristol-park-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
    internal: true  # No external access
```

**2. Container Security**
```yaml
services:
  api:
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
    user: "1001:1001"
```

**3. Data Encryption**
```yaml
environment:
  - POSTGRES_INITDB_ARGS="--auth-host=scram-sha-256"
  - DB_SSL=require
  - ENABLE_ENCRYPTION_AT_REST=true
```

### **📋 HIPAA Checklist**
- [ ] **Access Controls**: Role-based permissions implemented
- [ ] **Audit Logs**: All patient data access logged
- [ ] **Encryption**: Data encrypted in transit and at rest
- [ ] **Backups**: Encrypted backups with retention policy
- [ ] **Monitoring**: Real-time security monitoring
- [ ] **Incident Response**: Breach notification procedures

---

## **📊 Monitoring & Alerting**

### **🔍 Health Monitoring**
```yaml
# Health checks in docker-compose
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### **📈 Performance Monitoring**
```bash
# Container resource usage
docker stats bristol-park-hms-production_*

# Database performance
docker exec -it bristol-park-hms-production_db_1 psql -U postgres -c "
SELECT * FROM pg_stat_activity WHERE state = 'active';
"
```

### **🚨 Alerting Setup**
```yaml
# Add monitoring service to stack
services:
  monitoring:
    image: prom/prometheus
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
```

---

## **🔄 Backup & Recovery**

### **📦 Automated Backups**
```bash
# Daily backup script (runs in container)
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h db -U postgres bristol_park_hmis > /backups/backup_$DATE.sql
gzip /backups/backup_$DATE.sql

# Cleanup old backups (keep 30 days)
find /backups -name "*.sql.gz" -mtime +30 -delete
```

### **🔄 Disaster Recovery**
```bash
# 1. Stop services
docker-compose down

# 2. Restore database
gunzip -c backup_20241201_020000.sql.gz | docker exec -i bristol-park-hms-production_db_1 psql -U postgres bristol_park_hmis

# 3. Restart services
docker-compose up -d
```

---

## **🎯 Performance Optimization**

### **⚡ Frontend Optimization**
```dockerfile
# Multi-stage build for smaller images
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

### **🚀 API Optimization**
```yaml
services:
  api:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### **💾 Database Optimization**
```yaml
services:
  db:
    environment:
      - POSTGRES_SHARED_PRELOAD_LIBRARIES=pg_stat_statements
      - POSTGRES_MAX_CONNECTIONS=200
      - POSTGRES_SHARED_BUFFERS=256MB
```

---

## **📞 Support & Maintenance**

### **🔧 Regular Maintenance**
- **Weekly**: Review logs and performance metrics
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Full backup and recovery testing
- **Annually**: Security audit and penetration testing

### **📋 Incident Response**
1. **Detection**: Monitoring alerts or user reports
2. **Assessment**: Determine severity and impact
3. **Response**: Immediate containment and mitigation
4. **Recovery**: Restore normal operations
5. **Documentation**: Post-incident review and improvements
