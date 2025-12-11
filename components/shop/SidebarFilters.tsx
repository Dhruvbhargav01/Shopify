
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

interface Category {
  id: string
  name: string
  slug: string
}

export function SidebarFilters({
  minPrice,
  maxPrice,
  categories,
  currentCategory
}: {
  minPrice: number
  maxPrice: number
  categories: Category[]
  currentCategory?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice])

  useEffect(() => {
    setPriceRange([minPrice, maxPrice])
  }, [minPrice, maxPrice])

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("minPrice", priceRange[0].toString())
    params.set("maxPrice", priceRange[1].toString())
    router.push(`/?${params.toString()}`)
  }

  const selectCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("q")
    if (params.get("category") === slug) {
      params.delete("category")
    } else {
      params.set("category", slug)
    }
    router.push(`/?${params.toString()}`)
  }

  const visibleCategories = categories.filter(
    (category) =>
      category.slug === 'beauty' ||
      category.slug === 'fragrances' ||
      category.slug === 'furniture' ||
      category.slug === 'groceries'
  )

  return (
    <aside className="lg:col-span-3 w-full">
      <div className="sticky top-24">
        <div className="rounded-md bg-white border border-slate-200 shadow-sm p-5 space-y-8 w-full">
          <div>
            <h2 className="text-sm font-semibold mb-3 text-slate-900">
              Filter by price
            </h2>
            <div className="space-y-3">
              <div className="text-xs text-slate-600 flex items-center justify-between">
                <span>Price range</span>
                <span className="font-medium text-slate-900">
                  ${priceRange[0]} – ${priceRange[1]}
                </span>
              </div>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={2500}
                step={10}
                className="w-full"
              />
              <Button
                onClick={applyFilters}
                className="w-full mt-1 rounded-sm bg-slate-900 hover:bg-slate-800 text-xs font-medium"
              >
                Apply filter
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 w-full">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Categories
            </h3>
            <div className="space-y-1 max-h-64 overflow-y-auto pr-1 w-full">
              {visibleCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => selectCategory(category.slug)}
                  className={`w-full flex items-center justify-between text-xs px-3 py-2 rounded-sm transition-colors ${
                    currentCategory === category.slug
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="truncate">{category.name}</span>
                  {currentCategory === category.slug && (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
