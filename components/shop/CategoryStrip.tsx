
"use client"

import { useRouter, useSearchParams } from "next/navigation"

interface Category {
  id: string
  name: string
  slug: string
}

export function CategoryStrip({
  categories,
  currentCategory
}: {
  categories: Category[]
  currentCategory?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const selectCategory = (slug?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("q")
    if (!slug) {
      params.delete("category")
    } else {
      if (params.get("category") === slug) {
        params.delete("category")
      } else {
        params.set("category", slug)
      }
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
    <div className="w-full flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
      <button
        onClick={() => selectCategory(undefined)}
        className={`px-6 py-2 rounded-full border flex-shrink-0 ${
          !currentCategory
            ? "bg-slate-900 text-white border-slate-900"
            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
        }`}
      >
        All
      </button>
      <div className="flex-1 flex gap-2 px-4">
        {visibleCategories.map(category => (
          <button
            key={category.id}
            onClick={() => selectCategory(category.slug)}
            className={`flex-1 px-3 py-2 rounded-full border whitespace-nowrap transition-colors text-center ${
              currentCategory === category.slug
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}
