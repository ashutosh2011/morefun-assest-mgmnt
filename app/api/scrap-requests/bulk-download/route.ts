import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';

export async function GET(request: Request) {
  try {
    const user = await auth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type') || 'excel'; // 'excel' or 'csv'

    // Build where clause based on filters
    const where = status ? { status: status.toUpperCase() } : {};

    // Fetch scrap requests with all related data
    const scrapRequests = await prisma.scrapRequest.findMany({
      where,
      include: {
        asset: {
          select: {
            assetName: true,
            billNumber: true,
            assetType: {
              select: { assetTypeName: true }
            }
          }
        },
        requestedBy: {
          select: {
            fullName: true,
            email: true
          }
        },
        currentApprovalLevel: {
          select: {
            levelNumber: true,
            role: {
              select: { roleName: true }
            }
          }
        },
        approvals: {
          select: {
            status: true,
            comments: true,
            approver: {
              select: { fullName: true }
            },
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform data for export
    const exportData = scrapRequests.map(request => ({
      'Request ID': request.id,
      'Asset Name': request.asset.assetName,
      'Bill Number': request.asset.billNumber,
      'Asset Type': request.asset.assetType.assetTypeName,
      'Requester Name': request.requestedBy.fullName,
      'Requester Email': request.requestedBy.email,
      'Request Date': request.createdAt.toLocaleDateString(),
      'Status': request.status,
      'Current Level': `Level ${request.currentApprovalLevel.levelNumber} - ${request.currentApprovalLevel.role.roleName}`,
      'Reason': request.reason,
      'Latest Approval': request.approvals.length > 0 ? request.approvals[request.approvals.length - 1].status : 'N/A',
      'Latest Comments': request.approvals.length > 0 ? request.approvals[request.approvals.length - 1].comments : 'N/A'
    }));

    if (type === 'csv') {
      // Generate CSV
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      
      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=scrap-requests.csv'
        }
      });
    } else {
      // Generate Excel
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Scrap Requests');
      
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
      return new Response(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename=scrap-requests.xlsx'
        }
      });
    }
  } catch (error) {
    console.error('Error generating export:', error);
    return NextResponse.json(
      { error: 'Failed to generate export' },
      { status: 500 }
    );
  }
} 