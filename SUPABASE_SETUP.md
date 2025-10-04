# Supabase Setup Guide for FashionCenter

## Overview
This guide will help you set up Supabase for your FashionCenter e-commerce store.

## Free Plan Limits
- **Database**: 500MB PostgreSQL database
- **Storage**: 1GB for files (images, documents, etc.)
- **File Upload Size**: 50MB per file
- **Bandwidth**: 2GB per month
- **API Requests**: Unlimited
- **Monthly Active Users**: 50,000

## Storage Optimization for Images

### Product Images
With 1GB storage, you can optimize your usage:

**Recommended Image Sizes:**
- Product images: 200-300KB each (compressed JPEG)
- Banner images: 300-500KB each
- Thumbnail images: 50-100KB each

**Capacity Estimates:**
- At 250KB per product image: ~4,000 images
- With 5 images per product: ~800 products
- Plus 20 banners at 400KB: 8MB

**Total realistic capacity:**
- **150-200 products** with 5 images each
- **15-20 promotional banners**
- Room for growth and other assets

### Image Optimization Tips
1. Use JPEG format for photos (better compression)
2. Use PNG only for logos/graphics with transparency
3. Compress images before upload using tools like:
   - TinyPNG (https://tinypng.com)
   - Squoosh (https://squoosh.app)
   - ImageOptim (Mac)
4. The built-in `compressImage()` function in our code automatically optimizes images

## Step-by-Step Setup

### 1. Create a Supabase Account
1. Go to https://supabase.com
2. Sign up for a free account
3. Create a new project

### 2. Get Your API Keys
1. Go to Project Settings > API
2. Copy the following:
   - `NEXT_PUBLIC_SUPABASE_URL` (Project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon/public key)

### 3. Set Up Environment Variables
1. In your project, rename `.env.example` to `.env.local`
2. Add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Create Database Tables
1. Go to Supabase Dashboard > SQL Editor
2. Copy the contents of `database/schema.sql`
3. Run the SQL script to create all tables

### 5. Set Up Storage Buckets
1. Go to Storage in your Supabase dashboard
2. Create two public buckets:
   - `product-images` (for product photos)
   - `banners` (for promotional banners)
3. Set policies to allow public read access

### 6. Configure Storage Policies
For each bucket, add the following policies:

**Public Read Access:**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );
```

**Authenticated Upload:**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );
```

### 7. Enable Authentication
1. Go to Authentication > Providers
2. Enable Email authentication (enabled by default)
3. Optionally, enable social logins (Google, Facebook, etc.)

### 8. Configure Email Templates
1. Go to Authentication > Email Templates
2. Customize:
   - Confirm signup email
   - Reset password email
   - Magic link email

## Testing Your Setup

### Test Database Connection
```bash
npm run dev
# Visit http://localhost:3000
# Try signing up and signing in
```

### Test Image Upload
1. Log into the admin dashboard at `/admin`
2. Try adding a product with images
3. Verify images appear in Supabase Storage

## Monitoring Storage Usage

### Via Supabase Dashboard
1. Go to Settings > Usage
2. Check Storage section
3. Monitor your 1GB limit

### Best Practices
- Regularly audit unused images
- Delete old/unused product images
- Consider upgrading to Pro plan ($25/month) if you exceed limits:
  - 8GB database
  - 100GB file storage
  - 250GB bandwidth

## Upgrading Storage (Optional)

If you need more storage:
1. **Pro Plan** ($25/month): 100GB storage
2. **Free alternatives**:
   - Use Cloudinary free tier (25GB storage)
   - Use imgix (free tier available)
   - Use external CDN for some images

## Security Best Practices

1. **Row Level Security (RLS)**
   - Enable RLS on all tables
   - Only allow users to access their own data
   - Example in `database/schema.sql`

2. **API Keys**
   - Never commit `.env.local` to git
   - Use environment variables in production
   - Rotate keys if compromised

3. **Storage Policies**
   - Limit upload sizes
   - Validate file types
   - Scan for malicious content

## Common Issues

### "Bucket already exists" Error
- Normal if buckets were created manually
- Safe to ignore

### Images not displaying
- Check bucket is set to public
- Verify storage policies
- Check CORS settings

### Upload failing
- Check file size (max 50MB)
- Verify user is authenticated
- Check storage quota

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Community: https://discord.supabase.com
- Stack Overflow: Tag [supabase]

## Next Steps

1. Upload your first product images
2. Test the authentication flow
3. Create promotional banners
4. Monitor your storage usage
5. Consider image optimization strategies

