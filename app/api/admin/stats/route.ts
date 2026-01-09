import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const totalOrders = await prisma.order.count()
    
    const orders = await prisma.order.findMany()
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
    
    const pendingOrders = await prisma.order.count({
      where: { orderStatus: 'Pending' },
    })
    
    const deliveredOrders = await prisma.order.count({
      where: { orderStatus: 'Delivered' },
    })

    return NextResponse.json({
      totalOrders,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
