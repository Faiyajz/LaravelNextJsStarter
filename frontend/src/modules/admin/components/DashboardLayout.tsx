import { useMemo, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Layers3,
  Trash2,
  Search,
  Bell,
  LogOut,
} from "lucide-react";

import { useAuth } from "@/modules/auth";
import { Button } from "@/modules/shared";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = useMemo(
    () => [
      { label: "Overview", to: "/admin", icon: LayoutDashboard },
      { label: "Suppliers", to: "/admin/suppliers", icon: Users },
      { label: "Buyers", to: "/admin/buyers", icon: UserCircle },
      { label: "Fabrics", to: "/admin/fabrics", icon: Layers3 },
      { label: "Trash", to: "/admin/trash", icon: Trash2 },
    ],
    [],
  );

  const activeItem =
    navItems.find((item) => {
      if (item.to === "/admin") return location.pathname === "/admin";
      return location.pathname.startsWith(item.to);
    }) ?? navItems[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-64 flex-col bg-slate-950 text-slate-100">
          <div className="px-6 py-6 border-b border-slate-800">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300/70">
              Admin Suite
            </p>
            <h1 className="text-xl font-semibold text-white mt-2 leading-tight">
              Supplier & Fabric
              <span className="block text-slate-300">Management</span>
            </h1>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    isActive
                      ? "bg-amber-300/10 text-amber-200 ring-1 ring-amber-300/30"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="px-4 pb-6">
            <div className="rounded-xl bg-slate-900/70 px-4 py-3 border border-slate-800">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Signed in
              </p>
              <p className="text-sm text-slate-100 mt-1">{user?.name}</p>
              <button
                onClick={logout}
                className="mt-3 inline-flex items-center gap-2 text-xs text-slate-300 hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
            <div className="px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  {activeItem.label}
                </p>
                <h2 className="text-2xl font-semibold text-slate-900">
                  {activeItem.label}
                </h2>
              </div>

              <div className="flex flex-1 items-center gap-3 lg:justify-end">
                <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    placeholder="Search suppliers, fabrics..."
                    className="w-56 border-none bg-transparent text-sm text-slate-600 outline-none placeholder:text-slate-400"
                  />
                </div>
                <button className="relative rounded-full border border-slate-200 bg-white p-2 text-slate-500 shadow-sm hover:text-slate-700">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                </button>
                <div className="hidden sm:flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
                  <div className="h-7 w-7 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center">
                    {(user?.name ?? "U").slice(0, 1).toUpperCase()}
                  </div>
                  <div className="text-sm text-slate-700">{user?.name}</div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={logout}
                    className="h-7 px-3 text-xs"
                  >
                    Logout
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 lg:hidden">
                {navItems.map((item) => {
                  const isActive =
                    item.to === "/"
                      ? location.pathname === "/"
                      : location.pathname.startsWith(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`rounded-full px-3 py-1 text-xs ${
                        isActive
                          ? "bg-slate-900 text-white"
                          : "bg-white text-slate-600 border border-slate-200"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
