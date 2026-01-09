import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const refund = await prisma.refund.update({
      where: { id: params.id },
      data: {
        status: body.status,
        ...(body.status === 'Processed' && { processedAt: new Date() }),
      },
    })

    return NextResponse.json(refund)
  } catch (error) {
    console.error('Error updating refund:', error)
    return NextResponse.json(
      { error: 'Failed to update refund' },
      { status: 500 }
    )
  }
}
