import Link from "next/link";
import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  action?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  backHref,
  backLabel,
  action,
}: PageHeaderProps) {
  return (
    <header className="app-page-header">
      <div>
        {backHref && backLabel ? (
          <Link className="page-back-link" href={backHref}>
            ← {backLabel}
          </Link>
        ) : null}
        <span className="app-kicker">{eyebrow}</span>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? <div className="app-page-header__action">{action}</div> : null}
    </header>
  );
}
