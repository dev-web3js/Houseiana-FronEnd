# AWS EC2 Deployment Guide for Houseiana

## Step 1: Create EC2 Instance

### 1.1 Launch Instance
1. Go to AWS EC2 Console
2. Click "Launch Instance"
3. Configure with these settings:

**Name and tags:**
- Name: `houseiana-production`

**Application and OS Images:**
- Choose: **Ubuntu Server 22.04 LTS (HVM), SSD Volume Type**
- Architecture: 64-bit (x86)

**Instance type:**
- For production: `t3.medium` (2 vCPU, 4 GB RAM)
- For testing: `t3.small` (2 vCPU, 2 GB RAM)

**Key pair:**
- Create new key pair
- Name: `houseiana-key`
- Type: RSA
- Format: .pem (for Mac/Linux) or .ppk (for Windows PuTTY)
- **Save this file securely!**

**Network settings:**
- VPC: Same as your RDS (`vpc-0a06fec59136d0102`)
- Subnet: Choose one from same availability zone as RDS
- Auto-assign public IP: Enable
- Create security group: `houseiana-web-sg`

**Configure Security Group:**
Add these inbound rules:
- SSH (22) - Your IP
- HTTP (80) - 0.0.0.0/0
- HTTPS (443) - 0.0.0.0/0
- Custom TCP (3000) - Your IP (for testing)

**Configure storage:**
- 20 GB gp3 (General Purpose SSD)

**Advanced details:**
- IAM instance profile: Create one with RDS access if needed

### 1.2 Connect to Instance

```bash
# Set permissions for key file
chmod 400 houseiana-key.pem

# Connect via SSH
ssh -i "houseiana-key.pem" ubuntu@[YOUR-EC2-PUBLIC-IP]
```

For Windows users with PuTTY:
1. Use PuTTYgen to convert .pem to .ppk
2. Use PuTTY with the .ppk file

## Step 2: Initial Server Setup

Once connected, run these commands:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install essential tools
sudo apt install -y git nginx certbot python3-certbot-nginx postgresql-client

# Install PM2 globally
sudo npm install -g pm2

# Install pnpm
sudo npm install -g pnpm

# Create app directory
sudo mkdir -p /var/www/houseiana
sudo chown -R ubuntu:ubuntu /var/www/houseiana

# Setup firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

## Step 3: Clone and Setup Application

```bash
# Navigate to app directory
cd /var/www/houseiana

# Clone your repository
git clone https://github.com/[YOUR-USERNAME]/houseiana.git .
# OR if using deploy key:
# git clone git@github.com:[YOUR-USERNAME]/houseiana.git .

# Navigate to web directory
cd web

# Install dependencies
pnpm install

# Create production .env file
nano .env.production
```

Add to `.env.production`:
```env
# Database - Using your RDS endpoint
DATABASE_URL='postgresql://[username]:[password]@database-1houseiana.c9qywii4wmqh.eu-north-1.rds.amazonaws.com:5432/houseiana?sslmode=require'

# Security
JWT_SECRET="[generate-a-secure-32-char-string]"

# Email
RESEND_API_KEY="re_QhSfsBLL_CYFc9e1MbKoSLoRcEXomPCha"
RESEND_FROM_EMAIL="onboarding@resend.dev"

# App URL
NEXT_PUBLIC_APP_URL="http://[YOUR-EC2-PUBLIC-IP]"
# Later change to: https://yourdomain.com

# Node environment
NODE_ENV=production
```

## Step 4: Build and Test Application

```bash
# Generate Prisma client
pnpm prisma generate

# Push database schema (if not already done)
pnpm prisma db push

# Build the application
pnpm build

# Test the application
pnpm start
```

Visit `http://[YOUR-EC2-PUBLIC-IP]:3000` to test.

## Step 5: Setup PM2 Process Manager

Create PM2 configuration:

```bash
# Create ecosystem file
nano ecosystem.config.js
```

Add this configuration (it will be created in next step).

Then start with PM2:

```bash
# Start application with PM2
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd -u ubuntu --hp /home/ubuntu
# Run the command it outputs

# Check status
pm2 status
pm2 logs
```

## Step 6: Configure Nginx Reverse Proxy

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/houseiana
```

Add the configuration (will be created in next step).

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/houseiana /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Step 7: Setup SSL with Let's Encrypt (Optional but Recommended)

```bash
# For domain setup (replace with your domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts
# Choose to redirect HTTP to HTTPS
```

## Step 8: Connect RDS Database

Since your RDS is in the same VPC but not publicly accessible:

1. **Update RDS Security Group**:
   - Go to RDS console
   - Select your database
   - Click on security group (`sg-040512a68fd1abc8a`)
   - Add inbound rule:
     - Type: PostgreSQL
     - Port: 5432
     - Source: Your EC2 security group ID

2. **Test connection from EC2**:
```bash
# Test database connection
psql -h database-1houseiana.c9qywii4wmqh.eu-north-1.rds.amazonaws.com -U [username] -d houseiana -p 5432
```

## Step 9: Setup Monitoring

```bash
# Monitor application
pm2 monit

# View logs
pm2 logs

# Check Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Step 10: Setup Auto-deployment (GitHub Actions)

Create `.github/workflows/deploy.yml` in your repository (will be created in next step).

## Useful Commands

```bash
# Restart application
pm2 restart houseiana

# Pull latest changes and redeploy
cd /var/www/houseiana/web
git pull
pnpm install
pnpm build
pm2 restart houseiana

# Check system resources
htop
df -h

# Check application logs
pm2 logs houseiana --lines 100

# Nginx commands
sudo systemctl status nginx
sudo systemctl restart nginx
```

## Security Checklist

- [ ] Update all system packages regularly
- [ ] Configure firewall (ufw)
- [ ] Use strong passwords
- [ ] Setup fail2ban for SSH protection
- [ ] Enable automatic security updates
- [ ] Use SSL certificates
- [ ] Restrict database access to EC2 only
- [ ] Regular backups of database and files
- [ ] Monitor server logs
- [ ] Setup CloudWatch alarms

## Cost Optimization

- Use Reserved Instances for long-term savings
- Setup auto-scaling if needed
- Use CloudFront CDN for static assets
- Consider using RDS Proxy for connection pooling
- Setup billing alerts

## Troubleshooting

**Application not starting:**
```bash
pm2 logs
pm2 describe houseiana
```

**502 Bad Gateway:**
- Check if app is running: `pm2 status`
- Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`

**Database connection issues:**
- Check security groups
- Verify credentials
- Test with psql client

**High memory usage:**
- Check with `htop`
- Restart PM2: `pm2 restart all`
- Consider upgrading instance type