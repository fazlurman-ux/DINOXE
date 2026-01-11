'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart, Check, ArrowRight, AlertCircle, ShieldCheck, Truck } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice, validatePhone, validateEmail, validateName, validateAddress } from '@/lib/utils'

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
  const { cartItems, getCartTotal, clearCart, getCartCount } = useCart()
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
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!validateName(formData.fullName)) {
      newErrors.fullName = 'Please enter a valid name (3-100 letters)'
    }

    if (!validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Enter a valid 10-digit phone number starting with 6-9'
    }

    if (formData.alternatePhone && !validatePhone(formData.alternatePhone)) {
      newErrors.alternatePhone = 'Enter a valid 10-digit phone number'
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Enter a valid email address'
    }

    if (!validateAddress(formData.deliveryAddress)) {
      newErrors.deliveryAddress = 'Address must be 20+ characters and include a 6-digit pincode'
    }

    if (!checkboxes.addressConfirmed) {
      newErrors.addressConfirmed = 'Please confirm your address'
    }

    if (!checkboxes.codConfirmed) {
      newErrors.codConfirmed = 'Please confirm Cash on Delivery'
    }

    if (!checkboxes.termsAgreed) {
      newErrors.termsAgreed = 'Please agree to our terms'
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
      // Cooldown check
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
        throw new Error(error.message || 'Failed to place order')
      }

      const order = await response.json()
      clearCart()
      router.push(`/confirmation?orderId=${order.orderId}`)
    } catch (error: any) {
      setErrors({ submit: error.message || 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) return null

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold tracking-tight text-primary">
              DINOXE
            </Link>
            <Link href="/cart" className="text-sm font-bold text-gray-500 hover:text-primary transition-colors uppercase tracking-wider">
              Back to Bag
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-12 text-center md:text-left">Checkout</h1>

        {cooldownError && (
          <div className="mb-8 bg-yellow-50 border border-yellow-100 rounded-xl p-6 flex items-start gap-4 animate-slide-up">
            <AlertCircle className="w-6 h-6 text-yellow-600 shrink-0" />
            <div>
              <p className="font-bold text-yellow-900">Wait a moment</p>
              <p className="text-sm text-yellow-700">{cooldownError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-8 border-b border-gray-50 pb-4">1. Delivery Information</h2>
              
              <div className="grid gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    className="input-field"
                  />
                  {errors.fullName && <p className="text-error text-xs mt-1">{errors.fullName}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Phone Number *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+91</span>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile"
                        className="input-field pl-14"
                      />
                    </div>
                    {errors.phoneNumber && <p className="text-error text-xs mt-1">{errors.phoneNumber}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Alternate Phone</label>
                    <input
                      type="tel"
                      name="alternatePhone"
                      value={formData.alternatePhone}
                      onChange={handleInputChange}
                      placeholder="Optional number"
                      className="input-field"
                    />
                    {errors.alternatePhone && <p className="text-error text-xs mt-1">{errors.alternatePhone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com (optional)"
                    className="input-field"
                  />
                  {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Complete Address *</label>
                  <textarea
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    placeholder="House No, Street, Landmark, City, State - PINCODE"
                    rows={4}
                    className="input-field resize-none"
                  />
                  {errors.deliveryAddress && <p className="text-error text-xs mt-1">{errors.deliveryAddress}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Delivery Instructions</label>
                  <textarea
                    name="deliveryInstructions"
                    value={formData.deliveryInstructions}
                    onChange={handleInputChange}
                    placeholder="Any specific directions for the courier?"
                    rows={2}
                    className="input-field resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-8 border-b border-gray-50 pb-4">2. Payment Method</h2>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-center gap-6">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0 shadow-lg">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Cash on Delivery (COD)</p>
                  <p className="text-sm text-gray-600">
                    Pay {formatPrice(total)} in cash when your order reaches your doorstep.
                  </p>
                </div>
                <div className="ml-auto hidden sm:block">
                  <span className="bg-white border border-blue-200 text-primary text-[10px] font-bold uppercase px-3 py-1 rounded-full">Pre-Selected</span>
                </div>
              </div>
            </div>

            {/* Confirmations */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-8 border-b border-gray-50 pb-4">3. Confirm Your Order</h2>
              
              <label className="flex items-start gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checkboxes.addressConfirmed}
                  onChange={(e) => setCheckboxes({ ...checkboxes, addressConfirmed: e.target.checked })}
                  className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary mt-1"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                  I confirm that the delivery address provided is 100% correct.
                </span>
              </label>
              {submitAttempted && errors.addressConfirmed && (
                <p className="text-error text-xs ml-9">{errors.addressConfirmed}</p>
              )}

              <label className="flex items-start gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checkboxes.codConfirmed}
                  onChange={(e) => setCheckboxes({ ...checkboxes, codConfirmed: e.target.checked })}
                  className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary mt-1"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                  I agree to pay the total amount of {formatPrice(total)} upon delivery.
                </span>
              </label>
              {submitAttempted && errors.codConfirmed && (
                <p className="text-error text-xs ml-9">{errors.codConfirmed}</p>
              )}

              <label className="flex items-start gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checkboxes.termsAgreed}
                  onChange={(e) => setCheckboxes({ ...checkboxes, termsAgreed: e.target.checked })}
                  className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary mt-1"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                  I have read and agree to the <Link href="#" className="text-primary hover:underline">Terms & Conditions</Link>.
                </span>
              </label>
              {submitAttempted && errors.termsAgreed && (
                <p className="text-error text-xs ml-9">{errors.termsAgreed}</p>
              )}
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-error text-sm font-bold text-center">
                {errors.submit}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/cart" className="btn-secondary flex-1 py-4 text-center">
                Back to Cart
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-[2] py-4 flex items-center justify-center gap-2 text-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Placing Order...
                  </>
                ) : (
                  <>
                    Confirm Order <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-8 border-b border-gray-50 pb-4">Summary</h2>
              
              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                      <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.productName}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-mono font-bold text-gray-900">{formatPrice(item.productPrice * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="text-accent font-bold">FREE</span>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="font-mono text-2xl font-bold text-primary">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  Trust Badges
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Truck className="w-4 h-4 text-primary" />
                  Fast delivery across India
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Check className="w-4 h-4 text-accent" />
                  Authentic products only
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
