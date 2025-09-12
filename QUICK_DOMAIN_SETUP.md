# Quick Domain Setup Guide - houseiana.com

## 🚀 Quick Steps to Connect Your Domain

### Step 1: DNS Configuration (Domain Registrar)
Add these DNS records at your domain registrar (Namecheap, GoDaddy, etc.):

```
Type: A
Name: @
Value: YOUR_SERVER_IP
TTL: 300

Type: A  
Name: www
Value: YOUR_SERVER_IP
TTL: 300
```

### Step 2: Get Your Server IP
```bash
# On your server, run:
curl -s http://checkip.amazonaws.com
```

### Step 3: Server Setup (Run on your EC2/VPS)
```bash
# Make the deployment script executable
chmod +x scripts/deploy-domain.sh

# Run the deployment script
./scripts/deploy-domain.sh
```

### Step 4: Configure Nginx
```bash
# Copy the nginx config
sudo cp nginx/houseiana.conf /etc/nginx/sites-available/houseiana.com

# Enable the site
sudo ln -s /etc/nginx/sites-available/houseiana.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### Step 5: SSL Certificate
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d houseiana.com -d www.houseiana.com

# Enable auto-renewal
sudo systemctl enable certbot.timer
```

### Step 6: Start Your Application
```bash
# Install PM2
sudo npm install -g pm2

# Start your app
npm run build
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup
```

## 🔍 Verification Steps

### Check DNS Propagation
```bash
# Check if domain resolves
nslookup houseiana.com
dig houseiana.com

# Online checker
# Visit: https://dnschecker.org/#A/houseiana.com
```

### Test Website
```bash
# Test HTTP
curl -I http://houseiana.com

# Test HTTPS (after SSL)
curl -I https://houseiana.com

# Test API
curl https://houseiana.com/api/health
```

## 🛠️ Troubleshooting

### Domain not resolving?
- Wait up to 48 hours for DNS propagation
- Check DNS records are correct at your registrar
- Verify nameservers if using Cloudflare

### 502 Bad Gateway?
- Check if your Next.js app is running: `pm2 status`
- Check logs: `pm2 logs`
- Verify port 3000 is accessible: `netstat -tlnp | grep 3000`

### SSL issues?
- Ensure domain is accessible via HTTP first
- Check certbot logs: `sudo journalctl -u certbot`
- Verify nginx config: `sudo nginx -t`

## 📱 Alternative: Using Cloudflare (Recommended)

1. **Add site to Cloudflare**: cloudflare.com
2. **Update nameservers** at your domain registrar
3. **Configure DNS in Cloudflare**:
   - A record: @ → Your server IP
   - CNAME: www → houseiana.com
4. **SSL/TLS settings**: Full (strict)
5. **Enable "Always Use HTTPS"**

## 🎯 Final Checklist

- [ ] DNS records configured
- [ ] Domain resolves to your server IP
- [ ] Nginx configured and running
- [ ] SSL certificate installed
- [ ] Next.js application running (pm2 status)
- [ ] HTTPS redirect working
- [ ] API endpoints accessible
- [ ] All pages loading correctly

## 🌐 Your URLs

After setup, your site will be available at:
- **Main site**: https://houseiana.com
- **WWW**: https://www.houseiana.com  
- **API**: https://houseiana.com/api/health
- **Admin**: https://houseiana.com/dashboard

🎉 **Congratulations!** Your houseiana.com domain is now connected! 🏠✨