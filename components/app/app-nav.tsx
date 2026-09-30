"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { copy, type Language } from "@/lib/i18n";
import { Icon, type IconName } from "@/components/ui/icon";

const navItems: Array<{
  key: "home" | "purchases";
  href: string;
  icon: IconName;
}> = [
  { key: "home", href: "/dashboard", icon: "home" },
  { key: "purchases", href: "/purchases", icon: "purchase" },
];

export function AppNav({ language, mobile = false }: { language: Language; mobile?: boolean }) {
  const pathname = usePathname();
  const t = copy[language].dashboard;

  return (
    <nav className={mobile ? "app-nav app-nav--mobile" : "app-nav"} aria-label={t.navigation}>
      {navItems.map((item) => {
        const active =
          item.key === "home"
            ? pathname === "/dashboard"
            : pathname.startsWith("/purchases");

        return (
          <Link
            key={item.key}
            href={item.href}
            className={active ? "app-nav__item active" : "app-nav__item"}
            aria-current={active ? "page" : undefined}
          >
            <Icon name={item.icon} size={17} />
            <span>{t[item.key]}</span>
          </Link>
        );
      })}
    </nav>
  );
}
