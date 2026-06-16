import { getPublicSiteConfig } from "@/lib/content/site-config";

/** Online card payments via Stripe. Off by default — provisional EFT bookings only. */
export function isOnlinePaymentsEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_HCC_ONLINE_PAYMENTS_ENABLED === "true" ||
    process.env.HCC_ONLINE_PAYMENTS_ENABLED === "true"
  );
}

export const PROVISIONAL_HOLD_HOURS = 24;

export type BankDetails = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchCode: string;
  accountType: string;
};

function bankEnv(key: string, value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

export function getBankDetails(): BankDetails {
  return {
    bankName: bankEnv("HCC_BANK_NAME", process.env.HCC_BANK_NAME, "First National Bank"),
    accountName: bankEnv(
      "HCC_BANK_ACCOUNT_NAME",
      process.env.HCC_BANK_ACCOUNT_NAME,
      getPublicSiteConfig().legalName,
    ),
    accountNumber: bankEnv(
      "HCC_BANK_ACCOUNT_NUMBER",
      process.env.HCC_BANK_ACCOUNT_NUMBER,
      "62812345678",
    ),
    branchCode: bankEnv("HCC_BANK_BRANCH_CODE", process.env.HCC_BANK_BRANCH_CODE, "250655"),
    accountType: bankEnv("HCC_BANK_ACCOUNT_TYPE", process.env.HCC_BANK_ACCOUNT_TYPE, "Cheque"),
  };
}

export function getProvisionalHoldExpiresAt(createdAt: Date | string): Date {
  const start = typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  return new Date(start.getTime() + PROVISIONAL_HOLD_HOURS * 60 * 60 * 1000);
}

export function formatProvisionalHoldExpiry(createdAt: Date | string): string {
  const expires = getProvisionalHoldExpiresAt(createdAt);
  return new Intl.DateTimeFormat("en-ZA", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(expires);
}
