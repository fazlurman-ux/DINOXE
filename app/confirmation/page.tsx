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
        {/* Success Animation */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center animate-bounce-slow">
            <Check className="w-12 h-12 text-success" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-400">Thank you for shopping with Dinoxe</p>
        </div>

        {/* Order ID */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Order ID</div>
              <div className="font-mono text-2xl font-bold">{order.orderId}</div>
            </div>
            <button
              onClick={copyOrderId}
              className="btn-secondary flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Order Timeline */}
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
                    {index === 0 && (
                      <div className="text-sm text-gray-400">Order placed on {formatDate(new Date(order.createdAt))}</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {expectedDelivery && (
            <div className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
              <div className="font-medium text-accent mb-1">Expected Delivery</div>
              <div className="text-sm text-gray-300">
                {formatDate(expectedDelivery)} (1-2 business days)
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-start pb-4 border-b border-gray-800 last:border-0">
                <div>
                  <div className="font-medium">{item.productName}</div>
                  <div className="text-sm text-gray-400">Qty: {item.quantity}</div>
                </div>
                <div className="font-mono">{formatPrice(item.subtotal)}</div>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-700">
            <div className="flex justify-between">
              <span className="text-gray-400">Subtotal</span>
              <span className="font-mono">{formatPrice(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Shipping</span>
              <span className="text-success">FREE</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-700">
              <span>Total</span>
              <span className="font-mono text-accent">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Delivery Details</h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-400">Name:</span>
              <span className="ml-2">{order.customerName}</span>
            </div>
            <div>
              <span className="text-gray-400">Phone:</span>
              <span className="ml-2">+91 {order.customerPhone}</span>
            </div>
            <div>
              <span className="text-gray-400">Address:</span>
              <span className="ml-2 block mt-1">{order.deliveryAddress}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link href={`/orders/${order.orderId}`} className="btn-primary text-center">
            Track Order
          </Link>
          <Link href="/products" className="btn-secondary text-center">
            Continue Shopping
          </Link>
          <a
            href={`https://wa.me/919876543210?text=Hi, I have a question about my order ${order.orderId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-center flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Chat Support
          </a>
        </div>

        {/* Support Info */}
        <div className="card p-6 bg-gray-900">
          <h3 className="font-semibold mb-4">Need Help?</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-4 h-4 text-accent" />
              <span>WhatsApp: <a href="https://wa.me/919876543210" className="text-accent hover:underline">+91 98765 43210</a></span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-accent">✉</span>
              <span>Email: <a href="mailto:support@dinoxe.com" className="text-accent hover:underline">support@dinoxe.com</a></span>
            </div>
          </div>
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
