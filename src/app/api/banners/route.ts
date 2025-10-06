import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/banners
 * Fetch all banners or only active ones
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    
    let query = supabase
      .from('banners')
      .select('*')
      .order('position', { ascending: true });
    
    // Filter by active status if requested
    if (activeOnly) {
      query = query.eq('is_active', true);
      
      // Also check date range if set
      const now = new Date().toISOString();
      query = query.or(`start_date.is.null,start_date.lte.${now}`)
                   .or(`end_date.is.null,end_date.gte.${now}`);
    }
    
    const { data: banners, error } = await query;
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch banners' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ banners: banners || [] });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/banners
 * Create a new banner
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { title, image_url } = body;
    
    if (!title || !image_url) {
      return NextResponse.json(
        { error: 'Missing required fields: title, image_url' },
        { status: 400 }
      );
    }
    
    // Get the highest position number and add 1
    const { data: maxPositionBanner } = await supabase
      .from('banners')
      .select('position')
      .order('position', { ascending: false })
      .limit(1)
      .single();
    
    const nextPosition = maxPositionBanner ? maxPositionBanner.position + 1 : 1;
    
    // Insert banner
    const { data: banner, error } = await supabase
      .from('banners')
      .insert([
        {
          title: body.title,
          subtitle: body.subtitle || null,
          image_url: body.image_url,
          link_url: body.link_url || null,
          button_text: body.button_text || 'Shop Now',
          position: body.position || nextPosition,
          is_active: body.is_active !== undefined ? body.is_active : true,
          start_date: body.start_date || null,
          end_date: body.end_date || null,
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create banner' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ banner }, { status: 201 });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

