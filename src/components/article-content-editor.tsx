"use client";

import { useRef, useState } from "react";

interface ArticleContentEditorProps {
  value: string;
  onChange: (value: string) => void;
}

// Content textarea with an "Insert Image" button that uploads to /api/media
// and drops a markdown image tag at the cursor position.
export function ArticleContentEditor({ value, onChange }: ArticleContentEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const insertAtCursor = (snippet: string) => {
    const pos = textareaRef.current?.selectionStart ?? value.length;
    const before = value.slice(0, pos);
    const after = value.slice(pos);
    const lead = before && !before.endsWith("\n\n") ? (before.endsWith("\n") ? "\n" : "\n\n") : "";
    const trail = after && !after.startsWith("\n") ? "\n\n" : "";
    onChange(before + lead + snippet + trail + after);
  };

  const handleFile = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/media", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      insertAtCursor(`![${alt}](${data.url})`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium">Content * (Markdown supported)</label>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-3 py-1.5 text-sm bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg hover:border-orange-500/50 transition-colors disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "📷 Insert Image"}
        </button>
      </div>
      <textarea
        ref={textareaRef}
        rows={15}
        required
        placeholder="Write your article content here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <p className="mt-1 text-xs text-[var(--theme-text-muted)]">
        Click Insert Image to upload a photo — it is placed at your cursor position in the text.
      </p>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
