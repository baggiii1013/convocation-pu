# 🚀 Convocation-PU Production Deployment Guide

> Complete guide for deploying the Convocation-PU application with Nginx, PM2 (18 cores for backend), and GitHub Actions CI/CD.

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Build Applications](#step-1-build-the-applications)
4. [Environment Configuration](#step-2-environment-configuration)
5. [PM2 Configuration](#step-3-pm2-configuration)
6. [Nginx Configuration](#step-4-nginx-configuration)
7. [Start Everything](#step-5-start-everything)
8. [SSL Setup](#step-6-ssl-setup-optional-but-recommended)
9. [Firewall Configuration](#step-7-firewall-configuration)
10. [GitHub Actions CI/CD](#step-8-github-actions-cicd-pipeline)
11. [Deployment Checklist](#deployment-checklist)
12. [PM2 Commands Reference](#pm2-commands-reference)
13. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

```
    User Browser                        Your Server (10.0.0.171)
    ────────────                        ────────────────────────
         │                                       
         │  https://convocation.paruluniversity.ac.in   
         │                                       
         ▼                                       
┌─────────────────────────────────────────────────────────────────┐
│                    NGINX (Port 80/443)                          │
│              Reverse Proxy + SSL Termination                    │
│                                                                 │
│   Users see: https://convocation.paruluniversity.ac.in         │
│   Users NEVER see: 10.0.0.171:3000 or :3001                    │
└───────────────────────────┬─────────────────────────────────────┘
                            │
           ┌────────────────┼────────────────┐
           │ /api/*         │ /*             │ /uploads/*
           ▼                ▼                ▼
   ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
   │  API Backend  │ │  Next.js App  │ │ Static Files  │
   │ 127.0.0.1:3001│ │ 127.0.0.1:3000│ │   (direct)    │
   │ PM2: 18 cores │ │ PM2: 1 inst.  │ │               │
   └───────────────┘ └───────────────┘ └───────────────┘
         ▲                  ▲
         │                  │
         └── Only accessible internally (localhost) ──┘
```

### How the Reverse Proxy Works

| User Requests | Nginx Routes To | User Sees |
|--------------|-----------------|-----------|
| `https://convocation.paruluniversity.ac.in/` | `127.0.0.1:3000` (Next.js) | Clean URL |
| `https://convocation.paruluniversity.ac.in/api/v1/users` | `127.0.0.1:3001` (Express) | Clean URL |
| `https://convocation.paruluniversity.ac.in/uploads/photo.jpg` | Direct file serve | Clean URL |

**Key Points:**
- ✅ Users only see `https://convocation.paruluniversity.ac.in`
- ✅ Internal ports (3000, 3001) are hidden
- ✅ SSL is handled by Nginx (SSL termination)
- ✅ Apps only bind to `127.0.0.1` (localhost) - not externally accessible

### CI/CD Pipeline Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Git Push   │───▶│    GitHub    │───▶│   Build &    │───▶│   Deploy     │
│   to master  │    │   Actions    │    │    Test      │    │   to Server  │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

---

## Prerequisites

### Server Requirements

- [x] Ubuntu 20.04+ or similar Linux distribution
- [x] Nginx installed (`sudo apt install nginx`)
- [x] PM2 installed (`npm install -g pm2` or `bun install -g pm2`)
- [x] Bun runtime installed
- [x] MongoDB running locally or accessible remotely
- [x] Git installed
- [ ] Domain configured (optional for SSL)

### Verify Installations

```bash
# Check Nginx
nginx -v

# Check PM2
pm2 -v

# Check Bun
bun -v

# Check MongoDB
mongosh --eval "db.version()"

# Check Git
git --version
```

---

## Step 1: Build the Applications

### 1.1 Clone Repository (First Time Only)

```bash
cd /home/appadmin
git clone https://github.com/baggiii1013/convocation-pu.git
cd convocation-pu
```

### 1.2 Install Dependencies

```bash
cd /home/appadmin/convocation-pu
bun install
```

### 1.3 Build the API (Backend)

```bash
cd /home/appadmin/convocation-pu/apps/api
bun run build
```

This will:
- Generate Prisma client
- Compile TypeScript to `dist/`

### 1.4 Build the Web (Frontend)

```bash
cd /home/appadmin/convocation-pu/apps/web
bun run build
```

This creates the production build in `dist/` directory.

---

## Step 2: Environment Configuration

> **Note**: This guide uses `convocation.paruluniversity.ac.in` as the production subdomain.

### 2.1 API Environment (Production)

Create `/home/appadmin/convocation-pu/apps/api/.env`:

```bash
# Production Environment Configuration
NODE_ENV=production
PORT=3001

# Database Configuration
DATABASE_URL="mongodb://localhost:27017/pu_convocation"

# JWT Configuration - Use strong, unique secrets
JWT_SECRET="your-super-secure-jwt-secret-min-64-chars-use-openssl-rand-base64-64"
JWT_REFRESH_SECRET="your-super-secure-refresh-secret-min-64-chars-use-openssl-rand-base64-64"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Frontend URL - Production subdomain
FRONTEND_URL="https://convocation.paruluniversity.ac.in"

# Security Configuration - Cookie domain for subdomain
# Use the parent domain with leading dot to share cookies across subdomains
COOKIE_DOMAIN=".paruluniversity.ac.in"

# File Upload Configuration
MAX_FILE_SIZE="10mb"
UPLOAD_DIR="./uploads"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_SALT_ROUNDS=12
```

**Generate secure secrets:**
```bash
openssl rand -base64 64
```

### 2.2 Web Environment (Production)

Create `/home/appadmin/convocation-pu/apps/web/.env.production`:

```bash
# API URL - Production subdomain (Nginx will route /api to backend internally)
NEXT_PUBLIC_API_URL=https://convocation.paruluniversity.ac.in/api
```

---

## Step 3: PM2 Configuration

### 3.1 Create PM2 Ecosystem File

Create `/home/appadmin/convocation-pu/ecosystem.config.cjs`:

```javascript
module.exports = {
  apps: [
    // ===========================================
    // BACKEND API - 18 CORES CLUSTER MODE
    // ===========================================
    {
      name: 'convocation-api',
      cwd: '/home/appadmin/convocation-pu/apps/api',
      script: 'dist/server.js',
      interpreter: '/home/appadmin/.bun/bin/bun',
      
      // CLUSTER MODE - 18 INSTANCES
      instances: 18,
      exec_mode: 'cluster',
      
      // Environment
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      
      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/home/appadmin/logs/api-error.log',
      out_file: '/home/appadmin/logs/api-out.log',
      merge_logs: true,
      
      // Process Management
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // Graceful shutdown
      kill_timeout: 10000,
      wait_ready: true,
      listen_timeout: 10000,
      
      // Watch (disable in production)
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'uploads'],
      
      // Advanced options
      node_args: '--max-old-space-size=1024',
      autorestart: true,
    },
    
    // ===========================================
    // FRONTEND NEXT.JS - SINGLE INSTANCE
    // ===========================================
    {
      name: 'convocation-web',
      cwd: '/home/appadmin/convocation-pu/apps/web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      interpreter: '/home/appadmin/.bun/bin/bun',
      
      // Single instance (Next.js handles its own optimization)
      instances: 1,
      exec_mode: 'fork',
      
      // Environment
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      
      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/home/appadmin/logs/web-error.log',
      out_file: '/home/appadmin/logs/web-out.log',
      merge_logs: true,
      
      // Process Management
      max_memory_restart: '2G',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // Graceful shutdown
      kill_timeout: 10000,
      
      // Watch (disable in production)
      watch: false,
      ignore_watch: ['node_modules', '.next', 'dist'],
      
      autorestart: true,
    },
  ],
};
```

### 3.2 Create Required Directories

```bash
# Create logs directory
mkdir -p /home/appadmin/logs

# Create uploads directory
mkdir -p /home/appadmin/convocation-pu/apps/api/uploads
chmod 755 /home/appadmin/convocation-pu/apps/api/uploads
```

---

## Step 4: Nginx Configuration

> **How Reverse Proxy Hides Ports**: Users access `convocation.paruluniversity.ac.in` on standard ports (80/443). Nginx internally routes requests to your apps running on ports 3000/3001. **Users never see or need to know about internal ports** - they only see the clean subdomain URL.

### 4.1 Create Nginx Configuration

Create `/etc/nginx/sites-available/convocation-pu`:

```nginx
# Upstream for API (load balanced across 18 PM2 instances)
upstream api_backend {
    least_conn;  # Use least connections load balancing
    server 127.0.0.1:3001;
    keepalive 64;
}

# Upstream for Next.js frontend
upstream web_frontend {
    server 127.0.0.1:3000;
    keepalive 32;
}

# Rate limiting zones
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=30r/s;
limit_req_zone $binary_remote_addr zone=general_limit:10m rate=50r/s;

# ===========================================
# HTTP to HTTPS Redirect
# ===========================================
server {
    listen 80;
    server_name convocation.paruluniversity.ac.in;
    
    # Redirect all HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

# ===========================================
# Main HTTPS Server Block (Subdomain)
# ===========================================
server {
    listen 443 ssl http2;
    server_name convocation.paruluniversity.ac.in;
    
    # SSL Configuration - Using subdomain-specific certificate
    ssl_certificate /etc/letsencrypt/live/convocation.paruluniversity.ac.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/convocation.paruluniversity.ac.in/privkey.pem;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;
    
    # Logging
    access_log /var/log/nginx/convocation-access.log;
    error_log /var/log/nginx/convocation-error.log;
    
    # Client body size (for file uploads)
    client_max_body_size 50M;
    
    # ===========================================
    # API ROUTES - Proxy to Backend (Port 3001)
    # ===========================================
    location /api {
        # Rate limiting
        limit_req zone=api_limit burst=50 nodelay;
        
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        
        # Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffering
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_busy_buffers_size 8k;
    }
    
    # ===========================================
    # STATIC UPLOADS - Direct Serve
    # ===========================================
    location /uploads {
        alias /home/appadmin/convocation-pu/apps/api/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
        
        # Security - Deny script execution
        location ~* \.(php|pl|py|jsp|asp|sh|cgi)$ {
            deny all;
        }
    }
    
    # ===========================================
    # NEXT.JS STATIC FILES - Optimized Caching
    # ===========================================
    location /_next/static {
        proxy_pass http://web_frontend;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        
        # Long cache for hashed static assets
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # ===========================================
    # NEXT.JS PUBLIC FILES
    # ===========================================
    location /public {
        proxy_pass http://web_frontend;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        
        expires 7d;
        add_header Cache-Control "public";
    }
    
    # ===========================================
    # FRONTEND - Everything else to Next.js
    # ===========================================
    location / {
        limit_req zone=general_limit burst=100 nodelay;
        
        proxy_pass http://web_frontend;
        proxy_http_version 1.1;
        
        # Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffering
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
    }
    
    # ===========================================
    # HEALTH CHECK ENDPOINT
    # ===========================================
    location /health {
        access_log off;
        return 200 "OK\n";
        add_header Content-Type text/plain;
    }
    
    # Deny access to hidden files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

### 4.2 Enable the Site

```bash
# Remove default site if exists
sudo rm -f /etc/nginx/sites-enabled/default

# Create symlink to enable site
sudo ln -sf /etc/nginx/sites-available/convocation-pu /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## Step 5: Start Everything

### 5.1 Start PM2 Applications

```bash
cd /home/appadmin/convocation-pu

# Start all applications
pm2 start ecosystem.config.cjs

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the command it outputs (usually needs sudo)
```

### 5.2 Verify Deployment

```bash
# Check PM2 status
pm2 status

# Check PM2 logs
pm2 logs

# Monitor in real-time
pm2 monit

# Test API
curl http://localhost:3001/api/v1/health

# Test Frontend
curl http://localhost:3000

# Test through Nginx (after SSL setup)
curl https://convocation.paruluniversity.ac.in
curl https://convocation.paruluniversity.ac.in/api/v1/health
```

---

## Step 6: SSL Setup for Subdomain

Since `paruluniversity.ac.in` doesn't have a wildcard certificate, you need to generate a new SSL certificate specifically for the subdomain.

### 6.0 Generate SSL Certificate for Subdomain

**Prerequisites:**
- DNS A record for `convocation.paruluniversity.ac.in` must be pointing to your server IP
- Port 80 must be accessible for the HTTP challenge

```bash
# Install Certbot (if not already installed)
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Generate SSL certificate for the subdomain
sudo certbot certonly --nginx -d convocation.paruluniversity.ac.in
```

**Alternative: Use standalone mode if Nginx is not configured yet:**
```bash
# Stop Nginx temporarily
sudo systemctl stop nginx

# Get certificate using standalone mode
sudo certbot certonly --standalone -d convocation.paruluniversity.ac.in

# Start Nginx again
sudo systemctl start nginx
```

After successful generation, your certificates will be at:
```
/etc/letsencrypt/live/convocation.paruluniversity.ac.in/fullchain.pem
/etc/letsencrypt/live/convocation.paruluniversity.ac.in/privkey.pem
```

### 6.1 DNS Configuration

**IMPORTANT**: Before generating SSL, ensure your subdomain DNS is configured:

1. Go to your DNS provider for `paruluniversity.ac.in`
2. Add an **A record**:
   - **Name**: `convocation`
   - **Type**: `A`
   - **Value**: Your server's public IP (e.g., `10.0.0.171`)
   - **TTL**: Auto or 3600

```
Type    Name          Value           TTL
A       convocation   10.0.0.171      Auto
```

**Verify DNS propagation:**
```bash
# Check if DNS is resolving correctly
dig convocation.paruluniversity.ac.in +short
# Should return: 10.0.0.171

# Or use nslookup
nslookup convocation.paruluniversity.ac.in
```

### 6.2 Verify SSL Setup

```bash
# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Verify SSL is working
curl -I https://convocation.paruluniversity.ac.in
# Should return "HTTP/2 200" with no SSL errors

# Check certificate details
echo | openssl s_client -servername convocation.paruluniversity.ac.in -connect convocation.paruluniversity.ac.in:443 2>/dev/null | openssl x509 -noout -dates
```

### 6.3 Auto-Renewal

```bash
# Test renewal (doesn't actually renew, just tests)
sudo certbot renew --dry-run

# Certbot automatically sets up a cron job for renewal
```

---

## Step 7: Firewall Configuration

```bash
# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Or individually:
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow SSH (if not already)
sudo ufw allow 22/tcp

# IMPORTANT: Do NOT expose ports 3000 or 3001 externally
# They should only be accessible via Nginx reverse proxy

# Enable firewall
sudo ufw enable

# Verify
sudo ufw status
```

**Expected output:**
```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
Nginx Full                 ALLOW       Anywhere
```

> **Note**: Ports 3000 and 3001 are NOT in the firewall rules - they're only accessible internally via `127.0.0.1`. Users access your site through Nginx on port 80/443.

---

## Step 8: GitHub Actions CI/CD Pipeline

### 8.1 Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml` in your repository:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - master
  workflow_dispatch:  # Allow manual triggers

env:
  NODE_ENV: production

jobs:
  # ===========================================
  # JOB 1: BUILD AND TEST
  # ===========================================
  build-and-test:
    name: Build and Test
    runs-on: ubuntu-latest
    
    steps:
      - name: 📥 Checkout Repository
        uses: actions/checkout@v4

      - name: 🍞 Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: 📦 Install Dependencies
        run: bun install --frozen-lockfile

      - name: 🔍 Type Check API
        working-directory: ./apps/api
        run: bun run type-check
        continue-on-error: true

      - name: 🔍 Lint Web
        working-directory: ./apps/web
        run: bun run lint
        continue-on-error: true

      - name: 🔨 Build API
        working-directory: ./apps/api
        run: bun run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: 🔨 Build Web
        working-directory: ./apps/web
        run: bun run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}

      - name: ✅ Build Successful
        run: echo "Build completed successfully!"

  # ===========================================
  # JOB 2: DEPLOY TO SERVER
  # ===========================================
  deploy:
    name: Deploy to Production Server
    runs-on: ubuntu-latest
    needs: build-and-test
    if: github.ref == 'refs/heads/master'
    
    steps:
      - name: 📥 Checkout Repository
        uses: actions/checkout@v4

      - name: 🔑 Setup SSH Key
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan -H ${{ secrets.SERVER_HOST }} >> ~/.ssh/known_hosts

      - name: 🚀 Deploy to Server
        run: |
          ssh -o StrictHostKeyChecking=no ${{ secrets.SERVER_USER }}@${{ secrets.SERVER_HOST }} << 'ENDSSH'
            set -e
            
            echo "📍 Navigating to project directory..."
            cd /home/appadmin/convocation-pu
            
            echo "📥 Pulling latest changes..."
            git fetch origin master
            git reset --hard origin/master
            
            echo "📦 Installing dependencies..."
            /home/appadmin/.bun/bin/bun install --frozen-lockfile
            
            echo "🔨 Building API..."
            cd apps/api
            /home/appadmin/.bun/bin/bun run build
            cd ../..
            
            echo "🔨 Building Web..."
            cd apps/web
            /home/appadmin/.bun/bin/bun run build
            cd ../..
            
            echo "🔄 Reloading PM2 applications..."
            pm2 reload ecosystem.config.cjs --update-env
            
            echo "⏳ Waiting for applications to stabilize..."
            sleep 10
            
            echo "✅ Checking application status..."
            pm2 status
            
            echo "🎉 Deployment completed successfully!"
          ENDSSH

      - name: 🏥 Health Check
        run: |
          sleep 15
          curl -f http://${{ secrets.SERVER_HOST }}/health || exit 1
          echo "Health check passed!"

  # ===========================================
  # JOB 3: NOTIFY ON FAILURE
  # ===========================================
  notify-failure:
    name: Notify on Failure
    runs-on: ubuntu-latest
    needs: [build-and-test, deploy]
    if: failure()
    
    steps:
      - name: 🚨 Deployment Failed
        run: |
          echo "Deployment failed! Check the logs above for details."
          # Add your notification logic here (Slack, Discord, Email, etc.)
```

### 8.2 Create Pull Request Workflow

Create `.github/workflows/pr-check.yml`:

```yaml
name: PR Check

on:
  pull_request:
    branches:
      - master
      - main
      - develop

jobs:
  check:
    name: Build Check
    runs-on: ubuntu-latest
    
    steps:
      - name: 📥 Checkout Repository
        uses: actions/checkout@v4

      - name: 🍞 Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: 📦 Install Dependencies
        run: bun install --frozen-lockfile

      - name: 🔍 Type Check API
        working-directory: ./apps/api
        run: bun run type-check

      - name: 🔍 Lint Web
        working-directory: ./apps/web
        run: bun run lint

      - name: 🔨 Build API
        working-directory: ./apps/api
        run: bun run build
        env:
          DATABASE_URL: "mongodb://localhost:27017/test"

      - name: 🔨 Build Web
        working-directory: ./apps/web
        run: bun run build
        env:
          NEXT_PUBLIC_API_URL: "http://localhost:3001"

      - name: ✅ All Checks Passed
        run: echo "All checks passed!"
```

### 8.3 Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `SERVER_HOST` | Your server IP (for SSH) | `10.0.0.171` |
| `SERVER_USER` | SSH username | `appadmin` |
| `SSH_PRIVATE_KEY` | Private SSH key for authentication | Contents of `~/.ssh/id_rsa` |
| `DATABASE_URL` | MongoDB connection string (for CI build) | `mongodb://localhost:27017/pu_convocation` |
| `NEXT_PUBLIC_API_URL` | API URL for frontend (for CI build) | `https://convocation.paruluniversity.ac.in/api` |
| `API_ENV_FILE` | **Full API .env file contents** | See below |
| `WEB_ENV_FILE` | **Full Web .env.production contents** | See below |

#### API_ENV_FILE Secret Content

Copy your entire API `.env` file as the secret value:

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=mongodb://localhost:27017/pu_convocation
JWT_SECRET=your-super-secure-jwt-secret-min-64-chars
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-min-64-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=https://convocation.paruluniversity.ac.in
COOKIE_DOMAIN=.paruluniversity.ac.in
MAX_FILE_SIZE=10mb
UPLOAD_DIR=./uploads
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_SALT_ROUNDS=12
```

#### WEB_ENV_FILE Secret Content

Copy your entire Web `.env.production` file as the secret value:

```env
NEXT_PUBLIC_API_URL=https://convocation.paruluniversity.ac.in/api
```

> **Note**: When you need to change environment variables, simply update these secrets in GitHub and trigger a new deployment. The pipeline will automatically sync the new values to your server.

### 8.4 Generate SSH Key for GitHub Actions

On your **local machine** or a secure location:

```bash
# Generate a new SSH key pair for GitHub Actions
ssh-keygen -t ed25519 -C "github-actions@convocation-pu" -f ~/.ssh/github_actions_key

# Display the private key (add this to GitHub Secrets as SSH_PRIVATE_KEY)
cat ~/.ssh/github_actions_key

# Display the public key (add this to server's authorized_keys)
cat ~/.ssh/github_actions_key.pub
```

On your **server**:

```bash
# Add the public key to authorized_keys
echo "ssh-ed25519 AAAA... github-actions@convocation-pu" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 8.5 Manual Deployment Script

Create `/home/appadmin/convocation-pu/deploy.sh`:

```bash
#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting deployment...${NC}"

cd /home/appadmin/convocation-pu

echo -e "${YELLOW}📥 Pulling latest changes...${NC}"
git fetch origin master
git reset --hard origin/master

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
bun install --frozen-lockfile

echo -e "${YELLOW}🔨 Building API...${NC}"
cd apps/api
bun run build
cd ../..

echo -e "${YELLOW}🔨 Building Web...${NC}"
cd apps/web
bun run build
cd ../..

echo -e "${YELLOW}🔄 Reloading PM2 applications...${NC}"
pm2 reload ecosystem.config.cjs --update-env

echo -e "${YELLOW}⏳ Waiting for applications to stabilize...${NC}"
sleep 5

echo -e "${GREEN}✅ Checking application status...${NC}"
pm2 status

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
```

Make it executable:

```bash
chmod +x /home/appadmin/convocation-pu/deploy.sh
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] MongoDB running and accessible
- [ ] Environment files configured (`.env` for API, `.env.production` for Web)
- [ ] Directories created (`logs/`, `uploads/`)
- [ ] Bun path verified (`which bun`)
- [ ] SSH key configured for GitHub Actions

### Build

- [ ] API built successfully (`bun run build` in `apps/api`)
- [ ] Web built successfully (`bun run build` in `apps/web`)
- [ ] No TypeScript errors

### PM2

- [ ] `ecosystem.config.cjs` created
- [ ] PM2 started with 18 API instances
- [ ] PM2 saved (`pm2 save`)
- [ ] PM2 startup configured (`pm2 startup`)

### Nginx

- [ ] Configuration created in `/etc/nginx/sites-available/`
- [ ] Site enabled (symlink to `sites-enabled/`)
- [ ] Configuration tested (`nginx -t`)
- [ ] Nginx reloaded

### GitHub Actions

- [ ] Workflow files created in `.github/workflows/`
- [ ] All secrets configured in GitHub repository settings
- [ ] SSH key added to server's `authorized_keys`

### Post-Deployment

- [ ] API health check works (`curl localhost:3001/api/v1/health`)
- [ ] Frontend loads (`curl localhost:3000`)
- [ ] Full flow works through Nginx (`curl localhost`)
- [ ] SSL configured (if using domain)

---

## PM2 Commands Reference

### Basic Commands

```bash
# View all processes
pm2 list

# View detailed info
pm2 show convocation-api
pm2 show convocation-web

# View logs
pm2 logs convocation-api --lines 100
pm2 logs convocation-web --lines 100
pm2 logs  # All logs

# Real-time monitoring
pm2 monit
```

### Process Management

```bash
# Start applications
pm2 start ecosystem.config.cjs

# Restart applications
pm2 restart convocation-api
pm2 restart convocation-web
pm2 restart all

# Reload (zero-downtime for cluster mode)
pm2 reload convocation-api
pm2 reload all

# Stop applications
pm2 stop convocation-api
pm2 stop convocation-web
pm2 stop all

# Delete from PM2
pm2 delete convocation-api
pm2 delete convocation-web
pm2 delete all
```

### Maintenance

```bash
# Save current process list
pm2 save

# Resurrect saved processes
pm2 resurrect

# Flush logs
pm2 flush

# Update PM2
pm2 update

# Generate startup script
pm2 startup
pm2 unstartup  # Remove startup script
```

### Scaling

```bash
# Scale API to different number of instances
pm2 scale convocation-api 20  # Scale to 20 instances
pm2 scale convocation-api +2  # Add 2 more instances
pm2 scale convocation-api -2  # Remove 2 instances
```

---

## Troubleshooting

### Check if Services are Running

```bash
# PM2 processes
pm2 status

# Nginx
sudo systemctl status nginx

# MongoDB
sudo systemctl status mongod
```

### Check Ports

```bash
# Using netstat
sudo netstat -tlnp | grep -E '(80|443|3000|3001)'

# Using ss
ss -tlnp | grep -E '(80|443|3000|3001)'

# Using lsof
sudo lsof -i :3001
```

### View Logs

```bash
# PM2 logs
pm2 logs
pm2 logs convocation-api --lines 200
pm2 logs convocation-web --lines 200

# Nginx logs
sudo tail -f /var/log/nginx/convocation-error.log
sudo tail -f /var/log/nginx/convocation-access.log

# System logs
sudo journalctl -u nginx -f
sudo journalctl -u mongod -f
```

### Common Issues

#### 502 Bad Gateway
- **Cause**: PM2 apps not running or wrong port
- **Solution**: Check `pm2 status`, ensure apps are online

```bash
pm2 status
pm2 restart all
```

#### Permission Denied
- **Cause**: File ownership or permission issues
- **Solution**: Check and fix permissions

```bash
sudo chown -R appadmin:appadmin /home/appadmin/convocation-pu
chmod -R 755 /home/appadmin/convocation-pu
```

#### CORS Errors
- **Cause**: FRONTEND_URL mismatch in API `.env`
- **Solution**: Verify FRONTEND_URL matches your domain

#### Database Connection Failed
- **Cause**: MongoDB not running or wrong connection string
- **Solution**: Check MongoDB status and DATABASE_URL

```bash
sudo systemctl status mongod
mongosh --eval "db.adminCommand('ping')"
```

#### Build Fails
- **Cause**: Missing dependencies or TypeScript errors
- **Solution**: Check build logs, run type-check

```bash
cd apps/api && bun run type-check
cd apps/web && bun run lint
```

#### PM2 Not Starting on Boot
- **Cause**: Startup script not configured
- **Solution**: Run pm2 startup and follow instructions

```bash
pm2 startup
# Copy and run the command it outputs
pm2 save
```

### Emergency Recovery

```bash
# Stop everything
pm2 stop all

# Clear PM2 dump
pm2 delete all

# Restart from scratch
cd /home/appadmin/convocation-pu
pm2 start ecosystem.config.cjs
pm2 save
```

---

## Quick Reference Card

```bash
# Full deployment
./deploy.sh

# Check status
pm2 status && sudo systemctl status nginx

# View all logs
pm2 logs && sudo tail -f /var/log/nginx/convocation-error.log

# Restart everything
pm2 reload all && sudo systemctl reload nginx

# Emergency stop
pm2 stop all

# Health check
curl http://localhost/health
curl http://localhost/api/v1/health
```

---

## Support

For issues related to:
- **Application bugs**: Check PM2 logs and API error logs
- **Server issues**: Check Nginx and system logs
- **CI/CD issues**: Check GitHub Actions logs
- **Database issues**: Check MongoDB logs and connection

---

*Last updated: December 2024*
