"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              *{box-sizing:border-box}
              html,body{margin:0;padding:0}
              body{
                background:#0a1628;color:#f7f4ee;
                font-family:system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
                min-height:100vh;display:flex;
              }
              main{
                margin:auto;max-width:42rem;width:100%;
                padding:clamp(2.5rem,7vw,4.5rem) 1.5rem;text-align:center;
              }
              .eyebrow{
                color:#ff7a66;font-size:.75rem;font-weight:600;
                letter-spacing:.14em;text-transform:uppercase;margin:0 0 1rem;
              }
              h1{
                font-size:clamp(1.875rem,5vw,2.625rem);line-height:1.1;
                margin:0 0 1rem;color:#f7f4ee;font-weight:800;letter-spacing:-.02em;
              }
              p{
                color:rgba(247,244,238,.74);line-height:1.6;
                margin:0 0 2rem;font-size:1.0625rem;max-width:34rem;margin-inline:auto;
              }
              .actions{display:flex;flex-wrap:wrap;gap:.75rem;justify-content:center}
              button,a{
                font:inherit;font-weight:600;cursor:pointer;
                display:inline-flex;align-items:center;justify-content:center;
                min-height:2.75rem;padding:.625rem 1.5rem;border-radius:.75rem;
                text-decoration:none;border:1px solid transparent;
                transition:background-color .2s ease,border-color .2s ease,color .2s ease;
              }
              .btn-primary{background:#f5a524;color:#0a1628}
              .btn-primary:hover{background:#cf8a25}
              .btn-secondary{background:transparent;color:#f7f4ee;border-color:rgba(247,244,238,.24)}
              .btn-secondary:hover{border-color:rgba(247,244,238,.5)}
              button:focus-visible,a:focus-visible{outline:2px solid #f5a524;outline-offset:2px}
              @media(prefers-reduced-motion:reduce){*{transition:none!important}}
            `,
          }}
        />
      </head>
      <body>
        <main>
          <p className="eyebrow">Something broke</p>
          <h1>We hit an unexpected error</h1>
          <p>
            The application couldn&apos;t recover on its own. Try reloading the
            page, or return to the home page to start again.
          </p>
          <div className="actions">
            <button className="btn-primary" type="button" onClick={reset}>
              Try again
            </button>
            <Link className="btn-secondary" href="/">
              Back to home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
