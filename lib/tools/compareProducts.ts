import { createSupabaseServerClient } from '@/lib/supabase-server';

interface CompareProductsParams {
  productIds: string[];
}

export async function compareProducts(params: CompareProductsParams) {
  const supabase = createSupabaseServerClient();
  
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      description,
      price,
      image_url,
      category_id,
      categories (
        name,
        slug
      )
    `)
    .in('id', params.productIds.slice(0, 2))
    .limit(2);

  if (error || !products || products.length < 2) {
    return {
      products: [],
      comparison: null,
      message: 'Need exactly 2 valid product IDs to compare',
      error: true
    };
  }

  const [product1, product2] = products;
  
  return {
    products,
    comparison: {
      cheaper: product1.price < product2.price ? product1 : product2,
      expensive: product1.price > product2.price ? product1 : product2,
      priceDifference: Math.abs(product1.price - product2.price),
    },
    message: 'Comparison complete',
    error: false
  };
}
