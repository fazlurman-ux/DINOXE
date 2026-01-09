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
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl md:text-2xl font-bold text-accent">
              DINOXE
            </Link>
            <Link href="/cart" className="text-text hover:text-accent transition-colors">
              Cart
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Complete Your Order</h1>

        {cooldownError && (
          <div className="mb-6 bg-warning/20 border border-warning rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-warning">Order Limit Reached</div>
              <div className="text-sm text-gray-300 mt-1">{cooldownError}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-6">Delivery Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="input-field"
                  />
                  {errors.fullName && (
                    <p className="text-error text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number <span className="text-error">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      className="input-field"
                    />
                    {errors.phoneNumber && (
                      <p className="text-error text-sm mt-1">{errors.phoneNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Alternate Phone <span className="text-gray-500">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      name="alternatePhone"
                      value={formData.alternatePhone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      className="input-field"
                    />
                    {errors.alternatePhone && (
                      <p className="text-error text-sm mt-1">{errors.alternatePhone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email <span className="text-gray-500">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="input-field"
                  />
                  {errors.email && (
                    <p className="text-error text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Delivery Address <span className="text-error">*</span>
                  </label>
                  <textarea
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    placeholder="Enter complete address with pincode (e.g., Flat 123, Tower A, XYZ Society, Main Road, City - 110001)"
                    rows={4}
                    className="input-field"
                  />
                  {errors.deliveryAddress && (
                    <p className="text-error text-sm mt-1">{errors.deliveryAddress}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Delivery Instructions <span className="text-gray-500">(Optional)</span>
                  </label>
                  <textarea
                    name="deliveryInstructions"
                    value={formData.deliveryInstructions}
                    onChange={handleInputChange}
                    placeholder="Any special instructions for delivery"
                    rows={2}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-6">Payment Method</h2>
              <div className="bg-success/10 border border-success rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked
                    disabled
                    className="w-4 h-4 accent-accent"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Cash on Delivery (COD)</div>
                    <div className="text-sm text-gray-400">
                      Pay {formatPrice(total)} when delivery arrives
                    </div>
                  </div>
                  <Check className="w-5 h-5 text-success" />
                </div>
              </div>
            </div>

            {/* Confirmations */}
            <div className="card p-6 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkboxes.addressConfirmed}
                  onChange={(e) => setCheckboxes({ ...checkboxes, addressConfirmed: e.target.checked })}
                  className="w-4 h-4 accent-accent mt-1"
                />
                <span className="text-sm">
                  I confirm that the delivery address is correct
                </span>
              </label>
              {submitAttempted && errors.addressConfirmed && (
                <p className="text-error text-sm -mt-3">{errors.addressConfirmed}</p>
              )}

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkboxes.codConfirmed}
                  onChange={(e) => setCheckboxes({ ...checkboxes, codConfirmed: e.target.checked })}
                  className="w-4 h-4 accent-accent mt-1"
                />
                <span className="text-sm">
                  I will pay {formatPrice(total)} on delivery via Cash on Delivery
                </span>
              </label>
              {submitAttempted && errors.codConfirmed && (
                <p className="text-error text-sm -mt-3">{errors.codConfirmed}</p>
              )}

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkboxes.termsAgreed}
                  onChange={(e) => setCheckboxes({ ...checkboxes, termsAgreed: e.target.checked })}
                  className="w-4 h-4 accent-accent mt-1"
                />
                <span className="text-sm">
                  I agree to the <Link href="#" className="text-accent hover:underline">Terms & Conditions</Link> and <Link href="#" className="text-accent hover:underline">Refund Policy</Link>
                </span>
              </label>
              {submitAttempted && errors.termsAgreed && (
                <p className="text-error text-sm -mt-3">{errors.termsAgreed}</p>
              )}
            </div>

            {errors.submit && (
              <div className="bg-error/20 border border-error rounded-lg p-4 text-error">
                {errors.submit}
              </div>
            )}

            <div className="flex gap-4">
              <Link href="/cart" className="btn-secondary flex-1 text-center">
                ← Back to Cart
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm Order
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center shrink-0">
                      <ShoppingCart className="w-8 h-8 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm line-clamp-2">{item.productName}</div>
                      <div className="text-sm text-gray-400">Qty: {item.quantity}</div>
                      <div className="font-mono text-sm">{formatPrice(item.productPrice * item.quantity)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-700 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-mono">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-success">FREE</span>
                </div>
                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="font-mono text-accent">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
                <div className="text-sm text-gray-300">
                  <span className="font-semibold text-accent">Cash on Delivery:</span> Pay {formatPrice(total)} when your order arrives
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
