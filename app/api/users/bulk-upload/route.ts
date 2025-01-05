import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { parse } from 'csv-parse';

function generateEmail(name: string): string {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${cleanName}+${random}@asmgnt.com`;
}

function generateUsername(name: string): string {
  // Convert to lowercase and remove special characters
  const cleanName = name.toLowerCase().replace(/[^a-z\s]/g, '');
  // Replace spaces with dots and add random numbers
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${cleanName.replace(/\s+/g, '.')}.${random}`;
}

export async function POST(request: Request) {
  try {
    const user = await auth(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const uploadType = formData.get('type') as string;
    
    let names: string[] = [];

    if (uploadType === 'file') {
      const file = formData.get('file') as File;
      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }
      const text = await file.text();
      const records = await new Promise<any[]>((resolve, reject) => {
        parse(text, {
          columns: true,
          skip_empty_lines: true,
        }, (err, records) => {
          if (err) reject(err);
          else resolve(records);
        });
      });
      names = records.map(record => record.fullName || record.name || record.Name || '').filter(Boolean);
    } else {
      const namesText = formData.get('names') as string;
      if (!namesText) {
        return NextResponse.json({ error: 'No names provided' }, { status: 400 });
      }
      names = namesText.split(/[,\n]/).map(name => name.trim()).filter(Boolean);
    }

    // Get the basic user role
    const basicRole = await prisma.role.findFirst({
      where: {
        roleName: 'User'
      }
    });

    if (!basicRole) {
      return NextResponse.json({ error: 'Basic user role not found' }, { status: 500 });
    }

    // Create users
    await prisma.$transaction(
      names.map(fullName => 
        prisma.user.create({
          data: {
            fullName,
            username: generateUsername(fullName),
            email: generateEmail(fullName),
            password: '123456', // TODO: Hash this password
            roleId: basicRole.id,
          },
        })
      )
    );

    return NextResponse.json({ success: true, count: names.length });
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error in bulk upload:', error.message);
    } else {
      console.log('Unknown error in bulk upload');
    }
    return NextResponse.json(
      { error: 'Failed to process bulk upload' },
      { status: 500 }
    );
  }
} 