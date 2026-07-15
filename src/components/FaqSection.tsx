export default function FaqSection() {
  const faqs = [
    {
      question: "How long can I stay in the sun without sunscreen?",
      answer:
        "It depends on your skin type and the current UV index. Fair skin (Type I) can burn in as little as 10 minutes under high UV, while darker skin (Type V-VI) has significantly more natural protection. Use this calculator with SPF set to 1 (no sunscreen) to see your estimated safe time based on current conditions.",
    },
    {
      question: "What does SPF actually mean?",
      answer:
        "SPF stands for Sun Protection Factor. The number indicates how much longer you can stay in the sun compared to unprotected skin. SPF 30 means you can stay out roughly 30 times longer. However, this assumes proper application. Most people apply only half the recommended amount, which reduces the effective protection. Reapply every 2 hours for best results.",
    },
    {
      question: "How does skin type affect sun exposure time?",
      answer:
        "The Fitzpatrick scale classifies skin into six types based on UV response. Type I (very fair, always burns) has the lowest natural tolerance at about 67 minutes base exposure, while Type VI (deeply pigmented, never burns) has about 233 minutes. These base values are divided by the UV index to determine your actual safe time.",
    },
    {
      question: "What UV index is dangerous?",
      answer:
        "UV index 1-2 is low risk. At 3-5 (moderate), unprotected skin can burn in 30-45 minutes. At 6-7 (high), reduce midday exposure. At 8-10 (very high), you should seek shade and wear sunscreen. Above 11 (extreme), avoid prolonged outdoor exposure entirely. The UV index peaks between 10 AM and 4 PM.",
    },
    {
      question: "How accurate is this sunbathing calculator?",
      answer:
        "This calculator provides estimates based on the standard formula using your skin type, SPF, and UV index. Real-world factors like cloud cover, altitude, water reflection, sunscreen application thickness, and individual skin sensitivity can affect actual results. Always treat the results as guidelines and err on the side of caution. This is not medical advice.",
    },
    {
      question: "Should I avoid the sun completely?",
      answer:
        "No. Moderate sun exposure is beneficial for vitamin D production and overall health. The goal is to enjoy the sun safely without overexposure. Know your limits based on your skin type, use sunscreen when needed, seek shade during peak hours, and pay attention to the UV index for your area.",
    },
  ];

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h2 className="text-xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
        Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <details key={i} className="group rounded-lg" style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
            <summary
              className="cursor-pointer px-4 py-3 font-semibold text-sm list-none flex items-center justify-between"
              style={{ color: "var(--foreground)" }}
            >
              {faq.question}
              <span className="text-xs ml-2 transition-transform group-open:rotate-180" style={{ color: "var(--text-secondary)" }}>
                ▼
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
