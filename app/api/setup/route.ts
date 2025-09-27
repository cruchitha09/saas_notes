import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    // Create tenants
    const acmeTenant = await prisma.tenant.upsert({
      where: { slug: 'acme' },
      update: {},
      create: {
        slug: 'acme',
        name: 'Acme Corporation',
        plan: 'FREE',
      },
    })

    const globexTenant = await prisma.tenant.upsert({
      where: { slug: 'globex' },
      update: {},
      create: {
        slug: 'globex',
        name: 'Globex Corporation',
        plan: 'FREE',
      },
    })

    // Hash password
    const hashedPassword = await bcrypt.hash('password', 10)

    // Create users for Acme
    await prisma.user.upsert({
      where: { email: 'admin@acme.test' },
      update: {},
      create: {
        email: 'admin@acme.test',
        password: hashedPassword,
        role: 'ADMIN',
        tenantId: acmeTenant.id,
      },
    })

    await prisma.user.upsert({
      where: { email: 'user@acme.test' },
      update: {},
      create: {
        email: 'user@acme.test',
        password: hashedPassword,
        role: 'MEMBER',
        tenantId: acmeTenant.id,
      },
    })

    // Create users for Globex
    await prisma.user.upsert({
      where: { email: 'admin@globex.test' },
      update: {},
      create: {
        email: 'admin@globex.test',
        password: hashedPassword,
        role: 'ADMIN',
        tenantId: globexTenant.id,
      },
    })

    await prisma.user.upsert({
      where: { email: 'user@globex.test' },
      update: {},
      create: {
        email: 'user@globex.test',
        password: hashedPassword,
        role: 'MEMBER',
        tenantId: globexTenant.id,
      },
    })

    return NextResponse.json({ 
      message: 'Database setup completed successfully!',
      tenants: [acmeTenant, globexTenant]
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: 'Setup failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
