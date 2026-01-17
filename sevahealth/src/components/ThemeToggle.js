"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-2">
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="px-3 py-2 rounded-lg border
                   bg-white dark:bg-slate-900
                   text-slate-900 dark:text-white
                   text-sm"
      >
        <option value="light">🌞 Light</option>
        <option value="dark">🌙 Dark</option>
        <option value="system">🖥 System</option>
      </select>
    </div>
  );
}
