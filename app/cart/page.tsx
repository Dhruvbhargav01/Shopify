
'use client'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-browser'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft } from 'lucide-react'

export default function CartPage() {
  const { cart, cartQuantity, updateQuantity, removeFromCart, clearCart, isLoading } = useCart()
  const router = useRouter()

  const total = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)

  const handleCheckout = async () => {
    const checkoutBtn = document.getElementById('checkout-btn') as HTMLButtonElement
    if (checkoutBtn) {
      checkoutBtn.disabled = true
      checkoutBtn.innerHTML = `
        <div class="flex items-center justify-center gap-2">
          <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Processing...
        </div>
      `
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login?redirect=/cart')
        return
      }

      console.log('🧑 User ID:', user.id)

      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: total,
          status: 'pending'
        })
        .select('id')
        .single()

      console.log('🆕 New Order:', newOrder, 'Error:', orderError)

      if (orderError || !newOrder) {
        throw new Error(`Order error: ${orderError?.message || 'No order created'}`)
      }

      const orderItems = cart.map(item => ({
        order_id: newOrder.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.product?.price || 0
      }))

      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (orderItemsError) {
        throw new Error(`Order items error: ${orderItemsError.message}`)
      }

      await clearCart()

      if (checkoutBtn) {
        checkoutBtn.innerHTML = `
          <div class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Order Placed!
          </div>
        `
        checkoutBtn.className = 'w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6 font-semibold shadow-xl'
      }

      setTimeout(() => {
        router.push('/my-orders')
      }, 2000)

    } catch (error: any) {
      console.error('🚨 Checkout FULL ERROR:', error)
      if (checkoutBtn) {
        checkoutBtn.innerHTML = 'Proceed to Checkout'
        checkoutBtn.disabled = false
      }
      alert(`Checkout failed: ${error.message}`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 lg:px-0 py-10">
          <div className="text-center py-24">
            <div className="w-16 h-16 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 text-lg">Loading cart...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 lg:px-0 py-10">
        <Button variant="ghost" className="text-slate-500 hover:bg-slate-100 mb-8 text-sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Home / Shop
        </Button>

        {cart.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingCart className="w-20 h-20 text-slate-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Your cart is empty</h2>
            <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Button 
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 text-sm font-medium"
              onClick={() => router.push('/')}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              {cart.map(item => (
                <div key={item.id} className="bg-white border border-slate-200 rounded-md p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    <div className="w-32 h-32 bg-slate-100 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.product?.image_url || 'https://via.placeholder.com/128?text=No+Image'}
                        alt={item.product?.name || 'Product'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-3">
                      <h3 className="text-lg font-semibold text-slate-900 leading-tight">{item.product?.name || 'Unknown Product'}</h3>
                      <p className="text-2xl font-bold text-slate-900">₹{(item.product?.price || 0).toLocaleString()}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center bg-slate-100 rounded-lg p-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-slate-200"
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="px-4 py-2 text-lg font-semibold text-slate-900 min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-slate-200"
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 ml-auto text-sm font-medium"
                          onClick={() => removeFromCart(item.product_id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4">
              <Card className="border-slate-200 shadow-sm sticky top-24">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-slate-900">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Subtotal ({cartQuantity} items):</span>
                      <span className="font-semibold text-slate-900">₹{total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-slate-600">
                      <span>Shipping:</span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>
                    <div className="border-t border-slate-200 pt-3">
                      <div className="flex justify-between text-2xl font-bold text-slate-900">
                        <span>Total:</span>
                        <span>₹{total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    id="checkout-btn"
                    onClick={handleCheckout}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white text-lg py-4 font-semibold shadow-md hover:shadow-lg transition-all"
                    disabled={cart.length === 0}
                  >
                    Proceed to Checkout
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-slate-300 hover:border-slate-400 text-slate-700 font-medium py-3"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
