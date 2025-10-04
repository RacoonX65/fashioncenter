import { supabase } from './supabase';

const BUCKET_NAME = 'product-images';
const BANNER_BUCKET_NAME = 'banners';

/**
 * Initialize storage buckets (run this once in your Supabase dashboard or via migration)
 */
export async function initializeBuckets() {
  // Create product images bucket
  const { error: productBucketError } = await supabase.storage.createBucket(BUCKET_NAME, {
    public: true,
    fileSizeLimit: 52428800, // 50MB
  });

  if (productBucketError && productBucketError.message !== 'Bucket already exists') {
    console.error('Product bucket creation error:', productBucketError);
  }

  // Create banners bucket
  const { error: bannerBucketError } = await supabase.storage.createBucket(BANNER_BUCKET_NAME, {
    public: true,
    fileSizeLimit: 52428800, // 50MB
  });

  if (bannerBucketError && bannerBucketError.message !== 'Bucket already exists') {
    console.error('Banner bucket creation error:', bannerBucketError);
  }
}

/**
 * Compress and optimize image before upload
 */
async function compressImage(file: File, maxSizeKB: number = 300): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions (max 1200px width)
        let width = img.width;
        let height = img.height;
        const maxWidth = 1200;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Try different quality levels to hit target size
        let quality = 0.8;
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Compression failed'));
            }
          },
          'image/jpeg',
          quality
        );
      };
    };
    reader.onerror = reject;
  });
}

/**
 * Upload a product image
 * @param file - The image file to upload
 * @param productId - The product ID for organizing images
 * @param imageIndex - The index of the image (for multiple images per product)
 */
export async function uploadProductImage(
  file: File,
  productId: string,
  imageIndex: number = 0
): Promise<{ url: string | null; error: string | null }> {
  try {
    // Compress image before upload
    const compressedFile = await compressImage(file);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}/image-${imageIndex}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, compressedFile, {
        cacheControl: '3600',
        upsert: true, // Replace if exists
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return { url: urlData.publicUrl, error: null };
  } catch (error: any) {
    console.error('Upload error:', error);
    return { url: null, error: error.message };
  }
}

/**
 * Upload multiple product images
 */
export async function uploadProductImages(
  files: File[],
  productId: string
): Promise<{ urls: string[]; errors: string[] }> {
  const urls: string[] = [];
  const errors: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const result = await uploadProductImage(files[i], productId, i);
    if (result.url) {
      urls.push(result.url);
    }
    if (result.error) {
      errors.push(result.error);
    }
  }

  return { urls, errors };
}

/**
 * Upload a banner image
 */
export async function uploadBannerImage(
  file: File,
  bannerId: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    // Compress banner image (can be slightly larger)
    const compressedFile = await compressImage(file, 500);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `banner-${bannerId}.${fileExt}`;
    const filePath = `banners/${fileName}`;

    const { data, error } = await supabase.storage
      .from(BANNER_BUCKET_NAME)
      .upload(filePath, compressedFile, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BANNER_BUCKET_NAME)
      .getPublicUrl(filePath);

    return { url: urlData.publicUrl, error: null };
  } catch (error: any) {
    console.error('Banner upload error:', error);
    return { url: null, error: error.message };
  }
}

/**
 * Delete a product image
 */
export async function deleteProductImage(
  productId: string,
  imageIndex: number
): Promise<{ error: string | null }> {
  try {
    const filePath = `products/${productId}/image-${imageIndex}.*`;
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Delete all images for a product
 */
export async function deleteAllProductImages(
  productId: string
): Promise<{ error: string | null }> {
  try {
    const { data: files, error: listError } = await supabase.storage
      .from(BUCKET_NAME)
      .list(`products/${productId}`);

    if (listError) throw listError;

    if (files && files.length > 0) {
      const filePaths = files.map(file => `products/${productId}/${file.name}`);
      const { error: deleteError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove(filePaths);

      if (deleteError) throw deleteError;
    }

    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Get storage usage info
 */
export async function getStorageInfo() {
  try {
    // This requires admin access - typically you'd check this via Supabase dashboard
    // For reference: Free plan has 1GB total storage
    return {
      totalLimit: 1024 * 1024 * 1024, // 1GB in bytes
      message: 'Check Supabase dashboard for actual usage'
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

export default {
  uploadProductImage,
  uploadProductImages,
  uploadBannerImage,
  deleteProductImage,
  deleteAllProductImages,
  getStorageInfo,
};

