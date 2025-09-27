import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from './auth'

export async function requireAuth(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return user
}

export async function requireAdmin(request: NextRequest) {
  const user = await requireAuth(request)
  if (user instanceof NextResponse) return user
  
  if (user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
  }
  return user
}

export async function checkNoteLimit(tenantId: string) {
  const { prisma } = await import('./db')
  
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: { _count: { select: { notes: true } } },
  })

  if (!tenant) {
    throw new Error('Tenant not found')
  }

  if (tenant.plan === 'FREE' && tenant._count.notes >= 3) {
    return { canCreate: false, limit: 3, current: tenant._count.notes }
  }

  return { canCreate: true, limit: tenant.plan === 'FREE' ? 3 : Infinity, current: tenant._count.notes }
}
