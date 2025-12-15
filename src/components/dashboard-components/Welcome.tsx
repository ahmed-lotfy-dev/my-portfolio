"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { authClient } from "@/src/lib/auth-client";
import { use } from "react";

const sessionPromise = authClient.getSession();

export default function Welcome() {
  const t = useTranslations("dashboard.welcome");
  const { data } = use(sessionPromise);
  const user = data?.user;

  const isAdmin = user?.role === "ADMIN";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full relative overflow-hidden rounded-xl  border border-blue p-8  shadow-1xl"
    >

      <div className="relative z-10 flex flex-col gap-4">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-foreground tracking-tight"
        >
          {t("greeting", { name: user?.name || t("guest") })}
        </motion.h2>

        <motion.div
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
        </motion.div>
      </div>
    </motion.div>
  );
}
