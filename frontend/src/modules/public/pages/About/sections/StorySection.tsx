const milestones = [
  {
    title: "Supplier-first workflows",
    copy: "Design decisions centered on supply chain clarity and visibility.",
  },
  {
    title: "Buyer alignment",
    copy: "A buyer dashboard that keeps approvals and requests organized.",
  },
  {
    title: "Shared source of truth",
    copy: "All teams work from the same live fabric data.",
  },
];

export default function StorySection() {
  return (
    <section className="grid gap-6 md:grid-cols-3">
      {milestones.map((item) => (
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
