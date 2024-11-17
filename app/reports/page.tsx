'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { PieChart1, LineChart1 } from '@/components/Reports/Charts';
import { Loader2 } from 'lucide-react';
import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';

interface ReportsData {
  assetDistribution: {
    inUse: number;
    scrapRequested: number;
    scrapped: number;
  };
  monthlyTrends: {
    newAssets: number;
    newScrapRequests: number;
    scrappedAssets: number;
  };
  categoryWise: Array<{
    category: string;
    _count: number;
  }>;
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      const response = await fetchWithAuth('/api/reports');
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Asset Reports</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Distribution Chart */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Asset Distribution</h2>
          <PieChart1 data={data?.assetDistribution || { inUse: 0, scrapRequested: 0, scrapped: 0 }} />
        </Card>

        {/* Monthly Trends Chart */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Monthly Trends</h2>
          <LineChart1 data={data?.monthlyTrends || { newAssets: 0, newScrapRequests: 0, scrappedAssets: 0 }} />
        </Card>
      </div>

      {/* Summary Tables */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Overall Summary</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead>Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Total Assets In Use</TableCell>
              <TableCell>{data?.assetDistribution?.inUse || 0}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Scrap Requested</TableCell>
              <TableCell>{data?.assetDistribution?.scrapRequested || 0}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Scrapped Assets</TableCell>
              <TableCell>{data?.assetDistribution?.scrapped || 0}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>New Assets This Month</TableCell>
              <TableCell>{data?.monthlyTrends?.newAssets || 0}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>New Scrap Requests This Month</TableCell>
              <TableCell>{data?.monthlyTrends?.newScrapRequests || 0}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Scrapped This Month</TableCell>
              <TableCell>{data?.monthlyTrends?.scrappedAssets || 0}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}