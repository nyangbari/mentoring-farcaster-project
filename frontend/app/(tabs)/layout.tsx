import BottomNav from "@/components/custom/BottomNav";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen pb-16">
      {children}
      <BottomNav />
    </div>
  );
}
