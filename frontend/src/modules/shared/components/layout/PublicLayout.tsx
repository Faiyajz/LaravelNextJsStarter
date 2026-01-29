import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/modules/shared/components/ui/button";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Policy", to: "/policy" },
];

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.4em] text-amber-500">
              LaravelNextJsStarter
            </span>
            <span className="text-sm font-semibold text-slate-900">
              Public
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  [
                    "text-sm transition",
                    isActive
                      ? "text-slate-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900",
                  ].join(" ")
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/buyer/register">Register</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
