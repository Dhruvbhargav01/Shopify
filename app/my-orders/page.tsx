
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-browser'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Package, Clock, ArrowLeft, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface OrderItem {
  id: string
  product_id: string
  product?: {
    id: string
    name: string
    price: number
    image_url: string
    description?: string
  }
  quantity: number
  price_at_purchase: number
}

interface Order {
  id: string
  created_at: string
  total_amount: number
  status: string
  order_items: OrderItem[]
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        created_at,
        total_amount,
        status,
        order_items (
          id,
          quantity,
          price_at_purchase,
          products(id, name, price, image_url, description)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
    } else if (data) {
      const formattedOrders = data.map((order: any) => ({
        ...order,
        order_items: order.order_items.map((item: any) => ({
          ...item,
          product: item.products
        }))
      }))
      setOrders(formattedOrders)
    }
    setLoading(false)
  }

  const cancelOrder = async (orderId: string) => {
    setCancelling(orderId)
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)

      if (!error) {
        setOrders(orders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'cancelled' }
            : order
        ))
      }
    } catch (error) {
      alert('Failed to cancel order')
    } finally {
      setCancelling(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 lg:px-0 py-10">
          <div className="text-center py-24">
            <div className="w-16 h-16 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 text-lg">Loading orders...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 lg:px-0 py-10">
        <div className="flex items-center gap-3 mb-12">
          <Button variant="ghost" className="text-slate-500 hover:bg-slate-100" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Home / Shop
          </Button>
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">My Orders</h1>
            <p className="text-slate-500 mt-1">{orders.length} total orders</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <Card className="border-slate-200 shadow-sm max-w-2xl mx-auto text-center py-20">
            <ShoppingBag className="w-20 h-20 text-slate-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">No orders yet</h2>
            <p className="text-slate-500 mb-8">Your orders will appear here once you complete a purchase.</p>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3" onClick={() => router.push('/')}>
              Start Shopping
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="border-slate-200 shadow-sm hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                      <Package className="w-5 h-5 text-slate-600" />
                      Order #{order.id.slice(-8).toUpperCase()}
                    </CardTitle>
                    <div className="text-right space-y-1">
                      <div className="text-sm text-slate-500">
                        {new Date(order.created_at).toLocaleDateString('en-IN')}
                      </div>
                      <div className="text-lg font-bold text-slate-900">
                        ₹{Number(order.total_amount).toLocaleString()}
                      </div>
                      <div className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 font-medium ${
                        order.status === 'cancelled' 
                          ? 'bg-red-100 text-red-700 border border-red-200' 
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {order.status === 'cancelled' ? 'Cancelled' : 'Delivers in 7 days'}
                      </div>
                      {order.status !== 'cancelled' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="mt-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 hover:border-red-300 font-medium"
                          onClick={() => cancelOrder(order.id)}
                          disabled={cancelling === order.id}
                        >
                          {cancelling === order.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancel Order
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-6 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                        <img
                          src={item.product?.image_url || 'https://via.placeholder.com/80?text=No+Img'}
                          alt={item.product?.name || 'Product'}
                          className="w-20 h-20 object-cover rounded-lg shrink-0"
                        />
                        <div className="flex-1 min-w-0 space-y-2">
                          <h4 className="font-semibold text-slate-900 text-lg leading-tight truncate">{item.product?.name}</h4>
                          <p className="text-sm text-slate-500 line-clamp-2">{item.product?.description || 'No description available.'}</p>
                          <div className="flex items-center justify-between pt-2">
                            <div>
                              <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                              <p className="text-sm font-semibold text-slate-900">
                                ₹{(item.price_at_purchase * item.quantity).toLocaleString()}
                              </p>
                            </div>
                            <p className="text-lg font-bold text-slate-900">
                              ₹{item.price_at_purchase.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
