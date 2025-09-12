# 🔌 Complete EC2 Connection Guide for Houseiana

## Your AWS Infrastructure

### EC2 Instance (Windows Server 2025)
```
Instance ID: i-00eac406446d5d98a
Public IP: 56.228.34.198
DNS: ec2-56-228-34-198.eu-north-1.compute.amazonaws.com
Private IP: 172.31.33.104
VPC: vpc-0a06fec59136d0102
Region: eu-north-1
Key Pair: Next Houseiana
```

### RDS Database (PostgreSQL)
```
Endpoint: database-1houseiana.c9qywii4wmqh.eu-north-1.rds.amazonaws.com
Port: 5432
VPC: vpc-0a06fec59136d0102 (Same as EC2 ✅)
Security Group: sg-040512a68fd1abc8a
```

## 🚀 QUICK START - Connect Everything

### Step 1: Connect to Your Windows EC2

#### Get Windows Password:
1. AWS Console → EC2 → Instances
2. Select `i-00eac406446d5d98a`
3. Actions → Security → Get Windows password
4. Upload your `Next Houseiana.pem` file
5. Copy the password

#### Connect via Remote Desktop:
```
Computer: 56.228.34.198
Username: Administrator
Password: [From step above]
```

### Step 2: Quick Setup Script

Once connected to Windows EC2, open **PowerShell as Administrator** and run this all-in-one script:

```powershell
# One-click setup script
# Save this as setup.ps1 and run it

Write-Host "Starting Houseiana Setup..." -ForegroundColor Green

# Install Chocolatey
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Refresh environment
refreshenv

# Install all required software
Write-Host "Installing Node.js, Git, and tools..." -ForegroundColor Yellow
choco install nodejs --version=20.18.0 -y
choco install git -y
choco install googlechrome -y
choco install postgresql16 -y

# Install npm packages globally
npm install -g pnpm pm2 pm2-windows-startup

# Configure firewall
Write-Host "Configuring firewall..." -ForegroundColor Yellow
New-NetFirewallRule -DisplayName "Node.js App" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "HTTP" -Direction Inbound -LocalPort 80 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "HTTPS" -Direction Inbound -LocalPort 443 -Protocol TCP -Action Allow

# Create application directory
Write-Host "Setting up application directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "C:\Apps\Houseiana" -Force
cd C:\Apps\Houseiana

Write-Host "Setup complete! Now clone your repository and configure the app." -ForegroundColor Green
```

### Step 3: Deploy Your Application

```powershell
# Navigate to app directory
cd C:\Apps\Houseiana

# Clone your repository (replace with your actual repo URL)
git clone https://github.com/YOUR-USERNAME/houseiana.git .
cd web

# Install dependencies
pnpm install

# Create environment file
@"
DATABASE_URL='postgresql://postgres:YOUR_PASSWORD@database-1houseiana.c9qywii4wmqh.eu-north-1.rds.amazonaws.com:5432/houseiana?sslmode=require'
JWT_SECRET='generate-32-character-secure-string-here'
RESEND_API_KEY='re_QhSfsBLL_CYFc9e1MbKoSLoRcEXomPCha'
RESEND_FROM_EMAIL='onboarding@resend.dev'
NEXT_PUBLIC_APP_URL='http://56.228.34.198'
NODE_ENV='production'
"@ | Out-File -FilePath .env.production -Encoding UTF8

# Build and start
pnpm prisma generate
pnpm prisma db push
pnpm build
pnpm start
```

### Step 4: Configure Database Connection

#### Update RDS Security Group:
1. Go to AWS RDS Console
2. Select your database
3. Click on security group `sg-040512a68fd1abc8a`
4. Edit inbound rules → Add rule:
   ```
   Type: PostgreSQL
   Port: 5432
   Source: 172.31.33.104/32 (Your EC2's private IP)
   ```

#### Test Database Connection:
```powershell
# From your EC2 instance
psql -h database-1houseiana.c9qywii4wmqh.eu-north-1.rds.amazonaws.com -U postgres -d houseiana
```

### Step 5: Setup PM2 for Auto-Start

```powershell
# Create PM2 config
@"
module.exports = {
  apps: [{
    name: 'houseiana',
    script: 'node_modules\\next\\dist\\bin\\next',
    args: 'start',
    cwd: 'C:\\Apps\\Houseiana\\web',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
"@ | Out-File -FilePath ecosystem.config.js -Encoding UTF8

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2-startup install
```

## ✅ Verification Checklist

### From EC2 Instance:
- [ ] Open Chrome: `http://localhost:3000` - Should see your app

### From Your Computer:
- [ ] Browser: `http://56.228.34.198:3000` - Should see your app
- [ ] Browser: `http://ec2-56-228-34-198.eu-north-1.compute.amazonaws.com:3000`

### Database Check:
- [ ] Application can connect to RDS
- [ ] Data is being saved/retrieved

## 🔥 IMPORTANT: Security Group Settings

### EC2 Security Group (Inbound Rules):

| Type | Port | Source | Purpose |
|------|------|--------|---------|
| RDP | 3389 | Your IP | Remote Desktop access |
| HTTP | 80 | 0.0.0.0/0 | Web traffic |
| HTTPS | 443 | 0.0.0.0/0 | Secure web traffic |
| Custom TCP | 3000 | 0.0.0.0/0 | Node.js app |

### RDS Security Group (Inbound Rules):

| Type | Port | Source | Purpose |
|------|------|--------|---------|
| PostgreSQL | 5432 | 172.31.33.104/32 | EC2 access |

## 🆘 Troubleshooting

### Can't connect to EC2?
- Check security group allows RDP from your IP
- Verify you're using correct password
- Try using Public DNS instead of IP

### Application not running?
```powershell
pm2 status
pm2 logs houseiana
pm2 restart houseiana
```

### Database connection failed?
1. Check RDS security group
2. Verify credentials in `.env.production`
3. Ensure EC2 and RDS are in same VPC
4. Test with: `psql -h [endpoint] -U [user] -d [database]`

### Port 3000 not accessible?
```powershell
# Check if app is running
netstat -an | findstr :3000

# Check firewall
Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*Node*"}
```

## 📊 Monitor Your Application

```powershell
# Real-time logs
pm2 logs

# Process monitoring
pm2 monit

# System resources
Get-Process node | Select-Object CPU, WS

# Check disk space
Get-PSDrive C
```

## 🎯 Your Live Application URLs

Once everything is set up:

| Access Method | URL |
|--------------|-----|
| Direct Node.js | http://56.228.34.198:3000 |
| Public DNS | http://ec2-56-228-34-198.eu-north-1.compute.amazonaws.com:3000 |
| Future Domain | https://yourdomain.com |

## 💡 Pro Tips

1. **Save your RDP connection** for quick access
2. **Use Chrome on EC2** for local testing
3. **Set up CloudWatch** for monitoring
4. **Create AMI backup** after setup
5. **Consider Elastic IP** for static address

---

**🎉 Your EC2 is configured and ready to host Houseiana!**

Need help? The application should be accessible at:
### → http://56.228.34.198:3000