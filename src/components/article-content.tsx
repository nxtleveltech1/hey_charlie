import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface ArticleImage {
  alt: string;
  src: string;
}

// Pull standalone image lines out of the content so the page can lay them out
// alongside the text (side rails on desktop, grid on mobile). Images embedded
// mid-paragraph are left in place.
const STANDALONE_IMAGE_RE = /^!\[([^\]]*)\]\(([^)\s]+)\)\s*$/;

export function extractArticleImages(content: string): { images: ArticleImage[]; text: string } {
  const images: ArticleImage[] = [];
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const kept = lines.filter((line) => {
    const m = line.trim().match(STANDALONE_IMAGE_RE);
    if (m && (m[2].startsWith("/") || m[2].startsWith("https://"))) {
      images.push({ alt: m[1], src: m[2] });
      return false;
    }
    return true;
  });
  return { images, text: kept.join("\n") };
}

// Articles are often pasted as plain text with no markdown markers. When no
// headings exist, promote short standalone lines without ending punctuation
// to section headings so the piece still reads like a structured blog post.
function enhancePlainText(content: string): string {
  const normalized = content.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  if (lines.some((l) => /^#{1,6}\s/.test(l.trim()))) return normalized;
  return lines
    .map((line, i) => {
      const trimmed = line.trim();
      const prevBlank = i === 0 || lines[i - 1].trim() === "";
      const nextBlank = i === lines.length - 1 || lines[i + 1].trim() === "";
      const looksLikeHeading =
        trimmed.length > 0 &&
        trimmed.length <= 80 &&
        prevBlank &&
        nextBlank &&
        !/[.!?:,;]$/.test(trimmed) &&
        !/^[-*>\d]/.test(trimmed) &&
        !/^!?\[/.test(trimmed);
      return looksLikeHeading ? `## ${trimmed}` : line;
    })
    .join("\n");
}

// Full markdown rendering for article bodies (headings, bold/italic, lists,
// links, quotes, tables via GFM), themed to match the site palette.
export function ArticleContent({ content }: { content: string }) {
  return (
    <div
      className="prose prose-lg max-w-none
        prose-headings:text-[var(--theme-text)] prose-headings:font-bold prose-headings:tracking-tight
        prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8
        prose-p:text-[var(--theme-text-secondary)] prose-p:leading-relaxed
        prose-a:text-orange-400 prose-a:no-underline hover:prose-a:text-orange-300 hover:prose-a:underline
        prose-strong:text-[var(--theme-text)]
        prose-em:text-[var(--theme-text-secondary)]
        prose-li:text-[var(--theme-text-secondary)] prose-li:marker:text-orange-400
        prose-blockquote:border-l-orange-500 prose-blockquote:text-[var(--theme-text-muted)] prose-blockquote:not-italic
        prose-hr:border-[var(--theme-border)]
        prose-code:text-orange-300 prose-code:before:content-none prose-code:after:content-none
        prose-th:text-[var(--theme-text)] prose-td:text-[var(--theme-text-secondary)]
        prose-img:rounded-xl"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={typeof src === "string" ? src : undefined}
              alt={alt ?? ""}
              className="w-full rounded-xl border border-[var(--theme-border)] my-4"
            />
          ),
        }}
      >
        {enhancePlainText(content)}
      </ReactMarkdown>
    </div>
  );
}
