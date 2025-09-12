# Domain Connection Guide - houseiana.com

## Overview
This guide will help you connect your houseiana.com domain to your EC2 instance/deployment.

## Prerequisites
- ✅ Working Next.js application (tested and verified)
- 🔧 EC2 instance or hosting platform
- 🌐 houseiana.com domain ownership
- 🔑 Access to domain DNS management

## Step 1: Get Your Server IP Address

### For EC2 Instance:
```bash
# Check your EC2 instance public IP
curl -s http://checkip.amazonaws.com
# OR check in AWS Console
```

### For Cloud Platforms:
- **Vercel**: Use your deployment URL or custom domain setup
- **Railway**: Check your service URL in dashboard
- **Render**: Use the provided service URL

## Step 2: Configure DNS Records

### A. For Root Domain (houseiana.com)

**DNS Records to Add:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | YOUR_SERVER_IP | 300 |
| A | www | YOUR_SERVER_IP | 300 |
| CNAME | www | houseiana.com | 300 |

### B. For Subdomains (Optional)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | api | houseiana.com | 300 |
| CNAME | admin | houseiana.com | 300 |

### Common DNS Providers:

**Namecheap:**
1. Go to Domain List → Manage
2. Advanced DNS → Add New Record
3. Add the records above

**Cloudflare:**
1. DNS → Records
2. Add Record → Select type and add values

**GoDaddy:**
1. DNS → Manage Zones
2. Add DNS Records

**Route 53 (AWS):**
1. Hosted Zones → Your domain
2. Create Record Set

## Step 3: SSL Certificate Setup

### Option A: Let's Encrypt (Free - Recommended)

```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d houseiana.com -d www.houseiana.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### Option B: Cloudflare SSL (Free)
1. Add domain to Cloudflare
2. Update nameservers at your registrar
3. SSL/TLS → Full (strict)
4. Always Use HTTPS → On

## Step 4: Nginx Configuration

### Install Nginx:
```bash
sudo apt update
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Configure Nginx:
```bash
sudo nano /etc/nginx/sites-available/houseiana.com
```

**Basic Nginx Config:**
```nginx
server {
    listen 80;
    server_name houseiana.com www.houseiana.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name houseiana.com www.houseiana.com;

    # SSL Configuration (after getting certificates)
    ssl_certificate /etc/letsencrypt/live/houseiana.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/houseiana.com/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy to Next.js application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API routes
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Enable the site:**
```bash
sudo ln -s /etc/nginx/sites-available/houseiana.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 5: Update Application Configuration

### Update .env file:
```env
# Update your .env file
NEXT_PUBLIC_APP_URL="https://houseiana.com"
NEXTAUTH_URL="https://houseiana.com"

# Database URL (if needed)
DATABASE_URL="your_database_url"

# Other environment variables
JWT_SECRET="your_jwt_secret"
RESEND_API_KEY="your_resend_api_key"
```

### Update next.config.mjs:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  poweredByHeader: false,
  
  // Image domains
  images: {
    domains: ['houseiana.com', 'images.unsplash.com'],
    unoptimized: process.env.EXPORT_STATIC === 'true'
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig;
```

## Step 6: PM2 Process Management

### Install PM2:
```bash
npm install -g pm2
```

### Create ecosystem.config.js:
```javascript
module.exports = {
  apps: [{
    name: 'houseiana',
    script: 'npm',
    args: 'start',
    cwd: '/path/to/your/app',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### Start with PM2:
```bash
# Build the application
npm run build

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup
```

## Step 7: Firewall Configuration

### Configure UFW (Ubuntu Firewall):
```bash
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### AWS Security Group (if using EC2):
- HTTP (80): 0.0.0.0/0
- HTTPS (443): 0.0.0.0/0
- SSH (22): Your IP only

## Step 8: Testing and Verification

### Test DNS Resolution:
```bash
# Check if domain resolves to your IP
nslookup houseiana.com
dig houseiana.com

# Test from different locations
curl -I https://houseiana.com
```

### SSL Certificate Check:
```bash
# Check SSL certificate
openssl s_client -connect houseiana.com:443 -servername houseiana.com

# Online SSL checker
# Visit: https://www.ssllabs.com/ssltest/
```

### Website Health Check:
```bash
# Test website response
curl -I https://houseiana.com
curl -I https://www.houseiana.com

# Test API endpoints
curl https://houseiana.com/api/health
```

## Alternative: Using Cloudflare (Recommended)

### Benefits:
- Free SSL certificates
- CDN and caching
- DDoS protection
- Easy DNS management
- Analytics

### Setup Steps:
1. **Add site to Cloudflare**
   - Sign up at cloudflare.com
   - Add houseiana.com

2. **Update Nameservers**
   - Copy Cloudflare nameservers
   - Update at your domain registrar

3. **Configure DNS Records**
   - A record: @ → Your server IP
   - CNAME: www → houseiana.com

4. **SSL/TLS Settings**
   - SSL/TLS → Full (strict)
   - Always Use HTTPS → On
   - HSTS → Enable

5. **Performance Settings**
   - Speed → Optimization → Auto Minify
   - Caching → Browser Cache TTL → 1 month

## Troubleshooting

### Common Issues:

**Domain not resolving:**
- Check DNS propagation (up to 48 hours)
- Verify DNS records are correct
- Use online DNS checker tools

**SSL certificate errors:**
- Ensure Nginx config is correct
- Check certificate paths
- Verify domain validation

**502 Bad Gateway:**
- Check if Next.js app is running
- Verify proxy_pass in Nginx config
- Check application logs

**Useful Commands:**
```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Check PM2 status
pm2 status
pm2 logs

# Check application logs
tail -f ./logs/combined.log
```

## Final Checklist

- [ ] DNS records configured
- [ ] SSL certificate installed
- [ ] Nginx configured and running
- [ ] Application running on production
- [ ] Firewall configured
- [ ] Domain resolves correctly
- [ ] HTTPS working
- [ ] All pages loading
- [ ] API endpoints working

## Monitoring and Maintenance

### Set up monitoring:
```bash
# Install monitoring tools
npm install -g pm2-logrotate
pm2 install pm2-server-monit
```

### Regular maintenance:
- Monitor SSL certificate expiry
- Check application logs
- Update dependencies
- Backup database
- Monitor server resources

Your houseiana.com domain should now be successfully connected to your instance! 🚀