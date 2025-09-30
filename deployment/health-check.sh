#!/bin/bash

# Health Check Script for Smart Abhyas
# Usage: ./health-check.sh [domain]

DOMAIN=${1:-localhost}
PROTOCOL="https"

if [ "$DOMAIN" = "localhost" ]; then
    PROTOCOL="http"
fi

URL="$PROTOCOL://$DOMAIN"

echo "🏥 Running health check for $URL..."

# Check if site is responding
echo "📡 Checking site response..."
if curl -f -s -o /dev/null "$URL"; then
    echo "✅ Site is responding"
else
    echo "❌ Site is not responding"
    exit 1
fi

# Check if main page loads
echo "📄 Checking main page..."
RESPONSE=$(curl -s "$URL")
if echo "$RESPONSE" | grep -q "Smart Abhyas"; then
    echo "✅ Main page loads correctly"
else
    echo "❌ Main page content not found"
    exit 1
fi

# Check if JavaScript loads
echo "🔧 Checking JavaScript assets..."
if echo "$RESPONSE" | grep -q "script"; then
    echo "✅ JavaScript assets found"
else
    echo "⚠️  No JavaScript assets found"
fi

# Check if CSS loads
echo "🎨 Checking CSS assets..."
if echo "$RESPONSE" | grep -q "stylesheet\|\.css"; then
    echo "✅ CSS assets found"
else
    echo "⚠️  No CSS assets found"
fi

# Check web server status
echo "🌐 Checking web server status..."
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx is running"
elif systemctl is-active --quiet apache2; then
    echo "✅ Apache is running"
else
    echo "⚠️  No web server detected or not running"
fi

# Check SSL certificate (if HTTPS)
if [ "$PROTOCOL" = "https" ]; then
    echo "🔒 Checking SSL certificate..."
    if openssl s_client -connect "$DOMAIN:443" -servername "$DOMAIN" </dev/null 2>/dev/null | openssl x509 -noout -dates 2>/dev/null; then
        echo "✅ SSL certificate is valid"
    else
        echo "❌ SSL certificate check failed"
    fi
fi

echo "🎉 Health check completed!"