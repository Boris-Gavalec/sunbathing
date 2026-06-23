export default function BmiCalculator() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-xl px-6 py-24 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          BMI Calculator
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Calculate your Body Mass Index based on your height and weight.
        </p>
        <p className="mt-8 text-sm text-zinc-400 dark:text-zinc-500">
          Coming soon.
        </p>
      </main>
    </div>
  );
}
