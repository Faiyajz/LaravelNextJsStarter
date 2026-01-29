import { Button } from "@/modules/shared";

export default function FormSection() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Send a message</h2>
      <form className="mt-6 grid gap-4 md:grid-cols-2">
        <input
          className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm"
          placeholder="Name"
          type="text"
        />
        <input
          className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm"
          placeholder="Company"
          type="text"
        />
        <input
          className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm md:col-span-2"
          placeholder="Email"
          type="email"
        />
        <textarea
          className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm md:col-span-2"
          placeholder="How can we help?"
          rows={4}
        />
        <div className="md:col-span-2">
          <Button type="button">Submit request</Button>
        </div>
      </form>
    </section>
  );
}
