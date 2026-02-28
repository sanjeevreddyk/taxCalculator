import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { calculate, setStep, updateInput } from '../../features/tax/taxSlice';
import { selectCurrentStep, selectLoading, selectTaxInput } from '../../features/tax/taxSelectors';
import { taxFormSchema, type TaxFormSchema } from '../../utils/formSchema';
import { StepFields } from './StepFields';

export const TaxWizard = () => {
  const dispatch = useAppDispatch();
  const input = useAppSelector(selectTaxInput);
  const currentStep = useAppSelector(selectCurrentStep);
  const isLoading = useAppSelector(selectLoading);

  const { register, getValues, handleSubmit, trigger, watch, formState: { errors } } = useForm<TaxFormSchema>({
    resolver: zodResolver(taxFormSchema),
    defaultValues: input,
    shouldUnregister: false
  });

  const onSubmit = (data: TaxFormSchema) => {
    dispatch(updateInput(data));
    dispatch(calculate());
  };

  const stepFields: Record<number, Array<keyof TaxFormSchema | string>> = {
    1: ['personal.name', 'personal.age', 'personal.residentialStatus', 'personal.financialYear'],
    2: ['salary.grossSalary', 'salary.hraExempt', 'salary.professionalTax'],
    3: ['other.housePropertyIncome', 'other.stcg', 'other.ltcg', 'other.businessIncome', 'other.otherIncome'],
    4: ['deductions.section80C', 'deductions.section80CCD1B', 'deductions.section80D', 'deductions.section80E', 'deductions.section80G', 'deductions.section80TTA', 'deductions.section80TTB', 'deductions.housingLoan24b', 'deductions.customDeduction']
  };

  const nextStep = async () => {
    const fields = stepFields[currentStep];
    if (fields) {
      const isValid = await trigger(fields as Array<keyof TaxFormSchema>);
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
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl bg-white p-4 shadow">
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
  );
};
