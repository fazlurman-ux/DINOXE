'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, Check, LogOut, Menu, X } from 'lucide-react'
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transition-transform duration-300 md:translate-x-0 md:static`}
      >
        <div className="p-6">
          <Link href="/" className="text-2xl font-bold text-accent block">
            DINOXE Admin
          </Link>
        </div>
        <nav className="px-4 py-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors text-gray-400 hover:text-white"
          >
            <Package className="w-5 h-5" />
            Orders
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors text-gray-400 hover:text-white"
          >
            <Package className="w-5 h-5" />
            Products
          </Link>
          <Link
            href="/admin/refunds"
            className="flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors bg-accent/10 text-accent"
          >
            <Check className="w-5 h-5" />
            Refunds
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-error hover:bg-error/10 transition-colors mt-4"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-text"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-xl font-bold">Refunds</h1>
            <Link href="/" className="text-sm text-gray-400 hover:text-accent">
              View Store
            </Link>
          </div>
        </header>

        <div className="p-6">
          {/* Refunds Table */}
          <div className="card">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold">Refund Requests</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium">Refund ID</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Order ID</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Reason</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {refunds.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                        No refund requests found
                      </td>
                    </tr>
                  ) : (
                    refunds.map((refund) => (
                      <tr key={refund.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-sm">{refund.id.slice(0, 8)}...</td>
                        <td className="px-6 py-4 font-mono text-sm">{refund.orderId}</td>
                        <td className="px-6 py-4">{refund.order?.customerName || 'N/A'}</td>
                        <td className="px-6 py-4 font-mono font-medium">{formatPrice(refund.amount)}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{refund.reason || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              refund.status === 'Processed'
                                ? 'bg-success/20 text-success'
                                : 'bg-warning/20 text-warning'
                            }`}
                          >
                            {refund.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">{formatDate(new Date(refund.createdAt))}</td>
                        <td className="px-6 py-4">
                          {refund.status === 'Pending' && (
                            <button
                              onClick={() => handleProcessRefund(refund.id)}
                              className="btn-primary text-sm px-3 py-1 flex items-center gap-1"
                            >
                              <Check className="w-4 h-4" />
                              Process
                            </button>
                          )}
                          {refund.status === 'Processed' && (
                            <span className="text-sm text-gray-400">
                              {refund.processedAt ? formatDate(new Date(refund.processedAt)) : '-'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
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
