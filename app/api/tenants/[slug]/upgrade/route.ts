import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/middleware'
import { prisma } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await requireAdmin(request)
    if (user instanceof NextResponse) return user

    // Verify the user belongs to the tenant they're trying to upgrade
    const tenant = await prisma.tenant.findUnique({
      where: { slug: params.slug },
    })

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      )
    }

    if (tenant.id !== user.tenantId) {
      return NextResponse.json(
        { error: 'Forbidden - You can only upgrade your own tenant' },
        { status: 403 }
      )
    }

    if (tenant.plan === 'PRO') {
      return NextResponse.json(
        { error: 'Tenant is already on Pro plan' },
        { status: 400 }
      )
    }

    const updatedTenant = await prisma.tenant.update({
      where: { slug: params.slug },
      data: { plan: 'PRO' },
    })

    return NextResponse.json({
      message: 'Tenant upgraded to Pro successfully',
      tenant: updatedTenant,
    })
  } catch (error) {
    console.error('Upgrade tenant error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
