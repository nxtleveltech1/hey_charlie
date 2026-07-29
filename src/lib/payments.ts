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

function env(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Real banking details from HCC_BANK_* env vars. Returns null unless the bank
 * name, account number and branch code are all configured — the confirmation
 * page then tells the guest we'll send details directly, instead of ever
 * rendering fabricated account numbers.
 */
export function getBankDetails(): BankDetails | null {
  const bankName = env(process.env.HCC_BANK_NAME);
  const accountNumber = env(process.env.HCC_BANK_ACCOUNT_NUMBER);
  const branchCode = env(process.env.HCC_BANK_BRANCH_CODE);

  if (!bankName || !accountNumber || !branchCode) {
    return null;
  }

  return {
    bankName,
    accountName:
      env(process.env.HCC_BANK_ACCOUNT_NAME) ?? getPublicSiteConfig().legalName,
    accountNumber,
    branchCode,
    accountType: env(process.env.HCC_BANK_ACCOUNT_TYPE) ?? "Cheque",
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
