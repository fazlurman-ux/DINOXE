'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart, Check, ArrowRight, AlertCircle } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice, validatePhone, validateEmail, validatePincode, validateName, validateAddress } from '@/lib/utils'

interface FormData {
  fullName: string
  phoneNumber: string
  email: string
  deliveryAddress: string
  alternatePhone: string
  deliveryInstructions: string
}

interface FormErrors {
  [key: string]: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phoneNumber: '',
    email: '',
    deliveryAddress: '',
    alternatePhone: '',
    deliveryInstructions: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [checkboxes, setCheckboxes] = useState({
    addressConfirmed: false,
    codConfirmed: false,
    termsAgreed: false,
  })
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [cooldownError, setCooldownError] = useState('')

  const subtotal = getCartTotal()
  const total = subtotal

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart')
    }
  }, [cartItems, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!validateName(formData.fullName)) {
      newErrors.fullName = 'Name must be 3-100 characters, letters only'
    }

    if (!validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone must be 10 digits starting with 6-9'
    }

    if (formData.alternatePhone && !validatePhone(formData.alternatePhone)) {
      newErrors.alternatePhone = 'Phone must be 10 digits starting with 6-9'
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!validateAddress(formData.deliveryAddress)) {
      newErrors.deliveryAddress = 'Address must be 20+ characters with a 6-digit pincode'
    }

    if (!checkboxes.addressConfirmed) {
      newErrors.addressConfirmed = 'Please confirm your delivery address'
    }

    if (!checkboxes.codConfirmed) {
      newErrors.codConfirmed = 'Please confirm COD payment'
    }

    if (!checkboxes.termsAgreed) {
      newErrors.termsAgreed = 'Please agree to the terms'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitAttempted(true)
    setCooldownError('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Check for duplicate orders (60-second cooldown)
      const cooldownCheck = await fetch('/api/orders/check-cooldown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phoneNumber }),
      })

      if (cooldownCheck.status === 429) {
        const data = await cooldownCheck.json()
        setCooldownError(data.message || 'Please wait before placing another order')
        setLoading(false)
        return
      }

      // Create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: cartItems,
          totalAmount: total,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create order')
      }

      const order = await response.json()
      clearCart()
      router.push(`/confirmation?orderId=${order.orderId}`)
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to place order. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return null
  }

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
            <Link href="/cart" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-accent transition-colors">
              Back to Bag
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-black tracking-tight mb-12">Checkout</h1>

        {cooldownError && (
          <div className="mb-8 bg-warning/10 border border-warning/20 rounded-[24px] p-6 flex items-start gap-4 animate-slide-up">
            <AlertCircle className="w-6 h-6 text-warning shrink-0" />
            <div>
              <div className="font-black text-warning uppercase text-xs tracking-widest mb-1">Wait a moment</div>
              <div className="text-sm text-gray-300">{cooldownError}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-10">
              <h2 className="text-xl font-black mb-8 uppercase tracking-widest text-white/50">1. Delivery Information</h2>
              
              <div className="grid gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">
                    Full Name <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                  />
                  {errors.fullName && (
                    <p className="text-error text-[10px] font-bold mt-2 ml-1 uppercase tracking-widest">{errors.fullName}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">
                      Phone Number <span className="text-accent">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">+91</span>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all font-mono"
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-error text-[10px] font-bold mt-2 ml-1 uppercase tracking-widest">{errors.phoneNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">
                      Alternate Phone
                    </label>
                    <input
                      type="tel"
                      name="alternatePhone"
                      value={formData.alternatePhone}
                      onChange={handleInputChange}
                      placeholder="Optional number"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all font-mono"
                    />
                    {errors.alternatePhone && (
                      <p className="text-error text-[10px] font-bold mt-2 ml-1 uppercase tracking-widest">{errors.alternatePhone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                  />
                  {errors.email && (
                    <p className="text-error text-[10px] font-bold mt-2 ml-1 uppercase tracking-widest">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">
                    Complete Address <span className="text-accent">*</span>
                  </label>
                  <textarea
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    placeholder="House No, Street, Landmark, City, State - PINCODE"
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all resize-none"
                  />
                  {errors.deliveryAddress && (
                    <p className="text-error text-[10px] font-bold mt-2 ml-1 uppercase tracking-widest">{errors.deliveryAddress}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">
                    Special Instructions
                  </label>
                  <textarea
                    name="deliveryInstructions"
                    value={formData.deliveryInstructions}
                    onChange={handleInputChange}
                    placeholder="Any specific directions for the courier?"
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-10">
              <h2 className="text-xl font-black mb-8 uppercase tracking-widest text-white/50">2. Payment Method</h2>
              <div className="bg-accent/5 border border-accent/20 rounded-[24px] p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl"></div>
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shrink-0">
                    <Check className="w-6 h-6 text-background" />
                  </div>
                  <div className="flex-1">
                    <div className="font-black text-white uppercase tracking-widest text-xs mb-1">Cash on Delivery (COD)</div>
                    <div className="text-sm text-gray-400">
                      Pay {formatPrice(total)} in cash when your order arrives.
                    </div>
                  </div>
                  <div className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                    Pre-Selected
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmations */}
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-10 space-y-6">
              <h2 className="text-xl font-black mb-8 uppercase tracking-widest text-white/50">3. Final Confirmation</h2>
              
              <label className="flex items-start gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checkboxes.addressConfirmed}
                  onChange={(e) => setCheckboxes({ ...checkboxes, addressConfirmed: e.target.checked })}
                  className="w-5 h-5 accent-accent mt-0.5 bg-transparent border-white/20 rounded-md"
                />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                  I confirm the delivery address is 100% accurate.
                </span>
              </label>
              {submitAttempted && errors.addressConfirmed && (
                <p className="text-error text-[10px] font-bold -mt-4 ml-9 uppercase tracking-widest">{errors.addressConfirmed}</p>
              )}

              <label className="flex items-start gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checkboxes.codConfirmed}
                  onChange={(e) => setCheckboxes({ ...checkboxes, codConfirmed: e.target.checked })}
                  className="w-5 h-5 accent-accent mt-0.5 bg-transparent border-white/20 rounded-md"
                />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                  I will pay {formatPrice(total)} upon delivery.
                </span>
              </label>
              {submitAttempted && errors.codConfirmed && (
                <p className="text-error text-[10px] font-bold -mt-4 ml-9 uppercase tracking-widest">{errors.codConfirmed}</p>
              )}

              <label className="flex items-start gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checkboxes.termsAgreed}
                  onChange={(e) => setCheckboxes({ ...checkboxes, termsAgreed: e.target.checked })}
                  className="w-5 h-5 accent-accent mt-0.5 bg-transparent border-white/20 rounded-md"
                />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                  I agree to the <Link href="#" className="text-accent hover:underline">Terms</Link> & <Link href="#" className="text-accent hover:underline">Refund Policy</Link>.
                </span>
              </label>
              {submitAttempted && errors.termsAgreed && (
                <p className="text-error text-[10px] font-bold -mt-4 ml-9 uppercase tracking-widest">{errors.termsAgreed}</p>
              )}
            </div>

            {errors.submit && (
              <div className="bg-error/10 border border-error/20 rounded-[24px] p-6 text-error text-xs font-bold uppercase tracking-widest animate-pulse">
                {errors.submit}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/cart" className="btn-secondary flex-1 py-5 text-center text-xs font-black uppercase tracking-widest">
                ← Back to Bag
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-[2] py-5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-[0_0_30px_rgba(0,217,217,0.2)]"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-background"></div>
                    PROCESSING...
                  </>
                ) : (
                  <>
                    CONFIRM ORDER
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-10 sticky top-24 overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl group-hover:bg-accent/10 transition-colors"></div>
              <h2 className="text-xl font-black mb-8 uppercase tracking-widest text-white/50">Order Summary</h2>
              
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex gap-4 group/item">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 border border-white/5 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
                      <ShoppingCart className="w-8 h-8 text-gray-700 opacity-30 group-hover/item:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-white line-clamp-1 group-hover/item:text-accent transition-colors">{item.productName}</div>
                      <div className="text-xs text-gray-500 font-bold mb-1">QTY: {item.quantity}</div>
                      <div className="font-mono text-sm font-black text-white">{formatPrice(item.productPrice * item.quantity)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-8 space-y-4">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-mono text-white text-base">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-success">FREE</span>
                </div>
                <div className="border-t border-white/10 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-black text-lg uppercase tracking-widest">Total</span>
                    <span className="font-mono text-2xl font-black text-accent">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-6 bg-accent/5 border border-accent/20 rounded-[24px]">
                <div className="text-[10px] font-black uppercase tracking-widest text-accent mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping"></div>
                  COD Guarantee
                </div>
                <div className="text-xs text-gray-400 leading-relaxed">
                  Pay <span className="text-white font-bold">{formatPrice(total)}</span> when the courier reaches your doorstep.
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
