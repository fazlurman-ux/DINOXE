'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search, ShoppingCart, Star, Filter, X, Menu, ChevronRight, Check } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/utils'

const categories = [
  'All',
  'Chargers',
  'Cables',
  'Cases',
  'Screen Protectors',
  'Earbuds',
  'Speakers',
  'Cooling Fan',
  'Phone Cooler',
]

const priceRanges = [
  { label: '₹200-500', min: 200, max: 500 },
  { label: '₹500-1000', min: 500, max: 1000 },
  { label: '₹1000-2000', min: 1000, max: 2000 },
]

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popularity', label: 'Popularity' },
]

interface Product {
  id: string
  name: string
  category: string
  price: number
  rating: number
  stock: number
  imageUrl: string
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get('category') || 'All'

  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl)
  const [selectedPrice, setSelectedPrice] = useState<{ min: number; max: number } | null>(null)
  const [sortBy, setSortBy] = useState('newest')
  const [showToast, setShowToast] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [displayCount, setDisplayCount] = useState(12)

  const { addToCart, getCartCount } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    setSelectedCategory(categoryFromUrl)
  }, [categoryFromUrl])

  useEffect(() => {
    applyFilters()
  }, [products, searchQuery, selectedCategory, selectedPrice, sortBy])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(Array.isArray(data) ? data : [])
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching products:', error)
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    if (selectedPrice) {
      filtered = filtered.filter(
        (p) => p.price >= selectedPrice.min && p.price <= selectedPrice.max
      )
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'popularity':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
      default:
        filtered.sort((a, b) => a.id.localeCompare(b.id))
        break
    }

    setFilteredProducts(filtered)
  }

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      imageUrl: product.imageUrl,
    })
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSelectedPrice(null)
    setSortBy('newest')
  }

  const hasActiveFilters = searchQuery || selectedCategory !== 'All' || selectedPrice

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2 shrink-0">
              DINOXE
            </Link>
            <div className="flex-1 max-w-xl">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/cart" className="relative p-2 text-gray-600 hover:text-primary transition-colors shrink-0">
                <ShoppingCart className="w-6 h-6" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                    {getCartCount()}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside
            className={`${
              sidebarOpen ? 'fixed inset-0 z-[60] bg-white p-6 overflow-y-auto' : 'hidden'
            } md:relative md:block w-full md:w-64 shrink-0 space-y-6`}
          >
            <div className="flex items-center justify-between md:hidden mb-8">
              <h2 className="text-2xl font-bold">Filters</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-8 sticky top-24">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-primary" />
                    Filters
                  </h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-primary hover:underline font-bold"
                    >
                      RESET
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <div className="mb-8">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Category</h4>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          selectedCategory === category
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="mb-8">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Price Range</h4>
                  <div className="space-y-3">
                    {priceRanges.map((range) => (
                      <label
                        key={range.label}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="price"
                          checked={
                            selectedPrice?.min === range.min &&
                            selectedPrice?.max === range.max
                          }
                          onChange={() => setSelectedPrice(range)}
                          className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                        />
                        <span className={`text-sm transition-colors ${
                          selectedPrice?.min === range.min ? 'text-primary font-bold' : 'text-gray-600 group-hover:text-gray-900'
                        }`}>
                          {range.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Our Products</h1>
                <p className="text-sm text-gray-500">Showing {filteredProducts.length} results</p>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 border border-dashed border-gray-200 rounded-3xl">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-gray-300" />
                </div>
                <p className="text-gray-500 mb-6 font-medium">No products found for your criteria</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="btn-secondary"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.slice(0, displayCount).map((product) => (
                    <div key={product.id} className="card group">
                      <div className="relative aspect-square bg-gray-50 overflow-hidden">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-sm text-[10px] font-bold uppercase tracking-wider text-primary">
                          {product.category}
                        </div>
                        {product.stock <= 5 && product.stock > 0 && (
                          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-error text-white text-[10px] font-bold uppercase tracking-wider animate-pulse">
                            Low Stock
                          </div>
                        )}
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                            <span className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold text-sm">OUT OF STOCK</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-6">
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-tight min-h-[3rem]">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center justify-between mb-4">
                          <div className="font-mono text-2xl font-bold text-gray-900">
                            {formatPrice(product.price)}
                          </div>
                          <div className="flex items-center gap-1 text-sm bg-gray-50 px-2 py-1 rounded-lg">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-gray-700">{product.rating}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                          className="w-full btn-primary flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredProducts.length > displayCount && (
                  <div className="text-center mt-16">
                    <button
                      onClick={() => setDisplayCount((prev) => prev + 12)}
                      className="btn-secondary px-12"
                    >
                      Load More Products
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-accent text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up z-50">
          <Check className="w-5 h-5" />
          <span className="font-bold text-sm">Added to cart successfully!</span>
        </div>
      )}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
