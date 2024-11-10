import React from 'react';
import { Clock } from 'lucide-react';

interface Activity {
  id: number;
  action: string;
  timestamp: string;
  type: string;
}

const activities: Activity[] = [
  { id: 1, action: "Added new laptop asset", timestamp: "2 hours ago", type: "add" },
  { id: 2, action: "Submitted scrap request for old printer", timestamp: "5 hours ago", type: "scrap" },
  { id: 3, action: "Updated monitor details", timestamp: "1 day ago", type: "update" },
  { id: 4, action: "Added new desktop computer", timestamp: "2 days ago", type: "add" },
];

export function ActivityList() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-[#2C3E50] mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="mt-1">
              <Clock size={16} className="text-[#18BC9C]" />
            </div>
            <div>
              <p className="text-sm text-[#2C3E50]">{activity.action}</p>
              <p className="text-xs text-gray-500">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}