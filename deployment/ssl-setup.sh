#!/bin/bash

# SSL Certificate Setup Script using Let's Encrypt
# Usage: ./ssl-setup.sh your-domain.com

DOMAIN=${1:-your-domain.com}

if [ -z "$DOMAIN" ]; then
    echo "Usage: $0 <domain-name>"
    exit 1
fi

echo "🔒 Setting up SSL certificate for $DOMAIN..."

# Install Certbot
if ! command -v certbot &> /dev/null; then
    echo "📥 Installing Certbot..."
    sudo apt update
    sudo apt install -y certbot
    
    if command -v nginx &> /dev/null; then
        sudo apt install -y python3-certbot-nginx
    elif command -v apache2 &> /dev/null; then
        sudo apt install -y python3-certbot-apache
    fi
fi

# Obtain SSL certificate
echo "🎫 Obtaining SSL certificate..."
if command -v nginx &> /dev/null; then
    sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN
elif command -v apache2 &> /dev/null; then
    sudo certbot --apache -d $DOMAIN -d www.$DOMAIN
else
    echo "❌ No supported web server found (nginx or apache2)"
    exit 1
fi

# Set up auto-renewal
echo "🔄 Setting up auto-renewal..."
sudo crontab -l | grep -q certbot || (sudo crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | sudo crontab -

echo "✅ SSL certificate setup completed!"
echo "🔒 Your site should now be available at https://$DOMAIN"