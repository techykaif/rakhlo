"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { copy, type Language } from "@/lib/i18n";
import { Icon, type IconName } from "@/components/ui/icon";
import { tw } from "@/components/ui/styles";

const navItems: Array<{
  key: "home" | "purchases" | "reminders" | "account" | "status" | "support" | "addPurchase";
  href: string;
  icon: IconName;
  mobileOnly?: boolean;
  hideOnMobile?: boolean;
}> = [
  { key: "home", href: "/dashboard", icon: "home" },
  { key: "purchases", href: "/purchases", icon: "purchase" },
  { key: "reminders", href: "/reminders", icon: "bell" },
  { key: "account", href: "/account", icon: "settings" },
  { key: "status", href: "/status", icon: "calendar", hideOnMobile: true },
  { key: "support", href: "/support", icon: "info", hideOnMobile: true },
  { key: "addPurchase", href: "/purchases/new", icon: "plus", mobileOnly: true },
];

export function AppNav({ language, mobile = false }: { language: Language; mobile?: boolean }) {
  const pathname = usePathname();
  const t = copy[language].dashboard;

  return (
    <nav className={tw(mobile ? "app-nav app-nav--mobile" : "app-nav")} aria-label={t.navigation}>
      {navItems
        .filter((item) => (!item.mobileOnly || mobile) && (!item.hideOnMobile || !mobile))
        .map((item) => {
          const active =
            item.key === "home"
              ? pathname === "/dashboard"
              : item.key === "purchases"
                ? pathname.startsWith("/purchases")
                : item.key === "reminders"
                  ? pathname.startsWith("/reminders")
                  : item.key === "account"
                    ? pathname.startsWith("/account")
                    : item.key === "status"
                      ? pathname === "/status"
                    : item.key === "support"
                      ? pathname.startsWith("/support")
                      : false;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={tw(active ? "app-nav__item active" : "app-nav__item")}
              aria-current={active ? "page" : undefined}
            >
              <Icon name={item.icon} size={17} />
              <span>{item.key === "status" ? "Status" : item.key === "support" ? "Support" : item.key === "account" ? t.account : t[item.key]}</span>
            </Link>
          );
        })}
    </nav>
  );
}
