import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { StepFields } from '../../components/forms/StepFields';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { calculate, setStep, setTaxData, updateInput } from '../tax/taxSlice';
import { selectCurrentStep, selectLoading, selectTaxInput } from '../tax/taxSelectors';
import { manualSchema, type ManualSchema } from './manualSchema';

export const ManualWizard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const input = useAppSelector(selectTaxInput);
  const currentStep = useAppSelector(selectCurrentStep);
  const isLoading = useAppSelector(selectLoading);

  const { register, getValues, handleSubmit, trigger, watch, formState: { errors } } = useForm<ManualSchema>({
    resolver: zodResolver(manualSchema),
    defaultValues: input,
    shouldUnregister: false
  });

  const stepFields: Record<number, Array<keyof ManualSchema | string>> = {
    1: ['personal.name', 'personal.age', 'personal.residentialStatus', 'personal.financialYear'],
    2: ['salary.grossSalary', 'salary.hraExempt', 'salary.professionalTax'],
    3: ['other.housePropertyIncome', 'other.stcg', 'other.ltcg', 'other.businessIncome', 'other.otherIncome'],
    4: ['deductions.section80C', 'deductions.section80CCD1B', 'deductions.section80D', 'deductions.section80E', 'deductions.section80G', 'deductions.section80TTA', 'deductions.section80TTB', 'deductions.housingLoan24b', 'deductions.customDeduction']
  };

  const onSubmit = (data: ManualSchema) => {
    dispatch(setTaxData(data));
    dispatch(setStep(5));
    dispatch(calculate());
    navigate('/results');
  };

  const nextStep = async () => {
    const fields = stepFields[currentStep];
    if (fields) {
      const isValid = await trigger(fields as Array<keyof ManualSchema>);
      if (!isValid) return;
    }
    dispatch(updateInput(getValues()));
    dispatch(setStep(Math.min(currentStep + 1, 5)));
  };

  const previousStep = () => {
    dispatch(updateInput(getValues()));
    dispatch(setStep(Math.max(currentStep - 1, 1)));
  };

  return (
    <section className="mx-auto w-full max-w-3xl rounded-xl bg-white p-4 shadow">
      <div className="mb-4">
        <Link to="/" className="inline-block rounded bg-slate-200 px-3 py-2 text-sm text-slate-800">Back to Home</Link>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4 h-2 rounded-full bg-slate-200">
          <div className="h-2 rounded-full bg-blue-600" style={{ width: `${(currentStep / 5) * 100}%` }} />
        </div>
        <h2 className="mb-3 text-lg font-semibold">Step {currentStep} of 5</h2>
        <StepFields step={currentStep} register={register} errors={errors} age={watch('personal.age')} />
        <div className="mt-5 flex justify-between">
          <button type="button" onClick={previousStep} disabled={currentStep === 1} className="rounded bg-slate-200 px-4 py-2 disabled:opacity-50">Back</button>
          {currentStep < 5 ? (
            <button type="button" onClick={nextStep} className="rounded bg-blue-600 px-4 py-2 text-white">Next</button>
          ) : (
            <button type="submit" className="rounded bg-emerald-600 px-4 py-2 text-white" disabled={isLoading}>{isLoading ? 'Calculating...' : 'Calculate'}</button>
          )}
        </div>
      </form>
    </section>
  );
};
