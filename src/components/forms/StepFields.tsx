import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { TaxFormSchema } from '../../utils/formSchema';

interface Props {
  step: number;
  register: UseFormRegister<TaxFormSchema>;
  errors: FieldErrors<TaxFormSchema>;
  age: number;
}

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 text-xs text-red-600">{message}</p> : null;

export const StepFields = ({ step, register, errors, age }: Props) => {
  return (
    <div>
      <div className={`space-y-3 ${step === 1 ? '' : 'hidden'}`}>
        <div><label>Name</label><input type="text" {...register('personal.name')} /><FieldError message={errors.personal?.name?.message} /></div>
        <div><label>Age</label><input type="number" {...register('personal.age')} /><FieldError message={errors.personal?.age?.message} /></div>
        <div><label>Residential Status</label><select {...register('personal.residentialStatus')}><option value="resident">Resident</option><option value="nri">NRI</option></select></div>
        <div><label>Financial Year</label><select {...register('personal.financialYear')}><option value="FY2025_26">FY 2025-26</option></select></div>
      </div>

      <div className={`space-y-3 ${step === 2 ? '' : 'hidden'}`}>
        <div><label>Gross Salary</label><input type="number" {...register('salary.grossSalary')} /></div>
        <div><label>HRA Exempt Amount</label><input type="number" {...register('salary.hraExempt')} /></div>
        <div><label>Professional Tax</label><input type="number" {...register('salary.professionalTax')} /></div>
        <p className="text-xs text-slate-500">Standard deduction auto applied as per selected regime.</p>
      </div>

      <div className={`space-y-3 ${step === 3 ? '' : 'hidden'}`}>
        <div><label>Income from House Property (Loss allowed)</label><input type="number" {...register('other.housePropertyIncome')} /></div>
        <div><label>STCG</label><input type="number" {...register('other.stcg')} /></div>
        <div><label>LTCG</label><input type="number" {...register('other.ltcg')} /></div>
        <div><label>Business/Profession Income</label><input type="number" {...register('other.businessIncome')} /></div>
        <div><label>Other Income</label><input type="number" {...register('other.otherIncome')} /></div>
      </div>

      <div className={`space-y-3 ${step === 4 ? '' : 'hidden'}`}>
        <div><label>80C</label><input type="number" {...register('deductions.section80C')} /></div>
        <div><label>80CCD(1B)</label><input type="number" {...register('deductions.section80CCD1B')} /></div>
        <div><label>80D</label><input type="number" {...register('deductions.section80D')} /></div>
        <div><label>80E</label><input type="number" {...register('deductions.section80E')} /></div>
        <div><label>80G</label><input type="number" {...register('deductions.section80G')} /></div>
        <div><label>80TTA</label><input type="number" {...register('deductions.section80TTA')} /></div>
        <div><label>80TTB (Senior only)</label><input type="number" disabled={age < 60} {...register('deductions.section80TTB')} /></div>
        <div><label>Housing Loan Interest 24(b)</label><input type="number" {...register('deductions.housingLoan24b')} /></div>
        <div><label>Custom Deduction</label><input type="number" {...register('deductions.customDeduction')} /></div>
      </div>

      <p className={`text-sm text-slate-600 ${step === 5 ? '' : 'hidden'}`}>Review inputs and calculate tax to see recommendation.</p>
    </div>
  );
};
