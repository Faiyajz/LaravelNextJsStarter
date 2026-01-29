import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, UserCircle, ShoppingBag } from "lucide-react";
import { useAuth } from "@/modules/auth";
import { Button } from "@/modules/shared";

const navItems = [
  { label: "Dashboard", to: "/buyer", icon: Home },
  { label: "Profile", to: "/buyer/profile", icon: UserCircle },
  { label: "Orders", to: "/buyer/orders", icon: ShoppingBag },
];

export default function BuyerLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-500">
              Buyer Portal
            </p>
            <h1 className="text-lg font-semibold">LaravelNextJsStarter Buyers</h1>
          </div>
          <nav className="flex items-center gap-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm ${
                    isActive
                      ? "bg-amber-100 text-amber-700"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <Button
              type="button"
              variant="secondary"
              className="rounded-full"
              onClick={async () => {
                await logout();
                navigate("/buyer/login");
              }}
            >
              Sign out
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
