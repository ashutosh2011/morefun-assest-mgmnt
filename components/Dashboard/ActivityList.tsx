'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { Activity } from '@/types/activity';

export function ActivityList() {
  const [activities, setActivities] = React.useState<Activity[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/dashboard/activities', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-[#2C3E50] mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.length > 0 ? (
          <>
            {activities.map((activity) => (

              <div key={activity.id} className="flex items-start space-x-3">
                <div className="mt-1">
                  <Clock size={16} className="text-[#18BC9C]" />
                </div>
                <div>
                  <p className="text-sm text-[#2C3E50]">
                    {activity.user.fullName} {activity.details}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div>No activities found</div>
        )}
      </div>
    </div>
  );
}