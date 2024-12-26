import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await auth(request);
    
    if (!user || user.role.roleName !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Check if department name already exists (excluding current department)
    const existingDepartment = await prisma.department.findFirst({
      where: {
        departmentName: data.departmentName,
        id: { not: params.id }
      }
    });

    if (existingDepartment) {
      return NextResponse.json(
        { error: 'Department name already exists' },
        { status: 400 }
      );
    }

    const department = await prisma.department.update({
      where: { id: params.id },
      data: {
        departmentName: data.departmentName,
        region: data.region,
      },
    });

    return NextResponse.json(department);
  } catch (error) {
    console.error('Error updating department:', error);
    return NextResponse.json(
      { error: 'Failed to update department' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await auth(request);
    
    if (!user || user.role.roleName !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if department has associated users or assets
    const departmentInUse = await prisma.department.findUnique({
      where: { id: params.id },
      include: {
        users: { select: { id: true }, take: 1 },
        assets: { select: { id: true }, take: 1 },
      },
    });

    if (departmentInUse?.users.length || departmentInUse?.assets.length) {
      return NextResponse.json(
        { error: 'Cannot delete department with associated users or assets' },
        { status: 400 }
      );
    }

    await prisma.department.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Error deleting department:', error);
    return NextResponse.json(
      { error: 'Failed to delete department' },
      { status: 500 }
    );
  }
} 