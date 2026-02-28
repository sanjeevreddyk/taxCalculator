import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import type { RootState } from '../../app/store';
import type { TaxInput } from '../../types/tax';
import { calculate, setStep, setTaxData } from '../tax/taxSlice';
import { clearForm16State, updateNormalizedData } from './form16Slice';

const missingFieldToPath: Record<string, keyof TaxInput | string> = {
  grossSalary: 'salary.grossSalary',
  exemptAllowances10: 'salary.hraExempt',
  professionalTax: 'salary.professionalTax',
  housePropertyIncome: 'other.housePropertyIncome',
  section80C: 'deductions.section80C',
  section80CCD1B: 'deductions.section80CCD1B',
  section80D: 'deductions.section80D',
  section80G: 'deductions.section80G'
};

export const ExtractionPreview = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { normalizedData, rawData, warnings } = useAppSelector((state: RootState) => state.form16);

  const { register, handleSubmit, reset } = useForm<TaxInput>({
    defaultValues: normalizedData ?? undefined,
    shouldUnregister: false
  });

  useEffect(() => {
    if (!normalizedData) {
      navigate('/form16');
      return;
    }
    reset(normalizedData);
  }, [navigate, normalizedData, reset]);

  if (!normalizedData || !rawData) return null;

  const missingSet = new Set(rawData.missingFields.map((field) => missingFieldToPath[field]).filter(Boolean));

  const fieldClass = (path: string) =>
    `w-full rounded border px-3 py-2 ${missingSet.has(path) ? 'border-amber-500 bg-amber-50' : 'border-slate-300'}`;

  const onConfirm = (values: TaxInput) => {
    dispatch(updateNormalizedData(values));
    dispatch(setTaxData(values));
    dispatch(setStep(5));
    dispatch(calculate());
    dispatch(clearForm16State());
    navigate('/results');
  };

  return (
    <section className="mx-auto w-full max-w-3xl rounded-xl bg-white p-6 shadow">
      <h2 className="text-xl font-semibold">Review Extracted Data</h2>
      <p className="mt-2 text-sm text-slate-600">Edit any value before calculating tax comparison.</p>

      {warnings.map((warning) => (
        <p key={warning} className="mt-3 rounded bg-amber-50 p-3 text-sm text-amber-800">{warning}</p>
      ))}

      <form onSubmit={handleSubmit(onConfirm)} className="mt-5 space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm">Name</label>
            <input className={fieldClass('personal.name')} type="text" {...register('personal.name')} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Age</label>
            <input className={fieldClass('personal.age')} type="number" {...register('personal.age', { valueAsNumber: true })} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Gross Salary</label>
            <input className={fieldClass('salary.grossSalary')} type="number" {...register('salary.grossSalary', { valueAsNumber: true })} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Exempt Allowances u/s 10</label>
            <input className={fieldClass('salary.hraExempt')} type="number" {...register('salary.hraExempt', { valueAsNumber: true })} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Professional Tax</label>
            <input className={fieldClass('salary.professionalTax')} type="number" {...register('salary.professionalTax', { valueAsNumber: true })} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Income from House Property</label>
            <input className={fieldClass('other.housePropertyIncome')} type="number" {...register('other.housePropertyIncome', { valueAsNumber: true })} />
          </div>
          <div>
            <label className="mb-1 block text-sm">80C</label>
            <input className={fieldClass('deductions.section80C')} type="number" {...register('deductions.section80C', { valueAsNumber: true })} />
          </div>
          <div>
            <label className="mb-1 block text-sm">80CCD(1B)</label>
            <input className={fieldClass('deductions.section80CCD1B')} type="number" {...register('deductions.section80CCD1B', { valueAsNumber: true })} />
          </div>
          <div>
            <label className="mb-1 block text-sm">80D</label>
            <input className={fieldClass('deductions.section80D')} type="number" {...register('deductions.section80D', { valueAsNumber: true })} />
          </div>
          <div>
            <label className="mb-1 block text-sm">80G</label>
            <input className={fieldClass('deductions.section80G')} type="number" {...register('deductions.section80G', { valueAsNumber: true })} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button type="button" className="rounded bg-slate-200 px-4 py-2" onClick={() => navigate('/form16')}>Back</button>
          <button type="submit" className="rounded bg-emerald-600 px-4 py-2 text-white">Confirm and Calculate</button>
        </div>
      </form>
    </section>
  );
};
