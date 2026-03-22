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
        <div className="absolute -inset-1 rounded-2xl bg-primary/20 blur-md transition-all duration-500 group-hover:bg-primary/40" />
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black shadow-lg transition-all duration-500 group-hover:rotate-3 group-hover:scale-110 sm:h-14 sm:w-14">
          <Image
            src="/as-mark.svg"
            fill
            sizes="56px"
            alt="Ahmed Shoman logo"
            className="object-contain p-2 relative z-10"
            priority
          />
        </div>
      </div>
    </Link>
  );
}
