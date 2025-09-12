# AWS RDS PostgreSQL Database Setup

## Database Connection Details

Your AWS RDS instance details:
- **Endpoint**: `database-1houseiana.c9qywii4wmqh.eu-north-1.rds.amazonaws.com`
- **Port**: `5432`
- **Region**: `eu-north-1`
- **Availability Zone**: `eu-north-1b`

## Important: Update Database Credentials

**You need to update the `.env` file with your actual database credentials:**

1. Open `.env` file
2. Replace the DATABASE_URL with your actual credentials:

```
DATABASE_URL='postgresql://[username]:[password]@database-1houseiana.c9qywii4wmqh.eu-north-1.rds.amazonaws.com:5432/[database_name]?sslmode=require'
```

Replace:
- `[username]` - Your RDS master username (usually 'postgres' or custom)
- `[password]` - Your RDS master password
- `[database_name]` - Your database name (e.g., 'houseiana')

Example:
```
DATABASE_URL='postgresql://postgres:MySecurePassword123@database-1houseiana.c9qywii4wmqh.eu-north-1.rds.amazonaws.com:5432/houseiana?sslmode=require'
```

## Security Notice

⚠️ **Your RDS instance is NOT publicly accessible** (`Publicly accessible: No`)

This means you can only connect to it from:
1. Within the same VPC (vpc-0a06fec59136d0102)
2. From EC2 instances in the same security group
3. Through a bastion host or VPN connection
4. Using AWS RDS Proxy

## To Make Database Publicly Accessible (For Development)

If you need to connect from your local machine:

1. Go to AWS RDS Console
2. Select your database instance
3. Click "Modify"
4. Under "Connectivity", change "Public access" to "Yes"
5. Update Security Group (sg-040512a68fd1abc8a) to allow inbound PostgreSQL traffic:
   - Add inbound rule for port 5432
   - Source: Your IP address or 0.0.0.0/0 (less secure)
6. Apply changes immediately

## Run Database Migrations

After setting up the connection:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Or run migrations
npx prisma migrate deploy
```

## Connection Troubleshooting

If you get connection errors:

1. **Check credentials**: Ensure username/password are correct
2. **Check network access**: Verify RDS is publicly accessible if connecting from local
3. **Check security group**: Ensure port 5432 is open for your IP
4. **Check SSL**: AWS RDS requires SSL, ensure `sslmode=require` is in the connection string
5. **Check database exists**: Make sure the database name in the URL exists

## Production Deployment

For production deployment on AWS:

1. Deploy your Next.js app to AWS (EC2, ECS, or Amplify)
2. Ensure the deployment is in the same VPC or has proper network access
3. Use AWS Secrets Manager or Parameter Store for credentials
4. Consider using RDS Proxy for connection pooling

## Environment Variables for AWS

Additional AWS-specific environment variables you might need:

```env
# AWS Region
AWS_REGION=eu-north-1

# If using IAM authentication (optional)
AWS_RDS_IAM_AUTH=false

# Connection pool size (optional)
DATABASE_CONNECTION_LIMIT=10

# SSL Certificate (if needed)
DATABASE_SSL_CERT=/path/to/rds-ca-2019-root.pem
```

## Important Security Notes

1. **Never commit `.env` file to Git**
2. **Use strong passwords** for database access
3. **Rotate credentials regularly**
4. **Use IAM authentication** for production
5. **Enable encryption** at rest and in transit
6. **Set up automated backups** in RDS console