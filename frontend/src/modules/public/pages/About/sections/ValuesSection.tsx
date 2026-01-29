const values = [
  "Radical visibility across sourcing",
  "Workflow automation without losing control",
  "Clean, modular design for scale",
];

export default function ValuesSection() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Our Values</h2>
      <ul className="mt-4 space-y-2 text-sm text-slate-600">
        {values.map((value) => (
          <li key={value} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            {value}
          </li>
        ))}
      </ul>
    </section>
  );
}
