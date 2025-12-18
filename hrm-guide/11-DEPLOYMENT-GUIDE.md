# WorkDo HRM - Deployment Guide

This guide covers deployment instructions for both the Laravel backend and React frontend of the WorkDo HRM system.

---

## Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Backend Deployment (Laravel)](#2-backend-deployment-laravel)
3. [Frontend Deployment (React)](#3-frontend-deployment-react)
4. [Database Setup](#4-database-setup)
5. [Environment Configuration](#5-environment-configuration)
6. [SSL/HTTPS Setup](#6-sslhttps-setup)
7. [Docker Deployment](#7-docker-deployment)
8. [CI/CD Pipeline](#8-cicd-pipeline)
9. [Monitoring & Logging](#9-monitoring--logging)
10. [Backup & Recovery](#10-backup--recovery)
11. [Scaling Considerations](#11-scaling-considerations)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Prerequisites

### Server Requirements

**Backend Server:**
- Ubuntu 22.04 LTS or similar Linux distribution
- PHP 8.1+ with extensions: BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML, GD, Zip
- Composer 2.x
- MySQL 8.0+ or PostgreSQL 14+
- Redis 6+ (for caching and queues)
- Nginx or Apache web server
- Supervisor (for queue workers)
- Node.js 18+ (for asset compilation)

**Frontend Server:**
- Node.js 18+ (for building)
- Nginx or any static file server
- CDN (recommended for production)

### Domain & DNS
- Primary domain for the application (e.g., hrm.yourcompany.com)
- API subdomain (e.g., api.hrm.yourcompany.com)
- SSL certificates (Let's Encrypt recommended)

---

## 2. Backend Deployment (Laravel)

### 2.1 Server Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install PHP 8.2 and extensions
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install -y php8.2 php8.2-fpm php8.2-cli php8.2-common php8.2-mysql \
    php8.2-zip php8.2-gd php8.2-mbstring php8.2-curl php8.2-xml php8.2-bcmath \
    php8.2-intl php8.2-readline php8.2-redis

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install MySQL
sudo apt install -y mysql-server
sudo mysql_secure_installation

# Install Redis
sudo apt install -y redis-server
sudo systemctl enable redis-server

# Install Nginx
sudo apt install -y nginx
sudo systemctl enable nginx

# Install Supervisor
sudo apt install -y supervisor
sudo systemctl enable supervisor

# Install Node.js (for asset compilation)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2.2 Application Deployment

```bash
# Create application directory
sudo mkdir -p /var/www/hrm-backend
sudo chown -R $USER:www-data /var/www/hrm-backend

# Clone repository
cd /var/www/hrm-backend
git clone https://github.com/your-org/hrm-backend.git .

# Install dependencies
composer install --no-dev --optimize-autoloader

# Set permissions
sudo chown -R www-data:www-data /var/www/hrm-backend
sudo chmod -R 755 /var/www/hrm-backend
sudo chmod -R 775 /var/www/hrm-backend/storage
sudo chmod -R 775 /var/www/hrm-backend/bootstrap/cache

# Create environment file
cp .env.example .env
nano .env  # Edit with production values

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate --force

# Seed initial data (roles, permissions, admin user)
php artisan db:seed --class=PermissionSeeder --force
php artisan db:seed --class=AdminUserSeeder --force

# Create storage link
php artisan storage:link

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optimize autoloader
composer dump-autoload --optimize
```

### 2.3 Nginx Configuration

Create `/etc/nginx/sites-available/hrm-backend`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name api.hrm.yourcompany.com;
    root /var/www/hrm-backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    index index.php;

    charset utf-8;

    # API routes
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    # File upload size
    client_max_body_size 50M;

    # Gzip compression
    gzip on;
    gzip_comp_level 5;
    gzip_min_length 256;
    gzip_proxied any;
    gzip_vary on;
    gzip_types
        application/json
        application/javascript
        application/xml
        text/css
        text/plain
        text/xml;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/hrm-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 2.4 Queue Worker Configuration

Create `/etc/supervisor/conf.d/hrm-worker.conf`:

```ini
[program:hrm-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/hrm-backend/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=4
redirect_stderr=true
stdout_logfile=/var/www/hrm-backend/storage/logs/worker.log
stopwaitsecs=3600
```

Start the workers:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start hrm-worker:*
```

### 2.5 Cron Job Setup

Add to crontab (`crontab -e`):

```cron
* * * * * cd /var/www/hrm-backend && php artisan schedule:run >> /dev/null 2>&1
```

### 2.6 PHP-FPM Configuration

Edit `/etc/php/8.2/fpm/pool.d/www.conf`:

```ini
[www]
user = www-data
group = www-data
listen = /var/run/php/php8.2-fpm.sock
listen.owner = www-data
listen.group = www-data
pm = dynamic
pm.max_children = 50
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 35
pm.max_requests = 500
```

Restart PHP-FPM:

```bash
sudo systemctl restart php8.2-fpm
```

---

## 3. Frontend Deployment (React)

### 3.1 Build Process

```bash
# Clone repository
git clone https://github.com/your-org/hrm-frontend.git
cd hrm-frontend

# Install dependencies
npm ci

# Create production environment file
cat > .env.production << EOF
VITE_API_URL=https://api.hrm.yourcompany.com/api/v1
VITE_APP_NAME=WorkDo HRM
VITE_APP_ENV=production
EOF

# Build for production
npm run build
```

### 3.2 Nginx Configuration for Frontend

Create `/etc/nginx/sites-available/hrm-frontend`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name hrm.yourcompany.com;
    root /var/www/hrm-frontend/dist;

    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Don't cache HTML
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }

    # Gzip compression
    gzip on;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types
        application/javascript
        application/json
        text/css
        text/html
        text/plain
        text/xml
        image/svg+xml;

    # Error pages
    error_page 404 /index.html;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/hrm-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3.3 Deploy Build Files

```bash
# Create directory
sudo mkdir -p /var/www/hrm-frontend

# Copy build files
sudo cp -r dist/* /var/www/hrm-frontend/

# Set permissions
sudo chown -R www-data:www-data /var/www/hrm-frontend
```

### 3.4 CDN Configuration (Optional)

For better performance, serve static assets through a CDN like CloudFlare, AWS CloudFront, or Fastly.

Update Vite config for CDN:

```typescript
// vite.config.ts
export default defineConfig({
  base: process.env.CDN_URL || '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          ui: ['@headlessui/react', '@heroicons/react'],
        },
      },
    },
  },
});
```

---

## 4. Database Setup

### 4.1 MySQL Configuration

Edit `/etc/mysql/mysql.conf.d/mysqld.cnf`:

```ini
[mysqld]
# Basic settings
bind-address = 127.0.0.1
max_connections = 200
max_allowed_packet = 64M

# InnoDB settings
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT

# Query cache (MySQL 8.0 removed this, use ProxySQL instead)
# query_cache_type = 1
# query_cache_size = 64M

# Slow query log
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2

# Character set
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
```

### 4.2 Create Database and User

```sql
-- Connect as root
mysql -u root -p

-- Create database
CREATE DATABASE hrm_production CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user with limited privileges
CREATE USER 'hrm_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES ON hrm_production.* TO 'hrm_user'@'localhost';
FLUSH PRIVILEGES;
```

### 4.3 Database Backup Script

Create `/usr/local/bin/hrm-backup.sh`:

```bash
#!/bin/bash

# Configuration
DB_NAME="hrm_production"
DB_USER="hrm_user"
DB_PASS="your_secure_password"
BACKUP_DIR="/var/backups/hrm"
RETENTION_DAYS=30

# Create backup directory
mkdir -p $BACKUP_DIR

# Generate filename with timestamp
FILENAME="$BACKUP_DIR/hrm_$(date +%Y%m%d_%H%M%S).sql.gz"

# Create backup
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $FILENAME

# Remove old backups
find $BACKUP_DIR -name "hrm_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Log
echo "$(date): Backup created: $FILENAME" >> /var/log/hrm-backup.log
```

Add to crontab for daily backups:

```cron
0 2 * * * /usr/local/bin/hrm-backup.sh
```

---

## 5. Environment Configuration

### 5.1 Backend Environment (.env)

```env
# Application
APP_NAME="WorkDo HRM"
APP_ENV=production
APP_KEY=base64:your_generated_key_here
APP_DEBUG=false
APP_URL=https://api.hrm.yourcompany.com

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hrm_production
DB_USERNAME=hrm_user
DB_PASSWORD=your_secure_password

# Redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Cache
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=your_mailgun_username
MAIL_PASSWORD=your_mailgun_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@hrm.yourcompany.com
MAIL_FROM_NAME="${APP_NAME}"

# AWS S3 (for file storage)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=hrm-files
AWS_USE_PATH_STYLE_ENDPOINT=false

# Filesystem
FILESYSTEM_DISK=s3

# Sanctum
SANCTUM_STATEFUL_DOMAINS=hrm.yourcompany.com
SESSION_DOMAIN=.yourcompany.com

# CORS
CORS_ALLOWED_ORIGINS=https://hrm.yourcompany.com

# Logging
LOG_CHANNEL=daily
LOG_LEVEL=error

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
```

### 5.2 Frontend Environment (.env.production)

```env
VITE_API_URL=https://api.hrm.yourcompany.com/api/v1
VITE_APP_NAME=WorkDo HRM
VITE_APP_ENV=production
VITE_SENTRY_DSN=https://your_sentry_dsn
```

---

## 6. SSL/HTTPS Setup

### 6.1 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 6.2 Obtain SSL Certificates

```bash
# For backend
sudo certbot --nginx -d api.hrm.yourcompany.com

# For frontend
sudo certbot --nginx -d hrm.yourcompany.com
```

### 6.3 Auto-Renewal

Certbot automatically adds a cron job for renewal. Verify with:

```bash
sudo certbot renew --dry-run
```

### 6.4 Nginx SSL Configuration

Certbot will automatically update your Nginx config, but ensure these settings are present:

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.hrm.yourcompany.com;

    ssl_certificate /etc/letsencrypt/live/api.hrm.yourcompany.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.hrm.yourcompany.com/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;

    # ... rest of configuration
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name api.hrm.yourcompany.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 7. Docker Deployment

### 7.1 Backend Dockerfile

```dockerfile
# Dockerfile for Laravel backend
FROM php:8.2-fpm-alpine

# Install dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    mysql-client \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql gd zip bcmath opcache

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Copy configuration files
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/php.ini /usr/local/etc/php/conf.d/custom.ini

# Expose port
EXPOSE 80

# Start supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
```

### 7.2 Frontend Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 7.3 Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: hrm-backend
    restart: unless-stopped
    environment:
      - APP_ENV=production
      - DB_HOST=mysql
      - REDIS_HOST=redis
    volumes:
      - ./backend/storage:/var/www/html/storage
    depends_on:
      - mysql
      - redis
    networks:
      - hrm-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: hrm-frontend
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
    networks:
      - hrm-network

  mysql:
    image: mysql:8.0
    container_name: hrm-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_DATABASE}
      MYSQL_USER: ${DB_USERNAME}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - hrm-network

  redis:
    image: redis:7-alpine
    container_name: hrm-redis
    restart: unless-stopped
    volumes:
      - redis-data:/data
    networks:
      - hrm-network

  queue-worker:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: hrm-queue-worker
    restart: unless-stopped
    command: php artisan queue:work --sleep=3 --tries=3
    environment:
      - APP_ENV=production
      - DB_HOST=mysql
      - REDIS_HOST=redis
    depends_on:
      - mysql
      - redis
    networks:
      - hrm-network

  scheduler:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: hrm-scheduler
    restart: unless-stopped
    command: sh -c "while true; do php artisan schedule:run; sleep 60; done"
    environment:
      - APP_ENV=production
      - DB_HOST=mysql
      - REDIS_HOST=redis
    depends_on:
      - mysql
      - redis
    networks:
      - hrm-network

volumes:
  mysql-data:
  redis-data:

networks:
  hrm-network:
    driver: bridge
```

### 7.4 Deploy with Docker

```bash
# Build and start containers
docker-compose up -d --build

# Run migrations
docker-compose exec backend php artisan migrate --force

# Seed database
docker-compose exec backend php artisan db:seed --force

# View logs
docker-compose logs -f
```

---

## 8. CI/CD Pipeline

### 8.1 GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          extensions: mbstring, xml, ctype, iconv, intl, pdo_mysql, dom, filter, gd, json, mbstring, pdo

      - name: Install Composer dependencies
        run: composer install --prefer-dist --no-progress

      - name: Run tests
        run: php artisan test

  build-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-backend:latest

  build-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: cd frontend && npm ci

      - name: Build
        run: cd frontend && npm run build
        env:
          VITE_API_URL: ${{ secrets.API_URL }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: ./frontend
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-frontend:latest

  deploy:
    needs: [build-backend, build-frontend]
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.10
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /var/www/hrm
            docker-compose pull
            docker-compose up -d
            docker-compose exec -T backend php artisan migrate --force
            docker-compose exec -T backend php artisan config:cache
            docker-compose exec -T backend php artisan route:cache
            docker-compose exec -T backend php artisan view:cache
```

### 8.2 GitLab CI/CD

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

variables:
  DOCKER_DRIVER: overlay2

test:
  stage: test
  image: php:8.2-cli
  script:
    - apt-get update && apt-get install -y git unzip
    - curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
    - composer install
    - php artisan test
  only:
    - main
    - merge_requests

build-backend:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHA ./backend
    - docker push $CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHA
  only:
    - main

build-frontend:
  stage: build
  image: node:18
  script:
    - cd frontend
    - npm ci
    - npm run build
  artifacts:
    paths:
      - frontend/dist
  only:
    - main

deploy:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | ssh-add -
  script:
    - ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST "cd /var/www/hrm && ./deploy.sh"
  only:
    - main
  when: manual
```

---

## 9. Monitoring & Logging

### 9.1 Application Logging

Configure Laravel logging in `config/logging.php`:

```php
'channels' => [
    'stack' => [
        'driver' => 'stack',
        'channels' => ['daily', 'slack'],
        'ignore_exceptions' => false,
    ],

    'daily' => [
        'driver' => 'daily',
        'path' => storage_path('logs/laravel.log'),
        'level' => env('LOG_LEVEL', 'error'),
        'days' => 14,
    ],

    'slack' => [
        'driver' => 'slack',
        'url' => env('LOG_SLACK_WEBHOOK_URL'),
        'username' => 'HRM Logger',
        'emoji' => ':boom:',
        'level' => 'critical',
    ],
],
```

### 9.2 Server Monitoring with Prometheus

Install Node Exporter:

```bash
# Download and install
wget https://github.com/prometheus/node_exporter/releases/download/v1.6.1/node_exporter-1.6.1.linux-amd64.tar.gz
tar xvfz node_exporter-1.6.1.linux-amd64.tar.gz
sudo mv node_exporter-1.6.1.linux-amd64/node_exporter /usr/local/bin/

# Create systemd service
sudo cat > /etc/systemd/system/node_exporter.service << EOF
[Unit]
Description=Node Exporter
After=network.target

[Service]
User=node_exporter
ExecStart=/usr/local/bin/node_exporter

[Install]
WantedBy=default.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable node_exporter
sudo systemctl start node_exporter
```

### 9.3 Error Tracking with Sentry

Install Sentry SDK:

```bash
composer require sentry/sentry-laravel
```

Configure in `.env`:

```env
SENTRY_LARAVEL_DSN=https://your_sentry_dsn
```

For frontend, install Sentry:

```bash
npm install @sentry/react
```

Initialize in `main.tsx`:

```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV,
  tracesSampleRate: 0.1,
});
```

### 9.4 Health Check Endpoint

Add to `routes/api.php`:

```php
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now()->toIso8601String(),
        'services' => [
            'database' => DB::connection()->getPdo() ? 'connected' : 'disconnected',
            'redis' => Redis::ping() ? 'connected' : 'disconnected',
            'queue' => Queue::size() >= 0 ? 'running' : 'stopped',
        ],
    ]);
});
```

---

## 10. Backup & Recovery

### 10.1 Automated Backup Script

Create `/usr/local/bin/hrm-full-backup.sh`:

```bash
#!/bin/bash

# Configuration
BACKUP_DIR="/var/backups/hrm"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup directory
mkdir -p $BACKUP_DIR/$DATE

# Database backup
mysqldump -u hrm_user -p'password' hrm_production | gzip > $BACKUP_DIR/$DATE/database.sql.gz

# Files backup (storage directory)
tar -czf $BACKUP_DIR/$DATE/storage.tar.gz -C /var/www/hrm-backend storage

# Environment backup
cp /var/www/hrm-backend/.env $BACKUP_DIR/$DATE/.env.backup

# Create combined archive
tar -czf $BACKUP_DIR/hrm_backup_$DATE.tar.gz -C $BACKUP_DIR $DATE

# Upload to S3 (optional)
aws s3 cp $BACKUP_DIR/hrm_backup_$DATE.tar.gz s3://hrm-backups/

# Cleanup local backup
rm -rf $BACKUP_DIR/$DATE

# Remove old backups
find $BACKUP_DIR -name "hrm_backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: hrm_backup_$DATE.tar.gz"
```

### 10.2 Recovery Procedure

```bash
# Download backup from S3
aws s3 cp s3://hrm-backups/hrm_backup_20240101_120000.tar.gz /tmp/

# Extract backup
cd /tmp
tar -xzf hrm_backup_20240101_120000.tar.gz

# Restore database
gunzip -c database.sql.gz | mysql -u hrm_user -p hrm_production

# Restore storage files
tar -xzf storage.tar.gz -C /var/www/hrm-backend/

# Restore environment
cp .env.backup /var/www/hrm-backend/.env

# Clear caches
cd /var/www/hrm-backend
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# Restart services
sudo systemctl restart php8.2-fpm
sudo supervisorctl restart hrm-worker:*
```

---

## 11. Scaling Considerations

### 11.1 Horizontal Scaling

For high-traffic deployments, consider:

1. **Load Balancer**: Use Nginx, HAProxy, or cloud load balancers (AWS ALB, GCP Load Balancer)
2. **Multiple App Servers**: Deploy multiple backend instances behind the load balancer
3. **Shared Session Storage**: Use Redis for session storage across instances
4. **Shared File Storage**: Use S3 or similar for file uploads
5. **Database Replication**: Set up MySQL read replicas for read-heavy workloads

### 11.2 Caching Strategy

```php
// config/cache.php
'default' => env('CACHE_DRIVER', 'redis'),

// Cache frequently accessed data
Cache::remember('employees.all', 3600, function () {
    return Employee::with('department', 'designation')->get();
});

// Cache dashboard statistics
Cache::remember('dashboard.stats.' . $userId, 300, function () use ($userId) {
    return $this->calculateDashboardStats($userId);
});
```

### 11.3 Database Optimization

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_leave_applications_status ON leave_applications(status);
CREATE INDEX idx_attendance_date ON attendance_records(date);

-- Optimize slow queries
EXPLAIN SELECT * FROM employees WHERE department_id = 1 AND status = 'active';
```

---

## 12. Troubleshooting

### 12.1 Common Issues

**Issue: 502 Bad Gateway**
```bash
# Check PHP-FPM status
sudo systemctl status php8.2-fpm

# Check PHP-FPM logs
sudo tail -f /var/log/php8.2-fpm.log

# Restart PHP-FPM
sudo systemctl restart php8.2-fpm
```

**Issue: Permission Denied**
```bash
# Fix storage permissions
sudo chown -R www-data:www-data /var/www/hrm-backend/storage
sudo chmod -R 775 /var/www/hrm-backend/storage
```

**Issue: Queue Jobs Not Processing**
```bash
# Check supervisor status
sudo supervisorctl status

# Restart workers
sudo supervisorctl restart hrm-worker:*

# Check queue logs
tail -f /var/www/hrm-backend/storage/logs/worker.log
```

**Issue: Database Connection Refused**
```bash
# Check MySQL status
sudo systemctl status mysql

# Test connection
mysql -u hrm_user -p -h 127.0.0.1 hrm_production

# Check max connections
mysql -e "SHOW VARIABLES LIKE 'max_connections';"
```

### 12.2 Performance Debugging

```bash
# Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

# Check slow queries
sudo tail -f /var/log/mysql/slow.log

# Laravel query debugging
DB::enableQueryLog();
// ... your code
dd(DB::getQueryLog());
```

### 12.3 Log Locations

| Service | Log Location |
|---------|--------------|
| Laravel | `/var/www/hrm-backend/storage/logs/laravel.log` |
| Nginx | `/var/log/nginx/error.log` |
| PHP-FPM | `/var/log/php8.2-fpm.log` |
| MySQL | `/var/log/mysql/error.log` |
| Supervisor | `/var/log/supervisor/supervisord.log` |
| Queue Worker | `/var/www/hrm-backend/storage/logs/worker.log` |

---

## Summary

This deployment guide covers all aspects of deploying the WorkDo HRM system to production, including server setup, application deployment, database configuration, SSL setup, Docker deployment, CI/CD pipelines, monitoring, backups, scaling, and troubleshooting. Follow these instructions carefully to ensure a secure and performant production deployment.
