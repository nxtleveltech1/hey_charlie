import type { Addon } from "@/db/schema";

export type AddonLike = Pick<
  Addon,
  | "id"
  | "name"
  | "price"
  | "priceUnit"
  | "selectionGroup"
  | "isActive"
  | "allowQuantity"
  | "maxQuantity"
>;

export type SelectedAddon = {
  addonId: string;
  quantity?: number;
};

/** Map of addonId → quantity (only selected add-ons). */
export type SelectedAddonsMap = Record<string, number>;

export type AddonLineItem = {
  addonId: string;
  name: string;
  priceUnit: "flat" | "per_person";
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type BookingTotalResult = {
  packageSubtotal: number;
  addonsTotal: number;
  totalPrice: number;
  lines: AddonLineItem[];
};

export function selectedAddonsMapToList(
  map: SelectedAddonsMap,
): SelectedAddon[] {
  return Object.entries(map).map(([addonId, quantity]) => ({
    addonId,
    quantity,
  }));
}

export function calculateAddonLineTotal(
  addon: Pick<AddonLike, "price" | "priceUnit" | "allowQuantity" | "maxQuantity">,
  guestCount: number,
  selectedQuantity = 1,
): { quantity: number; lineTotal: number } {
  const unitPrice = parseFloat(addon.price);

  if (addon.priceUnit === "per_person") {
    return {
      quantity: guestCount,
      lineTotal: unitPrice * guestCount,
    };
  }

  if (addon.allowQuantity) {
    const qty = Math.min(
      Math.max(1, selectedQuantity),
      addon.maxQuantity,
    );
    return {
      quantity: qty,
      lineTotal: unitPrice * qty,
    };
  }

  return {
    quantity: 1,
    lineTotal: unitPrice,
  };
}

export function validateAddonSelection(
  selected: SelectedAddon[],
  addonsCatalog: AddonLike[],
): { valid: true } | { valid: false; error: string } {
  const activeAddons = addonsCatalog.filter((a) => a.isActive);
  const activeById = new Map(activeAddons.map((a) => [a.id, a]));

  for (const { addonId, quantity } of selected) {
    const addon = activeById.get(addonId);
    if (!addon) {
      return {
        valid: false,
        error: "One or more selected add-ons are invalid or inactive",
      };
    }

    if (addon.allowQuantity) {
      const qty = quantity ?? 1;
      if (qty < 1 || qty > addon.maxQuantity) {
        return {
          valid: false,
          error: `Quantity for "${addon.name}" must be between 1 and ${addon.maxQuantity}`,
        };
      }
    }
  }

  const groupsSeen = new Map<string, string>();
  for (const { addonId } of selected) {
    const addon = activeById.get(addonId)!;
    if (addon.selectionGroup) {
      const existing = groupsSeen.get(addon.selectionGroup);
      if (existing) {
        return {
          valid: false,
          error: `Only one option can be selected from "${addon.selectionGroup}"`,
        };
      }
      groupsSeen.set(addon.selectionGroup, addonId);
    }
  }

  return { valid: true };
}

export function calculateBookingTotal(
  pricePerPerson: number | string,
  guestCount: number,
  selected: SelectedAddon[] | SelectedAddonsMap,
  addonsCatalog: AddonLike[],
): BookingTotalResult {
  const selectedList = Array.isArray(selected)
    ? selected
    : selectedAddonsMapToList(selected);

  const validation = validateAddonSelection(selectedList, addonsCatalog);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const packageSubtotal = parseFloat(String(pricePerPerson)) * guestCount;
  const activeById = new Map(
    addonsCatalog.filter((a) => a.isActive).map((a) => [a.id, a]),
  );

  const lines: AddonLineItem[] = selectedList.map(({ addonId, quantity }) => {
    const addon = activeById.get(addonId)!;
    const unitPrice = parseFloat(addon.price);
    const { quantity: lineQty, lineTotal } = calculateAddonLineTotal(
      addon,
      guestCount,
      quantity ?? 1,
    );

    const name =
      addon.allowQuantity && lineQty > 1
        ? `${addon.name} × ${lineQty}`
        : addon.name;

    return {
      addonId: addon.id,
      name,
      priceUnit: addon.priceUnit,
      unitPrice,
      quantity: lineQty,
      lineTotal,
    };
  });

  const addonsTotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);

  return {
    packageSubtotal,
    addonsTotal,
    totalPrice: packageSubtotal + addonsTotal,
    lines,
  };
}

export function formatAddonPriceLabel(
  addon: Pick<AddonLike, "price" | "priceUnit" | "allowQuantity">,
): string {
  const amount = parseFloat(String(addon.price));
  const formatted = new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  if (addon.priceUnit === "per_person") {
    return `${formatted} per person`;
  }
  if (addon.allowQuantity) {
    return `${formatted} each`;
  }
  return formatted;
}
