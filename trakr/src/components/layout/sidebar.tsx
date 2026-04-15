import Link from "next/link";
import { Logo } from "./logo";

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Settings", href: "/settings" },
];

export function Sidebar() {
  return (
    <aside className="flex h-screen w-56 flex-col border-r border-border-subtle bg-surface-base">
      <div className="flex h-14 items-center px-5">
        <Link href="/"><Logo className="text-xl" /></Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-card hover:text-foreground">
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
