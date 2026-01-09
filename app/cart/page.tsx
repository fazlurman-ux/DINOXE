'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const router = useRouter()
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart()

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
    } else if (newQuantity <= 5) {
      updateQuantity(productId, newQuantity)
    }
  }

  const subtotal = getCartTotal()
  const shipping = 0
  const total = subtotal + shipping

  if (cartItems.length === 0) {
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

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <ShoppingCart className="w-24 h-24 mx-auto text-gray-700" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-400 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link href="/products" className="btn-primary inline-block">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

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

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.productId} className="card p-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center shrink-0">
                    <ShoppingCart className="w-12 h-12 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.productId}`}
                      className="font-medium hover:text-accent transition-colors block mb-2"
                    >
                      {item.productName}
                    </Link>
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-mono font-bold text-accent">
                        {formatPrice(item.productPrice)}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-error hover:text-red-400 transition-colors flex items-center gap-1 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 border border-gray-700 rounded">
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-gray-800 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-1 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= 5}
                          className="px-3 py-1 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="font-mono font-bold">
                        {formatPrice(item.productPrice * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal ({getCartCount()} items)</span>
                  <span className="font-mono">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-success">FREE</span>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="font-mono text-accent">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Link href="/checkout" className="btn-primary w-full text-center block">
                  Proceed to Checkout
                </Link>
                <Link href="/products" className="btn-secondary w-full text-center block">
                  Continue Shopping
                </Link>
              </div>
              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-400 mb-2">Payment Method</div>
                <div className="flex items-center gap-2 text-success font-medium">
                  <span className="w-3 h-3 rounded-full bg-success"></span>
                  Cash on Delivery (COD)
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Pay when your order arrives
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
