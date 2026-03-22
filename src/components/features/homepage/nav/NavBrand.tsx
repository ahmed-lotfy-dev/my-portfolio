import Image from "next/image";
import Link from "next/link";

type NavBrandProps = {
  locale: string;
};

export function NavBrand({ locale }: NavBrandProps) {
  return (
    <Link
      href={`/${locale}`}
      className="group flex items-center gap-3 md:gap-4 transition-colors"
    >
      <div className="relative">
        <div className="absolute -inset-0.5 rounded-2xl bg-primary/10 blur-sm transition-all duration-500 group-hover:bg-primary/20" />
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[1.25rem] border border-white/10 bg-black shadow-lg transition-all duration-500 group-hover:rotate-3 group-hover:scale-105 sm:h-16 sm:w-16">
          <Image
            src="/as-mark.svg"
            fill
            sizes="64px"
            alt="Ahmed Shoman logo"
            className="p-2.5 relative z-10 scale-110 -translate-x-px"
            priority
          />
        </div>
      </div>
    </Link>
  );
}
