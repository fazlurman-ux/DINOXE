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
            <Link href="/cart" className="relative p-2 text-gray-400 hover:text-accent transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {/* No count here to keep it clean, but I could add it */}
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-8">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <div className="w-1 h-1 rounded-full bg-white/20"></div>
          <Link href="/products" className="hover:text-accent transition-colors">Products</Link>
          <div className="w-1 h-1 rounded-full bg-white/20"></div>
          <span className="text-accent truncate">{product.name}</span>
        </div>

        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          GO BACK
        </button>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* Product Image */}
          <div className="space-y-6">
            <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 border border-white/5 rounded-[40px] flex items-center justify-center relative overflow-hidden group">
              <ShoppingCart className="w-32 h-32 text-gray-700 group-hover:scale-110 transition-transform duration-700 opacity-20" />
              <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:border-accent/50 transition-all hover:bg-accent/5"
                >
                  <ShoppingCart className="w-6 h-6 text-gray-700" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <div className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest mb-4">
                {product.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight">{product.name}</h1>
              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-black text-sm">{product.rating}</span>
                </div>
                <div className={`text-xs font-bold uppercase tracking-widest ${product.stock > 0 ? 'text-success' : 'text-error'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Sold Out'}
                </div>
              </div>
              <div className="font-mono text-4xl font-black text-accent mb-8">
                {formatPrice(product.price)}
              </div>
              <p className="text-gray-400 leading-relaxed text-lg">{product.description}</p>
            </div>

            {/* Specifications Card */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl group-hover:bg-accent/10 transition-colors"></div>
              <h3 className="font-bold text-sm uppercase tracking-widest text-white mb-4">Tech Specs</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{product.specifications}</p>
              <div className="flex items-center gap-3 text-accent bg-accent/10 w-fit px-4 py-2 rounded-full border border-accent/20">
                <Zap className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">{product.warranty} Warranty</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-8">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-6 py-4 hover:bg-white/10 transition-colors font-black text-xl"
                >
                  -
                </button>
                <span className="px-6 py-4 font-black text-lg min-w-[60px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(5, quantity + 1))}
                  className="px-6 py-4 hover:bg-white/10 transition-colors font-black text-xl"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 btn-primary text-lg flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,217,217,0.2)]"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock > 0 ? 'ADD TO BAG' : 'NOT AVAILABLE'}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/5">
              <div className="flex flex-col items-center gap-2 text-center">
                <Shield className="w-5 h-5 text-success" />
                <span className="text-[9px] font-black uppercase tracking-tighter text-gray-500">Genuine</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <RefreshCw className="w-5 h-5 text-success" />
                <span className="text-[9px] font-black uppercase tracking-tighter text-gray-500">30-Day Refund</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <Zap className="w-5 h-5 text-success" />
                <span className="text-[9px] font-black uppercase tracking-tighter text-gray-500">Warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Review Form & List - Modernized */}
        <div className="mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl font-black mb-2">Community Reviews</h2>
              <p className="text-gray-400 text-sm">Real feedback from real tech enthusiasts.</p>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 sticky top-24">
                <h3 className="text-xl font-black mb-6">Write a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Name</label>
                    <input
                      type="text"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                      placeholder="Your name"
                    />
                    {reviewErrors.name && <p className="text-error text-[10px] mt-1 font-bold">{reviewErrors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">City</label>
                    <input
                      type="text"
                      value={reviewCity}
                      onChange={(e) => setReviewCity(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                      placeholder="Your city"
                    />
                    {reviewErrors.city && <p className="text-error text-[10px] mt-1 font-bold">{reviewErrors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Rating</label>
                    <div className="flex gap-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className={`text-2xl transition-all ${
                            star <= reviewRating ? 'text-yellow-400 scale-110' : 'text-gray-700 grayscale'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Comment</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all min-h-[120px]"
                      placeholder="What's your experience?"
                    />
                    {reviewErrors.comment && <p className="text-error text-[10px] mt-1 font-bold">{reviewErrors.comment}</p>}
                  </div>
                  <button type="submit" className="w-full btn-primary py-4">SUBMIT REVIEW</button>
                </form>
              </div>
            </div>

            {/* List */}
            <div className="lg:col-span-2 space-y-6">
              {reviews.length === 0 ? (
                <div className="text-center py-20 bg-white/5 border border-white/10 rounded-[32px]">
                  <p className="text-gray-500 font-bold italic">No reviews yet. Be the first to share your experience!</p>
                </div>
              ) : (
                reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="bg-white/5 border border-white/10 rounded-[32px] p-8 hover:bg-white/[0.07] transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="font-black text-lg">{review.customerName}</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">{review.city}</div>
                      </div>
                      <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-400 leading-relaxed italic">"{review.comment}"</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Related Products - Modernized */}
        {relatedProducts.length > 0 && (
          <div className="pb-20">
            <h2 className="text-3xl font-black mb-12">Complete The Look</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  href={`/product/${related.id}`}
                  className="group"
                >
                  <div className="aspect-square bg-white/5 border border-white/10 rounded-[32px] flex items-center justify-center mb-4 relative overflow-hidden group-hover:border-accent/30 transition-all duration-500">
                    <ShoppingCart className="w-12 h-12 text-gray-700 group-hover:scale-110 transition-transform duration-700 opacity-30" />
                  </div>
                  <h3 className="font-bold text-sm mb-2 group-hover:text-accent transition-colors line-clamp-1">
                    {related.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="font-mono font-black text-white">{formatPrice(related.price)}</div>
                    <div className="flex items-center gap-1 text-[10px] font-black bg-white/5 px-2 py-0.5 rounded-lg">
                      <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                      {related.rating}
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
        <div className="fixed bottom-8 right-8 bg-accent text-background px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up z-50">
          <div className="w-6 h-6 bg-background rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-accent" />
          </div>
          <span className="font-black text-sm tracking-tight uppercase">
            {reviewName ? 'Review Received' : 'Added to Bag'}
          </span>
        </div>
      )}
    </div>
  )
}
