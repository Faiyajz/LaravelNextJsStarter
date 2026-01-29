const faqs = [
  {
    question: "Can I switch portals later?",
    answer: "Yes. Contact support to update your workspace access.",
  },
  {
    question: "Do buyers need an invitation?",
    answer: "Buyer accounts are typically provisioned by admins.",
  },
  {
    question: "Is onboarding supported?",
    answer: "We offer guided onboarding for enterprise teams.",
  },
];

export default function RegisterFAQSection() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">
        Registration FAQ
      </h3>
      <div className="mt-4 space-y-3">
        {faqs.map((faq) => (
          <div key={faq.question} className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900">
              {faq.question}
            </p>
            <p className="mt-1 text-sm text-slate-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
