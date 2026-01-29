const sections = [
  {
    title: "Usage guidelines",
    copy: "Use the platform for verified sourcing activity and collaboration.",
  },
  {
    title: "Data retention",
    copy: "Records are retained according to organizational agreements.",
  },
  {
    title: "Support",
    copy: "Contact our team for compliance or audit requests.",
  },
];

export default function DetailsSection() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">
        Policy details
      </h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {sections.map((item) => (
          <div key={item.title} className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-base font-semibold text-slate-900">
              {item.title}
            </h3>
            <p className="mt-2 text-sm text-slate-600">{item.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
