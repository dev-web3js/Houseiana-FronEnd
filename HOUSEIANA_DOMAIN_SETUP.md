# Houseiana.com Domain Setup - Your Instance

## 🖥️ Your Server Details
- **Instance ID**: i-00eac406446d5d98a
- **Public IP**: 56.228.34.198
- **Region**: eu-north-1 (Europe - Stockholm)
- **DNS Name**: ec2-56-228-34-198.eu-north-1.compute.amazonaws.com
- **Platform**: Windows Server 2025

## 🌐 Step 1: DNS Configuration

**Add these DNS records at your domain registrar:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 56.228.34.198 | 300 |
| A | www | 56.228.34.198 | 300 |

### Common DNS Providers:

**Namecheap:**
1. Login to Namecheap → Domain List
2. Click "Manage" next to houseiana.com
3. Advanced DNS → Add New Record
4. Add both A records above

**GoDaddy:**
1. Login → My Products → DNS
2. Add Record → A → @ → 56.228.34.198
3. Add Record → A → www → 56.228.34.198

**Cloudflare (Recommended):**
1. Add houseiana.com to Cloudflare
2. DNS → Records → Add Record
3. A → @ → 56.228.34.198
4. A → www → 56.228.34.198
5. Update nameservers at your registrar

## 🔧 Step 2: Windows Server Setup

### Connect to Your Windows Server:
```bash
# Use RDP or AWS Systems Manager Session Manager
# Public IP: 56.228.34.198
```

### Install Node.js and Required Software:
```powershell
# Download and install Node.js LTS
# Install Git for Windows
# Install IIS or use Node.js directly
```

### Alternative: Use IIS with iisnode
```powershell
# Enable IIS
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServer
Enable-WindowsOptionalFeature -Online -FeatureName IIS-CommonHttpFeatures
Enable-WindowsOptionalFeature -Online -FeatureName IIS-HttpErrors
Enable-WindowsOptionalFeature -Online -FeatureName IIS-HttpLogging
Enable-WindowsOptionalFeature -Online -FeatureName IIS-StaticContent

# Download and install iisnode
# https://github.com/azure/iisnode/releases
```

## 🔒 Step 3: SSL Certificate (Windows)

### Option A: Use Cloudflare SSL (Easiest)
1. Add domain to Cloudflare
2. SSL/TLS → Full (strict)
3. Always Use HTTPS → On

### Option B: Use Let's Encrypt with win-acme
```powershell
# Download win-acme
# https://github.com/win-acme/win-acme/releases

# Run certificate setup
wacs.exe --target manual --host houseiana.com,www.houseiana.com
```

## 🚀 Step 4: Deploy Your Application

### Upload Your Project:
1. ZIP your project files
2. Upload to your Windows server
3. Extract to `C:\inetpub\houseiana\`

### Install Dependencies:
```powershell
cd C:\inetpub\houseiana
npm install
npm run build
```

### Create web.config for IIS:
```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="server.js" verb="*" modules="iisnode"/>
    </handlers>
    <rewrite>
      <rules>
        <rule name="NodeInspector" patternSyntax="ECMAScript" stopProcessing="true">
          <match url="^server.js\/debug[\/]?" />
        </rule>
        <rule name="StaticContent">
          <action type="Rewrite" url="public{REQUEST_URI}"/>
        </rule>
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True"/>
          </conditions>
          <action type="Rewrite" url="server.js"/>
        </rule>
      </rules>
    </rewrite>
    <security>
      <requestFiltering>
        <hiddenSegments>
          <remove segment="bin"/>
        </hiddenSegments>
      </requestFiltering>
    </security>
    <httpErrors existingResponse="PassThrough" />
  </system.webServer>
</configuration>
```

## 🌐 Alternative: Simple Approach with PM2

### Install PM2 on Windows:
```powershell
npm install -g pm2
npm install -g pm2-windows-startup

# Configure PM2 startup
pm2-startup install
pm2 start ecosystem.config.js
pm2 save
```

### Configure Windows Firewall:
```powershell
# Allow HTTP and HTTPS
New-NetFirewallRule -DisplayName "Allow HTTP" -Direction Inbound -Protocol TCP -LocalPort 80
New-NetFirewallRule -DisplayName "Allow HTTPS" -Direction Inbound -Protocol TCP -LocalPort 443
New-NetFirewallRule -DisplayName "Allow Node.js" -Direction Inbound -Protocol TCP -LocalPort 3000
```

## ✅ Step 5: Update AWS Security Groups

**Add these inbound rules to your security group:**

| Type | Protocol | Port Range | Source |
|------|----------|------------|--------|
| HTTP | TCP | 80 | 0.0.0.0/0 |
| HTTPS | TCP | 443 | 0.0.0.0/0 |
| Custom TCP | TCP | 3000 | 0.0.0.0/0 |

### Update Security Group:
1. EC2 Console → Security Groups
2. Select your instance's security group
3. Inbound rules → Edit inbound rules
4. Add rules above

## 🧪 Step 6: Test Your Setup

### DNS Propagation Check:
```bash
# Check if domain resolves to your IP
nslookup houseiana.com
# Should return: 56.228.34.198

# Online checker
# Visit: https://dnschecker.org/#A/houseiana.com
```

### Test Direct IP Access:
```
http://56.228.34.198:3000
```

### Test Domain Access:
```
http://houseiana.com
https://houseiana.com (after SSL)
```

## 🔄 Step 7: Production Deployment Script

Create `deploy-windows.ps1`:
```powershell
# Production deployment script for Windows
Write-Host "Deploying Houseiana to Windows Server..."

# Stop existing processes
pm2 stop all

# Update code
git pull origin main

# Install dependencies
npm install --production

# Build application
npm run build

# Start application
pm2 start ecosystem.config.js
pm2 save

Write-Host "Deployment complete!"
Write-Host "Visit: https://houseiana.com"
```

## 📊 Step 8: Monitoring

### Check Application Status:
```powershell
pm2 status
pm2 logs
pm2 monit
```

### Windows Event Logs:
```powershell
# Check system logs
Get-EventLog -LogName System -Newest 10
Get-EventLog -LogName Application -Newest 10
```

## 🎯 Quick Start Commands

**On your Windows server:**
```powershell
# Clone your repository
git clone https://github.com/yourusername/houseiana.git C:\inetpub\houseiana

# Navigate and install
cd C:\inetpub\houseiana
npm install
npm run build

# Start with PM2
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2-startup install
```

## 🌍 Your Live URLs (After Setup)

- **Main Site**: https://houseiana.com
- **API Health**: https://houseiana.com/api/health
- **Admin Dashboard**: https://houseiana.com/dashboard
- **Direct IP**: http://56.228.34.198:3000

## 🆘 Troubleshooting

### Domain not resolving?
- DNS takes up to 48 hours to propagate
- Verify DNS records at your registrar
- Test with: `nslookup houseiana.com 8.8.8.8`

### Can't access website?
- Check Windows Firewall settings
- Verify AWS Security Group rules
- Ensure Node.js app is running: `pm2 status`

### SSL issues?
- Use Cloudflare for easy SSL
- Ensure port 443 is open in security group
- Check certificate installation

## 🎉 Final Steps

1. **Configure DNS records** → Point to 56.228.34.198
2. **Update Security Group** → Allow ports 80, 443, 3000
3. **Deploy application** → Use PM2 for process management
4. **Setup SSL** → Cloudflare or Let's Encrypt
5. **Test thoroughly** → All endpoints and functionality

Your **houseiana.com** domain is ready to go live! 🚀🏠✨