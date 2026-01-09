'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, ShoppingCart, Star, Filter, X, ChevronDown, Menu } from 'lucide-react'
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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
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
    applyFilters()
  }, [products, searchQuery, selectedCategory, selectedPrice, sortBy])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching products:', error)
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    // Price filter
    if (selectedPrice) {
      filtered = filtered.filter(
        (p) => p.price >= selectedPrice.min && p.price <= selectedPrice.max
      )
    }

    // Sort
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="text-xl md:text-2xl font-bold text-accent shrink-0">
              DINOXE
            </Link>
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/cart" className="text-text hover:text-accent transition-colors flex items-center gap-2 shrink-0">
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden md:inline">Cart</span>
                {getCartCount() > 0 && (
                  <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">
                    {getCartCount()}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden text-text"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside
            className={`${
              sidebarOpen ? 'block' : 'hidden'
            } md:block w-64 shrink-0 space-y-6`}
          >
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-accent hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="w-4 h-4 accent-accent"
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label
                      key={range.label}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="price"
                        checked={
                          selectedPrice?.min === range.min &&
                          selectedPrice?.max === range.max
                        }
                        onChange={() => setSelectedPrice(range)}
                        className="w-4 h-4 accent-accent"
                      />
                      <span className="text-sm">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="font-medium mb-3">Sort By</h3>
                <div className="space-y-2">
                  {sortOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="sort"
                        checked={sortBy === option.value}
                        onChange={() => setSortBy(option.value)}
                        className="w-4 h-4 accent-accent"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold">All Products</h1>
              <div className="text-gray-400">
                {filteredProducts.length} products
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-400 mb-4">No products found</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="btn-secondary"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.slice(0, displayCount).map((product) => (
                    <div key={product.id} className="card group">
                      <Link href={`/product/${product.id}`} className="block">
                        <div className="aspect-square bg-gray-800 flex items-center justify-center text-gray-600 relative overflow-hidden">
                          <ShoppingCart className="w-16 h-16" />
                          <div className="absolute top-2 right-2 bg-accent text-white text-xs px-2 py-1 rounded">
                            {product.category}
                          </div>
                        </div>
                      </Link>
                      <div className="p-4">
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-medium mb-2 group-hover:text-accent transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-mono text-lg font-bold">
                            {formatPrice(product.price)}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {product.rating}
                          </div>
                        </div>
                        <div
                          className={`text-sm mb-3 ${
                            product.stock > 0 ? 'text-success' : 'text-error'
                          }`}
                        >
                          {product.stock > 0
                            ? `${product.stock} in stock`
                            : 'Out of stock'}
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                          className={`w-full py-2 rounded-lg font-medium transition-all ${
                            product.stock > 0
                              ? 'bg-accent hover:bg-accent-hover text-white'
                              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {product.stock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredProducts.length > displayCount && (
                  <div className="text-center mt-8">
                    <button
                      onClick={() => setDisplayCount((prev) => prev + 12)}
                      className="btn-secondary"
                    >
                      Load More
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
        <div className="toast bg-success text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <span className="text-xl font-bold">✓</span>
          <span className="font-medium">Added to cart</span>
        </div>
      )}
    </div>
  )
}
