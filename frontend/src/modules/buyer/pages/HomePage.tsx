import { Link } from "react-router-dom";
import { Button } from "@/modules/shared";

export default function BuyerHomePage() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-500">
          Buyer Overview
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-900">
          Welcome back to your sourcing hub
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Manage your supplier relationships, sample requests, and approvals in
          one place.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/buyer/profile">Update Profile</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/buyer/orders">View Orders</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { title: "Open Requests", value: "4" },
          { title: "Pending Approvals", value: "2" },
          { title: "Active Suppliers", value: "8" },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              {card.title}
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
