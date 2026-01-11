'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart, Star, ArrowLeft, Shield, RefreshCw, Zap, Check, ChevronRight, Truck } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice, validateName } from '@/lib/utils'

interface Product {
  id: string
  name: string
  category: string
  price: number
  description: string
  specifications: string
  warranty: string
  stock: number
  rating: number
  imageUrl: string
}

interface Review {
  id: string
  customerName: string
  city: string
  rating: number
  comment: string
  createdAt: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [loading, setLoading] = useState(true)
  
  // Review form state
  const [reviewName, setReviewName] = useState('')
  const [reviewCity, setReviewCity] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewErrors, setReviewErrors] = useState<Record<string, string>>({})
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  const { addToCart, getCartCount } = useCart()

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
      fetchReviews(params.id as string)
    }
  }, [params.id])

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
        if (data.category) {
          fetchRelatedProducts(data.category, id)
        }
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching product:', error)
      setLoading(false)
    }
  }

  const fetchReviews = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`)
      if (response.ok) {
        const data = await response.json()
        setReviews(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const fetchRelatedProducts = async (category: string, excludeId: string) => {
    try {
      const response = await fetch(`/api/products?category=${category}`)
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          setRelatedProducts(data.filter((p: Product) => p.id !== excludeId).slice(0, 4))
        }
      }
    } catch (error) {
      console.error('Error fetching related products:', error)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          imageUrl: product.imageUrl,
        })
      }
      setToastMessage('Added to cart successfully!')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors: Record<string, string> = {}

    if (!validateName(reviewName)) {
      errors.name = 'Please enter a valid name (letters and spaces only)'
    }
    if (!validateName(reviewCity)) {
      errors.city = 'Please enter a valid city'
    }
    if (reviewComment.length < 10) {
      errors.comment = 'Comment must be at least 10 characters'
    }

    if (Object.keys(errors).length > 0) {
      setReviewErrors(errors)
      return
    }

    setIsSubmittingReview(true)
    try {
      const response = await fetch(`/api/products/${params.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: reviewName,
          city: reviewCity,
          rating: reviewRating,
          comment: reviewComment,
        }),
      })

      if (response.ok) {
        setReviewName('')
        setReviewCity('')
        setReviewComment('')
        setReviewRating(5)
        setReviewErrors({})
        setToastMessage('Review submitted for approval!')
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
        fetchReviews(params.id as string)
      }
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      setIsSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4 text-gray-900">Product not found</p>
          <Link href="/products" className="btn-blue">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold tracking-tight text-primary">
              DINOXE
            </Link>
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-primary transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {getCartCount()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/products" className="hover:text-primary">Products</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {/* Product Image */}
          <div className="card bg-gray-50 flex items-center justify-center overflow-hidden">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                {product.category}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-gray-700">{product.rating}</span>
                </div>
                <div className={`text-sm font-bold ${product.stock > 0 ? 'text-accent' : 'text-error'}`}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 font-mono mb-6">
                {formatPrice(product.price)}
              </div>
              <p className="text-gray-600 leading-relaxed text-lg mb-8">{product.description}</p>
            </div>

            {/* Specifications */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-4">Specifications</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 whitespace-pre-line">{product.specifications}</p>
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Zap className="w-4 h-4" />
                <span>{product.warranty} Warranty</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-14 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-6 h-full hover:bg-gray-50 transition-colors font-bold text-xl"
                >
                  -
                </button>
                <span className="px-6 font-bold text-lg min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(5, quantity + 1))}
                  className="px-6 h-full hover:bg-gray-50 transition-colors font-bold text-xl"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 btn-primary h-14 text-lg flex items-center justify-center gap-3 w-full"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-8 border-t border-gray-100">
              <div className="flex flex-col items-center gap-2 text-center">
                <Shield className="w-5 h-5 text-accent" />
                <span className="text-[10px] font-bold uppercase text-gray-500">Authentic</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <RefreshCw className="w-5 h-5 text-accent" />
                <span className="text-[10px] font-bold uppercase text-gray-500">30-Day Refund</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <Truck className="w-5 h-5 text-accent" />
                <span className="text-[10px] font-bold uppercase text-gray-500">Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Review Form */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Write a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Your Name</label>
                    <input
                      type="text"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="input-field"
                      placeholder="e.g. Rahul Sharma"
                    />
                    {reviewErrors.name && <p className="text-error text-xs mt-1">{reviewErrors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Your City</label>
                    <input
                      type="text"
                      value={reviewCity}
                      onChange={(e) => setReviewCity(e.target.value)}
                      className="input-field"
                      placeholder="e.g. Mumbai"
                    />
                    {reviewErrors.city && <p className="text-error text-xs mt-1">{reviewErrors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className={`text-2xl transition-all ${
                            star <= reviewRating ? 'text-yellow-400' : 'text-gray-200'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Comment</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="input-field min-h-[100px] resize-none"
                      placeholder="What was your experience?"
                    />
                    {reviewErrors.comment && <p className="text-error text-xs mt-1">{reviewErrors.comment}</p>}
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmittingReview}
                    className="w-full btn-primary"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            </div>

            {/* Review List */}
            <div className="lg:col-span-2 space-y-6">
              {reviews.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-500 italic">No reviews yet. Be the first to share your experience!</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="font-bold text-gray-900">{review.customerName}</div>
                        <div className="text-xs text-gray-500">{review.city}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed italic">"{review.comment}"</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pb-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  href={`/product/${related.id}`}
                  className="card group"
                >
                  <div className="aspect-square bg-gray-50 overflow-hidden">
                    <img 
                      src={related.imageUrl} 
                      alt={related.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1">
                      {related.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-gray-900 font-mono">{formatPrice(related.price)}</div>
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-gray-700">{related.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-accent text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up z-50">
          <Check className="w-5 h-5" />
          <span className="font-bold text-sm">{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
