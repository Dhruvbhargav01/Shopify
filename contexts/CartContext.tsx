'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase-browser'

interface CartItem {
  id: string
  product_id: string
  product?: {
    id: string
    name: string
    price: number
    image_url: string
  }
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  cartQuantity: number
  addToCart: (productId: string, quantity?: number) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  clearCart: () => Promise<void>
  isLoading: boolean
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const cartQuantity = cart.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    initCart()
  }, [])

  const initCart = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)

    if (user) {
      await loadCartFromSupabase(user.id)
      await syncLocalCart()
    } else {
      await loadCartFromLocalStorage()
    }
    setIsLoading(false)
  }

  const getUserCartId = async (userId: string) => {
    const { data } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .single()
    return data?.id
  }

  const createUserCart = async (userId: string) => {
    const { data } = await supabase
      .from('carts')
      .insert({ user_id: userId })
      .select('id')
      .single()
    return data?.id
  }

  const loadCartFromSupabase = async (userId: string) => {
    const cartId = await getUserCartId(userId)
    if (!cartId) return

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        product_id,
        quantity,
        products!inner(id, name, price, image_url)
      `)
      .eq('cart_id', cartId)
    
    if (error) {
      console.error('Load cart error:', error)
      return
    }
    
    if (data) {
      setCart(data.map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        product: item.products,
        quantity: item.quantity
      })))
    }
  }

  const loadCartFromLocalStorage = async () => {
    if (typeof window !== 'undefined') {
      try {
        const localCart = localStorage.getItem('guest_cart')
        if (localCart) {
          setCart(JSON.parse(localCart))
        }
      } catch {
        localStorage.removeItem('guest_cart')
      }
    }
  }

  const syncLocalCart = async () => {
    if (typeof window !== 'undefined' && user) {
      try {
        const localCart = localStorage.getItem('guest_cart')
        if (localCart) {
          const localItems: CartItem[] = JSON.parse(localCart)
          const cartId = await getUserCartId(user.id!) || await createUserCart(user.id!)
          
          for (const item of localItems) {
            await supabase
              .from('cart_items')
              .upsert({ 
                cart_id: cartId, 
                product_id: item.product_id, 
                quantity: item.quantity 
              }, { onConflict: 'cart_id,product_id' })
          }
          localStorage.removeItem('guest_cart')
          await loadCartFromSupabase(user.id!)
        }
      } catch (error) {
        console.error('Sync cart error:', error)
        localStorage.removeItem('guest_cart')
      }
    }
  }

  const addToCart = async (productId: string, quantity = 1) => {
    console.log('🔥 addToCart called:', { productId, quantity, user: !!user })
    
    // 1. FETCH PRODUCT DETAILS FIRST (FIX FOR GUEST CART PRICES)
    const { data: product } = await supabase
      .from('products')
      .select('id, name, price, image_url')
      .eq('id', productId)
      .single()

    if (!product) {
      console.error('Product not found')
      return
    }

    // 2. IMMEDIATE UI UPDATE with FULL product data
    const newItem: CartItem = {
      id: crypto.randomUUID(),
      product_id: productId,
      product,  // ✅ FULL PRODUCT DATA (name, price, image)
      quantity
    }
    
    const newCart = [...cart.filter(item => item.product_id !== productId), newItem]
    setCart(newCart)

    if (user) {
      try {
        console.log('👤 User logged in, using Supabase')
        const cartId = await getUserCartId(user.id!) || await createUserCart(user.id!)
        console.log('🛒 Cart ID:', cartId)
        
        const { data: existing } = await supabase
          .from('cart_items')
          .select('quantity')
          .eq('cart_id', cartId)
          .eq('product_id', productId)
          .single()

        if (existing) {
          await supabase
            .from('cart_items')
            .update({ quantity: existing.quantity + quantity })
            .eq('cart_id', cartId)
            .eq('product_id', productId)
        } else {
          await supabase
            .from('cart_items')
            .insert({ cart_id: cartId, product_id: productId, quantity })
        }
        await loadCartFromSupabase(user.id!)
      } catch (error) {
        console.error('Supabase addToCart error:', error)
        const guestCart = localStorage.getItem('guest_cart')
        if (guestCart) {
          setCart(JSON.parse(guestCart))
        }
      }
    } else {
      // Guest cart - save COMPLETE data with product details
      if (typeof window !== 'undefined') {
        localStorage.setItem('guest_cart', JSON.stringify(newCart))
      }
      console.log('✅ Guest cart updated:', newCart.length, 'items')
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(productId)
    }

    if (user) {
      const cartId = await getUserCartId(user.id!)
      if (cartId) {
        await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('cart_id', cartId)
          .eq('product_id', productId)
        await loadCartFromSupabase(user.id!)
      }
    } else {
      const newCart = cart.map(item => 
        item.product_id === productId ? { ...item, quantity } : item
      )
      setCart(newCart)
      if (typeof window !== 'undefined') {
        localStorage.setItem('guest_cart', JSON.stringify(newCart))
      }
    }
  }

  const removeFromCart = async (productId: string) => {
    if (user) {
      const cartId = await getUserCartId(user.id!)
      if (cartId) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', cartId)
          .eq('product_id', productId)
        await loadCartFromSupabase(user.id!)
      }
    } else {
      const newCart = cart.filter(item => item.product_id !== productId)
      setCart(newCart)
      if (typeof window !== 'undefined') {
        localStorage.setItem('guest_cart', JSON.stringify(newCart))
      }
    }
  }

  const clearCart = async () => {
    if (user) {
      const cartId = await getUserCartId(user.id!)
      if (cartId) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', cartId)
        await loadCartFromSupabase(user.id!)
      }
    } else {
      setCart([])
      if (typeof window !== 'undefined') {
        localStorage.removeItem('guest_cart')
      }
    }
  }

  return (
    <CartContext.Provider value={{
      cart,
      cartQuantity,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
