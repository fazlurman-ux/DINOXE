'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, Search, ArrowRight } from 'lucide-react'

export default function TrackOrderPage() {
  const router = useRouter()
  const [orderId, setOrderId] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (orderId.trim()) {
      router.push(`/orders/${orderId.trim()}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight text-primary">
            DINOXE
          </Link>
          <Link href="/products" className="text-sm font-bold text-gray-500 hover:text-primary transition-colors uppercase tracking-wider">
            Shop Products
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-200/50">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
            <Package className="w-8 h-8" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Track Your Order</h1>
          <p className="text-gray-500 text-center mb-8">Enter your order ID to see the current status and estimated delivery time.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Order ID</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. ORD-20240111-12345"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-blue w-full py-4 flex items-center justify-center gap-2 group"
            >
              Track Status <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-50 text-center">
            <p className="text-sm text-gray-500 mb-4">Can't find your order ID?</p>
            <div className="flex justify-center gap-4">
              <Link href="/products" className="text-primary font-bold text-sm hover:underline">
                Continue Shopping
              </Link>
              <span className="text-gray-300">|</span>
              <a href="mailto:support@dinoxe.com" className="text-primary font-bold text-sm hover:underline">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} DINOXE INDIA. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  )
}
