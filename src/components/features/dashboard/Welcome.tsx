"use client";

import { useTranslations } from "next-intl";
import { m } from "motion/react";
import { authClient } from "@/src/lib/auth-client";
import { use } from "react";

export default function Welcome() {
  const t = useTranslations("dashboard.welcome");
  const { data } = authClient.useSession();
  const user = data?.user;

  const isAdmin = user?.role === "ADMIN";

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full overflow-hidden rounded-xl border border-border bg-card/70 p-8 shadow-xl"
    >

      <div className="relative z-10 flex flex-col gap-4">
        <m.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-foreground tracking-tight"
        >
          {t("greeting", { name: user?.name || t("guest") })}
        </m.h2>

        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-muted-foreground max-w-2xl"
        >
          {isAdmin ? (
            <p className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              {t("admin_message")}
            </p>
          ) : (
            <p>{t("user_message")}</p>
          )}
        </m.div>
      </div>
    </m.div>
  );
}
