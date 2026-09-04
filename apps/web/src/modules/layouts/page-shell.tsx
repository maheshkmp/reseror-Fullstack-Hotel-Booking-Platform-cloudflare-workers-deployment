import React from "react";

type Props = {
  title: string;
  description: string;
  actionComponent: React.ReactNode;
};

export function AppPageShell({ actionComponent, description, title }: Props) {
  return (
    <div className="flex items-center justify-between gap-6  border-border/50">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-foreground truncate leading-none">
            {title}
          </h2>
          <span className="hidden sm:block h-1 w-1 rounded-full bg-border flex-shrink-0" />
          <p className="hidden sm:block text-[13px] text-muted-foreground truncate leading-none">
            {description}
          </p>
        </div>
        <p className="sm:hidden text-[12px] text-muted-foreground mt-1 truncate">
          {description}
        </p>
      </div>

      <div className="flex-shrink-0">{actionComponent}</div>
    </div>
  );
}