"use client";

export const PACKAGE_CATEGORIES = [
  { value: "relaxation", label: "Relaxation" },
  { value: "adventure", label: "Adventure" },
  { value: "culinary", label: "Culinary" },
  { value: "wildlife", label: "Wildlife" },
  { value: "fishing", label: "Fishing" },
  { value: "private", label: "Private Events" },
] as const;

export type PackageFormData = {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  duration: string;
  pricePerPerson: string;
  minGuests: number;
  maxGuests: number;
  category: string;
  imageUrl: string;
  isActive: boolean;
  isFeatured: boolean;
};

export const emptyPackageFormData: PackageFormData = {
  name: "",
  slug: "",
  tagline: "",
  description: "",
  duration: "",
  pricePerPerson: "",
  minGuests: 1,
  maxGuests: 12,
  category: "relaxation",
  imageUrl: "",
  isActive: true,
  isFeatured: false,
};

export function generatePackageSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const inputClassName =
  "w-full px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] focus:border-orange-500 outline-none transition-colors";

interface PackageFormFieldsProps {
  formData: PackageFormData;
  highlights: string[];
  autoSlug?: boolean;
  onFormDataChange: (data: PackageFormData) => void;
  onHighlightsChange: (highlights: string[]) => void;
}

export function PackageFormFields({
  formData,
  highlights,
  autoSlug = true,
  onFormDataChange,
  onHighlightsChange,
}: PackageFormFieldsProps) {
  const updateHighlight = (index: number, value: string) => {
    const next = [...highlights];
    next[index] = value;
    onHighlightsChange(next);
  };

  const removeHighlight = (index: number) => {
    onHighlightsChange(highlights.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)]">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Package Name <span className="text-red-500">*</span>
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
                slug: autoSlug ? generatePackageSlug(name) : formData.slug,
              });
            }}
            className={inputClassName}
            placeholder="Sundowner Cruise"
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
            placeholder="sundowner-cruise"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tagline</label>
        <input
          type="text"
          value={formData.tagline}
          onChange={(e) =>
            onFormDataChange({ ...formData, tagline: e.target.value })
          }
          className={inputClassName}
          placeholder="Watch the sun set over Table Mountain"
        />
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
          placeholder="Describe the experience..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Image URL</label>
        <input
          type="url"
          value={formData.imageUrl}
          onChange={(e) =>
            onFormDataChange({ ...formData, imageUrl: e.target.value })
          }
          className={inputClassName}
          placeholder="https://example.com/package-image.jpg"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Price per Person (ZAR) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            required
            min={0}
            step={0.01}
            value={formData.pricePerPerson}
            onChange={(e) =>
              onFormDataChange({ ...formData, pricePerPerson: e.target.value })
            }
            className={inputClassName}
            placeholder="850"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Min Guests</label>
          <input
            type="number"
            min={1}
            value={formData.minGuests}
            onChange={(e) =>
              onFormDataChange({
                ...formData,
                minGuests: parseInt(e.target.value) || 1,
              })
            }
            className={inputClassName}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Max Guests</label>
          <input
            type="number"
            min={1}
            value={formData.maxGuests}
            onChange={(e) =>
              onFormDataChange({
                ...formData,
                maxGuests: parseInt(e.target.value) || 1,
              })
            }
            className={inputClassName}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Duration <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.duration}
            onChange={(e) =>
              onFormDataChange({ ...formData, duration: e.target.value })
            }
            className={inputClassName}
            placeholder="2.5 hours"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) =>
              onFormDataChange({ ...formData, category: e.target.value })
            }
            className={inputClassName}
          >
            {PACKAGE_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Highlights / Includes
        </label>
        <div className="space-y-2">
          {highlights.map((highlight, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={highlight}
                onChange={(e) => updateHighlight(index, e.target.value)}
                className={`flex-1 ${inputClassName}`}
                placeholder="e.g., Complimentary drinks"
              />
              {highlights.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeHighlight(index)}
                  className="px-3 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onHighlightsChange([...highlights, ""])}
          className="mt-2 text-sm text-orange-500 hover:text-orange-400 transition-colors"
        >
          + Add highlight
        </button>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) =>
              onFormDataChange({ ...formData, isActive: e.target.checked })
            }
            className="w-5 h-5 rounded border-[var(--theme-border)] text-orange-500 focus:ring-orange-500"
          />
          <span>Active (visible on website)</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isFeatured}
            onChange={(e) =>
              onFormDataChange({ ...formData, isFeatured: e.target.checked })
            }
            className="w-5 h-5 rounded border-[var(--theme-border)] text-orange-500 focus:ring-orange-500"
          />
          <span>Featured</span>
        </label>
      </div>
    </div>
  );
}

export function packageFormToPayload(
  formData: PackageFormData,
  highlights: string[],
) {
  return {
    ...formData,
    pricePerPerson: parseFloat(formData.pricePerPerson),
    highlights: highlights.filter((h) => h.trim()),
    imageUrl: formData.imageUrl.trim() || null,
  };
}
