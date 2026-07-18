"use client";

import { useRef, useState } from "react";

interface CoverImageInputProps {
  value: string;
  onChange: (url: string) => void;
}

export function CoverImageInput({ value, onChange }: CoverImageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/media", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Cover Image</label>
      {value && (
        <div className="mb-3 h-40 w-full overflow-hidden rounded-lg border border-[var(--theme-border)] bg-[var(--theme-bg)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Cover preview" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg hover:border-orange-500/50 transition-colors disabled:opacity-50"
        >
          {uploading ? "Uploading..." : value ? "Replace Image" : "Upload Image"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
          >
            Remove
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <p className="mt-2 text-xs text-[var(--theme-text-muted)]">JPEG, PNG, WebP or GIF, up to 5MB</p>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
