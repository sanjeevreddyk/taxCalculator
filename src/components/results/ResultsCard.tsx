import { jsPDF } from 'jspdf';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TaxComparisonResult } from '../../types/tax';
import { useAppSelector } from '../../hooks/redux';
import { selectTaxInput } from '../../features/tax/taxSelectors';

export const ResultsCard = ({ result }: { result: TaxComparisonResult }) => {
  const input = useAppSelector(selectTaxInput);
  const customerName = input.personal.name.trim() || 'User';

  const data = [
    { name: 'Old Regime', totalTax: result.oldRegime.totalTax },
    { name: 'New Regime', totalTax: result.newRegime.totalTax }
  ];

  const downloadPdf = () => {
    const pdf = new jsPDF();
    pdf.text('Income Tax Regime Comparison', 10, 15);
    pdf.text(`Name: ${customerName}`, 10, 25);
    pdf.text(`Old Regime Tax: Rs ${result.oldRegime.totalTax}`, 10, 35);
    pdf.text(`New Regime Tax: Rs ${result.newRegime.totalTax}`, 10, 45);
    pdf.text(`Recommended: ${result.recommended}`, 10, 55);
    pdf.text(`Tax Saved: Rs ${result.taxSaved}`, 10, 65);
    pdf.save('tax-comparison.pdf');
  };

  return (
    <section className="mt-6 rounded-xl bg-white p-4 shadow">
      <h2 className="text-xl font-semibold">Comparison Result</h2>
      <p className="mt-1 text-sm text-slate-700">Taxpayer: {customerName}</p>
      <p className="mt-2 rounded bg-emerald-50 p-3 text-emerald-900">You save Rs {result.taxSaved.toLocaleString('en-IN')} by choosing {result.recommended} regime.</p>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded border p-3 text-sm">
          <h3 className="font-semibold">Old Regime</h3>
          <p>Taxable Income: Rs {result.oldRegime.taxableIncome.toLocaleString('en-IN')}</p>
          <p>Tax Before Cess: Rs {result.oldRegime.taxBeforeCess.toLocaleString('en-IN')}</p>
          <p>Surcharge: Rs {result.oldRegime.surcharge.toLocaleString('en-IN')}</p>
          <p>Cess: Rs {result.oldRegime.cess.toLocaleString('en-IN')}</p>
          <p className="font-semibold">Total: Rs {result.oldRegime.totalTax.toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded border p-3 text-sm">
          <h3 className="font-semibold">New Regime</h3>
          <p>Taxable Income: Rs {result.newRegime.taxableIncome.toLocaleString('en-IN')}</p>
          <p>Tax Before Cess: Rs {result.newRegime.taxBeforeCess.toLocaleString('en-IN')}</p>
          <p>Surcharge: Rs {result.newRegime.surcharge.toLocaleString('en-IN')}</p>
          <p>Cess: Rs {result.newRegime.cess.toLocaleString('en-IN')}</p>
          <p className="font-semibold">Total: Rs {result.newRegime.totalTax.toLocaleString('en-IN')}</p>
        </div>
      </div>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalTax" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <button className="mt-4 rounded bg-slate-900 px-4 py-2 text-white" onClick={downloadPdf}>Download as PDF</button>
    </section>
  );
};
