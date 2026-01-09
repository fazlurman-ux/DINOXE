'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Truck, Package, RefreshCw, Home, MessageCircle, Copy, ArrowLeft } from 'lucide-react'
import { formatPrice, formatDate, formatDateTime } from '@/lib/utils'

interface Order {
  orderId: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  deliveryAddress: string
  deliveryInstructions?: string
  totalAmount: number
  paymentMethod: string
  paymentStatus: string
  orderStatus: string
  createdAt: string
  updatedAt: string
  items: Array<{
    productName: string
    productPrice: number
    quantity: number
    subtotal: number
  }>
}

const statusSteps = [
  { key: 'Pending', label: 'Order Placed', icon: Package, description: 'Your order has been received' },
  { key: 'Dispatched', label: 'Preparing', icon: RefreshCw, description: 'Your order is being prepared for dispatch' },
  { key: 'Delivered', label: 'Out for Delivery', icon: Truck, description: 'Your order is on the way' },
  { key: 'Completed', label: 'Delivered', icon: Home, description: 'Your order has been delivered' },
]

export default function OrderTrackingPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.orderId as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchOrder(orderId)
  }, [orderId])

  const fetchOrder = async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getCurrentStepIndex = () => {
    if (!order) return 0
    const statusMap: { [key: string]: number } = {
      'Pending': 0,
      'Dispatched': 1,
      'Delivered': 2,
      'Completed': 3,
      'Refund Pending': 0,
      'Refunded': 0,
    }
    return statusMap[order.orderStatus] || 0
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Order not found</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => router.back()} className="btn-secondary">
              ← Back
            </button>
            <Link href="/products" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const currentStep = getCurrentStepIndex()
  const isRefund = order.orderStatus === 'Refund Pending' || order.orderStatus === 'Refunded'

  return (
    <div className="min-h-screen bg-mesh-gradient pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-black tracking-tighter text-accent flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-background rounded-sm"></div>
              </div>
              DINOXE
            </Link>
            <Link href="/products" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-accent transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          GO BACK
        </button>

        {/* Order ID */}
        <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 flex flex-col justify-center relative overflow-hidden group mb-12">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl group-hover:bg-accent/10 transition-colors"></div>
          <div className="flex items-center justify-between flex-wrap gap-6 relative z-10">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Tracking Your Journey</div>
              <div className="font-mono text-3xl font-black text-white tracking-tighter">{order.orderId}</div>
            </div>
            <button
              onClick={copyOrderId}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy Tracking ID'}
            </button>
          </div>
        </div>

        {/* Order Status */}
        {isRefund ? (
          <div className="bg-warning/5 border border-warning/20 rounded-[40px] p-10 mb-12">
            <h2 className="text-2xl font-black mb-4 text-warning uppercase tracking-tight">Refund Processed</h2>
            <p className="text-gray-400 font-medium leading-relaxed">
              Your refund is currently <span className="text-warning font-black uppercase tracking-widest px-2 py-1 bg-warning/10 rounded-lg ml-1">{order.orderStatus}</span>.
              Funds will be returned to your original payment method within 3-5 business days.
            </p>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 mb-12">
            <h2 className="text-xl font-black mb-12 uppercase tracking-widest text-white/50">Live Status</h2>
            <div className="space-y-12">
              {statusSteps.map((step, index) => {
                const isActive = index <= currentStep
                const isCurrent = index === currentStep
                const Icon = step.icon

                return (
                  <div key={step.key} className="relative flex gap-8 group">
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center relative z-10 transition-all duration-500 ${
                          isActive ? 'bg-accent text-background shadow-[0_0_20px_rgba(0,217,217,0.3)]' : 'bg-white/5 text-gray-600'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div
                          className={`w-0.5 h-16 mt-4 rounded-full ${
                            index < currentStep ? 'bg-accent' : 'bg-white/5'
                          }`}
                        />
                      )}
                    </div>
                    <div className="pt-2">
                      <div
                        className={`text-sm font-black uppercase tracking-widest ${
                          isCurrent ? 'text-accent' : isActive ? 'text-white' : 'text-gray-600'
                        }`}
                      >
                        {step.label}
                        {isCurrent && <span className="ml-3 text-[10px] bg-accent/20 px-2 py-1 rounded-lg">LATEST UPDATE</span>}
                      </div>
                      <div className={`text-sm mt-1 font-medium ${isActive ? 'text-gray-400' : 'text-gray-600'}`}>
                        {step.description}
                      </div>
                      {isActive && index === 0 && (
                        <div className="text-[10px] text-gray-500 font-black mt-2 uppercase tracking-widest">
                          {formatDateTime(new Date(order.createdAt))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Order Details */}
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Items */}
          <div className="md:col-span-3 bg-white/5 border border-white/10 rounded-[40px] p-10">
            <h3 className="text-xl font-black mb-8 uppercase tracking-widest text-white/50">Package Contents</h3>
            <div className="space-y-6">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center pb-6 border-b border-white/5 last:border-0 last:pb-0">
                  <div>
                    <div className="font-bold text-white mb-1">{item.productName}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-xs">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-mono font-black text-white">{formatPrice(item.subtotal)}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 mt-8 pt-8">
              <div className="flex justify-between items-center">
                <span className="text-white font-black uppercase tracking-widest">Total Amount</span>
                <span className="font-mono text-2xl font-black text-accent">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl"></div>
              <h3 className="text-xl font-black mb-8 uppercase tracking-widest text-white/50">Delivery To</h3>
              <div className="space-y-6">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Customer</div>
                  <div className="font-bold text-white">{order.customerName}</div>
                  <div className="text-sm font-mono text-gray-400">+91 {order.customerPhone}</div>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Address</div>
                  <div className="text-sm text-gray-300 leading-relaxed font-medium">
                    {order.deliveryAddress}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[40px] p-8">
              <h3 className="text-sm font-black mb-4 uppercase tracking-widest text-white/50">Payment Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-gray-500">Method</span>
                  <span className="text-white">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-gray-500">Status</span>
                  <span className="text-success">{order.paymentStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="bg-accent/5 border border-accent/20 rounded-[40px] p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-3xl -z-10 group-hover:bg-accent/20 transition-colors"></div>
          <h3 className="text-2xl font-black mb-4 tracking-tight">Need Assistance?</h3>
          <p className="text-gray-400 font-medium mb-8 max-w-lg">
            Our support heroes are available 24/7 to help you with any questions regarding your delivery or product.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href={`https://wa.me/919876543210?text=Hi, I have a question about my order ${order.orderId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform shadow-[0_0_20px_rgba(37,211,102,0.3)]"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Support
            </a>
            <a
              href="mailto:support@dinoxe.com"
              className="btn-secondary px-8 py-4 text-[10px] font-black uppercase tracking-widest"
            >
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
