import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const user = await auth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const departmentId = searchParams.get('departmentId');
    const type = searchParams.get('type') || 'excel'; // 'excel' or 'csv'

    // Build where clause based on filters
    const where = {
      AND: [
        status ? { assetUsageStatus: status } : {},
        departmentId ? { departmentId } : {},
      ]
    };

    // Fetch assets with all related data
    const assets = await prisma.asset.findMany({
      where,
      include: {
        department: true,
        branch: true,
        user: true,
        assetType: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform data for export
    const exportData = assets.map(asset => ({
      'Asset ID': asset.id,
      'Custom Asset ID': asset.customAssetId || 'N/A',
      'Asset Name': asset.assetName,
      'Description': asset.description || 'N/A',
      'Serial Number': asset.serialNumber || 'N/A',
      'Asset Type': asset.assetType.assetTypeName,
      'Department': asset.department?.departmentName || 'N/A',
      'Branch': asset.branch.branchName,
      'Assigned To': asset.user?.fullName || 'N/A',
      'Status': asset.assetUsageStatus,
      'Location': asset.location,
      'Company': asset.company,
      'Category': asset.assetCategory,
      'Vendor': asset.vendorName,
      'Bill Number': asset.billNumber,
      'Bill Date': asset.billDate?.toLocaleDateString() || 'N/A',
      'Opening Balance': asset.openingBalance,
      'Addition': asset.addition,
      'Depreciation': asset.depreciation,
      'WDV': asset.wdv,
      'Cumulative Depreciation': asset.cumulativeDepreciation,
      'Usage': asset.assetUsage || 'N/A',
      'Remarks': asset.remarks || 'N/A',
      'Created At': asset.createdAt.toLocaleDateString(),
      'Last Updated': asset.updatedAt.toLocaleDateString()
    }));

    if (type === 'csv') {
      // Generate CSV
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      
      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=assets.csv'
        }
      });
    } else {
      // Generate Excel
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Assets');
      
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
      return new Response(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename=assets.xlsx'
        }
      });
    }
  } catch (error) {
    console.error('Error generating export:', error);
    
    // If it's a Prisma error, we can be more specific
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { 
          error: 'Database error',
          message: 'Failed to fetch assets data'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to generate export',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
} 