"use client";

import { MessageCircle, X } from "lucide-react";
import {
  useEffect,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  META_NOTE,
  getWriteChannels,
  type WriteChannel,
} from "@/lib/content";

type WriteButtonProps = {
  channels?: WriteChannel[];
  className?: string;
  children?: ReactNode;
  showIcon?: boolean;
  onOpenChange?: (open: boolean) => void;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className" | "type" | "onClick">;

export function WriteButton({
  channels: channelsProp,
  className = "",
  children = "Написать",
  showIcon = true,
  onOpenChange,
  ...props
}: WriteButtonProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const channels = channelsProp?.length ? channelsProp : getWriteChannels();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  function setOpenSafe(next: boolean) {
    setOpen(next);
    onOpenChange?.(next);
  }

  const hasMeta = channels.some((c) => c.metaMarked);

  return (
    <>
      <button
        type="button"
        className={className}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpenSafe(true)}
        {...props}
      >
        {showIcon ? (
          <MessageCircle size={14} strokeWidth={1.5} aria-hidden />
        ) : null}
        {children}
      </button>

      {mounted && open
        ? createPortal(
            <div
              className="fixed inset-0 z-[9999] flex items-end justify-center bg-ink-strong/55 px-3 py-3 backdrop-blur-[3px] sm:items-center sm:px-6"
              role="presentation"
              onClick={() => setOpenSafe(false)}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="relative z-[10000] w-full max-w-sm overflow-hidden rounded-[1.5rem] border border-line bg-bg shadow-[0_24px_80px_rgba(26,26,26,0.28)]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
                  <h3
                    id={titleId}
                    className="font-sans text-[15px] font-medium text-ink"
                  >
                    Куда написать
                  </h3>
                  <button
                    type="button"
                    aria-label="Закрыть"
                    onClick={() => setOpenSafe(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-line-hover"
                  >
                    <X size={18} strokeWidth={1.5} />
                  </button>
                </div>

                <ul className="flex flex-col gap-2 p-4">
                  {channels.map((channel) => (
                    <li key={channel.id}>
                      {channel.href ? (
                        <a
                          href={channel.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-12 w-full items-center justify-between gap-3 rounded-full border border-line px-5 text-[14px] text-ink transition-colors hover:border-line-hover hover:bg-tone-3/40"
                          onClick={() => setOpenSafe(false)}
                        >
                          <span>{channel.label}</span>
                          <span className="text-[12px] text-muted">открыть</span>
                        </a>
                      ) : (
                        <span className="inline-flex min-h-12 w-full items-center justify-between gap-3 rounded-full border border-line/70 px-5 text-[14px] text-muted">
                          <span>{channel.label}</span>
                          <span className="text-[12px]">ссылка скоро</span>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                {hasMeta ? (
                  <p className="border-t border-line px-5 py-3 text-[11px] leading-relaxed text-muted">
                    {META_NOTE}
                  </p>
                ) : null}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
