import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex bg-[var(--theme-bg)] transition-colors duration-300">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 p-12 flex-col justify-between relative overflow-hidden">
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
            Welcome back, adventurer
          </h1>
          <p className="text-white/80 text-lg max-w-md">
            Sign in to manage your bookings, view your upcoming experiences, and discover new adventures on the Cape Town coast.
          </p>
        </div>

        <div className="relative z-10 text-white/60 text-sm">
          © 2026 Hey Charlie Charters
        </div>
      </div>

      {/* Right side - sign in form */}
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
          
          <SignIn 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-[var(--theme-card-bg)] border border-[var(--theme-border)] shadow-xl",
                headerTitle: "text-[var(--theme-text)]",
                headerSubtitle: "text-[var(--theme-text-muted)]",
                socialButtonsBlockButton: "border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-text)] hover:bg-[var(--theme-surface-hover)]",
                formFieldLabel: "text-[var(--theme-text-secondary)]",
                formFieldInput: "bg-[var(--theme-surface)] border-[var(--theme-border)] text-[var(--theme-text)]",
                footerActionLink: "text-orange-500 hover:text-orange-600",
                formButtonPrimary: "bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
