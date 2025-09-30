# Smart Abhyas - Server Deployment Guide

This guide will help you deploy the Smart Abhyas platform on your server.

## Prerequisites

- Node.js 18+ and npm
- A web server (Apache/Nginx)
- SSL certificate for HTTPS
- Supabase account (or self-hosted Supabase)

## Quick Start

1. **Clone and Install Dependencies**
```bash
git clone <your-repo-url>
cd smart-abhyas-platform
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Build for Production**
```bash
npm run build
```

4. **Deploy to Web Server**
```bash
# Copy dist folder contents to your web server root
cp -r dist/* /var/www/html/
```

## Detailed Setup Instructions

### 1. Server Requirements

- **Operating System**: Linux (Ubuntu 20.04+ recommended)
- **Node.js**: Version 18 or higher
- **Memory**: Minimum 2GB RAM
- **Storage**: At least 10GB free space
- **Web Server**: Nginx or Apache

### 2. Database Setup (Supabase)

You have two options:

#### Option A: Use Supabase Cloud (Recommended)
1. Create account at https://supabase.com
2. Create new project
3. Copy your project URL and anon key
4. Update `.env` file with your credentials

#### Option B: Self-hosted Supabase
1. Follow Supabase self-hosting guide
2. Set up PostgreSQL database
3. Run the migration files in `supabase/migrations/`

### 3. Environment Configuration

Create `.env` file in project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Build and Deploy

```bash
# Install dependencies
npm install

# Build for production
npm run build

# The built files will be in the 'dist' directory
```

### 5. Web Server Configuration

#### For Nginx:

Create `/etc/nginx/sites-available/smart-abhyas`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    root /var/www/smart-abhyas;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/smart-abhyas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### For Apache:

Create `/etc/apache2/sites-available/smart-abhyas.conf`:

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    Redirect permanent / https://your-domain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName your-domain.com
    DocumentRoot /var/www/smart-abhyas

    SSLEngine on
    SSLCertificateFile /path/to/your/certificate.crt
    SSLCertificateKeyFile /path/to/your/private.key

    # Handle client-side routing
    <Directory /var/www/smart-abhyas>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    # Cache static assets
    <LocationMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
    </LocationMatch>
</VirtualHost>
```

Enable the site:
```bash
sudo a2ensite smart-abhyas
sudo a2enmod rewrite ssl
sudo systemctl reload apache2
```

## File Upload Configuration

The application uses Supabase Storage for PDF files. Make sure to:

1. Create a storage bucket named `study-materials`
2. Set appropriate RLS policies for file access
3. Configure CORS if needed

## Admin Setup

1. Register the first admin user through the application
2. The trigger will automatically add them to the admin_users table
3. Additional admins can be added through the admin panel

## Monitoring and Maintenance

### Log Files
- Application logs: Check browser console and network tab
- Server logs: `/var/log/nginx/` or `/var/log/apache2/`
- Database logs: Check Supabase dashboard

### Backup Strategy
- Database: Use Supabase backup features or pg_dump for self-hosted
- Files: Backup the storage bucket regularly
- Code: Keep your repository updated

### Updates
```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Rebuild
npm run build

# Deploy
cp -r dist/* /var/www/smart-abhyas/
```

## Troubleshooting

### Common Issues

1. **White screen after deployment**
   - Check browser console for errors
   - Verify environment variables are set correctly
   - Ensure all static files are served properly

2. **Database connection errors**
   - Verify Supabase URL and keys
   - Check network connectivity
   - Ensure RLS policies are configured

3. **File upload issues**
   - Check storage bucket permissions
   - Verify CORS configuration
   - Ensure sufficient storage space

4. **Routing issues (404 on refresh)**
   - Verify web server configuration for SPA routing
   - Check .htaccess or nginx config

### Performance Optimization

1. **Enable Gzip compression**
2. **Use CDN for static assets**
3. **Optimize images and fonts**
4. **Monitor database query performance**

## Security Considerations

1. **HTTPS Only**: Always use SSL certificates
2. **Environment Variables**: Never commit sensitive data
3. **CORS**: Configure properly for your domain
4. **RLS**: Ensure Row Level Security is enabled
5. **Updates**: Keep dependencies updated

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review application logs
3. Check Supabase dashboard for database issues
4. Verify server configuration

## License

This project is proprietary. Please ensure you have proper licensing before deployment.