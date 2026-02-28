import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { parseFailure, parseStart, parseSuccess } from './form16Slice';
import { normalizeForm16Data } from './form16Normalizer';
import { parseForm16Pdf } from './form16Parser';
import type { RootState } from '../../app/store';

const isPdfFile = (file: File): boolean => {
  const mimeOk = file.type === 'application/pdf';
  const extOk = file.name.toLowerCase().endsWith('.pdf');
  return mimeOk || extOk;
};

export const UploadForm16 = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { isParsing, error } = useAppSelector((state: RootState) => state.form16);
  const [isDragging, setIsDragging] = useState(false);

  const resetInput = () => {
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleFile = async (file: File) => {
    if (!isPdfFile(file)) {
      dispatch(parseFailure('Unsupported file. Please upload a PDF Form 16 document.'));
      resetInput();
      return;
    }

    dispatch(parseStart());

    try {
      const rawData = await parseForm16Pdf(file);
      const normalized = normalizeForm16Data(rawData);

      dispatch(parseSuccess({
        rawData,
        normalizedData: normalized.taxInput,
        warnings: normalized.warnings
      }));

      resetInput();
      navigate('/form16/preview');
    } catch {
      dispatch(parseFailure('Some values could not be extracted. Please review before calculation.'));
      resetInput();
    }
  };

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await handleFile(file);
  };

  const onDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    await handleFile(file);
  };

  return (
    <section className="mx-auto w-full max-w-2xl rounded-xl bg-white p-6 shadow">
      <div className="mb-4">
        <Link to="/" className="inline-block rounded bg-slate-200 px-3 py-2 text-sm text-slate-800">Back to Home</Link>
      </div>
      <h2 className="text-xl font-semibold">Import from Form 16</h2>
      <p className="mt-2 text-sm text-slate-600">Upload your Form 16 securely. Processing happens locally in your browser.</p>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`mt-6 rounded-lg border-2 border-dashed p-8 text-center ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300'}`}
      >
        <p className="text-sm text-slate-700">Drag and drop your Form 16 PDF here</p>
        <p className="my-2 text-xs text-slate-500">or</p>
        <label className="inline-block cursor-pointer rounded bg-blue-600 px-4 py-2 text-white">
          Choose PDF
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={onFileChange}
          />
        </label>
      </div>

      {isParsing && <p className="mt-4 text-sm text-blue-700">Parsing Form 16...</p>}
      {error && <p className="mt-4 rounded bg-amber-50 p-3 text-sm text-amber-800">{error}</p>}
    </section>
  );
};
