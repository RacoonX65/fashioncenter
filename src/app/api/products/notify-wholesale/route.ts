/**
 * API Route: Notify wholesale customers about new products
 * POST /api/products/notify-wholesale
 */

import { NextRequest, NextResponse } from 'next/server';
import { notifyWholesaleCustomersNewProduct } from '@/lib/wholesale-product-notifications';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product } = body;

    if (!product || !product.id) {
      return NextResponse.json(
        { error: 'Product information is required' },
        { status: 400 }
      );
    }

    // Send notifications to all wholesale customers
    const result = await notifyWholesaleCustomersNewProduct(product);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Notifications sent to ${result.count} wholesale customers`,
        count: result.count,
        total: result.total
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send notifications' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in notify-wholesale API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

