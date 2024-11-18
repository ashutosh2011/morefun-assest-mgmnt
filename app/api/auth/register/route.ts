import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json();

    // Validate input
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get default user role (you might want to store this ID in an env variable or constants)
    const defaultRole = await prisma.role.findFirst({
      where: { roleName: 'User' },
    });

    if (!defaultRole) {
      return NextResponse.json(
        { message: 'Default role not found' },
        { status: 500 }
      );
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        username: email,
        password: hashedPassword,
        fullName,
        // phoneNumber: "999999999",
        departmentId: "920a9b4b-ca0c-409f-b986-7d1ea00444aa",
        roleId: defaultRole.id,
        isActive: true,
      },
      include: { role: true },
    });

    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role.roleName,
      },
    });

  } catch (error) {
    console.error('Registration error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 