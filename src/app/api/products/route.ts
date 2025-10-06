import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/products
 * Fetch all products with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const onSale = searchParams.get('sale');
    const isNew = searchParams.get('new');
    const limit = searchParams.get('limit') || '50';
    
    // Build query
    let query = supabase
      .from('products')
      .select('*')
      .gt('stock', 0) // Only show products in stock
      .order('created_at', { ascending: false });
    
    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }
    
    if (featured === 'true') {
      query = query.eq('featured', true);
    }
    
    if (onSale === 'true') {
      query = query.eq('on_sale', true);
    }
    
    if (isNew === 'true') {
      query = query.eq('is_new', true);
    }
    
    // Apply limit
    query = query.limit(parseInt(limit));
    
    const { data: products, error } = await query;
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Create a new product (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { name, description, category, price, stock } = body;
    
    if (!name || !category || !price) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, price' },
        { status: 400 }
      );
    }
    
    // Insert product
    const { data: product, error } = await supabase
      .from('products')
      .insert([
        {
          name,
          description,
          category,
          price,
          bulk_price: body.bulk_price || price * 0.8, // Default 20% bulk discount
          bulk_threshold: body.bulk_threshold || 5,
          stock: stock || 0,
          images: body.images || [],
          sizes: body.sizes || [],
          colors: body.colors || [],
          featured: body.featured || false,
          is_new: body.is_new || false,
          on_sale: body.on_sale || false,
          sale_price: body.sale_price || null,
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

