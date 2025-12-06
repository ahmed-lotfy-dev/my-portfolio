"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { authClient } from "@/src/lib/auth-client";
import { useEffect, useState } from "react";

export default function Welcome() {
  const t = useTranslations("dashboard.welcome");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await authClient.getSession();
      setUser(data?.user);
    };
    fetchSession();
  }, []);

  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full relative overflow-hidden rounded-3xl bg-zinc-900/50 border border-white/5 p-8 backdrop-blur-xl shadow-2xl"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-zinc-800/50 blur-3xl opacity-30 pointer-events-none" />

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
