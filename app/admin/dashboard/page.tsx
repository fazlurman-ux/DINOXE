'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Package, Users, TrendingUp, Search, Filter, Eye, LogOut, Menu, X, ChevronRight, MoreVertical } from 'lucide-react'
import { formatPrice, formatDate, formatDateTime } from '@/lib/utils'

interface Order {
  id: string
  orderId: string
  customerName: string
  customerPhone: string
  totalAmount: number
  orderStatus: string
  createdAt: string
  items: Array<{
    productName: string
    quantity: number
  }>
}

interface Stats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  deliveredOrders: number
}

const statusOptions = ['All', 'Pending', 'Dispatched', 'Delivered', 'Refund Pending', 'Refunded']

export default function AdminDashboardPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    checkAuth()
    fetchOrders()
    fetchStats()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus }),
      })

      if (response.ok) {
        fetchOrders()
        fetchStats()
        if (selectedOrder) {
          setSelectedOrder({ ...selectedOrder, orderStatus: newStatus })
        }
      }
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery)
    const matchesStatus = selectedStatus === 'All' || order.orderStatus === selectedStatus
    return matchesSearch && matchesStatus
  })

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Dispatched': return 'bg-blue-100 text-blue-800'
      case 'Delivered': return 'bg-green-100 text-green-800'
      case 'Refund Pending': return 'bg-red-100 text-red-800'
      case 'Refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

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
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-bold transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            Orders
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-all"
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
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm font-medium text-gray-500 hover:text-primary">View Store</Link>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs">A</div>
            </div>
          </div>
        </header>

        <div className="p-6 overflow-y-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Orders</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalOrders}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Revenue</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{formatPrice(stats.totalRevenue)}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600">
                  <Package className="w-6 h-6" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingOrders}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Delivered</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.deliveredOrders}</h3>
            </div>
          </div>

          {/* Orders Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status} Status</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-6 py-4 text-left">Order ID</th>
                    <th className="px-6 py-4 text-left">Customer</th>
                    <th className="px-6 py-4 text-left">Amount</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 text-sm font-mono font-bold text-gray-900">{order.orderId}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">{order.customerName}</div>
                        <div className="text-xs text-gray-500 font-mono">{order.customerPhone}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">{formatPrice(order.totalAmount)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(new Date(order.createdAt))}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowDetailModal(true)
                          }}
                          className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-100 text-primary transition-all"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginatedOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">No orders found matching your criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500 font-medium">Page {currentPage} of {totalPages}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <p className="text-xs font-mono text-gray-500 uppercase">{selectedOrder.orderId}</p>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-50 rounded-full text-gray-400">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-8 text-sm">
                <div>
                  <p className="text-gray-400 font-bold uppercase text-[10px] mb-2 tracking-widest">Customer</p>
                  <p className="font-bold text-gray-900">{selectedOrder.customerName}</p>
                  <p className="text-gray-600 font-mono mt-1">{selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold uppercase text-[10px] mb-2 tracking-widest">Order Placed</p>
                  <p className="font-bold text-gray-900">{formatDateTime(new Date(selectedOrder.createdAt))}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-400 font-bold uppercase text-[10px] mb-4 tracking-widest">Items Ordered</p>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-xl">
                      <span className="font-bold text-gray-900 text-sm">{item.productName}</span>
                      <span className="bg-white px-2 py-1 rounded text-xs font-bold border border-gray-100">× {item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-between items-center border-t border-gray-100 pt-4">
                  <span className="text-gray-500 font-bold uppercase text-xs">Total Revenue</span>
                  <span className="text-2xl font-bold text-primary font-mono">{formatPrice(selectedOrder.totalAmount)}</span>
                </div>
              </div>

              <div>
                <p className="text-gray-400 font-bold uppercase text-[10px] mb-4 tracking-widest">Update Order Status</p>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.slice(1).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedOrder.id, status)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                        selectedOrder.orderStatus === status
                          ? 'bg-primary text-white shadow-lg shadow-primary/20'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
