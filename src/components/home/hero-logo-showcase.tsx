import Image from "next/image";

export function HeroLogoShowcase() {
  return (
    <div className="relative hidden lg:block">
      <div className="relative mx-auto aspect-square max-w-[min(100%,28rem)]">
        <div
          className="absolute inset-0 rounded-3xl border border-white/15 bg-gradient-to-br from-orange-500/20 via-pink-500/10 to-cyan-500/20 backdrop-blur-sm"
          aria-hidden="true"
        />
        <div className="absolute inset-4 overflow-hidden rounded-2xl">
          <Image
            src="/logo2.png"
            alt="Hey Charlie Charters"
            fill
            className="object-contain p-8"
            priority
            sizes="448px"
          />
        </div>
        <div className="absolute -right-4 -top-4 animate-float rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white">
          Whale Season Now!
        </div>
        <div className="absolute -bottom-4 -left-4 animate-float-delayed rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 text-sm font-medium text-white">
          Crayfish Available
        </div>
      </div>
    </div>
  );
}
