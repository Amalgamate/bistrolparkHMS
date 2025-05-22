# Bristol Park Hospital - Portainer Deployment Guide

## 🚀 Initial Deployment

### Step 1: Prepare Your Repository

1. **Push all Docker files to GitHub**:
```bash
git add .
git commit -m "Add Docker configuration for production"
git push origin main
```

### Step 2: Deploy via Portainer

#### Option A: Git Repository Method (Recommended)

1. **Access Portainer**: Go to your Digital Ocean droplet Portainer interface
2. **Navigate to Stacks**: Click on "Stacks" in the left sidebar
3. **Add New Stack**: Click "Add stack"
4. **Configure Stack**:
   - **Name**: `bristol-park-hospital`
   - **Build method**: Select "Repository"
   - **Repository URL**: `https://github.com/your-username/bristolparkhospital.git`
   - **Repository reference**: `refs/heads/main`
   - **Compose path**: `docker-compose.production.yml`

5. **Environment Variables**: Add these variables:
```
DB_PASSWORD=your_secure_database_password
JWT_SECRET=your_very_secure_jwt_secret_key
DOMAIN=your-domain.com
```

6. **Deploy**: Click "Deploy the stack"

#### Option B: Web Editor Method

1. **Access Portainer**: Go to your Digital Ocean droplet Portainer interface
2. **Navigate to Stacks**: Click on "Stacks" in the left sidebar
3. **Add New Stack**: Click "Add stack"
4. **Configure Stack**:
   - **Name**: `bristol-park-hospital`
   - **Build method**: Select "Web editor"
5. **Copy docker-compose.production.yml content** into the editor
6. **Add Environment Variables** (same as above)
7. **Deploy**: Click "Deploy the stack"

## 🔄 Making Changes and Updates

### When You Need to Update Dockerfiles

#### Method 1: Git Repository Updates (Automatic)

1. **Make changes locally**:
```bash
# Edit your Dockerfiles or code
nano Dockerfile
nano api/Dockerfile
```

2. **Test locally**:
```bash
docker-compose -f docker-compose.production.yml build
docker-compose -f docker-compose.production.yml up
```

3. **Push changes**:
```bash
git add .
git commit -m "Update Docker configuration"
git push origin main
```

4. **Update in Portainer**:
   - Go to **Stacks** → **bristol-park-hospital**
   - Click **Editor** tab
   - Click **Pull and redeploy** button
   - Portainer will automatically pull latest changes and rebuild

#### Method 2: Manual Update via Portainer

1. **Make changes locally and test**
2. **Copy updated docker-compose.yml content**
3. **In Portainer**:
   - Go to **Stacks** → **bristol-park-hospital**
   - Click **Editor** tab
   - Paste updated content
   - Click **Update the stack**

### For Code Changes (Without Dockerfile Changes)

1. **Push code changes**:
```bash
git add .
git commit -m "Update application code"
git push origin main
```

2. **Rebuild in Portainer**:
   - Go to **Stacks** → **bristol-park-hospital**
   - Click **Editor** tab
   - Click **Pull and redeploy**

## 🔧 Managing Individual Services

### Restart a Service
1. Go to **Containers**
2. Find your service (e.g., `bristol-park-hospital_api_1`)
3. Click **Restart**

### View Logs
1. Go to **Containers**
2. Click on container name
3. Click **Logs** tab

### Update Environment Variables
1. Go to **Stacks** → **bristol-park-hospital**
2. Click **Editor** tab
3. Scroll to **Environment variables**
4. Update values
5. Click **Update the stack**

## 📊 Monitoring and Maintenance

### Health Checks
- Check container status in **Containers** section
- Green dot = healthy, Red dot = unhealthy

### Database Backups
Create a backup script container:

```yaml
  backup:
    image: postgres:15-alpine
    depends_on:
      - db
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    environment:
      - PGPASSWORD=${DB_PASSWORD}
    command: |
      sh -c "
      while true; do
        pg_dump -h db -U ${DB_USER:-postgres} ${DB_NAME:-bristol_park_hmis} > /backups/backup_$$(date +%Y%m%d_%H%M%S).sql
        find /backups -name '*.sql' -mtime +7 -delete
        sleep 86400
      done"
    networks:
      - bristol-park-network
    restart: unless-stopped
```

### SSL Certificate (if using custom domain)
1. Install Traefik or use Nginx Proxy Manager
2. Configure automatic SSL with Let's Encrypt

## 🚨 Troubleshooting

### Stack Won't Start
1. Check **Logs** in the stack view
2. Verify environment variables
3. Check if ports are already in use

### Database Connection Issues
1. Verify DB_PASSWORD is set correctly
2. Check if database container is running
3. Look at API container logs

### Build Failures
1. Check if GitHub repository is accessible
2. Verify Dockerfile syntax
3. Check for missing dependencies

## 📝 Quick Commands Reference

### Portainer Stack Management
- **Deploy**: Create new stack from repository
- **Pull and redeploy**: Update from Git and rebuild
- **Update**: Apply changes without rebuilding
- **Remove**: Delete entire stack

### Container Actions
- **Start/Stop**: Control individual containers
- **Restart**: Restart container
- **Logs**: View container logs
- **Console**: Access container shell
- **Stats**: View resource usage
