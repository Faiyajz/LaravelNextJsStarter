import { Link } from "react-router-dom";
import { Button } from "@/modules/shared";

const options = [
  {
    title: "Admin Portal",
    copy: "Supplier, fabric, and stock operations.",
    to: "/admin/login",
  },
  {
    title: "Buyer Portal",
    copy: "Buyer approvals, requests, and profiles.",
    to: "/buyer/login",
  },
];

export default function LoginOptionsSection() {
  return (
    <section className="grid gap-6 md:grid-cols-2">
      {options.map((option) => (
        <div
          key={option.title}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-slate-900">
            {option.title}
          </h2>
          <p className="mt-2 text-sm text-slate-600">{option.copy}</p>
          <Button className="mt-4" asChild>
            <Link to={option.to}>Continue</Link>
          </Button>
        </div>
      ))}
    </section>
  );
}
