# 🪟 Windows EC2 Deployment Guide for Houseiana

## Your EC2 Instance Details

| Property | Value |
|----------|-------|
| **Instance ID** | i-00eac406446d5d98a |
| **Public IP** | 56.228.34.198 |
| **Public DNS** | ec2-56-228-34-198.eu-north-1.compute.amazonaws.com |
| **Private IP** | 172.31.33.104 |
| **Instance Type** | t3.micro |
| **Region** | eu-north-1 |
| **VPC** | vpc-0a06fec59136d0102 (Same as your RDS!) ✅ |
| **Key Pair** | Next Houseiana |
| **OS** | Windows Server 2025 |

## 📋 Step 1: Connect to Your Windows EC2

### Option A: Using RDP (Remote Desktop)

1. **Get Windows Password:**
   - Go to EC2 Console
   - Select your instance (i-00eac406446d5d98a)
   - Click "Actions" → "Security" → "Get Windows password"
   - Upload your key file (`Next Houseiana.pem`)
   - Copy the decrypted password

2. **Connect via RDP:**
   - Open Remote Desktop Connection on your computer
   - Server: `56.228.34.198` or `ec2-56-228-34-198.eu-north-1.compute.amazonaws.com`
   - Username: `Administrator`
   - Password: [The decrypted password from step 1]

### Option B: Using EC2 Instance Connect (if available)
- Click "Connect" button in EC2 console
- Choose "RDP client"

## 📋 Step 2: Install Required Software on Windows EC2

Once connected to your Windows EC2, open **PowerShell as Administrator** and run:

### Install Chocolatey (Package Manager)
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### Install Node.js, Git, and Tools
```powershell
# Refresh environment
refreshenv

# Install Node.js 20, Git, and other tools
choco install nodejs --version=20.18.0 -y
choco install git -y
choco install googlechrome -y
choco install vscode -y
choco install postgresql16 -y  # For psql client

# Install pnpm
npm install -g pnpm

# Install PM2 for Windows
npm install -g pm2
npm install -g pm2-windows-startup
```

### Install IIS (Internet Information Services)
```powershell
# Install IIS with required features
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole, IIS-WebServer, IIS-CommonHttpFeatures, IIS-HttpErrors, IIS-HttpRedirect, IIS-ApplicationDevelopment, IIS-HealthAndDiagnostics, IIS-HttpLogging, IIS-Security, IIS-RequestFiltering, IIS-Performance, IIS-WebServerManagementTools, IIS-IIS6ManagementCompatibility, IIS-Metabase, IIS-ManagementConsole, IIS-BasicAuthentication, IIS-WindowsAuthentication, IIS-StaticContent, IIS-DefaultDocument, IIS-DirectoryBrowsing -All

# Install URL Rewrite Module for IIS
choco install urlrewrite -y

# Install IISNode for Node.js integration
choco install iisnode -y
```

## 📋 Step 3: Configure Firewall

Open PowerShell as Administrator:

```powershell
# Allow inbound traffic on port 3000 (for testing)
New-NetFirewallRule -DisplayName "Node.js App" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow

# Allow HTTP and HTTPS
New-NetFirewallRule -DisplayName "HTTP" -Direction Inbound -LocalPort 80 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "HTTPS" -Direction Inbound -LocalPort 443 -Protocol TCP -Action Allow
```

## 📋 Step 4: Setup Your Application

```powershell
# Create application directory
New-Item -ItemType Directory -Path "C:\inetpub\houseiana" -Force
cd C:\inetpub\houseiana

# Clone your repository
git clone https://github.com/YOUR-USERNAME/houseiana.git .
cd web

# Install dependencies
pnpm install

# Create production environment file
New-Item -ItemType File -Path ".env.production"
```

Edit `.env.production` with Notepad or VS Code:
```env
DATABASE_URL='postgresql://[username]:[password]@database-1houseiana.c9qywii4wmqh.eu-north-1.rds.amazonaws.com:5432/houseiana?sslmode=require'
JWT_SECRET="generate-a-32-character-string-here"
RESEND_API_KEY="re_QhSfsBLL_CYFc9e1MbKoSLoRcEXomPCha"
RESEND_FROM_EMAIL="onboarding@resend.dev"
NEXT_PUBLIC_APP_URL="http://56.228.34.198"
NODE_ENV=production
```

## 📋 Step 5: Build and Test Application

```powershell
# Generate Prisma client
pnpm prisma generate

# Push database schema
pnpm prisma db push

# Build the application
pnpm build

# Test the application
pnpm start
```

Visit: `http://localhost:3000` on the EC2 machine or `http://56.228.34.198:3000` from your computer

## 📋 Step 6: Setup PM2 for Production

Create `ecosystem.config.js` in `C:\inetpub\houseiana\web`:

```javascript
module.exports = {
  apps: [{
    name: 'houseiana',
    script: 'node_modules\\next\\dist\\bin\\next',
    args: 'start',
    cwd: 'C:\\inetpub\\houseiana\\web',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: 'C:\\logs\\pm2\\houseiana-error.log',
    out_file: 'C:\\logs\\pm2\\houseiana-out.log',
    merge_logs: true,
    time: true
  }]
};
```

Start with PM2:
```powershell
# Create log directory
New-Item -ItemType Directory -Path "C:\logs\pm2" -Force

# Start application
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup PM2 to start on Windows boot
pm2-startup install
pm2 save
```

## 📋 Step 7: Configure IIS as Reverse Proxy

1. **Open IIS Manager**
2. **Create New Website:**
   - Site name: `Houseiana`
   - Physical path: `C:\inetpub\houseiana\web`
   - Port: 80
   - Host name: Leave empty or use your domain

3. **Install Application Request Routing (ARR):**
   - Download from: https://www.iis.net/downloads/microsoft/application-request-routing
   - Install ARR 3.0

4. **Configure URL Rewrite:**
   
Create `web.config` in `C:\inetpub\houseiana\web`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="ReverseProxyInboundRule1" stopProcessing="true">
                    <match url="(.*)" />
                    <action type="Rewrite" url="http://localhost:3000/{R:1}" />
                </rule>
            </rules>
        </rewrite>
        <httpErrors existingResponse="PassThrough" />
        <security>
            <requestFiltering>
                <requestLimits maxAllowedContentLength="30000000" />
            </requestFiltering>
        </security>
    </system.webServer>
</configuration>
```

5. **Restart IIS:**
```powershell
iisreset
```

## 📋 Step 8: Configure AWS Security Group

In AWS Console, update your EC2 security group to allow:

| Type | Port | Source | Description |
|------|------|--------|-------------|
| HTTP | 80 | 0.0.0.0/0 | Web traffic |
| HTTPS | 443 | 0.0.0.0/0 | Secure web traffic |
| Custom TCP | 3000 | Your IP | Direct Node.js access (testing) |
| RDP | 3389 | Your IP | Remote Desktop |

## 📋 Step 9: Connect to RDS Database

Since your EC2 and RDS are in the same VPC, update RDS security group:

1. Go to RDS Console → Your database → Security group
2. Add inbound rule:
   - Type: PostgreSQL
   - Port: 5432
   - Source: `sg-[your-ec2-security-group-id]`

Test connection from EC2:
```powershell
psql -h database-1houseiana.c9qywii4wmqh.eu-north-1.rds.amazonaws.com -U [username] -d houseiana -p 5432
```

## 📋 Step 10: Setup Automated Deployment

Create `deploy.ps1` in `C:\inetpub\houseiana\web`:

```powershell
# Deployment script for Windows
Write-Host "Starting deployment..." -ForegroundColor Green

# Pull latest changes
git pull origin main

# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma generate

# Build application
pnpm build

# Restart PM2
pm2 restart houseiana

Write-Host "Deployment completed!" -ForegroundColor Green
```

## 🌐 Access Your Application

Your application should now be accessible at:
- **Direct Node.js**: http://56.228.34.198:3000
- **Through IIS**: http://56.228.34.198
- **Public DNS**: http://ec2-56-228-34-198.eu-north-1.compute.amazonaws.com

## 🛠 Useful Commands

```powershell
# Check PM2 status
pm2 status

# View logs
pm2 logs houseiana

# Restart application
pm2 restart houseiana

# Check IIS status
iisreset /status

# View Windows Event logs
Get-EventLog -LogName Application -Newest 10
```

## 🔧 Troubleshooting

**Application not accessible?**
1. Check Windows Firewall rules
2. Check AWS Security Group
3. Verify PM2 is running: `pm2 status`
4. Check IIS is running: `iisreset /status`

**Database connection issues?**
1. Verify RDS security group allows EC2
2. Test with psql client
3. Check credentials in `.env.production`

**PM2 not starting on boot?**
```powershell
pm2-startup install
pm2 save
```

## 💰 Cost Considerations

- **t3.micro**: ~$10-15/month (Windows instances cost more than Linux)
- **Consider upgrading** to t3.small or t3.medium for production
- **Windows License**: Included in EC2 pricing
- **Data Transfer**: First 100GB free

## 🔒 Security Best Practices

1. **Change Administrator password** immediately
2. **Enable Windows Defender** and updates
3. **Restrict RDP access** to your IP only
4. **Use SSL certificate** for production
5. **Regular backups** of application and data
6. **Monitor with CloudWatch**

## 📝 Next Steps

1. ✅ Setup domain name and SSL certificate
2. ✅ Configure CloudWatch monitoring
3. ✅ Setup automated backups
4. ✅ Implement CI/CD pipeline
5. ✅ Setup email alerts for failures

---

**Your EC2 is ready!** Access your application at: http://56.228.34.198