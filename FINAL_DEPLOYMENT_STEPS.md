# 🚀 FINAL DEPLOYMENT STEPS - Get Your Site Live!

## ✅ Completed:
- DNS configured (www.houseiana.com → 56.228.34.198)
- Security Groups configured

## 📋 Now Follow These Steps:

---

## Step 1: Connect to Your EC2 Instance

### Get Your Windows Password:
1. Go to AWS Console → EC2
2. Select your instance: `i-00eac406446d5d98a`
3. Click **Actions** → **Security** → **Get Windows password**
4. Upload your `Next Houseiana.pem` file
5. Click **Decrypt Password**
6. **COPY THE PASSWORD!**

### Connect via Remote Desktop:
1. Open **Remote Desktop Connection** on your computer
2. Enter:
   - **Computer:** `56.228.34.198`
   - **Username:** `Administrator`
   - **Password:** [paste the password from above]
3. Click **Connect**

---

## Step 2: Run This Setup Script on EC2

Once connected to your EC2, open **PowerShell as Administrator** and copy/paste this entire script:

```powershell
# COMPLETE SETUP SCRIPT - COPY ALL OF THIS
Write-Host "Starting Houseiana Setup..." -ForegroundColor Green

# Install Chocolatey
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Wait and refresh
Start-Sleep -Seconds 5
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Install required software
Write-Host "Installing Node.js and Git..." -ForegroundColor Yellow
choco install nodejs --version=20.18.0 -y
choco install git -y

# Refresh PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Install npm packages
Write-Host "Installing pnpm and pm2..." -ForegroundColor Yellow
npm install -g pnpm pm2 pm2-windows-startup

# Configure Windows Firewall
Write-Host "Opening firewall ports..." -ForegroundColor Yellow
New-NetFirewallRule -DisplayName "Node.js 3000" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "HTTP 80" -Direction Inbound -LocalPort 80 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "HTTPS 443" -Direction Inbound -LocalPort 443 -Protocol TCP -Action Allow

Write-Host "Setup Phase 1 Complete!" -ForegroundColor Green
Write-Host "Now run the deployment script below..." -ForegroundColor Cyan
```

---

## Step 3: Deploy Your Application

After the above completes, run this in the same PowerShell:

```powershell
# DEPLOYMENT SCRIPT
Write-Host "Deploying Houseiana..." -ForegroundColor Green

# Create directory
New-Item -ItemType Directory -Path "C:\Apps" -Force
cd C:\Apps

# Clone your repository (REPLACE WITH YOUR GITHUB URL)
git clone https://github.com/YOUR-USERNAME/houseiana.git
cd houseiana\web

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pnpm install

# Create environment file with your database
Write-Host "Creating environment file..." -ForegroundColor Yellow
@"
DATABASE_URL='postgresql://postgres:YOUR_PASSWORD@database-1houseiana.c9qywii4wmqh.eu-north-1.rds.amazonaws.com:5432/houseiana?sslmode=require'
JWT_SECRET='your-secure-32-character-string-here-change-this'
RESEND_API_KEY='re_QhSfsBLL_CYFc9e1MbKoSLoRcEXomPCha'
RESEND_FROM_EMAIL='onboarding@resend.dev'
NEXT_PUBLIC_APP_URL='http://www.houseiana.com'
NODE_ENV='production'
"@ | Out-File -FilePath .env.production -Encoding UTF8

Write-Host "IMPORTANT: Edit .env.production with your database password!" -ForegroundColor Red
notepad .env.production

# Generate Prisma client
Write-Host "Setting up database..." -ForegroundColor Yellow
pnpm prisma generate
pnpm prisma db push

# Build the application
Write-Host "Building application..." -ForegroundColor Yellow
pnpm build

# Start the application
Write-Host "Starting application..." -ForegroundColor Green
pnpm start
```

---

## Step 4: Update Database Password

**IMPORTANT:** When Notepad opens with `.env.production`:
1. Replace `YOUR_PASSWORD` with your actual RDS database password
2. Save and close Notepad
3. The script will continue

---

## Step 5: Test Your Application

### Test from EC2:
1. Open Chrome/Edge on the EC2
2. Go to: `http://localhost:3000`
3. You should see your website!

### Test from Your Computer:
1. Open your browser
2. Try these URLs:
   - `http://56.228.34.198:3000`
   - `http://www.houseiana.com:3000`

---

## Step 6: Make It Run on Port 80 (No :3000)

To make the site work without the :3000 port, run this:

```powershell
# Install IIS
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole, IIS-WebServer, IIS-CommonHttpFeatures, IIS-HttpRedirect, IIS-ApplicationDevelopment, IIS-NetFxExtensibility45, IIS-HealthAndDiagnostics, IIS-HttpLogging, IIS-Security, IIS-RequestFiltering, IIS-Performance, IIS-WebServerManagementTools, IIS-ManagementConsole -All

# Install URL Rewrite Module
choco install urlrewrite -y

# Create IIS configuration
@"
<?xml version='1.0' encoding='UTF-8'?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name='ReverseProxy' stopProcessing='true'>
                    <match url='(.*)' />
                    <action type='Rewrite' url='http://localhost:3000/{R:1}' />
                </rule>
            </rules>
        </rewrite>
        <httpErrors existingResponse='PassThrough' />
    </system.webServer>
</configuration>
"@ | Out-File -FilePath "C:\Apps\houseiana\web\web.config" -Encoding UTF8

Write-Host "IIS setup complete! Configure the site in IIS Manager." -ForegroundColor Green
```

Then:
1. Open **IIS Manager**
2. Right-click **Sites** → **Add Website**
3. Site name: `Houseiana`
4. Physical path: `C:\Apps\houseiana\web`
5. Binding: Type: HTTP, Port: 80, Host name: `www.houseiana.com`
6. Click **OK**

---

## Step 7: Setup PM2 for Auto-Start

Make your app start automatically when Windows restarts:

```powershell
cd C:\Apps\houseiana\web

# Create PM2 configuration
@"
module.exports = {
  apps: [{
    name: 'houseiana',
    script: 'node_modules\\next\\dist\\bin\\next',
    args: 'start',
    cwd: 'C:\\Apps\\houseiana\\web',
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

---

## ✅ Final Test - Your Site Should Be Live!

After completing all steps, test these URLs:

| URL | Expected Result |
|-----|-----------------|
| http://localhost:3000 (on EC2) | ✅ Works |
| http://56.228.34.198:3000 | ✅ Works |
| http://www.houseiana.com:3000 | ✅ Works |
| http://www.houseiana.com | ✅ Works (after IIS setup) |

---

## 🔧 Troubleshooting

### Site not loading?
```powershell
# Check if Node.js is running
netstat -an | findstr :3000

# Check PM2 status
pm2 status

# Check logs
pm2 logs
```

### Database connection error?
- Make sure you updated the password in `.env.production`
- Ensure RDS security group allows your EC2

### Port 3000 required in URL?
- Complete Step 6 (IIS setup)
- Make sure IIS is running

---

## 🎉 SUCCESS CHECKLIST

- [ ] Connected to EC2 via RDP
- [ ] Installed Node.js, Git, pnpm
- [ ] Cloned repository
- [ ] Created .env.production with database password
- [ ] Built application (pnpm build)
- [ ] Application running on port 3000
- [ ] Can access http://www.houseiana.com:3000
- [ ] IIS configured for port 80
- [ ] Can access http://www.houseiana.com

---

**Your website will be LIVE at www.houseiana.com once you complete these steps!** 🚀