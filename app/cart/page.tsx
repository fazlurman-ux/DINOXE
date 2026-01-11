'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react'
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
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold tracking-tight text-primary">
                DINOXE
              </Link>
              <Link href="/products" className="text-gray-600 hover:text-primary font-medium transition-colors">
                Products
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-24">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingCart className="w-10 h-10 text-gray-300" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Looks like you haven't added any items to your cart yet. Start exploring our premium accessories.
            </p>
            <Link href="/products" className="btn-blue inline-flex items-center gap-2">
              Start Shopping <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold tracking-tight text-primary">
              DINOXE
            </Link>
            <Link href="/products" className="text-sm font-bold text-gray-500 hover:text-primary transition-colors uppercase tracking-wider">
              Continue Shopping
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Your Shopping Bag</h1>
          <span className="text-gray-400 font-medium text-lg">({getCartCount()} items)</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.productId} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 shadow-sm">
                <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                  <img 
                    src={item.imageUrl} 
                    alt={item.productName} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <Link
                      href={`/product/${item.productId}`}
                      className="text-lg font-bold text-gray-900 hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.productName}
                    </Link>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="p-2 text-gray-400 hover:text-error transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="font-mono text-xl font-bold text-gray-900 mb-6">
                    {formatPrice(item.productPrice)}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-10 bg-white">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        className="px-4 h-full hover:bg-gray-50 transition-colors text-gray-500"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 font-bold text-sm min-w-[3rem] text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= 5}
                        className="px-4 h-full hover:bg-gray-50 transition-colors text-gray-500 disabled:opacity-30"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="font-mono font-bold text-lg text-primary">
                      {formatPrice(item.productPrice * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-8">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-accent font-bold uppercase text-sm">Free</span>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="font-mono text-2xl font-bold text-primary">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <Link href="/checkout" className="btn-primary w-full py-4 text-center block text-lg font-bold">
                  Proceed to Checkout
                </Link>
                <Link href="/products" className="btn-secondary w-full py-4 text-center block text-sm font-bold">
                  Continue Shopping
                </Link>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-50 space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                  <span>Secure Payment - Cash on Delivery</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Truck className="w-5 h-5 text-accent" />
                  <span>Free Express Delivery across India</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
