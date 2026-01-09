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
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl md:text-2xl font-bold text-accent">
              DINOXE
            </Link>
            <Link href="/products" className="text-text hover:text-accent transition-colors">
              Products
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-accent mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Order ID */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Tracking Order</div>
              <div className="font-mono text-2xl font-bold">{order.orderId}</div>
            </div>
            <button
              onClick={copyOrderId}
              className="btn-secondary flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy ID'}
            </button>
          </div>
        </div>

        {/* Order Status */}
        {isRefund ? (
          <div className="card p-6 mb-8 border-warning">
            <h2 className="text-xl font-bold mb-2 text-warning">Refund Status</h2>
            <p className="text-gray-300">
              Your refund is currently <span className="font-semibold text-warning">{order.orderStatus}</span>.
              Our team will process it within 2-3 business days.
            </p>
          </div>
        ) : (
          <div className="card p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Order Status</h2>
            <div className="space-y-6">
              {statusSteps.map((step, index) => {
                const isActive = index <= currentStep
                const isCurrent = index === currentStep
                const Icon = step.icon

                return (
                  <div key={step.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isActive ? 'bg-success' : 'bg-gray-700'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div
                          className={`w-0.5 h-12 mt-2 ${
                            index < currentStep ? 'bg-success' : 'bg-gray-700'
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <div
                        className={`font-medium ${
                          isCurrent ? 'text-accent' : isActive ? 'text-text' : 'text-gray-500'
                        }`}
                      >
                        {step.label}
                        {isCurrent && <span className="ml-2 text-xs bg-accent/20 px-2 py-1 rounded">Current</span>}
                      </div>
                      <div className={`text-sm mt-1 ${isActive ? 'text-gray-400' : 'text-gray-600'}`}>
                        {step.description}
                      </div>
                      {index === 0 && (
                        <div className="text-xs text-gray-500 mt-1">
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
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Items */}
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm pb-3 border-b border-gray-800 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium">{item.productName}</div>
                    <div className="text-gray-400">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-mono">{formatPrice(item.subtotal)}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-700 mt-4 pt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="font-mono text-accent">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Delivery Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-400">Name:</span>
                <span className="ml-2">{order.customerName}</span>
              </div>
              <div>
                <span className="text-gray-400">Phone:</span>
                <span className="ml-2">+91 {order.customerPhone}</span>
              </div>
              {order.customerEmail && (
                <div>
                  <span className="text-gray-400">Email:</span>
                  <span className="ml-2">{order.customerEmail}</span>
                </div>
              )}
              <div>
                <span className="text-gray-400">Address:</span>
                <span className="ml-2 block mt-1">{order.deliveryAddress}</span>
              </div>
              {order.deliveryInstructions && (
                <div>
                  <span className="text-gray-400">Instructions:</span>
                  <span className="ml-2">{order.deliveryInstructions}</span>
                </div>
              )}
            </div>
            <div className="border-t border-gray-700 mt-4 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Payment:</span>
                <span>{order.paymentMethod} ({order.paymentStatus})</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-400">Order Date:</span>
                <span>{formatDate(new Date(order.createdAt))}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-400">Last Updated:</span>
                <span>{formatDateTime(new Date(order.updatedAt))}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="card p-6 bg-gray-900">
          <h3 className="font-semibold mb-4">Need Help with Your Order?</h3>
          <p className="text-gray-400 text-sm mb-4">
            If you have any questions or issues with your order, feel free to reach out to our support team.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href={`https://wa.me/919876543210?text=Hi, I have a question about my order ${order.orderId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>
            <a
              href="mailto:support@dinoxe.com"
              className="btn-secondary"
            >
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
