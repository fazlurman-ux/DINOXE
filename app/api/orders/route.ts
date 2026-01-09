import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOrderId } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Check for duplicate order within 60 seconds
    const recentOrder = await prisma.order.findFirst({
      where: {
        customerPhone: body.phoneNumber,
        createdAt: {
          gte: new Date(Date.now() - 60 * 1000),
        },
      },
    })

    if (recentOrder) {
      return NextResponse.json(
        { error: 'You can only place one order per minute. Please try again later.' },
        { status: 429 }
      )
    }

    const orderId = generateOrderId()

    const order = await prisma.order.create({
      data: {
        orderId,
        customerName: body.fullName,
        customerPhone: body.phoneNumber,
        customerEmail: body.email || null,
        deliveryAddress: body.deliveryAddress,
        alternatePhone: body.alternatePhone || null,
        deliveryInstructions: body.deliveryInstructions || null,
        totalAmount: body.totalAmount,
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
        orderStatus: 'Pending',
        items: {
          create: body.items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            productPrice: item.productPrice,
            quantity: item.quantity,
            subtotal: item.productPrice * item.quantity,
          })),
        },
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
