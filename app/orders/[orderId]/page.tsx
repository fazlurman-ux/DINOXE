'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Truck, Package, RefreshCw, Home, MessageCircle, Copy, ArrowLeft, ChevronRight } from 'lucide-react'
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
      }
    } catch (error) {
      console.error('Error fetching order:', error)
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h1>
          <p className="text-gray-600 mb-8">We couldn't find an order with ID: {orderId}</p>
          <Link href="/products" className="btn-blue w-full">
            Back to Shopping
          </Link>
        </div>
      </div>
    )
  }

  const currentStep = getCurrentStepIndex()
  const isRefund = order.orderStatus.includes('Refund')

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold tracking-tight text-primary">
              DINOXE
            </Link>
            <Link href="/products" className="text-sm font-bold text-gray-500 hover:text-primary transition-colors uppercase tracking-wider">
              Shop More
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-white border border-gray-100 rounded-2xl p-8 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tracking Order</p>
              <h1 className="text-2xl font-mono font-bold text-gray-900">{order.orderId}</h1>
            </div>
            <button
              onClick={copyOrderId}
              className="btn-secondary py-2 px-4 text-xs flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy ID'}
            </button>
          </div>
        </div>

        {isRefund ? (
          <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-10 mb-8">
            <h2 className="text-xl font-bold text-yellow-800 mb-2">Refund Update</h2>
            <p className="text-yellow-700">
              Your order status is currently <span className="font-bold">{order.orderStatus}</span>. 
              Our team is processing your request. You will receive an update shortly.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl p-10 mb-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-10">Current Status</h2>
            <div className="space-y-12">
              {statusSteps.map((step, index) => {
                const isActive = index <= currentStep
                const isCurrent = index === currentStep
                const Icon = step.icon

                return (
                  <div key={step.key} className="relative flex gap-8">
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center relative z-10 transition-all duration-500 shadow-sm ${
                          isActive ? 'bg-primary text-white' : 'bg-gray-50 text-gray-300'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div
                          className={`w-0.5 h-16 absolute top-14 ${
                            index < currentStep ? 'bg-primary' : 'bg-gray-100'
                          }`}
                        />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <p className={`text-sm font-bold uppercase tracking-wider ${isActive ? 'text-gray-900' : 'text-gray-300'}`}>
                          {step.label}
                        </p>
                        {isCurrent && (
                          <span className="bg-accent/10 text-accent text-[10px] font-bold px-2 py-0.5 rounded-full">CURRENT</span>
                        )}
                      </div>
                      <p className={`text-sm mt-1 ${isActive ? 'text-gray-500' : 'text-gray-300'}`}>
                        {step.description}
                      </p>
                      {isActive && index === 0 && (
                        <p className="text-[10px] text-gray-400 mt-2 font-mono">
                          {formatDateTime(new Date(order.createdAt))}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div className="md:col-span-3 bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Items</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-bold text-gray-900">{item.productName}</p>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-mono font-bold text-gray-900">{formatPrice(item.subtotal)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-6 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-bold uppercase text-xs">Total Amount</span>
                <span className="text-2xl font-bold text-primary font-mono">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Delivery Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Customer</p>
                  <p className="font-bold text-gray-900">{order.customerName}</p>
                  <p className="text-sm text-gray-600 font-mono">+91 {order.customerPhone}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Address</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {order.deliveryAddress}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase mb-4">Payment Method</p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">{order.paymentMethod}</span>
                <span className="bg-accent/10 text-accent text-[10px] font-bold px-2 py-0.5 rounded-full">{order.paymentStatus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Need Help */}
        <div className="bg-primary rounded-2xl p-10 text-white relative overflow-hidden shadow-xl shadow-primary/20">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">Need help with your order?</h3>
            <p className="text-blue-100 mb-8 max-w-lg">
              Our support team is available 24/7 to assist you with delivery issues, product questions, or returns.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={`https://wa.me/919876543210?text=Hi, I have a question about my order ${order.orderId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white flex items-center gap-2 px-6 py-3 rounded-lg font-bold hover:bg-[#128C7E] transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Us
              </a>
              <a
                href="mailto:support@dinoxe.com"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all"
              >
                Email Support
              </a>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        </div>
      </div>
    </div>
  )
}
