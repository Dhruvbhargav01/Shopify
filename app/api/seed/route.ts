// import { createClient } from '@supabase/supabase-js'
// import { NextResponse } from 'next/server'

// export async function GET() {
//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
//   const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
//   const supabase = createClient(supabaseUrl, supabaseKey)
//   await supabase.from('products').delete().neq('id', '')

//   const res = await fetch('https://dummyjson.com/products?limit=194')
//   const { products } = await res.json()

//   const categoryMap: Record<string, string> = {
//     'beauty': 'beauty',
//     'fragrances': 'fragrances',
//     'furniture': 'furniture',
//     'groceries': 'groceries'
//   }

//   let count = 0
//   for (const p of products) {
//     const categorySlug = categoryMap[p.category as string] || 'beauty'
    
//     const { data: category } = await supabase
//       .from('categories')
//       .select('id')
//       .eq('slug', categorySlug)
//       .single()

//     if (category?.id) {
//       await supabase.from('products').insert({
//         name: p.title,
//         description: p.description,
//         price: p.price,
//         category_id: category.id,
//         image_url: p.thumbnail || `https://dummyjson.com/image/i/products/${(Math.floor(Math.random() * 40) + 1)}/1.jpg`
//       })
//       count++
//     }
//   }

//   return NextResponse.json({ success: true, count })
// }

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  await supabase.from('products').delete().neq('id', '')

  const res = await fetch('https://dummyjson.com/products?limit=0', {
    cache: 'no-store',
    headers: { Accept: 'application/json' }
  })

  if (!res.ok) {
    return NextResponse.json(
      { error: `Fetch failed: ${res.status}` },
      { status: 500 }
    )
  }

  const data = await res.json()
  const products = data.products

  const categoryMap: Record<string, string> = {
    beauty: 'beauty',
    fragrances: 'fragrances',
    furniture: 'furniture',
    groceries: 'groceries',
  }

  let count = 0

  for (const p of products) {
    const categorySlug = categoryMap[p.category as string] || 'beauty'

    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()

    if (category?.id) {
      await supabase.from('products').insert({
        name: p.title,
        description: p.description,
        price: p.price,
        category_id: category.id,
        image_url:
          p.thumbnail ||
          p.images?.[0] ||
          `https://dummyjson.com/image/i/products/${
            Math.floor(Math.random() * 40) + 1
          }/1.jpg`,
      })
      count++
    }
  }

  return NextResponse.json({
    success: true,
    count,
  })
}
