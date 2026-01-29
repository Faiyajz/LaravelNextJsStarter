const roleCards = [
  {
    title: "Supplier Ops",
    copy: "Track fabric data, stock, and approvals in one admin suite.",
  },
  {
    title: "Buyer Profiles",
    copy: "Dedicated buyer dashboard with profile and order visibility.",
  },
  {
    title: "Shared System",
    copy: "Consistent data models and UI components across modules.",
  },
];

export default function RolesSection() {
  return (
    <section className="grid gap-6 md:grid-cols-3">
      {roleCards.map((item) => (
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
