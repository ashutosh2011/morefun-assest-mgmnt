'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const COLORS = ['#36A2EB', '#FFCE56', '#FF6384'];

interface AssetDistribution {
  inUse: number;
  scrapRequested: number;
  scrapped: number;
}

interface MonthlyTrends {
  newAssets: number;
  newScrapRequests: number;
  scrappedAssets: number;
}

export function PieChart1({ data }: { data: AssetDistribution }) {
  const pieData = [
    { name: 'In Use', value: data.inUse },
    { name: 'Scrap Requested', value: data.scrapRequested },
    { name: 'Scrapped', value: data.scrapped }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function LineChart1({ data }: { data: MonthlyTrends }) {
  const lineData = [
    {
      name: 'Current Month',
      newAssets: data.newAssets,
      newScrapRequests: data.newScrapRequests,
      scrappedAssets: data.scrappedAssets
    }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={lineData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="newAssets" 
          stroke="#36A2EB" 
          name="New Assets" 
        />
        <Line 
          type="monotone" 
          dataKey="newScrapRequests" 
          stroke="#FFCE56" 
          name="New Scrap Requests" 
        />
        <Line 
          type="monotone" 
          dataKey="scrappedAssets" 
          stroke="#FF6384" 
          name="Scrapped Assets" 
        />
      </LineChart>
    </ResponsiveContainer>
  );
} 