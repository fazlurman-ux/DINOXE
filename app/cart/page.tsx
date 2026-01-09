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
    <div className="min-h-screen bg-mesh-gradient">
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

      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-4xl font-black tracking-tight">Your Bag</h1>
          <div className="text-gray-500 font-bold ml-2">({getCartCount()} items)</div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.productId} className="group relative bg-white/5 border border-white/10 rounded-[32px] p-6 hover:bg-white/[0.07] transition-all">
                <div className="flex gap-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-900 border border-white/5 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
                    <ShoppingCart className="w-12 h-12 text-gray-700 opacity-30" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <Link
                          href={`/product/${item.productId}`}
                          className="text-xl font-black hover:text-accent transition-colors truncate"
                        >
                          {item.productName}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="p-2 text-gray-500 hover:text-error transition-colors bg-white/5 rounded-xl border border-white/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="font-mono text-2xl font-black text-white mb-4">
                        {formatPrice(item.productPrice)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-background rounded-xl border border-white/5 overflow-hidden">
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          className="px-4 py-2 hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 font-black text-sm min-w-[40px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= 5}
                          className="px-4 py-2 hover:bg-white/5 transition-colors text-gray-400 hover:text-white disabled:opacity-20"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="font-mono font-black text-xl text-accent">
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
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 sticky top-24 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl group-hover:bg-accent/10 transition-colors"></div>
              <h2 className="text-2xl font-black mb-8">Summary</h2>
              <div className="space-y-6 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-bold text-sm uppercase tracking-widest">Subtotal</span>
                  <span className="font-mono font-black text-lg">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-bold text-sm uppercase tracking-widest">Shipping</span>
                  <span className="text-success font-black text-sm uppercase tracking-widest">Free</span>
                </div>
                <div className="border-t border-white/10 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-black text-lg uppercase tracking-widest">Total</span>
                    <span className="font-mono text-3xl font-black text-accent">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <Link href="/checkout" className="btn-primary w-full py-5 text-center block text-lg shadow-[0_0_30px_rgba(0,217,217,0.2)]">
                  PROCEED TO CHECKOUT
                </Link>
                <Link href="/products" className="btn-secondary w-full py-5 text-center block text-xs font-black uppercase tracking-widest">
                  BACK TO SHOP
                </Link>
              </div>
              
              <div className="mt-10 pt-10 border-t border-white/5">
                <div className="flex items-center gap-4 text-gray-400">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <Check className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white">Secure Checkout</div>
                    <div className="text-[10px] uppercase tracking-widest">Cash on Delivery Available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
