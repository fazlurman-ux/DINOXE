'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, Copy, Truck, Package, Home, MessageCircle, RefreshCw } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'

interface Order {
  orderId: string
  customerName: string
  customerPhone: string
  deliveryAddress: string
  totalAmount: number
  orderStatus: string
  createdAt: string
  items: Array<{
    productName: string
    productPrice: number
    quantity: number
    subtotal: number
  }>
}

const statusSteps = [
  { key: 'Pending', label: 'Order Placed', icon: Package },
  { key: 'Dispatched', label: 'Preparing', icon: RefreshCw },
  { key: 'Delivered', label: 'Out for Delivery', icon: Truck },
  { key: 'Completed', label: 'Delivered', icon: Home },
]

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [expectedDelivery, setExpectedDelivery] = useState<Date | null>(null)

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId)
      // Set expected delivery date (1-2 days from now)
      const deliveryDate = new Date()
      deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 2) + 1)
      setExpectedDelivery(deliveryDate)
    }
  }, [orderId])

  const fetchOrder = async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyOrderId = () => {
    if (order) {
      navigator.clipboard.writeText(order.orderId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getCurrentStepIndex = () => {
    if (!order) return 0
    const statusMap: { [key: string]: number } = {
      'Pending': 0,
      'Dispatched': 1,
      'Delivered': 2,
      'Completed': 3,
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

  if (!order || !orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Order not found</p>
          <Link href="/products" className="btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  const currentStep = getCurrentStepIndex()

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
        {/* Success Animation */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-8 rounded-[32px] bg-success/10 border border-success/20 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-success/20 blur-2xl rounded-full animate-pulse"></div>
            <Check className="w-12 h-12 text-success relative z-10" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">Order Confirmed!</h1>
          <p className="text-gray-400 font-medium">Sit back and relax, your tech is on its way.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Order ID Card */}
          <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl group-hover:bg-accent/10 transition-colors"></div>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Order Tracking ID</div>
            <div className="font-mono text-3xl font-black text-white mb-6 tracking-tighter">{order.orderId}</div>
            <button
              onClick={copyOrderId}
              className="w-fit flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied to Clipboard!' : 'Copy Tracking ID'}
            </button>
          </div>

          {/* Delivery Date Card */}
          {expectedDelivery && (
            <div className="bg-accent/5 border border-accent/20 rounded-[40px] p-8 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-3xl"></div>
              <div className="text-[10px] font-black uppercase tracking-widest text-accent mb-2">Estimated Arrival</div>
              <div className="text-3xl font-black text-white mb-2">{formatDate(expectedDelivery)}</div>
              <div className="text-xs font-bold text-accent/60 uppercase tracking-widest">Express Delivery (1-2 Days)</div>
            </div>
          )}
        </div>

        {/* Status Timeline - Modernized */}
        <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 mb-12">
          <h2 className="text-xl font-black mb-10 uppercase tracking-widest text-white/50">Order Journey</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            {statusSteps.map((step, index) => {
              const isActive = index <= currentStep
              const isCurrent = index === currentStep
              const Icon = step.icon

              return (
                <div key={step.key} className="relative flex sm:flex-col items-center gap-4 sm:gap-6 group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center relative z-10 transition-all duration-500 ${
                    isActive ? 'bg-accent text-background shadow-[0_0_20px_rgba(0,217,217,0.4)]' : 'bg-white/5 text-gray-600'
                  }`}>
                    <Icon className="w-6 h-6" />
                    {isCurrent && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent border-4 border-background rounded-full animate-ping"></div>
                    )}
                  </div>
                  <div className="sm:text-center">
                    <div className={`text-xs font-black uppercase tracking-widest mb-1 ${
                      isCurrent ? 'text-accent' : isActive ? 'text-white' : 'text-gray-600'
                    }`}>
                      {step.label}
                    </div>
                    {isActive && index === 0 && (
                      <div className="text-[10px] text-gray-500 font-bold uppercase">{formatDate(new Date(order.createdAt))}</div>
                    )}
                  </div>
                  {/* Connector Line */}
                  {index < statusSteps.length - 1 && (
                    <div className={`hidden sm:block absolute top-7 left-[calc(50%+28px)] w-[calc(100%-56px)] h-0.5 ${
                      index < currentStep ? 'bg-accent' : 'bg-white/5'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Order Summary */}
          <div className="md:col-span-3 bg-white/5 border border-white/10 rounded-[40px] p-10">
            <h2 className="text-xl font-black mb-8 uppercase tracking-widest text-white/50">Order Summary</h2>
            <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center group">
                  <div>
                    <div className="font-bold text-white group-hover:text-accent transition-colors">{item.productName}</div>
                    <div className="text-xs text-gray-500 font-bold uppercase">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-mono font-black text-white">{formatPrice(item.subtotal)}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-6 space-y-3">
              <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-mono text-white">{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                <span className="text-gray-500">Shipping</span>
                <span className="text-success">FREE</span>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                <span className="text-white font-black uppercase tracking-widest">Total Paid</span>
                <span className="font-mono text-2xl font-black text-accent">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-[40px] p-10 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl"></div>
            <h2 className="text-xl font-black mb-8 uppercase tracking-widest text-white/50">Delivery To</h2>
            <div className="space-y-6 flex-1">
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
        </div>

        {/* Final Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link href={`/orders/${order.orderId}`} className="btn-primary flex items-center justify-center gap-2 py-5 font-black uppercase tracking-widest text-xs">
            Track Order Status
          </Link>
          <Link href="/products" className="btn-secondary flex items-center justify-center gap-2 py-5 font-black uppercase tracking-widest text-xs">
            Continue Shopping
          </Link>
          <a
            href={`https://wa.me/919876543210?text=Hi, I have a question about my order ${order.orderId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-success text-background flex items-center justify-center gap-2 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-success/90 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp Support
          </a>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  )
}
