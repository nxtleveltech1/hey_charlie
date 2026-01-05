import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/bookings", label: "Bookings", icon: "📅" },
  { href: "/admin/packages", label: "Packages", icon: "📦" },
  { href: "/admin/customers", label: "Customers", icon: "👥" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-[var(--theme-border)] bg-[var(--theme-nav-bg)] backdrop-blur-xl">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-3 mb-8">
            <Image
              src="/logo2.png"
              alt="Hey Charlie Charters"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div>
              <span className="text-lg font-bold italic bg-gradient-to-r from-cyan-300 via-sky-400 to-cyan-300 bg-clip-text text-transparent">
                Admin
              </span>
              <span className="block text-xs text-orange-500">Hey Charlie</span>
            </div>
          </Link>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-surface)] transition-colors"
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-[var(--theme-border)]">
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-[var(--theme-text-muted)] truncate">
                {user.email}
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="mt-4 block text-center py-2 rounded-lg text-sm text-[var(--theme-text-muted)] hover:bg-[var(--theme-surface)] transition-colors"
          >
            ← Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}

