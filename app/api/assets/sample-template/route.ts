import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  const headers = [
    'customAssetId',
    'name',
    'description',
    'assetUsage',
    'company',
    'location',
    'assetCategory',
    'vendorName',
    'billDate',
    'billNumber',
    'openingBalance',
    'addition',
    'remarks',
    'assetTypeId',
    'branchId',
    'assignedUserId',
    'departmentId'
  ];

  if (type === 'csv') {
    const csvContent = headers.join(',') + '\n';
    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=asset-template.csv'
      }
    });
  } else {
    const worksheet = XLSX.utils.aoa_to_sheet([headers]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Assets');
    
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=asset-template.xlsx'
      }
    });
  }
} 