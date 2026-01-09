import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const recentOrder = await prisma.order.findFirst({
      where: {
        customerPhone: body.phone,
        createdAt: {
          gte: new Date(Date.now() - 60 * 1000),
        },
      },
    })

    if (recentOrder) {
      const timePassed = Math.floor((Date.now() - new Date(recentOrder.createdAt).getTime()) / 1000)
      const remainingTime = 60 - timePassed
      return NextResponse.json(
        { message: `Please wait ${remainingTime} seconds before placing another order` },
        { status: 429 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error checking cooldown:', error)
    return NextResponse.json(
      { error: 'Failed to check cooldown' },
      { status: 500 }
    )
  }
}
