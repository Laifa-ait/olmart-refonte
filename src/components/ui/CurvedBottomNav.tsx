import React from "react";

export interface CurvedNavItem<T = string> {
  id: T;
  label?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string | boolean;
  ariaLabel?: string;
  onClick?: () => void;
}

export interface CurvedBottomNavProps<T = string> {
  items: CurvedNavItem<T>[];
  activeId: T;
  onChange: (id: T) => void;
  className?: string;
}

/** Barre mobile compacte, sans libellés, avec un onglet actif en relief. */
export function CurvedBottomNav<T = string>({
  items,
  activeId,
  onChange,
  className = "",
}: CurvedBottomNavProps<T>): React.JSX.Element {
  return (
    <nav
      dir="ltr"
      aria-label="Navigation principale"
      className={`relative mx-auto flex h-[68px] w-[calc(100%-24px)] max-w-md items-center justify-around rounded-[22px] border border-[#e8e1e9] bg-white/95 px-2 shadow-[0_8px_28px_rgba(35,25,40,0.14)] backdrop-blur-xl ${className}`}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        const Icon = item.icon;
        return (
          <button
            key={String(item.id)}
            type="button"
            onClick={() => {
              onChange(item.id);
              item.onClick?.();
            }}
            aria-label={item.ariaLabel || item.label || String(item.id)}
            aria-current={isActive ? "page" : undefined}
            className={`relative flex h-11 w-11 items-center justify-center rounded-[17px] border-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6b5874] focus-visible:ring-offset-2 ${isActive ? "bg-[#5b4865] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_3px_8px_rgba(54,39,61,0.22)]" : "bg-transparent text-[#8390a5] hover:bg-[#f7f4f7] hover:text-[#5b4865]"}`}
          >
            <Icon className="relative z-10 h-[21px] w-[21px] stroke-[2]" />
            {item.badge !== undefined && item.badge !== false && (
              <span className="absolute -right-0.5 -top-0.5 z-20 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-white bg-[#c49b4a] px-1 text-[9px] font-bold leading-none text-white">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
