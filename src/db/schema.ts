import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
]);

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

// Users table - synced from Clerk
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  imageUrl: text("image_url"),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Packages table
export const packages = pgTable("packages", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  description: text("description").notNull(),
  duration: text("duration").notNull(),
  pricePerPerson: decimal("price_per_person", { precision: 10, scale: 2 }).notNull(),
  minGuests: integer("min_guests").default(1).notNull(),
  maxGuests: integer("max_guests").default(12).notNull(),
  category: text("category").notNull(),
  highlights: text("highlights").array(),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingNumber: text("booking_number").notNull().unique(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  packageId: uuid("package_id").references(() => packages.id).notNull(),
  
  // Booking details
  date: timestamp("date").notNull(),
  timeSlot: text("time_slot").notNull(),
  guestCount: integer("guest_count").notNull(),
  
  // Pricing
  pricePerPerson: decimal("price_per_person", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  
  // Contact info (snapshot at time of booking)
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  
  // Additional info
  specialRequests: text("special_requests"),
  dietaryRequirements: text("dietary_requirements"),
  
  // Status
  status: bookingStatusEnum("status").default("pending").notNull(),
  
  // Admin notes
  adminNotes: text("admin_notes"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  confirmedAt: timestamp("confirmed_at"),
  cancelledAt: timestamp("cancelled_at"),
});

// Blocked dates table (for admin to block off dates)
export const blockedDates = pgTable("blocked_dates", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: timestamp("date").notNull(),
  reason: text("reason"),
  packageId: uuid("package_id").references(() => packages.id), // null = all packages
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Time slots table
export const timeSlots = pgTable("time_slots", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
}));

export const packagesRelations = relations(packages, ({ many }) => ({
  bookings: many(bookings),
  blockedDates: many(blockedDates),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  package: one(packages, {
    fields: [bookings.packageId],
    references: [packages.id],
  }),
}));

export const blockedDatesRelations = relations(blockedDates, ({ one }) => ({
  package: one(packages, {
    fields: [blockedDates.packageId],
    references: [packages.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Package = typeof packages.$inferSelect;
export type NewPackage = typeof packages.$inferInsert;

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;

export type BlockedDate = typeof blockedDates.$inferSelect;
export type NewBlockedDate = typeof blockedDates.$inferInsert;

export type TimeSlot = typeof timeSlots.$inferSelect;
export type NewTimeSlot = typeof timeSlots.$inferInsert;
