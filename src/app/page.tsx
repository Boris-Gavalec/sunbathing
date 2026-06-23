import Link from "next/link";

const calculators = [
  { name: "BMI Calculator", href: "/bmi-calculator", description: "Calculate your Body Mass Index" },
  { name: "Tip Calculator", href: "/tip-calculator", description: "Figure out tips and split bills" },
  { name: "Unit Converter", href: "/unit-converter", description: "Convert between common units" },
];

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-2xl px-6 py-24 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Calculators
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Pick a tool to get started.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {calculators.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="rounded-lg border border-zinc-200 p-6 text-left transition-colors hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
            >
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">{calc.name}</h2>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{calc.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
