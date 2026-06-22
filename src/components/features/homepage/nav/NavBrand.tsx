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
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center transition-all duration-500 group-hover:rotate-3 group-hover:scale-105 sm:h-14 sm:w-14">
          <Image
            src="/as-mark.svg"
            fill
            sizes="56px"
            alt="Ahmed Lotfy logo"
            className="relative z-10 object-contain"
            priority
          />
        </div>
      </div>
    </Link>
  );
}
