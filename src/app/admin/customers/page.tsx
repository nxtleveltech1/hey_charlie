import { db } from "@/db";
import { users, bookings } from "@/db/schema";
import { desc, eq, count, sql } from "drizzle-orm";
import { formatPrice, formatShortDate } from "@/lib/booking-utils";

export default async function AdminCustomersPage() {
  // Get all users with their booking stats
  const allUsers = await db
    .select({
      id: users.id,
      clerkId: users.clerkId,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      phone: users.phone,
      imageUrl: users.imageUrl,
      role: users.role,
      createdAt: users.createdAt,
      bookingCount: sql<number>`CAST(COUNT(${bookings.id}) AS INT)`,
      totalSpent: sql<string>`COALESCE(SUM(CAST(${bookings.totalPrice} AS DECIMAL)), 0)`,
    })
    .from(users)
    .leftJoin(bookings, eq(users.id, bookings.userId))
    .where(eq(users.role, "user"))
    .groupBy(users.id)
    .orderBy(desc(users.createdAt));

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Customers
          </h1>
          <p className="text-[var(--theme-text-muted)]">
            {allUsers.length} registered customers
          </p>
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--theme-surface)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--theme-text-muted)] uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--theme-text-muted)] uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--theme-text-muted)] uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--theme-text-muted)] uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--theme-text-muted)] uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--theme-text-muted)] uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--theme-border)]">
              {allUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--theme-text-muted)]">
                    No customers yet
                  </td>
                </tr>
              ) : (
                allUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[var(--theme-surface)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.imageUrl ? (
                          <img
                            src={user.imageUrl}
                            alt=""
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-medium">
                            {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium">
                            {user.firstName && user.lastName
                              ? `${user.firstName} ${user.lastName}`
                              : "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{user.email}</td>
                    <td className="px-6 py-4 text-sm">{user.phone || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.bookingCount > 0
                          ? "bg-green-500/10 text-green-500"
                          : "bg-[var(--theme-surface)] text-[var(--theme-text-muted)]"
                      }`}>
                        {user.bookingCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {formatPrice(parseFloat(user.totalSpent || "0"))}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--theme-text-muted)]">
                      {formatShortDate(user.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

