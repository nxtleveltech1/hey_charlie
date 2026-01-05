import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex bg-[var(--theme-bg)] transition-colors duration-300">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        </div>
        
        <Link href="/" className="flex items-center gap-3 relative z-10">
          <Image
            src="/logo2.png"
            alt="Hey Charlie Charters"
            width={60}
            height={60}
            className="rounded-lg"
          />
          <div>
            <span 
              className="text-2xl font-bold italic bg-gradient-to-r from-cyan-200 via-white to-cyan-200 bg-clip-text text-transparent"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Hey Charlie
            </span>
            <span className="block text-sm font-semibold italic tracking-wider text-amber-300">
              CHARTERS
            </span>
          </div>
        </Link>

        <div className="relative z-10 text-white">
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Start your adventure
          </h1>
          <p className="text-white/80 text-lg max-w-md">
            Join Hey Charlie Charters and unlock exclusive experiences, member discounts, and the best of Cape Town&apos;s coastline.
          </p>
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 text-white/90">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Early access to seasonal experiences
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Member-only discounts & offers
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Easy booking management
            </div>
          </div>
        </div>

        <div className="relative z-10 text-white/60 text-sm">
          © 2026 Hey Charlie Charters
        </div>
      </div>

      {/* Right side - sign up form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/logo2.png"
                alt="Hey Charlie Charters"
                width={60}
                height={60}
                className="rounded-lg"
              />
              <div>
                <span 
                  className="text-xl font-bold italic bg-gradient-to-r from-cyan-300 via-sky-400 to-cyan-300 bg-clip-text text-transparent"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Hey Charlie
                </span>
                <span className="block text-xs font-semibold italic tracking-wider bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                  CHARTERS
                </span>
              </div>
            </Link>
          </div>
          
          <SignUp 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-[var(--theme-card-bg)] border border-[var(--theme-border)] shadow-xl",
                headerTitle: "text-[var(--theme-text)]",
                headerSubtitle: "text-[var(--theme-text-muted)]",
                socialButtonsBlockButton: "border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-text)] hover:bg-[var(--theme-surface-hover)]",
                formFieldLabel: "text-[var(--theme-text-secondary)]",
                formFieldInput: "bg-[var(--theme-surface)] border-[var(--theme-border)] text-[var(--theme-text)]",
                footerActionLink: "text-cyan-500 hover:text-cyan-600",
                formButtonPrimary: "bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
