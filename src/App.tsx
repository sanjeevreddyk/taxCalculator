import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { ResultsCard } from './components/results/ResultsCard';
import { UploadForm16 } from './features/form16/UploadForm16';
import { ExtractionPreview } from './features/form16/ExtractionPreview';
import { ManualWizard } from './features/manualEntry/ManualWizard';
import { useAppSelector } from './hooks/redux';
import { selectResult } from './features/tax/taxSelectors';

const Home = () => (
  <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center rounded-xl bg-white p-6 text-center shadow">
    <h2 className="text-2xl font-semibold">Choose Input Method</h2>
    <p className="mt-2 text-sm text-slate-600">Upload your Form 16 securely. Processing happens locally in your browser.</p>
    <div className="mt-8 grid w-full gap-4 sm:grid-cols-2">
      <Link to="/manual" className="rounded-lg bg-blue-600 px-5 py-6 text-center text-lg font-medium text-white shadow hover:bg-blue-700">Manual Entry</Link>
      <Link to="/form16" className="rounded-lg bg-emerald-600 px-5 py-6 text-center text-lg font-medium text-white shadow hover:bg-emerald-700">Import from Form 16</Link>
    </div>
  </section>
);

const ResultsPage = () => {
  const result = useAppSelector(selectResult);

  if (!result) {
    return (
      <section className="mx-auto mt-8 max-w-xl rounded-xl bg-white p-6 text-center shadow">
        <p className="text-slate-700">No comparison available yet. Complete Manual Entry or Form 16 import first.</p>
        <Link to="/" className="mt-4 inline-block rounded bg-slate-900 px-4 py-2 text-white">Go to Home</Link>
      </section>
    );
  }

  return <ResultsCard result={result} />;
};

function App() {
  return (
    <ErrorBoundary>
      <main className="mx-auto min-h-screen max-w-5xl p-4 md:p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold md:text-3xl">Indian Income Tax Regime Comparison</h1>
          <p className="mt-2 text-sm text-slate-600">Compare Old vs New regime for FY 2025-26 with deductions, rebate u/s 87A, surcharge, and cess.</p>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/manual" element={<ManualWizard />} />
          <Route path="/form16" element={<UploadForm16 />} />
          <Route path="/form16/preview" element={<ExtractionPreview />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </ErrorBoundary>
  );
}

export default App;
