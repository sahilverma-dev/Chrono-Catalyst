"use client";

import { Monitor, Moon, SunMedium } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMounted } from "@/hooks/use-is-mouted";
import { cn } from "@/lib/utils";
import { Theme, useTheme } from "./providers/theme-provider";

type ThemeToggleProps = {
  className?: string;
};

const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const isMounted = useIsMounted();
  const { theme, setTheme } = useTheme();

  function handleThemeChange(value: Theme) {
    if (value) setTheme(value);
  }

  return (
    <ToggleGroup
      type="single"
      value={isMounted() ? theme : "system"}
      onValueChange={handleThemeChange}
      className={cn("rounded-full border p-1 ml-auto", className)}
    >
      <ToggleGroupItem
        aria-label="Toggle Light Mode"
        value="light"
        className="size-8 rounded-full px-2"
      >
        <SunMedium className="h-4" />
      </ToggleGroupItem>

      <ToggleGroupItem
        aria-label="Toggle System Mode"
        value="system"
        className="size-8 rounded-full px-2"
      >
        <Monitor className="h-4" />
      </ToggleGroupItem>

      <ToggleGroupItem
        aria-label="Toggle Dark Mode"
        value="dark"
        className="size-8 rounded-full px-2"
      >
        <Moon className="h-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ThemeToggle;
