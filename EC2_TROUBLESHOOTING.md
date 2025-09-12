# 🔧 EC2 Troubleshooting: Website Not Working

## ✅ DNS Status: WORKING
- `www.houseiana.com` → `56.228.34.198` ✅
- `houseiana.com` → `56.228.34.198` ✅

## ❌ Problem: EC2 Not Responding
Your EC2 instance (56.228.34.198) is not serving the website.

## 📋 Immediate Fix Steps

### Step 1: Connect to Your EC2 Instance

1. **Get Windows Password:**
   - AWS Console → EC2 → Select instance `i-00eac406446d5d98a`
   - Actions → Security → Get Windows password
   - Upload your `Next Houseiana.pem` key file
   - Copy password

2. **Connect via Remote Desktop:**
   ```
   Computer: 56.228.34.198
   Username: Administrator
   Password: [from above]
   ```

### Step 2: Check Security Group Settings

**In AWS Console:**
1. Go to EC2 → Instances
2. Select your instance `i-00eac406446d5d98a`
3. Click on Security tab
4. Click on the security group link
5. Edit inbound rules - ADD these if missing:

| Type | Port | Source | Required |
|------|------|--------|----------|
| **HTTP** | 80 | 0.0.0.0/0 | ✅ YES |
| **HTTPS** | 443 | 0.0.0.0/0 | ✅ YES |
| **Custom TCP** | 3000 | 0.0.0.0/0 | ✅ YES |
| **RDP** | 3389 | Your IP | ✅ YES |

### Step 3: Quick Deploy Your App (After Connecting to EC2)

Run this in **PowerShell as Administrator** on your EC2:

```powershell
# Quick setup script
Write-Host "Quick Houseiana Setup..." -ForegroundColor Green

# Install Chocolatey
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Refresh
refreshenv

# Install Node.js and Git
choco install nodejs --version=20.18.0 -y
choco install git -y
refreshenv

# Install pnpm and pm2
npm install -g pnpm pm2

# Open firewall ports
New-NetFirewallRule -DisplayName "Node App" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "HTTP" -Direction Inbound -LocalPort 80 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "HTTPS" -Direction Inbound -LocalPort 443 -Protocol TCP -Action Allow

# Create app directory
New-Item -ItemType Directory -Path "C:\Apps" -Force
cd C:\Apps

# Clone your repository (REPLACE WITH YOUR ACTUAL GITHUB URL)
git clone https://github.com/YOUR-USERNAME/houseiana.git
cd houseiana\web

# Install dependencies
pnpm install

# Create production environment file
@"
DATABASE_URL='postgresql://postgres:YOUR_RDS_PASSWORD@database-1houseiana.c9qywii4wmqh.eu-north-1.rds.amazonaws.com:5432/houseiana?sslmode=require'
JWT_SECRET='your-32-character-secret-key-here'
RESEND_API_KEY='re_QhSfsBLL_CYFc9e1MbKoSLoRcEXomPCha'
RESEND_FROM_EMAIL='onboarding@resend.dev'
NEXT_PUBLIC_APP_URL='http://www.houseiana.com'
NODE_ENV='production'
"@ | Out-File -FilePath .env.production -Encoding UTF8

# Build and start
pnpm prisma generate
pnpm build
pnpm start
```

### Step 4: Test Access

After running the above:

1. **From EC2 itself:**
   - Open browser on EC2
   - Go to: `http://localhost:3000`
   - Should see your app

2. **From your computer:**
   - Try: `http://56.228.34.198:3000`
   - Try: `http://www.houseiana.com:3000`

### Step 5: Setup IIS for Port 80 (Optional)

To make site work without :3000 port:

1. **Install IIS:**
```powershell
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole, IIS-WebServer -All
```

2. **Install URL Rewrite:**
```powershell
choco install urlrewrite -y
```

3. **Create web.config in C:\Apps\houseiana\web:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="NodeJS" stopProcessing="true">
                    <match url=".*" />
                    <action type="Rewrite" url="http://localhost:3000/{R:0}" />
                </rule>
            </rules>
        </rewrite>
    </system.webServer>
</configuration>
```

4. **Configure IIS:**
   - Open IIS Manager
   - Create new site
   - Point to: `C:\Apps\houseiana\web`
   - Binding: Port 80, Host: www.houseiana.com

## 🔍 Diagnostic Commands

Run these on your EC2 to check status:

```powershell
# Check if Node.js is installed
node -v

# Check if app is running
netstat -an | findstr :3000

# Check PM2 status (if using PM2)
pm2 status

# Check Windows Firewall
Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*Node*"}

# Test local connection
curl http://localhost:3000
```

## ⚡ Quick Checklist

- [ ] Connected to EC2 via RDP
- [ ] Security group allows ports 80, 443, 3000
- [ ] Windows Firewall allows ports 80, 443, 3000
- [ ] Node.js installed
- [ ] Repository cloned
- [ ] Dependencies installed (pnpm install)
- [ ] Environment file created (.env.production)
- [ ] Database credentials added
- [ ] Application built (pnpm build)
- [ ] Application running (pnpm start or pm2)
- [ ] Accessible on port 3000

## 🚨 Common Issues

### "Connection Refused" or "Timeout"
- Security group not configured
- Windows Firewall blocking
- Application not running

### "Cannot GET /"
- Application not built
- Wrong directory
- Missing dependencies

### Database Connection Error
- RDS security group not allowing EC2
- Wrong credentials in .env.production
- Database not created

## 💡 Expected Result

Once everything is set up:
- ✅ http://www.houseiana.com:3000 - Works
- ✅ http://www.houseiana.com - Works (with IIS)
- ✅ http://56.228.34.198:3000 - Works

---

**Need immediate help?**

1. First, ensure your EC2 security group allows inbound traffic on ports 80, 443, and 3000
2. Connect to your EC2 and run the quick setup script above
3. Your site should be live within 10 minutes!