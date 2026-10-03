import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "home"
  | "purchase"
  | "bell"
  | "settings"
  | "plus"
  | "search"
  | "arrow-left"
  | "arrow-right"
  | "command"
  | "logout"
  | "file"
  | "calendar"
  | "check"
  | "google"
  | "github"
  | "chevron-right"
  | "chevron-down"
  | "info";

const paths: Record<IconName, ReactNode> = {
  home: <path d="M3.5 10.7 12 3.5l8.5 7.2v8a1.8 1.8 0 0 1-1.8 1.8H5.3a1.8 1.8 0 0 1-1.8-1.8z" />,
  purchase: (
    <>
      <rect x="4" y="3.5" width="16" height="17" rx="2.2" />
      <path d="M8 7.5h8M8 11.5h8M8 15.5h5" />
    </>
  ),
  bell: (
    <>
      <path d="M18.2 9.6c0-3.4-2.3-5.8-6.2-5.8s-6.2 2.4-6.2 5.8c0 5-2 5.3-2 6.7h16.4c0-1.4-2-1.7-2-6.7Z" />
      <path d="M9.7 19a2.5 2.5 0 0 0 4.6 0" />
    </>
  ),
  settings: (
    <>
      <path d="m12 3 1 .3.6 1.8 1.7.9 1.8-.5 1.3 1.6-.9 1.6.1 2 1.6 1 .1 2-1.9.7-.8 1.8.6 1.7-1.7 1.2-1.6-1-1.9.6-.8 1.8h-2l-.8-1.8-1.9-.6-1.6 1-1.7-1.2.6-1.7-.8-1.8-1.9-.7.1-2 1.6-1-.1-2-.9-1.6L6.2 5l1.8.5 1.7-.9.6-1.8Z" />
      <circle cx="12" cy="12.5" r="2.6" />
    </>
  ),
  plus: <path d="M12 4v16M4 12h16" />,
  search: <circle cx="10.8" cy="10.8" r="6.3" />,
  "arrow-left": <path d="m14.5 5-7 7 7 7M8 12h10" />,
  "arrow-right": <path d="m9.5 5 7 7-7 7M16 12H6" />,
  command: (
    <>
      <rect x="4" y="4" width="6" height="6" rx="2" />
      <rect x="14" y="4" width="6" height="6" rx="2" />
      <rect x="4" y="14" width="6" height="6" rx="2" />
      <rect x="14" y="14" width="6" height="6" rx="2" />
      <path d="M10 7h4M7 10v4M14 17h-4M17 14v-4" />
    </>
  ),
  logout: (
    <>
      <path d="M10 4H6.8A1.8 1.8 0 0 0 5 5.8v12.4A1.8 1.8 0 0 0 6.8 20H10" />
      <path d="m14 8 4 4-4 4M9 12h9" />
    </>
  ),
  file: (
    <>
      <path d="M7 3.5h6l4 4v12H7A2 2 0 0 1 5 17.5v-12a2 2 0 0 1 2-2Z" />
      <path d="M13 3.5v4h4M8 12h6M8 15.5h6" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="14" rx="2" />
      <path d="M8 3.5v4M16 3.5v4M4 9.5h16" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  google: (
    <>
      <path d="M21 12.2c0-5.1-3.8-8.7-8.9-8.7-5.1 0-9.1 3.9-9.1 8.8s4 8.8 9.1 8.8c4.5 0 8.5-3.1 8.5-8.2 0-.5 0-.5-.1-.7h-8.4v3.4h4.8c-.4 2.2-2.3 3.5-4.8 3.5a6.7 6.7 0 1 1 0-13.4 6.5 6.5 0 0 1 4.5 1.8l2.4-2.3A9.7 9.7 0 0 0 12.1 3C6.8 3 3 7 3 12.3s3.8 9.2 9.1 9.2c5.2 0 8.9-3.7 8.9-9.1Z" />
    </>
  ),
  github: (
    <path d="M12 3.2a8.9 8.9 0 0 0-2.8 17.4c.4.1.5-.2.5-.4v-1.6c-2.2.5-2.7-1-2.7-1-0.4-1-0.9-1.2-.9-1.2-0.8-.6.1-.6.1-.6.9.1 1.4.9 1.4.9.8 1.4 2 1 2.5.8.1-.6.3-1 .5-1.2-1.7-.2-3.5-.9-3.5-3.8 0-.8.3-1.5.8-2-.1-.2-.4-1 .1-2 0 0 .7-.2 2.1.8a7.3 7.3 0 0 1 3.8 0c1.4-1 2.1-.8 2.1-.8.6 1 .2 1.8.1 2 .5.5.8 1.2.8 2 0 2.9-1.8 3.6-3.5 3.8.3.3.5.8.5 1.5v2.2c0 .2.1.5.5.4A8.9 8.9 0 0 0 12 3.2Z" />
  ),
  "chevron-right": <path d="m9 6 6 6-6 6" />,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 10.5v5M12 7.5h.01" />
    </>
  ),
};

export function Icon({
  name,
  size = 16,
  strokeWidth = 1.8,
  ...props
}: SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
