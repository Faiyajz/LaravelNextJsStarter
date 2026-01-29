const locations = [
  { city: "Dhaka", country: "Bangladesh", email: "dhaka@lynkup.app" },
  { city: "New York", country: "United States", email: "nyc@lynkup.app" },
  { city: "London", country: "United Kingdom", email: "london@lynkup.app" },
];

export default function LocationsSection() {
  return (
    <section className="grid gap-6 md:grid-cols-3">
      {locations.map((location) => (
        <div
          key={location.city}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-slate-900">
            {location.city}
          </h3>
          <p className="text-sm text-slate-500">{location.country}</p>
          <p className="mt-3 text-sm text-amber-600">{location.email}</p>
        </div>
      ))}
    </section>
  );
}
