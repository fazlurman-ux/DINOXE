'use client'

import React, { useEffect } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'warning'
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = {
    success: 'bg-success',
    error: 'bg-error',
    warning: 'bg-warning',
  }[type]

  const icon = {
    success: '✓',
    error: '✕',
    warning: '⚠',
  }[type]

  return (
    <div className={`toast ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
      <span className="text-xl font-bold">{icon}</span>
      <span className="font-medium">{message}</span>
    </div>
  )
}
