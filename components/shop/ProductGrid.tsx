'use client'

import { useCart } from '@/contexts/CartContext' 

interface Product {
  id: string
  name: string
  price: number
  image_url: string
  category_name: string
  category_slug?: string
}

export function ProductGrid({ products }: { products: Product[] }) {
  const { addToCart } = useCart()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Showing 500 products</span>
        <span>Default sorting</span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map(product => (
          <article
            key={product.id}
            className="border border-slate-200 rounded-md bg-white flex flex-col"
          >
            <div className="h-40 w-full bg-slate-50 flex items-center justify-center overflow-hidden">
              <img
                src={
                  product.image_url ||
                  `https://placehold.co/300x200/f9fafb/cbd5f5?text=${encodeURIComponent(
                    product.name.slice(0, 10)
                  )}`
                }
                alt={product.name}
                className="h-28 object-contain"
                loading="lazy"
              />
            </div>
            <div className="px-4 py-3 flex-1 flex flex-col justify-between gap-2">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                  {product.category_name}
                </p>
                <p className="text-xs text-slate-700">{product.name}</p>
                <p className="text-xs font-semibold text-slate-900">
                  ${product.price.toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => addToCart(product.id)}
                className="mt-2 w-full text-[11px] font-medium text-white bg-slate-900 hover:bg-slate-800 py-2 rounded-sm"
              >
                Add to cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
