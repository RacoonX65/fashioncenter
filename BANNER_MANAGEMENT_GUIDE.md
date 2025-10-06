# Banner Management System

## Overview
The Banner Management System allows you to create and manage promotional banners that appear on your homepage. You can control banner images, text, links, visibility, and scheduling.

## Features

✅ **CRUD Operations**: Create, Read, Update, and Delete banners
✅ **Image Upload**: Upload banner images with automatic compression
✅ **Scheduling**: Set start and end dates for banners (optional)
✅ **Position Control**: Order banners by position number
✅ **Active/Inactive Toggle**: Control banner visibility
✅ **Call-to-Action**: Custom button text and link URLs
✅ **Responsive Design**: Banners adapt to all screen sizes

---

## Accessing Banner Management

### Admin Dashboard Route
Navigate to: **`/admin/banners`**

Or from the admin dashboard sidebar:
1. Go to `/admin`
2. Click on **"Banners"** under the MARKETING section

---

## Creating a Banner

### Step 1: Open the Banner Modal
Click the **"Add Banner"** button in the top right corner

### Step 2: Fill in Banner Details

#### Required Fields:
- **Banner Title**: The main headline text (e.g., "Summer Sale 2024")
- **Banner Image**: Upload an image (recommended size: 1920x600px)
  - Supported formats: JPG, PNG, WEBP
  - Images are automatically compressed for web performance

#### Optional Fields:
- **Subtitle**: Supporting text (e.g., "Up to 50% off all items")
- **Link URL**: Where the banner should link to (e.g., `/products?category=sale`)
- **Button Text**: Text for the call-to-action button (default: "Shop Now")
- **Position**: Display order (lower numbers appear first)
- **Status**: Active/Inactive checkbox
- **Start Date**: When the banner should start showing (optional)
- **End Date**: When the banner should stop showing (optional)

### Step 3: Upload Image
1. Click the image upload area
2. Select an image from your computer
3. Wait for the preview to appear
4. The image will be uploaded when you click "Create Banner"

### Step 4: Save
Click **"Create Banner"** to save

---

## Banner Display Logic

### Homepage Display:
- **Position 1**: Main hero banner (full width, large)
- **Positions 2-4**: Promotional banners (3-column grid below hero)
- Only **active** banners are displayed
- Banners respect start/end date ranges

### Example Homepage Layout:
```
┌─────────────────────────────────────┐
│   HERO BANNER (Position 1)          │
│   Full width, overlay text           │
└─────────────────────────────────────┘

┌───────────┬───────────┬───────────┐
│  Banner 2 │  Banner 3 │  Banner 4 │
│  Promo    │  Promo    │  Promo    │
└───────────┴───────────┴───────────┘
```

---

## Editing a Banner

1. Navigate to `/admin/banners`
2. Find the banner you want to edit
3. Click the **"Edit"** button
4. Modify any fields
5. Click **"Update Banner"**

### Notes:
- You can upload a new image to replace the existing one
- If you don't upload a new image, the original will be kept
- Changes take effect immediately

---

## Activating/Deactivating a Banner

### Quick Toggle:
1. Find the banner in the list
2. Click the **"Activate"** or **"Deactivate"** button
3. The banner will immediately show/hide on the homepage

### Use Cases:
- **Deactivate**: Temporarily hide a banner without deleting it
- **Activate**: Show a previously hidden banner
- **Scheduling**: Use start/end dates for automatic activation/deactivation

---

## Deleting a Banner

1. Navigate to `/admin/banners`
2. Find the banner you want to delete
3. Click the **"Delete"** button
4. Confirm the deletion

⚠️ **Warning**: Deletion is permanent. Consider deactivating instead if you might need the banner later.

---

## Banner Scheduling

### Automatic Show/Hide by Date

#### Example: Holiday Sale Banner
- **Start Date**: 2024-12-20
- **End Date**: 2024-12-31
- **Status**: Active

This banner will:
- Not show before December 20, 2024
- Show from December 20-31, 2024
- Automatically hide after December 31, 2024

### Use Cases:
- Seasonal sales (Summer, Black Friday, etc.)
- Limited-time promotions
- Event announcements
- Holiday specials

---

## Best Practices

### Image Guidelines:
- **Recommended Size**: 1920x600px (hero), 800x600px (promos)
- **File Format**: JPG or PNG
- **File Size**: Under 2MB (will be compressed automatically)
- **Aspect Ratio**: 16:9 for hero, 4:3 for promos
- **Quality**: High resolution, but not over-optimized

### Content Guidelines:
- **Keep titles short**: 3-7 words for maximum impact
- **Clear CTA**: Use action words (Shop, Discover, Explore)
- **Contrast**: Ensure text is readable on your image
- **Mobile-first**: Consider how it looks on small screens

### Performance:
- Don't have too many active banners (3-5 max)
- Use compressed images (handled automatically)
- Schedule banners instead of creating many inactive ones

---

## Technical Details

### API Endpoints:
- `GET /api/banners` - Fetch all banners
- `GET /api/banners?active=true` - Fetch only active banners
- `POST /api/banners` - Create a new banner
- `PATCH /api/banners/[id]` - Update a banner
- `DELETE /api/banners/[id]` - Delete a banner

### Database Table: `banners`
```sql
- id (uuid)
- title (text)
- subtitle (text, optional)
- image_url (text)
- link_url (text, optional)
- button_text (text)
- position (integer)
- is_active (boolean)
- start_date (timestamp, optional)
- end_date (timestamp, optional)
- created_at (timestamp)
- updated_at (timestamp)
```

### Storage:
- Bucket: `banners`
- Path: `banners/banner-{id}.{ext}`
- Public access: Yes
- Max file size: 50MB (but compressed to much smaller)

---

## Troubleshooting

### Banner Not Showing on Homepage?
- ✅ Check if banner is set to **Active**
- ✅ Verify start/end dates (if set)
- ✅ Ensure banner has a valid image URL
- ✅ Check browser console for errors

### Image Not Uploading?
- ✅ Check file size (should be under 50MB)
- ✅ Use supported formats (JPG, PNG, WEBP)
- ✅ Verify Supabase storage bucket exists
- ✅ Check Supabase credentials in `.env.local`

### Banner Position Not Changing?
- Make sure to set different position numbers
- Lower numbers appear first
- Refresh the page to see changes

---

## Examples

### Example 1: Hero Banner
```
Title: "Summer Collection 2025"
Subtitle: "Fresh styles for the new season"
Link: /products?new=true
Button: "Explore Now"
Position: 1
Active: ✓
```

### Example 2: Sale Banner
```
Title: "End of Season Sale"
Subtitle: "Up to 70% off selected items"
Link: /products?sale=true
Button: "Shop Sale"
Position: 2
Active: ✓
Start Date: 2025-01-15
End Date: 2025-01-31
```

### Example 3: Category Promo
```
Title: "New Arrivals"
Subtitle: "Check out what's trending"
Link: /products?category=women
Button: "Shop Women"
Position: 3
Active: ✓
```

---

## Integration with Marketing

### Cross-Promotion:
- Link banners to discount codes
- Promote specific product categories
- Highlight new arrivals or featured collections

### Analytics Tracking:
You can add UTM parameters to banner links:
```
/products?category=sale&utm_source=homepage&utm_medium=banner&utm_campaign=summer_sale
```

---

## Support

For technical issues:
1. Check Supabase logs for storage/database errors
2. Review browser console for frontend errors
3. Verify environment variables are set correctly

Need help? Check:
- `SETUP_GUIDE.md` for Supabase configuration
- `SUPABASE_SETUP.md` for storage bucket setup
- Admin dashboard for real-time status

---

## Quick Start Checklist

- [ ] Create Supabase storage bucket named `banners`
- [ ] Set bucket to public access
- [ ] Navigate to `/admin/banners`
- [ ] Click "Add Banner"
- [ ] Upload hero image (1920x600px)
- [ ] Set title and subtitle
- [ ] Set position to 1
- [ ] Click "Create Banner"
- [ ] Visit homepage to see your banner!

---

**Ready to create stunning banners? Head to `/admin/banners` and get started!** 🎨

