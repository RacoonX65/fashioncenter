import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * POST /api/reviews/upload-image
 * Upload an image for a review
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const reviewId = formData.get('reviewId') as string;

    if (!file || !reviewId) {
      return NextResponse.json(
        { error: 'File and review ID are required' },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image must be smaller than 5MB' },
        { status: 400 }
      );
    }

    // Check existing images count
    const { data: existingImages, error: countError } = await supabase
      .from('review_images')
      .select('id')
      .eq('review_id', reviewId);

    if (countError) {
      console.error('Error checking image count:', countError);
      return NextResponse.json(
        { error: 'Failed to check existing images' },
        { status: 500 }
      );
    }

    if (existingImages && existingImages.length >= 5) {
      return NextResponse.json(
        { error: 'Maximum 5 images per review' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${reviewId}_${timestamp}_${file.name}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('review-images')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('review-images')
      .getPublicUrl(uploadData.path);

    const imageUrl = urlData.publicUrl;

    // Save to database
    const { data: imageRecord, error: dbError } = await supabase
      .from('review_images')
      .insert({
        review_id: reviewId,
        image_url: imageUrl
      })
      .select()
      .single();

    if (dbError) {
      console.error('Error saving image record:', dbError);
      // Try to delete uploaded file
      await supabase.storage.from('review-images').remove([uploadData.path]);
      return NextResponse.json(
        { error: 'Failed to save image record' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      image: imageRecord
    });

  } catch (error: any) {
    console.error('Error in image upload:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

