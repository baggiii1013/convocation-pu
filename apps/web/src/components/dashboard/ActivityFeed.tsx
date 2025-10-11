import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target: string;
  timestamp: Date;
  type: "create" | "update" | "delete" | "upload";
}

// Mock data - replace with API call
const activities: Activity[] = [
  {
    id: "1",
    user: { name: "Admin User" },
    action: "uploaded",
    target: "attendance data for Spring 2025",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    type: "upload",
  },
  {
    id: "2",
    user: { name: "John Doe" },
    action: "registered for",
    target: "Spring 2025 Convocation",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    type: "create",
  },
  {
    id: "3",
    user: { name: "Admin User" },
    action: "updated",
    target: "venue allocation for Main Hall",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    type: "update",
  },
  {
    id: "4",
    user: { name: "Jane Smith" },
    action: "registered for",
    target: "Winter 2024 Graduation",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    type: "create",
  },
  {
    id: "5",
    user: { name: "Admin User" },
    action: "created",
    target: "new event: Spring 2025 Convocation",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    type: "create",
  },
];

const typeColors = {
  create: "success",
  update: "warning",
  delete: "error",
  upload: "default",
} as const;

const typeLabels = {
  create: "Created",
  update: "Updated",
  delete: "Deleted",
  upload: "Uploaded",
};

export function ActivityFeed() {
  return (
    <Card variant="default" padding="none">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div key={activity.id} className="relative">
              {/* Timeline line */}
              {index !== activities.length - 1 && (
                <div className="absolute left-4 top-10 h-full w-0.5 bg-gray-200 dark:bg-gray-700" />
              )}

              <div className="flex gap-4">
                {/* Avatar/Icon */}
                <div className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-sm font-medium text-white shadow-md">
                  {activity.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-semibold">{activity.user.name}</span>{" "}
                        <span className="text-gray-600 dark:text-gray-400">
                          {activity.action}
                        </span>{" "}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                    <Badge variant={typeColors[activity.type]} size="sm">
                      {typeLabels[activity.type]}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {activities.length === 0 && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <svg
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No recent activity to display
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
