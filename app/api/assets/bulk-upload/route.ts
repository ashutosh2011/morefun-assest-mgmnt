import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';
import { writeFile } from 'fs/promises';
import path from 'path';

// Define a type for the row data
interface AssetRowData {
  customAssetId?: string;
  name: string;
  description?: string;
  assetUsage?: string;
  company: string;
  location: string;
  assetCategory: string;
  vendorName: string;
  billDate?: string;
  billNumber: string;
  openingBalance?: string;
  addition?: string;
  remarks?: string;
  assetTypeId: string;
  branchId: string;
  assignedUserId?: string;
  departmentId?: string;
  [key: string]: any;
}

export async function POST(request: Request) {
  try {
    const user = await auth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(buffer));
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json<AssetRowData>(worksheet);

    const errors: AssetRowData[] = [];
    const results: { progress: number; errors?: AssetRowData[] }[] = [];
    
    // Process each row
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        // Validate row data
        if (!row.name || !row.assetTypeId || !row.branchId) {
          throw new Error('Missing required fields: name, assetTypeId, or branchId');
        }

        // Create asset
        await prisma.asset.create({
          data: {
            customAssetId: row.customAssetId,
            assetName: row.name,
            description: row.description,
            assetUsage: row.assetUsage,
            company: row.company,
            location: row.location,
            assetCategory: row.assetCategory,
            vendorName: row.vendorName,
            billDate: row.billDate ? new Date(row.billDate) : null,
            billNumber: row.billNumber,
            openingBalance: parseFloat(row.openingBalance || '0'),
            addition: parseFloat(row.addition || '0'),
            quantity: 1,
            wdv: parseFloat(row.openingBalance || '0') + parseFloat(row.addition || '0'),
            remarks: row.remarks,
            assetUsageStatus: 'IN_USE',
            department: row.departmentId ? {
              connect: { id: row.departmentId }
            } : undefined,
            branch: {
              connect: { id: row.branchId }
            },
            user: row.assignedUserId ? {
              connect: { id: row.assignedUserId }
            } : undefined,
            assetType: {
              connect: { id: row.assetTypeId }
            }
          }
        });

      } catch (error) {
        errors.push({
          ...row,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Add progress to results
      results.push({
        progress: Math.round(((i + 1) / data.length) * 100),
        errors: errors.length > 0 ? errors : undefined
      });
    }

    return NextResponse.json({
      success: true,
      results,
      totalProcessed: data.length,
      errorsCount: errors.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.log('Bulk upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper function to create directory if it doesn't exist
async function createDirIfNotExists(dirPath: string) {
  try {
    await writeFile(dirPath, '', { flag: 'wx' });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error;
    }
  }
} 