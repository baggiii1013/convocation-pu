import { DashboardLayout } from "@/components/layouts/DashboardLayout";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout
      breadcrumbs={[
        { title: "Dashboard", href: "/dashboard" },
      ]}
    >
      {children}
    </DashboardLayout>
  );
}
