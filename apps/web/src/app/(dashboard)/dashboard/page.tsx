import DashboardBento from "@/components/DashboardBento";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Dashboard Bento - Quick Navigation */}
      <div className="max-w-10xl mx-auto px-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Access
        </h2>
        <DashboardBento
          userRole="user"
          enableStars={true}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableTilt={false}
          clickEffect={true}
          enableMagnetism={true}
          spotlightRadius={200}
          particleCount={8}
        />
      </div>
    </div>
  );
}
