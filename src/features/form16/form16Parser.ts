import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = pdfWorker;

export interface RawForm16Data {
  grossSalary: number | null;
  exemptAllowances10: number | null;
  standardDeduction: number | null;
  professionalTax: number | null;
  housePropertyIncome: number | null;
  totalIncome: number | null;
  chapterVIA: number | null;
  section80C: number | null;
  section80CCD1B: number | null;
  section80D: number | null;
  section80G: number | null;
  tdsDeducted: number | null;
  missingFields: string[];
}

const numberPattern = '([+-]?\\d{1,3}(?:,\\d{2,3})*(?:\\.\\d+)?|[+-]?\\d+(?:\\.\\d+)?)';

const parseAmount = (value: string): number => {
  const sanitized = value.replace(/,/g, '');
  const parsed = Number.parseFloat(sanitized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const firstMatchAmount = (text: string, patterns: RegExp[]): number | null => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return parseAmount(match[1]);
  }
  return null;
};

export const parseForm16Text = (text: string): RawForm16Data => {
  const normalizedText = text.replace(/\s+/g, ' ');

  const extracted: Omit<RawForm16Data, 'missingFields'> = {
    grossSalary: firstMatchAmount(normalizedText, [
      new RegExp(`Gross\\s+Salary[^\\d-]*${numberPattern}`, 'i'),
      new RegExp(`Salary\\s+as\\s+per\\s+provisions[^\\d-]*${numberPattern}`, 'i')
    ]),
    exemptAllowances10: firstMatchAmount(normalizedText, [
      new RegExp(`Exempt\\s+Allowances\\s+u\\/?s\\.?\\s*10[^\\d-]*${numberPattern}`, 'i'),
      new RegExp(`Allowances\\s+to\\s+the\\s+extent\\s+exempt[^\\d-]*${numberPattern}`, 'i')
    ]),
    standardDeduction: firstMatchAmount(normalizedText, [
      new RegExp(`Standard\\s+Deduction[^\\d-]*${numberPattern}`, 'i')
    ]),
    professionalTax: firstMatchAmount(normalizedText, [
      new RegExp(`Professional\\s+Tax[^\\d-]*${numberPattern}`, 'i')
    ]),
    housePropertyIncome: firstMatchAmount(normalizedText, [
      new RegExp(`Income\\s+from\\s+House\\s+Property[^\\d-]*${numberPattern}`, 'i')
    ]),
    totalIncome: firstMatchAmount(normalizedText, [
      new RegExp(`Total\\s+Income[^\\d-]*${numberPattern}`, 'i')
    ]),
    chapterVIA: firstMatchAmount(normalizedText, [
      new RegExp(`Chapter\\s+VI-A[^\\d-]*${numberPattern}`, 'i'),
      new RegExp(`Deductions\\s+under\\s+Chapter\\s+VI-A[^\\d-]*${numberPattern}`, 'i')
    ]),
    section80C: firstMatchAmount(normalizedText, [
      new RegExp(`80C[^\\d-]*${numberPattern}`, 'i')
    ]),
    section80CCD1B: firstMatchAmount(normalizedText, [
      new RegExp(`80CCD\\s*\\(\\s*1B\\s*\\)[^\\d-]*${numberPattern}`, 'i'),
      new RegExp(`80CCD1B[^\\d-]*${numberPattern}`, 'i')
    ]),
    section80D: firstMatchAmount(normalizedText, [
      new RegExp(`80D[^\\d-]*${numberPattern}`, 'i')
    ]),
    section80G: firstMatchAmount(normalizedText, [
      new RegExp(`80G[^\\d-]*${numberPattern}`, 'i')
    ]),
    tdsDeducted: firstMatchAmount(normalizedText, [
      new RegExp(`TDS\\s+deducted[^\\d-]*${numberPattern}`, 'i'),
      new RegExp(`Tax\\s+deducted\\s+at\\s+source[^\\d-]*${numberPattern}`, 'i')
    ])
  };

  const missingFields = Object.entries(extracted)
    .filter(([, value]) => value === null)
    .map(([key]) => key);

  return { ...extracted, missingFields };
};

export const extractPdfText = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const pages: string[] = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');
    pages.push(pageText);
  }

  return pages.join(' ');
};

export const parseForm16Pdf = async (file: File): Promise<RawForm16Data> => {
  const text = await extractPdfText(file);
  if (!text.trim()) {
    throw new Error('Unable to read text from PDF.');
  }
  return parseForm16Text(text);
};
