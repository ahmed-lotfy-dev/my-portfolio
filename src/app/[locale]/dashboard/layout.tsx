import Aside from "@/src/components/dashboard-components/Aside";
import MobileNav from "@/src/components/dashboard-components/MobileNav";
import UserButton from "@/src/components/dashboard-components/UserButton";
import LanguageSwitcher from "@/src/components/i18n/LanguageSwitcher";
import ThemeToggle from "@/src/components/ThemeToggle";
import { getLocale } from "next-intl/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="border-r">
        <Aside />
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          <MobileNav />
          <div className="w-full flex-1">
            {/* Can be used for search bar */}
          </div>
          <div
            className={`flex justify-center items-center gap-3 ${
              locale === "ar" ? "flex-row-reverse" : ""
            }`}
          >
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          <UserButton />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
