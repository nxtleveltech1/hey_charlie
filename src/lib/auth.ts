import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ensureUserInDatabase } from "@/lib/user-sync";
import type { users } from "@/db/schema";

type DbUser = typeof users.$inferSelect;

export async function requireUser(): Promise<DbUser> {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const user = await ensureUserInDatabase(userId);
  if (!user) {
    redirect("/sign-in");
  }
  return user;
}

export async function requireAdmin(): Promise<DbUser> {
  const user = await requireUser();
  if (user.role !== "admin") {
    redirect("/dashboard");
  }
  return user;
}

export async function getOptionalUser(): Promise<DbUser | null> {
  const { userId } = await auth();
  if (!userId) return null;
  return ensureUserInDatabase(userId);
}
