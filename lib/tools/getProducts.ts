import { createSupabaseServerClient } from '@/lib/supabase-server';

interface GetProductsParams {
  categorySlug?: string;
  maxPrice?: number;
  minPrice?: number;
  searchTerm?: string;
  limit?: number;
}

export async function getProducts(params: GetProductsParams = {}) {
  const supabase = createSupabaseServerClient();

  let query = supabase
    .from('products')
    .select(`
      id,
      name,
      description,
      price,
      image_url,
      category_id,
      categories (
        id,
        name,
        slug
      )
    `)
    .limit(params.limit || 20)
    .order('price', { ascending: true });

  if (params.categorySlug) {
    query = query.eq('categories.slug', params.categorySlug);
  }

  if (params.maxPrice !== undefined) {
    query = query.lte('price', params.maxPrice);
  }

  if (params.minPrice !== undefined) {
    query = query.gte('price', params.minPrice);
  }

  if (params.searchTerm) {
    query = query.or(
      `name.ilike.%${params.searchTerm}%,description.ilike.%${params.searchTerm}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    return {
      products: [],
      count: 0,
      message: error.message,
      error: true
    };
  }

  return {
    products: data || [],
    count: data?.length || 0,
    message: `${data?.length || 0} products found`,
    error: false
  };
}
