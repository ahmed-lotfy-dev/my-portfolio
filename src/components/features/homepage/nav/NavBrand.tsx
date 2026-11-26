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
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center transition-transform duration-500 ease-brand group-hover:scale-[1.03]">
          <Image
            src="/as-mark.svg"
            fill
            sizes="36px"
            alt="Ahmed Lotfy logo"
            className="relative z-10 object-contain"
            priority
          />
        </div>
      </div>
      <span className="hidden flex-col leading-none sm:flex">
        <span className="text-sm font-semibold tracking-[-0.02em] text-foreground">
          {locale === "ar" ? "أحمد لطفي" : "Ahmed Lotfy"}
        </span>
        <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {locale === "ar" ? "مهندس برمجيات" : "Software Engineer"}
        </span>
      </span>
    </Link>
  );
}
