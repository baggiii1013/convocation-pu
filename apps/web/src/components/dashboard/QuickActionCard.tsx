import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color?: string;
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
  color = "text-primary-500",
}: QuickActionCardProps) {
  return (
    <Link href={href}>
      <Card
        variant="default"
        padding="md"
        className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary-500/30"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary-500/50"
              )}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {description}
            </p>
          </div>
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-gray-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </Card>
    </Link>
  );
}
