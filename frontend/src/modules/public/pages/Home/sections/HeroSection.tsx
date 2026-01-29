import { Link } from "react-router-dom";
import { Button } from "@/modules/shared";

export default function HeroSection() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-10 shadow-sm backdrop-blur">
      <p className="text-xs uppercase tracking-[0.4em] text-amber-500">
        LaravelNextJsStarter Platform
      </p>
      <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
        One workspace for suppliers, buyers, and teams.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">
        Centralize fabric sourcing, approvals, and collaboration with clean
        dashboards for every role.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <Button asChild>
          <Link to="/admin/login">Admin Login</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/buyer/login">Buyer Login</Link>
        </Button>
      </div>
    </section>
  );
}
