import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/tools/getProducts';

export async function GET() {
  const result = await getProducts({ maxPrice: 100 });
  return NextResponse.json(result);
}
