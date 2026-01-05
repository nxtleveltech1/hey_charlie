import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] transition-colors duration-300">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-[var(--theme-border)] bg-[var(--theme-nav-bg)] backdrop-blur-xl p-6">
        <Link href="/" className="flex items-center gap-3 mb-10">
          <Image
            src="/logo2.png"
            alt="Hey Charlie Charters"
            width={50}
            height={50}
            className="rounded-lg"
          />
          <div>
            <span 
              className="text-lg font-bold italic bg-gradient-to-r from-cyan-300 via-sky-400 to-cyan-300 bg-clip-text text-transparent"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Hey Charlie
            </span>
            <span className="block text-xs font-semibold italic tracking-wider bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
              CHARTERS
            </span>
          </div>
        </Link>

        <nav className="space-y-1">
          {[
            { label: "Dashboard", href: "/dashboard", active: true, icon: "📊" },
            { label: "My Bookings", href: "/dashboard/bookings", active: false, icon: "📅" },
            { label: "Experiences", href: "/#packages", active: false, icon: "⛵" },
            { label: "Favorites", href: "/dashboard/favorites", active: false, icon: "❤️" },
            { label: "Settings", href: "/dashboard/settings", active: false, icon: "⚙️" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                item.active
                  ? "bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-[var(--theme-text)] border border-orange-500/20"
                  : "text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-surface)]"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Link
            href="/#packages"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Book Experience
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>
              Welcome back, {user.firstName || "Adventurer"}! 👋
            </h1>
            <p className="text-[var(--theme-text-muted)] text-sm">
              Ready for your next Cape Town adventure?
            </p>
          </div>
          <div className="flex items-center gap-4">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 ring-2 ring-orange-500/30",
                },
              }}
            />
          </div>
        </header>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          {[
            { label: "Book a Cruise", icon: "🌅", href: "/#packages", color: "from-orange-500 to-pink-500" },
            { label: "View Offers", icon: "🎉", href: "/#packages", color: "from-cyan-500 to-blue-500" },
            { label: "Contact Us", icon: "💬", href: "/#contact", color: "from-emerald-500 to-teal-500" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`p-6 rounded-2xl bg-gradient-to-br ${action.color} text-white hover:opacity-90 transition-opacity`}
            >
              <div className="text-3xl mb-3">{action.icon}</div>
              <p className="font-medium">{action.label}</p>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          {[
            { label: "Upcoming Trips", value: "0", icon: "📅" },
            { label: "Past Adventures", value: "0", icon: "🏆" },
            { label: "Loyalty Points", value: "0", icon: "⭐" },
            { label: "Saved Favorites", value: "0", icon: "❤️" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)]"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-[var(--theme-text-muted)] text-sm">{stat.label}</p>
                <span className="text-xl">{stat.icon}</span>
              </div>
              <span className="text-3xl font-semibold">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Empty state */}
        <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] p-12 text-center">
          <div className="text-6xl mb-4">⛵</div>
          <h2 className="text-xl font-semibold mb-2">No bookings yet</h2>
          <p className="text-[var(--theme-text-muted)] mb-6 max-w-md mx-auto">
            Your adventure awaits! Browse our experiences and book your first unforgettable trip on the Cape Town waters.
          </p>
          <Link
            href="/#packages"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity"
          >
            Explore Experiences
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Recommended */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Recommended for you
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Sundowner Cruise", price: "R850", icon: "🌅", tag: "Popular" },
              { name: "Whale Watching", price: "R1,200", icon: "🐋", tag: "Season" },
              { name: "Crayfish Experience", price: "R2,800", icon: "🦞", tag: "Best Value" },
            ].map((exp) => (
              <div
                key={exp.name}
                className="p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] hover:border-orange-500/30 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{exp.icon}</span>
                  <span className="px-2 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-medium">
                    {exp.tag}
                  </span>
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-orange-500 transition-colors">{exp.name}</h3>
                <p className="text-[var(--theme-text-muted)] text-sm">From {exp.price}/person</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
