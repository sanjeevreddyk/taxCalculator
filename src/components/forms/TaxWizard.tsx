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

  const { register, handleSubmit, watch, formState: { errors } } = useForm<TaxFormSchema>({
    resolver: zodResolver(taxFormSchema),
    defaultValues: input
  });

  const onSubmit = (data: TaxFormSchema) => {
    dispatch(updateInput(data));
    dispatch(calculate());
  };

  const nextStep = () => {
    dispatch(updateInput(watch()));
    dispatch(setStep(Math.min(currentStep + 1, 5)));
  };

  const previousStep = () => dispatch(setStep(Math.max(currentStep - 1, 1)));

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
