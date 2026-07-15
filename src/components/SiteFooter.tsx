import Link from "next/link";
import { CALCULATORS, CATEGORIES } from "@/lib/calculators";

/**
 * Site-wide sitemap footer: every calculator, grouped by category, on every
 * page. This is deliberately a full link grid rather than a short list — it is
 * the site's main internal-linking surface, so each page links to each
 * calculator with its real name as the anchor text.
 *
 * Coming-soon entries render as greyed text, not links: the anchor text stays
 * crawlable but we never ship a link to a route that doesn't exist.
 */
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-grid">
          {CATEGORIES.map((category) => (
            <div key={category.id} className="site-footer-col">
              <h2 className="site-footer-heading">{category.label}</h2>
              <ul className="site-footer-list">
                {CALCULATORS.filter((calc) => calc.category === category.id).map((calc) => (
                  <li key={calc.name}>
                    {calc.comingSoon ? (
                      <span className="site-footer-soon">
                        {calc.name}
                        <span className="site-footer-soon-tag">Soon</span>
                      </span>
                    ) : (
                      <Link href={calc.href} className="site-footer-link">
                        {calc.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="site-footer-col">
            <h2 className="site-footer-heading">About</h2>
            <ul className="site-footer-list">
              <li>
                <Link href="/" className="site-footer-link">
                  All Calculators
                </Link>
              </li>
              <li>
                <Link href="/calculator#how-it-works" className="site-footer-link">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/calculator#faq" className="site-footer-link">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="site-footer-bottom">
          <span className="site-footer-brand">CalcSuite</span>
          <span>Free online calculators. No sign-up required.</span>
        </div>
      </div>
    </footer>
  );
}
