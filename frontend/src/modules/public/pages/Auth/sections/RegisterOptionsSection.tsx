import { Link } from "react-router-dom";
import { Button } from "@/modules/shared";

const options = [
  {
    title: "Admin Workspace",
    copy: "Set up the admin workspace for supplier operations.",
    to: "/admin/register",
  },
  {
    title: "Buyer Workspace",
    copy: "Create a buyer account to manage approvals.",
    to: "/buyer/register",
  },
];

export default function RegisterOptionsSection() {
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
