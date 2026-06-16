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

export const articleStatusEnum = pgEnum("article_status", [
  "draft",
  "published",
  "archived",
]);

export const articleCategoryEnum = pgEnum("article_category", [
  "fishing-reports",
  "species-spotlight",
  "charter-updates",
  "gear-tackle",
  "weather-updates",
  "tips-techniques",
]);

export const alertSeverityEnum = pgEnum("alert_severity", [
  "info",
  "warning",
  "critical",
]);

export const alertTypeEnum = pgEnum("alert_type", [
  "weather",
  "news",
  "trip-reminder",
  "fishing-conditions",
]);

export const addonPriceUnitEnum = pgEnum("addon_price_unit", [
  "flat",
  "per_person",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "unpaid",
  "paid",
  "failed",
  "refunded",
]);

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
  timeSlots: text("time_slots").array().notNull().default([]),
  guestCount: integer("guest_count").notNull(),
  departureLocation: text("departure_location").notNull().default("va-waterfront"),
  
  // Pricing
  pricePerPerson: decimal("price_per_person", { precision: 10, scale: 2 }).notNull(),
  addonsTotal: decimal("addons_total", { precision: 10, scale: 2 }).default("0").notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),

  // Payment
  paymentStatus: paymentStatusEnum("payment_status").default("unpaid").notNull(),
  stripeCheckoutSessionId: text("stripe_checkout_session_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  paidAt: timestamp("paid_at"),
  
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

// Package add-ons catalog (global, shown on every booking form)
export const addons = pgTable("addons", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  priceUnit: addonPriceUnitEnum("price_unit").notNull(),
  selectionGroup: text("selection_group"),
  allowQuantity: boolean("allow_quantity").default(false).notNull(),
  maxQuantity: integer("max_quantity").default(4).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Snapshotted add-on line items on a booking
export const bookingAddons = pgTable("booking_addons", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id").references(() => bookings.id).notNull(),
  addonId: uuid("addon_id").references(() => addons.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  priceUnit: addonPriceUnitEnum("price_unit").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  lineTotal: decimal("line_total", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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

// Crew members table
export const crewMembers = pgTable("crew_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  role: text("role").notNull(), // e.g., "Captain", "First Mate", "Deckhand"
  bio: text("bio"),
  yearsExperience: integer("years_experience"),
  certifications: text("certifications").array(),
  email: text("email"),
  phone: text("phone"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// News articles table
export const articles = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImage: text("cover_image"),
  category: articleCategoryEnum("category").notNull(),
  tags: text("tags").array(),
  authorId: uuid("author_id").references(() => users.id),
  status: articleStatusEnum("status").default("draft").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Weather alerts table (admin-created marine warnings)
export const weatherAlerts = pgTable("weather_alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  severity: alertSeverityEnum("severity").default("info").notNull(),
  activeFrom: timestamp("active_from").notNull(),
  activeTo: timestamp("active_to").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User alert preferences table
export const userAlertPreferences = pgTable("user_alert_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull().unique(),
  emailAlerts: boolean("email_alerts").default(true).notNull(),
  smsAlerts: boolean("sms_alerts").default(false).notNull(),
  alertTypes: alertTypeEnum("alert_types").array(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  bookings: many(bookings),
  articles: many(articles),
  weatherAlerts: many(weatherAlerts),
  alertPreferences: one(userAlertPreferences),
}));

export const packagesRelations = relations(packages, ({ many }) => ({
  bookings: many(bookings),
  blockedDates: many(blockedDates),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  package: one(packages, {
    fields: [bookings.packageId],
    references: [packages.id],
  }),
  bookingAddons: many(bookingAddons),
}));

export const addonsRelations = relations(addons, ({ many }) => ({
  bookingAddons: many(bookingAddons),
}));

export const bookingAddonsRelations = relations(bookingAddons, ({ one }) => ({
  booking: one(bookings, {
    fields: [bookingAddons.bookingId],
    references: [bookings.id],
  }),
  addon: one(addons, {
    fields: [bookingAddons.addonId],
    references: [addons.id],
  }),
}));

export const blockedDatesRelations = relations(blockedDates, ({ one }) => ({
  package: one(packages, {
    fields: [blockedDates.packageId],
    references: [packages.id],
  }),
}));

export const articlesRelations = relations(articles, ({ one }) => ({
  author: one(users, {
    fields: [articles.authorId],
    references: [users.id],
  }),
}));

export const weatherAlertsRelations = relations(weatherAlerts, ({ one }) => ({
  createdByUser: one(users, {
    fields: [weatherAlerts.createdBy],
    references: [users.id],
  }),
}));

export const userAlertPreferencesRelations = relations(userAlertPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userAlertPreferences.userId],
    references: [users.id],
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

export type CrewMember = typeof crewMembers.$inferSelect;
export type NewCrewMember = typeof crewMembers.$inferInsert;

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;

export type WeatherAlert = typeof weatherAlerts.$inferSelect;
export type NewWeatherAlert = typeof weatherAlerts.$inferInsert;

export type UserAlertPreference = typeof userAlertPreferences.$inferSelect;
export type NewUserAlertPreference = typeof userAlertPreferences.$inferInsert;

export type Addon = typeof addons.$inferSelect;
export type NewAddon = typeof addons.$inferInsert;

export type BookingAddon = typeof bookingAddons.$inferSelect;
export type NewBookingAddon = typeof bookingAddons.$inferInsert;
