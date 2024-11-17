import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await auth(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assetCategories = [
        {id:"IT", name: "Information Technology"},
        {id:"Non-IT", name: "Non-Information Technology"}
    ]

    return NextResponse.json(assetCategories);
  } catch (error) {
    console.error('Error fetching asset categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch asset types' },
      { status: 500 }
    );
  }
}