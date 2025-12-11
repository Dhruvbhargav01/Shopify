import { createSupabaseServerClient } from "@/lib/supabase-server"
import Navbar from "@/components/layout/Navbar"
import { SidebarFilters } from "@/components/shop/SidebarFilters"
import { CategoryStrip } from "@/components/shop/CategoryStrip"
import { ProductGrid } from "@/components/shop/ProductGrid"

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const supabase = createSupabaseServerClient()
  const resolvedParams = await searchParams

  const minPrice = Number(resolvedParams.minPrice) || 0
  const maxPrice = Number(resolvedParams.maxPrice) || 2500
  const categorySlug = resolvedParams.category as string | undefined
  const queryText =
    typeof resolvedParams.q === "string" ? resolvedParams.q.trim() : ""

  let productsQuery = supabase
    .from("products")
    .select(
      `
      id,
      name,
      price,
      image_url,
      category_id,
      categories(name, slug)
    `
    )
    .order("created_at", { ascending: false })
    .limit(500)

  if (minPrice > 0) productsQuery = productsQuery.gte("price", minPrice)
  if (maxPrice < 2500) productsQuery = productsQuery.lte("price", maxPrice)

  if (categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single()
    if (category?.id) productsQuery = productsQuery.eq("category_id", category.id)
  }

  if (queryText) {
    productsQuery = productsQuery.ilike("name", `%${queryText}%`)
  }

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("categories").select("id, name, slug").order("name"),
    productsQuery
  ])

  const shapedProducts =
    products?.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      image_url: p.image_url,
      category_name: p.categories?.name ?? "Uncategorized",
      category_slug: p.categories?.slug ?? ""
    })) ?? []

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 lg:px-0 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <div className="h-72 w-full bg-slate-800 rounded-md overflow-hidden">
                <div className="h-full w-full bg-[url('https://images.pexels.com/photos/1571469/pexels-photo-1571469.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center" />
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="flex-1 bg-slate-900 text-white rounded-md p-6 flex flex-col justify-center">
                <p className="text-[11px] uppercase tracking-[0.2em] mb-1">
                  Divine Elegance
                </p>
                <h2 className="text-xl font-semibold mb-2">
                  Timeless scents that capture charm and sophistication.
                </h2>
                <button className="mt-3 inline-flex items-center justify-center px-4 py-2 text-[11px] font-medium rounded-sm bg-slate-50 text-slate-900">
                  Shop Now
                </button>
              </div>
              <div className="flex-1 bg-[#b19373] rounded-md overflow-hidden">
                <div className="h-full w-full bg-[url('https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 lg:px-0 py-10">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
                Home / Shop
              </p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                Shop
              </h2>
              <p className="mt-1">
                Showing {shapedProducts.length} products
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <SidebarFilters
              minPrice={minPrice}
              maxPrice={maxPrice}
              categories={categories ?? []}
              currentCategory={categorySlug}
            />
            <section className="lg:col-span-9 space-y-5">
              <CategoryStrip
                categories={categories ?? []}
                currentCategory={categorySlug}
              />
              <ProductGrid products={shapedProducts} />
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}


