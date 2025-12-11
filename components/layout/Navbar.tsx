
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase-browser'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShoppingCart, Search, Menu, X, Package, User } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { cartQuantity } = useCart()
  const [searchTerm, setSearchTerm] = useState('')
  const [user, setUser] = useState<any>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const q = searchParams.get('q')
    setSearchTerm(q || '')
  }, [searchParams])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchTerm.trim()
    if (q) {
      router.push(`/?q=${encodeURIComponent(q.toLowerCase())}&category=${encodeURIComponent(q.toLowerCase())}`)
    } else {
      router.push('/')
    }
  }

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold text-slate-900">
           ✦ Shopify
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full flex">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 rounded-xl h-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit" size="sm" className="ml-2 px-6 h-10">
                Search
              </Button>
            </form>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {user && (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-slate-700 hover:bg-slate-100"
                onClick={() => router.push('/my-orders')}
              >
                <Package className="h-5 w-5" />
                Orders
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 relative text-slate-700 hover:bg-slate-100"
              onClick={() => router.push('/cart')}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow">
                  {cartQuantity}
                </span>
              )}
            </Button>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
                  <User className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-800 max-w-[120px] truncate">
                    {user.user_metadata?.username || user.email?.split('@')[0]}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-4"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4"
              >
                <Link href="/login">Login</Link>
              </Button>
            )}

            <Button
              variant="ghost"
              className="md:hidden text-slate-700 hover:bg-slate-100 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="px-4 py-4 space-y-4">
            <form onSubmit={handleSearch} className="flex">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 bg-white border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl h-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit" size="sm" className="ml-2 px-6 h-10">
                Search
              </Button>
            </form>

            {user && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-slate-700 hover:bg-slate-100 h-10"
                onClick={() => {
                  router.push('/my-orders')
                  setIsMobileMenuOpen(false)
                }}
              >
                <Package className="h-5 w-5 mr-2" />
                My Orders
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}


