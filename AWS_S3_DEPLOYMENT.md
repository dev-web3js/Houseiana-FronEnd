# AWS S3 Deployment Guide

## Prerequisites
- AWS CLI installed and configured
- AWS account with S3 access

## Step 1: Configure Next.js for Static Export
✅ **Already configured** - Your Next.js app is now set up for static export with:
- `output: 'export'` - Enables static HTML export
- `trailingSlash: true` - Ensures S3 routing works correctly
- `images: { unoptimized: true }` - Required for static export
- `distDir: 'dist'` - Output directory

## Step 2: Build Static Files
```bash
npm run build
```
This creates static files in the `dist` folder.

## Step 3: Create S3 Bucket
```bash
# Replace 'your-app-name' with your desired bucket name
aws s3 mb s3://your-app-name
```

## Step 4: Enable Static Website Hosting
```bash
aws s3 website s3://your-app-name --index-document index.html --error-document 404.html
```

## Step 5: Set Bucket Policy for Public Access
Create a bucket policy file `bucket-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-app-name/*"
    }
  ]
}
```

Apply the policy:
```bash
aws s3api put-bucket-policy --bucket your-app-name --policy file://bucket-policy.json
```

## Step 6: Upload Files to S3
```bash
aws s3 sync dist/ s3://your-app-name --delete
```

## Step 7: Access Your App
Your app will be available at:
```
http://your-app-name.s3-website-us-east-1.amazonaws.com
```
(Replace `us-east-1` with your AWS region)

## Important Notes for Your App

⚠️ **Database Considerations**: Your app uses Prisma with a database. For S3 static hosting:
- Database connections won't work in static export
- API routes (`/api/*`) won't work
- Consider using:
  - External API services
  - Serverless functions (AWS Lambda)
  - Client-side authentication services

## Automated Deployment Script
Create `deploy-s3.sh`:
```bash
#!/bin/bash
BUCKET_NAME="your-app-name"

echo "Building Next.js app..."
npm run build

echo "Uploading to S3..."
aws s3 sync dist/ s3://$BUCKET_NAME --delete

echo "Deployment complete!"
echo "Visit: http://$BUCKET_NAME.s3-website-us-east-1.amazonaws.com"
```

Make it executable:
```bash
chmod +x deploy-s3.sh
```

## Alternative: Use AWS Amplify
For full-stack Next.js apps with API routes and database, consider AWS Amplify instead of S3, as it supports server-side rendering and API routes.