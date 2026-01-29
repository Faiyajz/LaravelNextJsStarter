const principles = [
  {
    title: "Data privacy",
    copy: "We only collect what's needed for the workspace experience.",
  },
  {
    title: "Access control",
    copy: "Role-based permissions keep supplier and buyer data separated.",
  },
  {
    title: "Auditability",
    copy: "Actions are tracked so teams can verify changes and approvals.",
  },
];

export default function PrinciplesSection() {
  return (
    <section className="grid gap-6 md:grid-cols-3">
      {principles.map((item) => (
        <div
          key={item.title}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-slate-900">
            {item.title}
          </h3>
          <p className="mt-2 text-sm text-slate-600">{item.copy}</p>
        </div>
      ))}
    </section>
  );
}
