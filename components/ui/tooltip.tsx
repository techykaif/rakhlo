"use client";

import type { ReactNode } from "react";
import { tw } from "@/components/ui/styles";

export function Tooltip({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <span className={tw("tooltip")}>
      {children}
      <span className={tw("tooltip__content")} role="tooltip">
        {label}
      </span>
    </span>
  );
}
