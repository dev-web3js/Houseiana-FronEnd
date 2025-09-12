# 🌐 Domain Setup Guide: Connect www.houseiana.com to AWS EC2

## Current DNS Records to Update

Your domain **www.houseiana.com** currently points to `185.158.133.1`. We need to update it to point to your AWS EC2 instance.

## 📋 Step 1: Update DNS Records

### Required DNS Changes

Update these records in your domain registrar's DNS management panel:

| Type | Name | Points to | TTL | Action |
|------|------|-----------|-----|--------|
| **A** | @ | **56.228.34.198** | 300 | UPDATE (currently 185.158.133.1) |
| **A** | www | **56.228.34.198** | 300 | UPDATE (currently 185.158.133.1) |
| **CNAME** | www | ec2-56-228-34-198.eu-north-1.compute.amazonaws.com | 300 | ALTERNATIVE to A record |

### How to Update DNS Records:

1. **Login to your domain registrar** (where you registered houseiana.com)
2. **Find DNS Management** or "Manage DNS Records"
3. **Update the following:**

#### Update Root Domain (@):
- Find: A record for `@` pointing to `185.158.133.1`
- Change to: `56.228.34.198`

#### Update WWW Subdomain:
- Find: A record for `www` pointing to `185.158.133.1`  
- Change to: `56.228.34.198`

## 📋 Step 2: Configure EC2 for Domain

### On Your Windows EC2 Instance:

1. **Update Environment File** (`C:\Apps\Houseiana\web\.env.production`):
```env
NEXT_PUBLIC_APP_URL='https://www.houseiana.com'
```

2. **Update IIS Configuration** (if using IIS):

Create/Update `web.config`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <!-- Redirect non-www to www -->
                <rule name="Redirect to www" stopProcessing="true">
                    <match url=".*" />
                    <conditions>
                        <add input="{HTTP_HOST}" pattern="^houseiana.com$" />
                    </conditions>
                    <action type="Redirect" url="https://www.houseiana.com/{R:0}" redirectType="Permanent" />
                </rule>
                
                <!-- Proxy to Node.js -->
                <rule name="ReverseProxyInboundRule" stopProcessing="true">
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

3. **Configure IIS Site Bindings**:
   - Open IIS Manager
   - Right-click your site → Edit Bindings
   - Add binding for `www.houseiana.com` on port 80
   - Add binding for `houseiana.com` on port 80

## 📋 Step 3: Setup SSL Certificate (HTTPS)

### Option A: Using Let's Encrypt (Free SSL)

1. **Install Certbot for Windows**:
```powershell
# Download Win-ACME (Let's Encrypt client for Windows)
Invoke-WebRequest -Uri "https://github.com/win-acme/win-acme/releases/download/v2.2.7.1612/win-acme.v2.2.7.1612.x64.pluggable.zip" -OutFile "win-acme.zip"
Expand-Archive -Path "win-acme.zip" -DestinationPath "C:\win-acme"
```

2. **Generate SSL Certificate**:
```powershell
cd C:\win-acme
.\wacs.exe

# Follow the prompts:
# 1. Choose: Create certificate (full options)
# 2. Choose: Manual input
# 3. Enter: www.houseiana.com,houseiana.com
# 4. Choose: IIS
# 5. Choose: RSA key
# 6. Choose: IIS Central Certificate Store
```

### Option B: Using AWS Certificate Manager (ACM)

1. **Request Certificate in ACM**:
   - Go to AWS Certificate Manager
   - Request a public certificate
   - Add domain names: `www.houseiana.com` and `houseiana.com`
   - Choose DNS validation
   - Add the provided CNAME records to your DNS

2. **Use with Application Load Balancer** (Recommended for production):
   - Create an ALB in front of your EC2
   - Attach the ACM certificate to the ALB
   - Point your domain to the ALB instead of EC2 directly

## 📋 Step 4: Configure AWS Security Groups

Update your EC2 security group to ensure these ports are open:

| Type | Port | Source | Description |
|------|------|--------|-------------|
| HTTP | 80 | 0.0.0.0/0 | Web traffic |
| HTTPS | 443 | 0.0.0.0/0 | Secure web traffic |

## 📋 Step 5: Test Your Domain

After DNS propagation (5-30 minutes):

1. **Test HTTP**:
   - http://www.houseiana.com
   - http://houseiana.com

2. **Test HTTPS** (after SSL setup):
   - https://www.houseiana.com
   - https://houseiana.com

3. **Check DNS Propagation**:
```powershell
# From your computer
nslookup www.houseiana.com
# Should return: 56.228.34.198

ping www.houseiana.com
# Should ping: 56.228.34.198
```

## 📋 Step 6: Update Application Configuration

1. **Update all environment files**:
```env
NEXT_PUBLIC_APP_URL='https://www.houseiana.com'
```

2. **Rebuild and restart application**:
```powershell
cd C:\Apps\Houseiana\web
pnpm build
pm2 restart houseiana
```

## 🔧 Troubleshooting

### Domain not working after DNS update?
- DNS propagation can take up to 48 hours (usually 5-30 minutes)
- Clear your browser cache
- Try: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)

### SSL Certificate Issues?
- Ensure ports 80 and 443 are open in security groups
- Check IIS bindings include both HTTP and HTTPS
- Verify certificate is properly installed in IIS

### Site shows "Not Secure"?
- SSL certificate not installed
- Mixed content (HTTP resources on HTTPS page)
- Certificate expired or invalid

## 📊 DNS Propagation Check Tools

Check if your DNS changes have propagated:
- https://www.whatsmydns.net
- https://dnschecker.org
- https://www.nslookup.io

## ✅ Final Checklist

- [ ] DNS A records updated to `56.228.34.198`
- [ ] IIS configured with domain bindings
- [ ] SSL certificate installed
- [ ] Security groups allow HTTP/HTTPS
- [ ] Application environment updated
- [ ] Domain accessible via browser
- [ ] HTTPS redirect working
- [ ] All subdomains configured

## 🎯 Expected Results

Once everything is configured:

| URL | Should Redirect To | Status |
|-----|-------------------|--------|
| http://houseiana.com | https://www.houseiana.com | ✅ |
| http://www.houseiana.com | https://www.houseiana.com | ✅ |
| https://houseiana.com | https://www.houseiana.com | ✅ |
| https://www.houseiana.com | Your application | ✅ |

## 💡 Pro Tips

1. **Use Elastic IP**: Consider allocating an Elastic IP to your EC2 for a permanent IP address
2. **CloudFront CDN**: Add CloudFront for better global performance
3. **Route 53**: Consider using AWS Route 53 for DNS management
4. **Monitor uptime**: Use services like UptimeRobot or AWS CloudWatch

---

**Your domain www.houseiana.com will be live once DNS propagates!** 🚀