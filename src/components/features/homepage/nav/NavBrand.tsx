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
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center transition-all duration-500 group-hover:rotate-3 group-hover:scale-110 sm:h-16 sm:w-16">
          <Image
            src="/as-mark.svg"
            fill
            sizes="64px"
            alt="Ahmed Shoman logo"
            className="p-1.5 relative z-10 scale-110"
            priority
          />
        </div>
      </div>
    </Link>
  );
}
