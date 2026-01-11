'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, Copy, Truck, Package, Home, MessageCircle, RefreshCw, ChevronRight } from 'lucide-react'
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
      const deliveryDate = new Date()
      deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 2) + 2)
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!order || !orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h1>
          <p className="text-gray-600 mb-8">We couldn't find the order you're looking for. It might still be processing or the ID is incorrect.</p>
          <Link href="/products" className="btn-blue w-full">
            Back to Shopping
          </Link>
        </div>
      </div>
    )
  }

  const currentStep = getCurrentStepIndex()

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 text-center">
          <Link href="/" className="text-2xl font-bold tracking-tight text-primary">
            DINOXE
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 text-lg">Thank you for your purchase. Your order is being processed.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Order ID Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Order ID</p>
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-2xl font-bold text-gray-900">{order.orderId}</span>
              <button
                onClick={copyOrderId}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-primary"
                title="Copy Order ID"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Delivery Date Card */}
          {expectedDelivery && (
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Estimated Delivery</p>
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-primary" />
                <span className="text-2xl font-bold text-gray-900">{formatDate(expectedDelivery)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Status Journey */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 mb-12 shadow-sm overflow-hidden">
          <h2 className="text-lg font-bold text-gray-900 mb-10">Order Journey</h2>
          <div className="relative flex flex-col md:flex-row justify-between gap-8 md:gap-4">
            {/* Background Line */}
            <div className="absolute left-[27px] md:left-0 md:top-[27px] w-0.5 md:w-full h-full md:h-0.5 bg-gray-100 -z-0"></div>
            
            {statusSteps.map((step, index) => {
              const isActive = index <= currentStep
              const isCurrent = index === currentStep
              const Icon = step.icon

              return (
                <div key={step.key} className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-4 flex-1">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${
                    isActive ? 'bg-primary text-white' : 'bg-white border border-gray-100 text-gray-300'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-left md:text-center">
                    <p className={`text-sm font-bold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    {isActive && index === 0 && (
                      <p className="text-[10px] text-gray-500">{formatDate(new Date(order.createdAt))}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Order Details */}
          <div className="md:col-span-3 bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Details</h2>
            <div className="space-y-4 mb-8">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <div>
                    <span className="font-bold text-gray-900">{item.productName}</span>
                    <span className="text-gray-500 ml-2">× {item.quantity}</span>
                  </div>
                  <span className="font-mono font-bold text-gray-900">{formatPrice(item.subtotal)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-50 pt-6 space-y-3">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span className="text-accent font-bold">FREE</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary font-mono">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="md:col-span-2 bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Delivery Address</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Customer</p>
                <p className="font-bold text-gray-900">{order.customerName}</p>
                <p className="text-sm text-gray-600 font-mono">+91 {order.customerPhone}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Shipping To</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {order.deliveryAddress}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href={`/orders/${order.orderId}`} className="btn-blue flex-1 flex items-center justify-center gap-2 py-4">
            Track Order Status <ChevronRight className="w-5 h-5" />
          </Link>
          <Link href="/products" className="btn-secondary flex-1 py-4">
            Continue Shopping
          </Link>
          <a
            href={`https://wa.me/919876543210?text=Hi, I have a question about my order ${order.orderId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white hover:bg-[#128C7E] flex-1 flex items-center justify-center gap-2 py-4 rounded-lg font-bold transition-all shadow-md"
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
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  )
}
