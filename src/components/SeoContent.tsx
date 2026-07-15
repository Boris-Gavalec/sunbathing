export default function SeoContent() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-12 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
        Understanding Sun Exposure and UV Radiation
      </h2>

      <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
        What is the UV index?
      </h3>
      <p className="mb-3">
        The UV index is an international standard measurement of ultraviolet radiation intensity at the
        Earth&apos;s surface. Developed by the World Health Organization, it ranges from 0 (nighttime) to 11+
        (extreme tropical midday sun). A UV index of 3 or above can cause skin damage with prolonged
        exposure, while values above 8 require active protection even for darker skin types. The UV index
        changes throughout the day, peaking between 10 AM and 4 PM, and varies with season, altitude,
        cloud cover, and latitude.
      </p>

      <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
        How does SPF sunscreen work?
      </h3>
      <p className="mb-3">
        SPF (Sun Protection Factor) measures how much longer sunscreen allows you to stay in the sun
        before burning compared to unprotected skin. SPF 30 means you can theoretically stay out 30
        times longer than without sunscreen. However, SPF only measures protection against UVB rays,
        which cause sunburn. For full-spectrum protection, look for &quot;broad spectrum&quot; sunscreens
        that also block UVA rays. No sunscreen blocks 100% of UV radiation: SPF 15 filters about 93%
        of UVB, SPF 30 filters 97%, and SPF 50 filters 98%. Reapply every two hours and after swimming
        or sweating for consistent protection.
      </p>

      <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
        Fitzpatrick skin types explained
      </h3>
      <p className="mb-3">
        The Fitzpatrick scale classifies skin into six types based on how it responds to UV exposure.
        Type I (very fair skin) burns easily and rarely tans, while Type VI (deeply pigmented skin)
        almost never burns. Your skin type determines your natural tolerance to sun exposure. Someone
        with Type I skin may burn in as little as 10 minutes under strong sun, while Type VI skin
        provides significantly more natural protection. Knowing your skin type helps you estimate how
        long you can safely stay outdoors and how much sunscreen you need.
      </p>

      <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
        Tips for safe sun exposure
      </h3>
      <p className="mb-3">
        Moderate sun exposure is important for vitamin D production, but overexposure causes sunburn,
        premature aging, and increases skin cancer risk. Seek shade during peak UV hours (10 AM to 4 PM),
        wear protective clothing and sunglasses, and apply broad-spectrum sunscreen with at least SPF 30.
        Be especially careful near water, sand, and snow, which reflect UV rays and increase exposure.
        Children and people with fair skin need extra precaution. Use this calculator to estimate your
        safe exposure window, but always err on the side of caution, since individual sensitivity varies
        and this tool provides estimates, not medical advice.
      </p>
    </section>
  );
}
