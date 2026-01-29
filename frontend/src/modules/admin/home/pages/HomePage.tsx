import { Link } from "react-router-dom";
import { Button } from "@/modules/shared";
import { PageShell, Panel, StatCard } from "@/modules/shared";
import {
  ArrowUpRight,
  Boxes,
  Building2,
  ClipboardList,
  RefreshCcw,
} from "lucide-react";

export default function HomePage() {
  return (
    <PageShell
      title="Dashboard"
      description="Track suppliers, fabrics, and inventory flow in one place."
      actions={
        <>
          <Link to="/admin/suppliers/create">
            <Button className="gap-2">
              <Building2 className="h-4 w-4" />
              Add Supplier
            </Button>
          </Link>
          <Link to="/admin/fabrics/create">
            <Button variant="outline" className="gap-2">
              <Boxes className="h-4 w-4" />
              Add Fabric
            </Button>
          </Link>
        </>
      }
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <StatCard
            label="Suppliers"
            value="148 Active"
            delta="+12 added this month"
            icon={<Building2 className="h-5 w-5" />}
            tone="amber"
            action={
              <div className="flex items-center justify-between text-sm text-slate-600">
                <Link to="/admin/suppliers" className="hover:text-slate-900">
                  View directory
                </Link>
                <ArrowUpRight className="h-4 w-4 text-slate-400" />
              </div>
            }
          />

          <StatCard
            label="Fabrics"
            value="642 SKUs"
            delta="34 new rolls arriving"
            icon={<Boxes className="h-5 w-5" />}
            tone="sky"
            action={
              <div className="flex items-center justify-between text-sm text-slate-600">
                <Link to="/admin/fabrics" className="hover:text-slate-900">
                  Explore catalog
                </Link>
                <ArrowUpRight className="h-4 w-4 text-slate-400" />
              </div>
            }
          />

          <StatCard
            label="Inventory Flow"
            value="28 Movements"
            delta="5 low-stock alerts"
            icon={<ClipboardList className="h-5 w-5" />}
            tone="emerald"
            action={
              <div className="flex items-center justify-between text-sm text-slate-600">
                <Link to="/admin/trash" className="hover:text-slate-900">
                  Review alerts
                </Link>
                <ArrowUpRight className="h-4 w-4 text-slate-400" />
              </div>
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Panel>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Recent Activity
              </h3>
              <button className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1">
                <RefreshCcw className="h-3.5 w-3.5" />
                Refresh
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {[
                "New supplier added: Mira Textile Co.",
                "Fabric SKU FAB-204 restocked (+120)",
                "Trash item restored: Supplier Delta Spinners",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3 text-sm text-slate-600"
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <h3 className="text-lg font-semibold text-slate-900">
              Quick Actions
            </h3>
            <div className="mt-4 grid gap-3">
              <Link to="/admin/suppliers">
                <Button variant="outline" className="w-full justify-between">
                  View suppliers
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/admin/fabrics">
                <Button variant="outline" className="w-full justify-between">
                  View fabrics
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/admin/trash">
                <Button variant="outline" className="w-full justify-between">
                  Review trash
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Panel>
        </div>
      </div>
    </PageShell>
  );
}
