#!/bin/bash

# Smart Abhyas Deployment Script
# Usage: ./deploy.sh [production|staging]

set -e

ENVIRONMENT=${1:-production}
PROJECT_DIR="/var/www/smart-abhyas"
BACKUP_DIR="/var/backups/smart-abhyas"
DATE=$(date +%Y%m%d_%H%M%S)

echo "🚀 Starting deployment for $ENVIRONMENT environment..."

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup current deployment
if [ -d "$PROJECT_DIR" ]; then
    echo "📦 Creating backup..."
    tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" -C "$PROJECT_DIR" .
    echo "✅ Backup created: $BACKUP_DIR/backup_$DATE.tar.gz"
fi

# Install dependencies
echo "📥 Installing dependencies..."
npm ci --only=production

# Build the project
echo "🔨 Building project..."
npm run build

# Create project directory if it doesn't exist
sudo mkdir -p $PROJECT_DIR

# Deploy built files
echo "🚚 Deploying files..."
sudo cp -r dist/* $PROJECT_DIR/

# Set proper permissions
echo "🔐 Setting permissions..."
sudo chown -R www-data:www-data $PROJECT_DIR
sudo chmod -R 755 $PROJECT_DIR

# Test web server configuration
echo "🧪 Testing web server configuration..."
if command -v nginx &> /dev/null; then
    sudo nginx -t
    echo "✅ Nginx configuration is valid"
elif command -v apache2ctl &> /dev/null; then
    sudo apache2ctl configtest
    echo "✅ Apache configuration is valid"
fi

# Reload web server
echo "🔄 Reloading web server..."
if systemctl is-active --quiet nginx; then
    sudo systemctl reload nginx
    echo "✅ Nginx reloaded"
elif systemctl is-active --quiet apache2; then
    sudo systemctl reload apache2
    echo "✅ Apache reloaded"
fi

# Clean up old backups (keep last 5)
echo "🧹 Cleaning up old backups..."
cd $BACKUP_DIR
ls -t backup_*.tar.gz | tail -n +6 | xargs -r rm --

echo "🎉 Deployment completed successfully!"
echo "📍 Site is available at: https://your-domain.com"
echo "📊 Check logs at: /var/log/nginx/ or /var/log/apache2/"

# Optional: Run health check
echo "🏥 Running health check..."
if curl -f -s https://your-domain.com > /dev/null; then
    echo "✅ Site is responding correctly"
else
    echo "❌ Site health check failed"
    exit 1
fi