"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { copy, type Language } from "@/lib/i18n";
import { Icon, type IconName } from "@/components/ui/icon";
import { tw } from "@/components/ui/styles";

const navItems: Array<{
  key: "home" | "purchases" | "reminders" | "account" | "addPurchase";
  href: string;
  icon: IconName;
  mobileOnly?: boolean;
}> = [
  { key: "home", href: "/dashboard", icon: "home" },
  { key: "purchases", href: "/purchases", icon: "purchase" },
  { key: "reminders", href: "/reminders", icon: "bell" },
  { key: "account", href: "/account", icon: "settings" },
  { key: "addPurchase", href: "/purchases/new", icon: "plus", mobileOnly: true },
];

export function AppNav({ language, mobile = false }: { language: Language; mobile?: boolean }) {
  const pathname = usePathname();
  const t = copy[language].dashboard;

  return (
    <nav className={tw(mobile ? "app-nav app-nav--mobile" : "app-nav")} aria-label={t.navigation}>
      {navItems
        .filter((item) => !item.mobileOnly || mobile)
        .map((item) => {
          const active =
            item.key === "home"
              ? pathname === "/dashboard"
              : item.key === "addPurchase"
                ? pathname === "/purchases/new"
              : item.key === "purchases"
                ? pathname.startsWith("/purchases") && pathname !== "/purchases/new"
                : item.key === "reminders"
                  ? pathname.startsWith("/reminders")
                  : item.key === "account"
                    ? pathname.startsWith("/account")
                    : false;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={tw(active ? "app-nav__item active" : "app-nav__item")}
              aria-current={active ? "page" : undefined}
            >
              <span className={tw("app-nav__icon")}><Icon name={item.icon} size={mobile ? 18 : 17} /></span>
              <span className={tw("app-nav__label")}>{item.key === "account" ? t.account : mobile && item.key === "addPurchase" ? (language === "hi" ? "जोड़ें" : "Add") : t[item.key]}</span>
            </Link>
          );
        })}
    </nav>
  );
}
