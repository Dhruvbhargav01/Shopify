import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/tools/getProducts';
import { compareProducts } from '@/lib/tools/compareProducts';

export async function GET() {
  const productsResult = await getProducts({ limit: 2 });
  if (productsResult.products.length >= 2) {
    const result = await compareProducts({ 
      productIds: [productsResult.products[0].id.toString(), productsResult.products[1].id.toString()] 
    });
    return NextResponse.json(result);
  }
  return NextResponse.json({ error: 'Not enough products' });
}
