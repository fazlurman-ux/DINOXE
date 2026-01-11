'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Package, TrendingUp, LogOut, Menu, X, Check, Clock } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'

interface Refund {
  id: string
  orderId: string
  amount: number
  reason?: string
  status: 'Pending' | 'Processed'
  createdAt: string
  processedAt?: string
  order?: {
    customerName: string
    orderId: string
  }
}

export default function AdminRefundsPage() {
  const router = useRouter()
  const [refunds, setRefunds] = useState<Refund[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    checkAuth()
    fetchRefunds()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
    }
  }

  const fetchRefunds = async () => {
    try {
      const response = await fetch('/api/admin/refunds')
      if (response.ok) {
        const data = await response.json()
        setRefunds(data)
      }
    } catch (error) {
      console.error('Error fetching refunds:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProcessRefund = async (refundId: string) => {
    if (!confirm('Are you sure you want to mark this refund as processed?')) return

    try {
      const response = await fetch(`/api/admin/refunds/${refundId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Processed' }),
      })

      if (response.ok) {
        fetchRefunds()
      }
    } catch (error) {
      console.error('Error processing refund:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
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
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-all"
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
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-bold transition-all"
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
            <h1 className="text-xl font-bold text-gray-900">Refunds Log</h1>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs">A</div>
          </div>
        </header>

        <div className="p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50">
              <h2 className="text-lg font-bold text-gray-900">All Refund Requests</h2>
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
                  {refunds.map((refund) => (
                    <tr key={refund.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono font-bold text-gray-900">
                        {refund.order?.orderId || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">{refund.order?.customerName || 'Unknown'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 font-mono">
                        {formatPrice(refund.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit ${
                          refund.status === 'Processed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {refund.status === 'Processed' ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {refund.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(new Date(refund.createdAt))}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {refund.status === 'Pending' ? (
                          <button
                            onClick={() => handleProcessRefund(refund.id)}
                            className="btn-blue py-1 px-4 text-xs font-bold"
                          >
                            Complete Refund
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium">Processed on {refund.processedAt ? formatDate(new Date(refund.processedAt)) : '-'}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {refunds.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">No refund requests found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
