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
    <div className="min-h-screen bg-mesh-gradient">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="text-2xl font-black tracking-tighter text-accent flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-background rounded-sm"></div>
              </div>
              <span className="hidden sm:inline">DINOXE</span>
            </Link>
            <div className="flex-1 max-w-xl">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent transition-colors" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/cart" className="relative p-2 text-gray-400 hover:text-accent transition-colors shrink-0">
                <ShoppingCart className="w-6 h-6" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-background text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-background">
                    {getCartCount()}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-accent transition-colors"
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
              sidebarOpen ? 'fixed inset-0 z-[60] bg-background/95 p-6 overflow-y-auto' : 'hidden'
            } md:relative md:block md:bg-transparent md:p-0 w-64 shrink-0 space-y-6`}
          >
            <div className="flex items-center justify-between md:hidden mb-8">
              <h2 className="text-2xl font-bold">Filters</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-8 sticky top-24">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold flex items-center gap-2">
                    <Filter className="w-4 h-4 text-accent" />
                    Filters
                  </h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-accent hover:underline font-bold"
                    >
                      RESET
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <div className="mb-8">
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Category</h4>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          selectedCategory === category
                            ? 'bg-accent text-background font-bold'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="mb-8">
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Price Range</h4>
                  <div className="space-y-2">
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
                          className="w-4 h-4 accent-accent bg-transparent border-white/20"
                        />
                        <span className={`text-sm transition-colors ${
                          selectedPrice?.min === range.min ? 'text-white font-bold' : 'text-gray-400 group-hover:text-gray-200'
                        }`}>
                          {range.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-gray-900">
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
                <h1 className="text-3xl font-black mb-1">Our Products</h1>
                <p className="text-sm text-gray-500">Showing {filteredProducts.length} results</p>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-gray-600" />
                </div>
                <p className="text-gray-400 mb-6 font-medium">No products found for your criteria</p>
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
                    <div key={product.id} className="group flex flex-col">
                      <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-white/5 overflow-hidden group-hover:border-accent/30 transition-all duration-500 mb-4">
                        <Link href={`/product/${product.id}`} className="absolute inset-0 flex items-center justify-center p-12 opacity-30 group-hover:scale-110 transition-transform duration-700">
                          <ShoppingCart className="w-full h-full text-gray-700" />
                        </Link>
                        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-wider text-accent">
                          {product.category}
                        </div>
                        {product.stock <= 5 && product.stock > 0 && (
                          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-error text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                            Low Stock
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-t from-background to-transparent">
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                            className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            {product.stock > 0 ? 'QUICK ADD' : 'OUT OF STOCK'}
                          </button>
                        </div>
                      </div>
                      
                      <Link href={`/product/${product.id}`} className="flex-1 flex flex-col">
                        <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors line-clamp-2 leading-tight">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="font-mono text-2xl font-black text-white">
                            {formatPrice(product.price)}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="font-black">{product.rating}</span>
                          </div>
                        </div>
                      </Link>
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
        <div className="fixed bottom-8 right-8 bg-accent text-background px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up z-50">
          <div className="w-6 h-6 bg-background rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-accent" />
          </div>
          <span className="font-black text-sm tracking-tight">ADDED TO YOUR CART</span>
        </div>
      )}
    </div>
  )
}
