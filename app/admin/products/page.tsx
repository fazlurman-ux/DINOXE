'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, Plus, Pencil, Trash2, Search, Filter, LogOut, Menu, X, ChevronRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  rating: number
  isActive: boolean
  description: string
  specifications: string
  warranty: string
  imageUrl: string
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  useEffect(() => {
    checkAuth()
    fetchProducts()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (productId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      })

      if (response.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  const handleDelete = async (productId: string) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchProducts()
        setShowDeleteModal(false)
        setProductToDelete(null)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products'
      const method = editingProduct ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        fetchProducts()
        setShowEditModal(false)
        setEditingProduct(null)
      }
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 md:translate-x-0 md:static`}
      >
        <div className="p-6 border-b border-gray-50">
          <Link href="/" className="text-2xl font-bold tracking-tight text-primary">
            DINOXE
          </Link>
          <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Admin Panel</p>
        </div>
        <nav className="p-4 space-y-1">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            Orders
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-bold transition-all"
          >
            <Package className="w-5 h-5" />
            Products
          </Link>
          <Link
            href="/admin/refunds"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-all"
          >
            <TrendingUp className="w-5 h-5" />
            Refunds
          </Link>
          <div className="pt-8 mt-8 border-t border-gray-50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-all"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-xl font-bold text-gray-900">Products</h1>
            <button
              onClick={() => {
                setEditingProduct(null)
                setShowEditModal(true)
              }}
              className="btn-primary py-2 px-4 flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </header>

        <div className="p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase">Showing {filteredProducts.length} items</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-6 py-4 text-left">Product</th>
                    <th className="px-6 py-4 text-left">Category</th>
                    <th className="px-6 py-4 text-left">Price</th>
                    <th className="px-6 py-4 text-left">Stock</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-50 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                            <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 font-mono">{formatPrice(product.price)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-bold ${product.stock <= 5 ? 'text-red-600' : 'text-gray-900'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleActive(product.id, !product.isActive)}
                          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                            product.isActive
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {product.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(product)
                              setShowEditModal(true)
                            }}
                            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-100 text-primary transition-all"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setProductToDelete(product.id)
                              setShowDeleteModal(true)
                            }}
                            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-100 text-red-600 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {showEditModal && (
        <ProductEditModal
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => {
            setShowEditModal(false)
            setEditingProduct(null)
          }}
        />
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Delete Product?</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Are you sure you want to delete this product? This action cannot be undone and will remove it from the store.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setProductToDelete(null)
                }}
                className="btn-secondary flex-1 py-3"
              >
                Cancel
              </button>
              <button
                onClick={() => productToDelete && handleDelete(productToDelete)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all flex-1 shadow-lg shadow-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ProductEditModal({
  product,
  onSave,
  onClose,
}: {
  product: Product | null
  onSave: (data: Partial<Product>) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: '',
      category: 'Chargers',
      price: 0,
      stock: 0,
      rating: 4.5,
      description: '',
      specifications: '',
      warranty: '1 Year',
      imageUrl: '',
      isActive: true,
    }
  )

  const categories = [
    'Chargers',
    'Cables',
    'Cases',
    'Screen Protectors',
    'Earbuds',
    'Speakers',
    'Cooling Fan',
    'Phone Cooler',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full text-gray-400">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Product Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Category</label>
              <select
                value={formData.category || 'Chargers'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Price (₹)</label>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                className="input-field font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Stock Level</label>
              <input
                type="number"
                value={formData.stock || ''}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className="input-field font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Rating (1-5)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.rating || ''}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 4.5 })}
                className="input-field font-mono"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Image URL</label>
              <input
                type="text"
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="input-field"
                placeholder="https://images.unsplash.com/..."
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field min-h-[100px] resize-none"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Specifications</label>
              <textarea
                value={formData.specifications || ''}
                onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                className="input-field min-h-[80px] resize-none"
                placeholder="Feature 1, Feature 2, Feature 3..."
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Warranty</label>
              <input
                type="text"
                value={formData.warranty || ''}
                onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                className="input-field"
                placeholder="e.g. 1 Year"
                required
              />
            </div>
          </div>
          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-blue flex-1">Save Product</button>
          </div>
        </form>
      </div>
    </div>
  )
}
