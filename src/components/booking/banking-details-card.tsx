import { formatPrice } from "@/lib/booking-utils";
import type { BankDetails } from "@/lib/payments";

interface BankingDetailsCardProps {
  bank: BankDetails;
  bookingNumber: string;
  amountDue: number | string;
  holdExpiresLabel?: string;
  className?: string;
}

export function BankingDetailsCard({
  bank,
  bookingNumber,
  amountDue,
  holdExpiresLabel,
  className = "",
}: BankingDetailsCardProps) {
  const rows = [
    { label: "Bank", value: bank.bankName },
    { label: "Account name", value: bank.accountName },
    { label: "Account number", value: bank.accountNumber, mono: true },
    { label: "Branch code", value: bank.branchCode, mono: true },
    { label: "Account type", value: bank.accountType },
    { label: "Reference", value: bookingNumber, mono: true, highlight: true },
    { label: "Amount due", value: formatPrice(amountDue), highlight: true },
  ];

  return (
    <div
      className={`rounded-2xl border border-amber/30 bg-amber/5 p-5 lg:p-6 ${className}`}
    >
      <h3 className="mb-1 font-semibold">Bank transfer (EFT)</h3>
      <p className="mb-4 text-sm text-[var(--theme-text-muted)]">
        Use your booking number as the payment reference so we can match your
        deposit.
      </p>
      <dl className="space-y-3 text-sm">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between"
          >
            <dt className="text-[var(--theme-text-muted)]">{row.label}</dt>
            <dd
              className={`font-medium ${row.mono ? "font-mono" : ""} ${
                row.highlight ? "text-amber" : ""
              }`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      {holdExpiresLabel && (
        <p className="mt-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-400">
          Your provisional booking is held until{" "}
          <span className="font-semibold">{holdExpiresLabel}</span> (24 hours).
          If we don&apos;t receive payment by then, the reservation may be
          released.
        </p>
      )}
    </div>
  );
}
