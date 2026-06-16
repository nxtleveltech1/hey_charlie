"use client";

export const ADDON_PRICE_UNITS = [
  { value: "flat", label: "Flat rate (per booking)" },
  { value: "per_person", label: "Per person" },
] as const;

export type AddonFormData = {
  name: string;
  slug: string;
  description: string;
  price: string;
  priceUnit: "flat" | "per_person";
  selectionGroup: string;
  allowQuantity: boolean;
  maxQuantity: number;
  displayOrder: number;
  isActive: boolean;
};

export const emptyAddonFormData: AddonFormData = {
  name: "",
  slug: "",
  description: "",
  price: "",
  priceUnit: "flat",
  selectionGroup: "",
  allowQuantity: false,
  maxQuantity: 4,
  displayOrder: 0,
  isActive: true,
};

export function generateAddonSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const inputClassName =
  "w-full px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] focus:border-orange-500 outline-none transition-colors";

interface AddonFormFieldsProps {
  formData: AddonFormData;
  autoSlug?: boolean;
  onFormDataChange: (data: AddonFormData) => void;
}

export function AddonFormFields({
  formData,
  autoSlug = true,
  onFormDataChange,
}: AddonFormFieldsProps) {
  return (
    <div className="space-y-6 p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)]">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Service Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => {
              const name = e.target.value;
              onFormDataChange({
                ...formData,
                name,
                slug: autoSlug ? generateAddonSlug(name) : formData.slug,
              });
            }}
            className={inputClassName}
            placeholder="Shuttle service — Pickup"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            URL Slug <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) =>
              onFormDataChange({ ...formData, slug: e.target.value })
            }
            className={`${inputClassName} font-mono text-sm`}
            placeholder="shuttle-pickup"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          required
          rows={4}
          value={formData.description}
          onChange={(e) =>
            onFormDataChange({ ...formData, description: e.target.value })
          }
          className={`${inputClassName} resize-none`}
          placeholder="Collection from any hotel and brought to the launch location..."
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Price (ZAR) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            required
            min={0}
            step={0.01}
            value={formData.price}
            onChange={(e) =>
              onFormDataChange({ ...formData, price: e.target.value })
            }
            className={inputClassName}
            placeholder="1500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Price Unit</label>
          <select
            value={formData.priceUnit}
            onChange={(e) =>
              onFormDataChange({
                ...formData,
                priceUnit: e.target.value as "flat" | "per_person",
              })
            }
            className={inputClassName}
          >
            {ADDON_PRICE_UNITS.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Display Order</label>
          <input
            type="number"
            min={0}
            value={formData.displayOrder}
            onChange={(e) =>
              onFormDataChange({
                ...formData,
                displayOrder: parseInt(e.target.value) || 0,
              })
            }
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Selection Group (optional)
        </label>
        <input
          type="text"
          value={formData.selectionGroup}
          onChange={(e) =>
            onFormDataChange({ ...formData, selectionGroup: e.target.value })
          }
          className={inputClassName}
          placeholder="jetski (only one option per group can be selected)"
        />
        <p className="mt-1 text-xs text-[var(--theme-text-muted)]">
          Add-ons with the same group behave as radio buttons (e.g. jetski 2hr vs full day).
        </p>
      </div>

      <div className="space-y-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.allowQuantity}
            onChange={(e) =>
              onFormDataChange({
                ...formData,
                allowQuantity: e.target.checked,
              })
            }
            className="w-5 h-5 rounded border-[var(--theme-border)] text-orange-500 focus:ring-orange-500"
          />
          <span>Allow quantity selection (e.g. number of jetskis)</span>
        </label>

        {formData.allowQuantity && (
          <div className="max-w-xs">
            <label className="block text-sm font-medium mb-2">
              Maximum quantity
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={formData.maxQuantity}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  maxQuantity: Math.min(
                    20,
                    Math.max(1, parseInt(e.target.value) || 1),
                  ),
                })
              }
              className={inputClassName}
            />
          </div>
        )}
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) =>
            onFormDataChange({ ...formData, isActive: e.target.checked })
          }
          className="w-5 h-5 rounded border-[var(--theme-border)] text-orange-500 focus:ring-orange-500"
        />
        <span>Active (available on booking form)</span>
      </label>
    </div>
  );
}

export function addonFormToPayload(formData: AddonFormData) {
  return {
    ...formData,
    price: parseFloat(formData.price),
    selectionGroup: formData.selectionGroup.trim() || null,
  };
}
