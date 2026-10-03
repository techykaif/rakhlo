"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/ui/icon";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
};

export function Select({
  value,
  options,
  onChange,
  placeholder = "Choose an option",
  ariaLabel,
  id,
  name,
  disabled = false,
  invalid = false,
  className = "",
}: SelectProps) {
  const generatedId = useId();
  const triggerId = id ?? \`select-\${generatedId}\`;
  const listboxId = \`\${triggerId}-options\`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function choose(nextValue: string) {
    onChange(nextValue);
    setOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen((current) => !current);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const direction = event.key === "ArrowUp" ? -1 : 1;
      const nextIndex =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? Math.max(options.length - 1, 0)
            : Math.min(
                Math.max((selectedIndex >= 0 ? selectedIndex : 0) + direction, 0),
                Math.max(options.length - 1, 0),
              );

      const next = options[nextIndex];
      if (next) {
        onChange(next.value);
        setOpen(true);
      }
    }
  }

  return (
    <div ref={rootRef} className={["relative w-full", className].filter(Boolean).join(" ")}>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <button
        id={triggerId}
        type="button"
        className={[
          "flex min-h-10 w-full items-center justify-between gap-3 rounded-lg border bg-white px-3 text-[12px] font-medium text-[#171713] outline-none transition",
          invalid ? "border-[#c89b9b] ring-2 ring-[#f2dddd]" : "border-[#d4d3cc]",
          "hover:border-[#b9b8b0] focus-visible:border-[#a9aaa3] focus-visible:ring-4 focus-visible:ring-[#c8f77a22]",
          "disabled:cursor-not-allowed disabled:opacity-55",
        ].join(" ")}
        role="combobox"
        aria-label={ariaLabel}
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={invalid || undefined}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleKeyDown}
      >
        <span className={selected ? "truncate" : "truncate text-[#8a8b82]"}>
          {selected?.label ?? placeholder}
        </span>
        <Icon name="chevron-down" size={15} strokeWidth={1.9} />
      </button>

      {open ? (
        <div
          id={listboxId}
          className="absolute left-0 top-[calc(100%+6px)] z-50 max-h-60 w-full overflow-y-auto rounded-xl border border-[#dfded7] bg-white p-1.5 shadow-[0_18px_40px_rgba(23,23,19,0.14)]"
          role="listbox"
          aria-label={ariaLabel}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={[
                "flex w-full items-center justify-between gap-3 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-[11px] text-[#4f5049] transition",
                "hover:bg-[#f4f4ef] focus-visible:bg-[#f4f4ef] focus-visible:outline-none",
                option.value === value ? "bg-[#eef5e8] font-bold text-[#171713]" : "",
              ].join(" ")}
              onClick={(event) => {
                event.stopPropagation();
                choose(option.value);
              }}
            >
              <span className="truncate">{option.label}</span>
              {option.value === value ? <Icon name="check" size={14} strokeWidth={2} /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
