import { TaxWizard } from './components/forms/TaxWizard';
import { ResultsCard } from './components/results/ResultsCard';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { useAppSelector } from './hooks/redux';
import { selectResult } from './features/tax/taxSelectors';

function App() {
  const result = useAppSelector(selectResult);

  return (
    <ErrorBoundary>
      <main className="mx-auto min-h-screen max-w-4xl p-4 md:p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold md:text-3xl">Indian Income Tax Regime Comparison</h1>
          <p className="mt-2 text-sm text-slate-600">Compare Old vs New regime for FY 2025-26 with deductions, rebate u/s 87A, surcharge, and cess.</p>
        </header>

        <TaxWizard />
        {result && <ResultsCard result={result} />}

        <section className="mt-8 rounded-xl bg-white p-4 shadow">
          <h2 className="text-lg font-semibold">Old vs New Regime: Quick Guide</h2>
          <p className="mt-2 text-sm text-slate-700">Old regime can be beneficial when you claim high deductions like 80C, 80D, and housing loan interest. New regime offers lower slab rates with fewer deductions and usually helps taxpayers with simpler salary structures.</p>
          <h3 className="mt-4 font-medium">FAQs</h3>
          <ul className="list-disc pl-5 text-sm text-slate-700">
            <li>Includes senior and super senior slab handling.</li>
            <li>Includes surcharge tiers and 4% cess.</li>
            <li>Fully client-side and deployment-ready on Vercel/Netlify.</li>
          </ul>
        </section>
      </main>
    </ErrorBoundary>
  );
}

export default App;
