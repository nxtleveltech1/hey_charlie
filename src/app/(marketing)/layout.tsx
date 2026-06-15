import { MarketingChrome } from "@/components/layouts/marketing-chrome";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)]">
      <MarketingChrome>{children}</MarketingChrome>
    </main>
  );
}
