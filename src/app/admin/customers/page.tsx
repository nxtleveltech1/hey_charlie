import { db } from "@/db";
import { users, bookings } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { formatPrice, formatShortDate } from "@/lib/booking-utils";
import { ResponsiveDataList } from "@/components/ui/responsive-data-list";

type CustomerRow = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  imageUrl: string | null;
  createdAt: Date;
  bookingCount: number;
  totalSpent: string;
};

export default async function AdminCustomersPage() {
  const allUsers = (await db
    .select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      phone: users.phone,
      imageUrl: users.imageUrl,
      createdAt: users.createdAt,
      bookingCount: sql<number>`CAST(COUNT(${bookings.id}) AS INT)`,
      totalSpent: sql<string>`COALESCE(SUM(CAST(${bookings.totalPrice} AS DECIMAL)), 0)`,
    })
    .from(users)
    .leftJoin(bookings, eq(users.id, bookings.userId))
    .where(eq(users.role, "user"))
    .groupBy(users.id)
    .orderBy(desc(users.createdAt))) as CustomerRow[];

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-2xl font-bold sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Customers
        </h1>
        <p className="text-[var(--theme-text-muted)]">
          {allUsers.length} registered customers
        </p>
      </div>

      <ResponsiveDataList
        data={allUsers}
        rowKey={(u) => u.id}
        emptyTitle="No customers yet"
        emptyMessage="Registered customers will appear here."
        columns={[
          {
            key: "customer",
            header: "Customer",
            cell: (u) => (
              <div className="flex items-center gap-3">
                {u.imageUrl ? (
                  <img
                    src={u.imageUrl}
                    alt=""
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber/20 font-medium text-amber">
                    {(u.firstName?.[0] || u.email[0]).toUpperCase()}
                  </div>
                )}
                <p className="font-medium">
                  {u.firstName && u.lastName
                    ? `${u.firstName} ${u.lastName}`
                    : "—"}
                </p>
              </div>
            ),
          },
          { key: "email", header: "Email", cell: (u) => u.email },
          { key: "phone", header: "Phone", cell: (u) => u.phone || "—" },
          {
            key: "bookings",
            header: "Bookings",
            cell: (u) => (
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  u.bookingCount > 0
                    ? "bg-green-500/10 text-green-500"
                    : "bg-[var(--theme-surface)] text-[var(--theme-text-muted)]"
                }`}
              >
                {u.bookingCount}
              </span>
            ),
          },
          {
            key: "spent",
            header: "Total Spent",
            cell: (u) => formatPrice(parseFloat(u.totalSpent || "0")),
          },
          {
            key: "joined",
            header: "Joined",
            cell: (u) => formatShortDate(u.createdAt),
          },
        ]}
        renderMobileCard={(u) => (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {u.imageUrl ? (
                <img src={u.imageUrl} alt="" className="h-12 w-12 rounded-full" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber/20 text-lg font-medium text-amber">
                  {(u.firstName?.[0] || u.email[0]).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {u.firstName && u.lastName
                    ? `${u.firstName} ${u.lastName}`
                    : u.email}
                </p>
                <p className="truncate text-sm text-[var(--theme-text-muted)]">
                  {u.email}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              {u.phone && (
                <a href={`tel:${u.phone}`} className="text-amber">
                  {u.phone}
                </a>
              )}
              <span>{u.bookingCount} bookings</span>
              <span className="font-medium">
                {formatPrice(parseFloat(u.totalSpent || "0"))}
              </span>
            </div>
            <p className="text-xs text-[var(--theme-text-muted)]">
              Joined {formatShortDate(u.createdAt)}
            </p>
          </div>
        )}
      />
    </div>
  );
}
