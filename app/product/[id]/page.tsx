'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart, Star, ArrowLeft, Shield, RefreshCw, Zap } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice, validateName, validateEmail, validatePhone } from '@/lib/utils'

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
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)
  const [showToast, setShowToast] = useState(false)
  const [loading, setLoading] = useState(true)
  const [reviewName, setReviewName] = useState('')
  const [reviewCity, setReviewCity] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewErrors, setReviewErrors] = useState<Record<string, string>>({})

  const { addToCart } = useCart()

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
      fetchReviews(params.id as string)
    }
  }, [params.id])

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`)
      const data = await response.json()
      setProduct(data)
      fetchRelatedProducts(data.category, id)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching product:', error)
      setLoading(false)
    }
  }

  const fetchReviews = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`)
      const data = await response.json()
      setReviews(data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const fetchRelatedProducts = async (category: string, excludeId: string) => {
    try {
      const response = await fetch(`/api/products?category=${category}`)
      const data = await response.json()
      setRelatedProducts(data.filter((p: Product) => p.id !== excludeId).slice(0, 4))
    } catch (error) {
      console.error('Error fetching related products:', error)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        imageUrl: product.imageUrl,
      })
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors: Record<string, string> = {}

    if (!validateName(reviewName)) {
      errors.name = 'Name must be 3-100 characters, letters only'
    }
    if (!validateName(reviewCity)) {
      errors.city = 'City must be 3-100 characters, letters only'
    }
    if (reviewComment.length < 10) {
      errors.comment = 'Comment must be at least 10 characters'
    }

    if (Object.keys(errors).length > 0) {
      setReviewErrors(errors)
      return
    }

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
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
        fetchReviews(params.id as string)
      }
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Product not found</p>
          <Link href="/products" className="btn-secondary">
            Back to Products
          </Link>
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
            <Link href="/cart" className="text-text hover:text-accent transition-colors flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden md:inline">Cart</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-accent">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-accent">Products</Link>
          <span>/</span>
          <span className="text-text">{product.name}</span>
        </div>

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-accent mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-32 h-32 text-gray-700" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:border-accent transition-colors"
                >
                  <ShoppingCart className="w-8 h-8 text-gray-700" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="text-sm text-accent mb-2">{product.category}</div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                </div>
                <div className="text-gray-400">|</div>
                <div className={product.stock > 0 ? 'text-success' : 'text-error'}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </div>
              </div>
              <div className="font-mono text-3xl font-bold text-accent mb-4">
                {formatPrice(product.price)}
              </div>
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            </div>

            {/* Specifications */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Specifications</h3>
              <p className="text-gray-300">{product.specifications}</p>
              <div className="flex items-center gap-2 mt-3 text-sm">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-accent">{product.warranty} warranty</span>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-700 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-800 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(5, quantity + 1))}
                  className="px-4 py-2 hover:bg-gray-800 transition-colors"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  product.stock > 0
                    ? 'bg-accent hover:bg-accent-hover text-white'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                {product.stock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
              </button>
            </div>

            {/* Why Buy */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Shield className="w-5 h-5 text-success" />
                <span>100% Authentic Products</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RefreshCw className="w-5 h-5 text-success" />
                <span>30-Day Easy Refund</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Zap className="w-5 h-5 text-success" />
                <span>{product.warranty} Warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          
          {/* Review Form */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
            <h3 className="font-semibold mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="input-field"
                    placeholder="Your name"
                  />
                  {reviewErrors.name && (
                    <p className="text-error text-sm mt-1">{reviewErrors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    value={reviewCity}
                    onChange={(e) => setReviewCity(e.target.value)}
                    className="input-field"
                    placeholder="Your city"
                  />
                  {reviewErrors.city && (
                    <p className="text-error text-sm mt-1">{reviewErrors.city}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`text-2xl transition-colors ${
                        star <= reviewRating ? 'text-yellow-400' : 'text-gray-600'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Your Review</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="input-field min-h-[100px]"
                  placeholder="Share your experience with this product..."
                  rows={4}
                />
                {reviewErrors.comment && (
                  <p className="text-error text-sm mt-1">{reviewErrors.comment}</p>
                )}
              </div>
              <button type="submit" className="btn-primary">
                Submit Review
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.slice(0, 5).map((review) => (
                <div key={review.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-medium">{review.customerName}</div>
                      <div className="text-sm text-gray-400">{review.city}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  href={`/product/${related.id}`}
                  className="card group"
                >
                  <div className="aspect-square bg-gray-800 flex items-center justify-center text-gray-600">
                    <ShoppingCart className="w-12 h-12" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-2 group-hover:text-accent transition-colors line-clamp-2">
                      {related.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="font-mono font-bold">{formatPrice(related.price)}</div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {related.rating}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {showToast && (
        <div className="toast bg-success text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <span className="text-xl font-bold">✓</span>
          <span className="font-medium">
            {reviewName ? 'Review submitted successfully!' : 'Added to cart'}
          </span>
        </div>
      )}
    </div>
  )
}
