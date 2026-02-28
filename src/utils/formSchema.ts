import { z } from 'zod';

const nonNegative = z.coerce.number().min(0, 'Must be a non-negative value');

export const taxFormSchema = z.object({
  personal: z.object({
    age: z.coerce.number().min(18).max(120),
    residentialStatus: z.enum(['resident', 'nri']),
    financialYear: z.literal('FY2025_26')
  }),
  salary: z.object({
    grossSalary: nonNegative,
    hraExempt: nonNegative,
    professionalTax: nonNegative
  }),
  other: z.object({
    housePropertyIncome: z.coerce.number(),
    stcg: nonNegative,
    ltcg: nonNegative,
    businessIncome: nonNegative,
    otherIncome: nonNegative
  }),
  deductions: z.object({
    section80C: nonNegative,
    section80CCD1B: nonNegative,
    section80D: nonNegative,
    section80E: nonNegative,
    section80G: nonNegative,
    section80TTA: nonNegative,
    section80TTB: nonNegative,
    housingLoan24b: nonNegative,
    customDeduction: nonNegative
  })
});

export type TaxFormSchema = z.infer<typeof taxFormSchema>;
