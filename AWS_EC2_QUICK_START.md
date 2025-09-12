# 🚀 AWS EC2 Quick Start Guide for Houseiana

## Prerequisites
- AWS Account with EC2 access
- Your RDS database credentials
- Domain name (optional, for SSL)

## 📋 Step-by-Step EC2 Setup

### 1️⃣ Launch EC2 Instance

Go to AWS Console → EC2 → Launch Instance:

| Setting | Value |
|---------|-------|
| **Name** | houseiana-production |
| **OS** | Ubuntu Server 22.04 LTS |
| **Instance Type** | t3.medium (production) or t3.small (testing) |
| **Key Pair** | Create new → Save .pem file |
| **VPC** | Same as RDS: `vpc-0a06fec59136d0102` |
| **Security Group** | Create new with rules below |

**Security Group Rules:**
```
SSH (22) → Your IP
HTTP (80) → 0.0.0.0/0
HTTPS (443) → 0.0.0.0/0
Custom TCP (3000) → Your IP (testing)
```

### 2️⃣ Connect to Instance

```bash
# Windows (use Git Bash or WSL)
chmod 400 houseiana-key.pem
ssh -i "houseiana-key.pem" ubuntu@[EC2-PUBLIC-IP]
```

### 3️⃣ Run Setup Script

Once connected to EC2:

```bash
# Download and run setup script
curl -o setup.sh https://raw.githubusercontent.com/YOUR-REPO/main/scripts/ec2-setup.sh
chmod +x setup.sh
./setup.sh
```

### 4️⃣ Clone Your Repository

```bash
cd /var/www/houseiana
git clone https://github.com/YOUR-USERNAME/houseiana.git .
cd web
```

### 5️⃣ Configure Environment

```bash
# Create production environment file
nano .env.production
```

Add your credentials:
```env
DATABASE_URL='postgresql://[username]:[password]@database-1houseiana.c9qywii4wmqh.eu-north-1.rds.amazonaws.com:5432/houseiana?sslmode=require'
JWT_SECRET="[generate-32-char-string]"
RESEND_API_KEY="re_QhSfsBLL_CYFc9e1MbKoSLoRcEXomPCha"
RESEND_FROM_EMAIL="onboarding@resend.dev"
NEXT_PUBLIC_APP_URL="http://[EC2-PUBLIC-IP]"
NODE_ENV=production
```

### 6️⃣ Build and Start Application

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma generate

# Push database schema
pnpm prisma db push

# Build application
pnpm build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
```

### 7️⃣ Setup Nginx

```bash
# Copy nginx config
sudo cp nginx/houseiana.conf /etc/nginx/sites-available/houseiana

# Enable site
sudo ln -s /etc/nginx/sites-available/houseiana /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

### 8️⃣ Configure RDS Access

In AWS RDS Console:
1. Go to your database security group
2. Add inbound rule:
   - Type: PostgreSQL
   - Port: 5432
   - Source: Your EC2 security group

### 9️⃣ Test Your Application

```bash
# Check PM2 status
pm2 status

# Check application logs
pm2 logs

# Test locally
curl http://localhost:3000/api/health

# Test from browser
http://[EC2-PUBLIC-IP]
```

## 🔒 Setup SSL (Optional)

For domain with SSL:

```bash
# Point your domain to EC2 IP first, then:
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 📝 GitHub Secrets for CI/CD

Add these secrets in your GitHub repository:

| Secret Name | Value |
|------------|-------|
| `EC2_HOST` | Your EC2 public IP |
| `EC2_USERNAME` | ubuntu |
| `EC2_SSH_KEY` | Contents of your .pem file |
| `DATABASE_URL` | Your full database connection string |

## 🛠 Common Commands

```bash
# View logs
pm2 logs houseiana

# Restart app
pm2 restart houseiana

# Deploy updates
cd /var/www/houseiana/web
./scripts/deploy.sh

# Monitor resources
htop
pm2 monit

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
```

## 🚨 Troubleshooting

**App not running?**
```bash
pm2 status
pm2 logs --lines 50
```

**502 Bad Gateway?**
```bash
# Check if app is running on port 3000
pm2 restart houseiana
sudo systemctl restart nginx
```

**Database connection error?**
- Check RDS security group
- Verify credentials in .env.production
- Test with: `psql -h [RDS-ENDPOINT] -U [username] -d houseiana`

## 💰 Cost Optimization

- **Instance**: t3.medium = ~$30/month
- **Storage**: 20GB = ~$2/month
- **Data Transfer**: First 100GB free
- **Total**: ~$32-40/month

**Save money:**
- Use Reserved Instances (save 40%)
- Stop instance when not needed
- Use t3.small for testing

## ✅ Final Checklist

- [ ] EC2 instance running
- [ ] Application accessible via browser
- [ ] Database connected
- [ ] PM2 managing application
- [ ] Nginx configured
- [ ] Security groups configured
- [ ] Monitoring setup
- [ ] Backup strategy planned
- [ ] SSL certificate (if using domain)
- [ ] GitHub Actions configured

---

**Need help?** Check the detailed guide: `AWS_EC2_DEPLOYMENT.md`