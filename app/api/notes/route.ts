import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware'
import { checkNoteLimit } from '@/lib/middleware'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    if (user instanceof NextResponse) return user

    const notes = await prisma.note.findMany({
      where: { tenantId: user.tenantId },
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error('Get notes error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    if (user instanceof NextResponse) return user

    const { title, content } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Check note limit
    const limitCheck = await checkNoteLimit(user.tenantId)
    if (!limitCheck.canCreate) {
      return NextResponse.json(
        { 
          error: 'Note limit reached. Upgrade to Pro for unlimited notes.',
          limit: limitCheck.limit,
          current: limitCheck.current
        },
        { status: 403 }
      )
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        tenantId: user.tenantId,
        userId: user.id,
      },
      include: { user: { select: { email: true } } },
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error('Create note error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
